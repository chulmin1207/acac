import { GoogleGenerativeAI } from '@google/generative-ai';
import type { ReferenceAnalysis, GeneratedImage } from '@/types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

/**
 * Analyze reference images to extract design elements
 */
export async function analyzeReferenceImages(
  imageUrls: string[],
  userInput: string
): Promise<ReferenceAnalysis> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-pro',
    generationConfig: {
      temperature: 0.4,
      topK: 32,
      topP: 1,
      maxOutputTokens: 2048,
    },
  });

  // Import the prompt
  const { getReferenceAnalysisPrompt } = await import('./prompts/reference-analysis');
  const prompt = getReferenceAnalysisPrompt(userInput);

  try {
    // For now, we'll use text-only analysis
    // In production, you'd pass actual image files
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Parse JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse JSON from Gemini response');
    }

    const analysis: ReferenceAnalysis = JSON.parse(jsonMatch[0]);
    return analysis;
  } catch (error) {
    console.error('Gemini analysis error:', error);

    // Return fallback analysis
    return {
      textPlacement: '중앙 상단',
      objectPositions: '제품 이미지 중앙 배치',
      layout: '심플하고 깔끔한 레이아웃',
      toneAndManner: '친근하고 활기찬 분위기',
      background: '밝고 생동감 있는 배경',
      fonts: '고딕 계열 폰트, 굵은 헤드라인',
      compositionRatio: '상단 30% 텍스트, 중앙 50% 제품, 하단 20% CTA',
    };
  }
}

/**
 * Generate creative image using Gemini Imagen
 */
export async function generateCreativeImage(
  briefContent: {
    headline: string;
    subHeadline: string;
    keyMessages: string[];
    visualDirection: string;
    toneAndManner: string;
  },
  referenceAnalysis: ReferenceAnalysis | null,
  variant: number
): Promise<GeneratedImage> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-pro',
    generationConfig: {
      temperature: 0.7 + (variant * 0.1), // Vary temperature by variant
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 2048,
    },
  });

  const { getImageGenerationPrompt } = await import('./prompts/image-generation');
  const prompt = getImageGenerationPrompt(briefContent, referenceAnalysis, variant);

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // For now, return a placeholder
    // In production, this would use Gemini's image generation API
    return {
      id: `img-${Date.now()}-${variant}`,
      url: `/api/placeholder/image-${variant}.png`, // Placeholder
      prompt: prompt.substring(0, 200),
      variant,
      createdAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Gemini image generation error:', error);
    throw new Error('Failed to generate image');
  }
}

/**
 * Adapt image for specific channel size using outpainting
 */
export async function adaptImageForChannel(
  baseImageUrl: string,
  channelName: string,
  targetWidth: number,
  targetHeight: number,
  layoutConfig: any
): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-pro',
    generationConfig: {
      temperature: 0.3, // Lower temperature for consistency
      topK: 32,
      topP: 1,
    },
  });

  const { getChannelAdaptationPrompt } = await import('./prompts/channel-adaptation');
  const prompt = getChannelAdaptationPrompt(
    channelName,
    targetWidth,
    targetHeight,
    layoutConfig
  );

  try {
    // This would use Gemini's image editing/outpainting capabilities
    // For now, return the base image URL
    return baseImageUrl;
  } catch (error) {
    console.error('Gemini channel adaptation error:', error);
    throw new Error('Failed to adapt image for channel');
  }
}
