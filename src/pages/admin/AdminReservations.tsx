import { useEffect, useState } from 'react';
import { CalendarDays, Phone, RefreshCw } from 'lucide-react';
import type { Reservation } from '@/constants/type';
import { getAdminReservations } from '@/api/ReservationApi';

const statusLabel = {
  pending: '대기',
  confirmed: '확정',
  cancelled: '취소',
  completed: '완료',
};

const statusStyle = {
  pending: 'bg-amber-50 text-amber-600',
  confirmed: 'bg-emerald-50 text-emerald-600',
  cancelled: 'bg-red-50 text-red-500',
  completed: 'bg-slate-100 text-slate-500',
};

const AdminReservations = () => {
  // 예약 목록
  const [reservations, setReservations] = useState<Reservation[]>([]);

  // 예약 목록 로딩 상태
  const [isLoading, setIsLoading] = useState(true);

  // 예약 목록 조회 에러 메시지
  const [errorMessage, setErrorMessage] = useState('');

  // 예약 목록 조회
  const fetchReservations = async () => {
    try {
      // 예약 목록 로딩 시작
      setIsLoading(true);
      setErrorMessage('');

      // 서버에서 예약 목록 가져오기
      const data = await getAdminReservations();

      // 예약 목록 상태 저장
      setReservations(data);
    } catch (error) {
      console.error(error);
      setErrorMessage('예약 목록을 불러오지 못했습니다.');
    } finally {
      // 예약 목록 로딩 종료
      setIsLoading(false);
    }
  };

  // 첫 진입 시 예약 목록 조회
  useEffect(() => {
    let isMounted = true;

    getAdminReservations()
      .then((data) => {
        if (!isMounted) return;

        setReservations(data);
      })
      .catch((error) => {
        if (!isMounted) return;

        console.error(error);
        setErrorMessage('예약 목록을 불러오지 못했습니다.');
      })
      .finally(() => {
        if (!isMounted) return;

        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">예약 관리</h1>
          <p className="mt-2 text-sm text-slate-500">
            고객 방문 예약 현황을 확인하고 관리할 수 있습니다.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchReservations}
          className="flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <RefreshCw size={17} />
          새로고침
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        {errorMessage && (
          <div className="border-b border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-500">
            {errorMessage}
          </div>
        )}

        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full min-w-230 text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3">방문 일정</th>
                <th className="px-4 py-3">고객 정보</th>
                <th className="px-4 py-3">예약 내용</th>
                <th className="px-4 py-3">상태</th>
                <th className="px-4 py-3">신청일</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {reservations.map((reservation) => (
                <tr key={reservation.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <CalendarDays size={18} className="text-violet-500" />
                      <div>
                        <p className="font-semibold text-slate-900">{reservation.visitDate}</p>
                        <p className="text-xs text-slate-500">{reservation.visitTime}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <p className="font-semibold text-slate-900">{reservation.name}</p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                      <Phone size={13} />
                      {reservation.phone}
                    </p>
                  </td>

                  <td className="px-4 py-4 text-slate-600">
                    {reservation.message || '예약 내용 없음'}
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        statusStyle[reservation.status]
                      }`}
                    >
                      {statusLabel[reservation.status]}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-slate-500">
                    {new Date(reservation.createdAt).toLocaleString('ko-KR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="divide-y divide-slate-100 lg:hidden">
          {reservations.map((reservation) => (
            <div key={reservation.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-900">{reservation.name}</p>
                  <p className="mt-1 text-sm text-slate-500">{reservation.phone}</p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    statusStyle[reservation.status]
                  }`}
                >
                  {statusLabel[reservation.status]}
                </span>
              </div>

              <div className="mt-4 rounded-xl bg-slate-50 p-3 text-sm">
                <p className="font-semibold text-slate-800">
                  {reservation.visitDate} {reservation.visitTime}
                </p>
                <p className="mt-2 text-slate-600">{reservation.message || '예약 내용 없음'}</p>
              </div>
            </div>
          ))}
        </div>

        {!isLoading && reservations.length === 0 && (
          <div className="px-4 py-12 text-center text-sm font-semibold text-slate-500">
            등록된 예약이 없습니다.
          </div>
        )}

        {isLoading && (
          <div className="px-4 py-12 text-center text-sm font-semibold text-slate-500">
            예약 목록을 불러오는 중입니다.
          </div>
        )}
      </div>
    </section>
  );
};

export default AdminReservations;
