"use client";

import * as React from "react";
import { useActionState, startTransition } from "react";
import Link from "next/link";
import { Mail, Loader2, AlertCircle, Check, ArrowLeft } from "lucide-react";
import { forgotPasswordAction } from "@/app/(auth)/actions";

export default function ForgotPasswordForm() {
  const [origin, setOrigin] = React.useState("");
  const [countdown, setCountdown] = React.useState(0);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const [state, formAction, isPending] = useActionState(forgotPasswordAction, null);

  React.useEffect(() => {
    if (state?.success) {
      setCountdown(60);
    }
  }, [state]);

  React.useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  return (
    <div className="w-full max-w-md p-8 bg-white/85 backdrop-blur-md rounded-[24px] shadow-[0_8px_30px_rgb(224,122,0,0.12)] border border-[#FFE6D5] transition-all duration-300 hover:shadow-[0_8px_40px_rgb(224,122,0,0.18)]">
      {/* Back button */}
      <Link
        href="/login"
        className="inline-flex items-center gap-1 text-xs font-bold text-[#FF9100] hover:text-[#E07A00] transition-all uppercase tracking-wider mb-4"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Kembali ke Login
      </Link>

      {/* Title */}
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-[#E07A00] font-heading">
          Lupa Kata Sandi?
        </h2>
        <p className="mt-2 text-sm text-[#FF9100] font-sans font-medium">
          Masukkan alamat email Anda untuk menerima link pemulihan kata sandi.
        </p>
      </div>

      {/* Success Message */}
      {state?.success && (
        <div className="flex items-start gap-2.5 p-4 mb-6 text-sm text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl font-medium leading-relaxed">
          <Check className="w-4.5 h-4.5 shrink-0 text-emerald-600 mt-0.5" />
          <div>
            <div className="font-bold mb-0.5">Link Berhasil Dikirim!</div>
            <span>{state.message}</span>
          </div>
        </div>
      )}

      {/* Error Message */}
      {state?.error && (
        <div className="flex items-center gap-2 p-3 mb-6 text-sm text-[#FF9100] bg-[#FFF9F5] border border-[#FFE6D5] rounded-xl font-medium">
          <AlertCircle className="w-4 h-4 shrink-0 text-[#FF9100]" />
          <span>{state.error}</span>
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (countdown > 0) return;
          const formData = new FormData(e.currentTarget);
          formData.set("origin", origin);
          startTransition(() => {
            formAction(formData);
          });
        }}
        className="space-y-5"
      >
        {/* Email Input */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#E07A00] mb-2">
            Email Terdaftar
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
              <Mail className="w-4 h-4 text-[#FF9100]" />
            </div>
            <input
              type="email"
              name="email"
              required
              disabled={isPending || countdown > 0}
              placeholder="nama@email.com"
              className="w-full pl-10 pr-4 py-3 bg-[#FFF9F5] text-slate-800 placeholder-slate-400 border border-[#FFE6D5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9100] focus:border-transparent transition-all duration-200 disabled:opacity-60"
            />
          </div>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={isPending || countdown > 0}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#FF9100] hover:bg-[#E07A00] text-white font-semibold rounded-xl text-sm transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-75 disabled:cursor-not-allowed active:scale-[0.98]"
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : countdown > 0 ? (
            `Kirim ulang dalam ${countdown} detik`
          ) : state?.success ? (
            "Kirim Ulang Link Pemulihan"
          ) : (
            "Kirim Link Pemulihan"
          )}
        </button>
      </form>
    </div>
  );
}
