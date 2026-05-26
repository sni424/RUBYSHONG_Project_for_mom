import ringImage from '@/assets/images/home/ring.png';
import necklaceImage from '@/assets/images/home/necklace.png';
import earringImage from '@/assets/images/home/earring.png';
import braceletImage from '@/assets/images/home/bracelet.png';
import { Link } from 'react-router';

const collections = [
  {
    title: 'Ring',
    subtitle: '섬세한 반짝임',
    image: ringImage,
    category: 'ring',
  },
  {
    title: 'Necklace',
    subtitle: '우아한 실루엣',
    image: necklaceImage,
    category: 'necklace',
  },
  {
    title: 'Earring',
    subtitle: '빛나는 포인트',
    image: earringImage,
    category: 'earring',
  },
  {
    title: 'Bracelet',
    subtitle: '손끝의 아름다움',
    image: braceletImage,
    category: 'bracelet',
  },
];

const CollectionSection = () => {
  return (
    <section id="collection" className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="mb-14 text-center">
          <p className="text-sm tracking-[0.24em] text-text-muted">COLLECTION</p>

          <h2 className="mt-4 font-display text-4xl text-text-primary md:text-5xl">
            Timeless Jewelry
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {collections.map((item) => (
            <CollectionCard
              key={item.title}
              title={item.title}
              subtitle={item.subtitle}
              image={item.image}
              category={item.category}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CollectionSection;

type CollectionCardProps = {
  title: string;
  subtitle: string;
  image: string;
  category: string;
};

const CollectionCard = ({ title, subtitle, image, category }: CollectionCardProps) => {
  return (
    <Link
      to={`/collection?category=${category}`}
      className="group relative block overflow-hidden bg-[#efe8df] cursor-pointer"
    >
      <div className="overflow-hidden">
        <img
          src={image}
          alt={title}
          className="
            h-70 w-full
            object-cover
            transition duration-700
            group-hover:scale-105
            md:h-105
          "
        />
      </div>

      <div
        className="
          absolute inset-0
          bg-black/0
          transition duration-500
          group-hover:bg-black/10
        "
      />

      <div className="absolute bottom-0 left-0 w-full p-6 text-center md:p-8">
        <h3 className="font-display text-2xl tracking-[0.08em] text-white">{title}</h3>

        <p className="mt-1 text-sm text-white/80">{subtitle}</p>

        <span
          className="
            mt-5 inline-block text-xs tracking-[0.18em]
            text-white
            transition
            group-hover:opacity-70
          "
        >
          VIEW MORE →
        </span>
      </div>
    </Link>
  );
};
