# 중앙 센터 홈페이지 — Supabase 백엔드 연결판

## 구성
- `index.html`: 기존 홈페이지 + Supabase 인증/공지사항 연동
- `supabase/schema.sql`: 사용자 프로필, 공지사항 테이블 및 RLS 보안 정책
- `vercel.json`: Vercel 정적 배포 설정

## 1. Supabase 프로젝트 준비
1. https://supabase.com 에서 새 프로젝트를 생성합니다.
2. 프로젝트의 SQL Editor에서 `supabase/schema.sql` 전체를 실행합니다.
3. Project Settings → API에서 Project URL과 anon/public key를 확인합니다.
4. `index.html` 상단의 아래 두 값을 실제 값으로 교체합니다.
   - `YOUR_SUPABASE_URL`
   - `YOUR_SUPABASE_ANON_KEY`

`anon/public key`는 브라우저에 노출되는 키입니다. 이 키만으로 관리자 권한을 얻을 수 없도록 RLS 정책이 적용되어 있습니다. `service_role` 키는 절대 HTML이나 GitHub에 넣지 마세요.

## 2. 관리자 계정 생성
1. Supabase Dashboard → Authentication → Users에서 관리자 이메일로 사용자를 생성합니다.
2. SQL Editor에서 아래 쿼리를 실행하고 이메일을 실제 주소로 바꿉니다.

```sql
update public.profiles
set role = 'admin'
where id = (select id from auth.users where email = 'admin@example.com');
```

일반 사용자는 `user` 권한이며 공지 작성 기능이 표시되지 않습니다. 관리자만 공지사항을 등록할 수 있습니다.

## 3. Vercel 배포
1. 수정한 프로젝트 폴더를 GitHub 저장소에 올립니다.
2. Vercel에서 Add New → Project로 저장소를 가져옵니다.
3. Framework Preset은 Other로 선택합니다. Build Command와 Output Directory는 비워 둡니다.
4. Deploy를 누릅니다.
5. Supabase Authentication의 URL Configuration에서 Site URL과 Redirect URLs에 배포한 Vercel 주소를 추가합니다.

## 4. 현재 연결된 기능
- Supabase 이메일/비밀번호 로그인 및 로그아웃
- 로그인한 사용자의 프로필 권한 확인
- Supabase DB에서 공지사항 실시간 조회
- 관리자 전용 공지사항 등록
- RLS(Row Level Security)를 통한 데이터 접근 제어

## 주의
- Supabase 프로젝트 생성과 키 입력은 소유자 계정으로 직접 진행해야 합니다. 이 패키지에는 실제 계정 키가 포함되어 있지 않습니다.
- 회원가입 화면은 제공하지 않습니다. 관리자/관계자 계정은 Supabase Dashboard에서 생성하세요.
- 현재 프로필에는 역할 정보만 저장합니다. 실제 센티넬·가이드 개인정보, 검시 결과, 건강정보 등 민감한 데이터를 수집하거나 저장하도록 구성하지 않았습니다.
- `index.html`에서 키를 설정하기 전에는 공지사항 연동과 로그인이 동작하지 않습니다.
