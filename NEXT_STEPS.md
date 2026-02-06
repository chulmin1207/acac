# 다음 단계 - Phase 2 구현 가이드

## 🎯 현재 상태

✅ **Phase 1 완료** - 기반 구조 100% 완성
- 타입 시스템, 인증, Admin, Step 1 모두 동작

⏳ **Phase 2 대기** - AI 기능 핵심 구현
- Gemini & Claude API 통합
- Step 2, 3, 4 구현

---

## 📋 Phase 2 체크리스트

### 사전 준비 (필수)

#### 1. Google OAuth 설정
```bash
# 1. Google Cloud Console 접속
https://console.cloud.google.com/

# 2. OAuth 2.0 클라이언트 생성
- 승인된 리디렉션 URI:
  http://localhost:3000/api/auth/callback/google
  http://localhost:3001/api/auth/callback/google

# 3. .env.local 생성
cp .env.local.example .env.local

# 4. 클라이언트 ID/Secret 입력
```

#### 2. AI API 키 발급
```bash
# Gemini API Key
https://makersuite.google.com/app/apikey

# Anthropic API Key
https://console.anthropic.com/

# .env.local에 추가
GEMINI_API_KEY=your_key_here
ANTHROPIC_API_KEY=your_key_here
```

#### 3. NEXTAUTH_SECRET 생성
```bash
openssl rand -base64 32
# 결과를 .env.local에 추가
```

---

## 🔨 Phase 2 구현 순서

### Step 1: AI 클라이언트 구축 (30분)

#### 1.1 Gemini 클라이언트
```bash
# 파일 생성
touch src/lib/ai/gemini.ts
```

**구현 내용**:
```typescript
// src/lib/ai/gemini.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function analyzeReferenceImage(imageUrls: string[], userInput: string) {
  const model = genAI.getGenerativeModel({
    model: 'gemini-pro-vision'
  });

  // 프롬프트 및 이미지 분석 로직
  // ReferenceAnalysis 반환
}

export async function generateImage(prompt: string, variant: number) {
  const model = genAI.getGenerativeModel({
    model: 'gemini-pro-image'
  });

  // 이미지 생성 로직
  // GeneratedImage 반환
}
```

#### 1.2 Claude 클라이언트
```bash
# 파일 생성
touch src/lib/ai/claude.ts
```

**구현 내용**:
```typescript
// src/lib/ai/claude.ts
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

export async function generateBrief(
  service: Service,
  userInput: string,
  analysis: ReferenceAnalysis
) {
  const response = await anthropic.messages.create({
    model: 'claude-3-sonnet-20240229',
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: '기획안 생성 프롬프트...'
    }]
  });

  // Brief 반환
}
```

#### 1.3 프롬프트 하드코딩
```bash
# 디렉토리 생성
mkdir -p src/lib/ai/prompts

# 4개 파일 생성
touch src/lib/ai/prompts/reference-analysis.ts
touch src/lib/ai/prompts/brief-generation.ts
touch src/lib/ai/prompts/image-generation.ts
touch src/lib/ai/prompts/channel-adaptation.ts
```

---

### Step 2: 레퍼런스 분석 구현 (45분)

#### 2.1 UI 컴포넌트
```bash
touch src/components/steps/Step2CreativeInput.tsx
```

**구현 내용**:
- 텍스트 입력 (Textarea)
- 이미지 업로드 (드래그앤드롭, 최대 5개)
- [레퍼런스 분석] 버튼
- 분석 결과 표시

#### 2.2 파일 업로드 API
```bash
touch src/app/api/upload/route.ts
```

**기능**:
- Formidable로 파일 파싱
- Sharp로 이미지 최적화
- `public/uploads/` 저장
- URL 반환

#### 2.3 레퍼런스 분석 API
```bash
touch src/app/api/analysis/reference/route.ts
```

**기능**:
- 이미지 URL 배열 받기
- Gemini API 호출
- ReferenceAnalysis JSON 반환

#### 2.4 유틸리티
```bash
mkdir -p src/lib/utils
touch src/lib/utils/file-upload.ts
touch src/lib/utils/image-processing.ts
touch src/lib/utils/sanitize-filename.ts
```

---

### Step 3: 기획안 생성 구현 (30분)

#### 3.1 UI 컴포넌트
```bash
touch src/components/steps/Step3BriefGeneration.tsx
```

**구현 내용**:
- [기획안 생성] 버튼
- Claude API 호출
- 생성된 기획안 표시
- 각 필드 수정 가능 (Input/Textarea)
- [기획안 확정] 버튼

#### 3.2 기획안 생성 API
```bash
mkdir -p src/app/api/brief
touch src/app/api/brief/generate/route.ts
touch src/app/api/brief/update/route.ts
```

**기능**:
- `POST /api/brief/generate` - Claude API 호출
- `PATCH /api/brief/update` - 기획안 수정

---

### Step 4: 이미지 생성 구현 (45분)

#### 4.1 UI 컴포넌트
```bash
touch src/components/steps/Step4ImageGeneration.tsx
```

**구현 내용**:
- [이미지 생성] 버튼
- 3개 이미지 병렬 생성
- 카드 그리드 표시
- [이 이미지로 선택] 버튼
- [새로운 이미지 3개 생성] 버튼

#### 4.2 이미지 생성 API
```bash
mkdir -p src/app/api/image
touch src/app/api/image/generate/route.ts
touch src/app/api/image/regenerate/route.ts
```

**기능**:
- Gemini Image API 3회 병렬 호출
- Promise.all 사용
- variant 파라미터로 차별화
- 생성된 이미지 URL 반환

---

## 📝 코드 예시

### Step 2 컴포넌트 골격
```typescript
'use client';

import { useState } from 'react';
import { useStepFlow } from '@/hooks/useStepFlow';

export default function Step2CreativeInput() {
  const {
    userInput,
    setUserInput,
    referenceImages,
    addReferenceImage,
    removeReferenceImage,
    setReferenceAnalysis,
    nextStep
  } = useStepFlow();

  const [analyzing, setAnalyzing] = useState(false);

  const handleUpload = async (files: FileList) => {
    // 파일 업로드 로직
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    // API 호출
    const response = await fetch('/api/analysis/reference', {
      method: 'POST',
      body: JSON.stringify({ images: referenceImageUrls, input: userInput })
    });
    const data = await response.json();
    setReferenceAnalysis(data);
    setAnalyzing(false);
  };

  return (
    <div>
      <textarea
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="광고 소재에 대한 설명을 입력하세요"
      />

      <div>
        {/* 이미지 업로드 UI */}
      </div>

      <button onClick={handleAnalyze} disabled={analyzing}>
        {analyzing ? '분석 중...' : '레퍼런스 분석'}
      </button>

      {/* 분석 결과 표시 */}
    </div>
  );
}
```

### API 라우트 골격
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { analyzeReferenceImage } from '@/lib/ai/gemini';

export async function POST(request: NextRequest) {
  try {
    const { images, input } = await request.json();

    const analysis = await analyzeReferenceImage(images, input);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze reference' },
      { status: 500 }
    );
  }
}
```

---

## 🧪 테스트 시나리오

### Step 2 테스트
1. `/create` 접속
2. Step 1에서 "스낵24h" 선택
3. Step 2에서 텍스트 입력: "야식 배달 프로모션"
4. 레퍼런스 이미지 2개 업로드
5. [레퍼런스 분석] 버튼 클릭
6. Gemini 분석 결과 확인
7. [다음 단계] 버튼 활성화

### Step 3 테스트
1. [기획안 생성] 버튼 클릭
2. Claude API 응답 대기
3. 헤드카피, 서브카피 등 확인
4. 각 필드 수정해보기
5. [기획안 확정] 버튼 클릭

### Step 4 테스트
1. [이미지 생성] 버튼 클릭 (자동)
2. 3개 이미지 생성 대기
3. 각 이미지 확인
4. 1번 이미지 선택
5. [채널별 광고소재 제작하기] 버튼 활성화

---

## 📚 참고 문서

### API 문서
- [Gemini API](https://ai.google.dev/docs)
- [Claude API](https://docs.anthropic.com/)

### 코드 예시
- [Gemini Quickstart](https://ai.google.dev/tutorials/get_started_node)
- [Claude Quickstart](https://docs.anthropic.com/claude/reference/getting-started-with-the-api)

---

## ⏱️ 예상 소요 시간

| 작업 | 시간 |
|------|------|
| AI 클라이언트 | 30분 |
| Step 2 구현 | 45분 |
| Step 3 구현 | 30분 |
| Step 4 구현 | 45분 |
| 테스트 & 디버깅 | 60분 |
| **총 예상 시간** | **3.5시간** |

---

## 🚨 주의사항

### API 키 보안
- `.env.local`을 절대 커밋하지 않기
- API 키는 서버 사이드에서만 사용

### Rate Limiting
- Gemini API: 분당 60회 제한
- Step 4에서 3개 동시 생성은 문제없음
- 재생성 시 debounce 고려

### 에러 핸들링
- API 실패 시 사용자에게 명확한 메시지
- 재시도 로직 구현
- 로딩 상태 표시

### 파일 크기
- 이미지 업로드 최대 10MB
- Sharp로 자동 압축
- 프론트엔드에서 사전 검증

---

## 💡 개발 팁

### 1. API 키 테스트
Phase 2 시작 전에 간단한 테스트 스크립트 작성:
```typescript
// test-api.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

async function test() {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  const result = await model.generateContent('Say hello!');
  console.log(result.response.text());
}

test();
```

### 2. 프롬프트 반복 개발
- 먼저 Gemini Web UI에서 프롬프트 테스트
- 만족스러운 결과 나올 때까지 반복
- 코드에 하드코딩

### 3. 상태 디버깅
```typescript
// Zustand devtools
import { devtools } from 'zustand/middleware';

export const useStepFlow = create(
  devtools((set) => ({ ... }))
);
```

---

## 🎯 Phase 2 완료 기준

Phase 2는 다음을 모두 만족하면 완료:

- [ ] Gemini API 클라이언트 동작
- [ ] Claude API 클라이언트 동작
- [ ] Step 2: 이미지 업로드 + Gemini 분석 성공
- [ ] Step 3: Claude 기획안 생성 + 수정 가능
- [ ] Step 4: Gemini Image 3개 생성 + 선택 가능
- [ ] Step 1 → Step 4 완주 테스트 통과
- [ ] 에러 핸들링 구현
- [ ] 로딩 상태 표시

---

## 📞 도움이 필요하면

### 막혔을 때
1. 터미널 에러 로그 확인
2. 브라우저 콘솔 확인
3. API 키 유효성 확인
4. 문서 재확인

### 디버깅 체크리스트
- [ ] 환경변수 설정됨
- [ ] API 키 유효함
- [ ] 서버 재시작함
- [ ] 캐시 클리어함
- [ ] TypeScript 에러 없음

---

**준비 완료되면 Phase 2 시작하세요!**

**다음 문서**: Phase 2 구현하면서 `PHASE2_COMPLETE.md` 작성
