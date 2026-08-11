# 김수정 포트폴리오

콘텐츠 기획 · 영상 촬영/편집 · 사진 · 디자인 · 바이브코딩 포트폴리오입니다.

## 현재 버전

초기 디자인 스냅샷을 보존하기 위한 baseline입니다. 긴 원페이지 스크롤 대신 분야 선택 → 모달/라이트박스 방식으로 탐색합니다.

## 구조

- `index.html` — 정적 부트스트랩
- `parts/` — 포트폴리오 화면 HTML 파트
- `styles.css` — 반응형 UI
- `app.js` — 모달, 탭, 미디어 프리뷰
- `vercel.json` — Vercel용 정적 배포 설정

대표 이미지와 영상은 YouTube / Google Drive 원본 링크를 사용합니다. 다음 디자인 개편에서 필요한 대표 에셋을 `assets/`로 로컬화할 예정입니다.

## Vercel 배포

GitHub 저장소를 Vercel에서 Import하고 Framework Preset을 `Other`로 두면 정적 사이트로 배포할 수 있습니다. 추후 커스텀 도메인을 Vercel Project Settings → Domains에서 연결합니다.
