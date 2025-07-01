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
    await client.uploadFromBuffer(fileKey, file.buffer);
    
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
    return Buffer.from(data);
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
    const files = await client.list(`applications/${applicationToken}/`);
    return files.map((file: any) => file.key || file);
  } catch (error) {
    console.error('List files error:', error);
    return [];
  }
}