import { getAdminCustomerById, getAdminCustomers } from '@/api/customer';
import type { AdminCustomerDetail, AdminCustomerListItem } from '@/constants/type';
import axios from 'axios';
import { Search, RefreshCw, UserRound, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

const formatPrice = (price: number) => `${price.toLocaleString()}원`;

const formatDate = (date: string | null) => {
  if (!date) return '-';

  return new Date(date).toLocaleString('ko-KR');
};

const providerLabel = (provider: AdminCustomerListItem['provider']) => {
  if (provider === 'naver') return '네이버';
  if (provider === 'kakao') return '카카오';
  return '이메일';
};

const AdminCustomers = () => {
  // 고객 목록
  const [customers, setCustomers] = useState<AdminCustomerListItem[]>([]);

  // 상세보기 선택 고객
  const [selectedCustomer, setSelectedCustomer] = useState<AdminCustomerDetail | null>(null);

  // 고객 검색어
  const [searchKeyword, setSearchKeyword] = useState('');

  // 고객 목록 로딩 상태
  const [isLoading, setIsLoading] = useState(false);

  // 고객 상세 로딩 상태
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  // 에러 메시지
  const [errorMessage, setErrorMessage] = useState('');

  // 검색어 기준 고객 목록 필터링
  const filteredCustomers = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    if (!keyword) return customers;

    return customers.filter((customer) => {
      const values = [customer.name, customer.email, customer.phone ?? ''];

      return values.some((value) => value.toLowerCase().includes(keyword));
    });
  }, [customers, searchKeyword]);

  // 관리자 고객 목록 조회
  const fetchCustomers = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage('');

      // 고객 목록 API 요청
      const data = await getAdminCustomers();

      setCustomers(data);
    } catch (error) {
      console.error(error);

      if (axios.isAxiosError(error) && error.response?.status === 401) {
        localStorage.removeItem('adminToken');
        alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
        window.location.href = '/admin/login';
        return;
      }

      setErrorMessage('고객 목록을 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 고객 상세 정보 조회
  const fetchCustomerDetail = async (customerId: number) => {
    try {
      setIsDetailLoading(true);
      setErrorMessage('');

      // 고객 상세 API 요청
      const data = await getAdminCustomerById(customerId);

      setSelectedCustomer(data);
    } catch (error) {
      console.error(error);
      alert('고객 상세 정보를 불러오지 못했습니다.');
    } finally {
      setIsDetailLoading(false);
    }
  };

  useEffect(() => {
    // 페이지 진입 시 고객 목록 조회
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCustomers();
  }, [fetchCustomers]);

  return (
    <section>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">고객관리</h2>
          <p className="mt-2 text-sm text-slate-500">
            가입 고객 정보와 주문, 예약, 문의 내역을 확인합니다.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchCustomers}
          disabled={isLoading}
          className="flex h-11 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw size={16} />
          새로고침
        </button>
      </div>

      <div className="mb-6 flex h-12 items-center gap-3 rounded-md border border-slate-200 bg-white px-4">
        <Search size={18} className="text-slate-400" />
        <input
          value={searchKeyword}
          onChange={(event) => setSearchKeyword(event.target.value)}
          placeholder="이름, 이메일, 전화번호 검색"
          className="h-full flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
        />
      </div>

      {errorMessage && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {errorMessage}
        </div>
      )}

      {/* 모바일 고객 카드 목록 */}
      <div className="grid gap-3 md:hidden">
        {filteredCustomers.map((customer) => (
          <button
            key={`mobileCustomer_${customer.id}`}
            type="button"
            onClick={() => fetchCustomerDetail(customer.id)}
            className="rounded-md border border-slate-200 bg-white p-4 text-left shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-900">{customer.name}</p>
                <p className="mt-1 break-all text-sm text-slate-500">{customer.email}</p>
              </div>

              <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {providerLabel(customer.provider)}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-slate-400">전화번호</p>
                <p className="mt-1 text-slate-700">{customer.phone ?? '-'}</p>
              </div>

              <div>
                <p className="text-slate-400">구매금액</p>
                <p className="mt-1 font-semibold text-slate-900">
                  {formatPrice(customer.totalPaidAmount)}
                </p>
              </div>

              <div>
                <p className="text-slate-400">주문 수</p>
                <p className="mt-1 text-slate-700">{customer.orderCount}건</p>
              </div>

              <div>
                <p className="text-slate-400">가입일</p>
                <p className="mt-1 text-slate-700">{formatDate(customer.createdAt)}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* 데스크톱 고객 테이블 */}
      <div className="hidden overflow-hidden rounded-md border border-slate-200 bg-white md:block">
        <table className="w-full table-fixed text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-5 py-4 text-left">고객</th>
              <th className="px-5 py-4 text-left">전화번호</th>
              <th className="px-5 py-4 text-left">가입 방식</th>
              <th className="px-5 py-4 text-right">누적 구매</th>
              <th className="px-5 py-4 text-right">주문</th>
              <th className="px-5 py-4 text-left">가입일</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {filteredCustomers.map((customer) => (
              <tr
                key={`customer_${customer.id}`}
                onClick={() => fetchCustomerDetail(customer.id)}
                className="cursor-pointer transition hover:bg-slate-50"
              >
                <td className="px-5 py-4">
                  <p className="font-semibold text-slate-900">{customer.name}</p>
                  <p className="mt-1 truncate text-slate-500">{customer.email}</p>
                </td>
                <td className="px-5 py-4 text-slate-600">{customer.phone ?? '-'}</td>
                <td className="px-5 py-4 text-slate-600">{providerLabel(customer.provider)}</td>
                <td className="px-5 py-4 text-right font-semibold text-slate-900">
                  {formatPrice(customer.totalPaidAmount)}
                </td>
                <td className="px-5 py-4 text-right text-slate-600">{customer.orderCount}건</td>
                <td className="px-5 py-4 text-slate-600">{formatDate(customer.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!isLoading && filteredCustomers.length === 0 && (
        <div className="rounded-md border border-slate-200 bg-white py-16 text-center text-sm text-slate-500">
          조회된 고객이 없습니다.
        </div>
      )}

      {/* 고객 상세 모달 */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 px-4 py-6">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-md bg-white shadow-xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                  <UserRound size={20} className="text-slate-600" />
                </div>

                <div>
                  <h3 className="font-bold text-slate-900">{selectedCustomer.name}</h3>
                  <p className="text-sm text-slate-500">{selectedCustomer.email}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-slate-100"
                aria-label="고객 상세 닫기"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid gap-5 p-5">
              <div className="grid gap-3 sm:grid-cols-4">
                <div className="rounded-md bg-slate-50 p-4">
                  <p className="text-xs text-slate-400">전화번호</p>
                  <p className="mt-2 font-semibold text-slate-900">
                    {selectedCustomer.phone ?? '-'}
                  </p>
                </div>

                <div className="rounded-md bg-slate-50 p-4">
                  <p className="text-xs text-slate-400">가입 방식</p>
                  <p className="mt-2 font-semibold text-slate-900">
                    {providerLabel(selectedCustomer.provider)}
                  </p>
                </div>

                <div className="rounded-md bg-slate-50 p-4">
                  <p className="text-xs text-slate-400">누적 구매</p>
                  <p className="mt-2 font-semibold text-slate-900">
                    {formatPrice(selectedCustomer.summary.totalPaidAmount)}
                  </p>
                </div>

                <div className="rounded-md bg-slate-50 p-4">
                  <p className="text-xs text-slate-400">휴대폰 인증</p>
                  <p className="mt-2 font-semibold text-slate-900">
                    {selectedCustomer.phoneVerified ? '완료' : '미완료'}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="mb-3 font-bold text-slate-900">주문 내역</h4>
                <div className="grid gap-3">
                  {selectedCustomer.orders.map((order) => (
                    <div
                      key={`customerOrder_${order.id}`}
                      className="rounded-md border border-slate-200 p-4"
                    >
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="font-semibold text-slate-900">{order.orderCode}</p>
                          <p className="mt-1 text-sm text-slate-500">
                            {order.items.map((item) => item.productName).join(', ')}
                          </p>
                        </div>

                        <div className="text-left sm:text-right">
                          <p className="font-semibold text-slate-900">
                            {formatPrice(order.totalAmount)}
                          </p>
                          <p className="mt-1 text-sm text-slate-500">{order.status}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {selectedCustomer.orders.length === 0 && (
                    <p className="rounded-md border border-slate-200 py-8 text-center text-sm text-slate-500">
                      주문 내역이 없습니다.
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-5 lg:grid-cols-2">
                <div>
                  <h4 className="mb-3 font-bold text-slate-900">예약 내역</h4>
                  <div className="grid gap-2">
                    {selectedCustomer.reservations.map((reservation) => (
                      <div
                        key={`customerReservation_${reservation.id}`}
                        className="rounded-md border border-slate-200 p-3 text-sm"
                      >
                        <p className="font-semibold text-slate-900">
                          {reservation.visitDate} {reservation.visitTime}
                        </p>
                        <p className="mt-1 text-slate-500">{reservation.status}</p>
                      </div>
                    ))}

                    {selectedCustomer.reservations.length === 0 && (
                      <p className="rounded-md border border-slate-200 py-8 text-center text-sm text-slate-500">
                        예약 내역이 없습니다.
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="mb-3 font-bold text-slate-900">문의 내역</h4>
                  <div className="grid gap-2">
                    {selectedCustomer.contactInquiries.map((inquiry) => (
                      <div
                        key={`customerInquiry_${inquiry.id}`}
                        className="rounded-md border border-slate-200 p-3 text-sm"
                      >
                        <p className="font-semibold text-slate-900">{inquiry.title}</p>
                        <p className="mt-1 text-slate-500">{inquiry.status}</p>
                      </div>
                    ))}

                    {selectedCustomer.contactInquiries.length === 0 && (
                      <p className="rounded-md border border-slate-200 py-8 text-center text-sm text-slate-500">
                        문의 내역이 없습니다.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {isDetailLoading && (
                <p className="text-center text-sm text-slate-500">상세 정보를 불러오는 중입니다.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AdminCustomers;
