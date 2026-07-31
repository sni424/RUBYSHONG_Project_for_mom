import { CalendarDays, CreditCard, Info, MessageCircle, ShoppingBag, X } from 'lucide-react';
import type { Product } from '@/constants/type';
import { useNavigate } from 'react-router';

import { useCartStore } from '@/stores/cartStore';
import { useProductInquiryStore } from '@/stores/productInquiryStore';

const formatPrice = (price: number) => `₩${price.toLocaleString()}`;

type ProductDetailModalProps = {
  product: Product | null;
  onClose: () => void;
};
// const STORE_PHONE_NUMBER = '01033938107';

const ProductDetailModal = ({ product, onClose }: ProductDetailModalProps) => {
  const navigate = useNavigate();
  const setProductInquiry = useProductInquiryStore((state) => state.setProductInquiry);

  const addItem = useCartStore((state) => state.addItem);

  if (!product) return null;

  const isSoldOut = product.stock <= 0;

  // 재고 없음 안내
  const showSoldOutAlert = () => {
    alert('재고가 없는 상품입니다.');
  };

  // // 모바일 기기인지 확인
  // const isMobileDevice = () => {
  //   return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  // };

  // // iOS 기기인지 확인
  // const isIOSDevice = () => {
  //   return /iPhone|iPad|iPod/i.test(navigator.userAgent);
  // };

  // 상담 예약 문자 보내기
  const handleReservationSms = () => {
    // 문의할 상품 정보 전역 저장
    setProductInquiry({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.finalPrice,
      summary: product.summary,
    });

    // 문의 페이지로 이동
    navigate('/contact');
  };

  // 장바구니에 상품 담기
  const handleAddToCart = () => {
    if (isSoldOut) {
      showSoldOutAlert();
      return;
    }

    addItem({
      productId: product.id,
      name: product.name,
      thumbnailUrl: product.thumbnailUrl,
      price: product.finalPrice,
      quantity: 1,
      stock: product.stock,
    });
    alert('장바구니에 담았습니다.');
  };

  // 바로 결제 페이지로 이동
  const handleBuyNow = () => {
    if (isSoldOut) {
      showSoldOutAlert();
      return;
    }

    navigate('/checkout');
  };

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/45 px-4 py-6"
      onClick={onClose}
    >
      <div
        className="relative grid max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-sm bg-[#fbf8f4] shadow-2xl md:grid-cols-[1fr_0.9fr]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 text-[#7a6a5b] transition hover:text-[#2f2924]"
          aria-label="상품 상세 닫기"
        >
          <X size={34} strokeWidth={1.3} />
        </button>

        <div className="bg-[#eee5da]">
          <img
            src={product.thumbnailUrl}
            alt={product.name}
            className="h-full max-h-[90vh] min-h-90 w-full object-cover"
          />
        </div>

        <div className="px-6 py-12 sm:px-10 md:px-12">
          <p className="text-xs font-semibold uppercase tracking-[0.45em] text-[#a28f7d]">
            {product.category}
          </p>

          <h2 className="mt-8 font-serif text-3xl leading-tight text-[#342b24] md:text-5xl">
            {product.name}
          </h2>

          <p className="mt-6 whitespace-pre-line text-base leading-8 text-[#8a7b6f]">
            {product.description}
          </p>

          <div className="my-8 h-px bg-[#dfd4c8]" />

          <p className="font-serif text-3xl text-[#3a3028] md:text-4xl">
            {formatPrice(product.finalPrice)}
          </p>
          <div className="mt-4 flex items-center gap-3 text-sm">
            {product.stock > 0 ? (
              <>
                <span className="inline-flex h-8 items-center border border-[#d8cbbd] px-3 text-[#6f6258]">
                  재고 {product.stock}개
                </span>

                {product.stock <= 3 && <span className="text-[#a77d49]">소량 남음</span>}
              </>
            ) : (
              <span className="inline-flex h-8 items-center border border-red-200 bg-red-50 px-3 text-red-600">
                품절
              </span>
            )}
          </div>
          <div className="mt-8 rounded-sm bg-[#f2ece5] px-6 py-5">
            <p className="text-base font-semibold text-[#5a4d42]">상품 요약</p>
            <div className="mt-3 h-px w-20 bg-[#d8cbbd]" />
            <p className="mt-5 text-base leading-7 text-[#8a7b6f]">{product.summary}</p>
          </div>

          <div className="mt-6 flex items-start gap-3 border border-[#b9a895] px-5 py-4 text-[#8a7b6f]">
            <Info className="mt-1 shrink-0" size={22} strokeWidth={1.5} />
            <p className="text-sm leading-6">
              루비숑의 모든 제품은 오프라인에서 착용 후 상담 가능합니다.
            </p>
          </div>

          <div className="mt-6 grid gap-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={handleAddToCart}
                className={`flex h-13 items-center justify-center gap-3 border border-[#a98f73] text-base font-semibold transition ${
                  isSoldOut
                    ? 'cursor-not-allowed opacity-40'
                    : 'cursor-pointer text-[#4c3d31] hover:bg-[#f2ece5]'
                }`}
              >
                <ShoppingBag size={21} strokeWidth={1.7} />
                장바구니 담기
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                className={`flex h-13 items-center justify-center gap-3 bg-[#a77d49] text-base font-semibold text-white transition ${
                  isSoldOut ? 'cursor-not-allowed opacity-40' : 'cursor-pointer hover:bg-[#916c3e]'
                }`}
              >
                <CreditCard size={21} strokeWidth={1.7} />
                바로 결제하기
              </button>
            </div>
            <button
              type="button"
              onClick={handleReservationSms}
              className="flex h-13 items-center justify-center gap-3  text-base font-semibold border border-[#a98f73] text-[#4c3d31] transition hover:bg-[#f2ece5] cursor-pointer"
            >
              <CalendarDays size={21} strokeWidth={1.7} />
              제품 문의하기
            </button>

            <a
              type="button"
              href="http://pf.kakao.com/_qHBbX/chat"
              className="flex h-13 items-center justify-center gap-3 border border-[#a98f73] text-base font-semibold text-[#4c3d31] transition hover:bg-[#f2ece5] cursor-pointer"
            >
              <MessageCircle size={21} strokeWidth={1.7} />
              카카오톡 상담
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
