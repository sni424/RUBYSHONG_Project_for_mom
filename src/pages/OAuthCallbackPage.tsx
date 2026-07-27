import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useAuthStore } from '@/stores/authStore';

const OAuthCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const loginWithToken = useAuthStore((state) => state.loginWithToken);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      // 백엔드에서 redirect로 전달한 토큰 가져오기
      const token = searchParams.get('token');

      if (!token) {
        alert('로그인에 실패했습니다.');
        navigate('/login');
        return;
      }

      // 토큰 저장 후 현재 회원 정보 조회
      await loginWithToken(token);

      // 로그인 완료 후 메인으로 이동
      navigate('/');
    };

    handleOAuthCallback();
  }, [loginWithToken, navigate, searchParams]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f3ed] px-4 text-[#2d2520]">
      <div className="text-center">
        <h1 className="font-serif text-4xl tracking-[0.24em]">RUBYSHONG</h1>
        <p className="mt-5 text-sm text-[#6f6258]">로그인 처리 중입니다.</p>
      </div>
    </main>
  );
};

export default OAuthCallbackPage;
