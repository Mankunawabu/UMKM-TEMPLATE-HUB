"use client";

import * as React from "react";
import { Toaster } from "react-hot-toast";
import NextTopLoader from "nextjs-toploader";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <>
      <NextTopLoader 
        color="#FF9100"
        initialPosition={0.08}
        crawlSpeed={200}
        height={3}
        crawl={true}
        showSpinner={false}
        easing="ease"
        speed={200}
        shadow="0 0 10px #FF9100,0 0 5px #FF9100"
      />
      <Toaster 
        position="top-center" 
        toastOptions={{
          className: 'font-sans text-sm font-semibold text-[#1E293B]',
          success: {
            iconTheme: {
              primary: '#E07A00',
              secondary: '#FFF',
            },
          },
        }}
      />
      {children}
    </>
  );
}
