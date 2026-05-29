import heroImage from '@/assets/images/home/hero.webp';

const HeroSection = () => {
  return (
    <section
      className="
    relative overflow-hidden
    h-155
    md:h-190
    lg:h-205
    max-h-225
    bg-cover bg-center
    pt-20 md:pt-24
  "
      style={{
        backgroundImage: `url(${heroImage})`,
      }}
    >
      <div className="absolute inset-0 bg-linear-to-r from-background/95 via-background/65 to-transparent" />

      <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-6 md:px-10">
        <div className="max-w-xl">
          <p className="mb-4 text-sm tracking-[0.28em] text-text-muted">RUBYSHONG JEWELRY</p>

          <h2 className="font-display text-5xl leading-[1.05] text-text-primary md:text-7xl">
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
            className="
              mt-10 border border-accent
              px-8 py-4
              text-sm tracking-[0.18em]
              text-accent
              transition
              hover:bg-accent hover:text-white
              cursor-pointer
            "
          >
            COLLECTION 보기 →
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
