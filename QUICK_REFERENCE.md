# ACAC 빠른 참조 카드

## 🚀 개발 서버

```bash
# 시작
npm run dev

# 빌드
npm run build

# 프로덕션 실행
npm start
```

**현재 서버**: http://localhost:3001 (3000번 포트 사용 중)

---

## 📁 주요 파일 위치

### 설정
- `.env.local` - 환경변수 (생성 필요)
- `.env.local.example` - 환경변수 템플릿
- `next.config.ts` - Next.js 설정

### 데이터
- `data/services.json` - 서비스 목록
- `data/channels.json` - 채널 설정
- `data/config.json` - 앱 설정

### 타입
- `src/types/` - 모든 TypeScript 타입 정의

### 상태
- `src/hooks/useStepFlow.ts` - 전역 상태 (Zustand)

### 주요 페이지
- `src/app/page.tsx` - 로그인
- `src/app/create/page.tsx` - 크리에이티브 생성
- `src/app/admin/` - 관리자 페이지

---

## 🌐 URL 구조

| URL | 설명 | 인증 필요 |
|-----|------|----------|
| `/` | 로그인 | ❌ |
| `/create` | 크리에이티브 생성 | ✅ |
| `/admin` | 대시보드 | ✅ |
| `/admin/services` | 서비스 관리 | ✅ |
| `/admin/channels` | 채널 관리 | ✅ |

---

## 🔌 API 엔드포인트

### Services
```
GET    /api/services         # 목록
POST   /api/services         # 생성
GET    /api/services/:id     # 조회
PATCH  /api/services/:id     # 수정
DELETE /api/services/:id     # 삭제
```

### Channels
```
GET    /api/channels         # 목록
POST   /api/channels         # 생성
GET    /api/channels/:id     # 조회
PATCH  /api/channels/:id     # 수정
DELETE /api/channels/:id     # 삭제
```

---

## 🔑 환경변수 (.env.local)

```env
# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# NextAuth
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000

# Domain
ALLOWED_DOMAIN=snack24h.com

# AI APIs (Phase 2)
GEMINI_API_KEY=
ANTHROPIC_API_KEY=
```

### NEXTAUTH_SECRET 생성
```bash
openssl rand -base64 32
```

---

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

---

## 🎨 Zustand 상태 구조

```typescript
useStepFlow((state) => ({
  currentStep: 1,              // 현재 단계
  selectedService: null,       // 선택된 서비스
  userInput: '',              // 사용자 입력
  referenceImages: [],        // 레퍼런스 이미지
  referenceAnalysis: null,    // Gemini 분석
  brief: null,                // Claude 기획안
  generatedImages: [],        // 생성된 이미지 3개
  selectedImage: null,        // 선택된 이미지
  creative: null,             // 최종 크리에이티브
  selectedChannelIds: [],     // 선택된 채널들
}));
```

---

## 🛠️ 개발 명령어

### NPM
```bash
npm install              # 의존성 설치
npm run dev             # 개발 서버
npm run build           # 프로덕션 빌드
npm run start           # 프로덕션 실행
npm run lint            # ESLint
```

### Git
```bash
git status              # 변경사항 확인
git add .               # 모든 파일 스테이징
git commit -m "message" # 커밋
git push                # 푸시
```

---

## 🐛 디버깅

### 로그 확인
```bash
# 서버 로그 (터미널)
npm run dev

# 브라우저 콘솔
F12 → Console 탭

# API 로그
터미널에서 실시간 출력
```

### 일반적인 문제

#### "redirect_uri_mismatch"
→ Google Console에서 리디렉션 URI 확인

#### "Sign in denied"
→ `.env.local`의 `ALLOWED_DOMAIN` 확인

#### 포트 충돌
→ 3000번 포트 사용 중이면 3001번 사용

#### 세션 에러
→ `NEXTAUTH_SECRET` 설정 확인

---

## 📂 디렉토리 구조 (간단)

```
acac/
├── src/
│   ├── types/          # 타입 정의
│   ├── lib/            # 유틸리티
│   │   ├── auth/      # NextAuth
│   │   └── db/        # CRUD 함수
│   ├── hooks/          # Zustand
│   ├── components/     # 컴포넌트
│   └── app/           # 페이지 & API
├── data/              # JSON 데이터
├── public/            # 정적 파일
└── .env.local         # 환경변수
```

---

## 🚦 Phase 상태

### ✅ Phase 1 (완료)
- Types, Auth, Data, Admin, Step 1

### ⏳ Phase 2 (예정)
- AI 클라이언트, Step 2-4

### 📅 Phase 3 (예정)
- Step 5-6, 다운로드, ZIP

---

## 📚 문서

- `README.md` - 프로젝트 개요
- `SETUP_GUIDE.md` - 설정 가이드
- `PHASE1_COMPLETE.md` - Phase 1 상세
- `FILES_CREATED.md` - 파일 목록
- `IMPLEMENTATION_SUMMARY.md` - 전체 요약
- `QUICK_REFERENCE.md` - 이 문서

---

## 🔗 유용한 링크

### 개발
- [Next.js Docs](https://nextjs.org/docs)
- [NextAuth Docs](https://next-auth.js.org/)
- [Zustand Docs](https://zustand-demo.pmnd.rs/)

### OAuth
- [Google Cloud Console](https://console.cloud.google.com/)
- [Google OAuth Setup](https://support.google.com/cloud/answer/6158849)

### AI APIs
- [Gemini API](https://ai.google.dev/)
- [Claude API](https://docs.anthropic.com/)

---

## 💡 빠른 팁

### 서비스 추가
1. `/admin/services` 접속
2. **서비스 추가** 버튼
3. 이름, 설명 수정
4. 저장

### 채널 확인
1. `/admin/channels` 접속
2. 카드 형태로 표시
3. 네이버, 메타, 구글, 카카오 4개

### Step 1 테스트
1. `/create` 접속
2. "스낵24h" 카드 클릭
3. **다음 단계** 버튼 클릭

### 상태 확인 (Zustand)
```typescript
// 컴포넌트에서
const { currentStep, selectedService } = useStepFlow();
console.log(currentStep, selectedService);
```

---

## ⚡ 단축키

### VSCode
- `Cmd/Ctrl + P` - 파일 검색
- `Cmd/Ctrl + Shift + F` - 전체 검색
- `Cmd/Ctrl + B` - 사이드바 토글
- `F12` - 정의로 이동

### 브라우저
- `F12` - 개발자 도구
- `Cmd/Ctrl + R` - 새로고침
- `Cmd/Ctrl + Shift + R` - 캐시 무시 새로고침

---

**마지막 업데이트**: 2026-02-06
**버전**: Phase 1 완료
