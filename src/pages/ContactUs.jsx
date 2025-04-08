import React, { useState } from "react";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import Footer from "../Main/Footer";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const ip =import.meta.env.VITE_IP;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    let validationErrors = {};
    if (!formData.name) validationErrors.name = "Name is required.";
    if (!formData.email) validationErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      validationErrors.email = "Email is invalid.";
    if (!formData.mobile) validationErrors.mobile = "Mobile is required.";
    else if (!/^\d{10}$/.test(formData.mobile))
      validationErrors.mobile = "Mobile number must be 10 digits.";
    if (!formData.description)
      validationErrors.description = "Description is required.";
    if (!captchaVerified)
      validationErrors.captcha = "Please verify you are not a robot.";

    return validationErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      try {
        const apiEndpoint = `https://${ip}/api/dashboard/newquery`;
        const requestBody = {
          ...formData,
          recaptchaToken,
        };

        const response = await axios.post(apiEndpoint, requestBody);

        if (response.status === 200) {
          setFormSubmitted(true);
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        }
      } catch (error) {
        console.error("Error submitting the form:", error);
        setErrors({
          api: "There was an error submitting your form. Please try again later.",
        });
      }
    }
  };

  const handleCaptchaChange = (value) => {
    setCaptchaVerified(!!value);
    setRecaptchaToken(value);
    setErrors({ ...errors, captcha: "" });
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Banner */}
      <div
        className="relative bg-cover bg-center"
        style={{
          backgroundImage: `url('/gallery_5.jpg')`,
          height: "30rem",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center">
          <h1 className="text-white text-6xl font-bold">Contact Us</h1>
          <nav className="text-md text-gray-300 mt-2">
            <a href="/" className="hover:underline">
              Home
            </a>{" "}
            &gt; <span>Contact Us</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-4 md:p-8">
        <h2 className="text-3xl font-semibold text-center text-blue-900 my-8">
          We'd Love to Hear From You!
        </h2>
        <p className="text-gray-700 text-center max-w-2xl mx-auto mb-8">
          Whether you have questions about our sports programs, want to enroll
          in a course, or need assistance with anything else, feel free to
          reach out to us. We're here to help!
        </p>

        <div className="bg-white p-6 md:p-10 shadow-lg rounded-lg">
          {formSubmitted ? (
            <div className="text-center text-green-600 font-bold">
              Your form has been successfully submitted! Reloading page...
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full p-3 border ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  } rounded focus:outline-none focus:ring-2 focus:ring-blue-600`}
                  placeholder="Enter your name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full p-3 border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } rounded focus:outline-none focus:ring-2 focus:ring-blue-600`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Mobile */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Mobile
                </label>
                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className={`w-full p-3 border ${
                    errors.mobile ? "border-red-500" : "border-gray-300"
                  } rounded focus:outline-none focus:ring-2 focus:ring-blue-600`}
                  placeholder="Enter your mobile number"
                />
                {errors.mobile && (
                  <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className={`w-full p-3 border ${
                    errors.description ? "border-red-500" : "border-gray-300"
                  } rounded focus:outline-none focus:ring-2 focus:ring-blue-600`}
                  placeholder="Enter your message"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description}
                  </p>
                )}
              </div>

              {/* reCAPTCHA */}
              <div>
                <ReCAPTCHA
                  sitekey={import.meta.env.VITE_CAPTCHA_KEY}
                  onChange={handleCaptchaChange}
                />
                {errors.captcha && (
                  <p className="text-red-500 text-sm mt-1">{errors.captcha}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
              >
                Submit
              </button>
              {errors.api && (
                <p className="text-red-500 text-center mt-4">{errors.api}</p>
              )}
            </form>
          )}
        </div>
      </div>

      <div className="mt-20">
        <Footer />
      </div>
    </div>
  );
};

export default ContactUs;
