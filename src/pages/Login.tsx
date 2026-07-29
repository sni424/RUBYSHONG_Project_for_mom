import { userLogin } from '@/api/auth';
import { useAuthStore } from '@/stores/authStore';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import { type FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router';

const LoginPage = () => {
  const navigate = useNavigate();
  const loginWithToken = useAuthStore((state) => state.loginWithToken);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email || !password) {
      alert('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    try {
      // 로그인 버튼 로딩 시작
      setIsSubmitting(true);

      // 일반 회원 로그인 API 요청
      const result = await userLogin({
        email,
        password,
      });

      // 토큰 저장 후 전역 로그인 상태 갱신
      await loginWithToken(result.token);

      // 로그인 완료 후 메인으로 이동
      navigate('/');
    } catch (error) {
      console.error(error);

      if (axios.isAxiosError(error) && error.response?.data?.message) {
        alert(error.response.data.message);
        return;
      }

      alert('로그인에 실패했습니다.');
    } finally {
      // 로그인 버튼 로딩 종료
      setIsSubmitting(false);
    }
  };

  const handleNaverLogin = () => {
    // 네이버 로그인 시작 API로 이동
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/naver`;
  };

  const handleKakaoLogin = () => {
    // 카카오 로그인은 백엔드 구현 후 연결
    alert('카카오 로그인은 준비 중입니다.');
  };

  return (
    <main className="min-h-screen bg-[#f8f3ed] px-4 py-8 text-[#2d2520] sm:px-6 sm:py-12">
      <section className="mx-auto w-full max-w-180">
        <div className="mt-8 border border-[#e2d5c4] bg-white px-5 py-8 shadow-sm sm:mt-10 sm:px-14 sm:py-10">
          <div className="text-center">
            <p className="text-[10px] tracking-[0.32em] sm:text-xs sm:tracking-[0.35em]">
              MEMBERSHIP
            </p>

            <h2 className="mt-4 font-serif text-[34px] sm:text-4xl">로그인</h2>

            <p className="mx-auto mt-5 max-w-105 text-sm leading-7 text-[#6f6258]">
              루비숑 회원으로 로그인하시면 예약 및 상품 정보를 더 편리하게 이용하실 수 있습니다.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-9 space-y-5 sm:mt-10 sm:space-y-6">
            <div>
              <label className="mb-2.5 block text-sm font-semibold sm:mb-3">이메일</label>

              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="이메일을 입력해주세요"
                className="h-13 w-full border border-[#e2d5c4] px-4 text-sm outline-none transition focus:border-[#b08a48] sm:h-14 sm:px-5"
              />
            </div>

            <div>
              <label className="mb-2.5 block text-sm font-semibold sm:mb-3">비밀번호</label>

              <div className="flex h-13 items-center border border-[#e2d5c4] px-4 transition focus-within:border-[#b08a48] sm:h-14 sm:px-5">
                <input
                  type={isPasswordVisible ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="비밀번호를 입력해주세요"
                  className="h-full min-w-0 flex-1 text-sm outline-none"
                />

                <button
                  type="button"
                  onClick={() => setIsPasswordVisible((prev) => !prev)}
                  className="shrink-0 text-[#6f6258] transition hover:text-[#2d2520]"
                  aria-label={isPasswordVisible ? '비밀번호 숨기기' : '비밀번호 보기'}
                >
                  {isPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="h-13 w-full bg-[#b58a42] text-sm font-semibold tracking-[0.12em] cursor-pointer text-white transition hover:bg-[#9f7938] disabled:cursor-not-allowed disabled:opacity-60 sm:h-14"
            >
              {isSubmitting ? '로그인 중' : '로그인'}
            </button>
          </form>

          <div className="mt-7 flex items-center gap-4 text-xs text-[#8a7b6e] sm:mt-8">
            <span className="h-px flex-1 bg-[#e2d5c4]" />
            <span>또는</span>
            <span className="h-px flex-1 bg-[#e2d5c4]" />
          </div>

          <div className="mt-5 space-y-3 sm:mt-6">
            <button
              type="button"
              onClick={handleNaverLogin}
              className="flex h-12 w-full items-center justify-center gap-3 border cursor-pointer border-[#e2d5c4] bg-white text-sm font-medium transition hover:border-[#03c75a] hover:bg-[#f4fff8]"
            >
              <span className="font-bold text-[#03c75a]">N</span>
              네이버로 로그인
            </button>

            <button
              type="button"
              onClick={handleKakaoLogin}
              className="flex h-12 w-full items-center justify-center gap-3 border cursor-pointer border-[#e2d5c4] bg-white text-sm font-medium transition hover:border-[#fee500] hover:bg-[#fffbe8]"
            >
              <span className="rounded-sm bg-[#fee500] px-1.5 py-0.5 text-xs font-bold text-[#3c1e1e]">
                K
              </span>
              카카오로 로그인
            </button>
          </div>

          <p className="mt-7 text-center text-sm leading-6 text-[#6f6258] sm:mt-8">
            아직 회원이 아니신가요?{' '}
            <Link to="/signup" className="font-semibold text-[#9f7938] hover:underline">
              회원가입
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
};

export default LoginPage;
