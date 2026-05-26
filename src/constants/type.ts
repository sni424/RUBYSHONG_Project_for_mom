// 상품 타입
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
