import type { CreateOrderPayload, CreateOrderResponse } from '@/constants/type';
import axios from 'axios';

export const createOrder = async (payload: CreateOrderPayload): Promise<CreateOrderResponse> => {
  // 백엔드 주문 생성 API 요청
  const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/orders`, payload, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // 생성된 주문 결제 요청 정보 반환
  return response.data.data;
};
