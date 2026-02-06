import { NextRequest, NextResponse } from 'next/server';
import { saveUploadedFile, validateFile } from '@/lib/utils/file-upload';

/**
 * POST /api/upload - Upload reference images
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    // Validate files
    for (const file of files) {
      const validation = validateFile(file);
      if (!validation.valid) {
        return NextResponse.json(
          { error: validation.error },
          { status: 400 }
        );
      }
    }

    // For now, use a placeholder user ID
    // In production, get this from session
    const userId = 'demo-user';

    // Save files
    const uploadedFiles = await Promise.all(
      files.map((file) => saveUploadedFile(file, userId))
    );

    return NextResponse.json({
      success: true,
      files: uploadedFiles.map(f => ({
        filename: f.filename,
        url: f.url,
        size: f.size,
      })),
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload files' },
      { status: 500 }
    );
  }
}
