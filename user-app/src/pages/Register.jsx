
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  UserRound,
  Mail,
  LockKeyhole,
  ShieldCheck,
  HeartPulse,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  AlertCircle,
  LoaderCircle,
  Stethoscope,
  CalendarCheck,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../api";

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await api.post("/auth/register", {
        name,
        email,
        password,
      });

      navigate("/login");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="medicare-register min-h-screen overflow-hidden bg-[#F5F8F6] text-[#0A1F1C]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@500;600;700;800&family=Manrope:wght@400;500;600;700;800&display=swap');

        .medicare-register {
          font-family: 'Manrope', sans-serif;
        }

        .medicare-register h1,
        .medicare-register h2,
        .medicare-register .display-font {
          font-family: 'Bricolage Grotesque', sans-serif;
        }

        .register-grid {
          background-image:
            linear-gradient(rgba(173,239,231,.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(173,239,231,.12) 1px, transparent 1px);
          background-size: 34px 34px;
        }

        @keyframes register-fade-up {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes register-float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes register-pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(173,239,231,.22);
          }
          50% {
            box-shadow: 0 0 0 12px rgba(173,239,231,0);
          }
        }

        .register-enter {
          animation: register-fade-up .7s cubic-bezier(.2,.8,.2,1) both;
        }

        .register-enter-delayed {
          animation: register-fade-up .8s .12s cubic-bezier(.2,.8,.2,1) both;
        }

        .register-float {
          animation: register-float 5s ease-in-out infinite;
        }

        .register-pulse {
          animation: register-pulse 2.8s ease-out infinite;
        }

        .register-field {
          transition:
            border-color .2s ease,
            box-shadow .2s ease,
            background .2s ease,
            transform .2s ease;
        }

        .register-field:focus-within {
          border-color: #256862;
          background: #fff;
          box-shadow: 0 0 0 4px rgba(37,104,98,.10);
        }

        .register-submit {
          transition:
            transform .2s ease,
            box-shadow .2s ease,
            background .2s ease;
        }

        .register-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(0,52,53,.2);
        }

        .register-submit:active:not(:disabled) {
          transform: translateY(0);
        }

        @media (prefers-reduced-motion: reduce) {
          .register-enter,
          .register-enter-delayed,
          .register-float,
          .register-pulse {
            animation: none !important;
          }

          .register-field,
          .register-submit {
            transition: none !important;
          }
        }
      `}</style>

      <Navbar />

      <main className="relative mx-auto flex w-full max-w-7xl items-center px-4 py-10 sm:px-6 md:min-h-[calc(100vh-150px)] md:py-14 lg:px-8">
        <div className="pointer-events-none absolute -left-28 top-10 h-72 w-72 rounded-full bg-[#ADEFE7]/40 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-[#D7ECE6]/70 blur-3xl" />

        <div className="relative grid w-full overflow-hidden rounded-[2rem] border border-[#CBDAD6] bg-white shadow-[0_24px_80px_rgba(0,52,53,0.09)] lg:min-h-[680px] lg:grid-cols-[1.02fr_.98fr]">

          {/* BRAND PANEL */}
          <section className="register-grid relative hidden flex-col justify-between overflow-hidden bg-[#003435] p-10 text-white lg:flex xl:p-14">
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
                <Sparkles size={18} />
                YOUR HEALTH JOURNEY STARTS HERE
              </div>

              <h1 className="display-font text-4xl font-bold leading-[1.08] tracking-tight xl:text-5xl">
                Take the first step
                <br />
                towards{" "}
                <span className="text-[#ADEFE7]">better care.</span>
              </h1>

              <p className="mt-6 max-w-md text-base leading-7 text-white/70">
                Create your Medicare account and make your healthcare
                experience more convenient. Discover trusted doctors,
                manage appointments and stay connected with your care journey.
              </p>

              {/* BENEFITS */}
              <div className="mt-10 space-y-5">
                {[
                  {
                    icon: Stethoscope,
                    title: "Discover Trusted Doctors",
                    description:
                      "Explore healthcare professionals and their specializations.",
                  },
                  {
                    icon: CalendarCheck,
                    title: "Manage Appointments",
                    description:
                      "Make your healthcare scheduling more convenient.",
                  },
                  {
                    icon: ShieldCheck,
                    title: "Your Account, Your Journey",
                    description:
                      "Keep your personal healthcare experience organized.",
                  },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="flex items-center gap-4"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.09] text-[#ADEFE7]">
                        <Icon size={23} />
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-white">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-base leading-6 text-white/55">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* TRUST CARD */}
              <div className="register-float relative mt-10 max-w-sm rounded-3xl border border-white/15 bg-white/[0.08] p-5 shadow-2xl backdrop-blur-md">
                <div className="flex items-center gap-4">
                  <div className="register-pulse flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ADEFE7] text-[#003435]">
                    <ShieldCheck size={24} />
                  </div>

                  <div>
                    <p className="text-base font-bold text-white">
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
                    Join Medicare
                  </span>
                </div>
              </div>
            </div>

            <p className="relative z-10 text-base text-white/40">
              Thoughtful care. Better connected.
            </p>
          </section>

          {/* REGISTER FORM */}
          <section className="register-enter flex items-center justify-center px-5 py-10 sm:px-10 sm:py-14 lg:px-12 xl:px-16">
            <div className="w-full max-w-md">

              {/* MOBILE BRAND */}
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

              <div className="register-enter-delayed">
                {/* HEADER */}
                <div className="mb-7">
                  <p className="mb-3 text-base font-extrabold uppercase tracking-[0.15em] text-[#256862]">
                    Patient registration
                  </p>

                  <h2 className="display-font text-3xl font-bold tracking-tight text-[#003435] sm:text-[2.6rem]">
                    Create your account
                    <span className="text-[#56A99D]">.</span>
                  </h2>

                  <p className="mt-3 text-base leading-6 text-[#65736F]">
                    Join Medicare and take control of your healthcare
                    journey in one convenient place.
                  </p>
                </div>

                {/* ERROR MESSAGE */}
                {error && (
                  <div
                    role="alert"
                    className="mb-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3.5 text-base text-red-700"
                  >
                    <AlertCircle size={21} className="mt-0.5 shrink-0" />
                    <div>
                      <p className="font-bold">Registration Failed</p>
                      <p className="mt-1">{error}</p>
                    </div>
                  </div>
                )}

                {/* FORM */}
                <form onSubmit={handleRegister} className="space-y-5">

                  {/* FULL NAME */}
                  <div>
                    <label
                      htmlFor="register-name"
                      className="mb-2 block text-base font-extrabold uppercase tracking-[0.08em] text-[#344A45]"
                    >
                      Full name
                    </label>

                    <div className="register-field flex items-center rounded-2xl border border-[#CBDAD6] bg-[#F8FBF9] px-4">
                      <UserRound
                        size={19}
                        className="shrink-0 text-[#6B8B83]"
                      />

                      <input
                        id="register-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your full name"
                        autoComplete="name"
                        required
                        className="w-full bg-transparent px-3.5 py-4 text-base font-semibold text-[#0A1F1C] outline-none placeholder:font-medium placeholder:text-[#9AA9A4]"
                      />
                    </div>
                  </div>

                  {/* EMAIL */}
                  <div>
                    <label
                      htmlFor="register-email"
                      className="mb-2 block text-base font-extrabold uppercase tracking-[0.08em] text-[#344A45]"
                    >
                      Email address
                    </label>

                    <div className="register-field flex items-center rounded-2xl border border-[#CBDAD6] bg-[#F8FBF9] px-4">
                      <Mail
                        size={19}
                        className="shrink-0 text-[#6B8B83]"
                      />

                      <input
                        id="register-email"
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

                  {/* PASSWORD */}
                  <div>
                    <label
                      htmlFor="register-password"
                      className="mb-2 block text-base font-extrabold uppercase tracking-[0.08em] text-[#344A45]"
                    >
                      Password
                    </label>

                    <div className="register-field flex items-center rounded-2xl border border-[#CBDAD6] bg-[#F8FBF9] px-4">
                      <LockKeyhole
                        size={19}
                        className="shrink-0 text-[#6B8B83]"
                      />

                      <input
                        id="register-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create a password"
                        minLength={6}
                        autoComplete="new-password"
                        required
                        className="w-full bg-transparent px-3.5 py-4 text-base font-semibold text-[#0A1F1C] outline-none placeholder:font-medium placeholder:text-[#9AA9A4]"
                      />
                    </div>

                    <p className="mt-3 flex items-center gap-2 text-base text-[#65736F]">
                      <ShieldCheck size={18} className="shrink-0 text-[#4D9286]" />
                      Password must contain at least 6 characters.
                    </p>
                  </div>

                  {/* CREATE ACCOUNT BUTTON */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="register-submit group flex w-full items-center justify-center gap-2 rounded-2xl bg-[#003435] px-5 py-4 text-base font-extrabold text-white shadow-[0_8px_18px_rgba(0,52,53,0.14)] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <LoaderCircle size={20} className="animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Create your account
                        <ArrowUpRight
                          size={20}
                          className="transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1"
                        />
                      </>
                    )}
                  </button>
                </form>

                {/* LOGIN LINK */}
                <div className="my-7 flex items-center gap-3">
                  <div className="h-px flex-1 bg-[#E4ECE8]" />

                  <span className="text-base font-bold uppercase tracking-[0.1em] text-[#9AA9A4]">
                    Already registered?
                  </span>

                  <div className="h-px flex-1 bg-[#E4ECE8]" />
                </div>

                <p className="text-center text-base text-[#65736F]">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-extrabold text-[#256862] underline decoration-[#ADEFE7] decoration-2 underline-offset-4 transition hover:text-[#003435]"
                  >
                    Login to your account
                  </Link>
                </p>

                {/* SECURITY NOTE */}
                <div className="mt-8 flex items-center justify-center gap-2 text-base font-semibold text-[#8A9A94]">
                  <ShieldCheck size={18} className="text-[#4D9286]" />
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

export default Register;
