
import React from 'react';

const Header = () => {
  return (
    <header className="w-full md:w-1/3 lg:w-1/4 bg-[#1A1A1A] flex items-center justify-center p-8 md:min-h-screen border-b-2 md:border-b-0 md:border-r-2 border-red-800">
      <div className="flex items-center justify-center">
        <img src="/CHUMA.png" alt="Chuma Logo" className="w-48 h-48 md:w-64 md:h-64 object-contain" />
      </div>
    </header>
  );
};

export default Header;
