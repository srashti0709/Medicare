
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  HeartPulse,
  Menu,
  X,
  LogOut,
  UserRound,
  ChevronDown,
} from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();

  const [user] = useState(() => {
    return JSON.parse(localStorage.getItem("user") || "null");
  });

  const [menuOpen, setMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(user);

  const handleLogout = () => {
    const confirmed = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmed) {
      return;
    }

    localStorage.removeItem("userToken");
    localStorage.removeItem("user");

    setCurrentUser(null);
    navigate("/login");
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const navLinkClass =
    "relative text-base font-semibold text-[#52645F] hover:text-[#003F40] transition-colors duration-300 py-2 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#258B76] hover:after:w-full after:transition-all after:duration-300";

  const mobileLinkClass =
    "block w-full px-4 py-3.5 rounded-xl text-base font-semibold text-[#164B4D] hover:bg-[#E7F4F1] transition-colors duration-200";

  return (
    <nav className="sticky top-0 z-50 bg-[#F5F8F6]/95 backdrop-blur-xl border-b border-[#D4E4DE]">
      <div className="max-w-7xl mx-auto px-6">

        {/* Main Navbar */}
        <div className="h-[88px] flex items-center justify-between">

          {/* Brand */}
          <Link
            to="/"
            onClick={closeMenu}
            className="flex items-center gap-3 shrink-0 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#003F40] flex items-center justify-center text-[#ADEFE7] shadow-[0_5px_15px_rgba(0,52,53,0.12)] group-hover:bg-[#145B57] transition-colors duration-300">
              <HeartPulse size={27} strokeWidth={2.1} />
            </div>

            <div>
              <h1 className="text-[27px] leading-tight font-bold font-['Bricolage_Grotesque'] text-[#003435] tracking-tight">
                Medicare
              </h1>
              <p className="text-base text-[#65736F] mt-0.5">
                Healthcare made simple
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-9">
            <Link to="/" className={navLinkClass}>
              Home
            </Link>

            <Link to="/doctors" className={navLinkClass}>
              Doctors
            </Link>

            <Link to="/services" className={navLinkClass}>
              Services
            </Link>

            {currentUser && (
              <Link
                to="/my-appointments"
                className={navLinkClass}
              >
                My Appointments
              </Link>
            )}

            {currentUser && (
              <Link
                to="/health-timeline"
                className={navLinkClass}
              >
                Health Timeline
              </Link>
            )}

            {currentUser && (
              <Link
                to="/report-comparison"
                className={navLinkClass}
              >
                Report Comparison
              </Link>
            )}
          </div>

          {/* Desktop User Actions */}
          <div className="hidden lg:flex items-center gap-5">

            {currentUser ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#E7F4F1] transition-colors duration-300"
                >
                  <div className="w-10 h-10 rounded-full bg-[#DDF3ED] flex items-center justify-center text-[#164B4D]">
                    <UserRound size={20} />
                  </div>

                  <div className="max-w-[125px]">
                    <p className="text-base font-semibold text-[#003435] truncate">
                      {currentUser.name}
                    </p>
                    <p className="text-base text-[#65736F]">
                      My Profile
                    </p>
                  </div>

                  <ChevronDown
                    size={16}
                    className="text-[#65736F]"
                  />
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-semibold text-[#C34E43] border border-[#F0D5D0] hover:bg-[#FFF1EF] transition-colors duration-300"
                >
                  <LogOut size={17} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-base font-semibold text-[#164B4D] hover:text-[#258B76] transition-colors duration-300"
                >
                  Login
                </Link>

                <Link
                  to="/doctors"
                  className="inline-flex items-center justify-center bg-[#003F40] hover:bg-[#145B57] text-white px-7 py-3.5 rounded-xl text-base font-semibold shadow-[0_5px_15px_rgba(0,52,53,0.12)] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                >
                  Find a Doctor
                </Link>
              </>
            )}
          </div>

          {/* Tablet / Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden w-12 h-12 rounded-xl bg-white border border-[#D4E4DE] flex items-center justify-center text-[#003F40] hover:bg-[#E7F4F1] transition-colors duration-300"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile and Tablet Navigation */}
        {menuOpen && (
          <div className="lg:hidden pb-6 pt-4 border-t border-[#D4E4DE]">
            <div className="bg-white border border-[#D4E4DE] rounded-2xl p-3 shadow-[0_10px_30px_rgba(0,52,53,0.05)]">

              <Link
                to="/"
                onClick={closeMenu}
                className={mobileLinkClass}
              >
                Home
              </Link>

              <Link
                to="/doctors"
                onClick={closeMenu}
                className={mobileLinkClass}
              >
                Doctors
              </Link>

              <Link
                to="/services"
                onClick={closeMenu}
                className={mobileLinkClass}
              >
                Services
              </Link>

              {currentUser && (
                <Link
                  to="/my-appointments"
                  onClick={closeMenu}
                  className={mobileLinkClass}
                >
                  My Appointments
                </Link>
              )}

              {currentUser && (
                <Link
                  to="/health-timeline"
                  onClick={closeMenu}
                  className={mobileLinkClass}
                >
                  Health Timeline
                </Link>
              )}

              {currentUser && (
                <Link
                  to="/report-comparison"
                  onClick={closeMenu}
                  className={mobileLinkClass}
                >
                  Report Comparison
                </Link>
              )}

              {currentUser && (
                <Link
                  to="/profile"
                  onClick={closeMenu}
                  className={mobileLinkClass}
                >
                  My Profile
                </Link>
              )}

              <div className="border-t border-[#E5EEEA] mt-3 pt-4">

                {currentUser ? (
                  <div className="space-y-4">

                    <div className="flex items-center gap-3 px-4">
                      <div className="w-11 h-11 rounded-full bg-[#E7F4F1] flex items-center justify-center text-[#164B4D]">
                        <UserRound size={21} />
                      </div>

                      <div className="min-w-0">
                        <p className="text-base text-[#65736F]">
                          Welcome back
                        </p>
                        <p className="text-base font-bold text-[#003435] truncate">
                          {currentUser.name}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        closeMenu();
                        handleLogout();
                      }}
                      className="w-full flex items-center justify-center gap-2 bg-[#FFF1EF] hover:bg-[#FDE2DE] text-[#C34E43] border border-[#F5D4CF] px-5 py-3.5 rounded-xl text-base font-semibold transition-colors duration-300"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Link
                      to="/login"
                      onClick={closeMenu}
                      className="w-full text-center border border-[#B9DDD5] text-[#164B4D] hover:bg-[#E7F4F1] px-5 py-3.5 rounded-xl text-base font-semibold transition-colors duration-300"
                    >
                      Login
                    </Link>

                    <Link
                      to="/doctors"
                      onClick={closeMenu}
                      className="w-full text-center bg-[#003F40] hover:bg-[#145B57] text-white px-5 py-3.5 rounded-xl text-base font-semibold transition-colors duration-300"
                    >
                      Find a Doctor
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
