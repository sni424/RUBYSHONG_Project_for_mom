import { collections } from '@/constants/collections';

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
};

const CollectionCard = ({ title, subtitle, image }: CollectionCardProps) => {
  return (
    <article className="group relative overflow-hidden bg-[#efe8df] cursor-pointer">
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

        <button
          type="button"
          className="
            mt-5 text-xs tracking-[0.18em]
            text-white
            transition
            hover:opacity-70
          "
        >
          VIEW MORE →
        </button>
      </div>
    </article>
  );
};
