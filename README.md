# 온길 (ONGIL)

온길 전용 저장소입니다. 제일솔루션 및 다른 프로젝트와 완전히 분리하여 관리합니다.

## 현재 상태

- 작명·개명: 조건 입력 후 이름 후보 6개 제공
- 이름풀이: 사업운·재물운·가족운·건강운 포함 상세풀이
- 좋은 날 택일: 목적과 기간에 따른 후보 6일 제공
- 제사지방: 관계별 문안 생성 및 인쇄
- 축문: 기제사·차례·묘제 한글 문안 생성 및 인쇄
- 저장함: 검색, 종류 필터, 개별 열기·삭제, 전체 JSON 백업·복원
- 결제: 현재 비활성화
- 도메인: `ongil.io.kr`
- 배포: GitHub Actions를 통한 GitHub Pages 자동 배포

## 저장소 구조

```text
ongil-site/
├─ index.html
├─ 404.html
├─ CNAME
├─ robots.txt
├─ sitemap.xml
├─ site.webmanifest
└─ assets/
   ├─ css/styles.css
   ├─ js/app.js
   └─ img/favicon.svg
```

## 데이터 저장 원칙

작성 결과는 서버가 아니라 사용자의 브라우저 `localStorage`에 저장합니다. 저장함에서 JSON 파일로 전체 백업하거나 복원할 수 있습니다. 개인정보, PortOne API Secret, KCP 인증서, 개인키 및 비밀번호는 이 공개 저장소에 저장하지 않습니다.

## 결제 재개 전 확인사항

1. 사업자등록번호·대표자·사업장 주소·통신판매업 신고정보 최종 입력
2. PortOne V2 운영 채널 키 확인
3. 별도 서버에서 결제금액·상태 검증 및 Webhook 처리
4. 환불정책과 이용약관 최종 검토
