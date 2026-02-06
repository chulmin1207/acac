import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getChannelById } from '@/lib/db/channels';
import { adaptImageForChannel } from '@/lib/ai/gemini';
import { saveCreativeHistory } from '@/lib/db/history';
import type { Creative, ChannelCreative } from '@/types';

/**
 * POST /api/creative/adapt - Adapt image for selected channels
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      serviceId,
      briefId,
      userInput,
      referenceImages,
      baseImage,
      channelIds
    } = body;

    if (!baseImage || !channelIds || channelIds.length === 0) {
      return NextResponse.json(
        { error: 'Base image and channel IDs are required' },
        { status: 400 }
      );
    }

    // Create creative object
    const creativeId = uuidv4();
    const channelCreatives: ChannelCreative[] = [];

    // Process each channel
    for (const channelId of channelIds) {
      const channel = await getChannelById(channelId);
      if (!channel) {
        console.warn(`Channel ${channelId} not found, skipping`);
        continue;
      }

      const images = [];

      // Generate image for each size in the channel
      for (let i = 0; i < channel.sizes.length; i++) {
        const size = channel.sizes[i];

        try {
          // Adapt image using Gemini (or use placeholder for now)
          const adaptedUrl = await adaptImageForChannel(
            baseImage.url,
            channel.name,
            size.width,
            size.height,
            channel.layoutConfig
          );

          images.push({
            size: size.label,
            url: adaptedUrl || `/api/placeholder/${channelId}-${i}.png`,
            width: size.width,
            height: size.height,
          });
        } catch (error) {
          console.error(`Failed to adapt for ${channel.name} - ${size.label}:`, error);
          // Use placeholder on error
          images.push({
            size: size.label,
            url: `/api/placeholder/${channelId}-${i}.png`,
            width: size.width,
            height: size.height,
          });
        }
      }

      channelCreatives.push({
        channelId: channel.id,
        channelName: channel.name,
        images,
      });
    }

    // Create final creative object
    const creative: Creative = {
      id: creativeId,
      briefId: briefId || '',
      serviceId: serviceId || '',
      userInput: userInput || '',
      referenceImages: referenceImages || [],
      baseImageId: baseImage.id,
      channelCreatives,
      status: 'completed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save to history
    await saveCreativeHistory(creative);

    return NextResponse.json({
      success: true,
      creative,
    });
  } catch (error) {
    console.error('Creative adaptation error:', error);
    return NextResponse.json(
      { error: 'Failed to adapt creative' },
      { status: 500 }
    );
  }
}
