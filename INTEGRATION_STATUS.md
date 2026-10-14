# SAILING 통합 현황

이 문서는 현재 프로젝트 소스에서 확인한 구현 범위와 남은 연동 작업을 구분하기 위한 문서입니다.

## 프로젝트 기준

- `SAILING.zip`의 기존 Spring Boot 백엔드와 프로젝트 폴더 구조를 기준으로 작업했습니다.
- `Sailingg-main(4).zip`은 화면 디자인 참고용으로만 사용했습니다. 참고 프로젝트의 예시 공고·업체·댓글·채팅 기록을 실제 데이터처럼 복사하지 않았습니다.
- 업체 관련 기능과 경로는 `store` / `/stores`로 통일했습니다.
- 기존 `frontend/vite.config.ts` 설정을 유지하고, 개발 서버의 `/api` 요청이 `http://localhost:8080`으로 전달되도록 했습니다. 별도의 디자인용 설정 파일은 추가하지 않았습니다.
- 목록과 상세 화면은 서버 응답을 사용합니다. 연결할 API가 없거나 오류가 발생하면 로딩·빈 상태·오류 안내를 표시하며, 임의의 샘플 레코드를 성공 데이터처럼 보여주지 않습니다.

## 현재 백엔드에서 확인한 API

- `GET /api/users`
- `POST /api/users/signup/personal`
- `GET /api/users/check-login-id?loginId=...`
- `POST /api/users/login`
- `POST /api/companies/signup`
- `POST /api/stores/signup`
- `GET` / `PUT /api/users/me/personal`
- `GET` / `PUT /api/users/me/company`
- `GET` / `PUT /api/users/me/store`

## 백엔드에 추가 구현이 필요한 API

아래 경로는 프런트엔드가 호출하도록 준비되어 있지만, 현재 백엔드 소스에서 대응하는 조회·등록 컨트롤러를 확인하지 못했습니다. 따라서 이 API가 필요한 페이지는 현재 완성된 end-to-end 기능으로 간주하면 안 됩니다.

- `GET /api/home` — 홈 화면 요약 데이터
- `GET /api/jobs`, `GET /api/jobs/{jobId}`, `POST /api/jobs` — 채용공고
- `GET /api/companies`, `GET /api/companies/{companyId}` — 기업정보 목록·상세
- `GET /api/stores`, `GET /api/stores/{storeId}` — 업체정보 목록·상세
- `GET /api/talents` — 인재정보
- `GET /api/community`, `GET /api/community/{postId}`, `POST /api/community` — 커뮤니티
- `GET /api/chats`, `GET /api/chats/{chatRoomId}/messages`, `POST /api/chats/{chatRoomId}/messages` — 채팅

현재 커뮤니티의 백엔드 컨트롤러 및 서비스 파일은 비어 있는 상태입니다. API 구현 후 프런트엔드 요청·응답 DTO를 실제 스키마와 대조해야 합니다.

## 서버에 저장되지 않는 현재 UI 입력

- 프로필 이미지와 인증 서류는 파일 선택 및 화면 미리보기만 제공하며 업로드 API는 연결되지 않았습니다.
- 기업 추가 담당자는 현재 화면 상태에만 보관됩니다. 추가 담당자를 서버에 저장하는 API는 연결되지 않았습니다.
- 로그인 페이지의 아이디·비밀번호 찾기는 아직 구현되지 않았으므로 동작하는 버튼처럼 표시하지 않습니다.

## 검증 메모

- TypeScript/TSX의 문법 진단을 수행했습니다.
- 상대 경로 import 파일 존재 여부를 검사했습니다.
- 전체 빌드는 이 작업 환경에 프런트엔드 의존성이 설치되지 않아 완료하지 못했습니다. `vite/client` 및 `node` 타입 정의가 없는 상태였으므로, 로컬에서 `npm ci` 후 `npm run build`를 실행해 최종 빌드를 확인해야 합니다.
