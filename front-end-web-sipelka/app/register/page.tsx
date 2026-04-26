"use client"
import { authApi } from "@/lib/authApi";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showAdminToken, setShowAdminToken] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [nip, setNip] = useState("");
  const [adminToken, setAdminToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // ✅ VALIDATION FUNCTION
  const validate = () => {
    if (!name || !email || !nip || !password || !adminToken) {
      return "Semua field harus diisi";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Email tidak valid (harus ada @ dan domain)";
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      return "Password minimal 8 karakter, harus ada huruf besar, kecil, dan angka";
    }

    if (password !== confirmPassword) {
      return "Konfirmasi password tidak sama";
    }

    return "";
  };

  // ✅ HANDLE SUBMIT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      await authApi.registerAdmin({
        name,
        email,
        nip,
        password,
        adminToken,
      });
      alert("Registrasi admin berhasil! Silakan login.");
      router.push("/login");
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Registrasi gagal. Silakan periksa kembali data Anda.");
      } else {
        setError("Terjadi kesalahan sistem. Silakan coba lagi nanti.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      {/* connectivity-grid background */}
      <div
        className="fixed inset-0 z-0 opacity-15 pointer-events-none"
        style={{
          backgroundColor: "#f7f9fb",
          backgroundImage:
            "radial-gradient(#c3c6d1 0.5px, transparent 0.5px), radial-gradient(#c3c6d1 0.5px, #f7f9fb 0.5px)",
          backgroundSize: "40px 40px",
          backgroundPosition: "0 0, 20px 20px",
        }}
      ></div>

      <main className="flex-grow flex items-center justify-center relative z-10 px-6 py-16 min-h-screen font-body text-on-surface selection:bg-primary-fixed selection:text-on-primary-fixed">
        <div className="w-full max-w-[480px]">
          <div className="text-center mb-10">
            <h1 className="font-headline font-extrabold text-4xl text-primary tracking-tighter mb-2">
              SIPELKA
            </h1>
            <p className="font-body text-on-secondary-container tracking-tight opacity-70">
              Research and Eligibility Information System
            </p>
          </div>

          <div className="bg-surface-container-lowest p-10 rounded-xl shadow-[0_20px_40px_rgba(0,27,60,0.06)] border border-outline-variant/20">
            <div className="mb-8">
              <h2 className="font-headline font-bold text-2xl text-primary mb-1">
                Admin Registration
              </h2>
              <p className="text-on-secondary-container text-sm">
                Join the institutional vanguard of research administration.
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="relative group">
                <label
                  className="font-label text-xs uppercase tracking-widest text-outline mb-1 block"
                  htmlFor="name"
                >
                  Full Name
                </label>
                <input
                  className="w-full bg-transparent border-0 border-b border-outline-variant/30 py-2.5 focus:ring-0 focus:border-primary transition-all font-body text-on-surface placeholder:text-outline-variant"
                  id="name"
                  name="name"
                  placeholder="Enter your Full Name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="relative group">
                <label
                  className="font-label text-xs uppercase tracking-widest text-outline mb-1 block"
                  htmlFor="email"
                >
                  Institutional Email
                </label>
                <input
                  className="w-full bg-transparent border-0 border-b border-outline-variant/30 py-2.5 focus:ring-0 focus:border-primary transition-all font-body text-on-surface placeholder:text-outline-variant"
                  id="email"
                  name="email"
                  placeholder="Enter your Email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="relative group">
                <label
                  className="font-label text-xs uppercase tracking-widest text-outline mb-1 block"
                  htmlFor="nip"
                >
                  NIP / Institutional ID
                </label>
                <input
                  className="w-full bg-transparent border-0 border-b border-outline-variant/30 py-2.5 focus:ring-0 focus:border-primary transition-all font-body text-on-surface placeholder:text-outline-variant"
                  id="nip"
                  name="nip"
                  placeholder="Enter your NIP"
                  type="text"
                  required
                  value={nip}
                  onChange={(e) => setNip(e.target.value)}
                />
              </div>
              <div className="relative group">
                <label
                  className="font-label text-xs uppercase tracking-widest text-outline mb-1 block"
                  htmlFor="adminToken"
                >
                  Admin Secret Token
                </label>
                <div className="relative">
                  <input
                    className="w-full bg-transparent border-0 border-b border-outline-variant/30 py-2.5 pr-10 focus:ring-0 focus:border-primary transition-all font-body text-on-surface placeholder:text-outline-variant"
                    id="adminToken"
                    name="adminToken"
                    placeholder="Enter security token"
                    type={showAdminToken ? "text" : "password"}
                    required
                    value={adminToken}
                    onChange={(e) => setAdminToken(e.target.value)}
                  />
                  <span
                    onClick={() => setShowAdminToken(!showAdminToken)}
                    className="material-symbols-outlined absolute right-0 top-1/2 -translate-y-1/2 cursor-pointer text-outline hover:text-primary transition"
                  >
                    {showAdminToken ? "visibility_off" : "visibility"}
                  </span>
                </div>
              </div>
              <div className="relative group">
                <label
                  className="font-label text-xs uppercase tracking-widest text-outline mb-1 block"
                  htmlFor="password"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    className="w-full bg-transparent border-0 border-b border-outline-variant/30 py-2.5 pr-10 focus:ring-0 focus:border-primary transition-all font-body text-on-surface placeholder:text-outline-variant"
                    id="password"
                    name="password"
                    placeholder="••••••••••••"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="material-symbols-outlined absolute right-0 top-1/2 -translate-y-1/2 cursor-pointer text-outline hover:text-primary transition"
                  >
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </div>
              </div>
              <div className="relative group">
                <label
                  className="font-label text-xs uppercase tracking-widest text-outline mb-1 block"
                  htmlFor="confirm_password"
                >
                  Confirm Password
                </label>

                <div className="relative">
                  <input
                    className="w-full bg-transparent border-0 border-b border-outline-variant/30 py-2.5 pr-10 focus:ring-0 focus:border-primary transition-all font-body text-on-surface placeholder:text-outline-variant"
                    id="confirm_password"
                    name="confirm_password"
                    placeholder="••••••••••••"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />

                  <span
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="material-symbols-outlined absolute right-0 top-1/2 -translate-y-1/2 cursor-pointer text-outline hover:text-primary transition"
                  >
                    {showConfirmPassword ? "visibility_off" : "visibility"}
                  </span>
                </div>
              </div>
              {/* ERROR MESSAGE */}
              {error && (
                <div className="p-3 rounded bg-red-50 text-red-500 text-sm border border-red-100">
                  {error}
                </div>
              )}
              <div className="pt-4">
                <button
                  className="w-full bg-primary text-on-primary font-headline font-bold py-4 rounded-xl shadow-lg hover:bg-primary-container transition-all duration-200 active:scale-[0.98] cursor-pointer disabled:opacity-50"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Sign Up"}
                </button>
              </div>
            </form>


            <div className="mt-8 text-center">
              <p className="text-sm text-on-secondary-container">
                Already have an account?
                <Link
                  className="text-primary font-semibold hover:underline decoration-2 underline-offset-4 ml-1 transition-all"
                  href="/login"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-8 flex justify-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-label font-medium uppercase tracking-widest">
              <span className="material-symbols-outlined text-[14px]">
                verified_user
              </span>
              Institutional Security
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container text-on-secondary-container text-[10px] font-label font-medium uppercase tracking-widest">
              <span className="material-symbols-outlined text-[14px]">
                database
              </span>
              GDPR Compliant
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full py-12 px-8 bg-surface-container-low border-0 z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-screen-2xl mx-auto">
          <div className="flex flex-col gap-2">
            <span className="font-headline font-black text-primary text-lg">
              SIPELKA
            </span>
            <p className="font-body text-sm text-outline max-w-sm">
              © 2026 Research and Eligibility Information System. Institutional
              Vanguard Division.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-4 md:justify-end">
            <a
              className="font-body text-sm text-outline hover:text-primary transition-all hover:underline"
              href="#"
            >
              Terms of Service
            </a>
            <a
              className="font-body text-sm text-outline hover:text-primary transition-all hover:underline"
              href="#"
            >
              Privacy Policy
            </a>
            <a
              className="font-body text-sm text-outline hover:text-primary transition-all hover:underline"
              href="#"
            >
              Institutional Access
            </a>
            <a
              className="font-body text-sm text-outline hover:text-primary transition-all hover:underline"
              href="#"
            >
              Support
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
