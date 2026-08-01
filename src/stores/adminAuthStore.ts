import { create } from 'zustand';

type AdminAuthState = {
  // 관리자 로그인 여부
  isAdminLoggedIn: boolean;

  // 저장된 관리자 토큰 확인
  checkAdminAuth: () => void;

  // 관리자 로그인 성공 시 토큰 저장
  loginAdmin: (token: string) => void;

  // 관리자 로그아웃 처리
  logoutAdmin: () => void;
};

export const useAdminAuthStore = create<AdminAuthState>((set) => ({
  isAdminLoggedIn: Boolean(localStorage.getItem('adminToken')),

  checkAdminAuth: () => {
    // localStorage에 관리자 토큰이 있는지 확인
    const token = localStorage.getItem('adminToken');

    set({
      isAdminLoggedIn: Boolean(token),
    });
  },

  loginAdmin: (token: string) => {
    // 관리자 토큰 저장
    localStorage.setItem('adminToken', token);

    // 관리자 로그인 상태 반영
    set({
      isAdminLoggedIn: true,
    });
  },

  logoutAdmin: () => {
    // 관리자 토큰 삭제
    localStorage.removeItem('adminToken');

    // 관리자 로그인 상태 초기화
    set({
      isAdminLoggedIn: false,
    });
  },
}));
