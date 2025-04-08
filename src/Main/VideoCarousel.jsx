// import React from 'react';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { EffectCoverflow, Pagination, Navigation } from 'swiper/modules';
// import 'swiper/css';
// import 'swiper/css/effect-coverflow';
// import 'swiper/css/pagination';
// import 'swiper/css/navigation';
// import './vc.css';

// const VideoCarousel = () => {
//   return (


//     <div className="container mx-auto px-4">
      
//       <Swiper
        
//         effect="coverflow" // Enables the Coverflow effect
//         grabCursor={true} // Enables interactive cursor
//         centeredSlides={true} // Centers the active slide
//         loop={true} // Enables infinite scrolling
//         slidesPerView="auto" // Adjusts slides based on container width
        
//         coverflowEffect={{
//           rotate: 50, // No rotation of slides
//           stretch: -10, // No stretch between slides
//           depth:100, // Adds depth perspective
//           modifier: 1, // Adjusts intensity
//           slideShadows : true // Enables shadows
//         }}
      
//         navigation={true} // Enables navigation arrows
//         modules={[EffectCoverflow, Pagination, Navigation]}
//         className="swiper_container"
      
//       >


//         <SwiperSlide>
//           <video
//             src="/vid1.mp4"
//             muted
//             loop
//             autoPlay
//             playsInline
//             className="w-full h-96 object-cover rounded-lg shadow-lg"
//           />
//         </SwiperSlide>
//         <SwiperSlide>
//           <video
//             src="/vid2.mp4"
//             muted
//             loop
//             autoPlay
//             playsInline
//             className="w-full h-96 object-cover rounded-lg shadow-lg"
//           />
//         </SwiperSlide>
//         <SwiperSlide>
//           <video
//             src="/vid3.mp4"
//             muted
//             loop
//             autoPlay
//             playsInline
//             className="w-full h-96 object-cover rounded-lg shadow-lg"
//           />
//         </SwiperSlide>
//         <SwiperSlide>
//           <video
//             src="/vid4.mp4"
//             muted
//             loop
//             autoPlay
//             playsInline
//             className="w-full h-96 object-cover rounded-lg shadow-lg"
//           />
//         </SwiperSlide>
//         <SwiperSlide>
//           <video
//             src="/vid5.mp4"
//             muted
//             loop
//             autoPlay
//             playsInline
//             className="w-full h-96 object-cover rounded-lg shadow-lg"
//           />
//         </SwiperSlide>
//       </Swiper>
//     </div>


//   );
// };

// export default VideoCarousel;





import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './vc.css';

const VideoCarousel = () => {
  return (
    <div className="py-16 px-6 md:px-12 lg:px-20 bg-gray-50">
      {/* Heading Section */}
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 tracking-wide">
          Activities at Our Academy
        </h2>
        <p className="text-gray-600 mt-2">Watch our young athletes in action!</p>
        <div className="h-1 w-24 bg-blue-600 mx-auto mt-4 rounded-full"></div>
      </div>

      {/* Swiper Container */}
      <div className="relative flex justify-center items-center">
        <div className="container mx-auto px-4">
          <Swiper
            effect="coverflow"
            grabCursor={true}
            centeredSlides={true}
            loop={true}
            slidesPerView="auto"
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            coverflowEffect={{
              rotate: 50,
              stretch: -10,
              depth: 100,
              modifier: 1,
              slideShadows: false,
            }}
            navigation={true}
            modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
            className="swiper_container"
          >
            {/* Video Slides */}
            <SwiperSlide className="swiper-slide">
              <video
                src="/vid1.mp4"
                muted
                loop
                autoPlay
                playsInline
                className="w-full h-64 sm:h-80 md:h-96 lg:h-[400px] object-cover rounded-lg shadow-lg"
              />
            </SwiperSlide>
            <SwiperSlide className="swiper-slide">
              <video
                src="/vid2.mp4"
                muted
                loop
                autoPlay
                playsInline
                className="w-full h-64 sm:h-80 md:h-96 lg:h-[400px] object-cover rounded-lg shadow-lg"
              />
            </SwiperSlide>
            <SwiperSlide className="swiper-slide">
              <video
                src="/vid3.mp4"
                muted
                loop
                autoPlay
                playsInline
                className="w-full h-64 sm:h-80 md:h-96 lg:h-[400px] object-cover rounded-lg shadow-lg"
              />
            </SwiperSlide>
            <SwiperSlide className="swiper-slide">
              <video
                src="/vid4.mp4"
                muted
                loop
                autoPlay
                playsInline
                className="w-full h-64 sm:h-80 md:h-96 lg:h-[400px] object-cover rounded-lg shadow-lg"
              />
            </SwiperSlide>
            <SwiperSlide className="swiper-slide">
              <video
                src="/vid5.mp4"
                muted
                loop
                autoPlay
                playsInline
                className="w-full h-64 sm:h-80 md:h-96 lg:h-[400px] object-cover rounded-lg shadow-lg"
              />
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default VideoCarousel;







// WORKING 3rd CODE
// import React from 'react';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { EffectCoverflow, Pagination, Navigation, Autoplay } from 'swiper/modules'; // Added Autoplay
// import 'swiper/css';
// import 'swiper/css/effect-coverflow';
// import 'swiper/css/pagination';
// import 'swiper/css/navigation';
// import './vc.css';

// const VideoCarousel = () => {
//   return (
//     <div className="py-16 px-6 md:px-12 lg:px-20 bg-gray-50">

//       <div className="text-center mb-12">
//         <h2 className="text-5xl font-bold text-gray-800 tracking-wide">
//           Activities at Our Academy
//         </h2>
//         <p className="text-gray-600 mt-2">Watch our young athletes in action!</p>
//         <div className="h-1 w-24 bg-blue-600 mx-auto mt-4 rounded-full"></div>
//       </div>
//     <div className="relative flex justify-center items-center">
//     <div className="container mx-auto px-4">
//       <Swiper
//         effect="coverflow" // Enables the Coverflow effect
//         grabCursor={true} // Enables interactive cursor
//         centeredSlides={true} // Centers the active slide
//         loop={true} // Enables infinite scrolling
//         slidesPerView="auto" // Adjusts slides based on container width
//         autoplay={{
//           delay: 3000, // Delay between slides (3 seconds)
//           disableOnInteraction: false, // Keeps autoplay active after user interaction
//         }}
//         coverflowEffect={{
//           rotate: 50, // Rotation angle of the slides
//           stretch: -10, // Spacing between slides
//           depth: 100, // Adds depth perspective
//           modifier: 1, // Adjusts intensity
//           slideShadows: false, // Disable Swiper's built-in shadows
//         }}
//         navigation={true} // Enables navigation arrows
//         modules={[EffectCoverflow, Pagination, Navigation, Autoplay]} // Added Autoplay module
//         className="swiper_container"
//       >
//         {/* Video Slides */}
//         <SwiperSlide className="swiper-slide">
//           <video
//             src="/vid1.mp4"
//             muted
//             loop
//             autoPlay
//             playsInline
//             className="w-full h-96 object-cover rounded-lg shadow-lg"
//           />
//         </SwiperSlide>
//         <SwiperSlide className="swiper-slide">
//           <video
//             src="/vid2.mp4"
//             muted
//             loop
//             autoPlay
//             playsInline
//             className="w-full h-96 object-cover rounded-lg shadow-lg"
//           />
//         </SwiperSlide>
//         <SwiperSlide className="swiper-slide">
//           <video
//             src="/vid3.mp4"
//             muted
//             loop
//             autoPlay
//             playsInline
//             className="w-full h-96 object-cover rounded-lg shadow-lg"
//           />
//         </SwiperSlide>
//         <SwiperSlide className="swiper-slide">
//           <video
//             src="/vid4.mp4"
//             muted
//             loop
//             autoPlay
//             playsInline
//             className="w-full h-96 object-cover rounded-lg shadow-lg"
//           />
//         </SwiperSlide>
//         <SwiperSlide className="swiper-slide">
//           <video
//             src="/vid5.mp4"
//             muted
//             loop
//             autoPlay
//             playsInline
//             className="w-full h-96 object-cover rounded-lg shadow-lg"
//           />
//         </SwiperSlide>
//       </Swiper>
//     </div>
//     </div>
//     </div>
//   );
// };

// export default VideoCarousel;
