import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import OfflineBanner from './OfflineBanner';
import LoadingSpinner from './LoadingSpinner';

export default function AppFrame() {
  return (
    <>
      <OfflineBanner />
      <Suspense fallback={<LoadingSpinner />}>
        <Outlet />
      </Suspense>
    </>
  );
}