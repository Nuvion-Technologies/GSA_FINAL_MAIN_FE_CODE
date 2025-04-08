import { useState, useEffect } from 'react';
import { FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa';

const SocialLinks = () => {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 200) {
        setHidden(true);
      } else {
        setHidden(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      className={`fixed right-0 top-1/2 transform -translate-y-1/2 flex flex-col items-center space-y-4 z-10 transition-transform duration-300 ease-in-out ${
        hidden ? 'translate-x-full' : 'translate-x-0'
      }`}
    >
      <div className="social-link bg-blue-600 hover:bg-blue-700 transition-colors duration-300 ease-in-out rounded-l-full p-3">
        <a href="#" className="text-white text-2xl">
          <FaFacebookF />
        </a>
      </div>
      <div className="social-link bg-pink-600 hover:bg-pink-700 transition-colors duration-300 ease-in-out rounded-l-full p-3">
        <a href="#" className="text-white text-2xl">
          <FaInstagram />
        </a>
      </div>
      <div className="social-link bg-green-600 hover:bg-green-700 transition-colors duration-300 ease-in-out rounded-l-full p-3">
        <a href="#" className="text-white text-2xl">
          <FaWhatsapp />
        </a>
      </div>
    </div>
  );
};

export default SocialLinks;
