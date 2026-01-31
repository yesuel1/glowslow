# 아모그램 배포 가이드

## 프로젝트 정보

- **저장소**: https://github.com/yesuel1/glowslow
- **도메인**: glowslow.com (Cloudflare 관리)
- **배포 플랫폼**: Cloudflare Pages

## 배포 설정

### GitHub 저장소 연결

```bash
git remote add origin https://github.com/yesuel1/glowslow.git
git push -u origin main
```

### Cloudflare Pages 설정

#### 1. 프로젝트 생성

1. https://dash.cloudflare.com 접속
2. **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**
3. GitHub 저장소 선택: `yesuel1/glowslow`

#### 2. 빌드 설정 (중요!)

```
프로젝트 이름: glowslow

Framework preset: Vite

Root directory: (비워두기)

Build command: npm run build

Build output directory: dist

Deploy command: (비워두기 - 매우 중요!)
```

⚠️ **주의**: Deploy command를 설정하면 배포가 실패합니다. 반드시 비워두세요!

#### 3. 환경 변수 (선택사항)

Claude API를 사용하려면:
- **Variable name**: `VITE_CLAUDE_API_KEY`
- **Value**: Claude API 키 (https://console.anthropic.com/settings/keys)

API 키가 없어도 더미 데이터로 작동합니다.

## 로컬 빌드

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview
```

## 배포 프로세스

### 자동 배포 (권장)

GitHub에 푸시하면 자동으로 배포됩니다:

```bash
git add .
git commit -m "Update feature"
git push
```

Cloudflare Pages가 자동으로:
1. 코드를 가져옴
2. `npm run build` 실행
3. `dist` 폴더를 배포

### 재배포 트리거

코드 변경 없이 재배포하려면:

```bash
git commit --allow-empty -m "Trigger rebuild"
git push
```

## 커스텀 도메인 연결

### glowslow.com 연결

1. Cloudflare Pages 프로젝트 대시보드
2. **Custom domains** 탭
3. **Set up a custom domain** 클릭
4. `glowslow.com` 입력 및 추가
5. `www.glowslow.com`도 추가 (선택사항)

도메인이 이미 Cloudflare에 있으므로 DNS 설정이 자동으로 처리됩니다.

## 트러블슈팅

### 배포 실패: "Missing entry-point" 에러

**원인**: Deploy command가 설정되어 있음

**해결**:
1. Settings > Builds & deployments > Edit configuration
2. Deploy command 필드를 완전히 비우기
3. Save

### 배포 실패: "Workers-specific command" 에러

**원인**: wrangler.toml 파일이 있거나 잘못된 deploy command

**해결**:
1. wrangler.toml 파일 삭제
2. Deploy command 비우기
3. Cloudflare Pages가 자동으로 배포하도록 설정

### 빌드는 성공했지만 배포 실패

**확인사항**:
- Build output directory가 `dist`로 설정되어 있는지
- Deploy command가 비어있는지
- Root directory가 비어있는지

## 빌드 출력 구조

```
dist/
├── index.html              # 메인 HTML (2.83 kB)
├── assets/
│   ├── index-*.css        # 스타일시트 (8.25 kB)
│   └── index-*.js         # JavaScript (9.08 kB)
└── images/                # 정적 이미지
```

## 배포 URL

- **프로덕션**: https://glowslow.pages.dev (또는 https://glowslow.com)
- **미리보기**: 각 PR마다 자동 생성

## 참고 자료

- Vite 문서: https://vitejs.dev/
- Cloudflare Pages 문서: https://developers.cloudflare.com/pages/
- Claude API 문서: https://docs.anthropic.com/
