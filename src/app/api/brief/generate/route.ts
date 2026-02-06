import { NextRequest, NextResponse } from 'next/server';
import { generateBrief } from '@/lib/ai/claude';
import { getServiceById } from '@/lib/db/services';

/**
 * POST /api/brief/generate - Generate creative brief with Claude
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { serviceId, userInput, referenceAnalysis } = body;

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

    // Get service details
    const service = await getServiceById(serviceId);
    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    // Generate brief
    const brief = await generateBrief(service, userInput, referenceAnalysis || null);

    return NextResponse.json({
      success: true,
      brief,
    });
  } catch (error) {
    console.error('Brief generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate brief' },
      { status: 500 }
    );
  }
}
