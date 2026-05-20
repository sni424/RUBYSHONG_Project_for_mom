import heroImage from '@/assets/images/hero.png';

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-background pt-20 md:pt-24">
      <div className="mx-auto grid min-h-180 max-w-7xl grid-cols-1 items-center lg:grid-cols-2">
        <div className="z-10 px-6 py-16 md:px-10 lg:px-16">
          <p className="mb-4 text-sm tracking-[0.28em] text-text-muted">RUBYSHONG JEWELRY</p>

          <h2 className="font-display text-5xl leading-[1.1] text-text-primary md:text-7xl">
            Timeless
            <br />
            Elegance
          </h2>

          <p className="mt-8 max-w-md text-base leading-8 text-text-secondary">
            시간이 지나도 변하지 않는 아름다움,
            <br />
            당신의 가장 빛나는 순간을 위한 주얼리.
          </p>

          <button
            type="button"
            className="mt-10 border border-accent px-8 py-4 text-sm tracking-[0.18em] text-accent transition hover:bg-accent hover:text-white"
          >
            COLLECTION 보기 →
          </button>
        </div>

        <div className="relative h-125 w-full md:h-180">
          <img src={heroImage} alt="Rubyshong Jewelry" className="h-full w-full object-cover" />

          <div className="absolute inset-0 bg-linear-to-r from-background/70 via-transparent to-transparent lg:hidden" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
