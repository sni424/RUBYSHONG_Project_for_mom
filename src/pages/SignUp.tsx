import { sendPhoneVerificationCode, signup, verifyPhoneCode } from '@/api/auth';
import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';

const SignupPage = () => {
  const navigate = useNavigate();

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

  // 인증번호 발송 중 상태
  const [isSendingCode, setIsSendingCode] = useState(false);

  // 인증번호 발송 완료 여부
  const [isCodeSent, setIsCodeSent] = useState(false);

  // 휴대폰 인증 완료 여부
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  // 인증번호 확인 중 상태
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // 약관 동의 상태
  const [agreements, setAgreements] = useState({
    terms: false,
    privacy: false,
    marketing: false,
  });

  // 전체 동의 여부
  const isAllAgreed = agreements.terms && agreements.privacy && agreements.marketing;

  // 이메일 형식 검증
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // 입력 완료 상태
  const isNameComplete = formData.name.trim().length > 0;
  const isEmailComplete = isValidEmail(formData.email);
  // 비밀번호 형식 검증
  // 영문 1개 이상, 숫자 1개 이상, 전체 8자 이상
  const isValidPassword = (password: string) => {
    return /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(password);
  };

  // 비밀번호 입력 여부
  const hasPasswordValue = formData.password.length > 0;

  // 비밀번호 확인 입력 여부
  const hasPasswordConfirmValue = formData.passwordConfirm.length > 0;

  // 비밀번호 완료 여부
  const isPasswordComplete = isValidPassword(formData.password);

  // 비밀번호 에러 여부
  const isPasswordError = hasPasswordValue && !isPasswordComplete;

  // 비밀번호 확인 완료 여부
  const isPasswordConfirmComplete =
    hasPasswordConfirmValue && formData.password === formData.passwordConfirm;

  // 비밀번호 확인 에러 여부
  const isPasswordConfirmError =
    hasPasswordConfirmValue && formData.password !== formData.passwordConfirm;
  const isVerificationCodeComplete = isPhoneVerified;

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
  const handleSendVerificationCode = async () => {
    if (!formData.phone) {
      alert('휴대폰 번호를 입력해주세요.');
      return;
    }

    try {
      // 인증번호 발송 버튼 로딩 시작
      setIsSendingCode(true);

      // 휴대폰 인증번호 발송 API 요청
      const result = await sendPhoneVerificationCode({
        phone: formData.phone,
      });

      // 인증번호 발송 완료 상태 저장
      setIsCodeSent(true);

      alert(`인증번호가 발송되었습니다.\n테스트 인증번호: ${result.data.code}`);
    } catch (error) {
      console.error(error);

      if (axios.isAxiosError(error) && error.response?.data?.message) {
        alert(error.response.data.message);
        return;
      }

      alert('인증번호 발송에 실패했습니다.');
    } finally {
      // 인증번호 발송 버튼 로딩 종료
      setIsSendingCode(false);
    }
  };

  // 휴대폰 인증번호 확인
  const handleVerifyCode = async () => {
    if (!formData.phone) {
      alert('휴대폰 번호를 입력해주세요.');
      return;
    }

    if (!formData.verificationCode) {
      alert('인증번호를 입력해주세요.');
      return;
    }

    try {
      // 인증번호 확인 버튼 로딩 시작
      setIsVerifyingCode(true);

      // 휴대폰 인증번호 확인 API 요청
      await verifyPhoneCode({
        phone: formData.phone,
        code: formData.verificationCode,
      });

      // 휴대폰 인증 완료 상태 저장
      setIsPhoneVerified(true);

      alert('휴대폰 인증이 완료되었습니다.');
    } catch (error) {
      console.error(error);

      if (axios.isAxiosError(error) && error.response?.data?.message) {
        alert(error.response.data.message);
        return;
      }

      alert('인증번호 확인에 실패했습니다.');
    } finally {
      // 인증번호 확인 버튼 로딩 종료
      setIsVerifyingCode(false);
    }
  };

  // 네이버 회원가입
  const handleNaverSignup = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/naver`;
  };

  // 카카오 회원가입
  const handleKakaoSignup = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/kakao`;
  };

  // 회원가입 제출
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password || !formData.passwordConfirm) {
      alert('필수 정보를 입력해주세요.');
      return;
    }

    if (!isValidPassword(formData.password)) {
      alert('비밀번호는 영문과 숫자를 포함하여 8자 이상 입력해주세요.');
      return;
    }

    if (formData.password !== formData.passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (!formData.phone) {
      alert('휴대폰 번호를 입력해주세요.');
      return;
    }

    if (!isPhoneVerified) {
      alert('휴대폰 인증을 완료해주세요.');
      return;
    }

    if (!agreements.terms || !agreements.privacy) {
      alert('필수 약관에 동의해주세요.');
      return;
    }

    try {
      // 회원가입 버튼 로딩 시작
      setIsSubmitting(true);

      // 회원가입 API 요청
      await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
      });

      alert('회원가입이 완료되었습니다. 로그인해주세요.');

      // 회원가입 완료 후 로그인 페이지로 이동
      navigate('/login');
    } catch (error) {
      console.error(error);

      if (axios.isAxiosError(error) && error.response?.data?.message) {
        alert(error.response.data.message);
        return;
      }

      alert('회원가입에 실패했습니다.');
    } finally {
      // 회원가입 버튼 로딩 종료
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f8f3ed] px-4 py-7 text-[#2d2520] sm:py-8">
      <div className="mx-auto w-full max-w-4xl">
        <header className="mb-7 text-center sm:mb-8">
          <Link to="/" className="inline-block max-w-full">
            <h1 className="wrap-break-word font-serif text-4xl tracking-[0.18em] text-[#2d2520] sm:text-6xl sm:tracking-[0.32em]">
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
                isComplete={isNameComplete}
              />
            </FormField>

            <FormField label="이메일">
              <TextInput
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="이메일을 입력해주세요"
                isComplete={isEmailComplete}
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
                isComplete={isPasswordComplete}
                isError={isPasswordError}
              />
              {isPasswordError && (
                <p className="mt-2 text-xs font-medium text-red-500">
                  비밀번호는 영문과 숫자를 포함하여 8자 이상 입력해주세요.
                </p>
              )}
            </FormField>

            <FormField label="비밀번호 확인">
              <PasswordInput
                name="passwordConfirm"
                value={formData.passwordConfirm}
                show={showPasswordConfirm}
                onChange={handleChange}
                onToggle={() => setShowPasswordConfirm((prev) => !prev)}
                placeholder="비밀번호를 다시 입력해주세요"
                isComplete={isPasswordConfirmComplete}
                isError={isPasswordConfirmError}
              />
              {isPasswordConfirmError && (
                <p className="mt-2 text-xs font-medium text-red-500">
                  비밀번호가 일치하지 않습니다.
                </p>
              )}
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
                  disabled={isSendingCode}
                  className="h-13 w-full bg-[#ad843d] px-5 text-sm font-semibold text-white transition hover:bg-[#9b7433] cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSendingCode ? '발송 중' : isCodeSent ? '다시 받기' : '인증번호 받기'}
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
                  isComplete={isVerificationCodeComplete}
                />
                <button
                  type="button"
                  onClick={handleVerifyCode}
                  disabled={isVerifyingCode || isPhoneVerified}
                  className="h-13 w-full border border-[#d7c7b3] bg-white px-5 text-sm font-semibold text-[#9b7433] transition cursor-pointer hover:bg-[#faf7f2] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isVerifyingCode ? '확인 중' : isPhoneVerified ? '인증 완료' : '확인'}
                </button>
              </div>
              <p className="mt-2 text-xs leading-5 text-[#7b7068]">
                {isCodeSent
                  ? '인증번호가 발송되었습니다. 3분 안에 입력해주세요.'
                  : '인증번호는 3분간 유효합니다.'}
              </p>
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
              disabled={isSubmitting}
              className="mt-7 h-14 w-full bg-[#ad843d] text-base font-semibold cursor-pointer text-white transition hover:bg-[#9b7433] disabled:cursor-not-allowed disabled:opacity-60 sm:h-15 sm:text-lg"
            >
              {isSubmitting ? '가입 중' : '회원가입'}
            </button>

            <div className="my-6 flex items-center gap-4 text-sm text-[#7b7068]">
              <span className="h-px flex-1 bg-[#e7d9c8]" />
              <span>또는</span>
              <span className="h-px flex-1 bg-[#e7d9c8]" />
            </div>

            <div className="space-y-3">
              {/* 네이버 회원가입 */}
              <button
                type="button"
                onClick={handleNaverSignup}
                className="flex h-12 w-full items-center justify-center gap-3 border border-[#e2d5c4] bg-white text-sm font-medium text-[#2d2520] transition cursor-pointer hover:border-[#03c75a] hover:bg-[#f4fff8]"
              >
                <span className="font-bold text-[#03c75a]">N</span>
                네이버로 시작하기
              </button>

              {/* 카카오 회원가입 */}
              <button
                type="button"
                onClick={handleKakaoSignup}
                className="flex h-12 w-full items-center justify-center gap-3 border border-[#e2d5c4] bg-white text-sm font-medium text-[#2d2520] cursor-pointer transition hover:border-[#fee500] hover:bg-[#fffbe8]"
              >
                <span className="rounded-sm bg-[#fee500] px-1.5 py-0.5 text-xs font-bold text-[#3c1e1e]">
                  K
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
  isComplete = false,
}: {
  name: string;
  value: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  isComplete?: boolean;
}) => {
  return (
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`h-13 w-full border px-4 text-sm outline-none placeholder:text-[#9d958d] sm:px-5 ${
        isComplete
          ? 'border-[#b9c7df] bg-[#edf4ff] text-[#1f2937] focus:border-[#8da9d6]'
          : 'border-[#e2d5c4] bg-white text-[#2d2520] focus:border-[#b08a48]'
      }`}
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
  isComplete = false,
  isError = false,
}: {
  name: string;
  value: string;
  placeholder: string;
  show: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggle: () => void;
  isComplete?: boolean;
  isError?: boolean;
}) => {
  const inputStyle = isError
    ? 'border-red-300 bg-red-50 text-red-900 focus:border-red-400'
    : isComplete
      ? 'border-[#b9c7df] bg-[#edf4ff] text-[#1f2937] focus:border-[#8da9d6]'
      : 'border-[#e2d5c4] bg-white text-[#2d2520] focus:border-[#b08a48]';
  return (
    <div className="relative">
      <input
        name={name}
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`h-13 w-full border px-4 pr-14 text-sm outline-none placeholder:text-[#9d958d] sm:px-5 sm:pr-16 ${inputStyle}`}
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
