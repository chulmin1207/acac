# ACAC - AI Creative Automation Center

AI 기반 6단계 광고 소재 자동 생성 플랫폼

## 🎯 프로젝트 개요

ACAC는 snack24h.com 내부 기획자들을 위한 AI 기반 광고 소재 자동 생성 도구입니다. 레퍼런스 이미지를 분석하고 일관된 스타일로 채널별 최적화된 광고 소재를 자동으로 생성합니다.

### 주요 기능

1. **서비스 선택** - 기획자가 카드로 서비스 선택
2. **내용 입력** - 텍스트 + 레퍼런스 이미지 업로드 → Gemini 분석
3. **기획안 생성** - Claude로 기획안 자동 생성 + 수정 가능
4. **이미지 3개 생성** - Gemini Image로 동시 생성 + 선택
5. **채널별 적응** - 아웃페인팅으로 채널별 소재 재구성
6. **다운로드** - 개별 또는 ZIP 다운로드

## 🚀 빠른 시작

### 필수 요구사항

- Node.js 18+
- npm 9+
- Google OAuth 2.0 Client ID/Secret
- Gemini API Key
- Anthropic (Claude) API Key

### 설치

```bash
# 의존성 설치
npm install

# 환경변수 설정
cp .env.local.example .env.local
# .env.local 파일을 열어 API 키 입력

# 개발 서버 실행
npm run dev
```

서버가 실행되면 http://localhost:3000 에서 접속

### 환경변수 설정

`.env.local` 파일에 다음 내용을 설정하세요:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000

# Domain Restriction
ALLOWED_DOMAIN=snack24h.com

# AI APIs
GEMINI_API_KEY=your_gemini_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

## 📋 구현 상태

### ✅ Phase 1: 기반 구조 재구성 (완료)

- [x] 타입 시스템 재정의 (Service, Channel, Brief, Creative)
- [x] JSON 기반 데이터 스토리지
- [x] Google OAuth 인증
- [x] Admin 페이지 (서비스/채널 관리)
- [x] `/create` 페이지 Step 1 (서비스 선택)
- [x] Zustand 상태 관리

### 🚧 Phase 2: AI 기능 핵심 구현 (예정)

- [ ] Gemini API 클라이언트
- [ ] Claude API 클라이언트
- [ ] Step 2: 레퍼런스 분석
- [ ] Step 3: 기획안 생성
- [ ] Step 4: 이미지 3개 생성

### 📅 Phase 3: 채널 적응 및 완성 (예정)

- [ ] Step 5: 채널별 아웃페인팅
- [ ] Step 6: 결과 다운로드
- [ ] ZIP 생성 기능
- [ ] 생성 이력 관리

## 🏗️ 프로젝트 구조

```
acac/
├── src/
│   ├── app/
│   │   ├── api/              # API 라우트
│   │   │   ├── auth/         # NextAuth
│   │   │   ├── services/     # 서비스 CRUD
│   │   │   └── channels/     # 채널 CRUD
│   │   ├── admin/            # 관리자 페이지
│   │   ├── create/           # 크리에이티브 생성 페이지
│   │   └── page.tsx          # 로그인 페이지
│   ├── components/
│   │   ├── auth/             # 인증 컴포넌트
│   │   └── steps/            # Step 1-6 컴포넌트
│   ├── hooks/
│   │   └── useStepFlow.ts    # Zustand 상태 관리
│   ├── lib/
│   │   ├── auth/             # NextAuth 설정
│   │   └── db/               # JSON 기반 DB
│   └── types/                # TypeScript 타입
├── data/
│   ├── services.json         # 서비스 데이터
│   ├── channels.json         # 채널 데이터
│   └── history/              # 생성 이력
└── public/
    ├── uploads/              # 업로드된 이미지
    └── generated/            # 생성된 이미지
```

## 🔧 기술 스택

### 프론트엔드
- **Next.js 15** - React 프레임워크
- **TypeScript** - 타입 안전성
- **Tailwind CSS** - 스타일링
- **Zustand** - 상태 관리
- **Lucide React** - 아이콘

### 백엔드
- **Next.js API Routes** - API 서버
- **NextAuth.js** - Google OAuth 인증
- **JSON 파일** - 데이터 스토리지

### AI & 이미지
- **Google Gemini API** - 이미지 분석 및 생성
- **Anthropic Claude API** - 기획안 생성
- **Sharp** - 이미지 최적화
- **Archiver** - ZIP 파일 생성

## 📚 API 문서

### Services API

```
GET    /api/services         # 모든 서비스 조회
POST   /api/services         # 서비스 생성
GET    /api/services/:id     # 서비스 조회
PATCH  /api/services/:id     # 서비스 수정
DELETE /api/services/:id     # 서비스 삭제
```

### Channels API

```
GET    /api/channels         # 모든 채널 조회
POST   /api/channels         # 채널 생성
GET    /api/channels/:id     # 채널 조회
PATCH  /api/channels/:id     # 채널 수정
DELETE /api/channels/:id     # 채널 삭제
```

## 🔐 인증

- Google OAuth 2.0 사용
- `@snack24h.com` 도메인만 허용
- JWT 세션 기반 인증

## 📦 데이터 구조

### Service
```typescript
{
  id: string;
  name: string;
  description: string;
  category: string;
  keywords: string[];
  thumbnail?: string;
  isActive: boolean;
}
```

### Channel
```typescript
{
  id: string;
  name: string;
  platform: 'naver' | 'meta' | 'google' | 'kakao';
  sizes: ChannelSize[];
  layoutConfig: LayoutConfig;
  isActive: boolean;
}
```

## 🧪 테스트

Phase 1 검증:
1. http://localhost:3000 접속 → Google OAuth 버튼 확인
2. `/admin/services` → 서비스 추가/수정/삭제
3. `/admin/channels` → 채널 목록 확인
4. `/create` → 서비스 선택 카드 표시

## 📝 라이센스

Private - snack24h.com 내부 사용

## 👥 기여자

- snack24h.com 개발팀
