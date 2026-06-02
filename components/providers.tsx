"use client";

import * as React from "react";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: { children: React.ReactNode }) {
  // This is a placeholder layout wrapper for client providers (Theme, Toast, etc.)
  // It is prepared to handle future integrations like Sonner, React Query, or Theme Providers.
  return <>{children}</>;
}
