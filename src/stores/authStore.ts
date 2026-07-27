// src/stores/authStore.ts
import { create } from 'zustand';
import { getMe } from '@/api/auth';
import type { AuthUser } from '@/constants/type';

type AuthState = {
  // 현재 로그인한 회원 정보
  user: AuthUser | null;

  // 로그인 상태 확인 중인지 여부
  isLoading: boolean;

  // 로그인 여부
  isLoggedIn: boolean;

  // 앱 첫 진입 또는 새로고침 시 토큰으로 회원 정보 확인
  checkAuth: () => Promise<void>;

  // 일반 로그인 또는 SNS 로그인 성공 시 토큰 저장 후 회원 정보 조회
  loginWithToken: (token: string) => Promise<void>;

  // 로그아웃 처리
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  isLoggedIn: false,

  checkAuth: async () => {
    const token = localStorage.getItem('userToken');

    if (!token) {
      set({
        user: null,
        isLoading: false,
        isLoggedIn: false,
      });
      return;
    }

    try {
      // 저장된 토큰으로 현재 회원 정보 조회
      const user = await getMe();

      set({
        user,
        isLoading: false,
        isLoggedIn: true,
      });
    } catch {
      // 토큰이 만료되었거나 잘못된 경우 저장된 토큰 제거
      localStorage.removeItem('userToken');

      set({
        user: null,
        isLoading: false,
        isLoggedIn: false,
      });
    }
  },

  loginWithToken: async (token: string) => {
    // 로그인 토큰 저장
    localStorage.setItem('userToken', token);

    // 저장한 토큰으로 회원 정보 갱신
    await get().checkAuth();
  },

  logout: () => {
    // 로그인 토큰 삭제
    localStorage.removeItem('userToken');

    // 전역 로그인 상태 초기화
    set({
      user: null,
      isLoading: false,
      isLoggedIn: false,
    });
  },
}));
