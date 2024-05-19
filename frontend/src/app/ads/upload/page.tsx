'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '../../../utils/api';
import Cookies from 'js-cookie';
import { uploadToCloudinary, getVideoDuration } from './action';

export default function UploadAdePage() {
  const [imageUrl, setImageUrl] = useState('');
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [adName, setAdName] = useState('');
  const [location, setLocation] = useState('All');
  const [clientId, setClientId] = useState(0);
  const [tenantId, setTenantId] = useState(0);
  const [fileDuration, setFileDuration] = useState(0);
  const [uploadedMedia, setUploadedMedia] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [adDur, setAdDur] = useState(0);

  useEffect(() => {
    const user = sessionStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      setImageUrl(parsedUser.fileName);
      setAdName(parsedUser.adName);
      setAdDur(parsedUser.video_length);
      setClientId(parsedUser.id);
      setTenantId(parsedUser.tenantId); 
    }
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFile(file);
      setUploadedMedia(URL.createObjectURL(file));

       
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let fileName = '';  
    if (file) {
      const formData = new FormData();
      formData.append('image', file);
      fileName = await uploadToCloudinary(formData); 
      
    }

    const data = {
      adName,
      clientId,
      tenantId,
      location,
      status: 'pending',
      video_length: fileDuration,
      image: file && file.type.includes('image') ? 'yes' : 'no',
      fileName,
    };

    const accessToken = Cookies.get('access_token');
    try {
      const response = await api.post(`/ads`, data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (response.status === 201) {
        setMessage({ type: 'success', text: 'Ad uploaded successfully!' });
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage({ type: 'error', text: 'Failed to upload ad. Please try again.' });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full rounded-lg shadow-lg bg-white p-6">
        {uploadedMedia && (
          <div className="mb-4">
            {file && file.type.includes('video') ? (
            <video controls className="w-full rounded-md shadow-md">
              <source src={uploadedMedia} type={file.type} />
            </video>
          ) : (
            <img src={uploadedMedia} alt="Uploaded Media" className="w-full rounded-md shadow-md" />
          )}
          </div>
        )}
        {message && (
          <div
            className={`mb-4 p-4 rounded-md shadow-md ${
              message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {message.text}
          </div>
        )}
        <form onSubmit={handleSubmit} className="bg-white rounded-md shadow-md p-6">
          <div className="mb-4">
            <label htmlFor="adName" className="block text-gray-700 font-bold mb-2">
              Ad Name
            </label>
            <input
              type="text"
              id="adName"
              name="adName"
              value={adName}
              onChange={(e) => setAdName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="location" className="block text-gray-700 font-bold mb-2">
              Location
            </label>
            <select
              id="location"
              name="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="All">All</option>
              <option value="Gulshan">Gulshan</option>
              <option value="Banani">Banani</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="file" className="block text-gray-700 font-bold mb-2">
              Upload File
            </label>
            <input
              type="file"
              id="file"
              name="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 shadow-md"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}