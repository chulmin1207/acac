import { NextRequest, NextResponse } from 'next/server';
import { updateBriefContent } from '@/lib/ai/claude';

/**
 * PATCH /api/brief/update - Update brief with user modifications
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { brief, updates } = body;

    if (!brief || !updates) {
      return NextResponse.json(
        { error: 'Brief and updates are required' },
        { status: 400 }
      );
    }

    // Update brief
    const updatedBrief = await updateBriefContent(brief, updates);

    return NextResponse.json({
      success: true,
      brief: updatedBrief,
    });
  } catch (error) {
    console.error('Brief update error:', error);
    return NextResponse.json(
      { error: 'Failed to update brief' },
      { status: 500 }
      );
  }
}
