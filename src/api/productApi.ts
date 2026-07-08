import type {
  CreateProductPayload,
  Product,
  ProductDeleteLog,
  UpdateProductPayload,
} from '@/constants/type';
import axios from 'axios';

export type ProductSearchParams = {
  category?: string;
  search?: string;
};

// 상품 목록 가져오기
export const getProducts = async (params?: ProductSearchParams): Promise<Product[]> => {
  //토큰 확인
  const token = localStorage.getItem('adminToken');

  // 백엔드 상품 목록 API 요청
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`, {
    params: {
      ...(params?.category ? { category: params.category } : {}),
      ...(params?.search ? { search: params.search } : {}),
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // 서버에서 받은 상품 배열 반환
  return response.data.data;
};

// 카테고리별 상품 가져오기
export const getProductsByCategory = async (
  category: string,
  search?: string,
): Promise<Product[]> => {
  // 백엔드 카테고리 상품 목록 API 요청
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/products/category/${category}`,
    {
      params: {
        ...(search ? { search } : {}),
      },
    },
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

// 상품 등록
export const createProduct = async (productData: CreateProductPayload) => {
  const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/products`, productData, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response.data.data;
};

// 상품 수정
export const updateProduct = async (productId: number, productData: UpdateProductPayload) => {
  // 백엔드 상품 수정 API 요청
  const response = await axios.patch(
    `${import.meta.env.VITE_API_URL}/api/products/${productId}`,
    productData,
  );

  // 수정된 상품 데이터 반환
  return response.data.data;
};

// 상품 삭제
export const deleteProduct = async (productId: number) => {
  // 관리자 토큰 가져오기
  const token = localStorage.getItem('adminToken');

  // 백엔드 상품 삭제 API 요청
  const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/products/${productId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // 삭제 결과 반환
  return response.data;
};

// 상품 삭제 이력 가져오기
export const getProductDeleteLogs = async (): Promise<ProductDeleteLog[]> => {
  // 관리자 토큰 가져오기
  const token = localStorage.getItem('adminToken');

  // 백엔드 상품 삭제 이력 API 요청
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/products/admin/delete-logs`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  // 서버에서 받은 삭제 이력 배열 반환
  return response.data.data;
};
