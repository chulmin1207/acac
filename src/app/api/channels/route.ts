import { NextRequest, NextResponse } from 'next/server';
import { getChannels, createChannel } from '@/lib/db/channels';

/**
 * GET /api/channels - Get all channels
 */
export async function GET() {
  try {
    const channels = await getChannels();
    return NextResponse.json(channels);
  } catch (error) {
    console.error('GET /api/channels error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch channels' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/channels - Create a new channel
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const channel = await createChannel({
      name: body.name,
      platform: body.platform,
      sizes: body.sizes || [],
      layoutConfig: body.layoutConfig,
      isActive: body.isActive ?? true,
    });

    return NextResponse.json(channel, { status: 201 });
  } catch (error) {
    console.error('POST /api/channels error:', error);
    return NextResponse.json(
      { error: 'Failed to create channel' },
      { status: 500 }
    );
  }
}
