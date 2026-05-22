import MainLayout from '@/components/layout/MainLayout';
import Home from '@/pages/Home';
import { Route, Routes } from 'react-router';
import Stores from '@/pages/Stores';
import About from '@/pages/About';

const App = () => {
  return (
    <>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/stores" element={<Stores />} />
          <Route path="/about" element={<About />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
