import React, { useState } from 'react';
import { BsEye, BsEyeSlash } from 'react-icons/bs';

function ResetPass() {
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validate = () => {
    const newErrors = {};
    const passwordPolicy = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!formData.newPassword) newErrors.newPassword = 'New password is required';
    else if (!passwordPolicy.test(formData.newPassword)) {
      newErrors.newPassword =
        'Password must be at least 8 characters long, include an uppercase letter, a number, and a special character';
    }
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      alert('Password reset successfully!');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
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
        <h2 className="text-2xl font-semibold text-center text-gray-800">Reset Password</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label htmlFor="newPassword" className="block text-xs font-medium text-gray-500">
              New Password
            </label>
            <div className="flex items-center">
              <input
                type={showPassword ? 'text' : 'password'}
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full py-2 mt-1 bg-white border-b-2 border-gray-300 text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-0"
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 mt-2 text-gray-500"
              >
                {showPassword ? <BsEye /> : <BsEyeSlash />}
              </button>
            </div>
            {errors.newPassword && <p className="text-sm text-red-500">{errors.newPassword}</p>}
          </div>
          <div className="relative">
            <label htmlFor="confirmPassword" className="block text-xs font-medium text-gray-500">
              Confirm Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full py-2 mt-1 bg-white border-b-2 border-gray-300 text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-0"
              placeholder="Confirm your new password"
            />
            {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Reset Password
          </button>
          <div className="flex justify-center text-sm text-gray-600 mt-4">
            <a href="/login" className="hover:underline">Back to Login</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResetPass;
