'use client';
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faCheck, faTimes, faBan, faSearch, faEye  } from '@fortawesome/free-solid-svg-icons';
import { api } from '../../utils/api';

interface Ad {
  adId: number;
  adName: string;
  status: string;
  location: string;
  image: string;
  fileName: string;
}

interface AdsPageProps {}

const AdsPage: React.FC<AdsPageProps> = () => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [userRole, setUserRole] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredAds, setFilteredAds] = useState<Ad[]>([]);
  const [location, setLocation] = useState<string>('All');
  const router = useRouter();

  useEffect(() => {
    const user = sessionStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      setUserRole(parsedUser.role);
    }

    const fetchAds = async () => {
      const accessToken = Cookies.get('access_token');
      const response = await api.get(`/ads/view`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = response.data;
      setAds(data);
      setFilteredAds(data);
    };

    fetchAds();
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = ads.filter((ad) =>
      ad.adName.toLowerCase().includes(query)
    );
    setFilteredAds(filtered);
  };

  const handleUpdate = (adId: number) => {
    router.push(`/ads/update/${adId}`);
  };

  const handleDelete = async (adId: number) => {
    const accessToken = Cookies.get('access_token');
    const response = await api.delete(`/ads/${adId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status === 200) {
      setAds(ads.filter((ad) => ad.adId !== adId));
      setFilteredAds(filteredAds.filter((ad) => ad.adId !== adId));
    } else {
      console.error('Failed to delete ad');
    }
  };

  const handleApproveReject = async (
    adId: number,
    status: 'approved' | 'rejected' | 'pending'
  ) => {
    const accessToken = Cookies.get('access_token');
    const response = await fetch(`http://localhost:3001/ads/${adId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    if (response.ok) {
      const updatedAds = ads.map((ad) => {
        if (ad.adId === adId) {
          return { ...ad, status };
        }
        return ad;
      });
      setAds(updatedAds);
      setFilteredAds(updatedAds.filter((ad) => ad.adName.toLowerCase().includes(searchQuery)));
    } else {
      console.error('Failed to update ad status');
    }
    
  };
const handleGoLive = () => {
  const url = `/ads/view/${location}`;
  window.open(url, '_blank');
};

  const renderAds = () => {
    if (!Array.isArray(filteredAds) || filteredAds.length === 0) {
      return <div>No ads found.</div>;
    }
    return filteredAds.map((ad) => (
      <div key={ad.adId} className="bg-white rounded-lg shadow-md p-4 max-w-sm mx-auto">
        <h3 className="text-lg font-semibold mb-2">{ad.adName}</h3>
        <p className="text-gray-600 text-sm mb-2">Status: {ad.status}</p>
        <p className="text-gray-600 text-sm mb-4">Location: {ad.location}</p>
        {ad.image === 'yes' ? (
          <Image
            src={`${ad.fileName}`}
            alt={ad.adName}
            width={300}
            height={200}
            className="mb-4"
          />
        ) : (
          <video controls onClick={(e) => e.currentTarget.play()} className="w-full mb-4">
            <source src={`${ad.fileName}`} type="video/mp4" />
          </video>
        )}
        <div className="flex justify-center">
          {userRole === 'admin' && (
            <>
              {ad.status === 'pending' && (
                <>
                  <FontAwesomeIcon
                    icon={faCheck}
                    className="text-green-500 hover:text-green-700 cursor-pointer mr-4"
                    onClick={() => handleApproveReject(ad.adId, 'approved')}
                  />
                  <FontAwesomeIcon
                    icon={faTimes}
                    className="text-red-500 hover:text-red-700 cursor-pointer mr-4"
                    onClick={() => handleApproveReject(ad.adId, 'rejected')}
                  />
                </>
              )}
              {ad.status === 'approved' && (
                <FontAwesomeIcon
                  icon={faBan}
                  className="text-orange-500 hover:text-orange-700 cursor-pointer mr-4"
                  onClick={() => handleApproveReject(ad.adId, 'pending')}
                />
              )}
            </>
          )}
          <FontAwesomeIcon
            icon={faEdit}
            className="text-blue-500 hover:text-blue-700 cursor-pointer mr-4"
            onClick={() => handleUpdate(ad.adId)}
          />
          <FontAwesomeIcon
            icon={faTrash}
            className="text-red-500 hover:text-red-700 cursor-pointer"
            onClick={() => handleDelete(ad.adId)}
          />
        </div>
      </div>
    ));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between">
        <div className="flex items-center">
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="border border-gray-300 rounded-md py-2 px-4 mr-4"
          >
            <option value="All">All</option>
            <option value="Gulshan">Gulshan</option>
            <option value="Banani">Banani</option>
          </select>
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center"
            onClick={handleGoLive}
          >
            <FontAwesomeIcon icon={faEye} className="mr-2" />
            See Live
          </button>
        </div>
        <div>
          <input
            type="text"
            placeholder="Search ads by name"
            className="border border-gray-300 rounded-md py-2 px-4"
            value={searchQuery}
            onChange={handleSearch}
          />
          <FontAwesomeIcon icon={faSearch} className="ml-2" />
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
          onClick={() => router.push('/ads/upload')}
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Add Ads
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {renderAds()}
      </div>
    </div>
  );
};

export default AdsPage;