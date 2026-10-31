
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  HeartPulse,
  ShieldCheck,
  Stethoscope,
  Activity,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative bg-[#003435] text-white mt-20 overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#164B4D] rounded-full blur-[100px] opacity-40 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#256862] rounded-full blur-[110px] opacity-20 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">

          {/* Brand Section */}
          <div>
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="w-12 h-12 bg-[#ADEFE7] rounded-2xl flex items-center justify-center text-[#003435] shadow-lg shadow-black/10 group-hover:scale-105 transition-transform duration-300">
                <HeartPulse size={27} strokeWidth={2.2} />
              </div>

              <div>
                <h2 className="text-2xl font-bold font-['Bricolage_Grotesque'] tracking-tight">
                  Medicare
                </h2>
                <p className="text-base text-[#ADEFE7]">
                  Healthcare made simpler
                </p>
              </div>
            </Link>

            <p className="text-base text-[#C3D8D2] mt-6 leading-relaxed max-w-sm">
              Quality healthcare made simple. Find trusted doctors,
              explore services, and manage your appointments easily.
            </p>

            <div className="flex items-center gap-3 mt-7">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-[#ADEFE7]">
                <ShieldCheck size={20} />
              </div>
              <p className="text-base text-[#C3D8D2]">
                Your health, our priority.
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold font-['Bricolage_Grotesque'] mb-6">
              Quick Links
            </h3>

            <div className="w-10 h-1 bg-[#ADEFE7] rounded-full mb-6" />

            <div className="flex flex-col gap-4">
              {[
                { name: "Home", path: "/" },
                { name: "Doctors", path: "/doctors" },
                { name: "Services", path: "/services" },
                { name: "Login", path: "/login" },
              ].map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="group flex items-center justify-between max-w-[220px] text-base text-[#C3D8D2] hover:text-[#ADEFE7] transition-colors duration-300"
                >
                  {item.name}
                  <ArrowUpRight
                    size={17}
                    className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                  />
                </Link>
              ))}
            </div>
          </div>

          {/* About Medicare */}
          <div>
            <h3 className="text-xl font-bold font-['Bricolage_Grotesque'] mb-6">
              Medicare
            </h3>

            <div className="w-10 h-1 bg-[#ADEFE7] rounded-full mb-6" />

            <p className="text-base text-[#C3D8D2] leading-relaxed">
              Your trusted healthcare companion for convenient
              doctor discovery and appointment management.
            </p>

            <div className="grid grid-cols-2 gap-3 mt-7">
              <div className="bg-white/[0.07] border border-white/10 rounded-2xl p-4">
                <Stethoscope
                  size={23}
                  className="text-[#ADEFE7] mb-3"
                />
                <p className="text-base font-semibold text-white">
                  Expert Care
                </p>
              </div>

              <div className="bg-white/[0.07] border border-white/10 rounded-2xl p-4">
                <Activity
                  size={23}
                  className="text-[#ADEFE7] mb-3"
                />
                <p className="text-base font-semibold text-white">
                  Easy Access
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-white/15 mt-14 pt-7 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-base text-[#A9C1BA] text-center sm:text-left">
            © 2026 Medicare. All rights reserved.
          </p>

          <Link
            to="/"
            className="inline-flex items-center gap-2 text-base font-semibold text-[#ADEFE7] hover:text-white transition-colors duration-300"
          >
            Back to Home
            <ArrowUpRight size={17} />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
