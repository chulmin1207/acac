import { NextRequest, NextResponse } from 'next/server';
import { generateCreativeImage } from '@/lib/ai/gemini';

/**
 * POST /api/image/regenerate - Regenerate 3 new images
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { brief, referenceAnalysis } = body;

    if (!brief) {
      return NextResponse.json(
        { error: 'Brief is required' },
        { status: 400 }
      );
    }

    // Generate 3 new images in parallel
    const imagePromises = [1, 2, 3].map((variant) =>
      generateCreativeImage(
        {
          headline: brief.headline,
          subHeadline: brief.subHeadline,
          keyMessages: brief.keyMessages,
          visualDirection: brief.visualDirection,
          toneAndManner: brief.toneAndManner,
        },
        referenceAnalysis || null,
        variant
      )
    );

    const images = await Promise.all(imagePromises);

    return NextResponse.json({
      success: true,
      images,
    });
  } catch (error) {
    console.error('Image regeneration error:', error);
    return NextResponse.json(
      { error: 'Failed to regenerate images' },
      { status: 500 }
    );
  }
}
