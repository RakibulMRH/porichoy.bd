'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'; 
import Cookies from 'js-cookie';
import { api } from '../../../../utils/api';
import { uploadToCloudinary } from './../../upload/action';

interface Ad {
  adId: number;
  adName: string;
  location: string;
  status: string;
  video_length: number;
  image: string;
  fileName: string;
}

export default function EditAdPage() {
  const [ad, setAd] = useState<Ad | null>(null);
  const router = useRouter(); 
  const searchParams = useSearchParams();
  const [file, setFile] = useState<File | null>(null);
  const [adName, setAdName] = useState('');
  const [location, setLocation] = useState('All'); 
  const [uploadedMedia, setUploadedMedia] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const path = window.location.pathname;
    const adId = path.split('/').pop();
    
  useEffect(() => {
    const fetchAd = async () => {
      setLoading(true); // Set loading to true before fetching ad data
      if (adId) {
        const accessToken = Cookies.get('access_token');
        try {
          const response = await api.get(`/ads/${adId}`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          });

          if (response.status === 200) {
            const data = response.data;
            setAd(data);
            setAdName(data.adName);
            setLocation(data.location); 
            setUploadedMedia(data.fileName);
          } else {
            setMessage({ type: 'error', text: 'Failed to fetch ad data.' });
          }
        } catch (error) {
          console.error('Error:', error);
          setMessage({ type: 'error', text: 'Failed to fetch ad data. Please try again.' });
        }
      }
      setLoading(false); // Set loading to false after fetching ad data
    };

    fetchAd();
  }, [adId]);

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
  const selectedFile = e.target.files?.[0];
  if (selectedFile) {
    const fileURL = URL.createObjectURL(selectedFile);
    setFile(selectedFile);
    setUploadedMedia(fileURL); // Set uploadedMedia to the URL of the selected file
    if (selectedFile.type.includes('video')) {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src); 
      };
      video.src = fileURL;
    }
  }
};
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let fileName = uploadedMedia || '';
    if (file) {
      const formData = new FormData();
      formData.append('image', file);
      fileName = await uploadToCloudinary(formData);
    }

    const data = {
      adName,
      location,
      status: ad?.status || 'pending', 
      image: file && file.type.includes('image') ? 'yes' : 'no',
      fileName,
    };

    const accessToken = Cookies.get('access_token');
    try {
      const response = await api.put(`/ads/${adId}`, data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (response.status === 200) {
        setMessage({ type: 'success', text: 'Ad updated successfully!' });
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        setMessage({ type: 'error', text: 'Failed to update ad. Please try again.' });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage({ type: 'error', text: 'Failed to update ad. Please try again.' });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!ad) {
    return <div>No ad data found.</div>;
  }
 
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full rounded-lg shadow-lg bg-white p-6">
        {uploadedMedia && (
          <div className="mb-4">
            {ad.image === 'yes' ? (
              <img src={uploadedMedia} alt="Uploaded Media" className="w-full rounded-md shadow-md" />
            ) : (
              <video controls className="w-full rounded-md shadow-md">
                <source src={uploadedMedia} type={file?.type || ''} />
              </video>
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
            Update
          </button>
        </form>
      </div>
    </div>
  );
}