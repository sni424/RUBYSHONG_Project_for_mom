import api from '@/api/axios';
import type {
  AuthUser,
  LoginPayload,
  LoginResponse,
  SendPhoneVerificationCodePayload,
  SignupPayload,
  VerifyPhoneCodePayload,
} from '@/constants/type';
import axios from 'axios';

interface AdminLoginPayload {
  email: string;
  password: string;
}

export const adminLogin = async (data: AdminLoginPayload) => {
  const response = await api.post('/api/admin/login', data);
  return response.data;
};

// 휴대폰 인증번호 발송
export const sendPhoneVerificationCode = async (payload: SendPhoneVerificationCodePayload) => {
  // 백엔드 휴대폰 인증번호 발송 API 요청
  const response = await api.post('/api/auth/phone/send-code', payload, {
    timeout: 10000,
  });
  console.log(response);

  // 서버 응답 반환
  return response.data;
};

// 휴대폰 인증번호 확인
export const verifyPhoneCode = async (payload: VerifyPhoneCodePayload) => {
  // 백엔드 휴대폰 인증번호 확인 API 요청
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/api/auth/phone/verify-code`,
    payload,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  // 서버 응답 반환
  return response.data;
};

// 회원가입
export const signup = async (payload: SignupPayload): Promise<AuthUser> => {
  // 백엔드 회원가입 API 요청
  const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/signup`, payload, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // 생성된 회원 정보 반환
  return response.data.data;
};

// 로그인
export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  // 백엔드 로그인 API 요청
  const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, payload, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // 로그인 토큰과 회원 정보 반환
  return response.data.data;
};

// 내 정보 조회
export const getMe = async (): Promise<AuthUser> => {
  // 로그인 토큰 가져오기
  const token = localStorage.getItem('userToken');

  // 백엔드 내 정보 조회 API 요청
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // 회원 정보 반환
  return response.data.data;
};
