import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const navItems = [
    { name: 'Home', link: '/home' },
    { name: 'Product', link: '/product' },
    { name: 'Customize', link: '/customize' },
    { name: 'Contact Us', link: '/contact' }
  ];

  const location = useLocation();
  const [activeItem, setActiveItem] = useState(location.pathname);

  useEffect(() => {
    setActiveItem(location.pathname);
  }, [location.pathname]);

  return (
    <header className="w-full border-b border-gray-200 px-4 py-3 bg-pink-50 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="text-3xl font-bold text-pink-500">
          CustomFlowerChain
        </div>

        <nav className="hidden md:flex space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.link}
              className={`text-xl transition-colors uppercase text-sm tracking-wider ${activeItem === item.link
                ? 'font-bold text-pink-500 border-b-2 border-pink-500'
                : 'hover:text-pink-500'
                }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-6">
          <button className="text-gray-600 hover:text-pink-500 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <Link to="/cart" className="text-gray-600 hover:text-pink-500 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </Link>
          <Link to="/userprofile" className="text-gray-600 hover:text-pink-500 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </Link>
        </div>
      </div>

      <div className="md:hidden flex justify-between items-center py-2">
        <div className="text-2xl font-bold text-pink-500">
          CustomFlowerChain
        </div>
        <button className="text-gray-600 hover:text-pink-500">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;

