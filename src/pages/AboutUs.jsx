import React from "react";
import Footer from "../Main/Footer";

const AboutUs = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Banner */}
      <div
        className="relative bg-cover bg-center"
        style={{
          backgroundImage: `url('/2.jpg')`,
          height: "30rem",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center">
          <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold text-center">
            About Us
          </h1>
          <nav className="text-sm md:text-md text-gray-300 mt-2">
            <a href="/" className="hover:underline">
              Home
            </a>{" "}
            &gt; <span>About Us</span>
          </nav>
        </div>
      </div>

      {/* About Section */}
      <div className="container mx-auto px-4 py-16 space-y-16">
        {/* About Gandhinagar Sports Academy */}
        <div className="flex flex-col md:flex-row items-center justify-center md:items-center md:space-x-8 mt-5">
          <img
            src="/gsa_logo.png"
            alt="Sports Academy"
            className="w-1/2 md:w-1/3 lg:w-1/4 rounded-lg mx-auto"
          />
          <div className="mt-8 md:mt-0 text-gray-800 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-4">
              About Gandhinagar Sports Academy
            </h2>
            <p className="text-md md:text-lg leading-relaxed">
              At Gandhinagar Sports Academy, we are dedicated to nurturing
              talent, promoting sportsmanship, and providing an exceptional
              environment for athletes to achieve their highest potential. With
              top-notch facilities and a team of expert coaches, we help
              athletes unlock their true potential and excel in their respective
              sports.
            </p>
            <p className="text-md md:text-lg leading-relaxed mt-4">
              Our academy is more than just a training center—it's a community
              of passionate athletes and mentors working together to inspire
              excellence, build confidence, and create lasting memories. We
              believe that sports have the power to shape lives, build
              character, and foster teamwork.
            </p>
          </div>
        </div>

        {/* Key Statistics */}
        <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white py-12 px-4 rounded-lg shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Key Statistics
          </h2>
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-4xl md:text-5xl font-bold">500+</h3>
              <p className="text-md md:text-lg mt-2">Students</p>
            </div>
            <div>
              <h3 className="text-4xl md:text-5xl font-bold">15+</h3>
              <p className="text-md md:text-lg mt-2">Coaches</p>
            </div>
            <div>
              <h3 className="text-4xl md:text-5xl font-bold">100%</h3>
              <p className="text-md md:text-lg mt-2">Dedication</p>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-12 space-y-8 md:space-y-0">
          <img
            src="/about2.jpg"
            alt="Training Session"
            className="h-full md:h-80 md:w-1/2 lg:w-1/3 object-cover rounded-lg shadow-lg mx-auto md:mx-0"
          />
          <div className="mt-8 md:mt-0 text-gray-800 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-4">
              Why Choose Us?
            </h2>
            <p className="text-md md:text-lg leading-relaxed">
              At Gandhinagar Sports Academy, we offer a comprehensive sports
              education experience. Here's why athletes love us:
            </p>
            <ul className="list-disc list-inside mt-4 text-md md:text-lg space-y-2">
              <li>State-of-the-art facilities and training grounds.</li>
              <li>A team of highly experienced and dedicated coaches.</li>
              <li>Personalized training programs for all skill levels.</li>
              <li>Opportunities to participate in local and national tournaments.</li>
              <li>A supportive community that feels like family.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-20">
        <Footer />
      </div>
    </div>
  );
};

export default AboutUs;
