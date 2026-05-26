import { CalendarDays, Info, MessageCircle, X } from 'lucide-react';
import type { Product } from '@/constants/type';

const formatPrice = (price: number) => `₩${price.toLocaleString()}`;

type ProductDetailModalProps = {
  product: Product | null;
  onClose: () => void;
};
const STORE_PHONE_NUMBER = '01033938107';

const ProductDetailModal = ({ product, onClose }: ProductDetailModalProps) => {
  if (!product) return null;

  // 모바일 기기인지 확인
  const isMobileDevice = () => {
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  };

  // iOS 기기인지 확인
  const isIOSDevice = () => {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent);
  };

  // 상담 예약 문자 보내기
  const handleReservationSms = () => {
    // PC에서는 문자 앱을 열 수 없으니 안내
    if (!isMobileDevice()) {
      alert('문자 상담은 모바일에서 이용해주세요.');
      return;
    }

    // 상품명이 포함된 문자 내용
    const message = `[루비숑 상담 예약]\n상품명: ${product.name}\n상담 예약을 문의드립니다.`;

    // iOS는 &body, Android는 ?body가 더 안정적
    const separator = isIOSDevice() ? '&' : '?';

    // 문자 앱 열기
    window.location.href = `sms:${STORE_PHONE_NUMBER}${separator}body=${encodeURIComponent(message)}`;
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 px-4 py-6"
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
            className="h-full max-h-[90vh] min-h-[360px] w-full object-cover"
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

          <div className="mt-8 rounded-sm bg-[#f2ece5] px-6 py-5">
            <p className="text-base font-semibold text-[#5a4d42]">상품 요약</p>
            <div className="mt-3 h-px w-20 bg-[#d8cbbd]" />
            <p className="mt-5 text-base leading-7 text-[#8a7b6f]">{product.summary}</p>
          </div>

          <div className="mt-6 flex items-start gap-3 border border-[#b9a895] px-5 py-4 text-[#8a7b6f]">
            <Info className="mt-1 shrink-0" size={22} strokeWidth={1.5} />
            <p className="text-sm leading-6">
              루비숑의 모든 제품은 오프라인 쇼룸에서 직접 착용 후 상담 및 구매가 가능합니다.
            </p>
          </div>

          <div className="mt-6 grid gap-3">
            <button
              type="button"
              onClick={handleReservationSms}
              className="flex h-13 items-center justify-center gap-3 bg-[#a77d49] text-base font-semibold text-white transition hover:bg-[#916c3e] cursor-pointer"
            >
              <CalendarDays size={21} strokeWidth={1.7} />
              상담 예약하기
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
