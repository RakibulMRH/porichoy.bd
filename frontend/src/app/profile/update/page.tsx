'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    // Get the user id from the session
    const user = sessionStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      const id = parsedUser.id;
      // Redirect to the route with the user id
      router.push(`update/${id}`);
    }
  }, []);

  return null;
}