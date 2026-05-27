// src/api/reservationApi.ts
import type { AvailableTimesResponse, CreateReservationPayload } from '@/constants/type';
import axios from 'axios';

// 예약 가능한 시간 조회
export const getAvailableTimes = async (date: string): Promise<AvailableTimesResponse> => {
  // 선택한 날짜의 예약 가능 시간 조회
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/reservations/available-times`,
    {
      params: {
        date,
      },
    },
  );

  // 서버에서 받은 예약 가능 시간 데이터 반환
  return response.data.data;
};

// 예약 생성
export const createReservation = async (reservationData: CreateReservationPayload) => {
  // 예약 생성 API 요청
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/api/reservations`,
    reservationData,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  // 생성된 예약 데이터 반환
  return response.data.data;
};
