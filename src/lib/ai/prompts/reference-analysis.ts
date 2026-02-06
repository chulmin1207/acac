/**
 * Prompt for analyzing reference images with Gemini
 */
export function getReferenceAnalysisPrompt(userInput: string): string {
  return `당신은 전문 광고 크리에이티브 디자이너입니다.
제공된 레퍼런스 이미지들을 분석하여 디자인 요소를 추출해주세요.

사용자 입력:
${userInput}

다음 요소들을 JSON 형식으로 분석해주세요:

1. **textPlacement**: 텍스트(헤드카피, 서브카피)의 위치와 배치 방식
2. **objectPositions**: 주요 오브제(제품, 사람, 배경 요소 등)의 위치
3. **layout**: 전체 레이아웃 구조와 구성
4. **toneAndManner**: 이미지의 톤앤매너, 분위기
5. **background**: 배경의 색상, 패턴, 스타일
6. **fonts**: 사용된 폰트 스타일 (추정)
7. **compositionRatio**: 화면 구성 비율 (텍스트 영역, 이미지 영역, 여백 등)

응답은 반드시 다음 JSON 형식으로만 작성하세요:

{
  "textPlacement": "텍스트 배치 설명",
  "objectPositions": "오브제 위치 설명",
  "layout": "레이아웃 설명",
  "toneAndManner": "톤앤매너 설명",
  "background": "배경 설명",
  "fonts": "폰트 스타일 설명",
  "compositionRatio": "구성 비율 설명"
}

각 항목은 구체적이고 실행 가능한 디자인 가이드가 되도록 작성해주세요.`;
}
