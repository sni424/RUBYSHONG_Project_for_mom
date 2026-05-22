import storyImage from '@/assets/images/home/story.png';
import { Link } from 'react-router';

const BrandStorySection = () => {
  return (
    <section id="about" className="bg-background py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-5 md:px-10 lg:grid-cols-[58%_42%] lg:gap-16">
        <div className="overflow-hidden">
          <img
            src={storyImage}
            alt="Rubyshong Brand Story"
            className="
              h-full w-full
              object-cover
              transition duration-700
              hover:scale-105
            "
          />
        </div>

        <div>
          <p className="mb-5 text-sm tracking-[0.2em] text-text-muted">BRAND STORY</p>

          <h2 className="font-display text-4xl leading-[1.3] text-text-primary md:text-5xl">
            오랜 시간,
            <br />
            정성을 담아
          </h2>

          <p className="mt-8 text-base leading-8 text-text-secondary">
            어머니의 손끝에서 시작된 주얼리는
            <br />
            한 사람의 아름다운 순간을 오래도록 빛내기 위해 탄생합니다.
            <br />
            좋은 재료와 바른 마음, 변하지 않는 가치를 전합니다.
          </p>

          <Link
            to={'/about'}
            className="
              mt-10 flex items-center gap-3
              text-sm tracking-[0.12em]
              text-text-secondary
              transition
              hover:text-accent
              cursor-pointer
            "
          >
            더 알아보기
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BrandStorySection;
