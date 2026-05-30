import type { ContactInquiry, ContactInquiryStatus, CreateContactPayload } from '@/constants/type';
import axios from 'axios';

// 문의 등록
export const createContactInquiry = async (contactData: CreateContactPayload) => {
  // 백엔드 문의 등록 API 요청
  const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/contacts`, contactData, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // 생성된 문의 데이터 반환
  return response.data.data;
};

// 관리자 문의 목록 가져오기
export const getAdminContactInquiries = async (): Promise<ContactInquiry[]> => {
  // 백엔드 관리자 문의 목록 API 요청
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/contacts/admin`);

  // 서버에서 받은 문의 배열 반환
  return response.data.data;
};

// 관리자 문의 상태 변경
export const updateContactInquiryStatus = async (
  inquiryId: number,
  status: ContactInquiryStatus,
) => {
  // 백엔드 관리자 문의 상태 변경 API 요청
  const response = await axios.patch(
    `${import.meta.env.VITE_API_URL}/api/contacts/admin/${inquiryId}/status`,
    {
      status,
    },
  );

  // 수정된 문의 데이터 반환
  return response.data.data;
};

// 관리자 문의 삭제
export const deleteContactInquiry = async (inquiryId: number) => {
  // 백엔드 관리자 문의 삭제 API 요청
  const response = await axios.delete(
    `${import.meta.env.VITE_API_URL}/api/contacts/admin/${inquiryId}`,
  );

  // 삭제 결과 반환
  return response.data;
};
