
import { Link } from "react-router-dom";
import {
  Home,
  ArrowLeft,
  HeartPulse,
  Search,
  Compass,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const NotFound = () => {
  return (
    <div className="not-found-page flex min-h-screen flex-col overflow-hidden bg-[#F5F8F6]">
      <Navbar />

      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-6 py-20">

        {/* Background Decorations */}
        <div className="not-found-glow-one pointer-events-none absolute -left-20 top-10 h-64 w-64 rounded-full bg-[#ADEFE7]/30 blur-3xl" />

        <div className="not-found-glow-two pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-[#256862]/10 blur-3xl" />

        <div className="not-found-orbit-one pointer-events-none absolute left-[12%] top-[18%] h-20 w-20 rounded-full border border-[#ADEFE7]/50" />

        <div className="not-found-orbit-two pointer-events-none absolute bottom-[15%] right-[12%] h-28 w-28 rounded-full border border-[#256862]/10" />

        <div className="relative mx-auto w-full max-w-3xl text-center">

          {/* Error Illustration */}
          <div className="not-found-illustration relative mx-auto mb-10 flex h-56 w-64 items-center justify-center">

            {/* Main background circle */}
            <div className="not-found-main-circle absolute inset-4 rounded-full border border-[#CBDAD6] bg-[#E7F4F1]" />

            {/* Search decoration */}
            <div className="not-found-search absolute right-5 top-2 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#CBDAD6] bg-white text-[#256862] shadow-lg">
              <Search size={25} />
            </div>

            {/* Compass decoration */}
            <div className="not-found-compass absolute bottom-5 left-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#CBDAD6] bg-white text-[#256862] shadow-lg">
              <Compass size={25} />
            </div>

            {/* Main 404 card */}
            <div className="not-found-error-card relative z-10 flex h-44 w-44 rotate-[-5deg] flex-col items-center justify-center rounded-[2.5rem] bg-[#003435] shadow-2xl shadow-[#003435]/20 transition-all duration-500 hover:rotate-0 hover:scale-105">
              <HeartPulse
                size={43}
                className="mb-2 text-[#ADEFE7]"
                strokeWidth={1.8}
              />

              <span className="text-6xl font-extrabold tracking-tight text-white">
                404
              </span>

              <div className="mt-3 h-1 w-16 rounded-full bg-[#ADEFE7]" />
            </div>

            {/* Floating dots */}
            <div className="not-found-dot-one absolute left-2 top-8 h-3 w-3 rounded-full bg-[#256862]" />

            <div className="not-found-dot-two absolute bottom-8 right-4 h-4 w-4 rounded-full bg-[#ADEFE7]" />

            <div className="not-found-dot-three absolute right-10 top-16 h-2 w-2 rounded-full bg-[#258B76]" />
          </div>

          {/* Error Message */}
          <div className="space-y-5">

            <div className="not-found-enter-up inline-flex items-center gap-2 rounded-full border border-[#CBDAD6] bg-[#E7F4F1] px-5 py-2">
              <span className="not-found-status-dot h-2.5 w-2.5 rounded-full bg-[#256862]" />

              <span className="text-base font-semibold text-[#256862]">
                Oops! Something went wrong
              </span>
            </div>

            <h1 className="not-found-enter-up font-['Bricolage_Grotesque'] text-4xl font-extrabold tracking-tight text-[#003435] [animation-delay:120ms] sm:text-5xl md:text-6xl">
              Page Not Found
            </h1>

            <p className="not-found-enter-up mx-auto max-w-xl text-base leading-relaxed text-[#65736F] [animation-delay:240ms] sm:text-lg">
              Sorry, the page you're looking for doesn't exist or may have
              been moved. Let's get you back on track to better healthcare.
            </p>
          </div>

          {/* Action Card */}
          <div className="not-found-action-card mx-auto mt-10 max-w-md rounded-3xl border border-[#CBDAD6] bg-white p-7 shadow-[0_12px_40px_rgba(0,52,53,0.07)]">

            <div className="not-found-home-icon mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E7F4F1]">
              <Home size={27} className="text-[#256862]" />
            </div>

            <h2 className="font-['Bricolage_Grotesque'] text-xl font-bold text-[#003435]">
              Let's get you home
            </h2>

            <p className="mt-2 text-base leading-relaxed text-[#65736F]">
              Your health journey is just one click away. Visit our homepage
              to explore Medicare.
            </p>

            <Link
              to="/"
              className="group mt-7 inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-[#003435] px-6 py-4 text-base font-bold text-white shadow-lg shadow-[#003435]/15 transition-all duration-300 hover:-translate-y-1 hover:bg-[#164B4D] hover:shadow-xl active:scale-[0.98]"
            >
              <Home size={20} />

              Back to Home

              <ArrowLeft
                size={19}
                className="rotate-180 transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>

          <p className="not-found-enter-up mt-8 text-base text-[#65736F] [animation-delay:400ms]">
            Need help? We're here to make your healthcare experience easier.
          </p>
        </div>
      </main>

      <Footer />

      {/* Animation Styles */}
      <style>{`
        @keyframes notFoundFadeUp {
          from {
            opacity: 0;
            transform: translateY(25px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes notFoundFloat {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-12px);
          }
        }

        @keyframes notFoundFloatReverse {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(10px);
          }
        }

        @keyframes notFoundSpin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes notFoundPulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.55;
            transform: scale(1.25);
          }
        }

        @keyframes notFoundGlow {
          0%, 100% {
            opacity: 0.55;
          }
          50% {
            opacity: 1;
          }
        }

        .not-found-enter-up {
          animation: notFoundFadeUp 800ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .not-found-illustration {
          animation: notFoundFadeUp 900ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .not-found-main-circle {
          animation: notFoundPulse 5s ease-in-out infinite;
        }

        .not-found-error-card {
          animation: notFoundFloat 6s ease-in-out infinite;
        }

        .not-found-search {
          animation: notFoundFloatReverse 5s ease-in-out infinite;
        }

        .not-found-compass {
          animation: notFoundFloat 5.5s ease-in-out infinite;
        }

        .not-found-dot-one {
          animation: notFoundFloat 4s ease-in-out infinite;
        }

        .not-found-dot-two {
          animation: notFoundFloatReverse 4.5s ease-in-out infinite;
        }

        .not-found-dot-three {
          animation: notFoundPulse 3s ease-in-out infinite;
        }

        .not-found-glow-one {
          animation: notFoundGlow 7s ease-in-out infinite;
        }

        .not-found-glow-two {
          animation: notFoundGlow 8s ease-in-out infinite;
        }

        .not-found-orbit-one {
          animation: notFoundSpin 35s linear infinite;
        }

        .not-found-orbit-two {
          animation: notFoundSpin 45s linear infinite reverse;
        }

        .not-found-status-dot {
          animation: notFoundPulse 2s ease-in-out infinite;
        }

        .not-found-action-card {
          animation: notFoundFadeUp 900ms cubic-bezier(0.22, 1, 0.36, 1) 300ms both;
          transition: transform 350ms ease, box-shadow 350ms ease;
        }

        .not-found-action-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 45px rgba(0, 52, 53, 0.11);
        }

        .not-found-home-icon {
          transition: transform 350ms ease;
        }

        .not-found-action-card:hover .not-found-home-icon {
          transform: rotate(-8deg) scale(1.08);
        }

        @media (prefers-reduced-motion: reduce) {
          .not-found-page *,
          .not-found-page *::before,
          .not-found-page *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>
    </div>
  );
};

export default NotFound;
