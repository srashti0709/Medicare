
import { Link } from "react-router-dom";
import { Home, ArrowLeft, HeartPulse, Search, Compass } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#F5F8F6] flex flex-col overflow-hidden">
      <Navbar />

      <main className="relative flex-1 flex items-center justify-center px-6 py-20">
        {/* Background Decorations */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-[#ADEFE7]/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-[#256862]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative w-full max-w-3xl mx-auto text-center animate-[fadeUp_0.7s_ease-out_both]">

          {/* Error Illustration */}
          <div className="relative mx-auto mb-10 w-64 h-56 flex items-center justify-center">
            <div className="absolute inset-4 rounded-full bg-[#E7F4F1] border border-[#CBDAD6] animate-pulse" />

            <div className="absolute top-2 right-5 w-12 h-12 rounded-2xl bg-white shadow-lg border border-[#CBDAD6] flex items-center justify-center rotate-12">
              <Search size={25} className="text-[#256862]" />
            </div>

            <div className="absolute bottom-5 left-3 w-12 h-12 rounded-2xl bg-white shadow-lg border border-[#CBDAD6] flex items-center justify-center -rotate-12">
              <Compass size={25} className="text-[#256862]" />
            </div>

            <div className="relative z-10 w-44 h-44 rounded-[2.5rem] bg-[#003435] shadow-2xl shadow-[#003435]/20 flex flex-col items-center justify-center rotate-[-5deg] hover:rotate-0 transition-transform duration-500">
              <HeartPulse size={43} className="text-[#ADEFE7] mb-2" strokeWidth={1.8} />
              <span className="text-6xl font-extrabold text-white tracking-tight">
                404
              </span>
              <div className="w-16 h-1 rounded-full bg-[#ADEFE7] mt-3" />
            </div>

            <div className="absolute top-8 left-2 w-3 h-3 rounded-full bg-[#256862]" />
            <div className="absolute bottom-8 right-4 w-4 h-4 rounded-full bg-[#ADEFE7]" />
          </div>

          {/* Error Message */}
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#E7F4F1] border border-[#CBDAD6]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#256862] animate-pulse" />
              <span className="text-base font-semibold text-[#256862]">
                Oops! Something went wrong
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#003435] tracking-tight">
              Page Not Found
            </h1>

            <p className="text-base sm:text-lg text-[#65736F] max-w-xl mx-auto leading-relaxed">
              Sorry, the page you're looking for doesn't exist or may have
              been moved. Let's get you back on track to better healthcare.
            </p>
          </div>

          {/* Action Card */}
          <div className="mt-10 max-w-md mx-auto bg-white border border-[#CBDAD6] rounded-3xl p-7 shadow-[0_12px_40px_rgba(0,52,53,0.07)]">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#E7F4F1] flex items-center justify-center mb-5">
              <Home size={27} className="text-[#256862]" />
            </div>

            <h2 className="text-xl font-bold text-[#003435]">
              Let's get you home
            </h2>

            <p className="text-base text-[#65736F] mt-2 leading-relaxed">
              Your health journey is just one click away. Visit our homepage
              to explore Medicare.
            </p>

            <Link
              to="/"
              className="group inline-flex items-center justify-center gap-3 w-full mt-7 px-6 py-4 rounded-2xl bg-[#003435] hover:bg-[#164B4D] text-white font-bold text-base shadow-lg shadow-[#003435]/15 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <Home size={20} />
              Back to Home
              <ArrowLeft
                size={19}
                className="rotate-180 transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>

          <p className="mt-8 text-base text-[#65736F]">
            Need help? We're here to make your healthcare experience easier.
          </p>
        </div>
      </main>

      <Footer />

      <style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
};

export default NotFound;
