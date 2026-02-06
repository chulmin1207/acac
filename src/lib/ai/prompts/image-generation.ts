import type { ReferenceAnalysis } from '@/types';

/**
 * Prompt for generating creative images with Gemini Imagen
 */
export function getImageGenerationPrompt(
  briefContent: {
    headline: string;
    subHeadline: string;
    keyMessages: string[];
    visualDirection: string;
    toneAndManner: string;
  },
  referenceAnalysis: ReferenceAnalysis | null,
  variant: number
): string {
  const referenceGuidance = referenceAnalysis
    ? `
레퍼런스 스타일 가이드:
- 레이아웃: ${referenceAnalysis.layout}
- 텍스트 배치: ${referenceAnalysis.textPlacement}
- 오브제 위치: ${referenceAnalysis.objectPositions}
- 톤앤매너: ${referenceAnalysis.toneAndManner}
- 배경: ${referenceAnalysis.background}
- 폰트: ${referenceAnalysis.fonts}
- 구성 비율: ${referenceAnalysis.compositionRatio}
`
    : '';

  const variantGuidance = [
    '첫 번째 버전: 가장 직관적이고 명확한 표현',
    '두 번째 버전: 창의적이고 독특한 시각적 접근',
    '세 번째 버전: 감성적이고 스토리가 있는 구성',
  ][variant - 1] || '균형잡힌 표현';

  return `You are a professional advertising creative director creating a high-quality advertisement image.

Creative Brief:
- Headline: ${briefContent.headline}
- Sub-headline: ${briefContent.subHeadline}
- Key Messages: ${briefContent.keyMessages.join(', ')}
- Visual Direction: ${briefContent.visualDirection}
- Tone & Manner: ${briefContent.toneAndManner}

${referenceGuidance}

Variant Guide (${variant}/3):
${variantGuidance}

Create a professional advertisement image with these requirements:

**CRITICAL REQUIREMENTS:**
1. **Korean Text Rendering:**
   - All text must be clearly legible in Korean
   - Use clean, professional sans-serif fonts
   - Headline: Bold, large, high contrast (헤드라인: ${briefContent.headline})
   - Sub-headline: Medium weight, readable (서브카피: ${briefContent.subHeadline})
   - Text must be sharp and well-kerned

2. **Composition:**
   - Professional advertising layout
   - Clear visual hierarchy
   - Balanced composition with proper spacing
   - Product/subject should be prominent

3. **Quality Standards:**
   - High resolution, professional grade
   - Proper lighting and color balance
   - No distortion or artifacts
   - Clean, polished look

4. **Brand Consistency:**
   - Follow the tone and manner specified
   - Align with visual direction
   - Maintain professional standards

5. **Technical Specs:**
   - Square aspect ratio (1:1) optimized
   - RGB color space
   - High contrast for digital display
   - Suitable for resizing to various dimensions

**Style Direction:**
${briefContent.visualDirection}

**Tone:**
${briefContent.toneAndManner}

Generate a professional, high-quality advertisement image that effectively communicates the message and appeals to Korean consumers.`;
}
