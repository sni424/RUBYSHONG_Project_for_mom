import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { getProducts } from '@/api/productApi';
import type { Product } from '@/constants/type';
import collectionHero from '@/assets/images/collection/collection-hero.png';
import ProductDetailModal from '@/components/modals/ProductDetailModal';

const productCategories = [
  { label: '전체', value: '' },
  { label: '반지', value: 'ring' },
  { label: '목걸이', value: 'necklace' },
  { label: '귀걸이', value: 'earring' },
  { label: '팔찌', value: 'bracelet' },
];

const sortOptions = [
  { label: '최신순', value: 'latest' },
  { label: '낮은 가격순', value: 'lowPrice' },
  { label: '높은 가격순', value: 'highPrice' },
];

const formatPrice = (price: number) => `₩${price.toLocaleString()}`;

const CollectionPage = () => {
  // 서버에서 가져온 상품 목록
  const [products, setProducts] = useState<Product[]>([]);

  // 선택된 카테고리
  const [selectedCategory, setSelectedCategory] = useState('');

  // 선택된 정렬 방식
  const [selectedSort, setSelectedSort] = useState('latest');

  // 현재 페이지
  const [currentPage, setCurrentPage] = useState(1);

  // 상품 목록 로딩 상태
  const [isLoading, setIsLoading] = useState(true);

  // 상세로 볼 상품
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // 한 페이지에 보여줄 상품 개수
  const itemsPerPage = 12;

  // 카테고리별 상품 가져오기
  const fetchProducts = async (category = '') => {
    try {
      setIsLoading(true);

      // 백엔드 상품 목록 API 요청
      const data = await getProducts({
        category,
      });

      // 상품 목록 저장
      setProducts(data);

      // 카테고리 변경 시 첫 페이지로 이동
      setCurrentPage(1);
    } catch (error) {
      console.error(error);
      alert('상품 목록을 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 첫 진입 시 전체 상품 조회
  useEffect(() => {
    let isMounted = true;

    // 상품 목록 API 요청
    getProducts()
      .then((data) => {
        // 컴포넌트가 사라진 뒤에는 state 변경 막기
        if (!isMounted) return;

        // 상품 목록 저장
        setProducts(data);
      })
      .catch((error) => {
        if (!isMounted) return;

        console.error(error);
        alert('상품 목록을 불러오지 못했습니다.');
      })
      .finally(() => {
        if (!isMounted) return;

        // 초기 로딩 종료
        setIsLoading(false);
      });

    // 언마운트 시 비동기 응답 무시
    return () => {
      isMounted = false;
    };
  }, []);

  // 정렬된 상품 목록
  const sortedProducts = useMemo(() => {
    const copiedProducts = [...products];

    if (selectedSort === 'lowPrice') {
      return copiedProducts.sort((a, b) => a.finalPrice - b.finalPrice);
    }

    if (selectedSort === 'highPrice') {
      return copiedProducts.sort((a, b) => b.finalPrice - a.finalPrice);
    }

    return copiedProducts.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [products, selectedSort]);

  // 전체 페이지 수
  const totalPages = Math.max(Math.ceil(sortedProducts.length / itemsPerPage), 1);

  // 현재 페이지 상품 목록
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // 카테고리 변경
  const handleChangeCategory = (category: string) => {
    setSelectedCategory(category);
    fetchProducts(category);
  };

  return (
    <main className="bg-background text-text-primary">
      {/* Hero */}
      <section
        className="relative h-[520px] overflow-hidden bg-cover bg-center md:h-[600px]"
        style={{
          backgroundImage: `url(${collectionHero})`,
        }}
      >
        <div className="absolute inset-0 bg-linear-to-r from-background via-background/30 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-b from-white/20 via-transparent to-background/20" />

        <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-6 md:px-10">
          <div className="max-w-xl">
            <span className="mb-5 block font-display text-sm tracking-[0.35em] text-primary">
              RUBYSHONG COLLECTION
            </span>

            <h1 className="font-display text-5xl leading-tight tracking-wide text-text-primary md:text-7xl">
              Collection
            </h1>

            <div className="my-7 h-px w-20 bg-primary/50" />

            <p className="max-w-sm text-base leading-8 text-text-secondary">
              루비숑의 모든 컬렉션을 만나보세요.
              <br />
              시간이 지나도 변하지 않는 아름다움으로
              <br />
              당신의 가장 빛나는 순간을 완성합니다.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <div className="mb-12 grid gap-8 md:grid-cols-[160px_1fr_160px] md:items-center">
          <button className="flex items-center gap-3 text-xs font-medium uppercase">
            Category
            <ChevronDown size={15} />
          </button>

          <div className="flex justify-center gap-10 overflow-x-auto text-sm text-[#7a6f66]">
            {productCategories.map((category) => (
              <button
                key={`productCategories_${category.label}`}
                type="button"
                onClick={() => handleChangeCategory(category.value)}
                className={`whitespace-nowrap border-b pb-2 cursor-pointer ${
                  selectedCategory === category.value
                    ? 'border-[#2f2924] text-[#2f2924]'
                    : 'border-transparent'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          <label className="flex items-center justify-end gap-3 text-xs font-medium uppercase">
            Sort by
            <select
              value={selectedSort}
              onChange={(e) => {
                setSelectedSort(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent text-sm outline-none"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {isLoading ? (
          <div className="py-24 text-center text-sm text-[#7a6f66]">상품을 불러오는 중입니다.</div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
              {paginatedProducts.map((product) => (
                <article key={product.id} className="group">
                  <div className="relative aspect-square overflow-hidden bg-[#eee5da] cursor-pointer">
                    <img
                      src={product.thumbnailUrl}
                      alt={product.name}
                      onClick={() => setSelectedProduct(product)}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                    {/* <button
                      type="button"
                      className="absolute right-4 top-4 text-[#6f6258] transition hover:text-[#2f2924]"
                    >
                      <Heart size={20} />
                    </button> */}
                  </div>

                  <div className="mt-4">
                    <h2 className="font-serif text-lg text-[#2f2924]">{product.name}</h2>
                    <p className="mt-2 text-sm text-[#7a6f66]">14K Gold / Diamond</p>
                    <p className="mt-2 text-sm font-semibold text-[#2f2924]">
                      {formatPrice(product.finalPrice)}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            {paginatedProducts.length === 0 && (
              <div className="py-24 text-center text-sm text-[#7a6f66]">
                등록된 상품이 없습니다.
              </div>
            )}

            <div className="mt-16 flex items-center justify-center gap-8 text-sm text-[#7a6f66]">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="disabled:opacity-30"
              >
                <ChevronLeft size={18} />
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`border-b pb-1 ${
                    currentPage === page ? 'border-[#2f2924] text-[#2f2924]' : 'border-transparent'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                className="disabled:opacity-30"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </>
        )}
      </section>
      <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </main>
  );
};

export default CollectionPage;
