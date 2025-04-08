// import React, { useState } from 'react';
// import { BsEye, BsEyeSlash } from 'react-icons/bs';

// function SignUp() {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     gender: '',
//     dob: '',
//     password: '',
//     confirmPassword: '',
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [errors, setErrors] = useState({});

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   // Real-time validation on field change
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });

//     // Remove errors as soon as the user corrects them
//     setErrors((prevErrors) => {
//       const newErrors = { ...prevErrors };
//       if (name === 'email' && /\S+@\S+\.\S+/.test(value)) delete newErrors.email;
//       if (name === 'phone' && /^\d{10}$/.test(value)) delete newErrors.phone;
//       if (name === 'password' && validatePassword(value)) delete newErrors.password;
//       if (name === 'confirmPassword' && value === formData.password) delete newErrors.confirmPassword;
//       if (value) delete newErrors[name];
//       return newErrors;
//     });
//   };

//   // Validation for password policy
//   const validatePassword = (password) => {
//     return (
//       password.length >= 8 &&
//       /[A-Z]/.test(password) &&
//       /[a-z]/.test(password) &&
//       /[0-9]/.test(password) &&
//       /[^A-Za-z0-9]/.test(password)
//     );
//   };

//   const validate = () => {
//     const newErrors = {};
//     if (!formData.name) newErrors.name = 'Name is required';
//     if (!formData.email) newErrors.email = 'Email is required';
//     else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
//     if (!formData.phone) newErrors.phone = 'Phone number is required';
//     else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Phone number must be 10 digits';
//     if (!formData.gender) newErrors.gender = 'Gender is required';
//     if (!formData.dob) newErrors.dob = 'Date of Birth is required';

//     // Validate password policy
//     if (!formData.password) newErrors.password = 'Password is required';
//     else if (!validatePassword(formData.password)) {
//       newErrors.password = 'Password must be at least 8 characters, include uppercase, lowercase, number, and special character';
//     }
//     if (formData.password !== formData.confirmPassword)
//       newErrors.confirmPassword = 'Passwords do not match';

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (validate()) {
//       alert('Signed up successfully!');
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 p-4">
//       <div className="text-center space-y-2">
//         <img
//           src="/gsa_logo.jpg"
//           alt="Gandhinagar Sports Academy Logo"
//           className="w-20 h-20 mx-auto rounded-full"
//         />
//         <h1 className="text-4xl font-bold text-white">Gandhinagar Sports Academy</h1>
//       </div>
//       <div className="w-full max-w-3xl mt-8 p-8 space-y-6 bg-white rounded-xl shadow-lg">
//         <h2 className="text-2xl font-semibold text-center text-gray-800">SIGN UP</h2>
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//             <div className="relative">
//               <label htmlFor="name" className="block text-xs font-medium text-gray-500">Name</label>
//               <input
//                 type="text"
//                 id="name"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 className="w-full py-2 mt-1 bg-white border-b-2 border-gray-300 text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-0"
//                 placeholder="Enter your name"
//               />
//               {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
//             </div>
//             <div className="relative">
//               <label htmlFor="email" className="block text-xs font-medium text-gray-500">Email</label>
//               <input
//                 type="email"
//                 id="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className="w-full py-2 mt-1 bg-white border-b-2 border-gray-300 text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-0"
//                 placeholder="Enter your email"
//               />
//               {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
//             </div>
//             <div className="relative">
//               <label htmlFor="phone" className="block text-xs font-medium text-gray-500">Phone Number</label>
//               <input
//                 type="tel"
//                 id="phone"
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleChange}
//                 className="w-full py-2 mt-1 bg-white border-b-2 border-gray-300 text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-0"
//                 placeholder="Enter your phone number"
//               />
//               {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
//             </div>
//             <div className="relative">
//               <label htmlFor="gender" className="block text-xs font-medium text-gray-500">Gender</label>
//               <select
//                 id="gender"
//                 name="gender"
//                 value={formData.gender}
//                 onChange={handleChange}
//                 className="w-full py-2 mt-1 bg-white border-b-2 border-gray-300 text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-0"
//               >
//                 <option value="" className='text-gray-200'>Select Gender</option>
//                 <option value="Male">Male</option>
//                 <option value="Female">Female</option>
//                 <option value="Other">Other</option>
//               </select>
//               {errors.gender && <p className="text-sm text-red-500">{errors.gender}</p>}
//             </div>
//             <div className="relative">
//               <label htmlFor="dob" className="block text-xs font-medium text-gray-500">Date of Birth</label>
//               <input
//                 type="date"
//                 id="dob"
//                 name="dob"
//                 value={formData.dob}
//                 onChange={handleChange}
//                 className="w-full py-2 mt-1 bg-white border-b-2 border-gray-300 text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-0"
//               />
//               {errors.dob && <p className="text-sm text-red-500">{errors.dob}</p>}
//             </div>
//           </div>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//             <div className="relative">
//               <label htmlFor="password" className="block text-xs font-medium text-gray-500">Password</label>
//               <div className="flex items-center">
//                 <input
//                   type={showPassword ? 'text' : 'password'}
//                   id="password"
//                   name="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   className="w-full py-2 mt-1 bg-white border-b-2 border-gray-300 text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-0"
//                   placeholder="Enter your password"
//                 />
//                 <button
//                   type="button"
//                   onClick={togglePasswordVisibility}
//                   className="absolute right-3 mt-2 text-gray-500"
//                 >
//                   {showPassword ? <BsEye /> : <BsEyeSlash />}
//                 </button>
//               </div>
//               {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
//             </div>
//             <div className="relative">
//               <label htmlFor="confirmPassword" className="block text-xs font-medium text-gray-500">Confirm Password</label>
//               <input
//                 type={showPassword ? 'text' : 'password'}
//                 id="confirmPassword"
//                 name="confirmPassword"
//                 value={formData.confirmPassword}
//                 onChange={handleChange}
//                 className="w-full py-2 mt-1 bg-white border-b-2 border-gray-300 text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-0"
//                 placeholder="Confirm your password"
//               />
//               {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
//             </div>
//           </div>
//           <button
//             type="submit"
//             className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
//           >
//             Sign Up
//           </button>
//           <div className="text-center mt-4 text-xs text-gray-500">
//             By signing up, you agree to our
//             <a href="#" className="ml-1 underline text-blue-500">Terms & Conditions</a> and
//             <a href="#" className="ml-1 underline text-blue-500">Privacy Policy</a>.
//           </div>
//           <div className="text-center mt-4">
//   <a href="/login" className="text-blue-500 underline">Back to Login</a>
// </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default SignUp;






import React, { useState } from 'react';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import axios from 'axios';
import ReCAPTCHA from 'react-google-recaptcha';
import { useNavigate } from 'react-router-dom';

function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    dob: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const navigate = useNavigate();
  const ip = import.meta.env.VITE_IP;
  const recaptchaKey = import.meta.env.VITE_CAPTCHA_KEY;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      if (name === 'email' && /\S+@\S+\.\S+/.test(value)) delete newErrors.email;
      if (name === 'phone' && /^\d{10}$/.test(value)) delete newErrors.phone;
      if (name === 'password' && validatePassword(value)) delete newErrors.password;
      if (name === 'confirmPassword' && value === formData.password) delete newErrors.confirmPassword;
      if (value) delete newErrors[name];
      return newErrors;
    });
  };

  const validatePassword = (password) => {
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[^A-Za-z0-9]/.test(password)
    );
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Phone number must be 10 digits';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.dob) newErrors.dob = 'Date of Birth is required';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters, include uppercase, lowercase, number, and special character';
    }
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';

    if (!recaptchaToken) newErrors.recaptcha = 'Please verify that you are not a robot';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setIsLoading(true);
      try {
        const response = await axios.post(
          `${ip}/api/auth/signup`,
          {
            name: formData.name,
            mobile_no: formData.phone,
            email: formData.email,
            date_of_birth: formData.dob,
            gender: formData.gender,
            password: formData.password,
            recaptchaToken,
          }
        );
        document.cookie = `email=${formData.email}`;
        if (response.status === 201) {
          // Success response - Redirect to verify page
          setTimeout(() => {
            navigate('/verify');
          }, 1500); // Simulated loading time
        } else {
          setErrors({ api: 'Something went wrong. Please try again later.' });
        }
      } catch (error) {
        if (error.response.status === 400) {
          // User already exists
          setErrors({ api: 'User already exists! Redirecting to login...' });
          setTimeout(() => {
            navigate('/login');
          }, 2000); // Delay before redirecting
        } else {
          setErrors({ api: 'Error occurred. Please try again later.' });
        }
      } finally {
        setIsLoading(false);
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
        <h1 className="text-4xl font-bold text-white">Gandhinagar Sports Academy</h1>
      </div>
      <div className="w-full max-w-3xl mt-8 p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-800">SIGN UP</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="relative">
              <label htmlFor="name" className="block text-xs font-medium text-gray-500">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full py-2 mt-1 bg-white border-b-2 border-gray-300 text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-0"
                placeholder="Enter your name"
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>
            <div className="relative">
              <label htmlFor="email" className="block text-xs font-medium text-gray-500">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full py-2 mt-1 bg-white border-b-2 border-gray-300 text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-0"
                placeholder="Enter your email"
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>
            <div className="relative">
              <label htmlFor="phone" className="block text-xs font-medium text-gray-500">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full py-2 mt-1 bg-white border-b-2 border-gray-300 text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-0"
                placeholder="Enter your phone number"
              />
              {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
            </div>
            <div className="relative">
              <label htmlFor="gender" className="block text-xs font-medium text-gray-500">Gender</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full py-2 mt-1 bg-white border-b-2 border-gray-300 text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-0"
              >
                <option value="" className='text-gray-200'>Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && <p className="text-sm text-red-500">{errors.gender}</p>}
            </div>
            <div className="relative">
              <label htmlFor="dob" className="block text-xs font-medium text-gray-500">Date of Birth</label>
              <input
                type="date"
                id="dob"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="w-full py-2 mt-1 bg-white border-b-2 border-gray-300 text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-0"
              />
              {errors.dob && <p className="text-sm text-red-500">{errors.dob}</p>}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="relative">
              <label htmlFor="password" className="block text-xs font-medium text-gray-500">Password</label>
              <div className="flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
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
              {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
            </div>
            <div className="relative">
              <label htmlFor="confirmPassword" className="block text-xs font-medium text-gray-500">Confirm Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full py-2 mt-1 bg-white border-b-2 border-gray-300 text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-0"
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
            </div>
          </div>
          <div className="my-4">
            <ReCAPTCHA
              sitekey={recaptchaKey}
              onChange={handleRecaptchaChange}
            />
            {errors.recaptcha && <p className="text-sm text-red-500">{errors.recaptcha}</p>}
          </div>
          {errors.api && <p className="text-sm text-red-500">{errors.api}</p>}
          <button
            type="submit"
            className={`w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Signing Up...' : 'Sign Up'}
          </button>
          <div className="text-center mt-4 text-xs text-gray-500">
            By signing up, you agree to our
            <a href="#" className="ml-1 underline text-blue-500">Terms & Conditions</a> and
            <a href="#" className="ml-1 underline text-blue-500">Privacy Policy</a>.
          </div>
          <div className="text-center mt-4">
            <a href="/login" className="text-blue-500 underline">Back to Login</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
