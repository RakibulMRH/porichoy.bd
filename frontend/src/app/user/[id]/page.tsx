'use client';
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faBars, faStar, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { api } from '../../../utils/api';
import Link from 'next/link';

const DashboardProfile = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUserSession] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);

  const logout = () => {
    const access_token = Cookies.get('access_token');
    const data = { "sessionToken": access_token };
    const response = api.post(`/auth/logout`, data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`,
      },
    });
    Cookies.remove('access_token');
    sessionStorage.removeItem('user');

    router.push('/login');
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userId = pathname.split('/')[2]; // Extract the id from the URL
      const token = Cookies.get('access_token'); // Get the token from the cookies
      const user = sessionStorage.getItem('user');
      if (user) {
        const parsedUser = JSON.parse(user);
        const id = parsedUser.id;
        try {
          const response = await api.get(`/dashboard/user/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the request headers
            },
          });

          setUserSession(response.data);
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchUserDetails();
  }, [pathname]);

  if (!user) {
    return <p>Wait/login again</p>;
  }

  if (!user) {
    return null; // or handle the null case as needed
  }

  const handleButtonClick = async (endpoint: string) => {
    try {
      const response = await api.get(`/dashboard/${endpoint}/${(user as any).id}`);
      // Handle the response data as needed
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const renderUserType = () => {
    const userType = (user as any).type;

    switch (userType) {
      case 'adExpert':
        return <p className="text-gray-600 mt-2 text-sm italic">AD Expert</p>;
      case 'client':
        return <p className="text-gray-600 mt-2 text-sm">Client</p>;
      case 'admin':
        return <p className="text-gray-600 mt-2 text-sm font-bold">Admin</p>;
      default:
        return <p className="text-gray-600 mt-2 text-sm">{userType}</p>;
    }
  };

  return (
    <div className="flex flex-grow">
      {/* Main Content */}
      <div className="flex-grow p-6">
        {/* User Details */}
        <div className="flex flex-col items-center">
          {(user as any).profilePicture && (
            <img
              src={(user as any).profilePicture}
              alt="Profile"
              className={`${isZoomed ? 'w-32 h-32' : 'w-24 h-24'} rounded-full transition-all duration-300 cursor-pointer`}
              onClick={() => setIsZoomed(!isZoomed)}
            />
          )}
          <div className="flex items-center mt-4">
            <h2 className="text-xl font-semibold mr-2">
              {(user as any).firstName} {(user as any).lastName}
            </h2>
            {(user as any).tenantId === null ? (
              <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs">Basic</span>
            ) : (
              <span className="relative bg-yellow-500 text-white px-2 py-1 rounded-full text-xs cursor-pointer" title="Pro">
                <FontAwesomeIcon icon={faStar} className="text-sm" />
              </span>
            )}
          </div>
          <p className="text-gray-600 mt-2 text-sm">{(user as any).email}</p>
          {renderUserType()}
          <div className="flex mt-4">
            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mr-2 text-sm" onClick={() => router.push('/profile/update')}>
              Edit
            </button>
            <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm" onClick={logout}>
              <FontAwesomeIcon icon={faSignOutAlt} />
            </button>
          </div>
          {(user as any).type === 'adExpert' &&
          <Link
  href={`/feedback/${(user as any).id}`}
  style={{ color: 'blue', fontSize: 'small', textDecoration: 'bold', textAlign: 'center'}}
>
  Click to see your Ratings
</Link>}
        </div>
      </div>
    </div>
  );
};

export default DashboardProfile;