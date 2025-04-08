import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import Cookies from "js-cookie";
import axios from "axios";
import CryptoJS from "crypto-js";

function Verify() {
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState("");
  const [success, setSuccess] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [loading, setLoading] = useState(false);
  const key = import.meta.env.VITE_ENC_KEY;
  const captchaKey = import.meta.env.VITE_CAPTCHA_KEY;
  let API_URL = `${import.meta.env.VITE_IP}/api/auth/verify-otp`;
if (Cookies.get('secret')) {
  API_URL = `${import.meta.env.VITE_IP}/api/auth/verify-otp-login`;
}

  // Handle OTP input and validate it
  const handleChange = (e) => {
    const input = e.target.value;
    if (/^\d{0,6}$/.test(input)) {
      setOtp(input);
      setErrors("");
    } else {
      setErrors("Only 6 digits are allowed.");
    }
  };

  // Handle reCAPTCHA verification
  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token);
    setErrors(""); // Clear any previous errors
  };

  // Handle OTP verification submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setErrors("Please enter a valid 6-digit OTP.");
      return;
    }
    if (!recaptchaToken) {
      setErrors("Please verify the reCAPTCHA.");
      return;
    }

    try {
      console.log(Cookies.get('email'));
      console.log(otp);
      console.log(recaptchaToken);
      setLoading(true);
      const response = await axios.post(API_URL, {
          email : Cookies.get('email'),
          otp,
          recaptchaToken,
      });

  console.log(response)
      if (response.status === 200) {
        setSuccess("Verified successfully.");
        const { role, token, id, email, mobile, name } = response.data;

                  // Encrypt and store each item separately
                  localStorage.setItem(
                    "role",
                    CryptoJS.AES.encrypt(role, key).toString()
                  );
                  localStorage.setItem(
                    "token",
                    CryptoJS.AES.encrypt(token, key).toString()
                  );
                  localStorage.setItem(
                    "id",
                    CryptoJS.AES.encrypt(id.toString(), key).toString()
                  );
                  localStorage.setItem(
                    "email",
                    CryptoJS.AES.encrypt(email, key).toString()
                  );
                  localStorage.setItem(
                    "mobile",
                    CryptoJS.AES.encrypt(mobile, key).toString()
                  );
                  localStorage.setItem(
                    "name",
                    CryptoJS.AES.encrypt(name, key).toString()
                  );

        window.location.href = "/";
      } else if (response.message == "reCAPTCHA verification failed") {
        setErrors(data.message || "Captcha Verification failed. Please try again.");
        setRecaptchaToken("");
      }
      else if (response.message == "Invalid or expired OTP") {
        setErrors(data.message || "OTP Verification failed. Please try again.");
        setRecaptchaToken("");
        setOtp("");
      }
    } catch (err)

    {
      console.log(err)
      setLoading(false);
      setErrors("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 p-4">
      <div className="text-center space-y-2">
        <img
          src="/gsa_logo.jpg"
          alt="Gandhinagar Sports Academy Logo"
          className="w-20 h-20 mx-auto rounded-full"
        />
        <h1 className="text-4xl font-bold text-white">Gandhinagar Sports Academy</h1>
      </div>
      <div className="w-full max-w-md mt-16 p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-800">Verify OTP</h2>
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* OTP Field */}
          <div className="relative">
            <label htmlFor="otp" className="block text-sm font-medium text-gray-500">
              Enter OTP
            </label>
            <input
              type="text"
              id="otp"
              name="otp"
              value={otp}
              onChange={handleChange}
              maxLength={6}
              className="w-full px-4 py-2 mt-1 bg-white border-b-2 border-gray-300 text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-0 text-center"
              placeholder="Enter 6-digit OTP"
            />
            {errors && <p className="text-sm text-red-500">{errors}</p>}
            {success && <p className="text-sm text-green-500">{success}</p>}
          </div>

          {/* reCAPTCHA */}
          <div>
            <ReCAPTCHA
              sitekey={captchaKey}
              onChange={handleRecaptchaChange}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
          <div className="flex justify-center text-sm text-gray-600 mt-4">
            <a href="/login" className="hover:underline">Back to Login</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Verify;
