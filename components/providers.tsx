"use client";

import * as React from "react";
import { Toaster } from "react-hot-toast";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <>
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
