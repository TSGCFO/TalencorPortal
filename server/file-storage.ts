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
 * Upload a file to local storage
 */
export async function uploadFile(
  file: Express.Multer.File,
  applicationToken: string
): Promise<{ fileId: string; url: string }> {
  try {
    // Create token-specific directory
    const tokenDir = path.join(uploadsDir, applicationToken);
    if (!fs.existsSync(tokenDir)) {
      fs.mkdirSync(tokenDir, { recursive: true });
    }
    
    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedFilename = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${timestamp}-${sanitizedFilename}`;
    const filepath = path.join(tokenDir, filename);
    
    // Save file to disk
    fs.writeFileSync(filepath, file.buffer);
    
    const fileId = `${applicationToken}/${filename}`;
    const url = `/api/files/${fileId}`;
    
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
  return `/api/files/${fileId}`;
}

/**
 * Delete a file from storage
 */
export async function deleteFile(fileId: string): Promise<void> {
  try {
    const filepath = path.join(uploadsDir, fileId);
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }
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
    const tokenDir = path.join(uploadsDir, applicationToken);
    if (!fs.existsSync(tokenDir)) {
      return [];
    }
    const files = fs.readdirSync(tokenDir);
    return files.map(file => `${applicationToken}/${file}`);
  } catch (error) {
    console.error('List files error:', error);
    return [];
  }
}