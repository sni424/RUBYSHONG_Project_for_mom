// src/api/paymentApi.ts
import axios from 'axios';

export type ConfirmPaymentPayload = {
  paymentKey: string;
  orderCode: string;
  amount: number;
};

export const confirmPayment = async (payload: ConfirmPaymentPayload) => {
  // 백엔드 결제 승인 API 요청
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/api/payments/confirm`,
    payload,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  // 결제 승인 결과 반환
  return response.data.data;
};
