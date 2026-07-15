import { useState } from 'react';
import { Link } from 'react-router';

const SignupPage = () => {
  // 회원가입 입력값
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    phone: '',
    verificationCode: '',
  });

  // 비밀번호 보기 상태
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  // 약관 동의 상태
  const [agreements, setAgreements] = useState({
    terms: false,
    privacy: false,
    marketing: false,
  });

  // 전체 동의 여부
  const isAllAgreed = agreements.terms && agreements.privacy && agreements.marketing;

  // 입력값 변경
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 전체 동의 변경
  const handleAllAgreementChange = () => {
    const nextValue = !isAllAgreed;

    setAgreements({
      terms: nextValue,
      privacy: nextValue,
      marketing: nextValue,
    });
  };

  // 개별 약관 변경
  const handleAgreementChange = (name: keyof typeof agreements) => {
    setAgreements((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  // 휴대폰 인증번호 요청
  const handleSendVerificationCode = () => {
    if (!formData.phone) {
      alert('휴대폰 번호를 입력해주세요.');
      return;
    }

    // TODO: 휴대폰 인증번호 발송 API 연결
    alert('인증번호 발송 기능은 준비 중입니다.');
  };

  // 휴대폰 인증번호 확인
  const handleVerifyCode = () => {
    if (!formData.verificationCode) {
      alert('인증번호를 입력해주세요.');
      return;
    }

    // TODO: 휴대폰 인증번호 확인 API 연결
    alert('인증번호 확인 기능은 준비 중입니다.');
  };

  // 네이버 회원가입
  const handleNaverSignup = () => {
    // TODO: 네이버 OAuth API 연결
    alert('네이버 회원가입은 준비 중입니다.');
  };

  // 카카오 회원가입
  const handleKakaoSignup = () => {
    // TODO: 카카오 OAuth API 연결
    alert('카카오 회원가입은 준비 중입니다.');
  };

  // 회원가입 제출
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password || !formData.passwordConfirm) {
      alert('필수 정보를 입력해주세요.');
      return;
    }

    if (formData.password.length < 8) {
      alert('비밀번호는 8자 이상 입력해주세요.');
      return;
    }

    if (formData.password !== formData.passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (!agreements.terms || !agreements.privacy) {
      alert('필수 약관에 동의해주세요.');
      return;
    }

    // TODO: 회원가입 API 연결
    console.log({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
    });
  };

  return (
    <main className="min-h-screen bg-[#f8f3ed] px-4 py-7 text-[#2d2520] sm:py-8">
      <div className="mx-auto w-full max-w-4xl">
        <header className="mb-7 text-center sm:mb-8">
          <Link to="/" className="inline-block max-w-full">
            <h1 className="break-words font-serif text-4xl tracking-[0.18em] text-[#2d2520] sm:text-6xl sm:tracking-[0.32em]">
              RUBYSHONG
            </h1>
            <p className="mt-3 text-xs tracking-[0.45em] text-[#3f352e] sm:mt-4 sm:text-sm sm:tracking-[0.55em]">
              JEWELRY
            </p>
          </Link>
        </header>

        <section className="mx-auto w-full max-w-3xl border border-[#e2d5c4] bg-white/75 px-5 py-8 shadow-[0_24px_80px_rgba(80,55,30,0.08)] sm:px-14 sm:py-9">
          <div className="mb-8 text-center">
            <p className="mb-3 text-xs tracking-[0.38em] sm:mb-4 sm:text-sm sm:tracking-[0.45em]">
              MEMBERSHIP
            </p>

            <h2 className="text-4xl font-light tracking-[-0.04em] sm:text-5xl">회원가입</h2>

            <div className="my-6 flex items-center justify-center gap-4 text-[#b08a48] sm:my-7 sm:gap-6">
              <span className="h-px w-18 bg-[#b08a48] sm:w-24" />
              <span className="text-2xl leading-none sm:text-3xl">*</span>
              <span className="h-px w-18 bg-[#b08a48] sm:w-24" />
            </div>

            <p className="text-sm leading-7 text-[#6f6258] sm:text-base">
              루비숑의 새로운 회원이 되어보세요.
              <br />
              회원 정보를 입력하시면 예약 및 상품 정보를
              <br className="hidden sm:block" />
              더욱 편리하게 이용하실 수 있습니다.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mx-auto w-full max-w-2xl">
            <FormField label="이름">
              <TextInput
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="이름을 입력해주세요"
              />
            </FormField>

            <FormField label="이메일">
              <TextInput
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="이메일을 입력해주세요"
              />
              <p className="mt-2 text-xs leading-5 text-[#7b7068]">
                이메일 인증은 진행하지 않으며, 로그인 및 안내 용도로 사용됩니다.
              </p>
            </FormField>

            <FormField label="비밀번호">
              <PasswordInput
                name="password"
                value={formData.password}
                show={showPassword}
                onChange={handleChange}
                onToggle={() => setShowPassword((prev) => !prev)}
                placeholder="영문, 숫자를 포함하여 8자 이상 입력해주세요"
              />
            </FormField>

            <FormField label="비밀번호 확인">
              <PasswordInput
                name="passwordConfirm"
                value={formData.passwordConfirm}
                show={showPasswordConfirm}
                onChange={handleChange}
                onToggle={() => setShowPasswordConfirm((prev) => !prev)}
                placeholder="비밀번호를 다시 입력해주세요"
              />
            </FormField>

            <FormField label="휴대폰 번호">
              <div className="grid gap-3 sm:grid-cols-[1fr_190px]">
                <TextInput
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="010-0000-0000"
                />
                <button
                  type="button"
                  onClick={handleSendVerificationCode}
                  className="h-13 w-full bg-[#ad843d] px-5 text-sm font-semibold text-white transition hover:bg-[#9b7433]"
                >
                  인증번호 받기
                </button>
              </div>
            </FormField>

            <FormField label="인증번호">
              <div className="grid gap-3 sm:grid-cols-[1fr_170px]">
                <TextInput
                  name="verificationCode"
                  value={formData.verificationCode}
                  onChange={handleChange}
                  placeholder="인증번호를 입력해주세요"
                />
                <button
                  type="button"
                  onClick={handleVerifyCode}
                  className="h-13 w-full border border-[#d7c7b3] bg-white px-5 text-sm font-semibold text-[#9b7433] transition hover:bg-[#faf7f2]"
                >
                  확인
                </button>
              </div>
              <p className="mt-2 text-xs leading-5 text-[#7b7068]">인증번호는 3분간 유효합니다.</p>
            </FormField>

            <div className="my-7 h-px bg-[#e7d9c8]" />

            <div className="space-y-4 text-sm text-[#51463d]">
              <label className="flex items-center gap-3 font-semibold">
                <input
                  type="checkbox"
                  checked={isAllAgreed}
                  onChange={handleAllAgreementChange}
                  className="h-5 w-5 shrink-0 accent-[#ad843d]"
                />
                전체 동의
              </label>

              <AgreementRow
                checked={agreements.terms}
                onChange={() => handleAgreementChange('terms')}
                label="[필수] 이용약관에 동의합니다."
              />

              <AgreementRow
                checked={agreements.privacy}
                onChange={() => handleAgreementChange('privacy')}
                label="[필수] 개인정보 수집 및 이용에 동의합니다."
              />

              <AgreementRow
                checked={agreements.marketing}
                onChange={() => handleAgreementChange('marketing')}
                label="[선택] 이벤트 및 혜택 정보 수신에 동의합니다."
              />
            </div>

            <button
              type="submit"
              className="mt-7 h-14 w-full bg-[#ad843d] text-base font-semibold text-white transition hover:bg-[#9b7433] sm:h-15 sm:text-lg"
            >
              회원가입
            </button>

            <div className="my-6 flex items-center gap-4 text-sm text-[#7b7068]">
              <span className="h-px flex-1 bg-[#e7d9c8]" />
              <span>또는</span>
              <span className="h-px flex-1 bg-[#e7d9c8]" />
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={handleNaverSignup}
                className="relative h-12 w-full border border-[#d7c7b3] bg-white px-12 text-sm font-semibold text-[#2d2520] transition hover:bg-[#faf7f2]"
              >
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl font-black text-[#03c75a] sm:left-8">
                  N
                </span>
                네이버로 시작하기
              </button>

              <button
                type="button"
                onClick={handleKakaoSignup}
                className="relative h-12 w-full border border-[#d7c7b3] bg-white px-12 text-sm font-semibold text-[#2d2520] transition hover:bg-[#faf7f2]"
              >
                <span className="absolute left-5 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded bg-[#fee500] text-xs font-black text-[#3c1e1e] sm:left-8">
                  ●
                </span>
                카카오로 시작하기
              </button>
            </div>

            <p className="mt-7 text-center text-sm text-[#6f6258]">
              이미 회원이신가요?{' '}
              <Link to="/login" className="font-semibold text-[#9b7433] hover:underline">
                로그인
              </Link>
            </p>
          </form>
        </section>
      </div>
    </main>
  );
};

const FormField = ({ label, children }: { label: string; children: React.ReactNode }) => {
  return (
    <label className="mb-5 block">
      <span className="mb-2.5 block text-sm font-semibold text-[#2d2520]">{label}</span>
      {children}
    </label>
  );
};

const TextInput = ({
  name,
  value,
  placeholder,
  onChange,
  type = 'text',
}: {
  name: string;
  value: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}) => {
  return (
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="h-13 w-full border border-[#e2d5c4] bg-white px-4 text-sm outline-none placeholder:text-[#9d958d] focus:border-[#b08a48] sm:px-5"
    />
  );
};

const PasswordInput = ({
  name,
  value,
  placeholder,
  show,
  onChange,
  onToggle,
}: {
  name: string;
  value: string;
  placeholder: string;
  show: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggle: () => void;
}) => {
  return (
    <div className="relative">
      <input
        name={name}
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="h-13 w-full border border-[#e2d5c4] bg-white px-4 pr-14 text-sm outline-none placeholder:text-[#9d958d] focus:border-[#b08a48] sm:px-5 sm:pr-16"
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#6f6258]"
      >
        {show ? '숨김' : '보기'}
      </button>
    </div>
  );
};

const AgreementRow = ({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) => {
  return (
    <div className="flex items-start justify-between gap-4">
      <label className="flex min-w-0 items-start gap-3 leading-6">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="mt-0.5 h-5 w-5 shrink-0 accent-[#ad843d]"
        />
        <span>{label}</span>
      </label>

      <button type="button" className="shrink-0 text-[#6f6258] underline">
        보기
      </button>
    </div>
  );
};

export default SignupPage;
