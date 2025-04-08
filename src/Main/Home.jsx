import React, { useState, useEffect } from 'react';
import SocialLinks from './Links';
import { FaBullseye,FaLightbulb } from 'react-icons/fa';
import VideoCarousel from './VideoCarousel';
import Footer from './Footer';

const Home = () => {
  // Images and hashtags array
  const slides = [
    { image: '/banner1.jpg', hashtag: '#power' },
    { image: '/banner4.jpg', hashtag: '#girlspower' },
    { image: '/banner2.jpg', hashtag: '#strength' },
    { image: '/banner3.jpg', hashtag: '#girlsarmy' },
  ];
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    // Set an interval to change slides automatically
    const slideInterval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 4000); // Change slide every 3 seconds

    // Cleanup on component unmount
    return () => clearInterval(slideInterval);
  }, [slides.length]);


  const videos = [
    { src: "/vid1.mp4", alt: "Video 1" },
    { src: "/vid2.mp4", alt: "Video 2" },
    { src: "/vid3.mp4", alt: "Video 3" },
    { src: "/vid4.mp4", alt: "Video 4" },
    { src: "/vid5.mp4", alt: "Video 5" }
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  // Calculate the visible videos (left, center, right)
  const getVisibleVideos = () => {
    const leftIndex = (activeIndex - 1 + videos.length) % videos.length;
    const centerIndex = activeIndex;
    const rightIndex = (activeIndex + 1) % videos.length;
    return [leftIndex, centerIndex, rightIndex];
  };

  const [leftIndex, centerIndex, rightIndex] = getVisibleVideos();

  // Move to the next video automatically at a set interval
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % videos.length);
    }, 3000); // Adjust delay as needed (3000ms = 3 seconds)

    return () => clearInterval(interval); // Clean up on component unmount
  }, [videos.length]);

  // Manual navigation functions
  const nextVideo = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % videos.length);
  };

  const prevVideo = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + videos.length) % videos.length);
  };





  return (
    <>
      <SocialLinks />
    {/* MAIN CONTENT START */}
    <div className="relative w-full h-[90vh] overflow-hidden">
  {/* Slide images */}
  {slides.map((slide, index) => (
    <div
      key={index}
      className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
        index === currentSlide ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <img
        src={slide.image}
        alt={`Slide ${index + 1}`}
        className="object-cover w-full h-full"
      />
      
      {/* Responsive hashtag */}
      <div className="absolute bottom-4 left-4 text-white font-bold px-4 py-2 rounded-md">
        <span className="text-5xl md:text-5xl lg:text-8xl">{slide.hashtag}</span>
      </div>
    </div>
  ))}
</div>
    {/* MAIN CONTENT END */}
        


    {/* ABOUT US START */}
    <div className="relative py-16 px-6 md:px-12 lg:px-20 overflow-hidden my-5">
  {/* Background Image for Desktop with Custom Shape Cut */}
  <div
    className="hidden md:block absolute inset-y-0 right-0 w-1/2 bg-cover bg-center md:bg-right lg:bg-center"
    style={{
      backgroundImage: `url('/about1.jpg')`,
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 23% 100%)'
    }}
  ></div>

  {/* Background Image for Mobile (Full Width, No Clip-Path) */}
  <div
    className="md:hidden h-64 bg-cover bg-center rounded-lg"
    style={{
      backgroundImage: `url('/about1.jpg')`
    }}
  ></div>

  {/* Content Wrapper */}
  <div className="relative z-10 md:w-1/2 space-y-8 mt-8 md:mt-0">
    {/* "ABOUT US" Heading */}
    <div className="text-left">
      <span className="text-3xl md:text-4xl font-bold text-gray-800 tracking-wide inline-block relative">
        ABOUT US
        <div className="h-1 w-20 bg-blue-600 mt-2 rounded-full"></div>
      </span>
    </div>

    {/* About Us Text */}
    <div className="text-gray-700 space-y-6">
      <p className="text-base md:text-lg leading-relaxed">
        At Gandhinagar Sports Academy, we are dedicated to nurturing talent, promoting sportsmanship, and providing an exceptional environment for athletes to achieve their highest potential. Our academy is a hub of excellence, where passion meets performance, and dreams take shape.
      </p>
      <p className="text-base md:text-lg leading-relaxed">
        We believe in fostering a community that values hard work, integrity, and respect both on and off the field. Through structured training programs, state-of-the-art facilities, and experienced mentors, we empower athletes to push their limits and embrace the spirit of competition.
      </p>
      <button className="relative inline-block text-white font-semibold py-2 px-8 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full transition-all duration-500 shadow-md focus:outline-none overflow-hidden group" onClick={() => window.location.href = '/aboutus'}>
        <span className="absolute inset-0 bg-blue-800 group-hover:translate-x-0 transform -translate-x-full transition-transform duration-500 ease-in-out"></span>
        <span className="relative z-10 group-hover:text-blue-100">More</span>
      </button>
    </div>
  </div>
</div>
    {/* ABOUT US END */}




{/* VIDEOS SECTION START */}
      <VideoCarousel />
{/* VIDEOS SECTION END */}


{/* FOOTER STARTS */}
<Footer />
{/* FOOTER ENDS */}





    </>
  );
};

export default Home;