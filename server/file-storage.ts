import multer from 'multer';
import { Request } from 'express';
import fs from 'fs';
import path from 'path';

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

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
    // Generate unique file ID
    const timestamp = Date.now();
    const fileId = `${applicationToken}/${timestamp}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    
    // Upload to object storage
    const result = await objectStorage.put(fileId, file.buffer, {
      'Content-Type': file.mimetype,
      'X-Original-Name': file.originalname,
      'X-Uploaded-At': new Date().toISOString(),
      'X-Application-Token': applicationToken,
      'X-File-Size': file.size.toString()
    });
    
    if (!result.success) {
      throw new Error('Failed to upload to object storage');
    }
    
    // Generate public URL
    const url = `${process.env.REPLIT_DOMAIN || 'https://localhost:5000'}/api/files/${fileId}`;
    
    return { fileId, url };
  } catch (error) {
    console.error('File upload error:', error);
    throw new Error('Failed to upload file');
  }
}

/**
 * Get download URL for a file
 */
export async function getFileUrl(fileId: string): Promise<string> {
  try {
    return await objectStorage.getDownloadUrl(fileId);
  } catch (error) {
    console.error('Get file URL error:', error);
    throw new Error('Failed to get file URL');
  }
}

/**
 * Delete a file from storage
 */
export async function deleteFile(fileId: string): Promise<void> {
  try {
    await objectStorage.delete(fileId);
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
    const files = await objectStorage.list({ prefix: `${applicationToken}/` });
    return files.map(file => file.key);
  } catch (error) {
    console.error('List files error:', error);
    return [];
  }
}