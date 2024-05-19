'use client';
import React, { useEffect, useState, useRef } from 'react';
import { api } from '../../../../utils/api';
import Image from 'next/image';

const AdsPage = () => {
  const [ads, setAds] = useState<any[]>([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [currentInterval, setCurrentInterval] = useState<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playCount, setPlayCount] = useState(0);
const path = window.location.pathname;  
const pathSegments = path.split('/');  
const lastSegment = pathSegments.pop(); 
  // Fetch ads data from the API
  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await api.get('/ads');
        setAds(response.data);
      } catch (error) {
        console.error('Error fetching ads:', error);
      }
    };

    fetchAds();
  }, []);

  // Function to display the next ad
  const displayNextAd = () => {
    setCurrentAdIndex((prevIndex) => {
      const nextIndex = (prevIndex + 1) % ads.length;
      if (nextIndex === 0) {
        setPlayCount(0); // Reset play count when looping back to the beginning
      }
      return nextIndex;
    });
  };
 
// Function to calculate the display duration for an ad
const getAdDisplayDuration = (ad: any) => {
  const isImage = ad.image === 'yes';
  const hasSubscriptionPlan1 = ad.tenant.subscriptionPlan === '1';

  if (isImage) {
    return hasSubscriptionPlan1 ? 10 : 5;
  } else {
    // Return the length of the video if available, otherwise default to 30 or 15
    return ad.videoLength || (hasSubscriptionPlan1 ? 30 : 15);
  }
};

  // Function to check if the ad should be displayed based on location
  const shouldDisplayAd = (ad: any) => {
    return ad && ad.location === lastSegment && ad.status === 'approved';
  };

  // Use setInterval to display the next ad after the calculated duration
// Use setInterval to display the next ad after the calculated duration
useEffect(() => {
  let interval: NodeJS.Timeout | null = null;

  if (ads.length > 0) {
    const currentAd = ads[currentAdIndex];
    const displayDuration = getAdDisplayDuration(currentAd);

    if (shouldDisplayAd(currentAd)) {
      // Set a new interval
      interval = setInterval(() => {
        if (currentAd.image === 'no' && playCount < 1) {
          setPlayCount((prevCount) => prevCount + 1);
        } else {
          displayNextAd();
        }
      }, displayDuration * 1000);

      // If the current ad is a video, autoplay it
      if (currentAd.image === 'no' && videoRef.current) {
        videoRef.current.play();
      }
    } else {
      displayNextAd();
    }
  }

  // Clear the interval when the component unmounts or before the useEffect hook runs again
  return () => {
    if (interval) {
      clearInterval(interval);
    }
  };
}, [ads, currentAdIndex, playCount]);
  // Render the current ad
  const renderAd = () => {
    const currentAd = ads[currentAdIndex];

    if (!shouldDisplayAd(currentAd)) {
      return null;
    }

    if (currentAd.image === 'yes') {
      return (
        <Image
          src={`${currentAd.fileName}`}
          alt="Ad"
          width={640}
          height={360}
        />
      );
    } else {
      return (
       <video ref={videoRef} controls loop onCanPlay={() => videoRef.current && videoRef.current.play()}>
  <source src={`${currentAd.fileName}`} type="video/mp4" />
</video>
      );
    }
  };

  return <div>{renderAd()}</div>;
};

export default AdsPage;