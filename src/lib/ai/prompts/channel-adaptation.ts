/**
 * Prompt for adapting images to specific channel requirements using outpainting
 */
export function getChannelAdaptationPrompt(
  channelName: string,
  targetWidth: number,
  targetHeight: number,
  layoutConfig: {
    textPosition: string;
    textAlign: string;
    ctaPosition: string;
    backgroundExpand: boolean;
    productReposition: boolean;
  }
): string {
  const aspectRatio = (targetWidth / targetHeight).toFixed(2);
  const orientation =
    targetWidth > targetHeight
      ? 'landscape'
      : targetWidth < targetHeight
      ? 'portrait'
      : 'square';

  return `You are adapting an existing advertisement image for ${channelName} channel specifications.

Target Specifications:
- Channel: ${channelName}
- Dimensions: ${targetWidth}x${targetHeight}px
- Aspect Ratio: ${aspectRatio}:1 (${orientation})

Layout Configuration:
- Text Position: ${layoutConfig.textPosition}
- Text Alignment: ${layoutConfig.textAlign}
- CTA Position: ${layoutConfig.ctaPosition}
- Background Expand: ${layoutConfig.backgroundExpand ? 'Yes' : 'No'}
- Product Reposition: ${layoutConfig.productReposition ? 'Yes' : 'No'}

**ADAPTATION INSTRUCTIONS:**

1. **Aspect Ratio Adjustment:**
   ${
     layoutConfig.backgroundExpand
       ? `- Extend the background naturally to fit ${aspectRatio}:1 ratio
   - Maintain background style and color consistency
   - No stretching or distortion`
       : `- Crop intelligently to fit ${aspectRatio}:1 ratio
   - Preserve key elements`
   }

2. **Text Repositioning:**
   - Move headline to: ${layoutConfig.textPosition}
   - Align text: ${layoutConfig.textAlign}
   - Ensure text remains legible and prominent
   - Adjust text size if necessary for the new dimensions

3. **CTA Button:**
   - Position at: ${layoutConfig.ctaPosition}
   - Maintain visibility and accessibility
   - Ensure proper contrast

4. **Product/Subject:**
   ${
     layoutConfig.productReposition
       ? `- Reposition product to optimize for ${orientation} layout
   - Maintain product prominence
   - Ensure product is not cut off`
       : `- Keep product in original position
   - Ensure product is fully visible`
   }

5. **Quality Maintenance:**
   - Preserve image quality (no pixelation)
   - Maintain color accuracy
   - Keep text sharp and readable
   - Ensure professional appearance

6. **Channel-Specific Optimization:**
   ${getChannelSpecificGuidance(channelName)}

**OUTPUT REQUIREMENTS:**
- Exact dimensions: ${targetWidth}x${targetHeight}px
- High quality, suitable for digital advertising
- All Korean text must be clear and legible
- Professional, polished appearance
- Optimized for ${channelName} platform viewing

Generate the adapted image maintaining the original creative intent while optimizing for the channel specifications.`;
}

function getChannelSpecificGuidance(channelName: string): string {
  const guidance: Record<string, string> = {
    'naver': `- Optimize for Naver GFA display
   - Ensure visibility on both desktop and mobile
   - High contrast for feed visibility`,
    'meta': `- Optimize for Facebook/Instagram feed
   - Mobile-first design approach
   - Thumb-stopping visual appeal`,
    'google': `- Optimize for Google Ads display network
   - Clear value proposition
   - Professional, trustworthy appearance`,
    'kakao': `- Optimize for KakaoTalk feed
   - Friendly, approachable tone
   - Mobile-optimized layout`,
  };

  const platformKey = channelName.toLowerCase().split(' ')[0];
  return guidance[platformKey] || '- Optimize for maximum impact and clarity';
}
