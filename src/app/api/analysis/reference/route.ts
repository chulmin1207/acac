import { NextRequest, NextResponse } from 'next/server';
import { analyzeReferenceImages } from '@/lib/ai/gemini';

/**
 * POST /api/analysis/reference - Analyze reference images with Gemini
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageUrls, userInput } = body;

    if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
      return NextResponse.json(
        { error: 'Image URLs are required' },
        { status: 400 }
      );
    }

    if (!userInput || typeof userInput !== 'string') {
      return NextResponse.json(
        { error: 'User input is required' },
        { status: 400 }
      );
    }

    // Analyze reference images
    const analysis = await analyzeReferenceImages(imageUrls, userInput);

    return NextResponse.json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error('Reference analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze reference images' },
      { status: 500 }
    );
  }
}
