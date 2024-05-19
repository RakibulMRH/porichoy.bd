'use client';
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faBars } from '@fortawesome/free-solid-svg-icons';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { api } from '../../utils/api';
import dynamic from 'next/dynamic';
import AdminLinks from '../../components/AdminLinks';

const DashboardProfile = dynamic(() => import('../user/[id]/page'));
const SubscriptionPage = dynamic(() => import('../subscriptions/page'));
const AdsView = dynamic(() => import('../ads/page'));

const DashboardClient = () => {
  const router = useRouter();
  const [user, setUserSession] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [showSubscriptionPage, setShowSubscriptionPage] = useState(false);
  const [showAdsPage, setShowAdsPage] = useState(false);
  const [activePage, setActivePage] = useState<'subscription' | 'ads' | null>('ads');  
  const [isAdmin, setIsAdmin] = useState(false);

  {activePage === 'subscription' && <SubscriptionPage />}
  {activePage === 'ads' && <AdsView />}

  useEffect(() => {
    const checkAdminRole = () => {
      const user = JSON.parse(sessionStorage.getItem('user') || '{}');
      const userRole = user.role;
      setIsAdmin(userRole === 'admin');
    };

    checkAdminRole();
  }, []);

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
      try {
        const response = await api.get('/dashboard/user');
        setUserSession(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const sessionUser = sessionStorage.getItem('user');
    if (sessionUser) {
      setUserSession(JSON.parse(sessionUser));
    } else {
      fetchUserDetails();
      router.push('/login');
    }
  }, []);

  if (!user) {
    return <p>Please log in to access the dashboard.</p>;
  }

  if (!user) {
    return null;
  }

  const handleButtonClick = async (endpoint: string) => {
    try {
      if (endpoint === 'consultation') {
        const sessionUser = sessionStorage.getItem('user');
        if (sessionUser) {
          const parsedUser = JSON.parse(sessionUser);
          if (parsedUser.role === 'adExpert') {
            router.push('/consultation');
          }
          else{
            router.push('/consultation/book');
          }
        } else {
          router.push('/login');
        } 
      } else {
        const response = await api.get(`/dashboard/${endpoint}/${(user as any).id}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center relative">
        <button
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          onClick={() => setShowSidebar(!showSidebar)}
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
        
        <div className="font-bold text-lg text-green-600">Welcome, {(user as any).lastName}</div>
        <div className="flex items-center space-x-4 relative">
          <FontAwesomeIcon icon={faBell} className="text-green-600" />
          {(user as any).profilePicture && (
            <div className="relative">
              <img
                src={(user as any).profilePicture}
                alt="Profile"
                className="w-8 h-8 rounded-full cursor-pointer"
                onClick={() => setShowProfile(!showProfile)}
              />
              {showProfile && (
                <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg overflow-hidden z-50">
                  <DashboardProfile />
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Sidebar and Main Content */}
      <div className="flex flex-grow">
        {/* Sidebar */}
        <div
          className={`bg-green-800 text-white transition-all duration-300 ${
            showSidebar ? 'w-64' : 'w-0'
          } py-6 px-4 space-y-6 overflow-hidden`}
        >
          <div>
          <AdminLinks isAdmin={isAdmin} />
          { !isAdmin && (
  <button
    className="group w-full text-left rounded-md px-2 py-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-colors duration-300"
    onClick={() => handleButtonClick('user')}
  >
    Dashboard
  </button>
)}
          </div>
          <div>
            <button
              className="group w-full text-left rounded-md px-2 py-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-colors duration-300"
              onClick={() => handleButtonClick('subscription')}
            >
              Payments
            </button>
          </div>
          <div>
            <button
              className="group w-full text-left rounded-md px-2 py-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-colors duration-300"
              onClick={() => handleButtonClick('feedback')}
            >
              Sales
            </button>
          </div>
          <div>
          <button 
            className="group w-full text-left rounded-md px-2 py-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-colors duration-300" 
            onClick={() => setActivePage(activePage === 'ads' ? null : 'ads')}
          >
            Ad Management
          </button>
          </div>
          <div>
          <button 
            className="group w-full text-left rounded-md px-2 py-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-colors duration-300" 
            onClick={() => setActivePage(activePage === 'subscription' ? null : 'subscription')}
          >
            Plans and pricing
          </button>
          </div>
          <div>
            <button className="group w-full text-left rounded-md px-2 py-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-colors duration-300">
              Documents
            </button>
          </div>
          <div>
            <button className="group w-full text-left rounded-md px-2 py-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-colors duration-300">
              Roles
            </button>
          </div>
          <div>
            <button
              className="group w-full text-left rounded-md px-2 py-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-colors duration-300"
              onClick={() => handleButtonClick('consultation')}
            >
              Consultations
            </button>
          </div>
          <div>
            <button className="group w-full text-left rounded-md px-2 py-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-colors duration-300">
              Settings
            </button>
          </div>
          <div>
            <button
              className="group w-full text-left rounded-md px-2 py-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-colors duration-300"
              onClick={logout} >
              Sign Out
            </button>
          </div>
          <div>
            <button className="group w-full text-left rounded-md px-2 py-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-colors duration-300"
            onClick={()=> {router.push('/financial/getAllPayments')}}>
              Financials
            </button></div><div>
            <button className="group w-full text-left rounded-md px-2 py-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-colors duration-300"
            onClick={()=> {router.push('/privilege/showallpriv')}}>
              Priviledge
            </button></div><div>
            <button className="group w-full text-left rounded-md px-2 py-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-colors duration-300"
             onClick={()=> {router.push('/employee')}} >
              Employee management
            </button> 
          </div>
          
        </div>  
        
        <div className="flex-grow p-6">
        {activePage === 'subscription' && <SubscriptionPage />}
        {activePage === 'ads' && <AdsView />}
 
        </div>
      </div>
    </div>
  );
};

export default DashboardClient;