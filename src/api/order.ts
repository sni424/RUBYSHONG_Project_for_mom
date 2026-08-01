import type {
  AdminOrder,
  AdminOrderStatus,
  CreateOrderPayload,
  CreateOrderResponse,
} from '@/constants/type';
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

// 관리자 주문 목록 조회
export const getAdminOrders = async (): Promise<AdminOrder[]> => {
  // 관리자 토큰 가져오기
  const token = localStorage.getItem('adminToken');

  // 백엔드 관리자 주문 목록 API 요청
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders/admin`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // 서버에서 받은 주문 목록 반환
  return response.data.data;
};

// 관리자 주문 상세 조회
export const getAdminOrderById = async (orderId: number): Promise<AdminOrder> => {
  // 관리자 토큰 가져오기
  const token = localStorage.getItem('adminToken');

  // 백엔드 관리자 주문 상세 API 요청
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders/admin/${orderId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // 서버에서 받은 주문 상세 반환
  return response.data.data;
};

// 관리자 주문 상태 변경
export const updateAdminOrderStatus = async (
  orderId: number,
  status: AdminOrderStatus,
): Promise<AdminOrder> => {
  // 관리자 토큰 가져오기
  const token = localStorage.getItem('adminToken');

  // 백엔드 관리자 주문 상태 변경 API 요청
  const response = await axios.patch(
    `${import.meta.env.VITE_API_URL}/api/orders/admin/${orderId}/status`,
    {
      status,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  // 수정된 주문 반환
  return response.data.data;
};

// 관리자 주문 환불 처리
export const refundAdminOrder = async (orderId: number): Promise<AdminOrder> => {
  // 관리자 토큰 가져오기
  const token = localStorage.getItem('adminToken');

  // 백엔드 관리자 주문 환불 API 요청
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/api/orders/admin/${orderId}/refund`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  // 환불 처리된 주문 반환
  return response.data.data;
};
