import type { AdminCustomerDetail, AdminCustomerListItem } from '@/constants/type';
import axios from 'axios';

// 관리자 고객 목록 조회
export const getAdminCustomers = async (): Promise<AdminCustomerListItem[]> => {
  // 관리자 토큰 가져오기
  const token = localStorage.getItem('adminToken');

  // 백엔드 관리자 고객 목록 API 요청
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/customers/admin`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // 서버에서 받은 고객 목록 반환
  return response.data.data;
};

// 관리자 고객 상세 조회
export const getAdminCustomerById = async (customerId: number): Promise<AdminCustomerDetail> => {
  // 관리자 토큰 가져오기
  const token = localStorage.getItem('adminToken');

  // 백엔드 관리자 고객 상세 API 요청
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/customers/admin/${customerId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  // 서버에서 받은 고객 상세 정보 반환
  return response.data.data;
};
