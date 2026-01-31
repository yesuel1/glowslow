# 🌸 아모그램 (Amogram)

건강·미용·생활 정보를 공유하는 인스타그램 스타일 웹페이지

## 핵심 기능

1. **이미지 업로드** (최대 10개) + 키워드 입력
2. **AI 캡션 자동 생성** - 각 사진마다 개별 캡션 생성
3. **인스타그램 카드뉴스 스타일** - 사진을 넘기면 해당 사진의 캡션도 함께 표시
4. **응원 댓글 자동 작성** - 4명의 캐릭터가 응원 댓글 작성
5. **파스텔 컬러 UI** - 사진틀 효과와 부드러운 원형 디자인

## 응원 캐릭터 페르소나

- 💚 **건강맘**: 따뜻한 어머니 말투
- ✨ **미보님**: 전문가 선배 말투
- ⭐ **응원이**: 에너지 넘치는 친구
- 🌼 **포근이**: 포근한 할머니

## 기술 스택

- **Frontend**: HTML/CSS/JS (Vite)
- **AI**: Claude API
- **배포**: Cloudflare Pages
- **데이터**: JSON 파일 (MVP)
- **저장소**: https://github.com/yesuel1/glowslow
- **도메인**: glowslow.com

## 개발 환경 설정

```bash
# 의존성 설치
npm install

# .env 파일 생성 (Claude API 키 설정)
cp .env.example .env
# .env 파일을 열어서 VITE_CLAUDE_API_KEY에 본인의 API 키 입력

# 개발 서버 실행 (http://localhost:5173)
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm preview
```

### Claude API 키 발급 방법

1. https://console.anthropic.com/settings/keys 접속
2. API Key 생성
3. `.env` 파일에 키 입력
4. API 키가 없어도 더미 캡션으로 테스트 가능합니다

## 프로젝트 구조

```
src/
├── index.html           # 메인 HTML
├── css/
│   └── style.css       # 스타일시트 (파스텔 컬러)
├── js/
│   └── main.js         # 메인 JavaScript
└── data/
    └── posts.json      # 게시물 데이터
```

## 개발 로드맵

- ✅ **1단계**: 기본 피드 UI와 게시물 카드
- ✅ **2단계**: 사진+키워드 입력 → 캡션 생성 (Claude API)
- ✅ **3단계**: 응원 댓글 자동 생성 (4명의 캐릭터)
- ✅ **4단계**: 이미지 업로드 (최대 10개) + 슬라이더

## 주요 기능

### 📸 이미지 업로드
- 드래그 앤 드롭 또는 클릭하여 이미지 선택
- 최대 10개까지 업로드 가능
- 실시간 미리보기
- 개별 이미지 삭제 가능

### 🎨 인스타그램 스타일 슬라이더
- 좌우 버튼으로 사진 넘기기
- 터치/마우스 드래그로 스와이프
- 각 사진마다 개별 캡션 표시
- 사진틀 효과 (화이트 프레임)
- 인디케이터로 현재 위치 표시

### 🤖 AI 캡션 생성
- 각 사진마다 별도의 캡션 자동 생성
- 슬라이드를 넘기면 해당 사진의 캡션이 함께 표시됨
- Claude API 기반 자연스러운 문장 생성

## UI 무드

파스텔 컬러, 부드러운 원형 UI, 귀여운 이모지로 아모레 브랜드 느낌 구현

## 배포

Cloudflare Pages를 통해 배포됩니다. 자세한 배포 방법은 [DEPLOYMENT.md](./DEPLOYMENT.md)를 참고하세요.

**배포 URL**: https://glowslow.com
