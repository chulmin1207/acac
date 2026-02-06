import type { Service, ReferenceAnalysis } from '@/types';

/**
 * Prompt for generating creative brief with Claude
 */
export function getBriefGenerationPrompt(
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
