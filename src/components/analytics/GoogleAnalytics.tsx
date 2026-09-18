"use client";

import React, { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { GA_MEASUREMENT_ID, trackGAPageView } from '@/lib/analytics/google-analytics';

const GoogleAnalytics = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;

    // Build current URL with query params
    const searchString = searchParams?.toString();
    const url = `${pathname}${searchString ? `?${searchString}` : ''}`;
    
    // Log pageview event inside GA4
    trackGAPageView(url);
  }, [pathname, searchParams]);

  if (!GA_MEASUREMENT_ID) {
    return null;
  }

  return null;
};

export default GoogleAnalytics;
