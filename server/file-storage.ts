import multer from 'multer';
import { Request } from 'express';

// Import Replit Object Storage
import { Client } from '@replit/object-storage';
const client = new Client();

// Configure multer for file uploads
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Check file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/jpg',
      'image/png'
    ];
    
    const allowedExtensions = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'];
    const fileExtension = '.' + file.originalname.split('.').pop()?.toLowerCase();
    
    if (allowedTypes.includes(file.mimetype) && allowedExtensions.includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, DOCX, JPG, and PNG files are allowed.'));
    }
  }
});

/**
 * Upload a file to Replit Object Storage
 */
export async function uploadFile(
  file: Express.Multer.File,
  applicationToken: string
): Promise<{ fileId: string; url: string }> {
  try {
    // Generate unique file key
    const timestamp = Date.now();
    const sanitizedFilename = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileKey = `applications/${applicationToken}/${timestamp}-${sanitizedFilename}`;
    
    // Upload file to Replit Object Storage
    await client.uploadFromBytes(fileKey, file.buffer);
    
    console.log('File uploaded successfully to Replit Object Storage:', fileKey);
    
    return { 
      fileId: fileKey, 
      url: `/api/files/${fileKey}`
    };
  } catch (error) {
    console.error('Replit Object Storage upload error:', error);
    throw new Error('Failed to upload file to object storage');
  }
}

/**
 * Get download URL for a file
 */
export async function getFileUrl(fileId: string): Promise<string> {
  return `/api/files/${fileId}`;
}

/**
 * Get file from Replit Object Storage
 */
export async function getFile(fileId: string): Promise<Buffer | null> {
  try {
    const data = await client.downloadAsBytes(fileId);
    console.log('Downloaded data type:', typeof data);
    console.log('Downloaded data keys:', Object.keys(data));
    
    // Handle the Replit Object Storage response format
    if (typeof data === 'object' && data !== null && 'ok' in data && 'value' in data) {
      if (data.ok && data.value) {
        // The value contains the buffer
        if (Array.isArray(data.value) && data.value[0]) {
          return Buffer.from(data.value[0]);
        } else if (Buffer.isBuffer(data.value)) {
          return data.value;
        }
      }
      return null;
    }
    
    // Handle other return types from downloadAsBytes
    if (Buffer.isBuffer(data)) {
      return data;
    } else if (data instanceof Uint8Array) {
      return Buffer.from(data);
    } else if (Array.isArray(data)) {
      return Buffer.from(data);
    } else if (typeof data === 'object' && data !== null) {
      // Check if it's an object with binary data
      if ('data' in data && Array.isArray(data.data)) {
        return Buffer.from(data.data);
      } else if ('buffer' in data && data.buffer) {
        return Buffer.from(data.buffer as any);
      } else {
        console.error('Unexpected object structure:', data);
        return null;
      }
    } else {
      console.error('Unexpected data type from downloadAsBytes:', typeof data);
      return null;
    }
  } catch (error) {
    console.error('File retrieval error:', error);
    return null;
  }
}

/**
 * Delete a file from storage
 */
export async function deleteFile(fileId: string): Promise<void> {
  try {
    await client.delete(fileId);
    console.log('File deleted successfully:', fileId);
  } catch (error) {
    console.error('File deletion error:', error);
    throw new Error('Failed to delete file');
  }
}

/**
 * List files for an application
 */
export async function listApplicationFiles(applicationToken: string): Promise<string[]> {
  try {
    // For now, return empty array as this function is not being used
    // The actual file tracking is done through the uploadedDocuments field in the database
    return [];
  } catch (error) {
    console.error('List files error:', error);
    return [];
  }
}