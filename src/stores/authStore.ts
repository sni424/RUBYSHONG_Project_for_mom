// src/stores/authStore.ts
import { create } from 'zustand';
import { getMe } from '@/api/auth';
import type { AuthUser } from '@/constants/type';
import { persist } from 'zustand/middleware';

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

type ProductInquiry = {
  id: number;
  name: string;
  category: string;
  price: number;
  summary: string;
};

type ProductInquiryState = {
  // 현재 문의하려는 상품 정보
  productInquiry: ProductInquiry | null;

  // 상품 문의 정보 저장
  setProductInquiry: (product: ProductInquiry) => void;

  // 상품 문의 정보 초기화
  clearProductInquiry: () => void;
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

//제품 문의하기 전역처리
export const useProductInquiryStore = create<ProductInquiryState>()(
  persist(
    (set) => ({
      productInquiry: null,

      setProductInquiry: (product) => {
        set({
          productInquiry: product,
        });
      },

      clearProductInquiry: () => {
        set({
          productInquiry: null,
        });
      },
    }),
    {
      // 새로고침해도 Contact 페이지에서 상품 정보 유지
      name: 'product-inquiry-storage',
    },
  ),
);
