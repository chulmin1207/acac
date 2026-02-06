import sharp from 'sharp';
import path from 'path';
import { promises as fs } from 'fs';

export interface ImageMetadata {
  width: number;
  height: number;
  format: string;
  size: number;
}

/**
 * Optimize image (compress and resize if needed)
 */
export async function optimizeImage(
  inputPath: string,
  maxWidth: number = 2000,
  quality: number = 85
): Promise<Buffer> {
  const image = sharp(inputPath);
  const metadata = await image.metadata();

  let pipeline = image;

  // Resize if too large
  if (metadata.width && metadata.width > maxWidth) {
    pipeline = pipeline.resize(maxWidth, null, {
      withoutEnlargement: true,
      fit: 'inside',
    });
  }

  // Convert to JPEG and compress
  pipeline = pipeline.jpeg({ quality, progressive: true });

  return await pipeline.toBuffer();
}

/**
 * Get image metadata
 */
export async function getImageMetadata(filePath: string): Promise<ImageMetadata> {
  const image = sharp(filePath);
  const metadata = await image.metadata();
  const stats = await fs.stat(filePath);

  return {
    width: metadata.width || 0,
    height: metadata.height || 0,
    format: metadata.format || 'unknown',
    size: stats.size,
  };
}

/**
 * Resize image to specific dimensions
 */
export async function resizeImage(
  inputPath: string,
  width: number,
  height: number,
  fit: 'cover' | 'contain' | 'fill' = 'cover'
): Promise<Buffer> {
  return await sharp(inputPath)
    .resize(width, height, {
      fit,
      position: 'center',
    })
    .jpeg({ quality: 90, progressive: true })
    .toBuffer();
}

/**
 * Create thumbnail
 */
export async function createThumbnail(
  inputPath: string,
  size: number = 200
): Promise<Buffer> {
  return await sharp(inputPath)
    .resize(size, size, {
      fit: 'cover',
      position: 'center',
    })
    .jpeg({ quality: 80 })
    .toBuffer();
}

/**
 * Convert image to specific format
 */
export async function convertImage(
  inputPath: string,
  format: 'jpeg' | 'png' | 'webp',
  quality: number = 90
): Promise<Buffer> {
  const image = sharp(inputPath);

  switch (format) {
    case 'jpeg':
      return await image.jpeg({ quality, progressive: true }).toBuffer();
    case 'png':
      return await image.png({ quality }).toBuffer();
    case 'webp':
      return await image.webp({ quality }).toBuffer();
    default:
      throw new Error(`Unsupported format: ${format}`);
  }
}
