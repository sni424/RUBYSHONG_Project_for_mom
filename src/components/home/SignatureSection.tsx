import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

import 'swiper/css';
import 'swiper/css/navigation';

import { getProducts } from '@/api/productApi';
import type { Product } from '@/constants/type';
import ProductDetailModal from '@/components/modals/ProductDetailModal';

const SignatureSection = () => {
  // 시그니처 영역에 보여줄 상품 목록
  const [products, setProducts] = useState<Product[]>([]);

  // 상품 목록 로딩 상태
  const [isLoading, setIsLoading] = useState(true);

  // 상세로 볼 상품
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // 첫 진입 시 상품 목록 조회
  useEffect(() => {
    let isMounted = true;

    // 상품 목록 API 요청
    getProducts()
      .then((data) => {
        // 컴포넌트가 사라진 뒤에는 state 변경 막기
        if (!isMounted) return;

        // 현재는 베스트 상품 관리가 없으므로 최신 상품 8개만 사용
        setProducts(data.slice(0, 8));
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        if (!isMounted) return;

        // 상품 목록 로딩 종료
        setIsLoading(false);
      });

    // 언마운트 시 비동기 응답 무시
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <h2 className="mb-10 text-center font-display text-sm tracking-[0.18em] text-text-primary">
          SIGNATURE PRODUCT
        </h2>

        {isLoading ? (
          <div className="py-16 text-center text-sm text-text-secondary">
            상품을 불러오는 중입니다.
          </div>
        ) : (
          <div className="relative">
            <button className="signature-prev absolute left-0 top-1/2 z-10 hidden -translate-x-10 -translate-y-1/2 text-text-primary transition hover:text-accent lg:block">
              <FiChevronLeft size={34} strokeWidth={1} />
            </button>

            <Swiper
              modules={[Navigation]}
              navigation={{
                prevEl: '.signature-prev',
                nextEl: '.signature-next',
              }}
              spaceBetween={20}
              slidesPerView={2}
              breakpoints={{
                768: {
                  slidesPerView: 3,
                },
                1024: {
                  slidesPerView: 4,
                },
              }}
            >
              {products.map((product) => (
                <SwiperSlide key={product.id}>
                  <SignatureCard product={product} onClick={() => setSelectedProduct(product)} />
                </SwiperSlide>
              ))}
            </Swiper>

            <button className="signature-next absolute right-0 top-1/2 z-10 hidden translate-x-10 -translate-y-1/2 text-text-primary transition hover:text-accent lg:block">
              <FiChevronRight size={34} strokeWidth={1} />
            </button>
          </div>
        )}
      </div>
      <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </section>
  );
};

type SignatureCardProps = {
  product: Product;
  onClick: () => void;
};

const SignatureCard = ({ product, onClick }: SignatureCardProps) => {
  return (
    <article
      className="relative bg-surface transition hover:-translate-y-1   cursor-pointer"
      onClick={onClick}
    >
      <img
        src={product.thumbnailUrl}
        alt={product.name}
        className="h-55 w-full object-cover md:h-65"
      />

      <div className="relative px-5 pb-5 pt-4">
        <h3 className="font-display text-sm text-text-primary">{product.name}</h3>
        <p className="mt-2 text-xs text-text-secondary">{product.summary}</p>

        {/* <button
          type="button"
          className="absolute bottom-5 right-5 flex h-6 w-6 items-center justify-center rounded-full border border-line text-text-muted transition hover:border-accent hover:text-accent"
        >
          <FiPlus size={14} />
        </button> */}
      </div>
    </article>
  );
};

export default SignatureSection;
