
import { useEffect, useState, useRef } from "react";
import {
  UserRound,
  Mail,
  ShieldCheck,
  Save,
  LoaderCircle,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  LockKeyhole,
  ImagePlus,
  Link as LinkIcon,
} from "lucide-react";

import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../api";

// Reduced motion preference
const useReducedMotion = () => {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    setReducedMotion(mediaQuery.matches);

    const handleChange = (event) => setReducedMotion(event.matches);

    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return reducedMotion;
};

// Reveal elements when they enter the viewport
const useInView = () => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold: 0.12 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return [ref, isVisible];
};

const Reveal = ({
  children,
  className = "",
  delay = 0,
  direction = "up",
}) => {
  const reducedMotion = useReducedMotion();
  const [ref, isVisible] = useInView();

  const directions = {
    up: "translateY(28px)",
    down: "translateY(-28px)",
    left: "translateX(-28px)",
    right: "translateX(28px)",
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: reducedMotion || isVisible ? 1 : 0,
        transform:
          reducedMotion || isVisible
            ? "translate3d(0, 0, 0)"
            : directions[direction],
        transition: reducedMotion
          ? "none"
          : `opacity 700ms ease ${delay}ms, transform 700ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

// Subtle mouse-following card tilt
const Tilt = ({ children, className = "" }) => {
  const ref = useRef(null);
  const reducedMotion = useReducedMotion();

  const handleMouseMove = (event) => {
    if (reducedMotion || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const rotateX = ((y / rect.height) - 0.5) * -3;
    const rotateY = ((x / rect.width) - 0.5) * 3;

    ref.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
  };

  const handleMouseLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform = "";
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{
        transition: reducedMotion
          ? "none"
          : "transform 350ms ease, box-shadow 350ms ease",
        transformStyle: "preserve-3d",
      }}
    >
      {children}
    </div>
  );
};

const Profile = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("userToken");

        const response = await api.get("/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const profile = response.data.user;

        setUser(profile);
        setName(profile.name || "");
        setProfileImage(profile.profileImage || "");
      } catch (error) {
        console.error("Failed to fetch profile", error);

        setError(
          error.response?.data?.message ||
            "Unable to load profile."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const token = localStorage.getItem("userToken");

      const response = await api.patch(
        "/users/profile",
        {
          name: name.trim(),
          profileImage: profileImage.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(response.data.user);
      setName(response.data.user.name);
      setProfileImage(response.data.user.profileImage || "");

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      setMessage("Profile updated successfully.");
    } catch (error) {
      console.error("Failed to update profile", error);

      setError(
        error.response?.data?.message ||
          "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="medicare-profile-page min-h-screen overflow-hidden bg-[#F5F8F6] text-[#0a1f1c]">
      <Navbar />

      {/* PROFILE HEADER */}
      <section className="relative overflow-hidden">
        <div className="profile-header-glow-one pointer-events-none absolute -right-40 -top-40 h-[450px] w-[450px] rounded-full bg-[#ADEFE7]/30 blur-3xl" />

        <div className="profile-header-glow-two pointer-events-none absolute -bottom-40 -left-40 h-[350px] w-[350px] rounded-full bg-[#dcf3ee]/70 blur-3xl" />

        <div className="profile-header-orbit pointer-events-none absolute right-[15%] top-10 h-28 w-28 rounded-full border border-[#ADEFE7]/40" />

        <div className="relative mx-auto max-w-7xl px-6 pb-10 pt-12 md:pb-14 md:pt-16">
          <Link
            to="/"
            className="profile-back-link mb-8 inline-flex items-center gap-2 text-base font-semibold text-[#256862] transition-all hover:-translate-x-1 hover:text-[#003435]"
          >
            <ArrowLeft size={19} />
            Back to Home
          </Link>

          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <div className="profile-enter-left mb-5 inline-flex items-center gap-2 rounded-full border border-[#B9DDD5] bg-white/80 px-4 py-2.5 shadow-sm">
                <UserRound
                  size={18}
                  className="text-[#258B76]"
                />
                <span className="text-sm font-bold tracking-wide text-[#256862]">
                  YOUR MEDICARE ACCOUNT
                </span>
              </div>

              <h1 className="profile-enter-up font-['Bricolage_Grotesque'] text-4xl font-bold leading-tight text-[#003435] sm:text-5xl lg:text-[56px]">
                My Profile<span className="text-[#258B76]">.</span>
              </h1>

              <p className="profile-enter-up mt-4 max-w-xl text-base leading-7 text-[#52645F] [animation-delay:180ms] sm:text-lg">
                Manage your personal information and keep your
                Medicare account details up to date.
              </p>
            </div>

            <div className="profile-security-card flex items-center gap-3 rounded-2xl border border-[#C8DED6] bg-white/80 px-5 py-4 shadow-sm">
              <div className="profile-security-icon flex h-11 w-11 items-center justify-center rounded-xl bg-[#DDF3ED] text-[#256862]">
                <ShieldCheck size={23} />
              </div>

              <div>
                <p className="text-sm font-bold text-[#003435]">
                  Account Security
                </p>
                <p className="mt-1 text-sm text-[#65736F]">
                  Personal details management
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROFILE CONTENT */}
      <section className="relative mx-auto max-w-7xl px-6 pb-20">
        {loading ? (
          <div className="profile-loading-card flex min-h-[400px] flex-col items-center justify-center rounded-[32px] border border-[#D4E4DE] bg-white shadow-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E7F4F1] text-[#258B76]">
              <LoaderCircle size={32} className="animate-spin" />
            </div>

            <p className="mt-5 text-lg font-bold text-[#003435]">
              Loading your profile
            </p>

            <p className="mt-2 text-sm text-[#65736F]">
              Please wait while we retrieve your account details.
            </p>
          </div>
        ) : user ? (
          <div className="grid grid-cols-1 items-start gap-7 lg:grid-cols-3">

            {/* LEFT PROFILE CARD */}
            <Reveal direction="left">
              <Tilt>
                <div className="profile-card overflow-hidden rounded-[30px] border border-[#D4E4DE] bg-white shadow-[0_15px_45px_rgba(0,52,53,0.06)] lg:col-span-1">
                  <div className="profile-card-header relative overflow-hidden bg-[#003435] px-7 pb-10 pt-9 text-center">
                    <div className="profile-card-ring-one absolute -right-12 -top-16 h-48 w-48 rounded-full border-[25px] border-white/5" />

                    <div className="profile-card-ring-two absolute -bottom-24 -left-10 h-48 w-48 rounded-full border-[25px] border-white/5" />

                    <div className="profile-avatar relative mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-[30px] border-2 border-[#ADEFE7]/50 bg-[#ADEFE7] text-[#003435] shadow-lg">
                      {profileImage.trim() ? (
                        <img
                          src={profileImage.trim()}
                          alt="Profile"
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <UserRound size={50} strokeWidth={1.7} />
                      )}
                    </div>

                    <h2 className="relative mt-5 break-words font-['Bricolage_Grotesque'] text-2xl font-bold text-white">
                      {user.name}
                    </h2>

                    <p className="relative mt-2 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold capitalize text-[#ADEFE7]">
                      <span className="h-2 w-2 rounded-full bg-[#ADEFE7]" />
                      {user.role}
                    </p>
                  </div>

                  <div className="space-y-5 p-6 sm:p-7">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#8A9A94]">
                        ACCOUNT OVERVIEW
                      </p>
                    </div>

                    <div className="profile-detail-row flex items-start gap-4 rounded-2xl bg-[#F5F8F6] p-4">
                      <div className="profile-detail-icon flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#DDF3ED] text-[#256862]">
                        <Mail size={21} />
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-[#8A9A94]">
                          Email Address
                        </p>
                        <p className="mt-1 break-all text-sm font-semibold text-[#164B4D]">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <div className="profile-detail-row flex items-start gap-4 rounded-2xl bg-[#F5F8F6] p-4">
                      <div className="profile-detail-icon flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#DDF3ED] text-[#256862]">
                        <ShieldCheck size={21} />
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-[#8A9A94]">
                          Account Type
                        </p>
                        <p className="mt-1 text-sm font-bold capitalize text-[#164B4D]">
                          {user.role}
                        </p>
                      </div>
                    </div>

                    <div className="profile-security-note rounded-2xl border border-[#C8DED6] bg-[#E7F4F1] p-4">
                      <div className="flex items-center gap-2 text-[#256862]">
                        <LockKeyhole size={18} />
                        <p className="text-sm font-bold">
                          Your Account
                        </p>
                      </div>

                      <p className="mt-2 text-sm leading-6 text-[#52645F]">
                        Your account information is managed securely
                        through your Medicare profile.
                      </p>
                    </div>
                  </div>
                </div>
              </Tilt>
            </Reveal>

            {/* RIGHT EDIT PROFILE CARD */}
            <Reveal direction="right" delay={150} className="lg:col-span-2">
              <div className="profile-edit-card rounded-[30px] border border-[#D4E4DE] bg-white p-6 shadow-[0_15px_45px_rgba(0,52,53,0.06)] sm:p-9">
                <div className="mb-8 flex items-center gap-4 border-b border-[#E3ECE8] pb-7">
                  <div className="profile-edit-icon flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#E7F4F1] text-[#256862]">
                    <UserRound size={27} />
                  </div>

                  <div>
                    <h2 className="font-['Bricolage_Grotesque'] text-2xl font-bold text-[#003435] sm:text-3xl">
                      Personal Information
                    </h2>

                    <p className="mt-1 text-sm leading-6 text-[#65736F]">
                      Update your details and manage your account.
                    </p>
                  </div>
                </div>

                {/* SUCCESS MESSAGE */}
                {message && (
                  <div className="profile-message-enter mb-6 flex items-start gap-3 rounded-2xl border border-[#B8DED0] bg-[#E7F4F1] px-5 py-4 text-[#256862]">
                    <CheckCircle2 size={21} className="mt-0.5 shrink-0" />

                    <div>
                      <p className="text-sm font-bold">
                        Successfully Updated
                      </p>
                      <p className="mt-1 text-sm">{message}</p>
                    </div>
                  </div>
                )}

                {/* ERROR MESSAGE */}
                {error && (
                  <div className="profile-message-enter mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
                    <AlertCircle size={21} className="mt-0.5 shrink-0" />

                    <div>
                      <p className="text-sm font-bold">
                        Something went wrong
                      </p>
                      <p className="mt-1 text-sm">{error}</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-7">

                  {/* PROFILE IMAGE */}
                  <div className="profile-form-section">
                    <label className="mb-3 flex items-center gap-2 text-sm font-bold text-[#164B4D]">
                      <ImagePlus size={18} className="text-[#258B76]" />
                      Profile Image
                    </label>

                    <div className="profile-image-panel flex flex-col gap-5 rounded-2xl border border-[#D4E4DE] bg-[#F5F8F6] p-5 transition-all duration-300 hover:border-[#A7CFC2] sm:flex-row sm:items-center">
                      <div className="profile-image-preview flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#C8DED6] bg-[#DDF3ED] text-[#256862]">
                        {profileImage.trim() ? (
                          <img
                            src={profileImage.trim()}
                            alt="Profile preview"
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <UserRound size={42} />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#164B4D]">
                          <LinkIcon size={15} />
                          Image URL
                        </label>

                        <input
                          type="url"
                          value={profileImage}
                          onChange={(e) => {
                            setProfileImage(e.target.value);
                            setMessage("");
                            setError("");
                          }}
                          placeholder="https://example.com/profile-image.jpg"
                          className="profile-input w-full rounded-xl border border-[#CBDAD6] bg-white px-4 py-3 text-sm text-[#003435] outline-none transition-all placeholder:text-[#9AA9A3] hover:border-[#8EBFB2] focus:border-[#258B76] focus:ring-4 focus:ring-[#ADEFE7]/30"
                        />

                        <p className="mt-2 text-xs leading-5 text-[#87958F]">
                          Paste a publicly accessible image URL to set your
                          profile picture. Leave empty to use the default icon.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* FULL NAME */}
                  <div className="profile-form-section">
                    <label className="mb-3 flex items-center gap-2 text-sm font-bold text-[#164B4D]">
                      <UserRound size={17} className="text-[#258B76]" />
                      Full Name
                    </label>

                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="profile-input w-full rounded-2xl border border-[#CBDAD6] bg-[#FAFCFB] px-5 py-4 text-base text-[#003435] outline-none transition-all placeholder:text-[#9AA9A3] hover:border-[#8EBFB2] focus:border-[#258B76] focus:bg-white focus:ring-4 focus:ring-[#ADEFE7]/30"
                      required
                    />

                    <p className="mt-2 text-xs text-[#87958F]">
                      This is the name associated with your Medicare account.
                    </p>
                  </div>

                  {/* EMAIL */}
                  <div className="profile-form-section">
                    <label className="mb-3 flex items-center gap-2 text-sm font-bold text-[#164B4D]">
                      <Mail size={17} className="text-[#258B76]" />
                      Email Address
                    </label>

                    <div className="relative">
                      <input
                        type="email"
                        value={user.email}
                        disabled
                        className="w-full cursor-not-allowed rounded-2xl border border-[#DCE8E3] bg-[#F0F5F2] px-5 py-4 pr-12 text-base text-[#81918A]"
                      />

                      <LockKeyhole
                        size={18}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-[#91A59C]"
                      />
                    </div>

                    <p className="mt-2 flex items-center gap-1.5 text-xs text-[#87958F]">
                      <ShieldCheck size={14} />
                      Your registered email address cannot be changed.
                    </p>
                  </div>

                  {/* ACCOUNT TYPE */}
                  <div className="profile-form-section">
                    <label className="mb-3 flex items-center gap-2 text-sm font-bold text-[#164B4D]">
                      <ShieldCheck size={17} className="text-[#258B76]" />
                      Account Type
                    </label>

                    <div className="relative">
                      <input
                        type="text"
                        value={user.role}
                        disabled
                        className="w-full cursor-not-allowed rounded-2xl border border-[#DCE8E3] bg-[#F0F5F2] px-5 py-4 pr-12 text-base capitalize text-[#81918A]"
                      />

                      <LockKeyhole
                        size={18}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-[#91A59C]"
                      />
                    </div>

                    <p className="mt-2 text-xs text-[#87958F]">
                      Your account role is assigned by the platform.
                    </p>
                  </div>

                  {/* SUBMIT BUTTON */}
                  <div className="border-t border-[#E3ECE8] pt-7">
                    <button
                      type="submit"
                      disabled={saving}
                      className="profile-save-button group inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-[#003F40] px-8 py-4 text-base font-bold text-white shadow-[0_12px_25px_rgba(0,52,53,0.15)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#145B57] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:w-auto"
                    >
                      {saving ? (
                        <>
                          <LoaderCircle size={20} className="animate-spin" />
                          Saving Changes...
                        </>
                      ) : (
                        <>
                          <Save size={20} />
                          Save Changes

                          <Sparkles
                            size={17}
                            className="transition-transform group-hover:rotate-12 group-hover:scale-110"
                          />
                        </>
                      )}
                    </button>

                    <p className="mt-4 text-xs leading-6 text-[#87958F]">
                      Make sure your information is correct before saving
                      your profile changes.
                    </p>
                  </div>
                </form>
              </div>
            </Reveal>
          </div>
        ) : (
          <Reveal>
            <div className="flex min-h-[350px] flex-col items-center justify-center rounded-[30px] border border-[#D4E4DE] bg-white p-8 text-center shadow-sm">
              <div className="profile-error-icon flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                <AlertCircle size={32} />
              </div>

              <h2 className="mt-5 font-['Bricolage_Grotesque'] text-2xl font-bold text-[#003435]">
                Unable to Load Profile
              </h2>

              <p className="mt-2 max-w-md text-sm leading-7 text-[#65736F]">
                {error || "Unable to load profile."}
              </p>
            </div>
          </Reveal>
        )}
      </section>

      <Footer />

      {/* Animation Styles */}
      <style>{`
        @keyframes profileFadeUp {
          from {
            opacity: 0;
            transform: translateY(25px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes profileFadeLeft {
          from {
            opacity: 0;
            transform: translateX(-28px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes profileFloat {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-12px);
          }
        }

        @keyframes profileFloatReverse {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(10px);
          }
        }

        @keyframes profileSpin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes profileGlow {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 0.95;
          }
        }

        @keyframes profilePulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.08);
          }
        }

        .profile-enter-up {
          animation: profileFadeUp 800ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .profile-enter-left {
          animation: profileFadeLeft 800ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .profile-header-glow-one {
          animation: profileGlow 7s ease-in-out infinite;
        }

        .profile-header-glow-two {
          animation: profileGlow 8s ease-in-out infinite reverse;
        }

        .profile-header-orbit {
          animation: profileSpin 40s linear infinite;
        }

        .profile-security-card {
          animation: profileFadeUp 800ms ease-out 250ms both;
          transition: transform 350ms ease, box-shadow 350ms ease;
        }

        .profile-security-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 14px 30px rgba(0, 52, 53, 0.08);
        }

        .profile-security-icon {
          transition: transform 350ms ease;
        }

        .profile-security-card:hover .profile-security-icon {
          transform: rotate(-8deg) scale(1.08);
        }

        .profile-card-ring-one {
          animation: profileSpin 35s linear infinite;
        }

        .profile-card-ring-two {
          animation: profileSpin 45s linear infinite reverse;
        }

        .profile-avatar {
          animation: profileFloat 5s ease-in-out infinite;
          transition: box-shadow 350ms ease;
        }

        .profile-card:hover .profile-avatar {
          box-shadow: 0 15px 35px rgba(173, 239, 231, 0.2);
        }

        .profile-detail-row {
          transition: transform 300ms ease, background-color 300ms ease;
        }

        .profile-detail-row:hover {
          transform: translateX(5px);
          background-color: #EFF8F4;
        }

        .profile-detail-icon {
          transition: transform 300ms ease;
        }

        .profile-detail-row:hover .profile-detail-icon {
          transform: rotate(-7deg) scale(1.08);
        }

        .profile-edit-icon {
          transition: transform 350ms ease;
        }

        .profile-edit-card:hover .profile-edit-icon {
          transform: rotate(-7deg) scale(1.06);
        }

        .profile-image-preview {
          transition: transform 350ms ease, box-shadow 350ms ease;
        }

        .profile-image-panel:hover .profile-image-preview {
          transform: scale(1.04);
          box-shadow: 0 8px 20px rgba(0, 52, 53, 0.1);
        }

        .profile-input {
          transition: border-color 250ms ease, box-shadow 250ms ease, background-color 250ms ease;
        }

        .profile-message-enter {
          animation: profileFadeUp 450ms ease-out both;
        }

        .profile-save-button:active {
          transform: scale(0.98);
        }

        .profile-error-icon {
          animation: profilePulse 3s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .medicare-profile-page *,
          .medicare-profile-page *::before,
          .medicare-profile-page *::after {
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

export default Profile;
