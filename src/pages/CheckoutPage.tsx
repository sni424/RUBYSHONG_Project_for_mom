import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '@/stores/authStore';
import { loadTossPayments } from '@tosspayments/tosspayments-sdk';
import { createOrder } from '@/api/order';
import { useCheckoutStore } from '@/stores/checkoutStore';

const CheckoutPage = () => {
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);

  //바로결제 store
  const items = useCheckoutStore((state) => state.items);
  const totalAmount = useCheckoutStore((state) => state.totalAmount);

  const [formData, setFormData] = useState({
    name: user?.name ?? '',
    phone: user?.phone ?? '',
  });

  const orderName = useMemo(() => {
    if (items.length === 0) return '';

    if (items.length === 1) {
      return items[0].name;
    }

    return `${items[0].name} 외 ${items.length - 1}건`;
  }, [items]);

  const handlePayment = async () => {
    if (items.length === 0) {
      alert('결제할 상품이 없습니다.');
      navigate('/cart');
      return;
    }

    if (!formData.name || !formData.phone) {
      alert('주문자 정보를 입력해주세요.');
      return;
    }

    try {
      // 주문 생성 API 요청
      const order = await createOrder({
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        ordererName: formData.name,
        ordererPhone: formData.phone,
        userId: user?.id,
      });

      // 토스 클라이언트 키 확인
      const tossClientKey = import.meta.env.VITE_TOSS_CLIENT_KEY;

      if (!tossClientKey) {
        alert('토스페이먼츠 설정이 없습니다.');
        return;
      }

      // 토스페이먼츠 SDK 로드
      const tossPayments = await loadTossPayments(tossClientKey);

      // 고객 고유키 생성
      const customerKey = user ? `USER_${user.id}` : `GUEST_${crypto.randomUUID()}`;

      // 결제창 객체 생성
      const payment = tossPayments.payment({
        customerKey,
      });

      // 토스 결제창 열기
      await payment.requestPayment({
        method: 'CARD',
        amount: {
          value: order.amount,
          currency: 'KRW',
        },
        orderId: order.orderCode,
        orderName: order.orderName,
        customerName: formData.name,
        customerMobilePhone: formData.phone,
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      });
    } catch (error) {
      console.error(error);
      alert('결제 요청에 실패했습니다.');
    }
  };

  return (
    <main className="min-h-screen bg-[#f8f3ed] px-5 py-12 text-[#2d2520] sm:px-8 sm:py-16">
      <section className="mx-auto max-w-280">
        <div className="text-center">
          <p className="text-xs tracking-[0.32em] text-[#b08a48]">CHECKOUT</p>
          <h1 className="mt-3 font-serif text-4xl sm:text-5xl">주문서</h1>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <section className="border border-[#e2d5c4] bg-white p-6">
              <h2 className="font-serif text-2xl">주문자 정보</h2>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold">이름</label>
                  <input
                    value={formData.name}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        name: event.target.value,
                      }))
                    }
                    className="h-13 w-full border border-[#e2d5c4] px-4 text-sm outline-none focus:border-[#b08a48]"
                    placeholder="이름을 입력해주세요"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">휴대폰 번호</label>
                  <input
                    value={formData.phone}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        phone: event.target.value,
                      }))
                    }
                    className="h-13 w-full border border-[#e2d5c4] px-4 text-sm outline-none focus:border-[#b08a48]"
                    placeholder="01000000000"
                  />
                </div>
              </div>
            </section>

            <section className="border border-[#e2d5c4] bg-white p-6">
              <h2 className="font-serif text-2xl">주문 상품</h2>

              <div className="mt-6 space-y-4">
                {items.map((item) => (
                  <div key={item.productId} className="flex gap-4">
                    <img
                      src={item.thumbnailUrl}
                      alt={item.name}
                      className="h-20 w-20 object-cover"
                    />

                    <div className="flex-1">
                      <p className="font-serif text-lg">{item.name}</p>
                      <p className="mt-1 text-sm text-[#8a7b6e]">수량 {item.quantity}개</p>
                    </div>

                    <p className="font-semibold">
                      {(item.price * item.quantity).toLocaleString()}원
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="h-fit border border-[#e2d5c4] bg-white p-6">
            <h2 className="font-serif text-2xl">결제 정보</h2>

            <div className="mt-6 space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-[#6f6258]">주문명</span>
                <span className="max-w-45 text-right">{orderName}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#6f6258]">상품 금액</span>
                <span>{totalAmount.toLocaleString()}원</span>
              </div>
            </div>

            <div className="mt-6 border-t border-[#e2d5c4] pt-5">
              <div className="flex justify-between font-semibold">
                <span>총 결제 금액</span>
                <span>{totalAmount.toLocaleString()}원</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handlePayment}
              className="mt-7 h-13 w-full bg-[#a77d49] cursor-pointer text-sm font-semibold text-white transition hover:bg-[#916c3e]"
            >
              결제하기
            </button>
          </aside>
        </div>
      </section>
    </main>
  );
};

export default CheckoutPage;
