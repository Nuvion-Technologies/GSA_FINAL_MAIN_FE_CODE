import React, { useState, useEffect } from "react";
import axios from "axios";
import Footer from "../Main/Footer";
import { MdOutlineSportsCricket, MdOutlineSportsSoccer } from "react-icons/md";
import { FaRegCalendarAlt } from "react-icons/fa";

const Ground = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedGround, setSelectedGround] = useState(null);
  const [selectedDayType, setSelectedDayType] = useState("");
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [plans, setPlans] = useState([]);
  const [price, setPrice] = useState(null);
  const ip = import.meta.env.VITE_IP;

  // Fetch active plans from API
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.post(`https://${ip}/api/ground/plans`);
        setPlans(response.data);
        console.log("Plans fetched:", response.data);
      } catch (error) {
        console.error("Error fetching plans:", error);
      }
    };
    fetchPlans();
  }, []);

  // Update price and time slots based on selections
  useEffect(() => {
    if (selectedGround && selectedDayType) {
      const filteredSlots = plans.filter(
        (plan) =>
          plan.category === selectedGround && plan.name === selectedDayType
      );
      setTimeSlots(filteredSlots);
      setPrice(null); // Reset price until time slot is selected
      setSelectedTimeSlot(null);
    } else {
      setTimeSlots([]);
      setPrice(null);
    }
  }, [selectedGround, selectedDayType, plans]);

  useEffect(() => {
    if (selectedTimeSlot) {
      setPrice(selectedTimeSlot.amount);
    } else {
      setPrice(null);
    }
  }, [selectedTimeSlot]);

  const handleGroundClick = (ground) => {
    setSelectedGround(ground);
  };

  const handleDayTypeClick = (dayType) => {
    setSelectedDayType(dayType);
  };

  const handleTimeSlotClick = (slot) => {
    setSelectedTimeSlot(slot);
  };

  const handleBooking = () => {
    alert("Booking successful! Thank you for choosing our service.");
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Banner */}
      <div
        className="relative bg-cover bg-center"
        style={{
          backgroundImage: `url('ground.jpg')`,
          height: "30rem",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col justify-center items-center text-center">
          <h1 className="text-white text-5xl md:text-6xl font-extrabold animate-fadeIn">
            Playground Booking
          </h1>
          <nav className="text-md text-gray-300 mt-4 animate-fadeIn">
            <a href="/" className="hover:underline">
              Home
            </a>{" "}
            &gt; <span>Playground Booking</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto py-16 px-4 md:px-8 flex flex-col items-center justify-center gap-2">
        {/* Description */}
        <div className="text-center my-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 animate-slideUp">
            Book Your Favorite Ground!
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto animate-slideUp">
            <span className="font-semibold text-blue-600">
              Get Ready for an Epic Game!
            </span>
            <br />
            Choose your favorite date, pick your ground, and select your
            playtime to unlock unbeatable pricing. Let’s make every moment on
            the field count and create unforgettable memories together!
          </p>
        </div>

        <div className="md:w-3/5 w-full rounded-md">
          <img src="/bg3.png" alt="" className="rounded-lg shadow-lg" />
        </div>
        {/* Available Sports */}
        <div className="flex items-center gap-4 mt-4">
          <div className="flex flex-col items-center">
            <MdOutlineSportsCricket className="text-4xl text-green-500" />
            <span className="text-sm font-medium">Cricket</span>
          </div>
          <div className="flex flex-col items-center">
            <MdOutlineSportsSoccer className="text-4xl text-green-500" />
            <span className="text-sm font-medium">Football</span>
          </div>
        </div>


        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 md:w-3/5 w-full">
          {/* Select Date Section */}
          <div className="w-full">
            <label className="block text-sm font-medium">Select Date</label>
            <div className="relative mt-1">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full h-16 border border-gray-300 rounded-md p-2"
              />
            </div>
          </div>

          {/* Ground Selection */}
          <div className="w-full">
            <label className="block text-sm font-medium">Select Ground</label>
            <div className="flex flex-row items-center justify-center gap-6 mt-1">
              {["GROUND-A", "GROUND-B"].map((ground, index) => (
                <button
                  key={index}
                  onClick={() => handleGroundClick(ground)}
                  className={`px-4 py-2 h-16 rounded-md font-medium w-full ${
                    selectedGround === ground
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200"
                  } transition-all duration-300`}
                >
                  {ground}
                </button>
              ))}
            </div>
          </div>

          {/* Day Type Selection */}
          <div className="w-full">
            <label className="block text-sm font-medium">Select Slot</label>
            <div className="flex justify-center gap-6 mb-8 w-full mt-1">
              {["Full-Day", "Half-Day"].map((dayType, index) => (
                <button
                  key={index}
                  onClick={() => handleDayTypeClick(dayType)}
                  className={`px-4 py-2 h-16 rounded-md font-medium w-full ${
                    selectedDayType === dayType
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200"
                  } transition-all duration-300`}
                >
                  {dayType}
                </button>
              ))}
            </div>
          </div>

          {/* Time Slot Selection */}
          <div className="w-full">
            <label className="block text-sm font-medium">
              Select Time Slot
            </label>
            {timeSlots.length > 0 ? (
              <div className="flex justify-center gap-6 mb-8 w-full mt-1">
                {timeSlots.map((slot) => (
                  <button
                    key={slot._id}
                    onClick={() => handleTimeSlotClick(slot)}
                    className={`px-4 py-2 h-16 rounded-md font-medium w-full ${
                      selectedTimeSlot === slot
                        ? "bg-blue-100 border-blue-500 shadow-md scale-105"
                        : "bg-white border-gray-300 hover:shadow-lg"
                    } transition-all duration-300`}
                  >
                    <p className="text-gray-500">
                      {slot.from} - {slot.to}
                    </p>
                    <p className="text-green-600 font-semibold">
                      ₹{slot.amount}
                    </p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 flex items-center justify-center h-16">
                {selectedGround && selectedDayType
                  ? "No time slots available for this selection."
                  : "Select ground and day type to view available time slots."}
              </div>
            )}
          </div>

            <div className="w-full">
  {/* Bill Section */}
  <div className="mt-6 bg-blue-50 p-6 rounded-lg shadow-md w-full">
    <div className="flex flex-col sm:flex-row justify-between items-center">
      <div className="text-lg font-semibold text-gray-700">
        <span>Your Bill</span>
      </div>
      <div className="text-sm text-gray-600 mt-2 sm:mt-0">
        {new Date().toLocaleDateString()}
      </div>
    </div>
    <div className="flex flex-row justify-between items-center mt-4">
    <div className="text-center mt-4">
      <p className="text-2xl sm:text-3xl font-extrabold text-blue-600">
        ₹ {price !== null ? price : "0"}
      </p>
    </div>
    {price && (
    <div className="text-center mt-8">
      <button
        onClick={handleBooking}
        className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold text-lg rounded-lg shadow-lg transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
      >
        Book Now
      </button>
    </div>
  )}
  </div>
  </div>
</div>
</div>
</div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Ground;
