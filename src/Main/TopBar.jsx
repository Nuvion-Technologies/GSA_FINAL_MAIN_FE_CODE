import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IoPersonCircleSharp, IoLogInOutline, IoMenu, IoClose } from 'react-icons/io5';
import CryptoJS from 'crypto-js';

const TopBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const key = import.meta.env.VITE_ENC_KEY;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    // Check for token and role
    const token = localStorage.getItem('token');
    if (token) {
      const decryptedRole = CryptoJS.AES.decrypt(localStorage.getItem('role'), key).toString(CryptoJS.enc.Utf8);
      if (decryptedRole === 'User') {
        const decryptedName = CryptoJS.AES.decrypt(localStorage.getItem('name'), key).toString(CryptoJS.enc.Utf8);
        setIsLoggedIn(true);
        setUserName(decryptedName);
      }
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [key]);

  const handleLogin = () => {
    if (!isLoggedIn) {
      window.location.href = '/login';
    }
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white shadow-lg text-black py-2'
          : 'bg-gradient-to-b from-[#0004] to-transparent text-white py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Logo and Heading */}
        <div className="flex items-center space-x-4 mr-auto cursor-pointer" onClick={() => window.location.href = '/'}>
          <img src="/gsa_logo.jpg" alt="Logo" className="h-16 w-16 rounded-full" />
          <span className="text-lg font-semibold">Gandhinagar Sports Academy</span>
        </div>

        {/* Navbar Options for Desktop */}
        <div className="hidden md:flex items-center space-x-6">
          {['About Us', 'Gallery', 'Academy', 'Playground', 'Contact Us'].map((text) => (
            <Link
              key={text}
              to={`/${text.toLowerCase().replace(' ', '')}`}
              className="px-4 py-2 rounded-md transition-colors font-medium duration-200 hover:bg-white hover:text-black"
            >
              {text}
            </Link>
          ))}
          {/* Login Button / User Name */}
          <button
            onClick={handleLogin}
            className="px-4 py-2 rounded-md transition-colors duration-200 font-medium hover:bg-blue-600 hover:text-white"
          >
            {isLoggedIn ? (
              <div className="flex items-center space-x-2">
                <IoPersonCircleSharp className="w-5 h-5" />
                <span>{userName}</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <IoLogInOutline className="w-5 h-5" />
                <span>Login</span>
              </div>
            )}
          </button>
        </div>

        {/* Hamburger Menu Icon for Mobile */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setIsMenuOpen(true)}>
            <IoMenu className="w-8 h-8" />
          </button>
        </div>
      </div>

      {/* Animated Mobile Menu */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={() => setIsMenuOpen(false)}
      >
        <div
          className={`fixed top-0 right-0 w-3/4 max-w-sm bg-white h-full shadow-lg p-6 flex flex-col transform transition-transform duration-300 ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()} // Prevent closing menu on inner div click
        >
          <button className="self-end mb-6" onClick={() => setIsMenuOpen(false)}>
            <IoClose className="w-8 h-8 text-black" />
          </button>
          <nav className="flex flex-col space-y-6">
            {['About Us', 'Gallery', 'Academy', 'Playground', 'Contact Us'].map((text) => (
              <Link
                key={text}
                to={`/${text.toLowerCase().replace(' ', '-')}`}
                className="block text-black px-4 py-2 text-lg rounded-md transition-colors duration-200 font-medium hover:bg-gray-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {text}
              </Link>
            ))}
            <button
              onClick={() => {
                handleLogin();
                setIsMenuOpen(false);
              }}
              className="px-4 py-2 text-lg text-black rounded-md transition-colors duration-200 font-medium flex items-center space-x-2 hover:bg-blue-600 hover:text-white"
            >
              {isLoggedIn ? (
                <>
                  <IoPersonCircleSharp className="w-6 h-6" />
                  <span>{userName}</span>
                </>
              ) : (
                <>
                  <IoLogInOutline className="w-6 h-6" />
                  <span>Login</span>
                </>
              )}
            </button>
          </nav>
        </div>
      </div>
    </nav>
  );
};

export default TopBar;
