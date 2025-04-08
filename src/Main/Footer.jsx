import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-900 py-8 px-4 sm:px-8 md:px-12 lg:px-20">
      {/* Footer Top Section */}
      <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
        {/* Links Section */}
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-10 text-center md:text-left">
          <a href="#about" className="hover:text-blue-500 transition-colors">About Us</a>
          <a href="#services" className="hover:text-blue-500 transition-colors">Academy</a>
          <a href="#contact" className="hover:text-blue-500 transition-colors">Playground Booking</a>
          <a href="#faq" className="hover:text-blue-500 transition-colors">Contact Us</a>
        </div>

        {/* Social Media Links */}
        <div className="flex justify-center space-x-6">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            <i className="fab fa-facebook-f"></i>
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-blue-400 transition-colors"
          >
            <i className="fab fa-twitter"></i>
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-pink-500 transition-colors"
          >
            <i className="fab fa-instagram"></i>
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-blue-700 transition-colors"
          >
            <i className="fab fa-linkedin"></i>
          </a>
        </div>
      </div>

      {/* Divider */}
      <div className="my-6 border-t border-gray-300"></div>

      {/* Map Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-6 md:space-y-0">
        {/* Address Section */}
        <div>
          <h4 className="text-lg font-semibold text-gray-700">Our Location</h4>
          <p className="text-sm mt-2 text-gray-500">
            Parinam Circle, Sector 8, Gandhinagar, Gujarat, India
          </p>
          <p className="text-sm mt-1 text-gray-500">
            Phone: <a href="tel:+919824870000" className="text-blue-500">+91 98248 70000</a>
          </p>
        </div>

        {/* Embedded Map */}
        <div className="w-full md:w-1/2 lg:w-1/3">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2130.6684730513057!2d72.65459278071714!3d23.207337277791908!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395c2b6ab992d373%3A0xc9c5fa26655cd42e!2sGSA%20Box%20Cricket!5e1!3m2!1sen!2sin!4v1725007025312!5m2!1sen!2sin"
            width="100%"
            height="200"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>

      {/* Footer Bottom Section */}
      <div className="mt-8 text-center text-sm text-gray-700">
        © 2024 Gandhinagar Sports Academy. All rights reserved.
      </div>
      <div className="mt-3 text-center text-sm text-gray-500">
        Developed by <span className="text-blue-500">Nuvion Technologies</span>
      </div>
    </footer>
  );
};

export default Footer;
