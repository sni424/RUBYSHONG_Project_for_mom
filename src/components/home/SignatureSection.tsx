import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { FiPlus } from 'react-icons/fi';

import 'swiper/css';
import 'swiper/css/navigation';

import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

import { signatureProducts } from '@/constants/signatureProducts';

const SignatureSection = () => {
  return (
    <section className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <h2 className="mb-10 text-center font-display text-sm tracking-[0.18em] text-text-primary">
          SIGNATURE PRODUCT
        </h2>

        <div className="relative">
          <button className="signature-prev absolute left-0 top-1/2 z-10 hidden -translate-x-10 -translate-y-1/2 text-text-primary transition hover:text-accent lg:block">
            <FiChevronLeft size={34} strokeWidth={1} />
          </button>

          <Swiper
            modules={[Navigation]}
            navigation={{
              prevEl: '.signature-prev',
              nextEl: '.signature-next',
            }}
            spaceBetween={20}
            slidesPerView={2}
            breakpoints={{
              768: {
                slidesPerView: 3,
              },
              1024: {
                slidesPerView: 4,
              },
            }}
            className=""
          >
            {signatureProducts.map((product) => (
              <SwiperSlide key={product.id}>
                <SignatureCard {...product} />
              </SwiperSlide>
            ))}
          </Swiper>

          <button className="signature-next absolute right-0 top-1/2 z-10 hidden translate-x-10 -translate-y-1/2 text-text-primary transition hover:text-accent lg:block">
            <FiChevronRight size={34} strokeWidth={1} />
          </button>
        </div>
      </div>
    </section>
  );
};

type SignatureCardProps = {
  name: string;
  material: string;
  image: string;
};

const SignatureCard = ({ name, material, image }: SignatureCardProps) => {
  return (
    <article className="relative bg-surface  hover:-translate-y-1">
      <img src={image} alt={name} className="h-55 w-full object-cover md:h-65" />

      <div className="relative px-5 pb-5 pt-4">
        <h3 className="font-display text-sm text-text-primary">{name}</h3>
        <p className="mt-2 text-xs text-text-secondary">{material}</p>

        <button
          type="button"
          className="absolute bottom-5 right-5 flex h-6 w-6 items-center justify-center rounded-full border border-line text-text-muted transition hover:border-accent hover:text-accent"
        >
          <FiPlus size={14} />
        </button>
      </div>
    </article>
  );
};

export default SignatureSection;
