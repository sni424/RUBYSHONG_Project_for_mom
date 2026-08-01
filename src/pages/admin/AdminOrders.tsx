import {
  getAdminOrderById,
  getAdminOrders,
  refundAdminOrder,
  updateAdminOrderStatus,
} from '@/api/order';
import type { AdminOrder, AdminOrderStatus } from '@/constants/type';
import axios from 'axios';
import { RefreshCw, RotateCcw, Search, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

const ORDER_STATUS_LABEL: Record<AdminOrderStatus, string> = {
  pending: '결제 진행 중',
  paid: '결제 완료',
  preparing: '배송 준비 중',
  shipped: '배송 중',
  delivered: '배송 완료',
  cancelled: '주문 취소',
  failed: '결제 실패',
  refunded: '환불 완료',
};

const ORDER_STATUS_OPTIONS: Array<{
  value: AdminOrderStatus;
  label: string;
}> = [
  { value: 'paid', label: '결제 완료' },
  { value: 'preparing', label: '배송 준비 중' },
  { value: 'shipped', label: '배송 중' },
  { value: 'delivered', label: '배송 완료' },
  { value: 'cancelled', label: '주문 취소' },
];

const formatDate = (date: string) => {
  return new Date(date).toLocaleString('ko-KR');
};

const formatPrice = (price: number) => {
  return `${price.toLocaleString()}원`;
};

const getStatusClassName = (status: AdminOrderStatus) => {
  if (status === 'paid') {
    return 'bg-blue-50 text-blue-700';
  }

  if (status === 'preparing' || status === 'shipped') {
    return 'bg-amber-50 text-amber-700';
  }

  if (status === 'delivered') {
    return 'bg-emerald-50 text-emerald-700';
  }

  if (status === 'refunded' || status === 'cancelled' || status === 'failed') {
    return 'bg-red-50 text-red-700';
  }

  return 'bg-slate-100 text-slate-600';
};

const AdminOrders = () => {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');

  // 변경 확인 전 임시로 선택한 주문 상태
  const [pendingStatus, setPendingStatus] = useState<AdminOrderStatus | null>(null);

  // 주문 검색 결과
  const filteredOrders = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    // 검색어가 없으면 전체 주문 목록 반환
    if (!keyword) {
      return orders;
    }

    // 주문번호, 주문자, 전화번호, 이메일, 상품명 기준으로 검색
    return orders.filter((order) => {
      const productNames = order.items.map((item) => item.productName).join(' ');
      const values = [
        order.orderCode,
        order.ordererName,
        order.ordererPhone,
        order.user?.email ?? '',
        productNames,
      ];

      return values.some((value) => value.toLowerCase().includes(keyword));
    });
  }, [orders, searchKeyword]);

  // 관리자 주문 목록 조회
  const fetchOrders = useCallback(async () => {
    try {
      // 주문 목록 로딩 시작
      setIsLoading(true);
      setErrorMessage('');

      // 관리자 주문 목록 API 요청
      const data = await getAdminOrders();

      // 주문 목록 저장
      setOrders(data);
    } catch (error) {
      console.error(error);

      // 관리자 토큰이 만료되었으면 로그인 페이지로 이동
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        localStorage.removeItem('adminToken');
        alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
        window.location.href = '/admin/login';
        return;
      }

      setErrorMessage('주문 목록을 불러오지 못했습니다.');
    } finally {
      // 주문 목록 로딩 종료
      setIsLoading(false);
    }
  }, []);

  // 관리자 주문 상세 조회
  const fetchOrderDetail = async (orderId: number) => {
    try {
      // 주문 상세 로딩 시작
      setIsDetailLoading(true);
      setErrorMessage('');

      // 관리자 주문 상세 API 요청
      const data = await getAdminOrderById(orderId);

      // 선택한 주문 상세 정보 저장
      setSelectedOrder(data);
    } catch (error) {
      console.error(error);
      alert('주문 상세 정보를 불러오지 못했습니다.');
    } finally {
      // 주문 상세 로딩 종료
      setIsDetailLoading(false);
    }
  };

  // 주문 상태 선택 시 바로 변경하지 않고 확인 모달을 열기
  const handleSelectPendingStatus = (status: AdminOrderStatus) => {
    if (!selectedOrder) return;

    // 현재 상태와 같으면 변경 확인을 열지 않음
    if (status === selectedOrder.status) return;

    // 선택한 상태를 임시 저장해서 확인 모달 표시
    setPendingStatus(status);
  };

  // 확인 모달에서 주문 상태 변경 확정
  const handleConfirmStatusChange = async () => {
    if (!pendingStatus) return;

    // 선택한 주문 상태로 실제 변경 API 요청
    await handleStatusChange(pendingStatus);

    // 상태 변경 확인 모달 닫기
    setPendingStatus(null);
  };

  // 관리자 주문 상태 변경
  const handleStatusChange = async (status: AdminOrderStatus) => {
    if (!selectedOrder) return;

    try {
      // 상태 변경 처리 시작
      setIsUpdating(true);

      // 주문 상태 변경 API 요청
      const updatedOrder = await updateAdminOrderStatus(selectedOrder.id, status);

      // 상세 모달의 주문 정보 갱신
      setSelectedOrder(updatedOrder);

      // 주문 목록 갱신
      await fetchOrders();

      alert('주문 상태가 변경되었습니다.');
    } catch (error) {
      console.error(error);

      // 서버에서 내려준 에러 메시지가 있으면 그대로 표시
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        alert(error.response.data.message);
        return;
      }

      alert('주문 상태 변경에 실패했습니다.');
    } finally {
      // 상태 변경 처리 종료
      setIsUpdating(false);
    }
  };

  // 관리자 주문 테스트 환불 처리
  const handleRefund = async () => {
    if (!selectedOrder) return;

    // 환불 처리 전 관리자 확인
    const confirmed = window.confirm(
      '테스트 환불 처리하시겠습니까?\n주문 상태가 환불 완료로 변경되고 재고가 복구됩니다.',
    );

    if (!confirmed) return;

    try {
      // 환불 처리 시작
      setIsUpdating(true);

      // 관리자 주문 환불 API 요청
      const refundedOrder = await refundAdminOrder(selectedOrder.id);

      // 상세 모달의 주문 정보 갱신
      setSelectedOrder(refundedOrder);

      // 주문 목록 갱신
      await fetchOrders();

      alert('환불 처리되었습니다.');
    } catch (error) {
      console.error(error);

      // 서버에서 내려준 에러 메시지가 있으면 그대로 표시
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        alert(error.response.data.message);
        return;
      }

      alert('환불 처리에 실패했습니다.');
    } finally {
      // 환불 처리 종료
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    // 관리자 주문 목록은 페이지 진입 시 백엔드와 동기화해야 하므로 effect에서 조회
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchOrders();
  }, [fetchOrders]);

  return (
    <section>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">주문관리</h2>
          <p className="mt-1 text-sm text-slate-500">
            결제 완료 주문과 배송 상태를 확인하고 관리합니다.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchOrders}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          <RefreshCw size={16} />
          새로고침
        </button>
      </div>

      <div className="mb-5 flex h-11 items-center gap-3 rounded-md border border-slate-200 bg-white px-4">
        <Search size={17} className="text-slate-400" />
        <input
          value={searchKeyword}
          onChange={(event) => setSearchKeyword(event.target.value)}
          placeholder="주문번호, 주문자, 전화번호, 이메일, 상품명 검색"
          className="h-full flex-1 text-sm outline-none"
        />
      </div>

      {errorMessage && (
        <div className="mb-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
        <div className="space-y-3 md:hidden">
          {isLoading ? (
            <div className="rounded-md border border-slate-200 bg-white px-4 py-10 text-center text-sm text-slate-500">
              주문 목록을 불러오는 중입니다.
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="rounded-md border border-slate-200 bg-white px-4 py-10 text-center text-sm text-slate-500">
              주문 내역이 없습니다.
            </div>
          ) : (
            filteredOrders.map((order) => {
              const firstItem = order.items[0];
              const orderName =
                order.items.length === 1
                  ? firstItem?.productName
                  : `${firstItem?.productName ?? '상품'} 외 ${order.items.length - 1}건`;

              return (
                <button
                  key={`MobileOrder_${order.id}`}
                  type="button"
                  onClick={() => fetchOrderDetail(order.id)}
                  className="w-full rounded-md border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:bg-slate-50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-slate-500">
                        {order.orderCode}
                      </p>

                      <h3 className="mt-2 line-clamp-2 text-base font-bold text-slate-900">
                        {orderName}
                      </h3>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClassName(
                        order.status,
                      )}`}
                    >
                      {ORDER_STATUS_LABEL[order.status]}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-slate-400">주문자</p>
                      <p className="mt-1 font-medium text-slate-800">{order.ordererName}</p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">금액</p>
                      <p className="mt-1 font-semibold text-slate-900">
                        {formatPrice(order.totalAmount)}
                      </p>
                    </div>

                    <div className="col-span-2">
                      <p className="text-xs text-slate-400">주문일</p>
                      <p className="mt-1 text-slate-700">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* 데스크톱 주문 테이블 */}
        <div className="hidden overflow-hidden rounded-md border border-slate-200 bg-white md:block">
          <div className="grid grid-cols-[1.2fr_0.8fr_1.4fr_0.8fr_0.8fr_1fr] border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-500">
            <span>주문번호</span>
            <span>주문자</span>
            <span>상품</span>
            <span>금액</span>
            <span>상태</span>
            <span>주문일</span>
          </div>

          {isLoading ? (
            <div className="px-4 py-12 text-center text-sm text-slate-500">
              주문 목록을 불러오는 중입니다.
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="px-4 py-12 text-center text-sm text-slate-500">
              주문 내역이 없습니다.
            </div>
          ) : (
            filteredOrders.map((order) => {
              const firstItem = order.items[0];
              const orderName =
                order.items.length === 1
                  ? firstItem?.productName
                  : `${firstItem?.productName ?? '상품'} 외 ${order.items.length - 1}건`;

              return (
                <button
                  key={`DesktopOrder_${order.id}`}
                  type="button"
                  onClick={() => fetchOrderDetail(order.id)}
                  className="grid w-full grid-cols-[1.2fr_0.8fr_1.4fr_0.8fr_0.8fr_1fr] items-center border-b border-slate-100 px-4 py-4 text-left text-sm transition hover:bg-slate-50"
                >
                  <span className="truncate font-medium text-slate-900">{order.orderCode}</span>
                  <span className="truncate text-slate-700">{order.ordererName}</span>
                  <span className="truncate text-slate-700">{orderName}</span>
                  <span className="text-slate-700">{formatPrice(order.totalAmount)}</span>
                  <span>
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClassName(
                        order.status,
                      )}`}
                    >
                      {ORDER_STATUS_LABEL[order.status]}
                    </span>
                  </span>
                  <span className="text-slate-500">{formatDate(order.createdAt)}</span>
                </button>
              );
            })
          )}
        </div>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-120 flex items-center justify-center bg-black/45 px-4 py-6">
          <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-md bg-white shadow-xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">주문 상세</h3>
                <p className="mt-1 text-xs text-slate-500">{selectedOrder.orderCode}</p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="flex h-9 w-9 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100"
                aria-label="주문 상세 닫기"
              >
                <X size={18} />
              </button>
            </div>

            {isDetailLoading ? (
              <div className="px-6 py-16 text-center text-sm text-slate-500">
                주문 상세 정보를 불러오는 중입니다.
              </div>
            ) : (
              <div className="grid gap-6 px-6 py-6 lg:grid-cols-[1fr_320px]">
                <div className="space-y-6">
                  <section className="rounded-md border border-slate-200 p-5">
                    <h4 className="font-semibold text-slate-900">고객 정보</h4>

                    <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                      <p>
                        <span className="text-slate-500">주문자</span>
                        <br />
                        <span className="font-medium">{selectedOrder.ordererName}</span>
                      </p>

                      <p>
                        <span className="text-slate-500">전화번호</span>
                        <br />
                        <span className="font-medium">{selectedOrder.ordererPhone}</span>
                      </p>

                      <p>
                        <span className="text-slate-500">회원 이메일</span>
                        <br />
                        <span className="font-medium">{selectedOrder.user?.email ?? '비회원'}</span>
                      </p>
                    </div>
                  </section>

                  <section className="rounded-md border border-slate-200 p-5">
                    <h4 className="font-semibold text-slate-900">주문 상품</h4>

                    <div className="mt-4 space-y-4">
                      {selectedOrder.items.map((item) => (
                        <div key={item.id} className="flex gap-4">
                          <img
                            src={item.thumbnailUrl}
                            alt={item.productName}
                            className="h-20 w-20 rounded-md object-cover"
                          />

                          <div className="flex-1">
                            <p className="font-medium text-slate-900">{item.productName}</p>
                            <p className="mt-1 text-sm text-slate-500">
                              {formatPrice(item.price)} / 수량 {item.quantity}개
                            </p>
                          </div>

                          <p className="font-semibold text-slate-900">{formatPrice(item.amount)}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="rounded-md border border-slate-200 p-5">
                    <h4 className="font-semibold text-slate-900">변경 이력</h4>

                    <div className="mt-4 space-y-3">
                      {selectedOrder.histories && selectedOrder.histories.length > 0 ? (
                        selectedOrder.histories.map((history) => (
                          <div
                            key={history.id}
                            className="rounded-md bg-slate-50 px-4 py-3 text-sm"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className="font-medium text-slate-800">{history.action}</span>
                              <span className="text-xs text-slate-500">
                                {formatDate(history.createdAt)}
                              </span>
                            </div>

                            <p className="mt-1 text-xs text-slate-500">
                              처리자: {history.changedBy?.email ?? '시스템'}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-slate-500">변경 이력이 없습니다.</p>
                      )}
                    </div>
                  </section>
                </div>

                <aside className="space-y-6">
                  <section className="rounded-md border border-slate-200 p-5">
                    <h4 className="font-semibold text-slate-900">결제 정보</h4>

                    <div className="mt-4 space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-500">주문 상태</span>
                        <span className="font-medium">
                          {ORDER_STATUS_LABEL[selectedOrder.status]}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-slate-500">결제 상태</span>
                        <span className="font-medium">{selectedOrder.payment?.status ?? '-'}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-slate-500">결제수단</span>
                        <span className="font-medium">{selectedOrder.payment?.method ?? '-'}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-slate-500">결제금액</span>
                        <span className="font-semibold">
                          {formatPrice(selectedOrder.totalAmount)}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-slate-500">승인시간</span>
                        <span className="text-right font-medium">
                          {selectedOrder.payment?.approvedAt
                            ? formatDate(selectedOrder.payment.approvedAt)
                            : '-'}
                        </span>
                      </div>
                    </div>
                  </section>

                  <section className="rounded-md border border-slate-200 p-5">
                    <h4 className="font-semibold text-slate-900">상태 변경</h4>

                    <select
                      value={selectedOrder.status}
                      onChange={(event) =>
                        handleSelectPendingStatus(event.target.value as AdminOrderStatus)
                      }
                      disabled={isUpdating}
                      className="mt-4 h-11 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-slate-400"
                    >
                      {ORDER_STATUS_OPTIONS.map((status) => (
                        <option key={`orderStatusOption_${status.value}`} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={handleRefund}
                      disabled={
                        isUpdating ||
                        (selectedOrder.status !== 'paid' && selectedOrder.status !== 'preparing')
                      }
                      className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-md bg-red-600 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-45"
                    >
                      <RotateCcw size={16} />
                      테스트 환불 처리
                    </button>

                    <p className="mt-3 text-xs leading-5 text-slate-500">
                      환불은 owner 권한만 처리할 수 있습니다. 테스트 환불은 DB 상태 변경과 재고
                      복구만 수행합니다.
                    </p>
                  </section>
                </aside>
              </div>
            )}
          </div>
        </div>
      )}
      {/* 주문 상태 변경 확인 모달 */}
      {pendingStatus && selectedOrder && (
        <div className="fixed inset-0 z-[140] flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-md bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900">주문 상태 변경</h3>

            <p className="mt-4 text-sm leading-6 text-slate-600">
              주문 상태를{' '}
              <span className="font-semibold text-slate-900">
                {ORDER_STATUS_LABEL[selectedOrder.status]}
              </span>
              에서{' '}
              <span className="font-semibold text-blue-700">
                {ORDER_STATUS_LABEL[pendingStatus]}
              </span>
              으로 변경하시겠습니까?
            </p>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPendingStatus(null)}
                disabled={isUpdating}
                className="h-10 rounded-md border border-slate-200 px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                취소
              </button>

              <button
                type="button"
                onClick={handleConfirmStatusChange}
                disabled={isUpdating}
                className="h-10 rounded-md bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                변경하기
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AdminOrders;
