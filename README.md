# 이미지 단어 추출기 (Image Word Extractor)

이미지에서 단어를 추출하고 관리하는 웹 애플리케이션입니다. 카메라로 찍거나 이미지를 업로드하여 단어를 추출하고 저장할 수 있습니다.

## ✨ 주요 기능

- **이미지 업로드**

  - 드래그 앤 드롭 지원
  - 다중 파일 선택
  - 이미지 미리보기
  - 파일 크기 및 형식 검증

- **단어 추출**

  - 이미지에서 단어 자동 인식
  - 추출된 단어 목록 표시
  - 단어 저장 및 관리

- **반응형 디자인**
  - 모바일, 태블릿, 데스크톱 지원
  - 직관적인 사용자 인터페이스

## 🚀 시작하기

### 필수 조건

- Node.js 18.0.0 이상
- npm 또는 yarn
- Supabase 계정

### 설치

1. 저장소 클론

```bash
git clone [repository-url]
cd [project-directory]
```

2. 의존성 설치

```bash
npm install
# or
yarn install
```

3. 환경 변수 설정
   `.env.local` 파일을 생성하고 다음 변수들을 설정합니다:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. 개발 서버 실행

```bash
npm run dev
# or
yarn dev
```

## 🛠️ 기술 스택

- **프론트엔드**

  - Next.js 15
  - TypeScript
  - Tailwind CSS
  - Jotai (상태 관리)
  - tanstack-query

- **백엔드**
  - Supabase
    - Storage (이미지 저장)
    - Database (단어 데이터 저장)

## 📝 사용 방법

1. **이미지 업로드**

   - 드래그 앤 드롭으로 이미지 파일을 업로드하거나
   - "파일 선택" 버튼을 클릭하여 이미지 선택

2. **단어 추출**

   - 업로드된 이미지에서 "단어" 버튼 클릭
   - 추출된 단어 목록 확인

3. **단어 저장**
   - "SAVE" 버튼을 클릭하여 추출된 단어 저장
   - 저장된 단어는 Supabase 데이터베이스에 저장됨

## 🔧 환경 변수

프로젝트를 실행하기 위해 필요한 환경 변수들:

| 변수                            | 설명                  |
| ------------------------------- | --------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase 프로젝트 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 익명 키      |
