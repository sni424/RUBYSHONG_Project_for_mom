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

// 예약 가능 시간 응답 타입
export type AvailableTimesResponse = {
  date: string;
  availableTimes: string[];
  reservedTimes: string[];
};

// 예약 생성 요청 타입
export type CreateReservationPayload = {
  name: string;
  phone: string;
  visitDate: string;
  visitTime: string;
  message?: string;
  privacyAgreed: boolean;
};

//어드민 예약 타입
export type Reservation = {
  id: number;
  name: string;
  phone: string;
  visitDate: string;
  visitTime: string;
  message?: string | null;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  privacyAgreed: boolean;
  createdAt: string;
  updatedAt: string;
};

// 문의 상태 타입
export type ContactInquiryStatus = 'pending' | 'answered' | 'closed';

// 문의 타입
export type ContactInquiry = {
  id: number;
  name: string;
  phone: string;
  title: string;
  message: string;
  status: ContactInquiryStatus;
  createdAt: string;
  updatedAt: string;
};

// 문의 등록 요청 타입
export type CreateContactPayload = {
  name: string;
  phone: string;
  title: string;
  message: string;
};

//제품 삭제 로그
export type ProductDeleteLog = {
  id: number;
  productId: number;
  productName: string;
  productSlug: string;
  deletedData: Record<string, unknown>;
  createdAt: string;
  deletedBy: {
    id: number;
    email: string;
    role: string;
  };
};

//문의 삭제 이력 조회
export type ContactInquiryDeleteLog = {
  id: number;
  contactInquiryId: number;
  title: string;
  name: string;
  phone: string;
  deletedData: Record<string, unknown>;
  createdAt: string;
  deletedBy: {
    id: number;
    email: string;
    role: string;
  };
};

export type SendPhoneVerificationCodePayload = {
  phone: string;
};

export type VerifyPhoneCodePayload = {
  phone: string;
  code: string;
};

export type SignupPayload = {
  name: string;
  email: string;
  password: string;
  phone: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type AuthUser = {
  id: number;
  email: string;
  name: string;
  phone: string | null;
  phoneVerified: boolean;
};

export type LoginResponse = {
  token: string;
  user: AuthUser;
};

export type CreateOrderItemPayload = {
  productId: number;
  quantity: number;
};

export type CreateOrderPayload = {
  items: CreateOrderItemPayload[];
  ordererName: string;
  ordererPhone: string;
  userId?: number;
};

export type CreateOrderResponse = {
  orderId: number;
  orderCode: string;
  orderName: string;
  amount: number;
};

export type AdminOrderStatus =
  | 'pending'
  | 'paid'
  | 'preparing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'failed'
  | 'refunded';

export type AdminOrderItem = {
  id: number;
  orderId: number;
  productId: number;
  productName: string;
  thumbnailUrl: string;
  price: number;
  quantity: number;
  amount: number;
  createdAt: string;
};

export type AdminOrderPayment = {
  id: number;
  orderId: number;
  paymentKey: string | null;
  tossOrderId: string;
  amount: number;
  status: string;
  method: string | null;
  approvedAt: string | null;
  failureReason: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AdminOrderUser = {
  id: number;
  email: string;
  name: string;
  phone: string | null;
};

export type AdminOrderHistory = {
  id: number;
  orderId: number;
  changedById: number | null;
  action: string;
  beforeData: unknown;
  afterData: unknown;
  createdAt: string;
  changedBy?: {
    id: number;
    email: string;
    role: string;
  } | null;
};

export type AdminOrder = {
  id: number;
  orderCode: string;
  userId: number | null;
  ordererName: string;
  ordererPhone: string;
  totalAmount: number;
  status: AdminOrderStatus;
  createdAt: string;
  updatedAt: string;
  user: AdminOrderUser | null;
  items: AdminOrderItem[];
  payment: AdminOrderPayment | null;
  histories?: AdminOrderHistory[];
};

export type AdminCustomerListItem = {
  id: number;
  email: string;
  name: string;
  phone: string | null;
  phoneVerified: boolean;
  provider: 'naver' | 'kakao' | null;
  providerId: string | null;
  orderCount: number;
  paidOrderCount: number;
  totalPaidAmount: number;
  lastOrderAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AdminCustomerDetail = AdminCustomerListItem & {
  orders: Array<{
    id: number;
    orderCode: string;
    status: string;
    totalAmount: number;
    ordererName: string;
    ordererPhone: string;
    createdAt: string;
    items: Array<{
      id: number;
      productName: string;
      quantity: number;
      price: number;
      amount: number;
      thumbnailUrl: string;
    }>;
  }>;
  reservations: Array<{
    id: number;
    name: string;
    phone: string;
    visitDate: string;
    visitTime: string;
    status: string;
    createdAt: string;
  }>;
  contactInquiries: Array<{
    id: number;
    name: string;
    phone: string;
    title: string;
    status: string;
    createdAt: string;
  }>;
  summary: {
    orderCount: number;
    paidOrderCount: number;
    totalPaidAmount: number;
    reservationCount: number;
    contactInquiryCount: number;
  };
};
