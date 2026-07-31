import { confirmPayment } from '@/api/payment';
import { useCartStore } from '@/stores/cartStore';
import axios from 'axios';
import { CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router';

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const clearCart = useCartStore((state) => state.clearCart);

  const [isLoading, setIsLoading] = useState(true);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [message, setMessage] = useState('결제 승인 중입니다.');

  useEffect(() => {
    const confirm = async () => {
      const paymentKey = searchParams.get('paymentKey');
      const orderCode = searchParams.get('orderId');
      const amount = searchParams.get('amount');

      if (!paymentKey || !orderCode || !amount) {
        setMessage('결제 승인 정보가 올바르지 않습니다.');
        setIsLoading(false);
        return;
      }

      try {
        // 백엔드 결제 승인 API 요청
        await confirmPayment({
          paymentKey,
          orderCode,
          amount: Number(amount),
        });

        // 결제 성공 후 장바구니 비우기
        clearCart();

        setIsConfirmed(true);
        setMessage('결제가 완료되었습니다.');
      } catch (error) {
        console.error(error);

        if (axios.isAxiosError(error) && error.response?.data?.message) {
          setMessage(error.response.data.message);
        } else {
          setMessage('결제 승인에 실패했습니다.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    confirm();
  }, [clearCart, searchParams]);

  return (
    <main className="min-h-screen bg-[#f8f3ed] px-5 py-16 text-[#2d2520]">
      <section className="mx-auto max-w-160 border border-[#e2d5c4] bg-white px-6 py-12 text-center">
        <CheckCircle
          className={`mx-auto ${isConfirmed ? 'text-[#a77d49]' : 'text-[#8a7b6e]'}`}
          size={46}
          strokeWidth={1.5}
        />

        <h1 className="mt-6 font-serif text-4xl">{isConfirmed ? '결제 완료' : '결제 확인'}</h1>

        <p className="mt-5 text-sm leading-7 text-[#6f6258]">
          {isLoading ? '잠시만 기다려주세요.' : message}
        </p>

        <Link
          to="/"
          className="mt-9 inline-flex h-[52px] items-center justify-center bg-[#a77d49] px-8 text-sm font-semibold text-white transition hover:bg-[#916c3e]"
        >
          메인으로 이동
        </Link>
      </section>
    </main>
  );
};

export default PaymentSuccessPage;
