# Store Shift Planner

매장 직원의 날짜·구역별 근무 일정을 확인하는 웹 애플리케이션입니다.

## 주요 기능

- 날짜별 근무 일정 조회
- 구역별 근무 인원 요약 (계산대, 진열, 창고, 고객 응대)
- 구역 필터 및 타임라인 형태의 근무 목록
- 근무 카드 선택 시 직원 상세 정보 및 메모 등록

## 기술 스택

- Next.js 16, React 19, TypeScript
- Tailwind CSS 4
- Zustand

## 시작하기

```bash
npm install
npm run dev

## 프로젝트 구조
src/
├── app/          # Next.js 페이지, 레이아웃
├── entities/     # Shift 타입, mock 데이터
├── features/shifts/  # 날짜 선택, 필터, 목록, 상세, store, utils
└── widgets/      # 대시보드 조합

## 데이터
현재는 src/entities/shift.ts의 mock 데이터를 사용합니다.
메모는 브라우저 세션 동안만 유지됩니다.