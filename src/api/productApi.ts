import type { Product } from '@/constants/type';
import axios from 'axios';

// 상품 목록 가져오기
export const getProducts = async (): Promise<Product[]> => {
  // 백엔드 상품 목록 API 요청
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`);

  // 서버에서 받은 상품 배열 반환
  return response.data.data;
};

// 카테고리별 상품 가져오기
export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  // 백엔드 카테고리 상품 목록 API 요청
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/products/category/${category}`,
  );

  // 서버에서 받은 상품 배열 반환
  return response.data.data;
};

// 상품 상세 가져오기
export const getProductById = async (productId: number): Promise<Product> => {
  // 백엔드 상품 상세 API 요청
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/${productId}`);

  // 서버에서 받은 상품 상세 데이터 반환
  return response.data.data;
};

// 이미지 업로드
export const uploadProductImage = async (file: File) => {
  // 이미지 업로드용 FormData 생성
  const uploadFormData = new FormData();

  // 백엔드 multer 필드명과 맞추기
  uploadFormData.append('image', file);

  // 이미지 업로드 요청
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products/image`, {
    method: 'POST',
    body: uploadFormData,
  });

  // 서버 에러 내용 확인
  if (!response.ok) {
    const errorText = await response.text();
    console.error('이미지 업로드 실패:', response.status, errorText);
    throw new Error(`이미지 업로드 실패: ${response.status}`);
  }

  // 서버 응답 데이터
  const result = await response.json();

  // 서버에서 받은 이미지 URL 반환
  return result.data.imageUrl;
};

export type CreateProductPayload = {
  name: string;
  category: string;
  price: number;
  discountRate: number;
  finalPrice: number | null;
  stock: number;
  status: string;
  summary: string;
  description: string;
  thumbnailUrl: string;
};

// 상품 등록
export const createProduct = async (productData: CreateProductPayload) => {
  const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/products`, productData, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response.data.data;
};
