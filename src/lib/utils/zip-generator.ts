import archiver from 'archiver';
import { Readable } from 'stream';
import type { Creative } from '@/types';

/**
 * Generate a ZIP archive from creative images
 */
export async function generateCreativeZip(creative: Creative): Promise<ReadableStream> {
  const archive = archiver('zip', {
    zlib: { level: 9 }, // Maximum compression
  });

  // Add files to archive with folder structure
  for (const channelCreative of creative.channelCreatives) {
    const folderName = sanitizeFolderName(channelCreative.channelName);

    for (const image of channelCreative.images) {
      const fileName = `${image.size}_${image.width}x${image.height}.png`;
      const filePath = `${folderName}/${fileName}`;

      // For placeholder images, add dummy data
      if (image.url.startsWith('/api/placeholder/')) {
        archive.append('Placeholder image data', {
          name: filePath,
        });
      } else {
        // For real images, would read from filesystem
        // For now, add placeholder
        archive.append('Image data', {
          name: filePath,
        });
      }
    }
  }

  // Finalize archive
  await archive.finalize();

  // Convert to web stream
  const stream = Readable.toWeb(archive) as ReadableStream;
  return stream;
}

/**
 * Sanitize folder name for safe file system paths
 */
function sanitizeFolderName(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9가-힣\s-]/g, '')
    .replace(/\s+/g, '_')
    .trim();
}
