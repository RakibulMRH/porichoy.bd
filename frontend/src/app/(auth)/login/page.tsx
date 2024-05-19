'use client';
import Image from "next/image";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { api } from '../../../utils/api';
import Link from 'next/link';  
import { useContext } from "react";

export default function LoginPage() {
  const router = useRouter(); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { email, password });
  
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);
  
      if (response.status === 201) {
        const data = response.data;
    const { access_token, user_id, email, firstName, lastName, role, profilePicture, tenantId } = data;

    Cookies.set('access_token', access_token);

    const userSession = {
      id: user_id,
      email,
      firstName,
      lastName,
      role,
      profilePicture,
      tenantId
    };
        sessionStorage.setItem('user', JSON.stringify(userSession));
  
        router.push('/dashboard');
      } else {
        const errorMessage = response.data?.message || 'Invalid email or password';
        setError(errorMessage);
      }
    } catch (error) {
      console.error(error);
      setError('An error occurred. Please try again.');
    }
  };

const handleForgotPassword = () => {
  setShowForgotPassword(true);
};

const handleBackToLogin = () => {
  setShowForgotPassword(false);
  setError('');
};

const handleForgotPasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  try {
    const response = await api.post('/auth/forgot-password', { email });
    console.log(response.data.message);
    // Redirect or show a success message
    router.push('/reset-password');
  } catch (error) {
    console.error(error);
    setError('Wrong OTP! Please try again.');
  }
};

return (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <Image
      className="w-full max-w-md"
      src="/login_logo.png"
      alt="Porichoy Logo"
      width={380}
      height={227}
      priority
      quality={100}
    />
    <div className="w-full max-w-md">
      {!showForgotPassword ? (
        <form onSubmit={handleLogin} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
          Email
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 font-bold mb-2" htmlFor="password">
          Password
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          id="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Sign In
            </button>
            <Link href="/register">
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
              >
                Register
              </button>
            </Link>
          </div>
          <div className="mt-4 text-center">
            <button
              className="text-blue-500 hover:text-blue-700 font-semibold"
              onClick={handleForgotPassword}
            >
              Forgot Password?
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleForgotPasswordSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Send Reset Link
            </button>
            <button
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={handleBackToLogin}
            >
              Back
            </button>
          </div>
        </form>
      )}
    </div>
  </div>
);
}