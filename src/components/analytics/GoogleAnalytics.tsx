"use client";

import React, { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';
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

  return (
    <>
      {/* Load Global Google Analytics Script */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
};

export default GoogleAnalytics;
