import type { Service, ReferenceAnalysis } from '@/types';

interface HookContext {
  primary_hook: {
    hook_text: string;
    type: string;
    emotional_angle: string;
    metric_value?: number;
    metric_unit?: string;
  };
  secondary_hook: {
    hook_text: string;
    type: string;
    emotional_angle: string;
  };
  tertiary_hook: {
    hook_text: string;
    type: string;
  };
  social_proof?: {
    hook_text: string;
  };
  employee_voices: Array<{ quote: string; emotion: string }>;
  hr_voices: Array<{ quote: string; emotion: string }>;
  visual_keywords: string[];
  image_mood: string[];
  brand_trust_points: string[];
  platform_tone: string;
}

/**
 * Prompt for generating creative brief with Claude using hook-based optimization
 */
export function getBriefGenerationPrompt(
  service: Service,
  userInput: string,
  referenceAnalysis: ReferenceAnalysis | null,
  hookContext: HookContext,
  targetPlatform: 'naver' | 'meta' | 'youtube' = 'meta'
): string {
  const referenceSection = referenceAnalysis
    ? `
레퍼런스 분석 결과:
- 텍스트 배치: ${referenceAnalysis.textPlacement}
- 오브제 위치: ${referenceAnalysis.objectPositions}
- 레이아웃: ${referenceAnalysis.layout}
- 톤앤매너: ${referenceAnalysis.toneAndManner}
- 배경: ${referenceAnalysis.background}
- 폰트: ${referenceAnalysis.fonts}
- 구성 비율: ${referenceAnalysis.compositionRatio}
`
    : '레퍼런스 이미지가 제공되지 않았습니다.';

  // Platform-specific copywriting guidelines
  const platformGuidelines = {
    meta: {
      headline_max: 40,
      body_max: 125,
      style: '짧고 임팩트 있게, 이모지 가능, 구어체 OK',
      tone: '친근하고 공감 가는 톤',
      priority: 'employee_voices 우선 활용 (공감형)',
    },
    naver: {
      headline_max: 25,
      body_max: 45,
      style: '숫자와 키워드 중심, 검색 의도 직격',
      tone: '신뢰감 있고 정보성 톤',
      priority: 'hr_voices 우선 활용 (신뢰형) + 구체적 수치 강조',
    },
    youtube: {
      headline_max: 100,
      body_max: 500,
      style: '스토리텔링, 5초 안에 훅 전달, 감정 자극',
      tone: '몰입형 스토리텔링',
      priority: 'employee_voices로 시작 → hr_voices로 마무리',
    },
  };

  const platform = platformGuidelines[targetPlatform];

  return `당신은 대한민국 최고의 퍼포먼스 마케팅 광고 기획자입니다.
실제 성과 데이터를 기반으로 최적화된 광고 소재 기획안을 작성해야 합니다.

# 서비스 정보
- 서비스명: ${service.name}
- 태그라인: ${service.tagline || service.description}
- 설명: ${service.description}
- 카테고리: ${service.category}
- 키워드: ${service.keywords.join(', ')}
- CTA URL: ${service.ctaUrl}

# 사용자 요구사항
${userInput}

${referenceSection}

# 타겟 플랫폼: ${targetPlatform.toUpperCase()}
- 헤드라인 최대: ${platform.headline_max}자
- 본문 최대: ${platform.body_max}자
- 작성 스타일: ${platform.style}
- 톤앤매너: ${platform.tone}
- 우선순위: ${platform.priority}

# 활용 가능한 검증된 훅 (효과 점수 기준 정렬됨)

## 1순위 훅 (헤드라인 활용):
"${hookContext.primary_hook.hook_text}"
- 타입: ${hookContext.primary_hook.type}
- 감성 앵글: ${hookContext.primary_hook.emotional_angle}
${hookContext.primary_hook.metric_value ? `- 수치: ${hookContext.primary_hook.metric_value}${hookContext.primary_hook.metric_unit || ''}` : ''}

## 2순위 훅 (서브/본문 활용):
"${hookContext.secondary_hook.hook_text}"
- 타입: ${hookContext.secondary_hook.type}
- 감성 앵글: ${hookContext.secondary_hook.emotional_angle}

## 3순위 훅 (보조):
"${hookContext.tertiary_hook.hook_text}"
- 타입: ${hookContext.tertiary_hook.type}

${hookContext.social_proof ? `## 신뢰도 훅 (본문 마지막 권장):
"${hookContext.social_proof.hook_text}"` : ''}

# 실제 고객 목소리

## 직원 인용 (Employee Voices):
${hookContext.employee_voices.map((v, i) => `${i + 1}. "${v.quote}" (감정: ${v.emotion})`).join('\n')}

## HR 담당자 인용 (HR Voices):
${hookContext.hr_voices.map((v, i) => `${i + 1}. "${v.quote}" (감정: ${v.emotion})`).join('\n')}

# 브랜드 신뢰 포인트 (필요시 활용):
${hookContext.brand_trust_points.map((p, i) => `- ${p}`).join('\n')}

# 비주얼 키워드:
${hookContext.visual_keywords.join(', ')}

# 이미지 무드:
${hookContext.image_mood.join(', ')}

---

# 작성 지침

1. **헤드라인**: 1순위 훅을 활용하되, ${platform.headline_max}자 이내로 임팩트 있게 재구성
2. **서브헤드라인**: 2순위 훅을 활용하여 헤드라인 보완
3. **핵심 메시지 3개**: 1~3순위 훅을 각각 활용하여 구성
4. **CTA**: 명확한 행동 유도 (예: 무료 체험, 상담 신청, 자세히 보기)
5. **비주얼 방향성**: visual_keywords와 image_mood를 반영
6. **톤앤매너**: ${hookContext.platform_tone}

## ${targetPlatform.toUpperCase()} 플랫폼 최적화 규칙:
${
  targetPlatform === 'meta'
    ? `- Employee voices를 우선 활용하여 공감 형성
- 이모지 활용 가능
- 구어체로 친근하게
- 짧고 펀치라인 중심`
    : targetPlatform === 'naver'
    ? `- HR voices와 구체적 수치를 우선 활용
- 신뢰감 있는 정보성 톤
- 검색 키워드와 매칭되는 표현
- Social proof 훅 반드시 포함`
    : `- Employee voices로 시작 → HR voices로 마무리
- 스토리텔링 구조
- 5초 안에 훅 전달
- 감정 자극 중심`
}

## JSON 응답 형식 (필수):

{
  "headline": "1순위 훅 기반 헤드카피 (${platform.headline_max}자 이내)",
  "subHeadline": "2순위 훅 기반 서브카피",
  "keyMessages": [
    "1순위 훅 활용",
    "2순위 훅 활용",
    "3순위 훅 활용"
  ],
  "cta": "행동유도문구 (5-10자)",
  "visualDirection": "비주얼 키워드와 이미지 무드 기반 방향성",
  "toneAndManner": "${hookContext.platform_tone} 기반 톤앤매너"
}

**중요**: 반드시 검증된 훅 데이터를 활용하고, 플랫폼별 글자수 제한을 준수하세요.
실제 고객 목소리(voices)를 자연스럽게 녹여내어 진정성을 높이세요.`;
}

/**
 * Legacy prompt for backward compatibility (without hooks)
 */
export function getLegacyBriefGenerationPrompt(
  service: Service,
  userInput: string,
  referenceAnalysis: ReferenceAnalysis | null
): string {
  const referenceSection = referenceAnalysis
    ? `
레퍼런스 분석 결과:
- 텍스트 배치: ${referenceAnalysis.textPlacement}
- 오브제 위치: ${referenceAnalysis.objectPositions}
- 레이아웃: ${referenceAnalysis.layout}
- 톤앤매너: ${referenceAnalysis.toneAndManner}
- 배경: ${referenceAnalysis.background}
- 폰트: ${referenceAnalysis.fonts}
- 구성 비율: ${referenceAnalysis.compositionRatio}
`
    : '레퍼런스 이미지가 제공되지 않았습니다.';

  return `당신은 대한민국 최고의 광고 기획자입니다.
다음 서비스를 위한 광고 소재 기획안을 작성해주세요.

서비스 정보:
- 서비스명: ${service.name}
- 설명: ${service.description}
- 카테고리: ${service.category}
- 키워드: ${service.keywords.join(', ')}

사용자 요구사항:
${userInput}

${referenceSection}

다음 요소들을 포함한 기획안을 JSON 형식으로 작성해주세요:

1. **headline** (헤드카피): 강력하고 임팩트 있는 메인 카피 (10-20자 이내)
2. **subHeadline** (서브카피): 헤드카피를 보완하는 설명 (20-40자 이내)
3. **keyMessages** (핵심 소구 포인트): 3개의 핵심 메시지 배열
4. **cta** (Call-to-Action): 행동 유도 문구 (5-10자)
5. **visualDirection** (비주얼 방향성): 이미지 생성 시 참고할 비주얼 가이드
6. **toneAndManner** (톤앤매너): 전체적인 광고의 분위기와 톤

응답은 반드시 다음 JSON 형식으로만 작성하세요:

{
  "headline": "메인 헤드카피",
  "subHeadline": "서브 헤드카피",
  "keyMessages": ["포인트1", "포인트2", "포인트3"],
  "cta": "행동유도문구",
  "visualDirection": "비주얼 방향성 설명",
  "toneAndManner": "톤앤매너 설명"
}

한국 소비자에게 어필할 수 있는, 임팩트 있고 기억에 남는 광고 기획안을 작성해주세요.`;
}
