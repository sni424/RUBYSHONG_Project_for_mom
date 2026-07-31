// src/stores/productInquiryStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
