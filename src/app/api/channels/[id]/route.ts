import { NextRequest, NextResponse } from 'next/server';
import { getChannelById, updateChannel, deleteChannel } from '@/lib/db/channels';

/**
 * GET /api/channels/:id - Get channel by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const channel = await getChannelById(params.id);

    if (!channel) {
      return NextResponse.json(
        { error: 'Channel not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(channel);
  } catch (error) {
    console.error(`GET /api/channels/${params.id} error:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch channel' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/channels/:id - Update channel
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const channel = await updateChannel(params.id, body);

    if (!channel) {
      return NextResponse.json(
        { error: 'Channel not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(channel);
  } catch (error) {
    console.error(`PATCH /api/channels/${params.id} error:`, error);
    return NextResponse.json(
      { error: 'Failed to update channel' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/channels/:id - Delete channel
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = await deleteChannel(params.id);

    if (!success) {
      return NextResponse.json(
        { error: 'Channel not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`DELETE /api/channels/${params.id} error:`, error);
    return NextResponse.json(
      { error: 'Failed to delete channel' },
      { status: 500 }
    );
  }
}
