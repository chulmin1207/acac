# 플랫폼 관리 가이드

ACAC 프로젝트에서 광고 플랫폼과 사이즈를 관리하는 방법을 설명합니다.

## 📁 파일 구조

```
src/lib/platforms/
├── index.ts           # 전체 플랫폼 통합 및 유틸리티 함수
├── naver.ts          # 네이버 광고 사양
├── meta.ts           # 메타 광고 사양
├── google.ts         # 구글/유튜브 광고 사양
└── kakao.ts          # 카카오 광고 사양
```

## ✅ 기존 플랫폼의 사이즈 추가/수정

### 예시: 네이버에 새로운 광고 사이즈 추가

`src/lib/platforms/naver.ts` 파일만 수정하면 됩니다.

```typescript
export const NAVER_PLATFORM: PlatformSpec = {
  id: 'naver',
  name: '네이버',
  color: '#03C75A',
  sizes: [
    // 기존 사이즈들...
    {
      width: 1200,
      height: 1800,
      label: 'GFA 네이티브 피드 (2:3)',
      aspectRatio: '2:3'
    },
    // 새로운 사이즈 추가
    {
      width: 320,
      height: 100,
      label: '모바일 배너',
      aspectRatio: '320:100'
    },
  ],
};
```

**변경 후**: 저장하면 자동으로 반영됩니다. 다른 파일은 수정할 필요가 없습니다.

## 🆕 새로운 플랫폼 추가

### 1단계: 플랫폼 파일 생성

`src/lib/platforms/tiktok.ts` 파일을 생성합니다.

```typescript
import { PlatformSpec } from '@/types';

export const TIKTOK_PLATFORM: PlatformSpec = {
  id: 'tiktok',
  name: '틱톡',
  color: '#000000',
  sizes: [
    {
      width: 1080,
      height: 1920,
      label: '틱톡 비디오 (9:16)',
      aspectRatio: '9:16'
    },
    {
      width: 1200,
      height: 628,
      label: '틱톡 광고',
      aspectRatio: '1200:628'
    },
  ],
};
```

### 2단계: 타입 정의 업데이트

`src/types/index.ts`에서 PlatformType에 새로운 플랫폼 추가:

```typescript
export type PlatformType = 'naver' | 'meta' | 'google' | 'kakao' | 'tiktok';
```

### 3단계: 플랫폼 목록에 추가

`src/lib/platforms/index.ts`에서 import하고 추가:

```typescript
import { TIKTOK_PLATFORM } from './tiktok';

export const PLATFORMS: PlatformSpec[] = [
  NAVER_PLATFORM,
  META_PLATFORM,
  GOOGLE_PLATFORM,
  KAKAO_PLATFORM,
  TIKTOK_PLATFORM,  // 새로운 플랫폼 추가
];

// export도 추가
export { TIKTOK_PLATFORM } from './tiktok';
```

### 4단계: 완료!

이제 UI에 자동으로 틱톡이 표시되고, 모든 기능이 작동합니다.

## 🎨 속성 설명

### PlatformSpec

```typescript
{
  id: string;           // 고유 식별자 (영문 소문자, PlatformType과 일치해야 함)
  name: string;         // 사용자에게 표시될 이름
  color: string;        // 플랫폼 대표 색상 (Hex 코드)
  sizes: AdSize[];      // 해당 플랫폼의 광고 사이즈 배열
}
```

### AdSize

```typescript
{
  width: number;        // 가로 픽셀 (px)
  height: number;       // 세로 픽셀 (px)
  label: string;        // 사용자에게 표시될 사이즈 이름
  aspectRatio?: string; // 비율 표시 (선택사항, CSS에서 사용)
}
```

## 💡 팁

### 1. 플랫폼 순서 변경
`src/lib/platforms/index.ts`의 PLATFORMS 배열 순서를 변경하면 UI 표시 순서가 바뀝니다.

### 2. 플랫폼 색상 참고
- 네이버: #03C75A
- 메타: #1877F2
- 구글: #4285F4
- 카카오: #FEE500
- 틱톡: #000000
- 트위터/X: #1DA1F2

### 3. aspectRatio 작성법
- 정사각형: `'1:1'`
- 세로형: `'4:5'`, `'9:16'`
- 가로형: `'16:9'`, `'1200:628'`
- 픽셀 비율 그대로: `'1250:560'`

### 4. 사이즈 label 작성법
명확하고 간결하게 작성하세요:
- ✅ `'GFA 메인'`
- ✅ `'피드 (4:5 권장)'`
- ✅ `'스토리/릴스 (9:16)'`
- ❌ `'1250x560'` (숫자만 쓰지 말 것)
- ❌ `'Main Banner'` (한글 사용)

## 🔍 테스트

플랫폼/사이즈를 추가/수정한 후:

1. 개발 서버가 오류 없이 실행되는지 확인
2. UI에서 플랫폼이 올바르게 표시되는지 확인
3. 체크박스 선택 시 미리보기가 정상적으로 나타나는지 확인
4. 모든 사이즈가 올바른 비율로 표시되는지 확인

## ❓ 문제 해결

### "Property 'xxx' does not exist on type 'PlatformType'"
→ `src/types/index.ts`의 PlatformType에 새로운 플랫폼 id를 추가하지 않았습니다.

### 플랫폼이 UI에 나타나지 않음
→ `src/lib/platforms/index.ts`의 PLATFORMS 배열에 추가했는지 확인하세요.

### Hot reload가 작동하지 않음
→ 개발 서버를 재시작하세요: `npm run dev`
