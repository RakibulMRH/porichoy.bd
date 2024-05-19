'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '../../../../utils/api';
import Cookies from 'js-cookie';
import { uploadToCloudinary } from './action';

export default function UpdatePage() {
  const [imageUrl, setImageUrl] = useState('');
  const router = useRouter();
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fileName, setFileName] = useState('');


  useEffect(() => {
    const user = sessionStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      setImageUrl(parsedUser.profilePicture);
      setFirstName(parsedUser.firstName);
      setLastName(parsedUser.lastName);
    }
  }, []);

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setProfilePicture(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = {
      firstName,
      lastName,
      profilePicture: profilePicture?.name || undefined,
    };

    // Get the user id from the session
    const user = sessionStorage.getItem('user');
    if (user) {
      try {
        const accessToken = Cookies.get('access_token');
        const parsedUser = JSON.parse(user);
        const id = parsedUser.id;

        // Upload the profile picture and get the new filename
        //const newFilename = await uploadToCloudinary(new FormData(e.currentTarget));
        const newFilename = fileName
        // Update the data object with the new filename
        data.profilePicture = newFilename;

        // Append the user id to the URL
        const response = await api.post(`/profile/update/${id}`, data, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        if (response.status === 201) {
          // Update the user session with the response
          const updatedUser = response.data;
          sessionStorage.removeItem('user');
          sessionStorage.setItem('user', JSON.stringify(updatedUser));
        }

        // Handle successful response
        router.push('/dashboard');
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.files && e.currentTarget.files.length > 0) {
      const file = e.currentTarget.files[0];
      const formData = new FormData();
      formData.append('image', file); // Ensure 'image' field is set in formData
      console.log('Uploading the following file:', file);

      const url = await uploadToCloudinary(formData);
      setFileName(url);
      console.log('Cloudinary URL:', url);

      setImageUrl(url);
      setProfilePicture(file);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full rounded-lg shadow-lg bg-white p-6">
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Profile Picture"
            className="mb-4 rounded-md shadow-md"
          />
        )}
        <form onSubmit={handleSubmit} className="bg-white rounded-md shadow-md p-6">
          <div className="mb-4">
            <label htmlFor="image" className="block text-gray-700 font-bold mb-2">
              Upload Image
            </label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageUpload}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="space-y-4">
            <label className="block">
              <span className="text-gray-700">First Name:</span>
              <input
                type="text"
                name="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </label>
            <label className="block">
              <span className="text-gray-700">Last Name:</span>
              <input
                type="text"
                name="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </label>
          </div>
          <br></br>
          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 shadow-md"
            >
              Update Profile
            </button>
            <Link
              href="/dashboard"
              className="text-blue-500 hover:text-blue-700 shadow-md px-4 py-2 rounded-md"
            >
              Go Back to Dashboard
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}