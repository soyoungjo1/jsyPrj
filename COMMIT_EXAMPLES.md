# 커밋 메시지 예시

## 올바른 형식
```
<type>: <subject>
```

## 예시

### feat (새로운 기능) ✨(Introduce new features)
```
feat: 사용자 로그인 기능 추가
feat: 상품 목록 페이지 구현
feat: 다크모드 토글 기능 추가
```

### fix (버그 수정)	🐛(Fix a bug)
```
fix: 로그인 시 세션 만료 오류 수정
fix: 이미지 업로드 실패 문제 해결
fix: 모바일 반응형 레이아웃 오류 수정
```

### hotfix (긴급 수정) 🚑(Critical hotfix)
```
hotfix: 프로덕션 서버 다운 긴급 수정
hotfix: 결제 시스템 오류 긴급 패치
hotfix: 보안 취약점 긴급 수정
```

### docs (문서) 📝(Add or update documentation)
```
docs: README에 설치 방법 추가
docs: API 사용법 문서화
docs: 컴포넌트 사용 예시 추가
```

### style (코드 스타일) ⚡(Improve structure/format of the code)
```
style: 코드 포맷팅 수정
style: 불필요한 공백 제거
style: ESLint 경고 수정
```

### refactor (리팩토링) 🔥(Remove code or files)
```
refactor: 컴포넌트 구조 개선
refactor: API 호출 로직 분리
refactor: 상태 관리 로직 최적화
```

### perf (성능 개선) ⚡(Improve performance)
```
perf: 이미지 lazy loading 적용
perf: API 응답 캐싱 추가
perf: 번들 크기 최적화
```

### chore (빌드/설정) ⬆️(Upgrade dependencies)
```
chore: commitlint 및 husky 설정 추가
chore: ESLint 설정 추가
chore: 패키지 의존성 업데이트
chore: 빌드 스크립트 수정
chore: 환경 변수 설정 추가
```

### ci (CI/CD) 🚀(Deploy stuff)
```
ci: GitHub Actions 워크플로우 추가
ci: 자동 테스트 설정
ci: 배포 파이프라인 구성
```

### ticket (티켓 관련)
```
ticket: #123 사용자 프로필 수정 기능
ticket: #456 결제 시스템 통합
```

### revert (되돌리기) ⏪ (Revert Changes)
```
revert: feat: 사용자 로그인 기능 추가
revert: fix: 세션 만료 오류 수정
```

## 잘못된 예시 (커밋 실패)

❌ `커밋 메시지` - 타입 없음
❌ `update: 파일 수정` - 허용되지 않은 타입
❌ `feat` - subject 없음
❌ `FEAT: 대문자 사용` - 소문자 권장

## 올바른 예시

✅ `feat: 사용자 인증 기능 추가`
✅ `fix: 로그인 버그 수정`
✅ `docs: API 문서 업데이트`
✅ `style: 코드 포맷팅`

