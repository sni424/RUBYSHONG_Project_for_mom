import { useMemo, useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, Plus, Search } from 'lucide-react';

const products = [
  {
    id: 1001,
    name: '루비 목걸이',
    slug: 'ruby-necklace',
    category: 'necklace',
    price: 129000,
    salePrice: 116100,
    discountRate: 10,
    stock: 120,
    status: '판매 중',
    visible: true,
    imageUrl: '/images/product-sample-1.jpg',
    createdAt: '2025-05-24 14:30',
  },
  {
    id: 1002,
    name: '사파이어 반지',
    slug: 'sapphire-ring',
    category: 'ring',
    price: 89000,
    salePrice: 89000,
    discountRate: 0,
    stock: 85,
    status: '판매 중',
    visible: true,
    imageUrl: '/images/product-sample-2.jpg',
    createdAt: '2025-05-24 13:15',
  },
  {
    id: 1003,
    name: '진주 귀걸이',
    slug: 'pearl-earring',
    category: 'earring',
    price: 49000,
    salePrice: 46550,
    discountRate: 5,
    stock: 0,
    status: '품절',
    visible: true,
    imageUrl: '/images/product-sample-3.jpg',
    createdAt: '2025-05-23 11:20',
  },
];

const formatPrice = (price: number) => `${price.toLocaleString()}원`;

const AdminProducts = () => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const totalPages = Math.ceil(products.length / itemsPerPage);

  const paginatedProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const currentPageIds = paginatedProducts.map((product) => product.id);

  const isAllSelected =
    currentPageIds.length > 0 && currentPageIds.every((id) => selectedIds.includes(id));

  const selectedCount = selectedIds.length;

  const selectedText = useMemo(() => {
    return selectedCount > 0 ? `${selectedCount}개 선택됨` : '선택 없음';
  }, [selectedCount]);

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds((prev) => prev.filter((id) => !currentPageIds.includes(id)));
      return;
    }

    setSelectedIds((prev) => [...new Set([...prev, ...currentPageIds])]);
  };

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
        <div className="grid gap-3 border-b border-slate-100 p-4 md:grid-cols-[1fr_180px_160px_160px_auto]">
          <label className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 px-4">
            <Search size={18} className="text-slate-400" />
            <input
              type="text"
              placeholder="상품명, 슬러그 검색"
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </label>

          <FilterButton label="전체 카테고리" />
          <FilterButton label="전체 상태" />
          <FilterButton label="전체 노출" />

          <button className="h-11 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-700">
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

        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full min-w-[1050px] text-left text-sm">
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
                          src={product.imageUrl}
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

                  <td className="px-4 py-3">{product.category}</td>
                  <td className="px-4 py-3">{formatPrice(product.price)}</td>
                  <td className="px-4 py-3 text-red-500">{product.discountRate}%</td>
                  <td className="px-4 py-3 font-semibold">{formatPrice(product.salePrice)}</td>
                  <td className="px-4 py-3">{product.stock}개</td>

                  <td className="px-4 py-3">
                    <StatusBadge status={product.status} />
                  </td>

                  <td className="px-4 py-3">
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                      노출
                    </span>
                  </td>

                  <td className="px-4 py-3 text-slate-500">{product.createdAt}</td>

                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button className="rounded-lg border border-violet-200 px-3 py-2 text-xs font-semibold text-violet-600">
                        수정
                      </button>
                      <button className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-500">
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
                      src={product.imageUrl}
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
                <Info label="카테고리" value={product.category} />
                <Info label="재고" value={`${product.stock}개`} />
                <Info label="가격" value={formatPrice(product.price)} />
                <Info label="최종 가격" value={formatPrice(product.salePrice)} />
                <Info label="할인율" value={`${product.discountRate}%`} />
                <Info label="등록일" value={product.createdAt} />
              </div>

              <div className="mt-4 flex gap-2">
                <button className="flex-1 rounded-xl border border-violet-200 py-2 text-sm font-semibold text-violet-600">
                  수정
                </button>
                <button className="flex-1 rounded-xl border border-red-200 py-2 text-sm font-semibold text-red-500">
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>

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
  const isSoldOut = status === '품절';

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        isSoldOut ? 'bg-orange-50 text-orange-500' : 'bg-emerald-50 text-emerald-600'
      }`}
    >
      {status}
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
