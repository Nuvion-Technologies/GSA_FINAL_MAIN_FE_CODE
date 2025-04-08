import React, { useState, useEffect } from "react";
import Footer from "../Main/Footer";

// Slideshow Gallery Component
const GalleryComp = ({ title, images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change image every 3 seconds
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="my-16">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">{title}</h2>
      <div className="relative flex items-center flex-col">
        <div className="w-full md:w-5/6 h-[400px] md:h-[600px] overflow-hidden rounded-lg shadow-xl mb-4">
          <img
            src={images[currentIndex]}
            alt={`Preview ${currentIndex}`}
            className="w-full h-full object-cover transition-transform duration-300"
          />
        </div>
        <div className="flex flex-wrap justify-center space-x-2 mt-2">
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Thumbnail ${index}`}
              className={`w-20 h-20 object-cover cursor-pointer rounded-full transition-opacity duration-300 ${
                index === currentIndex ? "opacity-100" : "opacity-60"
              } md:w-26 md:h-26`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Main Gallery Page
const Gallery = () => {
  const photoGalleryImages = [
    "/gallery_1.jpg",
    "/gallery_2.jpg",
    "/gallery_3.jpg",
    "/gallery_4.jpg",
    "/gallery_5.jpg",
    "/gallery_6.jpg",
    "/gallery_7.jpg",
    "/gallery_8.jpg",
  ];

  const awardsGalleryImages = [
    "/gallery_1.jpg",
    "/gallery_2.jpg",
    "/gallery_3.jpg",
    "/gallery_4.jpg",
  ];

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Banner */}
      <div
        className="relative bg-cover bg-center"
        style={{
          backgroundImage: `url('/gallery_banner.png')`,
          height: "30rem",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center">
          <h1 className="text-white text-6xl font-bold">Gallery</h1>
          <nav className="text-md text-gray-300 mt-2">
            <a href="/" className="hover:underline">
              Home
            </a>{" "}
            &gt; <span>Gallery</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-16">
        <div className="container mx-auto px-4">
        <h2 className="text-3xl font-semibold text-center text-blue-900 my-3">
          Explore Our Moments
        </h2>
        <p className="text-gray-700 text-center max-w-2xl mx-auto mb-8">
          Discover the energy, teamwork, and passion of Gandhinagar Sports
          Academy through our curated gallery. Each photo captures a unique
          story of dedication and achievement.
        </p>
          {/* Photo Gallery */}
          <GalleryComp title="Photo Gallery" images={photoGalleryImages} />
          {/* Awards Gallery */}
          <GalleryComp title="Awards Gallery" images={awardsGalleryImages} />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-20">
        <Footer />
      </div>
    </div>
  );
};

export default Gallery;
