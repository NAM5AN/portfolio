# 김수정 포트폴리오

콘텐츠 기획 · 영상 촬영/편집 · 사진 · 디자인 · AI/바이브코딩 포트폴리오입니다.

## 구조

- `index.html` — 한 화면형 포트폴리오 인덱스 + 내부 모달
- `site-v2.css` — 반응형 UI
- `site-v2.js` — 카테고리, 내부 문서 리더, 미디어/갤러리 뷰어
- `vercel.json` — 추후 Vercel 정적 배포 설정

사이트는 긴 원페이지 스크롤 대신 `Featured / Video / Planning / Photography / Design / AI & Build / Resume`를 모달로 탐색합니다.

기획 문서·이력·디자인 자료는 외부 원문 페이지로 이동시키지 않고 사이트 내부에서 확인하도록 구성합니다. 영상 작업은 YouTube만 외부 링크를 허용합니다.

## 배포

현재 GitHub Pages에서 `main` 브랜치 루트를 배포합니다. 추후 Vercel에 이 저장소를 Import하고 커스텀 도메인을 연결할 수 있습니다.
