<div align="center">

# RUBYSHONG

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

</div>

<br />

> 엄마의 주얼리 브랜드 운영을 위해 만든 쇼핑몰 웹 애플리케이션입니다.  
> 상품 소개, 방문 예약, 고객 문의, 관리자 페이지까지 실제 운영 흐름을 생각하며 구현했습니다.

<div align="center">

[🔗 배포 사이트 바로가기](https://rubyshong.vercel.app/)

</div>

<br />

## 목차

- [프로젝트 소개](#프로젝트-소개)
- [주요 기능](#주요-기능)
- [기술 스택](#기술-스택)
- [화면 구성](#화면-구성)
- [프로젝트에서 신경 쓴 부분](#프로젝트에서-신경-쓴-부분)

<br />

## 프로젝트 소개

RUBYSHONG은 주얼리 상품을 소개하고 고객이 방문 예약과 문의를 남길 수 있는 웹사이트입니다.

단순한 쇼핑몰 화면을 넘어서, 관리자가 상품을 등록하고 수정하며 예약과 문의를 관리할 수 있도록 관리자 페이지도 함께 구현했습니다.  
상품 삭제 이력, 문의 삭제 이력, 예약 상태 관리 등 실제 운영 중 필요한 기능을 고려해 개발했습니다.

<br />

## 주요 기능

### 고객 기능

- 상품 목록 조회
- 카테고리별 상품 조회
- 상품 상세 페이지
- 방문 예약 신청
- 예약 가능 시간 확인
- 고객 문의 등록

### 관리자 기능

- 관리자 로그인
- 상품 등록, 수정, 삭제
- 상품 이미지 업로드
- 상품 삭제 이력 조회
- 예약 목록 조회
- 예약 상태 관리
- 문의 목록 조회
- 문의 상태 관리
- 문의 삭제 이력 조회
- 관리자 권한별 기능 제한

<br />

## 기술 스택

| 구분 | 스택 |
|---|---|
| Frontend | React, TypeScript, Vite, Tailwind CSS, Axios, React Router |

<br />

## 화면 구성

### 사용자 페이지

- 메인 페이지
- 상품 목록 페이지
- 상품 상세 페이지
- 방문 예약 페이지
- 문의 페이지

### 관리자 페이지

- 관리자 로그인
- 상품 관리
- 예약 관리
- 문의 관리
- 삭제 이력 관리

<br />

## 프로젝트에서 신경 쓴 부분

### 실제 운영을 고려한 관리자 기능

상품, 예약, 문의 데이터를 단순히 보여주는 것에서 끝내지 않고 관리자가 직접 운영할 수 있도록 등록, 수정, 삭제, 상태 변경 기능을 구현했습니다.

### 삭제 이력 관리

상품과 문의는 실제 삭제되지만, 누가 언제 어떤 데이터를 삭제했는지 확인할 수 있도록 삭제 로그를 따로 저장하고 관리자 페이지에서 조회할 수 있게 만들었습니다.

### 예약 시간 중복 방지

예약 가능한 시간을 정해두고, 이미 예약된 시간은 다시 선택할 수 없도록 처리했습니다.

### 관리자 권한 분리

관리자 역할을 구분하여 owner, manager, staff 권한에 따라 가능한 작업을 다르게 관리할 수 있도록 구성했습니다.

### 반응형 UI

관리자 페이지와 사용자 페이지 모두 데스크톱과 모바일 화면에서 사용할 수 있도록 반응형 UI를 고려했습니다.

<br />