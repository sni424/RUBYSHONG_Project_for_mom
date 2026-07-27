import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

const OAuthCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // 백엔드에서 전달한 로그인 토큰 가져오기
    const token = searchParams.get('token');

    // 토큰이 없으면 로그인 실패 처리
    if (!token) {
      alert('로그인에 실패했습니다.');
      navigate('/login');
      return;
    }

    // 일반 회원 토큰 저장
    localStorage.setItem('userToken', token);

    // 로그인 완료 후 메인 페이지로 이동
    navigate('/');
  }, [navigate, searchParams]);

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
