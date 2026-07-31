// src/stores/checkoutStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CheckoutItem = {
  productId: number;
  name: string;
  thumbnailUrl: string;
  price: number;
  quantity: number;
  stock: number;
};

type CheckoutState = {
  // 바로 결제 또는 장바구니 결제에서 사용할 상품 목록
  items: CheckoutItem[];

  // 결제 총 금액
  totalAmount: number;

  // 결제 상품 저장
  setCheckoutItems: (items: CheckoutItem[]) => void;

  // 결제 상품 초기화
  clearCheckout: () => void;
};

const calculateTotalAmount = (items: CheckoutItem[]) => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set) => ({
      items: [],
      totalAmount: 0,

      setCheckoutItems: (items) => {
        set({
          items,
          totalAmount: calculateTotalAmount(items),
        });
      },

      clearCheckout: () => {
        set({
          items: [],
          totalAmount: 0,
        });
      },
    }),
    {
      // 결제 페이지 새로고침 시 결제 상품 유지
      name: 'checkout-storage',
    },
  ),
);
