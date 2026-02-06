# ACAC 프로젝트 구조

## 📊 프로젝트 개요

**ACAC (AI Creative Automation Center)**는 AI 기반 광고 소재 자동 생성 플랫폼입니다.

### 핵심 기능
- 6단계 자동화 워크플로우
- Gemini API를 통한 이미지 분석 및 생성
- Claude API를 통한 기획안 자동 생성
- 채널별 최적화 (네이버, 메타, 구글, 카카오)
- 관리자 페이지를 통한 서비스/채널 관리

---

## 📁 폴더 구조

```
acac/
├── data/                              # JSON 데이터 저장소
│   ├── channels.json                  # 채널 설정
│   ├── services.json                  # 서비스 목록
│   ├── config.json                    # 전역 설정
│   └── history/                       # 생성 이력
│
├── public/                            # 정적 파일
│   ├── generated/                     # AI 생성 이미지
│   ├── uploads/                       # 업로드 이미지
│   └── images/services/               # 서비스 썸네일
│
├── src/
│   ├── app/                           # Next.js App Router
│   │   ├── admin/                     # 관리자 페이지
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx               # 대시보드
│   │   │   ├── services/page.tsx      # 서비스 관리
│   │   │   └── channels/page.tsx      # 채널 관리
│   │   │
│   │   ├── api/                       # API Routes
│   │   │   ├── auth/[...nextauth]/    # OAuth 인증
│   │   │   ├── analysis/reference/    # 레퍼런스 분석
│   │   │   ├── brief/                 # 기획안 생성/수정
│   │   │   ├── image/                 # 이미지 생성/재생성
│   │   │   ├── creative/              # 채널 적응/다운로드
│   │   │   ├── services/              # 서비스 CRUD
│   │   │   ├── channels/              # 채널 CRUD
│   │   │   └── upload/                # 파일 업로드
│   │   │
│   │   ├── create/page.tsx            # 6단계 플로우 페이지
│   │   ├── layout.tsx                 # 루트 레이아웃
│   │   ├── page.tsx                   # 홈/로그인
│   │   └── globals.css                # Tailwind CSS
│   │
│   ├── components/
│   │   ├── auth/                      # 인증 컴포넌트
│   │   │   ├── AuthGuard.tsx
│   │   │   ├── GoogleSignIn.tsx
│   │   │   └── SessionProvider.tsx
│   │   │
│   │   └── steps/                     # 6단계 UI 컴포넌트
│   │       ├── StepIndicator.tsx      # 진행 표시
│   │       ├── Step1ServiceSelection.tsx
│   │       ├── Step2CreativeInput.tsx
│   │       ├── Step3BriefGeneration.tsx
│   │       ├── Step4ImageGeneration.tsx
│   │       ├── Step5ChannelAdaptation.tsx
│   │       └── Step6ResultDownload.tsx
│   │
│   ├── hooks/
│   │   └── useStepFlow.ts             # Zustand 상태 관리
│   │
│   ├── lib/
│   │   ├── ai/                        # AI API 클라이언트
│   │   │   ├── gemini.ts              # Gemini API
│   │   │   ├── claude.ts              # Claude API
│   │   │   └── prompts/               # AI 프롬프트
│   │   │       ├── reference-analysis.ts
│   │   │       ├── brief-generation.ts
│   │   │       ├── image-generation.ts
│   │   │       └── channel-adaptation.ts
│   │   │
│   │   ├── auth/
│   │   │   └── nextauth.ts            # NextAuth 설정
│   │   │
│   │   ├── db/                        # JSON CRUD
│   │   │   ├── services.ts
│   │   │   ├── channels.ts
│   │   │   └── history.ts
│   │   │
│   │   └── utils/                     # 유틸리티
│   │       ├── file-upload.ts
│   │       ├── image-processing.ts
│   │       └── zip-generator.ts
│   │
│   └── types/                         # TypeScript 타입
│       ├── service.ts
│       ├── channel.ts
│       ├── brief.ts
│       ├── creative.ts
│       └── index.ts
│
├── .env.local.example                 # 환경변수 예시
├── package.json                       # 의존성
├── next.config.ts                     # Next.js 설정
├── tailwind.config.ts                 # Tailwind 설정
└── tsconfig.json                      # TypeScript 설정
```

---

## 📊 프로젝트 통계

### 소스 코드
- **TypeScript 파일**: 51개
- **CSS 파일**: 1개
- **디렉토리**: 37개

### 영역별 파일 수
- **API Routes**: 14개
- **Components**: 10개
- **Library**: 14개
- **Types**: 5개
- **Data Files**: 3개
- **문서**: 10개

---

## 🔧 기술 스택

### Frontend & Framework
- **Next.js**: ^15.1.6 (App Router)
- **React**: ^19.0.0
- **TypeScript**: ^5

### AI & API
- **@anthropic-ai/sdk**: ^0.73.0 (Claude API)
- **@google/generative-ai**: ^0.24.1 (Gemini API)
- **next-auth**: ^4.24.13 (Google OAuth)

### State Management
- **zustand**: ^5.0.11

### Utilities
- **uuid**: ^13.0.0 (ID 생성)
- **date-fns**: ^4.1.0 (날짜 처리)
- **archiver**: ^7.0.1 (ZIP 생성)
- **sharp**: ^0.34.5 (이미지 최적화)
- **formidable**: ^3.5.4 (파일 업로드)

### Styling
- **tailwindcss**: ^3.4.1
- **lucide-react**: ^0.460.0 (아이콘)
- **clsx**: ^2.1.1 (클래스 유틸리티)

---

## 🎯 6단계 워크플로우

### Step 1: 서비스 선택
- **파일**: `Step1ServiceSelection.tsx`
- **기능**: 관리자가 등록한 서비스 카드 선택
- **상태**: `selectedService`

### Step 2: 크리에이티브 입력
- **파일**: `Step2CreativeInput.tsx`
- **기능**:
  - 텍스트 입력
  - 레퍼런스 이미지 업로드 (최대 5개)
  - Gemini API를 통한 레퍼런스 분석
- **API**: `POST /api/upload`, `POST /api/analysis/reference`
- **상태**: `userInput`, `referenceImages`, `referenceAnalysis`

### Step 3: 기획안 생성
- **파일**: `Step3BriefGeneration.tsx`
- **기능**:
  - Claude API로 기획안 자동 생성
  - 헤드카피, 서브카피, 핵심 소구, CTA 등 수정 가능
- **API**: `POST /api/brief/generate`, `PATCH /api/brief/update`
- **상태**: `brief`

### Step 4: 이미지 생성
- **파일**: `Step4ImageGeneration.tsx`
- **기능**:
  - Gemini Image API로 3개 이미지 변형 생성
  - 3개 중 1개 선택
  - 재생성 가능
- **API**: `POST /api/image/generate`, `POST /api/image/regenerate`
- **상태**: `generatedImages`, `selectedImage`

### Step 5: 채널별 적응
- **파일**: `Step5ChannelAdaptation.tsx`
- **기능**:
  - 채널 선택 (멀티셀렉트)
  - 채널별 아웃페인팅으로 재구성
  - 진행 상태 표시
- **API**: `POST /api/creative/adapt`
- **상태**: `selectedChannelIds`, `creative`

### Step 6: 다운로드
- **파일**: `Step6ResultDownload.tsx`
- **기능**:
  - 채널별 탭 네비게이션
  - 사이즈별 그리드 표시
  - 개별 다운로드
  - ZIP 일괄 다운로드
- **API**: `GET /api/creative/download`, `GET /api/creative/download-zip`

---

## 🔌 API 엔드포인트

### Authentication
- `GET/POST /api/auth/[...nextauth]` - NextAuth OAuth 핸들러

### Analysis
- `POST /api/analysis/reference` - Gemini 레퍼런스 분석

### Brief
- `POST /api/brief/generate` - Claude 기획안 생성
- `PATCH /api/brief/update` - 기획안 수정

### Image
- `POST /api/image/generate` - 3개 이미지 생성
- `POST /api/image/regenerate` - 이미지 재생성

### Creative
- `POST /api/creative/adapt` - 채널별 아웃페인팅
- `GET /api/creative/download` - 단일 이미지 다운로드
- `GET /api/creative/download-zip` - ZIP 다운로드

### Admin
- `GET /api/services` - 서비스 목록
- `POST /api/services` - 서비스 생성
- `PATCH /api/services/[id]` - 서비스 수정
- `DELETE /api/services/[id]` - 서비스 삭제
- `GET /api/channels` - 채널 목록
- `POST /api/channels` - 채널 생성
- `PATCH /api/channels/[id]` - 채널 수정
- `DELETE /api/channels/[id]` - 채널 삭제

### Upload
- `POST /api/upload` - 파일 업로드

---

## 💾 데이터 구조

### services.json
```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "category": "string",
  "keywords": ["string"],
  "thumbnail": "string",
  "isActive": boolean,
  "createdAt": "ISO8601",
  "updatedAt": "ISO8601"
}
```

### channels.json
```json
{
  "id": "string",
  "name": "string",
  "platform": "string",
  "sizes": [
    {
      "width": number,
      "height": number,
      "label": "string",
      "aspectRatio": "string"
    }
  ],
  "layoutConfig": {
    "textPosition": "string",
    "textAlign": "string",
    "ctaPosition": "string",
    "backgroundExpand": boolean,
    "productReposition": boolean
  },
  "isActive": boolean,
  "createdAt": "ISO8601",
  "updatedAt": "ISO8601"
}
```

### history/[creativeId].json
```json
{
  "id": "string",
  "briefId": "string",
  "serviceId": "string",
  "userInput": "string",
  "referenceImages": ["string"],
  "baseImageId": "string",
  "channelCreatives": [
    {
      "channelId": "string",
      "channelName": "string",
      "images": [
        {
          "size": "string",
          "url": "string",
          "width": number,
          "height": number
        }
      ]
    }
  ],
  "status": "string",
  "createdAt": "ISO8601",
  "updatedAt": "ISO8601"
}
```

---

## 🔐 환경변수

```env
# Google OAuth (NextAuth)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
ALLOWED_DOMAIN=snack24h.com

# AI APIs
GEMINI_API_KEY=
ANTHROPIC_API_KEY=
```

---

## 🚀 실행 방법

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 실행
npm start
```

---

## 📝 개발 완료 상태

### Phase 1: Foundation ✅
- 타입 시스템
- Google OAuth 인증
- JSON 기반 데이터 관리
- Admin 페이지
- Step 1 구현

### Phase 2: AI Core ✅
- Gemini/Claude API 연동
- AI 프롬프트 구현
- Step 2, 3, 4 구현
- 파일 업로드 처리

### Phase 3: Completion ✅
- 채널 적응
- 다운로드 기능
- Step 5, 6 구현
- ZIP 생성

**전체 6단계 워크플로우 완성!**

---

## 📚 관련 문서

- `README.md` - 프로젝트 개요
- `START_HERE.md` - 시작 가이드
- `SETUP_GUIDE.md` - 설치 가이드
- `IMPLEMENTATION_SUMMARY.md` - 구현 요약
- `PHASE1_COMPLETE.md` - Phase 1 보고서

---

**최종 업데이트**: 2026-02-06
**버전**: 0.1.0
**상태**: Phase 3 완료 (전체 완료)
