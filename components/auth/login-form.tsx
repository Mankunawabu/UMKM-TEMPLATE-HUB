"use client";

import * as React from "react";
import { useActionState, startTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Loader2, AlertCircle, Check, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { loginAction, googleLoginAction } from "@/app/(auth)/actions";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [rememberMe, setRememberMe] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [showPassword, setShowPassword] = React.useState(false);

  // Load remembered credentials on mount
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const savedEmail = localStorage.getItem("remembered_email");
      const savedPassword = localStorage.getItem("remembered_password");
      if (savedEmail) {
        setEmail(savedEmail);
        setRememberMe(true);
      }
      if (savedPassword) {
        try {
          setPassword(window.atob(savedPassword));
        } catch (e) {
          setPassword("");
        }
      }

      // Check if registration was successful from URL params
      const params = new URLSearchParams(window.location.search);
      if (params.get("registered") === "true") {
        setSuccessMessage("Registrasi berhasil! Silakan masuk menggunakan email dan password baru Anda.");
      }
      if (params.get("reset") === "true") {
        setSuccessMessage("Kata sandi berhasil diperbarui! Silakan masuk menggunakan email dan kata sandi baru Anda.");
      }
    }
  }, []);

  // Action state for login action
  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const res = await loginAction(prevState, formData);
      if (res?.success && res.redirectUrl) {
        router.push(res.redirectUrl);
        router.refresh();
      }
      return res;
    },
    null
  );

  const handleGoogleLogin = async () => {
    const res = await googleLoginAction();
    if (res?.success && res.url) {
      window.location.href = res.url;
    } else if (res?.error) {
      toast.error(`Gagal masuk dengan Google: ${res.error}`);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-white/85 backdrop-blur-md rounded-[24px] shadow-[0_8px_30px_rgb(224,122,0,0.12)] border border-[#FFE6D5] transition-all duration-300 hover:shadow-[0_8px_40px_rgb(224,122,0,0.18)]">
      {/* Title */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-[#E07A00] font-heading">
          Selamat Datang
        </h2>
        <p className="mt-2 text-sm text-[#FF9100] font-sans">
          Masuk ke UMKM Template Hub untuk mulai mendesain.
        </p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="flex items-center gap-2 p-3 mb-6 text-sm text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl font-medium">
          <Check className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Error Message */}
      {state?.error && (
        <div className="flex items-center gap-2 p-3 mb-6 text-sm text-[#E07A00] bg-[#FFF9F5] border border-[#FFE6D5] rounded-xl">
          <AlertCircle className="w-4 h-4 shrink-0 text-[#FF9100]" />
          <span>{state.error}</span>
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (typeof window !== "undefined") {
            if (rememberMe) {
              localStorage.setItem("remembered_email", email);
              localStorage.setItem("remembered_password", window.btoa(password));
            } else {
              localStorage.removeItem("remembered_email");
              localStorage.removeItem("remembered_password");
            }
          }
          const formData = new FormData(e.currentTarget);
          startTransition(() => {
            formAction(formData);
          });
        }}
        className="space-y-5"
      >
        {/* Email Input */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#E07A00] mb-2">
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
              <Mail className="w-4 h-4 text-[#FF9100]" />
            </div>
            <input
              type="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isPending}
              placeholder="nama@usaha.com"
              className="w-full pl-10 pr-4 py-3 bg-[#FFF9F5] text-slate-800 placeholder-slate-400 border border-[#FFE6D5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9100] focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        {/* Password Input */}
        <div>
          <div className="mb-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#E07A00]">
              Password
            </label>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
              <Lock className="w-4 h-4 text-[#FF9100]" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isPending}
              placeholder="••••••••"
              className="w-full pl-10 pr-10 py-3 bg-[#FFF9F5] text-slate-800 placeholder-slate-400 border border-[#FFE6D5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9100] focus:border-transparent transition-all duration-200"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-[#FF9100] hover:text-[#E07A00] transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Remember Me & Forgot Password Row */}
        <div className="flex items-center justify-between py-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 accent-[#FF9100] rounded border-[#FFE6D5] text-[#FF9100] focus:ring-[#FF9100] cursor-pointer"
            />
            <span className="text-xs font-bold text-[#E07A00]">Ingat Saya</span>
          </label>

          <Link
            href="/forgot-password"
            className="text-xs font-bold text-[#FF9100] hover:text-[#E07A00] hover:underline transition-all"
          >
            Lupa Password?
          </Link>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#FF9100] hover:bg-[#E07A00] text-white font-semibold rounded-xl text-sm transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-75 disabled:cursor-not-allowed group active:scale-[0.98]"
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Masuk Ke Akun"
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#FFE6D5]"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="px-3 bg-white text-[#FF9100] text-[10px] tracking-widest font-semibold">
            atau
          </span>
        </div>
      </div>

      {/* Google Sign In */}
      <button
        onClick={handleGoogleLogin}
        type="button"
        disabled={isPending}
        className="w-full flex items-center justify-center gap-3 py-3 bg-white border border-[#FFE6D5] hover:bg-[#FFF9F5] text-slate-700 font-semibold rounded-xl text-sm transition-all duration-200 active:scale-[0.98]"
      >
        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.77c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        <span>Masuk dengan Google</span>
      </button>

      {/* Register Footer */}
      <div className="mt-8 text-center text-sm">
        <span className="text-slate-500">Belum punya akun? </span>
        <Link
          href="/register"
          className="font-bold text-[#E07A00] hover:text-[#FF9100] hover:underline transition-all"
        >
          Daftar Sekarang
        </Link>
      </div>
    </div>
  );
}
