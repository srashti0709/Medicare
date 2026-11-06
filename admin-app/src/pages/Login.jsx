
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import api from "../api";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const token = localStorage.getItem("adminToken");
  const adminUser = JSON.parse(
    localStorage.getItem("adminUser") || "{}"
  );

  if (token && adminUser.role === "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  if (token && adminUser.role === "doctor") {
    return (
      <Navigate
        to={
          adminUser.mustChangePassword
            ? "/change-doctor-password"
            : "/doctor-dashboard"
        }
        replace
      />
    );
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post(
        "/auth/login",
        formData
      );

      const { token, user } = response.data;

      // Only admin and doctor can access this app
      if (user.role !== "admin" && user.role !== "doctor") {
        setError(
          "Access denied. Admin or doctor account required."
        );
        setLoading(false);
        return;
      }

      localStorage.setItem("adminToken", token);
      localStorage.setItem("adminUser", JSON.stringify(user));

      if (user.role === "admin") {
        window.location.href = "/dashboard";
      } else if (user.mustChangePassword) {
        window.location.href = "/change-doctor-password";
      } else {
        window.location.href = "/doctor-dashboard";
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F5F8F6] px-4 py-10 sm:px-6">

      {/* Soft background accents */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#B9ECEE]/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-24 h-[28rem] w-[28rem] rounded-full bg-[#ADEFE7]/35 blur-3xl" />

      <div className="relative z-10 w-full max-w-[1040px]">
        <div className="grid overflow-hidden rounded-[28px] border border-[#CBDAD6] bg-white shadow-[0_24px_70px_rgba(0,52,53,0.10)] lg:grid-cols-[1.02fr_0.98fr]">

          {/* Brand panel */}
          <div className="relative hidden flex-col justify-between overflow-hidden bg-[#003435] p-10 text-white lg:flex xl:p-12">
            <div className="pointer-events-none absolute -right-24 -top-20 h-80 w-80 rounded-full border-[1px] border-white/10" />
            <div className="pointer-events-none absolute -right-10 -top-6 h-52 w-52 rounded-full border-[1px] border-white/10" />
            <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-[#256862]/45 blur-2xl" />

            <div className="relative z-10">
              <div className="mb-12 inline-flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ADEFE7] font-['Bricolage_Grotesque'] text-2xl font-bold text-[#003435] shadow-lg shadow-black/10">
                  M
                </div>

                <div>
                  <p className="font-['Bricolage_Grotesque'] text-2xl font-bold tracking-tight">
                    Medicare
                  </p>
                  <p className="mt-0.5 text-base font-semibold uppercase tracking-[0.2em] text-[#B9D8D1]">
                    Hospital management
                  </p>
                </div>
              </div>

              <div className="max-w-sm">
                <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#ADEFE7]/25 bg-white/5 px-3 py-1.5 text-base font-bold uppercase tracking-[0.16em] text-[#ADEFE7]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#ADEFE7]" />
                  Care, connected
                </span>

                <h1 className="font-['Bricolage_Grotesque'] text-[42px] font-bold leading-[1.12] tracking-tight xl:text-[48px]">
                  Better care starts with{" "}
                  <span className="text-[#ADEFE7]">
                    better coordination.
                  </span>
                </h1>

                <p className="mt-5 text-base leading-7 text-[#C2D8D2]">
                  A connected workspace for healthcare teams to manage
                  hospital operations and deliver organized patient care.
                </p>
              </div>
            </div>

            <div className="relative z-10 mt-14">
              <div className="mb-5 h-px w-full bg-white/15" />
              <div className="flex items-center justify-between text-base text-[#B9D8D1]">
                <span>Secure healthcare workspace</span>
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#ADEFE7]" />
                  Secure access
                </span>
              </div>
            </div>
          </div>

          {/* Login panel */}
          <div className="flex flex-col justify-center px-6 py-9 sm:px-10 sm:py-12 lg:px-12 xl:px-14">

            <div className="mb-9 text-center lg:hidden">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#003435] font-['Bricolage_Grotesque'] text-2xl font-bold text-[#ADEFE7] shadow-lg shadow-[#003435]/15">
                M
              </div>

              <h1 className="font-['Bricolage_Grotesque'] text-3xl font-bold tracking-tight text-[#003435]">
                Medicare
              </h1>

              <p className="mt-1 text-base font-semibold uppercase tracking-[0.16em] text-[#71817C]">
                Hospital Management System
              </p>
            </div>

            <div className="mx-auto w-full max-w-[390px]">
              <div className="mb-8">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#E7F4F1] text-[#256862]">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-5 w-5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
                    <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.7 2.94-.08-.02a1.7 1.7 0 0 0-1.78.54l-.05.07h-3.4l-.02-.08a1.7 1.7 0 0 0-1.32-1.32l-.08-.02-1.7-2.94.06-.06A1.7 1.7 0 0 0 10.06 14l-.08-.02v-3.4l.08-.02a1.7 1.7 0 0 0 1.32-1.32l.02-.08h3.4l.05.07a1.7 1.7 0 0 0 1.78.54l.08-.02 1.7 2.94-.06.06A1.7 1.7 0 0 0 19.4 15Z" />
                  </svg>
                </div>

                <p className="mb-2 text-base font-bold uppercase tracking-[0.18em] text-[#56847A]">
                  Welcome back
                </p>

                <h2 className="font-['Bricolage_Grotesque'] text-[30px] font-bold tracking-tight text-[#003435] sm:text-[34px]">
                  Sign in to Medicare
                </h2>

                <p className="mt-2 text-base leading-6 text-[#71817C]">
                  Enter your account details to access your workspace.
                </p>
              </div>

              {error && (
                <div
                  role="alert"
                  className="mb-5 flex items-start gap-3 rounded-xl border border-[#F0C7C2] bg-[#FFF3F1] px-4 py-3 text-base leading-5 text-[#9B3932]"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#F8DCD8] text-base font-bold">
                    !
                  </span>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-base font-semibold tracking-wide text-[#404848]"
                  >
                    Email address
                  </label>

                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#82968F]">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="h-[18px] w-[18px]"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <rect x="3" y="5" width="18" height="14" rx="2" />
                        <path d="m3 7 9 6 9-6" />
                      </svg>
                    </span>

                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="admin@medicare.com"
                      required
                      autoComplete="username"
                      className="w-full rounded-xl border border-[#CBDAD6] bg-[#FCFEFD] py-3.5 pl-11 pr-4 text-base text-[#0a1f1c] outline-none transition placeholder:text-[#A0ADA8] hover:border-[#9DBAB1] focus:border-[#256862] focus:ring-4 focus:ring-[#ADEFE7]/40"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-base font-semibold tracking-wide text-[#404848]"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#82968F]">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="h-[18px] w-[18px]"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <rect x="4" y="10" width="16" height="11" rx="2" />
                        <path d="M8 10V7a4 4 0 1 1 8 0v3" />
                      </svg>
                    </span>

                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                      autoComplete="current-password"
                      className="w-full rounded-xl border border-[#CBDAD6] bg-[#FCFEFD] py-3.5 pl-11 pr-12 text-base text-[#0a1f1c] outline-none transition placeholder:text-[#A0ADA8] hover:border-[#9DBAB1] focus:border-[#256862] focus:ring-4 focus:ring-[#ADEFE7]/40"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#82968F] hover:text-[#256862] transition-colors"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff size={19} />
                      ) : (
                        <Eye size={19} />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 inline-flex min-h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-[#003435] px-5 py-3 text-base font-bold text-white shadow-[0_6px_16px_rgba(0,52,53,0.16)] transition hover:-translate-y-0.5 hover:bg-[#164B4D] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="h-4 w-4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </>
                  )}
                </button>
              </form>

              <div className="mt-7 flex items-center gap-3">
                <div className="h-px flex-1 bg-[#E5ECE8]" />
                <span className="text-base font-medium uppercase tracking-[0.12em] text-[#9AA9A3]">
                  Authorized access only
                </span>
                <div className="h-px flex-1 bg-[#E5ECE8]" />
              </div>

              <p className="mt-7 text-center text-base leading-5 text-[#91A09A]">
                © 2026 Medicare. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
