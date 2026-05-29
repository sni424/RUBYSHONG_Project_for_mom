// src/pages/Reservation.tsx
import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

import reservationHero from '@/assets/images/home/hero.webp';
import type { AvailableTimesResponse } from '@/constants/type';
import { createReservation, getAvailableTimes } from '@/api/ReservationApi';

const RESERVATION_TIMES = [
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
];

const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

// 날짜를 YYYY-MM-DD 문자열로 변환
const formatDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

// 화면 표시용 날짜
const formatKoreanDate = (dateKey: string) => {
  const date = new Date(`${dateKey}T00:00:00+09:00`);

  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
  }).format(date);
};

const Reservation = () => {
  // 현재 보고 있는 달
  const [viewDate, setViewDate] = useState(() => new Date());

  // 선택한 방문 날짜
  const [selectedDate, setSelectedDate] = useState('');

  // 선택한 방문 시간
  const [selectedTime, setSelectedTime] = useState('');

  // 예약 가능 시간 데이터
  const [availableTimeData, setAvailableTimeData] = useState<AvailableTimesResponse | null>(null);

  // 예약 가능 시간 로딩 상태
  const [isLoadingTimes, setIsLoadingTimes] = useState(false);

  // 현재 단계
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // 예약 제출 중인지 확인
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 고객 입력 정보
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: '',
    privacyAgreed: false,
  });

  // 달력에 보여줄 날짜 목록
  const calendarDays = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const firstDate = new Date(year, month, 1);
    const lastDate = new Date(year, month + 1, 0);

    const startBlankCount = firstDate.getDay();
    const daysInMonth = lastDate.getDate();

    return [
      ...Array.from({ length: startBlankCount }, () => null),
      ...Array.from({ length: daysInMonth }, (_, index) => new Date(year, month, index + 1)),
    ];
  }, [viewDate]);

  // 오늘 날짜
  const todayKey = formatDateKey(new Date());

  // 선택한 날짜가 바뀌면 예약 가능 시간 다시 조회
  useEffect(() => {
    if (!selectedDate) return;

    let isMounted = true;

    // 선택 날짜의 예약 가능 시간 조회
    getAvailableTimes(selectedDate)
      .then((data) => {
        // 컴포넌트가 사라진 뒤에는 state 변경 막기
        if (!isMounted) return;

        // 예약 가능 시간 데이터 저장
        setAvailableTimeData(data);
      })
      .catch((error) => {
        if (!isMounted) return;

        console.error(error);
        alert('예약 가능 시간을 불러오지 못했습니다.');
      })
      .finally(() => {
        if (!isMounted) return;

        // 예약 가능 시간 로딩 종료
        setIsLoadingTimes(false);
      });

    // 언마운트 시 비동기 응답 무시
    return () => {
      isMounted = false;
    };
  }, [selectedDate]);

  // 이전 달로 이동
  const handlePrevMonth = () => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  // 다음 달로 이동
  const handleNextMonth = () => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  // 날짜 선택
  const handleSelectDate = (date: Date) => {
    const dateKey = formatDateKey(date);

    // 지난 날짜는 선택 막기
    if (dateKey < todayKey) return;

    // 날짜가 바뀌면 기존 시간 선택 초기화
    setSelectedTime('');

    // 이전 예약 가능 시간 데이터 초기화
    setAvailableTimeData(null);

    // 예약 가능 시간 로딩 시작
    setIsLoadingTimes(true);

    // 선택 날짜 저장
    setSelectedDate(dateKey);
  };

  // 다음 단계로 이동
  const handleNextStep = () => {
    if (!selectedDate || !selectedTime) {
      alert('방문 날짜와 방문 시간을 선택해주세요.');
      return;
    }

    setStep(2);
  };

  // 입력값 변경
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 예약 생성 요청
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedDate || !selectedTime) {
      alert('방문 날짜와 방문 시간을 선택해주세요.');
      setStep(1);
      return;
    }

    if (!formData.name || !formData.phone) {
      alert('이름과 핸드폰 번호를 입력해주세요.');
      return;
    }

    if (!formData.privacyAgreed) {
      alert('개인정보 수집 및 이용에 동의해주세요.');
      return;
    }

    try {
      // 예약 제출 시작
      setIsSubmitting(true);

      // 예약 생성 API 요청
      await createReservation({
        name: formData.name,
        phone: formData.phone,
        visitDate: selectedDate,
        visitTime: selectedTime,
        message: formData.message,
        privacyAgreed: formData.privacyAgreed,
      });

      // 예약 완료 단계로 이동
      setStep(3);
    } catch (error) {
      console.error(error);
      alert('예약에 실패했습니다. 이미 예약된 시간일 수 있습니다.');

      // 실패 시 최신 예약 가능 시간 다시 조회
      const latestTimes = await getAvailableTimes(selectedDate);
      setAvailableTimeData(latestTimes);
      setSelectedTime('');
      setStep(1);
    } finally {
      // 예약 제출 종료
      setIsSubmitting(false);
    }
  };

  return (
    <main className="bg-[#fbf8f4] text-[#342b24]">
      <section
        className="relative flex min-h-[420px] items-center overflow-hidden bg-cover bg-center px-6 md:min-h-[540px]"
        style={{
          backgroundImage: `url(${reservationHero})`,
        }}
      >
        <div className="absolute inset-0 bg-white/20" />

        <div className="relative z-10 mx-auto w-full max-w-7xl">
          <p className="text-xs uppercase tracking-[0.2em]">Reservation</p>
          <h1 className="mt-8 font-serif text-5xl leading-tight md:text-7xl">
            Special Moment,
            <br />
            Reserved for You
          </h1>
          <p className="mt-8 max-w-md text-sm leading-7 text-[#6f6258]">
            루비숑은 고객님의 소중한 시간을 위해 예약을 운영합니다.
            <br />
            원하는 시간을 선택하고, 특별한 순간을 준비하세요.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 md:py-24">
        <div className="text-center">
          <p className="text-lg leading-8">
            편안한 상담과 맞춤 서비스를 위해
            <br />
            사전 예약제로 운영하고 있습니다.
          </p>
        </div>

        <div className="mx-auto mt-14 max-w-3xl">
          <div className="relative grid grid-cols-3 text-center text-sm text-[#8a7b6f]">
            {/* 단계 사이 연결선 */}
            <div className="absolute left-[16.6%] right-[16.6%] top-4 h-px bg-[#ded3c8]" />

            {['날짜/시간 선택', '정보 입력', '예약 완료'].map((label, index) => {
              const number = index + 1;
              const isActive = step === number;
              const isDone = step > number;

              return (
                <div key={label} className="relative z-10 flex flex-col items-center">
                  {/* 단계 번호 */}
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full border ${
                      isActive || isDone
                        ? 'border-[#9b7650] bg-[#9b7650] text-white'
                        : 'border-[#d8cbbd] bg-[#fbf8f4] text-[#8a7b6f]'
                    }`}
                  >
                    {number}
                  </div>

                  {/* 단계 이름 */}
                  <p
                    className={`mt-4 ${
                      isActive ? 'font-semibold text-[#5a4636]' : 'text-[#8a7b6f]'
                    }`}
                  >
                    {label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {step === 1 && (
          <>
            <div className="mt-14 grid overflow-hidden border border-[#e2d8cf] bg-[#fffdf9] md:grid-cols-2">
              <div className="border-b border-[#e2d8cf] p-6 md:border-b-0 md:border-r md:p-10">
                <h2 className="text-lg font-semibold">방문 날짜 선택</h2>

                <div className="mt-8 flex items-center justify-between">
                  <button type="button" onClick={handlePrevMonth}>
                    <ChevronLeft size={20} />
                  </button>

                  <p className="font-serif text-xl ">
                    {viewDate.getFullYear()}.{String(viewDate.getMonth() + 1).padStart(2, '0')}
                  </p>

                  <button type="button" onClick={handleNextMonth} className="">
                    <ChevronRight size={20} />
                  </button>
                </div>

                <div className="mt-8 grid grid-cols-7 gap-y-4 text-center text-xs text-[#8a7b6f] ">
                  {weekDays.map((day) => (
                    <div key={day}>{day}</div>
                  ))}

                  {calendarDays.map((date, index) => {
                    if (!date) {
                      return <div key={`blank-${index}`} />;
                    }

                    const dateKey = formatDateKey(date);
                    const isPast = dateKey < todayKey;
                    const isSelected = selectedDate === dateKey;

                    return (
                      <button
                        key={dateKey}
                        type="button"
                        disabled={isPast}
                        onClick={() => handleSelectDate(date)}
                        className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm transition disabled:text-[#d6ccc1] cursor-pointer ${
                          isSelected
                            ? 'bg-[#9b7650] text-white'
                            : 'text-[#4c4037] hover:bg-[#f0e7dd]'
                        }`}
                      >
                        {date.getDate()}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-6 md:p-10">
                <h2 className="text-lg font-semibold">방문 시간 선택</h2>

                <p className="mt-8 text-sm text-[#8a7b6f]">
                  선택하신 날짜:{' '}
                  {selectedDate ? formatKoreanDate(selectedDate) : '날짜를 선택해주세요.'}
                </p>

                <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {RESERVATION_TIMES.map((time) => {
                    const isReserved = availableTimeData?.reservedTimes.includes(time) ?? false;
                    const isAvailable = availableTimeData?.availableTimes.includes(time) ?? false;
                    const isSelected = selectedTime === time;

                    return (
                      <button
                        key={time}
                        type="button"
                        disabled={!selectedDate || isLoadingTimes || isReserved || !isAvailable}
                        onClick={() => setSelectedTime(time)}
                        className={`h-13 border text-sm transition disabled:cursor-not-allowed disabled:bg-[#f4eee8] disabled:text-[#c7baae] cursor-pointer ${
                          isSelected
                            ? 'border-[#9b7650] bg-[#9b7650] text-white'
                            : 'border-[#e2d8cf] bg-white text-[#4c4037] hover:border-[#9b7650]'
                        }`}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>

                <p className="mt-8 text-xs text-[#9c8f83]">예약 가능 시간은 변동될 수 있습니다.</p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={handleNextStep}
                className="h-13 min-w-56 bg-[#9b7650] px-10 text-sm font-semibold text-white transition hover:bg-[#876542] cursor-pointer"
              >
                다음 단계 →
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-14 max-w-2xl border border-[#e2d8cf] bg-[#fffdf9] p-6 md:p-10"
          >
            <h2 className="text-lg font-semibold">예약 정보 입력</h2>

            <div className="mt-8 grid gap-5">
              <Input
                label="이름"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="이름을 입력해주세요"
              />

              <Input
                label="핸드폰 번호"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="01012345678"
              />

              <label>
                <span className="mb-2 block text-sm font-semibold">예약 내용</span>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="상담받고 싶은 내용을 적어주세요"
                  className="h-36 w-full resize-none border border-[#e2d8cf] bg-white px-4 py-3 text-sm outline-none focus:border-[#9b7650]"
                />
              </label>

              <label className="flex items-start gap-3 text-sm text-[#6f6258]">
                <input
                  type="checkbox"
                  checked={formData.privacyAgreed}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      privacyAgreed: e.target.checked,
                    }))
                  }
                  className="mt-1 accent-[#9b7650]"
                />
                개인정보 수집 및 이용에 동의합니다.
              </label>
            </div>

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="h-13 border border-[#d8cbbd] px-10 text-sm font-semibold cursor-pointer"
              >
                이전 단계
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="h-13 bg-[#9b7650] px-10 text-sm font-semibold text-white transition hover:bg-[#876542] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
              >
                {isSubmitting ? '예약 중...' : '예약하기'}
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <div className="mx-auto mt-14 max-w-2xl border border-[#e2d8cf] bg-[#fffdf9] px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#9b7650] text-white">
              <Check size={26} />
            </div>

            <h2 className="mt-8 font-serif text-4xl">Reservation Complete</h2>

            <p className="mt-6 leading-8 text-[#6f6258]">
              예약 신청이 완료되었습니다.
              <br />
              확인 후 연락드리겠습니다.
            </p>

            <div className="mx-auto mt-8 max-w-sm bg-[#f4eee8] px-6 py-5 text-sm leading-7 text-[#6f6258]">
              <p>방문 날짜: {formatKoreanDate(selectedDate)}</p>
              <p>방문 시간: {selectedTime}</p>
              <p>예약자: {formData.name}</p>
            </div>
          </div>
        )}
      </section>
    </main>
  );
};

const Input = ({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
}) => {
  return (
    <label>
      <span className="mb-2 block text-sm font-semibold">{label}</span>
      <input
        {...props}
        className="h-12 w-full border border-[#e2d8cf] bg-white px-4 text-sm outline-none focus:border-[#9b7650]"
      />
    </label>
  );
};

export default Reservation;
