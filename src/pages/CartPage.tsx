import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useCartStore } from '@/stores/cartStore';

const CartPage = () => {
  const navigate = useNavigate();

  const items = useCartStore((state) => state.items);
  const totalAmount = useCartStore((state) => state.totalAmount);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const handleCheckout = () => {
    if (items.length === 0) {
      alert('장바구니에 상품이 없습니다.');
      return;
    }

    navigate('/checkout', {
      state: {
        source: 'cart',
      },
    });
  };

  return (
    <main className="min-h-screen bg-[#f8f3ed] px-5 py-12 text-[#2d2520] sm:px-8 sm:py-16">
      <section className="mx-auto max-w-280">
        <div className="text-center">
          <p className="text-xs tracking-[0.32em] text-[#b08a48]">SHOPPING BAG</p>
          <h1 className="mt-3 font-serif text-4xl sm:text-5xl">장바구니</h1>
        </div>

        {items.length === 0 ? (
          <div className="mt-12 border border-[#e2d5c4] bg-white px-6 py-16 text-center">
            <ShoppingBag className="mx-auto text-[#b08a48]" size={38} strokeWidth={1.5} />
            <p className="mt-5 text-sm text-[#6f6258]">장바구니에 담긴 상품이 없습니다.</p>

            <Link
              to="/collection"
              className="mt-8 inline-flex h-12 items-center justify-center border border-[#b08a48] px-8 text-sm font-semibold text-[#9f7938] transition hover:bg-[#f8f3ed]"
            >
              COLLECTION 보기
            </Link>
          </div>
        ) : (
          <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_340px]">
            <div className="space-y-4">
              {items.map((item) => (
                <article
                  key={item.productId}
                  className="grid grid-cols-[96px_1fr] gap-4 border border-[#e2d5c4] bg-white p-4 sm:grid-cols-[128px_1fr_auto]"
                >
                  <img
                    src={item.thumbnailUrl}
                    alt={item.name}
                    className="h-24 w-24 object-cover sm:h-32 sm:w-32"
                  />

                  <div className="min-w-0">
                    <h2 className="font-serif text-xl">{item.name}</h2>
                    <p className="mt-2 text-sm text-[#8a7b6e]">{item.price.toLocaleString()}원</p>

                    <div className="mt-5 inline-flex h-10 items-center border border-[#e2d5c4]">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="flex h-full w-10 items-center justify-center transition hover:bg-[#f8f3ed] disabled:cursor-not-allowed disabled:opacity-35"
                        aria-label="수량 감소"
                      >
                        <Minus size={15} />
                      </button>

                      <span className="flex h-full w-12 items-center justify-center text-sm">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className="flex h-full w-10 items-center justify-center transition hover:bg-[#f8f3ed] disabled:cursor-not-allowed disabled:opacity-35"
                        aria-label="수량 증가"
                      >
                        <Plus size={15} />
                      </button>
                    </div>
                    <p className="mt-2 text-xs text-[#8a7b6e]">재고 {item.stock}개</p>
                  </div>

                  <div className="col-span-2 flex items-center justify-between border-t border-[#eee4d8] pt-4 sm:col-span-1 sm:block sm:border-t-0 sm:pt-0 sm:text-right">
                    <p className="font-semibold">
                      {(item.price * item.quantity).toLocaleString()}원
                    </p>

                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      className="mt-0 inline-flex items-center gap-2 text-sm text-[#8a7b6e] transition hover:text-red-500 sm:mt-8"
                    >
                      <Trash2 size={15} />
                      삭제
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <aside className="h-fit border border-[#e2d5c4] bg-white p-6">
              <h2 className="font-serif text-2xl">주문 요약</h2>

              <div className="mt-6 space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#6f6258]">상품 금액</span>
                  <span>{totalAmount.toLocaleString()}원</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#6f6258]">배송비</span>
                  <span>상담 후 안내</span>
                </div>
              </div>

              <div className="mt-6 border-t border-[#e2d5c4] pt-5">
                <div className="flex justify-between font-semibold">
                  <span>결제 예정 금액</span>
                  <span>{totalAmount.toLocaleString()}원</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCheckout}
                className="mt-7 h-13 w-full bg-[#a77d49] cursor-pointer text-sm font-semibold text-white transition hover:bg-[#916c3e]"
              >
                결제하기
              </button>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
};

export default CartPage;
