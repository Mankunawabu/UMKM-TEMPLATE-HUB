import * as React from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-[#F7D6E6] mb-8">
      <div>
        <h1 className="text-3xl font-extrabold text-[#3D1E30] tracking-tight">{title}</h1>
        {subtitle && (
          <p className="mt-1.5 text-sm text-[#8C4A6E] font-medium">{subtitle}</p>
        )}
      </div>
      {action && (
        <div className="flex items-center gap-3 shrink-0">
          {action}
        </div>
      )}
    </div>
  );
}
