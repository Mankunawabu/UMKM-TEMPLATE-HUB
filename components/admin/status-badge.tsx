import * as React from "react";

type BadgeType = "published" | "draft" | "active" | "inactive" | "old" | "archived" | string | boolean;

interface StatusBadgeProps {
  status: BadgeType;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  let label = "";
  let classes = "";

  const normStatus = typeof status === "string" ? status.toLowerCase() : String(status);

  switch (normStatus) {
    case "published":
    case "active":
    case "true":
      label = normStatus === "true" || normStatus === "active" ? "Aktif" : "Published";
      classes = "bg-emerald-50 text-emerald-700 border-emerald-200";
      break;
    case "draft":
      label = "Draft";
      classes = "bg-amber-50 text-amber-700 border-amber-200";
      break;
    case "inactive":
    case "false":
      label = normStatus === "false" || normStatus === "inactive" ? "Nonaktif" : "Inactive";
      classes = "bg-rose-50 text-rose-700 border-rose-200";
      break;
    case "old":
      label = "Versi Lama";
      classes = "bg-slate-50 text-slate-600 border-slate-200";
      break;
    default:
      label = String(status);
      classes = "bg-slate-50 text-slate-600 border-slate-200";
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${classes}`}>
      {label}
    </span>
  );
}
