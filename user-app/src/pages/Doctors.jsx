
import { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import api from "../api";

import {
  Stethoscope,
  GraduationCap,
  BriefcaseMedical,
  IndianRupee,
  ArrowRight,
  HeartPulse,
  ShieldCheck,
  Users,
  Search,
  LoaderCircle,
  Sparkles,
} from "lucide-react";

// Reduced motion preference
const useReducedMotion = () => {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    setReducedMotion(mediaQuery.matches);

    const handleChange = (event) => {
      setReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return reducedMotion;
};

// Scroll reveal hook
const useInView = (options = {}) => {
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
      {
        threshold: 0.12,
        ...options,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return [ref, isVisible];
};

// Reveal wrapper
const Reveal = ({
  children,
  delay = 0,
  className = "",
  direction = "up",
}) => {
  const [ref, isVisible] = useInView();
  const reducedMotion = useReducedMotion();

  const directions = {
    up: "translateY(35px)",
    down: "translateY(-25px)",
    left: "translateX(-35px)",
    right: "translateX(35px)",
    none: "scale(0.97)",
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: reducedMotion || isVisible ? 1 : 0,
        transform:
          reducedMotion || isVisible
            ? "translate3d(0, 0, 0) scale(1)"
            : directions[direction],
        transition: reducedMotion
          ? "none"
          : `opacity 700ms ease ${delay}ms, transform 700ms cubic-bezier(0.2, 0.7, 0.2, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

// Subtle mouse tilt effect
const Tilt = ({ children, className = "" }) => {
  const ref = useRef(null);
  const reducedMotion = useReducedMotion();

  const handleMouseMove = (event) => {
    if (reducedMotion || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -2.5;
    const rotateY = ((x - centerX) / centerX) * 2.5;

    ref.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
  };

  const handleMouseLeave = () => {
    if (!ref.current) return;

    ref.current.style.transform =
      "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)";
  };

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transition: "transform 350ms ease",
        transformStyle: "preserve-3d",
      }}
    >
      {children}
    </div>
  );
};

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await api.get("/doctors");

        setDoctors(response.data.doctors);
      } catch (error) {
        console.error("Failed to fetch doctors", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F8F6] doctors-page">
      <style>{`
        @keyframes doctorsFloat {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(0, -18px, 0);
          }
        }

        @keyframes doctorsFloatReverse {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(0, 16px, 0);
          }
        }

        @keyframes doctorsPulse {
          0%, 100% {
            opacity: 0.45;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.08);
          }
        }

        @keyframes doctorsSpin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes doctorsEntrance {
          from {
            opacity: 0;
            transform: translateY(22px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes doctorsImageReveal {
          from {
            transform: scale(1.08);
          }
          to {
            transform: scale(1);
          }
        }

        .doctors-float {
          animation: doctorsFloat 7s ease-in-out infinite;
        }

        .doctors-float-reverse {
          animation: doctorsFloatReverse 8s ease-in-out infinite;
        }

        .doctors-pulse {
          animation: doctorsPulse 5s ease-in-out infinite;
        }

        .doctors-spin {
          animation: doctorsSpin 24s linear infinite;
        }

        .doctor-card-image {
          animation: doctorsImageReveal 900ms ease-out both;
        }

        .doctor-card:hover .doctor-card-image {
          transform: scale(1.07);
        }

        .doctor-card:hover .doctor-icon {
          transform: rotate(-6deg) scale(1.08);
        }

        .doctor-icon {
          transition: transform 350ms ease;
        }

        .doctor-card:hover .doctor-arrow {
          transform: translateX(5px);
        }

        .doctor-arrow {
          transition: transform 300ms ease;
        }

        .doctor-card {
          will-change: transform;
        }

        .doctors-badge {
          transition: transform 300ms ease, box-shadow 300ms ease;
        }

        .doctors-badge:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 25px rgba(0, 52, 53, 0.08);
        }

        .doctors-banner-icon {
          animation: doctorsFloat 5s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .doctors-page *,
          .doctors-page *::before,
          .doctors-page *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <Navbar />

      <main className="relative overflow-hidden py-10 md:py-14">
        {/* Background Decorations */}
        <div className="absolute -top-24 -right-20 h-80 w-80 rounded-full bg-[#ADEFE7]/30 blur-3xl pointer-events-none doctors-float" />

        <div className="absolute top-96 -left-24 h-72 w-72 rounded-full bg-[#dcf3ee]/60 blur-3xl pointer-events-none doctors-float-reverse" />

        <div className="absolute top-[45%] right-[-70px] h-44 w-44 rounded-full border-[24px] border-[#ADEFE7]/10 pointer-events-none doctors-spin" />

        <div className="absolute bottom-40 left-[8%] h-20 w-20 rounded-full bg-[#ADEFE7]/20 blur-2xl pointer-events-none doctors-pulse" />

        <section className="relative max-w-6xl mx-auto px-4 sm:px-6">
          {/* Page Heading */}
          <div className="text-center mb-12">
            <Reveal direction="down">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#CBDAD6] bg-white px-4 py-2 text-base font-semibold text-[#256862] mb-5 shadow-sm doctors-badge">
                <HeartPulse size={19} />
                Medicare Healthcare
              </div>
            </Reveal>

            <Reveal delay={100}>
              <p className="text-base font-bold uppercase tracking-widest text-[#256862] mb-3">
                Our Specialists
              </p>
            </Reveal>

            <Reveal delay={180}>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#003435] tracking-tight font-bricolage">
                Find Your Doctor
              </h1>
            </Reveal>

            <Reveal delay={260}>
              <p className="mt-4 text-base sm:text-lg text-[#65736F] max-w-2xl mx-auto leading-relaxed">
                Connect with experienced healthcare professionals and
                find the right specialist for your healthcare needs.
              </p>
            </Reveal>

            <Reveal delay={350}>
              <div className="flex flex-wrap items-center justify-center gap-4 mt-7">
                <div className="doctors-badge flex items-center gap-2 bg-white border border-[#CBDAD6] rounded-xl px-4 py-3 shadow-sm">
                  <ShieldCheck
                    size={21}
                    className="text-[#256862]"
                  />
                  <span className="text-base font-medium text-[#164B4D]">
                    Trusted Healthcare
                  </span>
                </div>

                <div className="doctors-badge flex items-center gap-2 bg-white border border-[#CBDAD6] rounded-xl px-4 py-3 shadow-sm">
                  <Users
                    size={21}
                    className="text-[#256862]"
                  />
                  <span className="text-base font-medium text-[#164B4D]">
                    Experienced Specialists
                  </span>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Doctors Section Header */}
          <Reveal>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
              <div>
                <h2 className="text-2xl font-bold text-[#003435] font-bricolage">
                  Meet Our Doctors
                </h2>

                <p className="text-base text-[#65736F] mt-2">
                  Explore our healthcare specialists and their expertise.
                </p>
              </div>

              {!loading && doctors.length > 0 && (
                <div className="inline-flex items-center gap-2 bg-[#E7F4F1] border border-[#B8DED5] rounded-xl px-4 py-3 self-start sm:self-auto">
                  <Users
                    size={20}
                    className="text-[#256862]"
                  />

                  <span className="text-base font-semibold text-[#164B4D]">
                    {doctors.length} Doctors Available
                  </span>
                </div>
              )}
            </div>
          </Reveal>

          {/* Loading State */}
          {loading ? (
            <Reveal>
              <div className="bg-white border border-[#CBDAD6] rounded-3xl py-16 px-6 text-center shadow-sm">
                <div className="h-20 w-20 rounded-3xl bg-[#E7F4F1] flex items-center justify-center mx-auto mb-6">
                  <LoaderCircle
                    size={38}
                    className="text-[#256862] animate-spin"
                  />
                </div>

                <h3 className="text-xl font-bold text-[#003435]">
                  Loading Doctors
                </h3>

                <p className="text-base text-[#65736F] mt-3">
                  Please wait while we fetch our available specialists.
                </p>
              </div>
            </Reveal>
          ) : doctors.length === 0 ? (
            /* Empty State */
            <Reveal>
              <div className="bg-white border border-[#CBDAD6] rounded-3xl py-16 px-6 text-center shadow-sm">
                <div className="h-20 w-20 rounded-3xl bg-[#E7F4F1] flex items-center justify-center mx-auto mb-6">
                  <Search
                    size={36}
                    className="text-[#256862]"
                  />
                </div>

                <h3 className="text-2xl font-bold text-[#003435]">
                  No Doctors Available
                </h3>

                <p className="text-base text-[#65736F] mt-3 max-w-md mx-auto leading-relaxed">
                  There are currently no doctors available. Please check
                  back later.
                </p>
              </div>
            </Reveal>
          ) : (
            /* Doctors Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {doctors.map((doctor, index) => (
                <Reveal
                  key={doctor._id}
                  delay={Math.min(index * 100, 500)}
                  className="h-full"
                >
                  <Tilt className="h-full">
                    <Link
                      to={`/doctors/${doctor._id}`}
                      className="doctor-card group block h-full bg-white border border-[#CBDAD6] rounded-3xl overflow-hidden shadow-[0_6px_24px_rgba(0,52,53,0.04)] hover:shadow-[0_16px_40px_rgba(0,52,53,0.12)] transition-all duration-300"
                    >
                      {/* Card Top */}
                      <div className="relative h-[280px] bg-[#003435] overflow-hidden">
                        {doctor.profileImage ? (
                          <img
                            src={doctor.profileImage}
                            alt={doctor.user?.name || "Doctor"}
                            className="doctor-card-image w-full h-full object-cover object-center transition-transform duration-500"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-[#E7F4F1]">
                            <Stethoscope
                              size={75}
                              strokeWidth={1.4}
                              className="text-[#256862]"
                            />
                          </div>
                        )}

                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#003435] via-[#003435]/85 to-transparent px-6 pt-16 pb-6">
                          <div className="flex items-center gap-2 mb-3">
                            <ShieldCheck
                              size={17}
                              className="text-[#ADEFE7]"
                            />

                            <span className="text-sm font-medium text-white bg-white/10 border border-white/15 rounded-full px-3 py-1">
                              Specialist
                            </span>
                          </div>

                          <h3 className="text-xl font-bold text-white leading-snug">
                            {doctor.user?.name}
                          </h3>

                          <p className="text-base font-semibold text-[#ADEFE7] mt-2">
                            {doctor.specialization}
                          </p>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-6">
                        {/* Qualification */}
                        <div className="flex items-start gap-3 mb-5">
                          <div className="doctor-icon h-10 w-10 rounded-xl bg-[#E7F4F1] flex items-center justify-center shrink-0">
                            <GraduationCap
                              size={21}
                              className="text-[#256862]"
                            />
                          </div>

                          <div className="min-w-0">
                            <p className="text-base text-[#65736F]">
                              Qualification
                            </p>

                            <p className="text-base font-semibold text-[#003435] mt-1 break-words">
                              {doctor.qualification}
                            </p>
                          </div>
                        </div>

                        {/* Experience */}
                        <div className="flex items-start gap-3 mb-5">
                          <div className="doctor-icon h-10 w-10 rounded-xl bg-[#E7F4F1] flex items-center justify-center shrink-0">
                            <BriefcaseMedical
                              size={21}
                              className="text-[#256862]"
                            />
                          </div>

                          <div>
                            <p className="text-base text-[#65736F]">
                              Experience
                            </p>

                            <p className="text-base font-semibold text-[#003435] mt-1">
                              {doctor.experience} Years
                            </p>
                          </div>
                        </div>

                        {/* Consultation Fee */}
                        <div className="flex items-start gap-3">
                          <div className="doctor-icon h-10 w-10 rounded-xl bg-[#E7F4F1] flex items-center justify-center shrink-0">
                            <IndianRupee
                              size={21}
                              className="text-[#256862]"
                            />
                          </div>

                          <div>
                            <p className="text-base text-[#65736F]">
                              Consultation Fee
                            </p>

                            <p className="text-lg font-bold text-[#003435] mt-1">
                              ₹{doctor.consultationFee}
                            </p>
                          </div>
                        </div>

                        {/* View Profile */}
                        <div className="mt-7 pt-5 border-t border-[#E5EEEB]">
                          <div className="flex items-center justify-between text-[#256862] group-hover:text-[#003435] transition-colors">
                            <span className="text-base font-bold">
                              View Doctor Profile
                            </span>

                            <div className="h-10 w-10 rounded-xl bg-[#E7F4F1] group-hover:bg-[#ADEFE7] flex items-center justify-center transition-all duration-300">
                              <ArrowRight
                                size={21}
                                className="doctor-arrow"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </Tilt>
                </Reveal>
              ))}
            </div>
          )}

          {/* Bottom Information Banner */}
          {!loading && doctors.length > 0 && (
            <Reveal delay={150}>
              <div className="mt-10 bg-[#003435] rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-lg shadow-[#003435]/10">
                <div className="absolute -right-10 -top-16 h-48 w-48 rounded-full border-[30px] border-white/5 doctors-spin" />

                <div className="absolute -left-10 -bottom-20 h-40 w-40 rounded-full bg-[#ADEFE7]/10 blur-2xl doctors-pulse" />

                <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  <div className="doctors-banner-icon h-14 w-14 rounded-2xl bg-[#ADEFE7] flex items-center justify-center shrink-0">
                    <Sparkles
                      size={27}
                      className="text-[#003435]"
                    />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white font-bricolage">
                      The Right Care Starts Here
                    </h3>

                    <p className="text-base text-[#D2E8E3] mt-2 leading-relaxed">
                      Explore doctor profiles, learn about their expertise,
                      and choose the specialist who fits your healthcare needs.
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Doctors;
