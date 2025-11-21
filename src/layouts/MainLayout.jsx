import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import Footer from '../components/layout/Footer';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 overflow-x-hidden">
      <Navbar />

      <div className="flex flex-1 overflow-hidden pt-14 sm:pt-16">
        <Sidebar />

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 pb-16 sm:p-6 sm:pb-20 md:p-6 lg:p-8 lg:ml-64">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default MainLayout;
