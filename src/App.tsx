import MainLayout from '@/components/layout/MainLayout';
import Home from '@/pages/Home';
import { Route, Routes } from 'react-router';
import Stores from '@/pages/Stores';

const App = () => {
  return (
    <>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/stores" element={<Stores />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
