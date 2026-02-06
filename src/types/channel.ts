/**
 * Channel size configuration
 */
export interface ChannelSize {
  width: number;
  height: number;
  label: string;
  aspectRatio: string;
}

/**
 * Layout configuration for channel-specific adaptations
 */
export interface LayoutConfig {
  textPosition: 'top' | 'center' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  textAlign: 'left' | 'center' | 'right';
  ctaPosition: 'top-center' | 'top-right' | 'center' | 'bottom-center' | 'bottom-right' | 'bottom-left';
  backgroundExpand: boolean;
  productReposition: boolean;
}

/**
 * Channel interface - represents advertising channels (e.g., Naver, Meta, Google, Kakao)
 */
export interface Channel {
  id: string;
  name: string;
  platform: 'naver' | 'meta' | 'google' | 'kakao';
  sizes: ChannelSize[];
  layoutConfig: LayoutConfig;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
