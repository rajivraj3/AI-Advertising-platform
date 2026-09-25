import { Outlet, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const AuthLayout = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="h-screen flex items-center justify-center"><div className="w-16 h-16 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div></div>;
  if (!user) return <Navigate to="/login" />;

  return (
    <div className="min-h-screen">
      <Navbar />
      <Sidebar />
      <main className="pl-64 pt-24 pr-6 pb-6 min-h-screen bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]">
        <Outlet />
      </main>
    </div>
  );
};

export const PublicLayout = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[var(--color-primary)] opacity-20 blur-[100px] z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[var(--color-secondary)] opacity-20 blur-[100px] z-0"></div>
      
      <Navbar />
      <div className="relative z-10 pt-20">
        <Outlet />
      </div>
    </div>
  );
};
