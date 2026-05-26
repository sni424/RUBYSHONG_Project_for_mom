import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, Plus, Search } from 'lucide-react';
import ProductCreateModal from '@/components/modals/ProductCreateModal';
import { getProducts, type ProductSearchParams } from '@/api/productApi';
import type { Product } from '@/constants/type';
import { formatKoreanDateTime } from '@/constants/utils';
import ProductEditModal from '@/components/modals/ProductEditModal';

const formatPrice = (price: number) => `${price.toLocaleString()}원`;

const productCategories = [
  { label: '반지', value: 'ring' },
  { label: '목걸이', value: 'necklace' },
  { label: '귀걸이', value: 'earring' },
  { label: '팔찌', value: 'bracelet' },
];

const getCategoryLabel = (category: string) => {
  return productCategories.find((item) => item.value === category)?.label ?? category;
};

const AdminProducts = () => {
  // 서버에서 가져온 상품 목록
  const [products, setProducts] = useState<Product[]>([]);

  // 상품 목록 로딩 상태
  const [isLoading, setIsLoading] = useState(true);

  // 상품 목록 조회 에러 메시지
  const [errorMessage, setErrorMessage] = useState('');

  // 상품 검색어
  const [searchKeyword, setSearchKeyword] = useState('');

  // 선택된 카테고리
  const [selectedCategory, setSelectedCategory] = useState('');

  // 선택된 상품 id 목록
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // 현재 페이지
  const [currentPage, setCurrentPage] = useState(1);

  // 한 페이지에 보여줄 상품 개수
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // 상품 등록 모달 열림 여부
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // 상품 수정 모달 열림 여부
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // 수정할 상품 데이터
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // 확대해서 볼 이미지 URL
  const [previewImageUrl, setPreviewImageUrl] = useState('');

  // 확대 이미지 alt 텍스트
  const [previewImageAlt, setPreviewImageAlt] = useState('');

  // 전체 페이지 수
  const totalPages = Math.max(Math.ceil(products.length / itemsPerPage), 1);

  // 현재 페이지에 보여줄 상품 목록
  const paginatedProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // 현재 페이지 상품 id 목록
  const currentPageIds = paginatedProducts.map((product) => product.id);

  // 현재 페이지 상품이 모두 선택되었는지 확인
  const isAllSelected =
    currentPageIds.length > 0 && currentPageIds.every((id) => selectedIds.includes(id));

  // 선택된 상품 개수
  const selectedCount = selectedIds.length;

  // 상품 수정 모달 열기
  const handleOpenEditModal = (product: Product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  // 상품 수정 모달 닫기
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedProduct(null);
  };

  // 이미지 확대 모달 열기
  const handleOpenImagePreview = (product: Product) => {
    setPreviewImageUrl(product.thumbnailUrl);
    setPreviewImageAlt(product.name);
  };

  // 이미지 확대 모달 닫기
  const handleCloseImagePreview = () => {
    setPreviewImageUrl('');
    setPreviewImageAlt('');
  };

  // 선택 상태 문구
  const selectedText = useMemo(() => {
    return selectedCount > 0 ? `${selectedCount}개 선택됨` : '선택 없음';
  }, [selectedCount]);

  // 상품 목록 조회
  const fetchProducts = async (params?: ProductSearchParams) => {
    try {
      setIsLoading(true);
      setErrorMessage('');

      const data = await getProducts(params);

      setProducts(data);
      setSelectedIds([]);
      setCurrentPage(1);
    } catch (error) {
      console.error(error);
      setErrorMessage('상품 목록을 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 현재 검색/카테고리 조건으로 상품 목록 조회
  const handleSearchProducts = () => {
    fetchProducts({
      search: searchKeyword.trim(),
      category: selectedCategory,
    });
  };

  // 필터 초기화
  const handleResetFilters = () => {
    setSearchKeyword('');
    setSelectedCategory('');
    fetchProducts();
  };

  // 상품 목록 새로고침
  const refreshProducts = async () => {
    fetchProducts({
      search: searchKeyword.trim(),
      category: selectedCategory,
    });
  };

  // 첫 진입 시 상품 목록 조회
  useEffect(() => {
    let isMounted = true;

    // 상품 목록 API 요청
    getProducts()
      .then((data) => {
        // 컴포넌트가 사라진 뒤에는 state 변경 막기
        if (!isMounted) return;

        setProducts(data);
      })
      .catch((error) => {
        if (!isMounted) return;

        console.error(error);
        setErrorMessage('상품 목록을 불러오지 못했습니다.');
      })
      .finally(() => {
        if (!isMounted) return;

        setIsLoading(false);
      });

    // 언마운트 시 비동기 응답 무시
    return () => {
      isMounted = false;
    };
  }, []);

  // 현재 페이지 상품 전체 선택/해제
  const handleSelectAll = () => {
    // 현재 페이지 상품이 모두 선택되어 있으면 현재 페이지 상품만 선택 해제
    if (isAllSelected) {
      setSelectedIds((prev) => prev.filter((id) => !currentPageIds.includes(id)));
      return;
    }

    // 현재 페이지 상품을 기존 선택 목록에 추가
    setSelectedIds((prev) => [...new Set([...prev, ...currentPageIds])]);
  };

  // 개별 상품 선택/해제
  const handleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id],
    );
  };

  return (
    <section>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">상품 관리</h1>
          <p className="mt-2 text-sm text-slate-500">
            상품을 등록, 수정, 삭제하고 판매 상태를 관리할 수 있습니다.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="flex h-11 items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700 cursor-pointer"
        >
          <Plus size={18} />
          상품 등록
        </button>
      </div>

      <div className="mb-5 border-b border-slate-200">
        <div className="flex gap-6 overflow-x-auto text-sm font-semibold">
          {['전체 상품', '판매 중', '품절', '숨김'].map((tab, index) => (
            <button
              key={tab}
              type="button"
              className={`whitespace-nowrap border-b-2 px-1 pb-4 ${
                index === 0
                  ? 'border-violet-600 text-violet-600'
                  : 'border-transparent text-slate-500'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="grid gap-3 border-b border-slate-100 p-4 md:grid-cols-[1fr_180px_160px_160px_auto_auto]">
          <label className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 px-4">
            <Search size={18} className="text-slate-400" />
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearchProducts();
                }
              }}
              placeholder="상품명, 슬러그 검색"
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </label>

          <select
            value={selectedCategory}
            onChange={(e) => {
              const category = e.target.value;
              setSelectedCategory(category);
              fetchProducts({
                search: searchKeyword.trim(),
                category,
              });
            }}
            className="h-11 rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-700 cursor-pointer"
          >
            <option value="">전체 카테고리</option>
            {productCategories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>

          <FilterButton label="전체 상태" />
          <FilterButton label="전체 노출" />

          <button
            type="button"
            onClick={handleSearchProducts}
            className="h-11 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white cursor-pointer hover:bg-slate-800"
          >
            검색
          </button>

          <button
            type="button"
            onClick={handleResetFilters}
            className="h-11 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 cursor-pointer hover:bg-slate-50"
          >
            초기화
          </button>
        </div>

        {selectedCount > 0 && (
          <div className="flex flex-col gap-3 border-b border-slate-100 bg-slate-50 px-4 py-3 sm:flex-row sm:items-center">
            <span className="text-sm font-semibold text-slate-700">{selectedText}</span>

            <div className="flex flex-wrap gap-2">
              <button className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-500">
                선택 삭제
              </button>
              <button className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">
                판매 상태 변경
              </button>
              <button className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">
                노출 상태 변경
              </button>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="border-b border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-500">
            {errorMessage}
          </div>
        )}

        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full min-w-262.5 text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="w-12 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    className="h-4 w-4 accent-violet-600"
                  />
                </th>
                <th className="px-4 py-3">상품 정보</th>
                <th className="px-4 py-3">카테고리</th>
                <th className="px-4 py-3">가격</th>
                <th className="px-4 py-3">할인율</th>
                <th className="px-4 py-3">최종 가격</th>
                <th className="px-4 py-3">재고</th>
                <th className="px-4 py-3">상태</th>
                <th className="px-4 py-3">노출</th>
                <th className="px-4 py-3">등록일</th>
                <th className="px-4 py-3 text-right">관리</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {paginatedProducts.map((product) => (
                <tr key={`ProductTable_tr_${product.id}`} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(product.id)}
                      onChange={() => handleSelect(product.id)}
                      className="h-4 w-4 accent-violet-600"
                    />
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 overflow-hidden rounded-lg bg-slate-100">
                        <img
                          onClick={() => handleOpenImagePreview(product)}
                          src={product.thumbnailUrl}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div>
                        <p className="font-semibold text-slate-900">{product.name}</p>
                        <p className="text-xs text-slate-500">ID: {product.id}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3">{getCategoryLabel(product.category)}</td>
                  <td className="px-4 py-3">{formatPrice(product.price)}</td>
                  <td className="px-4 py-3 text-red-500">{product.discountRate}%</td>
                  <td className="px-4 py-3 font-semibold">{formatPrice(product.finalPrice)}</td>
                  <td className="px-4 py-3">{product.stock}개</td>

                  <td className="px-4 py-3">
                    <StatusBadge status={product.status} />
                  </td>

                  <td className="px-4 py-3">
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                      노출
                    </span>
                  </td>

                  <td className="px-4 py-3 text-slate-500">
                    {formatKoreanDateTime(product.createdAt)}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleOpenEditModal(product)}
                        className="rounded-lg border border-violet-200 px-3 py-2 text-xs font-semibold text-violet-600 hover:bg-violet-600 hover:text-white cursor-pointer"
                      >
                        수정
                      </button>
                      <button className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-500 hover:text-white cursor-pointer">
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="divide-y divide-slate-100 lg:hidden">
          {paginatedProducts.map((product) => (
            <div key={product.id} className="p-4">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="flex gap-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(product.id)}
                    onChange={() => handleSelect(product.id)}
                    className="mt-1 h-4 w-4 accent-violet-600"
                  />

                  <div className="h-20 w-20 overflow-hidden rounded-xl bg-slate-100">
                    <img
                      onClick={() => handleOpenImagePreview(product)}
                      src={product.thumbnailUrl}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div>
                    <p className="font-semibold text-slate-900">{product.name}</p>
                    <p className="mt-1 text-xs text-slate-500">slug: {product.slug}</p>
                    <p className="text-xs text-slate-500">ID: {product.id}</p>
                  </div>
                </div>

                <StatusBadge status={product.status} />
              </div>

              <div className="grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3 text-sm">
                <Info label="카테고리" value={getCategoryLabel(product.category)} />
                <Info label="재고" value={`${product.stock}개`} />
                <Info label="가격" value={formatPrice(product.price)} />
                <Info label="최종 가격" value={formatPrice(product.finalPrice)} />
                <Info label="할인율" value={`${product.discountRate}%`} />
                <Info label="등록일" value={formatKoreanDateTime(product.createdAt)} />
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleOpenEditModal(product)}
                  className="flex-1 rounded-xl border border-violet-200 py-2 text-sm font-semibold text-violet-600"
                >
                  수정
                </button>
                <button className="flex-1 rounded-xl border border-red-200 py-2 text-sm font-semibold text-red-500">
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>

        {!isLoading && products.length === 0 && (
          <div className="border-t border-slate-100 px-4 py-12 text-center text-sm font-semibold text-slate-500">
            조회된 상품이 없습니다.
          </div>
        )}

        {isLoading && (
          <div className="border-t border-slate-100 px-4 py-12 text-center text-sm font-semibold text-slate-500">
            상품 목록을 불러오는 중입니다.
          </div>
        )}

        <div className="flex flex-col gap-4 border-t border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">총 {products.length}개 상품</p>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <PageButton
              icon={<ChevronLeft size={16} />}
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            />

            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`h-9 w-9 rounded-lg text-sm font-semibold cursor-pointer ${
                  currentPage === page
                    ? 'bg-violet-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {page}
              </button>
            ))}

            <PageButton
              icon={<ChevronRight size={16} />}
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            />
          </div>

          <select
            value={itemsPerPage}
            onChange={(e) => {
              setCurrentPage(1);
              setItemsPerPage(Number(e.target.value));
            }}
            className="h-10 rounded-xl border border-slate-200 px-3 text-sm font-semibold cursor-pointer"
          >
            <option value={5}>5개씩 보기</option>
            <option value={10}>10개씩 보기</option>
            <option value={20}>20개씩 보기</option>
            <option value={50}>50개씩 보기</option>
          </select>
        </div>
      </div>
      {previewImageUrl && (
        <div
          className="fixed inset-0 z-120 flex items-center justify-center bg-black/70 px-4 py-6"
          onClick={handleCloseImagePreview}
        >
          <div
            className="relative max-h-full w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={handleCloseImagePreview}
              className="absolute -top-12 right-0 rounded-lg bg-white/10 px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              닫기
            </button>

            <img
              src={previewImageUrl}
              alt={previewImageAlt}
              className="max-h-[80vh] w-full rounded-2xl object-contain"
            />
          </div>
        </div>
      )}
      <ProductCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={refreshProducts}
      />
      {isEditModalOpen && selectedProduct && (
        <ProductEditModal
          key={selectedProduct.id}
          isOpen={isEditModalOpen}
          product={selectedProduct}
          onClose={handleCloseEditModal}
          onSuccess={refreshProducts}
        />
      )}
    </section>
  );
};

const FilterButton = ({ label }: { label: string }) => {
  return (
    <button className="flex h-11 items-center justify-between rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-700">
      {label}
      <ChevronDown size={16} className="text-slate-400" />
    </button>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const statusStyle =
    {
      selling: 'bg-emerald-50 text-emerald-600',
      soldout: 'bg-orange-50 text-orange-500',
      hidden: 'bg-slate-100 text-slate-500',
    }[status] ?? 'bg-emerald-50 text-emerald-600';

  const statusLabel =
    {
      selling: '판매 중',
      soldout: '품절',
      hidden: '숨김',
    }[status] ?? status;

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle}`}>
      {statusLabel}
    </span>
  );
};

const Info = ({ label, value }: { label: string; value: string }) => {
  return (
    <div>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-1 font-semibold text-slate-800">{value}</p>
    </div>
  );
};

const PageButton = ({
  icon,
  onClick,
  disabled = false,
}: {
  icon: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {icon}
    </button>
  );
};

export default AdminProducts;
