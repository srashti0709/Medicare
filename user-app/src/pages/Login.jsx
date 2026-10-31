
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  HeartPulse,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../api";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const { token, user } = response.data;

      if (user.role !== "patient") {
        setError("Please use a patient account to login.");
        return;
      }

      localStorage.setItem("userToken", token);
      localStorage.setItem("user", JSON.stringify(user));

      window.location.href = "/";
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="medicare-login min-h-screen overflow-hidden bg-[#F5F8F6] text-[#0A1F1C]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@500;600;700;800&family=Manrope:wght@400;500;600;700;800&display=swap');

        .medicare-login {
          font-family: 'Manrope', sans-serif;
        }

        .medicare-login h1,
        .medicare-login h2,
        .medicare-login .display-font {
          font-family: 'Bricolage Grotesque', sans-serif;
        }

        .login-grid {
          background-image:
            linear-gradient(rgba(173,239,231,.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(173,239,231,.12) 1px, transparent 1px);
          background-size: 34px 34px;
        }

        @keyframes login-fade-up {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes login-float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes login-pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(173,239,231,.22);
          }
          50% {
            box-shadow: 0 0 0 12px rgba(173,239,231,0);
          }
        }

        .login-enter {
          animation: login-fade-up .7s cubic-bezier(.2,.8,.2,1) both;
        }

        .login-enter-delayed {
          animation: login-fade-up .8s .12s cubic-bezier(.2,.8,.2,1) both;
        }

        .login-float {
          animation: login-float 5s ease-in-out infinite;
        }

        .login-pulse {
          animation: login-pulse 2.8s ease-out infinite;
        }

        .login-field {
          transition:
            border-color .2s ease,
            box-shadow .2s ease,
            background .2s ease,
            transform .2s ease;
        }

        .login-field:focus-within {
          border-color: #256862;
          background: #fff;
          box-shadow: 0 0 0 4px rgba(37,104,98,.10);
        }

        .login-submit {
          transition:
            transform .2s ease,
            box-shadow .2s ease,
            background .2s ease;
        }

        .login-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(0,52,53,.2);
        }

        .login-submit:active:not(:disabled) {
          transform: translateY(0);
        }

        @media (prefers-reduced-motion: reduce) {
          .login-enter,
          .login-enter-delayed,
          .login-float,
          .login-pulse {
            animation: none !important;
          }

          .login-field,
          .login-submit {
            transition: none !important;
          }
        }
      `}</style>

      <Navbar />

      <main className="relative mx-auto flex w-full max-w-7xl items-center px-4 py-10 sm:px-6 md:min-h-[calc(100vh-150px)] md:py-14 lg:px-8">

        <div className="pointer-events-none absolute -left-28 top-10 h-72 w-72 rounded-full bg-[#ADEFE7]/40 blur-3xl" />

        <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-[#D7ECE6]/70 blur-3xl" />

        <div className="relative grid w-full overflow-hidden rounded-[2rem] border border-[#CBDAD6] bg-white shadow-[0_24px_80px_rgba(0,52,53,0.09)] lg:min-h-[650px] lg:grid-cols-[1.02fr_.98fr]">

          {/* Brand Panel */}

          <section className="login-grid relative hidden flex-col justify-between overflow-hidden bg-[#003435] p-10 text-white lg:flex xl:p-14">

            <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full border border-[#ADEFE7]/20" />

            <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full border border-[#ADEFE7]/20" />

            <div className="absolute -bottom-28 -left-24 h-80 w-80 rounded-full bg-[#256862]/40 blur-2xl" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-3 rounded-2xl border border-white/15 bg-white/[0.07] px-4 py-3 backdrop-blur">

                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ADEFE7] text-[#003435]">
                  <HeartPulse size={23} strokeWidth={2.4} />
                </span>

                <div>
                  <p className="display-font text-lg font-bold leading-none">
                    Medicare
                  </p>

                  <p className="mt-1 text-base font-bold uppercase tracking-[0.12em] text-[#ADEFE7]">
                    Care made simpler
                  </p>
                </div>

              </div>
            </div>

            <div className="relative z-10 my-12 max-w-lg">

              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#ADEFE7]/25 bg-[#ADEFE7]/10 px-3 py-1.5 text-base font-bold tracking-wide text-[#ADEFE7]">
                <Sparkles size={16} />
                YOUR HEALTH, IN GOOD HANDS
              </div>

              <h1 className="display-font text-4xl font-bold leading-[1.08] tracking-tight xl:text-5xl">
                A healthier you
                <br />
                starts <span className="text-[#ADEFE7]">right here.</span>
              </h1>

              <p className="mt-6 max-w-md text-base leading-7 text-white/65 xl:text-base">
                Sign in to manage appointments, connect with your care team,
                and keep your health journey moving forward.
              </p>

              <div className="login-float relative mt-12 max-w-sm rounded-3xl border border-white/15 bg-white/[0.08] p-5 shadow-2xl backdrop-blur-md">

                <div className="flex items-center gap-4">

                  <div className="login-pulse flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ADEFE7] text-[#003435]">
                    <ShieldCheck size={24} />
                  </div>

                  <div>
                    <p className="font-bold text-base text-white">
                      Your care, securely connected
                    </p>

                    <p className="mt-1 text-base text-white/55">
                      A more convenient care experience
                    </p>
                  </div>

                </div>

                <div className="mt-5 h-px bg-white/10" />

                <div className="mt-4 flex items-center justify-between text-base text-white/60">
                  <span>Patient-first experience</span>

                  <span className="flex items-center gap-1.5 text-[#ADEFE7]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#ADEFE7]" />
                    Welcome back
                  </span>
                </div>

              </div>
            </div>

            <p className="relative z-10 text-base text-white/40">
              Thoughtful care. Better connected.
            </p>

          </section>

          {/* Login Form */}

          <section className="login-enter flex items-center justify-center px-5 py-10 sm:px-10 sm:py-14 lg:px-12 xl:px-16">

            <div className="w-full max-w-md">

              <div className="mb-8 flex items-center gap-3 lg:hidden">

                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#003435] text-[#ADEFE7]">
                  <HeartPulse size={24} />
                </span>

                <div>
                  <p className="display-font text-xl font-bold text-[#003435]">
                    Medicare
                  </p>

                  <p className="text-base font-bold uppercase tracking-[0.12em] text-[#256862]">
                    Care made simpler
                  </p>
                </div>

              </div>

              <div className="login-enter-delayed">

                <div className="mb-7">

                  <p className="mb-3 text-base font-extrabold uppercase tracking-[0.15em] text-[#256862]">
                    Patient portal
                  </p>

                  <h2 className="display-font text-3xl font-bold tracking-tight text-[#003435] sm:text-[2.6rem]">
                    Welcome back<span className="text-[#56A99D]">.</span>
                  </h2>

                  <p className="mt-3 text-base leading-6 text-[#65736F]">
                    Login to your Medicare account and pick up where you left off.
                  </p>

                </div>

                {/* Error Message */}

                {error && (
                  <div
                    role="alert"
                    className="mb-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3.5 text-base text-red-700"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 font-bold">
                      !
                    </span>

                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">

                  {/* Email */}

                  <div>
                    <label
                      htmlFor="login-email"
                      className="mb-2 block text-base font-extrabold uppercase tracking-[0.08em] text-[#344A45]"
                    >
                      Email address
                    </label>

                    <div className="login-field flex items-center rounded-2xl border border-[#CBDAD6] bg-[#F8FBF9] px-4">

                      <Mail size={18} className="shrink-0 text-[#6B8B83]" />

                      <input
                        id="login-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        autoComplete="email"
                        required
                        className="w-full bg-transparent px-3.5 py-4 text-base font-semibold text-[#0A1F1C] outline-none placeholder:font-medium placeholder:text-[#9AA9A4]"
                      />

                    </div>
                  </div>

                  {/* Password */}

                  <div>

                    <div className="mb-2 flex items-center justify-between">

                      <label
                        htmlFor="login-password"
                        className="block text-base font-extrabold uppercase tracking-[0.08em] text-[#344A45]"
                      >
                        Password
                      </label>

                    </div>

                    <div className="login-field flex items-center rounded-2xl border border-[#CBDAD6] bg-[#F8FBF9] px-4">

                      <LockKeyhole size={18} className="shrink-0 text-[#6B8B83]" />

                      <input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        required
                        className="w-full bg-transparent px-3.5 py-4 text-base font-semibold text-[#0A1F1C] outline-none placeholder:font-medium placeholder:text-[#9AA9A4]"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword((current) => !current)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        className="rounded-lg p-1.5 text-[#6B8B83] transition hover:bg-[#E7F4F1] hover:text-[#003435] focus:outline-none focus:ring-2 focus:ring-[#256862]/30"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>

                    </div>
                  </div>

                  {/* Login Button */}

                  <button
                    type="submit"
                    disabled={loading}
                    className="login-submit group flex w-full items-center justify-center gap-2 rounded-2xl bg-[#003435] px-5 py-4 text-base font-extrabold text-white shadow-[0_8px_18px_rgba(0,52,53,0.14)] disabled:cursor-not-allowed disabled:opacity-60"
                  >

                    {loading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />
                        Logging in...
                      </>
                    ) : (
                      <>
                        Login to your account

                        <ArrowRight
                          size={17}
                          className="transition-transform duration-200 group-hover:translate-x-1"
                        />
                      </>
                    )}

                  </button>

                </form>

                {/* Register Link */}

                <div className="my-7 flex items-center gap-3">
                  <div className="h-px flex-1 bg-[#E4ECE8]" />

                  <span className="text-base font-bold uppercase tracking-[0.1em] text-[#9AA9A4]">
                    New to Medicare?
                  </span>

                  <div className="h-px flex-1 bg-[#E4ECE8]" />
                </div>

                <p className="text-center text-base text-[#65736F]">
                  Don&apos;t have an account?{" "}

                  <Link
                    to="/register"
                    className="font-extrabold text-[#256862] underline decoration-[#ADEFE7] decoration-2 underline-offset-4 transition hover:text-[#003435]"
                  >
                    Create an account
                  </Link>
                </p>

                <div className="mt-8 flex items-center justify-center gap-2 text-base font-semibold text-[#8A9A94]">
                  <ShieldCheck size={16} className="text-[#4D9286]" />
                  Your patient account is protected
                </div>

              </div>
            </div>

          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
