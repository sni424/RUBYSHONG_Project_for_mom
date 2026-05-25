import HeroSection from '@/components/home/HeroSection';
import BrandStorySection from '@/components/home/BrandStorySection';
import CollectionSection from '@/components/home/CollectionSection';
import SignatureSection from '@/components/home/SignatureSection';
import { useEffect, useState } from 'react';
import { getProducts } from '@/api/productApi';

const Home = () => {
  const [product, setProducts] = useState();

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getProducts();
      setProducts(data);
    };

    fetchProducts();
    console.log(product);
  }, []);

  useEffect(() => {
    console.log(product);
  }, [product]);
  return (
    <>
      <HeroSection />
      <BrandStorySection />
      <CollectionSection />
      <SignatureSection />
    </>
  );
};

export default Home;
