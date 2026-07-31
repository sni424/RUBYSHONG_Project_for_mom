import { Link } from 'react-router';

const PrivacyPolicy = () => {
  return (
    <main className="min-h-screen bg-[#f8f3ed] px-5 py-12 text-[#2d2520] sm:px-6 sm:py-16">
      <section className="mx-auto max-w-[860px] border border-[#e2d5c4] bg-white px-6 py-9 shadow-sm sm:px-12 sm:py-12">
        <Link to="/" className="block text-center">
          <h1 className="font-display text-4xl tracking-[0.28em] sm:text-5xl">RUBYSHONG</h1>
          <p className="mt-2 text-xs tracking-[0.45em] text-[#8a7b6e]">JEWELRY</p>
        </Link>

        <div className="mt-10">
          <p className="text-xs tracking-[0.3em] text-[#b08a48]">POLICY</p>
          <h2 className="mt-3 font-serif text-3xl sm:text-4xl">개인정보 처리방침</h2>
          <p className="mt-5 text-sm leading-7 text-[#6f6258]">
            루비숑은 회원가입, 상담 문의, 방문 예약 서비스 제공을 위해 필요한 최소한의 개인정보만
            수집하며, 관련 법령에 따라 안전하게 관리합니다.
          </p>
        </div>

        <div className="mt-10 space-y-8 text-sm leading-8 text-[#4b4038]">
          <section>
            <h3 className="font-semibold text-[#2d2520]">1. 수집하는 개인정보 항목</h3>
            <p className="mt-2">
              루비숑은 서비스 이용 과정에서 이름, 이메일, 휴대폰 번호, 문의 내용, 방문 예약 정보를
              수집할 수 있습니다. 소셜 로그인 이용 시 제공자로부터 이메일, 이름 또는 닉네임 등의
              정보를 제공받을 수 있습니다.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-[#2d2520]">2. 개인정보 수집 및 이용 목적</h3>
            <p className="mt-2">
              수집한 개인정보는 회원 관리, 상담 문의 응대, 방문 예약 확인, 상품 안내 및 서비스
              제공을 위해 이용됩니다.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-[#2d2520]">3. 개인정보 보유 및 이용 기간</h3>
            <p className="mt-2">
              개인정보는 수집 및 이용 목적이 달성될 때까지 보유하며, 회원 탈퇴 또는 삭제 요청 시
              지체 없이 파기합니다. 단, 관련 법령에 따라 보관이 필요한 경우 해당 기간 동안 보관할 수
              있습니다.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-[#2d2520]">4. 개인정보 제3자 제공</h3>
            <p className="mt-2">
              루비숑은 이용자의 동의 없이 개인정보를 외부에 제공하지 않습니다. 다만 법령에 의해
              요구되는 경우에는 예외로 합니다.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-[#2d2520]">5. 개인정보 처리 위탁</h3>
            <p className="mt-2">
              루비숑은 서비스 운영을 위해 서버, 데이터베이스, 이미지 저장소 등 외부 클라우드
              서비스를 이용할 수 있으며, 개인정보가 안전하게 처리되도록 관리합니다.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-[#2d2520]">6. 이용자의 권리</h3>
            <p className="mt-2">
              이용자는 언제든지 본인의 개인정보 열람, 수정, 삭제를 요청할 수 있습니다. 관련 요청은
              루비숑 고객 문의 채널을 통해 접수할 수 있습니다.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-[#2d2520]">7. 개인정보 보호 문의</h3>
            <p className="mt-2">
              개인정보 처리와 관련한 문의는 루비숑 고객 문의 페이지를 통해 접수해 주세요.
            </p>
          </section>
        </div>

        <div className="mt-10 border-t border-[#e2d5c4] pt-6 text-xs leading-6 text-[#8a7b6e]">
          <p>시행일자: 2026년 7월 31일</p>
        </div>
      </section>
    </main>
  );
};

export default PrivacyPolicy;
