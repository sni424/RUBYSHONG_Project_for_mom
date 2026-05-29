import { Calendar, Clock, Gem, MapPin, Phone, Store, UserRound, Gift } from 'lucide-react';

import StoresHero from '@/assets/images/stores/stores-hero.webp';
import StoresInside from '@/assets/images/stores/store-inside.webp';
import StoresRing from '@/assets/images/stores/store-ring.webp';
import StoreMap from '@/components/common/StoreMap';

const storeInfo = [
  {
    icon: Store,
    label: '매장명',
    values: ['RUBYSHONG 김포공항 국제선점'],
  },
  {
    icon: MapPin,
    label: '주소',
    values: ['서울특별시 강서구 하늘길 38'],
  },
  {
    icon: Clock,
    label: '운영시간',
    values: ['정상영업 10:30 - 20:00', '연장영업 10:30 - 20:30'],
  },
  {
    icon: Phone,
    label: '연락처',
    values: ['02-1234-5678'],
  },
  {
    icon: MapPin,
    label: '오시는 길',
    values: ['롯데백화점 김포공항점 1층'],
  },
];

const features = [
  {
    icon: UserRound,
    title: '1:1 전문 상담',
    text: '전문 컨설턴트의 맞춤 상담',
  },
  {
    icon: Gem,
    title: '다양한 제품 경험',
    text: '실제 제품을 직접 착용해보세요',
  },
  {
    icon: Gift,
    title: '프라이빗 공간',
    text: '편안하고 프라이빗한 상담 공간',
  },
  {
    icon: Calendar,
    title: '예약 우선제',
    text: '원활한 상담을 위한 예약제 운영',
  },
];

const Stores = () => {
  return (
    <main className="bg-background text-text-primary">
      {/* Hero */}
      <section
        className="relative h-130 overflow-hidden md:h-150   bg-cover bg-center"
        style={{
          backgroundImage: `url(${StoresHero})`,
        }}
      >
        <div className="absolute inset-0 bg-linear-to-r from-background via-background/75 to-transparent" />

        <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-5 md:px-10">
          <div className="max-w-md">
            <h1 className="font-display text-5xl tracking-wide md:text-6xl">STORE</h1>

            <p className="mt-8 leading-8 text-text-secondary">
              루비숑의 오프라인 스토어에서
              <br />
              실제 제품을 경험하고
              <br />
              전문 컨설턴트의 1:1 상담을 받아보세요.
            </p>

            <a
              href="/reservation"
              className="mt-8 inline-flex h-12 items-center justify-center border border-accent px-8 text-sm tracking-wide transition hover:bg-accent hover:text-white"
            >
              방문 예약하기
              <span className="ml-3">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* Our Store */}
      <section className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-28">
        <div className="text-center">
          <p className="font-display text-sm tracking-[0.2em] text-text-secondary">OUR STORE</p>
          <h2 className="mt-4 font-display text-3xl md:text-4xl">김포공항 롯데백화점</h2>
          <p className="mt-5 text-sm leading-7 text-text-secondary">
            김포공항 롯데백화점 내에서 루비숑을 만나보세요.
          </p>
        </div>

        {/* Map */}
        <div className="overflow-hidden rounded-xl border border-line">
          <StoreMap />
        </div>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <a
            href="https://map.kakao.com/link/to/RUBYSHONG,37.563483,126.803168"
            target="_blank"
            rel="noreferrer"
            className="flex h-12 items-center justify-center rounded-md border border-[#B08B57] bg-[#B08B57] px-6 text-sm tracking-wide text-white transition hover:opacity-90"
          >
            카카오맵 길찾기
          </a>

          <a
            href="https://map.naver.com/v5/search/서울특별시 강서구 하늘길 38"
            target="_blank"
            rel="noreferrer"
            className="flex h-12 items-center justify-center rounded-md border border-[#D8C8B0] bg-transparent px-6 text-sm tracking-wide text-[#6B5B4D] transition hover:bg-[#F7F1E8]"
          >
            네이버지도 보기
          </a>
        </div>

        {/* Info + Image */}

        <div className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.4fr]">
          <div className="rounded-xl border border-line bg-white/40 p-6 md:p-8">
            <div className="space-y-6">
              {storeInfo.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className="grid grid-cols-[24px_80px_1fr] items-start gap-3 text-sm"
                  >
                    <Icon size={20} className="text-accent" />

                    <span className="pt-[1px] font-medium">{item.label}</span>

                    <div className="leading-7 text-text-secondary">
                      {item.values.map((text) => (
                        <span key={text} className="block">
                          {text}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="overflow-hidden rounded-xl">
            <img
              src={StoresInside}
              alt="RUBYSHONG store"
              className="h-full min-h-70 w-full object-cover"
            />
          </div>
        </div>

        {/* Features */}
        <div className="mt-10 grid rounded-xl border border-line bg-white/40 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className={`p-6 text-center md:p-8 ${
                  index !== features.length - 1 ? 'lg:border-r lg:border-line' : ''
                } ${index < 2 ? 'md:border-b md:border-line lg:border-b-0' : ''}`}
              >
                <Icon className="mx-auto text-accent" size={34} />
                <h3 className="mt-4 font-medium">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-text-secondary">{feature.text}</p>
              </div>
            );
          })}
        </div>

        {/* Reservation Banner */}
        <div className="mt-10 overflow-hidden rounded-xl bg-surface">
          <div className="grid items-center gap-6 md:grid-cols-[1fr_0.8fr]">
            <div className="px-6 py-10 text-center md:px-12 md:text-left">
              <p className="text-sm leading-7 text-text-secondary">
                방문 전 예약하시면 더욱 편안한 상담을 받으실 수 있습니다.
              </p>

              <a
                href="/reservation"
                className="mt-6 inline-flex h-12 items-center justify-center border border-accent px-10 text-sm transition hover:bg-accent hover:text-white"
              >
                방문 예약하기
                <span className="ml-3">→</span>
              </a>
            </div>

            <img
              src={StoresRing}
              alt="Rubyshong jewelry"
              className="h-48 w-full object-cover md:h-full"
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default Stores;
