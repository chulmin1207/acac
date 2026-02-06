# ACAC 설정 가이드

## 📋 사전 준비

이 가이드는 ACAC 프로젝트를 처음 설정하는 방법을 단계별로 안내합니다.

## 1️⃣ Google OAuth 설정

### 1. Google Cloud Console 접속
1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택

### 2. OAuth 동의 화면 구성
1. 좌측 메뉴에서 **API 및 서비스** → **OAuth 동의 화면** 선택
2. **외부** 또는 **내부** 선택 (조직 계정이면 내부 선택)
3. 앱 정보 입력:
   - 앱 이름: `ACAC`
   - 사용자 지원 이메일: 본인 이메일
   - 승인된 도메인: `snack24h.com` (프로덕션용)
   - 개발자 연락처 정보: 본인 이메일

### 3. OAuth 2.0 클라이언트 ID 생성
1. **사용자 인증 정보** → **사용자 인증 정보 만들기** → **OAuth 클라이언트 ID**
2. 애플리케이션 유형: **웹 애플리케이션**
3. 이름: `ACAC Web Client`
4. 승인된 리디렉션 URI:
   ```
   http://localhost:3000/api/auth/callback/google
   http://localhost:3001/api/auth/callback/google
   ```
   (프로덕션 URL도 추가: `https://yourdomain.com/api/auth/callback/google`)
5. **만들기** 클릭
6. **클라이언트 ID**와 **클라이언트 보안 비밀번호** 복사

## 2️⃣ AI API 키 발급

### Gemini API Key
1. [Google AI Studio](https://makersuite.google.com/app/apikey) 접속
2. **API Key 만들기** 클릭
3. API Key 복사

### Anthropic API Key
1. [Anthropic Console](https://console.anthropic.com/) 접속
2. 계정 생성 또는 로그인
3. **API Keys** → **Create Key** 클릭
4. API Key 복사

## 3️⃣ 환경변수 설정

### 1. .env.local 파일 생성
```bash
cd acac
cp .env.local.example .env.local
```

### 2. .env.local 편집
```bash
# 텍스트 에디터로 .env.local 열기
nano .env.local
# 또는
code .env.local
```

### 3. 값 입력
```env
# Google OAuth (위에서 복사한 값)
GOOGLE_CLIENT_ID=1234567890-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-aBcDeFgHiJkLmNoPqRsTuVwXyZ

# NextAuth (새로 생성)
NEXTAUTH_SECRET=your_random_secret_here
NEXTAUTH_URL=http://localhost:3000

# Domain Restriction
ALLOWED_DOMAIN=snack24h.com

# AI APIs (위에서 복사한 값)
GEMINI_API_KEY=AIzaSy...
ANTHROPIC_API_KEY=sk-ant-...
```

### NEXTAUTH_SECRET 생성
```bash
# macOS/Linux
openssl rand -base64 32

# 또는 Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## 4️⃣ 프로젝트 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 개발 서버 시작
```bash
npm run dev
```

### 3. 브라우저 접속
```
http://localhost:3000
```

## 5️⃣ 기능 테스트

### 로그인 테스트
1. http://localhost:3000 접속
2. **Continue with Google** 버튼 클릭
3. Google 계정 선택
4. 승인 후 `/create` 페이지로 리다이렉트

### Admin 페이지 테스트
1. http://localhost:3000/admin 접속
2. 대시보드 확인
3. `/admin/services` - 서비스 관리 테스트
   - **서비스 추가** 버튼 클릭
   - 이름, 설명 수정
   - 저장 확인
4. `/admin/channels` - 채널 목록 확인

### 크리에이티브 생성 테스트
1. http://localhost:3000/create 접속
2. Step 1: 서비스 선택
   - "스낵24h" 카드 클릭
   - **다음 단계** 버튼 활성화 확인
3. Step 2-6: "구현 예정" 메시지 확인

## 🐛 트러블슈팅

### 문제: OAuth 에러 "redirect_uri_mismatch"
**해결방법**:
1. Google Cloud Console에서 승인된 리디렉션 URI 확인
2. 포트 번호 확인 (3000 또는 3001)
3. `http://` vs `https://` 확인

### 문제: "Sign in denied" 메시지
**원인**: 로그인 이메일이 `@snack24h.com`이 아님
**해결방법**:
1. `.env.local`에서 `ALLOWED_DOMAIN` 변경
2. 테스트용으로 `gmail.com` 등으로 변경 가능

### 문제: 페이지가 로딩되지 않음
**확인사항**:
1. `npm run dev` 실행 중인지 확인
2. 콘솔 에러 확인
3. `.env.local` 파일 존재 확인
4. 포트 충돌 확인 (3000번 포트)

### 문제: API 호출 실패
**확인사항**:
1. `data/` 디렉토리 존재 확인
2. `data/services.json`, `data/channels.json` 파일 확인
3. 파일 권한 확인

## 📝 개발 팁

### 1. Hot Reload
파일 수정 시 자동으로 페이지가 새로고침됩니다.

### 2. 데이터 초기화
```bash
# 서비스 초기화
cp data/services.json data/services.json.backup
echo '[]' > data/services.json

# 채널 초기화
cp data/channels.json data/channels.json.backup
echo '[]' > data/channels.json
```

### 3. 로그 확인
```bash
# 서버 로그
tail -f .next/trace

# API 로그 (터미널에서 실시간 확인)
```

### 4. TypeScript 타입 체크
```bash
npm run build
```

## 🔒 보안 주의사항

### 절대 커밋하지 말 것
- `.env.local` 파일
- Google OAuth Secret
- API Keys

### .gitignore 확인
```
.env*.local
.env.local
```

## 🚀 프로덕션 배포

### Vercel 배포
1. GitHub에 푸시
2. Vercel 프로젝트 생성
3. 환경변수 설정 (위 값 모두 입력)
4. `NEXTAUTH_URL`을 프로덕션 URL로 변경
5. Google OAuth 리디렉션 URI에 프로덕션 URL 추가

### 환경변수 (Vercel)
```
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://yourdomain.vercel.app
ALLOWED_DOMAIN=snack24h.com
GEMINI_API_KEY=...
ANTHROPIC_API_KEY=...
```

## 📚 추가 리소스

- [NextAuth.js 문서](https://next-auth.js.org/)
- [Google OAuth 가이드](https://developers.google.com/identity/protocols/oauth2)
- [Gemini API 문서](https://ai.google.dev/docs)
- [Claude API 문서](https://docs.anthropic.com/)

## 🆘 도움이 필요하신가요?

문제가 지속되면:
1. 터미널 에러 로그 확인
2. 브라우저 콘솔 에러 확인
3. `.env.local` 값 다시 확인
4. 개발팀에 문의

---

**설정 완료 후 다음 단계**: Phase 2 구현을 위해 AI API 키 테스트
