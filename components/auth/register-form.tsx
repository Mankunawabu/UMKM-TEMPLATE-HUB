"use client";

import * as React from "react";
import { useActionState, startTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Loader2, AlertCircle, Check, X, Eye, EyeOff } from "lucide-react";
import { registerAction } from "@/app/(auth)/actions";

export default function RegisterForm() {
  const router = useRouter();
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  // Action state for register action
  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const res = await registerAction(prevState, formData);
      if (res?.success && res.redirectUrl) {
        router.push(res.redirectUrl);
        router.refresh();
      }
      return res;
    },
    null
  );

  // Password rules validation
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isMatching = password === confirmPassword && confirmPassword.length > 0;

  const rules = [
    { label: "Minimal 8 karakter", met: hasMinLength },
    { label: "Minimal 1 huruf besar (A-Z)", met: hasUppercase },
    { label: "Minimal 1 huruf kecil (a-z)", met: hasLowercase },
    { label: "Minimal 1 angka (0-9)", met: hasNumber },
    { label: "Minimal 1 karakter khusus / simbol", met: hasSpecialChar },
  ];

  return (
    <div className="w-full max-w-md p-8 bg-white/85 backdrop-blur-md rounded-[24px] shadow-[0_8px_30px_rgb(194,123,160,0.12)] border border-[#F7D6E6] transition-all duration-300 hover:shadow-[0_8px_40px_rgb(194,123,160,0.18)]">
      {/* Title */}
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-[#8C4A6E] font-heading">
          Gabung Sekarang
        </h2>
        <p className="mt-2 text-sm text-[#C27BA0] font-sans">
          Daftarkan email Anda dan mulai membuat desain promosi.
        </p>
      </div>

      {/* Error Message */}
      {state?.error && (
        <div className="flex items-center gap-2 p-3 mb-5 text-sm text-[#8C4A6E] bg-[#FFF9FC] border border-[#F7D6E6] rounded-xl">
          <AlertCircle className="w-4 h-4 shrink-0 text-[#C27BA0]" />
          <span>{state.error}</span>
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!hasMinLength || !hasUppercase || !hasLowercase || !hasNumber || !hasSpecialChar) {
            alert("Password belum memenuhi syarat keamanan.");
            return;
          }
          if (password !== confirmPassword) {
            alert("Password dan konfirmasi password tidak cocok.");
            return;
          }
          const formData = new FormData(e.currentTarget);
          startTransition(() => {
            formAction(formData);
          });
        }}
        className="space-y-4"
      >
        {/* Email */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C4A6E] mb-1.5">
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Mail className="w-4 h-4 text-[#C27BA0]" />
            </div>
            <input
              type="email"
              name="email"
              required
              disabled={isPending}
              placeholder="nama@email.com"
              className="w-full pl-9 pr-3 py-2.5 bg-[#FFF9FC] text-slate-800 placeholder-slate-400 border border-[#F7D6E6] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C27BA0] focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C4A6E] mb-1.5">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Lock className="w-4 h-4 text-[#C27BA0]" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              disabled={isPending}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              className="w-full pl-9 pr-9 py-2.5 bg-[#FFF9FC] text-slate-800 placeholder-slate-400 border border-[#F7D6E6] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C27BA0] focus:border-transparent transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#C27BA0] hover:text-[#8C4A6E] transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Password Rules Checklist */}
        <div className="p-3 bg-[#FFF9FC] border border-[#F7D6E6]/50 rounded-xl space-y-1.5 font-sans">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#8C4A6E] mb-1">
            Syarat Keamanan Password:
          </p>
          {rules.map((rule, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs">
              {rule.met ? (
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              ) : (
                <div className="w-3.5 h-3.5 rounded-full border border-slate-300 flex items-center justify-center text-[8px] text-slate-400 font-bold shrink-0">
                  •
                </div>
              )}
              <span className={rule.met ? "text-emerald-700 font-semibold" : "text-slate-500 font-medium"}>
                {rule.label}
              </span>
            </div>
          ))}
        </div>

        {/* Konfirmasi Password */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C4A6E] mb-1.5">
            Konfirmasi Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Lock className="w-4 h-4 text-[#C27BA0]" />
            </div>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirm_password"
              required
              disabled={isPending}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Ulangi password"
              className="w-full pl-9 pr-9 py-2.5 bg-[#FFF9FC] text-slate-800 placeholder-slate-400 border border-[#F7D6E6] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C27BA0] focus:border-transparent transition-all"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#C27BA0] hover:text-[#8C4A6E] transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {/* Match Indicator */}
          {confirmPassword.length > 0 && (
            <div className="mt-1 flex items-center gap-1 text-[11px]">
              {isMatching ? (
                <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
                  <Check className="w-3 h-3" /> Password cocok
                </span>
              ) : (
                <span className="text-red-500 font-semibold flex items-center gap-0.5">
                  <X className="w-3 h-3" /> Password tidak cocok
                </span>
              )}
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full flex items-center justify-center gap-2 py-3 mt-2 bg-[#C27BA0] hover:bg-[#8C4A6E] text-white font-semibold rounded-xl text-sm transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-75 disabled:cursor-not-allowed active:scale-[0.98]"
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Daftar Akun Baru"
          )}
        </button>
      </form>

      {/* Login Footer */}
      <div className="mt-6 text-center text-sm">
        <span className="text-slate-500">Sudah punya akun? </span>
        <Link
          href="/login"
          className="font-bold text-[#8C4A6E] hover:text-[#C27BA0] hover:underline transition-all"
        >
          Masuk Disini
        </Link>
      </div>
    </div>
  );
}
