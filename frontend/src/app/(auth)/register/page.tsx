'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../../utils/api';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [accountType, setAccountType] = useState('adExpert');

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/register', {
        firstName,
        lastName,
        email,
        password,
        type: accountType === 'adExpert' ? 'adExpert' : 'client',
        profilePicture: 'dp.png',
      });

      if (response.status === 201) {
        // Registration successful
        router.push('/login');
      } else {
        // Handle registration error
        setError('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error(error);
      setError('An error occurred. Please try again.');
    }
  };

 return (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <div className="w-full max-w-md">
      <form onSubmit={handleRegister} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="firstName">
            First Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="firstName"
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="lastName">
            Last Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="lastName"
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
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
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="accountType">
            Account Type
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="accountType"
            value={accountType}
            onChange={(e) => setAccountType(e.target.value)}
            required
          >
            <option value="adExpert">Ad Expert</option>
            <option value="client">Client</option>
          </select>
        </div>
        {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Register
          </button>
          <Link href="/login" className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
  Already have an account? Login
</Link> 
        </div>
      </form>
    </div>
  </div>
);
}