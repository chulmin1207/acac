import { IncomingForm, File as FormidableFile } from 'formidable';
import { promises as fs } from 'fs';
import path from 'path';
import type { NextRequest } from 'next/server';

export interface UploadedFile {
  filename: string;
  filepath: string;
  url: string;
  mimetype: string;
  size: number;
}

/**
 * Parse multipart form data from Next.js request
 */
export async function parseFormData(
  request: NextRequest
): Promise<{ fields: any; files: FormidableFile[] }> {
  // Note: This is a simplified version
  // In production, you might need to use a different approach
  // since Next.js 13+ App Router handles FormData differently

  const formData = await request.formData();
  const files: FormidableFile[] = [];
  const fields: any = {};

  formData.forEach((value, key) => {
    if (value instanceof File) {
      files.push(value as any);
    } else {
      fields[key] = value;
    }
  });

  return { fields, files };
}

/**
 * Save uploaded file to public directory
 */
export async function saveUploadedFile(
  file: File,
  userId: string
): Promise<UploadedFile> {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', userId);

  // Ensure upload directory exists
  await fs.mkdir(uploadDir, { recursive: true });

  // Generate unique filename
  const timestamp = Date.now();
  const sanitized = sanitizeFilename(file.name);
  const filename = `${timestamp}-${sanitized}`;
  const filepath = path.join(uploadDir, filename);

  // Convert File to Buffer and save
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filepath, buffer);

  return {
    filename,
    filepath,
    url: `/uploads/${userId}/${filename}`,
    mimetype: file.type,
    size: file.size,
  };
}

/**
 * Sanitize filename to prevent path traversal and other issues
 */
export function sanitizeFilename(filename: string): string {
  // Remove path components
  const baseName = path.basename(filename);

  // Replace special characters
  return baseName
    .replace(/[^a-zA-Z0-9가-힣.-]/g, '_')
    .replace(/_{2,}/g, '_')
    .toLowerCase();
}

/**
 * Validate uploaded file
 */
export function validateFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

  if (file.size > maxSize) {
    return { valid: false, error: 'File size exceeds 10MB limit' };
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed' };
  }

  return { valid: true };
}
