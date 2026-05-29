import aboutHero from '@/assets/images/about/about-hero.webp';
import aboutStore from '@/assets/images/about/about-store.webp';

const VALUES = [
  {
    title: '섬세한 상담',
    desc: '고객의 취향과 예산에 맞춰 가장 어울리는 주얼리를 제안합니다.',
    icon: '💬',
  },
  {
    title: '믿을 수 있는 품질',
    desc: '오래 착용할 수 있는 안정적인 품질의 제품을 선별합니다.',
    icon: '◇',
  },
  {
    title: '특별한 순간',
    desc: '선물, 기념일, 일상의 포인트까지 의미 있는 선택을 도와드립니다.',
    icon: '🎁',
  },
];

const About = () => {
  return (
    <section className="bg-background text-text-primary">
      <div
        className="relative flex min-h-115 items-center justify-center overflow-hidden md:min-h-140  bg-cover bg-center"
        style={{
          backgroundImage: `url(${aboutHero})`,
        }}
      >
        <div className="absolute inset-0 bg-white/25" />

        <div className="relative z-10 mx-auto max-w-4xl px-5 text-center">
          <p className="mb-5 text-xs tracking-[0.3em] text-accent md:text-sm md:tracking-[0.4em]">
            ABOUT RUBYSHONG
          </p>

          <h1 className="font-display text-5xl text-[#6f1721] sm:text-6xl md:text-8xl">
            RUBYSHONG
          </h1>

          <div className="mx-auto my-6 h-px w-16 bg-accent md:my-8 md:w-20" />

          <h2 className="text-xl font-light md:text-3xl">소중한 순간을 더 빛나게 하는 주얼리</h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-text-secondary md:mt-6 md:text-base md:leading-8">
            루비숑은 일상 속 특별한 순간을 오래도록 기억할 수 있도록 섬세한 디자인과 따뜻한 상담을
            전하는 주얼리 브랜드입니다.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
        <div className="grid gap-10 md:grid-cols-2 md:items-center md:gap-14">
          <div className="overflow-hidden border border-line">
            <img
              src={aboutStore}
              alt="루비숑 매장 이미지"
              className="h-85 w-full object-cover sm:h-105 md:h-130"
            />
          </div>

          <div>
            <p className="mb-5 text-xs tracking-[0.3em] text-accent md:mb-6 md:text-sm md:tracking-[0.35em]">
              BRAND STORY
            </p>

            <h2 className="font-display text-3xl leading-tight md:text-5xl">
              오래도록 간직할 수 있는
              <br />
              아름다움
            </h2>

            <div className="my-6 h-px w-20 bg-accent md:my-8 md:w-24" />

            <div className="space-y-4 text-sm leading-7 text-text-secondary md:space-y-5 md:text-base md:leading-8">
              <p>루비숑은 고객 한 분 한 분의 취향과 이야기를 소중하게 생각합니다.</p>

              <p>
                반지, 목걸이, 귀걸이 하나에도 착용하는 사람의 분위기와 순간이 담길 수 있도록
                정성스럽게 제안합니다.
              </p>

              <p>
                화려함만을 좇기보다, 시간이 지나도 자연스럽게 빛나는 주얼리를 소개하는 것이 루비숑이
                추구하는 방향입니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-surface/40 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mb-8 text-center md:mb-10">
            <p className="text-xs tracking-[0.3em] text-accent md:text-sm md:tracking-[0.35em]">
              OUR VALUE
            </p>
            <p className="mt-2 text-accent">✦</p>
          </div>

          <div className="grid gap-5 md:grid-cols-3 md:gap-6">
            {VALUES.map((value) => (
              <div
                key={value.title}
                className="border border-line bg-background/70 px-6 py-10 text-center transition hover:border-accent md:px-8 md:py-12"
              >
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-surface text-3xl text-accent md:mb-8 md:h-24 md:w-24 md:text-4xl">
                  {value.icon}
                </div>

                <h3 className="font-display text-2xl md:text-3xl">{value.title}</h3>

                <div className="mx-auto my-5 h-px w-10 bg-accent" />

                <p className="text-sm leading-7 text-text-secondary md:text-base">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
