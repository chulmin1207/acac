/**
 * Generated image from Gemini Image API
 */
export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  variant: number; // 1, 2, or 3
  createdAt: string;
}

/**
 * Channel-specific creative with adapted images
 */
export interface ChannelCreative {
  channelId: string;
  channelName: string;
  images: {
    size: string;
    url: string;
    width: number;
    height: number;
  }[];
}

/**
 * Complete creative project
 */
export interface Creative {
  id: string;
  briefId: string;
  serviceId: string;
  userInput: string;
  referenceImages: string[]; // URLs
  baseImageId: string; // Selected image from Step 4
  channelCreatives: ChannelCreative[];
  status: 'draft' | 'generating' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
}
