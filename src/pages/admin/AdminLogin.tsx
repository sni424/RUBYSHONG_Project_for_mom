import { login } from '@/api/auth';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';

const AdminLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@rubyshong.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    try {
      const result = await login({ email, password });
      localStorage.setItem('adminToken', result.token);
      navigate('/admin');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || '로그인에 실패했습니다.');
        return;
      }
      setError('서버와 연결할 수 없습니다.');
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-10 text-text-primary sm:px-6 sm:py-14">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#ffffff_0%,rgba(245,241,235,0.75)_45%,#f5f1eb_100%)]" />

      <div className="relative z-10 w-full max-w-190">
        <div className="mb-8 text-center sm:mb-12">
          <h1 className="font-display text-[28px] tracking-[0.22em] sm:text-[42px]">RUBYSHONG</h1>
          <p className="mt-2 text-[10px] tracking-[0.45em] text-text-muted sm:text-[12px]">
            JEWELRY
          </p>
        </div>

        <section className="mx-auto w-full max-w-140 border border-line bg-card/90 px-5 py-9 shadow-[0_18px_60px_rgba(0,0,0,0.08)] backdrop-blur-sm sm:px-10 sm:py-12 lg:px-14 lg:py-14">
          <div className="mb-8 text-center sm:mb-10">
            <p className="mb-4 text-[11px] tracking-[0.25em] text-primary sm:text-[13px]">
              ADMIN LOGIN
            </p>

            <h2 className="font-display text-[34px] font-light leading-tight sm:text-[50px]">
              관리자 로그인
            </h2>

            <div className="mx-auto my-6 flex items-center justify-center gap-4 text-accent sm:my-7">
              <span className="h-px w-10 bg-accent sm:w-16" />
              <span className="text-base sm:text-lg">✽</span>
              <span className="h-px w-10 bg-accent sm:w-16" />
            </div>

            <p className="text-[13px] leading-6 text-text-secondary sm:text-sm sm:leading-7">
              루비숑 관리자 페이지입니다.
              <br />
              계정 정보를 입력하여 로그인해주세요.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            <div>
              <label className="mb-2.5 block text-[13px] sm:text-sm">이메일</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 w-full border border-line bg-white px-4 text-sm outline-none transition placeholder:text-text-muted focus:border-primary sm:h-14 sm:px-5"
                placeholder="이메일을 입력해주세요"
              />
            </div>

            <div>
              <label className="mb-2.5 block text-[13px] sm:text-sm">비밀번호</label>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 w-full border border-line bg-white px-4 pr-12 text-sm outline-none transition placeholder:text-text-muted focus:border-primary sm:h-14 sm:px-5"
                  placeholder="비밀번호를 입력해주세요"
                />

                <button
                  type="button"
                  aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center justify-center text-text-muted transition hover:text-primary"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && <p className="text-[13px] text-red-500">{error}</p>}

            <div className="pt-2">
              <button
                type="submit"
                className="
                h-12
                w-full
                cursor-pointer
                border
                border-accent
                bg-accent
                px-6
                text-[13px]
                tracking-[0.08em]
                text-background
                transition-all
                duration-300
                hover:bg-transparent
                hover:text-accent
                active:scale-[0.99]
                sm:h-13
    "
              >
                로그인
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
};

export default AdminLogin;
