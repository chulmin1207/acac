import Anthropic from '@anthropic-ai/sdk';
import type { Service, Brief, ReferenceAnalysis } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { getHookContext } from '@/lib/utils/hooks-selector';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

/**
 * Generate creative brief using Claude with hook-based optimization
 */
export async function generateBrief(
  service: Service,
  userInput: string,
  referenceAnalysis: ReferenceAnalysis | null,
  targetPlatform: 'naver' | 'meta' | 'youtube' = 'meta'
): Promise<Brief> {
  const { getBriefGenerationPrompt } = await import('./prompts/brief-generation');

  try {
    // Load hook context for the selected service and platform
    const hookContext = await getHookContext(service.id, targetPlatform);

    // Generate prompt with hook context
    const promptText = getBriefGenerationPrompt(
      service,
      userInput,
      referenceAnalysis,
      hookContext,
      targetPlatform
    );

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2048,
      temperature: 0.7,
      messages: [
        {
          role: 'user',
          content: promptText,
        },
      ],
    });

    // Extract text from response
    const responseText = message.content
      .filter((block) => block.type === 'text')
      .map((block) => (block as any).text)
      .join('\n');

    // Parse JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse JSON from Claude response');
    }

    const briefData = JSON.parse(jsonMatch[0]);

    // Create Brief object
    const brief: Brief = {
      id: uuidv4(),
      serviceId: service.id,
      headline: briefData.headline || briefData.headCopy || '',
      subHeadline: briefData.subHeadline || briefData.subCopy || '',
      keyMessages: briefData.keyMessages || briefData.keyPoints || [],
      cta: briefData.cta || briefData.callToAction || '자세히 보기',
      visualDirection: briefData.visualDirection || briefData.visual || '',
      toneAndManner: briefData.toneAndManner || briefData.tone || '',
      referenceAnalysis: referenceAnalysis || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return brief;
  } catch (error) {
    console.error('Claude brief generation error:', error);

    // Return fallback brief with service-specific data
    const fallbackHeadline =
      service.id === 'snack24'
        ? '5,000가지 간식, 골라 먹는 재미'
        : service.id === 'breakfast24'
        ? '새벽 배송 + 냉장고 진열까지 완료'
        : service.id === 'coffee24'
        ? '한 잔 198원, 카페 대비 96% 절감'
        : service.id === 'birthday24'
        ? '직원이 직접 받고 싶은 선물 선택'
        : `${service.name}의 특별한 혜택`;

    return {
      id: uuidv4(),
      serviceId: service.id,
      headline: fallbackHeadline,
      subHeadline: service.tagline || userInput || '지금 바로 만나보세요',
      keyMessages: [
        '최고의 품질과 서비스',
        '합리적인 가격',
        '빠르고 편리한 이용',
      ],
      cta: '자세히 보기',
      visualDirection: '밝고 활기찬 이미지로 제품의 매력을 강조',
      toneAndManner: '친근하고 신뢰감 있는 톤',
      referenceAnalysis: referenceAnalysis || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
}

/**
 * Update brief with user modifications
 */
export async function updateBriefContent(
  brief: Brief,
  updates: Partial<Brief>
): Promise<Brief> {
  return {
    ...brief,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
}
