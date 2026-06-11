export function translateError(message: string | undefined | null): string {
  if (!message) return "Terjadi kesalahan yang tidak diketahui.";
  
  const msg = message.toLowerCase();
  
  // Auth Errors
  if (msg.includes("invalid login credentials")) {
    return "Email atau kata sandi salah. Silakan periksa kembali data Anda.";
  }
  if (msg.includes("user already registered") || msg.includes("already exists") || msg.includes("already registered")) {
    return "Email sudah terdaftar. Silakan masuk menggunakan email ini atau gunakan email lainnya.";
  }
  if (msg.includes("password should be at least")) {
    return "Kata sandi minimal harus terdiri dari 6 karakter.";
  }
  if (msg.includes("email not confirmed") || msg.includes("confirm your email")) {
    return "Email Anda belum dikonfirmasi. Silakan periksa kotak masuk atau folder spam email Anda untuk melakukan konfirmasi.";
  }
  if (msg.includes("invalid email") || msg.includes("email address is invalid")) {
    return "Format email tidak valid. Pastikan penulisan email sudah benar.";
  }
  if (msg.includes("email link expired") || msg.includes("token expired") || msg.includes("expired")) {
    return "Link verifikasi telah kedaluwarsa atau tidak valid. Silakan minta link baru.";
  }
  if (msg.includes("too many requests") || msg.includes("rate limit")) {
    return "Terlalu banyak permintaan. Silakan tunggu beberapa saat sebelum mencoba lagi.";
  }
  if (msg.includes("user not found")) {
    return "Pengguna tidak ditemukan.";
  }
  if (msg.includes("unauthorized") || msg.includes("not authorized")) {
    return "Anda tidak memiliki wewenang untuk melakukan tindakan ini. Silakan masuk kembali.";
  }

  // Database Constraint / Server Errors
  if (msg.includes("duplicate key value violates unique constraint")) {
    return "Data ini sudah digunakan atau sudah ada. Silakan gunakan nama atau nilai lain.";
  }
  if (msg.includes("violates check constraint")) {
    if (msg.includes("check_font_family")) {
      return "Format font tidak didukung atau melanggar aturan sistem.";
    }
    return "Data yang dimasukkan tidak memenuhi aturan validasi sistem.";
  }
  if (msg.includes("violates foreign key constraint")) {
    return "Data tidak bisa dihapus atau diubah karena sedang digunakan oleh bagian lain dari aplikasi.";
  }
  if (msg.includes("network error") || msg.includes("failed to fetch")) {
    return "Gagal terhubung ke server. Silakan periksa koneksi internet Anda.";
  }

  // General server errors
  if (msg.includes("database error") || msg.includes("internal server error")) {
    return "Terjadi kesalahan pada server database kami. Silakan coba kembali sesaat lagi.";
  }

  return message;
}
