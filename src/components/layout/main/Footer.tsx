import { FaComment, FaPhoneAlt } from 'react-icons/fa';
import { Link } from 'react-router';

const STORE_PHONE_NUMBER = '01033938107';

const Footer = () => {
  // 모바일 기기인지 확인
  const isMobileDevice = () => {
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  };

  // 전화 문의 연결
  const handlePhoneCall = () => {
    // PC에서는 전화 연결이 어려우니 안내
    if (!isMobileDevice()) {
      alert('전화 문의는 모바일에서 이용해주세요.');
      return;
    }

    // 모바일 전화 앱 열기
    window.location.href = `tel:${STORE_PHONE_NUMBER}`;
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
    const message = `[루비숑 상담 예약]\n상담 예약을 문의드립니다.`;

    // iOS는 &body, Android는 ?body가 더 안정적
    const separator = isIOSDevice() ? '&' : '?';

    // 문자 앱 열기
    window.location.href = `sms:${STORE_PHONE_NUMBER}${separator}body=${encodeURIComponent(message)}`;
  };

  return (
    <footer id="contact" className="bg-surface">
      <div className="mx-auto w-full max-w-7xl px-5 py-10 md:px-10 md:py-10">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-0">
          <div className="border-line md:border-r md:pr-10">
            <h3 className="font-display text-sm tracking-[0.18em] text-text-primary">
              STORE INFORMATION
            </h3>

            <p className="mt-6 text-sm leading-8 text-text-secondary">
              롯데백화점 본점 1F
              <br />
              서울 중구 남대문로 81
              <br />
              02-123-4567
              <br />
              10:30 - 20:00 (월-일)
            </p>

            <Link
              to="/stores"
              className="mt-5 inline-block text-sm tracking-[0.12em] text-text-secondary transition hover:text-accent"
            >
              오시는 길 →
            </Link>
          </div>

          <div id="reservation" className="border-line md:border-r md:px-10">
            <h3 className="font-display text-sm tracking-[0.18em] text-text-primary">
              RESERVATION
            </h3>

            <p className="mt-6 text-sm leading-8 text-text-secondary">
              방문 상담을 원하시면
              <br />
              예약 후 편안한 상담을 받아보세요.
            </p>

            <button
              type="button"
              onClick={handleReservationSms}
              className="mt-6 w-full max-w-55 border border-accent px-8 py-4 text-sm tracking-[0.08em] text-accent transition hover:bg-accent hover:text-white md:w-45
              cursor-pointer
              "
            >
              예약하기
            </button>
          </div>

          <div className="relative md:pl-10">
            <h3 className="font-display text-sm tracking-[0.18em] text-text-primary">CONTACT</h3>

            <p className="mt-6 text-sm leading-8 text-text-secondary">
              궁금하신 점은 언제든지 문의해주세요.
            </p>

            <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row">
              <a
                href="http://pf.kakao.com/_qHBbX/chat"
                target="_blank"
                rel="noreferrer"
                className="flex h-14 w-full min-w-0 items-center justify-center gap-3 border border-line px-5 text-sm text-text-secondary transition hover:border-accent hover:text-accent sm:w-auto
                cursor-pointer
                "
              >
                <FaComment size={15} />
                카카오톡 상담
              </a>
              <button
                type="button"
                onClick={handlePhoneCall}
                className="flex h-14 w-full min-w-0 items-center justify-center gap-3 border border-line px-5 text-sm text-text-secondary transition hover:border-accent hover:text-accent sm:w-auto cursor-pointer"
              >
                <FaPhoneAlt size={14} />
                전화 문의
              </button>
            </div>

            <div className="pointer-events-none absolute -bottom-7.5 right-0 hidden text-[120px] leading-none text-accent/15 lg:block">
              ✧
            </div>
          </div>
        </div>

        <p className="mt-14 text-center text-[11px] tracking-[0.18em] text-text-muted md:mt-20">
          © RUBYSHONG JEWELRY. ALL RIGHTS RESERVED.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
