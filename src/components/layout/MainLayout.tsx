import React from 'react';
import SignInButton from '../auth/SignInButton';
import Footer from './Footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="h-14 flex items-center justify-between w-full px-4 bg-white">
        <div className="flex items-center">
        </div>
        <div>
          <SignInButton />
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout; 