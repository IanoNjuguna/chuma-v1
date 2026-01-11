
import React from 'react';

const Header = () => {
  return (
    <header className="w-full md:w-1/3 lg:w-1/4 bg-[#1A1A1A] flex items-center justify-center p-4 sm:p-6 md:p-8 md:min-h-screen border-b-2 md:border-b-0 md:border-r-2 border-red-800">
      <div className="flex flex-col items-center justify-center w-full">
        <img
          src="/CHUMA.png"
          alt="Chuma Logo"
          className="w-32 h-32 sm:w-40 sm:h-40 md:w-56 md:h-56 lg:w-64 lg:h-64 object-contain max-w-full max-h-60"
        />
      </div>
    </header>
  );
};

export default Header;
