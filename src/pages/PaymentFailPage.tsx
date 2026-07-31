import { XCircle } from 'lucide-react';
import { Link, useSearchParams } from 'react-router';

const PaymentFailPage = () => {
  const [searchParams] = useSearchParams();

  const message = searchParams.get('message') ?? '결제가 취소되었거나 실패했습니다.';

  return (
    <main className="min-h-screen bg-[#f8f3ed] px-5 py-16 text-[#2d2520]">
      <section className="mx-auto max-w-160 border border-[#e2d5c4] bg-white px-6 py-12 text-center">
        <XCircle className="mx-auto text-red-500" size={46} strokeWidth={1.5} />

        <h1 className="mt-6 font-serif text-4xl">결제 실패</h1>

        <p className="mt-5 text-sm leading-7 text-[#6f6258]">{message}</p>

        <Link
          to="/checkout"
          className="mt-9 inline-flex h-13 items-center justify-center bg-[#a77d49] px-8 text-sm font-semibold text-white transition hover:bg-[#916c3e]"
        >
          다시 결제하기
        </Link>
      </section>
    </main>
  );
};

export default PaymentFailPage;
