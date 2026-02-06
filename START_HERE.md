# 🚀 ACAC 프로젝트 시작하기

> AI 기반 6단계 광고 소재 자동 생성 플랫폼

---

## ✅ Phase 1 완료!

기반 구조가 완벽하게 구축되었습니다.

**완료 항목**:
- ✅ 타입 시스템 (TypeScript)
- ✅ JSON 데이터베이스
- ✅ Google OAuth 인증 구조
- ✅ Admin 페이지 (서비스/채널 관리)
- ✅ Step 1 (서비스 선택) 완료
- ✅ Zustand 상태 관리

---

## 📚 문서 가이드

### 🔥 지금 바로 읽어야 할 문서

1. **`README.md`**
   - 프로젝트 전체 개요
   - 기술 스택, 기능 소개
   - 빠른 시작 가이드

2. **`SETUP_GUIDE.md`** ⭐ 중요!
   - Google OAuth 설정 방법
   - Gemini & Claude API 키 발급
   - `.env.local` 설정 방법

3. **`QUICK_REFERENCE.md`**
   - 자주 쓰는 명령어
   - URL 구조
   - 데이터 구조 참조

### 📖 상세 참고 문서

4. **`PHASE1_COMPLETE.md`**
   - Phase 1 완료 상세 보고서
   - 구현된 모든 기능 설명

5. **`IMPLEMENTATION_SUMMARY.md`**
   - 전체 구현 요약
   - 아키텍처 설명
   - 코드 통계

6. **`FILES_CREATED.md`**
   - 생성된 모든 파일 목록
   - 파일별 상세 설명

7. **`CHECKLIST.md`**
   - 완료 체크리스트
   - 테스트 시나리오

### 🎯 다음 단계 문서

8. **`NEXT_STEPS.md`** ⭐ Phase 2 시작 시
   - Phase 2 구현 가이드
   - 단계별 구현 방법
   - 코드 예시

---

## 🚀 빠른 시작

### 1. 개발 서버 실행

```bash
cd acac
npm run dev
```

→ http://localhost:3000 접속

### 2. 페이지 확인

- **`/`** - 로그인 페이지
- **`/admin`** - 관리자 대시보드
- **`/admin/services`** - 서비스 관리
- **`/admin/channels`** - 채널 관리
- **`/create`** - 크리에이티브 생성

### 3. OAuth 설정 (필수)

로그인 기능을 사용하려면:

```bash
# 1. 환경변수 파일 생성
cp .env.local.example .env.local

# 2. SETUP_GUIDE.md 읽고 따라하기
# 3. Google OAuth 클라이언트 생성
# 4. API 키 입력
```

---

## 🎯 프로젝트 진행 상황

```
✅ Phase 1: 기반 구조 재구성           100% 완료
   ├─ 타입 시스템                     ✅
   ├─ 데이터 스토리지                  ✅
   ├─ Google OAuth                    ✅
   ├─ Admin 시스템                    ✅
   └─ Step 1 (서비스 선택)             ✅

⏳ Phase 2: AI 기능 핵심 구현           0% 대기
   ├─ Gemini API 클라이언트            ⏳
   ├─ Claude API 클라이언트            ⏳
   ├─ Step 2 (내용 입력)               ⏳
   ├─ Step 3 (기획안 생성)             ⏳
   └─ Step 4 (이미지 생성)             ⏳

⏳ Phase 3: 채널 적응 및 완성           0% 대기
   ├─ Step 5 (채널별 적응)             ⏳
   ├─ Step 6 (다운로드)                ⏳
   └─ ZIP 생성                        ⏳

전체 진행률: ██████░░░░░░░░░░░░ 33%
```

---

## 📂 프로젝트 구조

```
acac/
├── 📄 START_HERE.md          ← 지금 읽고 있는 문서
├── 📄 README.md              ← 프로젝트 개요
├── 📄 SETUP_GUIDE.md         ← OAuth 설정
├── 📄 QUICK_REFERENCE.md     ← 빠른 참조
├── 📄 NEXT_STEPS.md          ← Phase 2 가이드
│
├── .env.local.example        ← 환경변수 템플릿
│
├── data/                     ← JSON 데이터
│   ├── services.json        (스낵24h)
│   ├── channels.json        (네이버, 메타, 구글, 카카오)
│   └── config.json          (설정)
│
├── public/
│   ├── uploads/             ← 업로드 이미지
│   └── generated/           ← 생성 이미지
│
└── src/
    ├── types/               ← TypeScript 타입
    ├── lib/
    │   ├── auth/           ← NextAuth 설정
    │   └── db/             ← CRUD 함수
    ├── hooks/              ← Zustand 상태
    ├── components/         ← UI 컴포넌트
    └── app/                ← 페이지 & API
```

---

## 🛠️ 개발 명령어

```bash
# 개발 서버
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 실행
npm start

# 린트
npm run lint
```

---

## 🌐 주요 URL

| URL | 설명 | 상태 |
|-----|------|------|
| `/` | 로그인 페이지 | ✅ 완료 |
| `/create` | 크리에이티브 생성 | 🟡 Step 1만 |
| `/admin` | 대시보드 | ✅ 완료 |
| `/admin/services` | 서비스 관리 | ✅ 완료 |
| `/admin/channels` | 채널 관리 | ✅ 완료 |

---

## 🔑 환경변수

`.env.local` 파일에 필요한 값:

```env
# Google OAuth (SETUP_GUIDE.md 참고)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# NextAuth
NEXTAUTH_SECRET=         # openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000
ALLOWED_DOMAIN=snack24h.com

# AI APIs (Phase 2에서 사용)
GEMINI_API_KEY=
ANTHROPIC_API_KEY=
```

---

## 🎨 주요 기능

### 현재 동작하는 기능

1. **서비스 관리** (`/admin/services`)
   - 서비스 추가, 수정, 삭제
   - 활성화/비활성화
   - JSON 파일 자동 저장

2. **채널 관리** (`/admin/channels`)
   - 채널 목록 조회
   - 사이즈 정보 표시
   - 삭제 기능

3. **크리에이티브 생성** (`/create`)
   - Step 1: 서비스 선택 ✅
   - Step 2-6: 구현 예정

4. **인증 시스템**
   - Google OAuth 구조 완성
   - 도메인 제한 (@snack24h.com)
   - AuthGuard 보호

---

## 🎯 다음 할 일

### 우선순위 1: 환경 설정

```bash
# 1. .env.local 생성
cp .env.local.example .env.local

# 2. SETUP_GUIDE.md 읽기

# 3. Google Cloud Console에서 OAuth 설정

# 4. API 키 발급 (Gemini, Claude)

# 5. .env.local에 모든 값 입력

# 6. 개발 서버 재시작
npm run dev
```

### 우선순위 2: 기능 테스트

1. `/` 접속 → Google 로그인 테스트
2. `/admin/services` → 서비스 추가/수정/삭제
3. `/admin/channels` → 채널 목록 확인
4. `/create` → Step 1 서비스 선택

### 우선순위 3: Phase 2 시작

1. `NEXT_STEPS.md` 읽기
2. AI 클라이언트 구축
3. Step 2, 3, 4 구현
4. 예상 시간: 3-4시간

---

## 💡 유용한 팁

### 데이터 확인
```bash
# 서비스 목록
cat data/services.json

# 채널 목록
cat data/channels.json
```

### API 테스트
```bash
# 서비스 조회
curl http://localhost:3000/api/services

# 채널 조회
curl http://localhost:3000/api/channels
```

### 상태 디버깅
```typescript
// 컴포넌트에서 Zustand 상태 확인
import { useStepFlow } from '@/hooks/useStepFlow';

const { currentStep, selectedService } = useStepFlow();
console.log('Step:', currentStep, 'Service:', selectedService);
```

---

## 🐛 문제 해결

### 포트 충돌
```bash
# 3000번 포트 사용 중이면 3001번 자동 사용
# 또는 프로세스 종료
lsof -ti:3000 | xargs kill -9
```

### OAuth 에러
- `redirect_uri_mismatch` → Google Console에서 URI 확인
- `Sign in denied` → `.env.local`의 `ALLOWED_DOMAIN` 확인

### TypeScript 에러
```bash
# 캐시 삭제 후 재시작
rm -rf .next
npm run dev
```

---

## 📚 학습 자료

### Next.js
- [Next.js 15 문서](https://nextjs.org/docs)
- [App Router 가이드](https://nextjs.org/docs/app)

### NextAuth
- [NextAuth.js 문서](https://next-auth.js.org/)
- [Google Provider](https://next-auth.js.org/providers/google)

### Zustand
- [Zustand 문서](https://zustand-demo.pmnd.rs/)
- [TypeScript 가이드](https://github.com/pmndrs/zustand#typescript)

### AI APIs
- [Gemini API](https://ai.google.dev/docs)
- [Claude API](https://docs.anthropic.com/)

---

## 🎓 프로젝트 구조 이해

### 데이터 흐름
```
사용자 입력
    ↓
UI Component (React)
    ↓
Zustand Store (상태 관리)
    ↓
API Route (Next.js)
    ↓
DB Layer (CRUD 함수)
    ↓
JSON File (데이터 저장)
```

### 인증 흐름
```
/ (로그인)
    ↓
Google OAuth
    ↓
NextAuth 콜백
    ↓
도메인 검증 (@snack24h.com)
    ↓
JWT 세션 생성
    ↓
AuthGuard 통과
    ↓
/create or /admin
```

### Step 플로우
```
Step 1: 서비스 선택 (완료)
    ↓
Step 2: 내용 입력 + 레퍼런스 분석 (Phase 2)
    ↓
Step 3: Claude 기획안 생성 (Phase 2)
    ↓
Step 4: Gemini 이미지 3개 생성 (Phase 2)
    ↓
Step 5: 채널별 아웃페인팅 (Phase 3)
    ↓
Step 6: 다운로드 (Phase 3)
```

---

## 🚀 배포

### Vercel 배포 (권장)

```bash
# 1. GitHub에 푸시
git push

# 2. Vercel 프로젝트 생성
# vercel.com에서 Import

# 3. 환경변수 설정
# Vercel Dashboard → Settings → Environment Variables
# .env.local의 모든 값 입력

# 4. NEXTAUTH_URL 변경
NEXTAUTH_URL=https://your-domain.vercel.app

# 5. Google OAuth 리디렉션 URI 추가
https://your-domain.vercel.app/api/auth/callback/google
```

---

## 📊 프로젝트 통계

### Phase 1 완료
- **파일**: 32개 생성, 4개 수정
- **코드**: 약 2,220줄
- **문서**: 8개
- **시간**: 약 2시간

### 전체 예상
- **총 Phase**: 3개
- **예상 파일**: 약 60개
- **예상 코드**: 약 5,000줄
- **예상 시간**: 8-10시간

---

## 🎯 최종 목표

**AI 기반 6단계 광고 소재 자동 생성 플랫폼**

사용자가:
1. 서비스 선택
2. 텍스트와 레퍼런스 이미지 입력
3. AI가 기획안 자동 생성
4. AI가 이미지 3개 생성
5. 선택한 이미지를 채널별로 자동 적응
6. 모든 채널의 광고 소재를 ZIP으로 다운로드

→ **한 번의 플로우로 모든 채널의 광고 소재 완성!**

---

## 🙏 시작하기

1. **지금 바로**: `npm run dev` 실행
2. **5분 후**: `SETUP_GUIDE.md` 읽고 OAuth 설정
3. **30분 후**: Admin 페이지에서 서비스/채널 관리 테스트
4. **1시간 후**: `NEXT_STEPS.md` 읽고 Phase 2 시작

---

## 📞 도움이 필요하면

1. 각 문서의 "문제 해결" 섹션 확인
2. 터미널 에러 로그 확인
3. 브라우저 콘솔 확인
4. `.env.local` 설정 재확인

---

**🎉 Phase 1 완료를 축하합니다!**

이제 `SETUP_GUIDE.md`를 읽고 OAuth를 설정한 후,
Phase 2로 넘어가서 AI 기능을 통합하세요!

**행운을 빕니다! 🚀**
