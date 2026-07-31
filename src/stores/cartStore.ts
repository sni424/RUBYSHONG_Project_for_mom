import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CartItem = {
  productId: number;
  name: string;
  thumbnailUrl: string;
  price: number;

  // 현재 장바구니 수량
  quantity: number;

  // 상품 재고
  stock: number;
};

type CartState = {
  // 장바구니 상품 목록
  items: CartItem[];

  // 장바구니 상품 개수
  totalQuantity: number;

  // 장바구니 총 금액
  totalAmount: number;

  // 장바구니에 상품 추가
  addItem: (item: CartItem) => void;

  // 상품 수량 변경
  updateQuantity: (productId: number, quantity: number) => void;

  // 상품 삭제
  removeItem: (productId: number) => void;

  // 장바구니 비우기
  clearCart: () => void;
};

const calculateCart = (items: CartItem[]) => {
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return {
    totalQuantity,
    totalAmount,
  };
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      totalQuantity: 0,
      totalAmount: 0,

      addItem: (item) => {
        set((state) => {
          const existingItem = state.items.find(
            (cartItem) => cartItem.productId === item.productId,
          );

          const nextItems = existingItem
            ? state.items.map((cartItem) => {
                if (cartItem.productId !== item.productId) {
                  return cartItem;
                }

                // 기존 수량 + 추가 수량이 재고를 넘지 않도록 제한
                const nextQuantity = Math.min(cartItem.quantity + item.quantity, cartItem.stock);

                return {
                  ...cartItem,
                  quantity: nextQuantity,
                };
              })
            : [
                ...state.items,
                {
                  ...item,
                  quantity: Math.min(item.quantity, item.stock),
                },
              ];

          return {
            items: nextItems,
            ...calculateCart(nextItems),
          };
        });
      },

      updateQuantity: (productId, quantity) => {
        set((state) => {
          const nextItems = state.items.map((item) => {
            if (item.productId !== productId) {
              return item;
            }

            // 수량은 최소 1, 최대 재고까지만 허용
            const nextQuantity = Math.max(1, Math.min(quantity, item.stock));

            return {
              ...item,
              quantity: nextQuantity,
            };
          });

          return {
            items: nextItems,
            ...calculateCart(nextItems),
          };
        });
      },

      removeItem: (productId) => {
        set((state) => {
          const nextItems = state.items.filter((item) => item.productId !== productId);

          return {
            items: nextItems,
            ...calculateCart(nextItems),
          };
        });
      },

      clearCart: () => {
        set({
          items: [],
          totalQuantity: 0,
          totalAmount: 0,
        });
      },
    }),
    {
      // 새로고침해도 장바구니 유지
      name: 'cart-storage',
    },
  ),
);
