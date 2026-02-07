import { NextRequest, NextResponse } from 'next/server';
import { generateBrief } from '@/lib/ai/claude';
import { getServiceById } from '@/lib/db/services';

/**
 * POST /api/brief/generate - Generate creative brief with Claude
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { serviceId, userInput, referenceAnalysis, targetPlatform } = body;

    if (!serviceId) {
      return NextResponse.json(
        { error: 'Service ID is required' },
        { status: 400 }
      );
    }

    if (!userInput) {
      return NextResponse.json(
        { error: 'User input is required' },
        { status: 400 }
      );
    }

    // Validate targetPlatform
    const platform = targetPlatform || 'meta';
    if (!['naver', 'meta', 'youtube'].includes(platform)) {
      return NextResponse.json(
        { error: 'Invalid target platform. Must be naver, meta, or youtube' },
        { status: 400 }
      );
    }

    // Get service details
    const service = await getServiceById(serviceId);
    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    // Generate brief with hook-based optimization
    const brief = await generateBrief(
      service,
      userInput,
      referenceAnalysis || null,
      platform as 'naver' | 'meta' | 'youtube'
    );

    return NextResponse.json({
      success: true,
      brief,
      platform,
    });
  } catch (error) {
    console.error('Brief generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate brief' },
      { status: 500 }
    );
  }
}
