import React, { useState } from 'react';

function ForgotPass() {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      alert('Password recovery email sent!');
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
        <h2 className="text-2xl font-semibold text-center text-gray-800">Forgot Password</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label htmlFor="email" className="block text-xs font-medium text-gray-500">
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
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Send Recovery Email
          </button>
          <div className="flex justify-between text-sm text-gray-600">
            <a href="/login" className="hover:underline">Back to Login</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ForgotPass;
