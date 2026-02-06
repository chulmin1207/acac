import { NextRequest, NextResponse } from 'next/server';
import { getCreativeById } from '@/lib/db/history';
import { generateCreativeZip } from '@/lib/utils/zip-generator';

/**
 * GET /api/creative/download-zip - Download all images as ZIP
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const creativeId = searchParams.get('creativeId');

    if (!creativeId) {
      return NextResponse.json(
        { error: 'Creative ID is required' },
        { status: 400 }
      );
    }

    // Get creative from history
    const creative = await getCreativeById(creativeId);
    if (!creative) {
      return NextResponse.json(
        { error: 'Creative not found' },
        { status: 404 }
      );
    }

    // Generate ZIP archive
    const stream = await generateCreativeZip(creative);

    // Return ZIP file
    return new NextResponse(stream, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="creative-${creativeId}.zip"`,
      },
    });
  } catch (error) {
    console.error('ZIP download error:', error);
    return NextResponse.json(
      { error: 'Failed to create ZIP' },
      { status: 500 }
    );
  }
}
