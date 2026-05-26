// 상품 타입
export type Product = {
  id: number;
  name: string;
  slug: string;
  category: string;

  // 원가
  price: number;

  // 최종 판매 가격
  finalPrice: number;

  // 할인율
  discountRate: number;

  // 짧은 설명
  summary: string;

  // 상세 설명
  description: string;

  // Azure Blob 이미지 URL
  thumbnailUrl: string;

  // 신상품 여부
  isNew: boolean;

  // 베스트 상품 여부
  isBest: boolean;

  // 노출 여부
  isVisible: boolean;

  // 재고
  stock: number;

  // 상품 상태
  status: 'selling' | 'soldout' | 'hidden';

  // 생성일
  createdAt: string;

  // 수정일
  updatedAt: string;
};

export type ProductFormData = {
  name: string;
  category: string;
  price: string;
  discountRate: string;
  finalPrice: string;
  stock: string;
  status: Product['status'];
  summary: string;
  description: string;
};

// 상품 상태 타입
export type ProductStatus = Product['status'];

// 상품 등록 요청 타입
export type CreateProductPayload = {
  name: string;
  category: string;
  price: number;
  finalPrice: number;
  discountRate: number;
  summary: string;
  description: string;
  thumbnailUrl: string;
  stock: number;
  status: ProductStatus;
};

// 상품 수정 요청 타입
export type UpdateProductPayload = CreateProductPayload & {
  isNew: boolean;
  isBest: boolean;
  isVisible: boolean;
};
