import React, { useState } from "react";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import CryptoJS from "crypto-js";
import Cookies from "js-cookie";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const navigate = useNavigate();
  const key = import.meta.env.VITE_ENC_KEY;
  const ip = import.meta.env.VITE_IP;
  const captcha_key = import.meta.env.VITE_CAPTCHA_KEY;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";
    if (!password) newErrors.password = "Password is required";
    if (!recaptchaToken)
      newErrors.recaptcha = "Please verify that you are not a robot";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setIsLoading(true); // Show loading animation on submit
      try {
        const response = await axios.post(`${ip}/api/auth/login`, {
          email,
          password,
          recaptchaToken,
        });
        console.log(response);
        if (response.status === 200) {
          // Encrypt the response data
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
          localStorage.setItem(
            "userid",
           response.data.id
          );

          setTimeout(() => {
            if (role === "Manager") {
              navigate("/manager"); // Redirect to manager dashboard
            }
            else{
            navigate("/"); // Redirect on successful login
            }
          }, 1500); // Simulated loading time
        }
      } catch (error)
      {
        console.log(error)
        if (error.response.data.message == "Account not verified. OTP has been sent to your email.") {
          setErrors({
            api: "Account Not Verified. Redirecting to Verify Page.",
          });
          const expiryDate = new Date(new Date().getTime() + 100 * 1000);
          Cookies.set("email", email, {
            path: "/",
            secure: false,
            sameSite: "strict",
            expires: expiryDate,
          });
          Cookies.set("secret",CryptoJS.AES.encrypt(import.meta.env.VITE_SECRET, key).toString(), {
            path: "/",
            secure: false,
            sameSite: "strict",
            expires: expiryDate,
          });
          setTimeout(() => {
            navigate("/verify"); // Redirect to verify page if account is not verified
          }, 1500);
        }
        else if (error.response.data.message == 'User not found'){
          setErrors({
            api: "User not found. Redirecting to SignUp",
          });

          setTimeout(() => {
            navigate("/signup"); // Redirect to verify page if account is not verified
          }, 1500);
        }

        else {
          setErrors({
            api: "Login failed. Please check your credentials or try again.",
          });
        }
      } finally {
        setIsLoading(false); // Hide loading animation after the request
      }
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
        <h1 className="text-4xl font-bold text-white">
          Gandhinagar Sports Academy
        </h1>
      </div>
      <div className="w-full max-w-md mt-16 p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          LOGIN
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label
              htmlFor="email"
              className="block text-xs font-medium text-gray-500"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full py-2 mt-1 bg-white border-b-2 border-gray-300 text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-0"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>
          <div className="relative">
            <label
              htmlFor="password"
              className="block text-xs font-medium text-gray-500"
            >
              Password
            </label>
            <div className="flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full py-2 mt-1 bg-white border-b-2 border-gray-300 text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-0"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 mt-2 text-gray-500"
              >
                {showPassword ? <BsEye /> : <BsEyeSlash />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Google reCAPTCHA */}
          <div className="mt-4">
            <ReCAPTCHA sitekey={captcha_key} onChange={handleRecaptchaChange} />
            {errors.recaptcha && (
              <p className="text-sm text-red-500">{errors.recaptcha}</p>
            )}
          </div>

          {/* Submit Button with Loading Animation */}
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            disabled={isLoading} // Disable the button while loading
          >
            {isLoading ? (
              <div className="flex justify-center items-center">
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 0116 0 8 8 0 01-16 0z"
                  ></path>
                </svg>
                Loading...
              </div>
            ) : (
              "Sign In"
            )}
          </button>

          {/* Error handling */}
          {errors.api && (
            <p className="text-sm text-red-500 text-center mt-4">
              {errors.api}
            </p>
          )}

          <div className="flex justify-between text-sm text-gray-600">
            <a href="/forgot" className="hover:underline">
              Forgot Password?
            </a>
            <a href="/signup" className="hover:underline">
              Sign Up
            </a>
          </div>
          <div className="text-center mt-4 text-xs text-gray-500">
            By signing in, you agree to our
            <a href="#" className="ml-1 underline text-blue-500">
              Terms & Conditions
            </a>{" "}
            and
            <a href="#" className="ml-1 underline text-blue-500">
              Privacy Policy
            </a>
            .
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
