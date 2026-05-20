import { FaComment, FaPhoneAlt } from 'react-icons/fa';

const Footer = () => {
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

            <a
              href="#store"
              className="mt-5 inline-block text-sm tracking-[0.12em] text-text-secondary transition hover:text-accent"
            >
              오시는 길 →
            </a>
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
              <button
                type="button"
                className="flex h-14 w-full min-w-0 items-center justify-center gap-3 border border-line px-5 text-sm text-text-secondary transition hover:border-accent hover:text-accent sm:w-auto
                cursor-pointer
                "
              >
                <FaComment size={15} />
                카카오톡 상담
              </button>

              <a
                href="tel:021234567"
                className="flex h-14 w-full min-w-0 items-center justify-center gap-3 border border-line px-5 text-sm text-text-secondary transition hover:border-accent hover:text-accent sm:w-auto
                cursor-pointer
                "
              >
                <FaPhoneAlt size={14} />
                전화 문의
              </a>
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
