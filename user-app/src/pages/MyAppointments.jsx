
import { useEffect, useState, useRef } from "react";
import {
  CalendarDays,
  Clock3,
  Stethoscope,
  UserRound,
  CalendarCheck,
  CalendarX,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  HeartPulse,
  ShieldCheck,
  XCircle,
  ClipboardList,
  Ban,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../api";

// Detect reduced-motion preference
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

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reducedMotion = useReducedMotion();

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("userToken");

      const response = await api.get("/appointments/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAppointments(response.data.appointments);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to fetch appointments."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const cancelAppointment = async (appointmentId) => {
    try {
      const token = localStorage.getItem("userToken");

      await api.patch(
        `/appointments/${appointmentId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchAppointments();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to cancel appointment."
      );
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "confirmed":
        return {
          badge: "bg-[#E0F5EC] text-[#16734D] border-[#B8E7D0]",
          icon: CheckCircle2,
          label: "Confirmed",
        };

      case "completed":
        return {
          badge: "bg-[#E5EFFD] text-[#285FA6] border-[#C5D9F5]",
          icon: CalendarCheck,
          label: "Completed",
        };

      case "cancelled":
        return {
          badge: "bg-[#FDEAEA] text-[#B43D3D] border-[#F4CACA]",
          icon: XCircle,
          label: "Cancelled",
        };

      default:
        return {
          badge: "bg-[#FFF4D9] text-[#94630C] border-[#F1DCA6]",
          icon: Clock3,
          label: status || "Pending",
        };
    }
  };

  const getAppointmentCount = (status) =>
    appointments.filter(
      (appointment) => appointment.status === status
    ).length;

  const formatAppointmentDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatAppointmentTime = (date) => {
    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="my-appointments-page min-h-screen overflow-hidden bg-[#F5F8F6] text-[#0a1f1c]">
      <Navbar />

      {/* PAGE HEADER */}
      <section className="relative overflow-hidden bg-[#003435]">
        <div className="appointments-header-ring pointer-events-none absolute -right-24 -top-36 h-96 w-96 rounded-full border-[45px] border-white/[0.04]" />

        <div className="appointments-header-glow pointer-events-none absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-[#ADEFE7]/10 blur-3xl" />

        <div className="appointments-header-orbit pointer-events-none absolute right-[22%] top-10 h-24 w-24 rounded-full border border-[#ADEFE7]/10" />

        <div className="relative mx-auto max-w-7xl px-6 py-14 md:py-20">
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <div className="appointments-enter-left mb-5 inline-flex items-center gap-2 rounded-full border border-[#ADEFE7]/25 bg-white/10 px-5 py-3">
                <HeartPulse
                  size={19}
                  className="text-[#ADEFE7] animate-[appointmentPulse_3s_ease-in-out_infinite]"
                />
                <span className="text-base font-semibold tracking-wide text-[#ADEFE7]">
                  YOUR HEALTHCARE DASHBOARD
                </span>
              </div>

              <h1 className="appointments-enter-up font-['Bricolage_Grotesque'] text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
                My
                <span className="text-[#ADEFE7]"> Appointments</span>
              </h1>

              <p className="appointments-enter-up mt-5 max-w-xl text-lg leading-8 text-[#D0E5DF] [animation-delay:180ms]">
                Keep track of your healthcare journey. View upcoming visits,
                manage your bookings, and stay connected with your doctors.
              </p>

              <div className="appointments-enter-up mt-7 flex items-center gap-3 text-base font-medium text-[#ADEFE7] [animation-delay:300ms]">
                <ShieldCheck size={21} />
                Your healthcare journey, organized in one place.
              </div>
            </div>

            {/* Header illustration */}
            <div className="appointments-hero-card relative hidden h-48 w-48 shrink-0 items-center justify-center rounded-[36px] border border-white/15 bg-white/10 shadow-2xl backdrop-blur-md md:flex">
              <div className="absolute inset-3 rounded-[28px] border border-[#ADEFE7]/20" />

              <CalendarCheck
                size={88}
                strokeWidth={1.2}
                className="relative text-[#ADEFE7]"
              />

              <div className="appointments-floating-badge absolute -right-4 -top-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ADEFE7] text-[#003435] shadow-lg">
                <CheckCircle2 size={27} />
              </div>

              <div className="appointments-floating-badge-reverse absolute -bottom-4 -left-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#256862] shadow-lg">
                <HeartPulse size={24} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className="mx-auto max-w-7xl px-5 py-12 sm:px-6 md:py-16">

        {/* SUMMARY CARDS */}
        {!loading && !error && (
          <div className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Total Appointments",
                count: appointments.length,
                icon: ClipboardList,
                color: "bg-[#E7F4F1] text-[#256862]",
                accent: "border-[#C9E3DA]",
              },
              {
                title: "Confirmed",
                count: getAppointmentCount("confirmed"),
                icon: CheckCircle2,
                color: "bg-[#E0F5EC] text-[#16734D]",
                accent: "border-[#B8E7D0]",
              },
              {
                title: "Completed",
                count: getAppointmentCount("completed"),
                icon: CalendarCheck,
                color: "bg-[#E5EFFD] text-[#285FA6]",
                accent: "border-[#C5D9F5]",
              },
              {
                title: "Cancelled",
                count: getAppointmentCount("cancelled"),
                icon: CalendarX,
                color: "bg-[#FDEAEA] text-[#B43D3D]",
                accent: "border-[#F4CACA]",
              },
            ].map((item, index) => {
              const Icon = item.icon;

              return (
                <Reveal
                  key={item.title}
                  delay={index * 100}
                  className="h-full"
                >
                  <Tilt className="h-full">
                    <div className="group h-full rounded-3xl border border-[#D4E4DE] bg-white p-6 shadow-[0_8px_25px_rgba(0,52,53,0.04)] transition-all duration-300 hover:shadow-[0_18px_35px_rgba(0,52,53,0.09)]">
                      <div className="flex items-center justify-between">
                        <div
                          className={`appointments-summary-icon flex h-12 w-12 items-center justify-center rounded-2xl ${item.color}`}
                        >
                          <Icon size={24} />
                        </div>

                        <span className="text-3xl font-bold tabular-nums text-[#003435]">
                          {item.count}
                        </span>
                      </div>

                      <h3 className="mt-5 text-base font-semibold text-[#65736F]">
                        {item.title}
                      </h3>
                    </div>
                  </Tilt>
                </Reveal>
              );
            })}
          </div>
        )}

        {/* SECTION TITLE */}
        <Reveal className="mb-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-1.5 rounded-full bg-[#258B76]" />
                <h2 className="font-['Bricolage_Grotesque'] text-2xl font-bold text-[#003435] sm:text-3xl">
                  Appointment History
                </h2>
              </div>

              <p className="mt-3 text-base text-[#65736F]">
                All your booked appointments and their current status.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-[#D4E4DE] bg-white px-4 py-3 text-base font-medium text-[#52645F] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
              <CalendarDays size={19} className="text-[#258B76]" />
              {appointments.length} Appointments
            </div>
          </div>
        </Reveal>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="appointments-enter-up mb-7 flex items-start gap-4 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
            <AlertCircle size={23} className="mt-0.5 shrink-0" />
            <div>
              <p className="text-base font-bold">
                Something went wrong
              </p>
              <p className="mt-1 text-base">{error}</p>
            </div>
          </div>
        )}

        {/* LOADING SKELETON */}
        {loading ? (
          <div className="space-y-5">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                style={{
                  animationDelay: reducedMotion ? "0ms" : `${item * 100}ms`,
                }}
                className="appointments-skeleton rounded-3xl border border-[#D4E4DE] bg-white p-7"
              >
                <div className="flex flex-col gap-6 sm:flex-row">
                  <div className="h-16 w-16 rounded-2xl bg-[#E7F4F1]" />

                  <div className="flex-1 space-y-4">
                    <div className="h-5 w-48 rounded-full bg-[#E7F4F1]" />
                    <div className="h-4 w-36 rounded-full bg-[#E7F4F1]" />
                    <div className="h-4 w-56 rounded-full bg-[#E7F4F1]" />
                  </div>

                  <div className="h-9 w-28 rounded-full bg-[#E7F4F1]" />
                </div>
              </div>
            ))}
          </div>
        ) : appointments.length === 0 ? (

          /* EMPTY STATE */
          <Reveal>
            <div className="appointments-empty-state relative overflow-hidden rounded-[32px] border border-[#D4E4DE] bg-white px-6 py-16 text-center shadow-sm sm:px-12">
              <div className="appointments-empty-glow absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#ADEFE7]/30 blur-3xl" />
              <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[#E7F4F1] blur-3xl" />

              <div className="appointments-empty-icon relative z-10 mx-auto flex h-28 w-28 items-center justify-center rounded-[32px] bg-[#E7F4F1] text-[#256862] shadow-inner">
                <CalendarDays size={55} strokeWidth={1.3} />
              </div>

              <h3 className="relative z-10 mt-8 font-['Bricolage_Grotesque'] text-3xl font-bold text-[#003435]">
                No Appointments Yet
              </h3>

              <p className="relative z-10 mx-auto mt-4 max-w-md text-lg leading-8 text-[#65736F]">
                Your healthcare journey starts with the right doctor.
                Explore our specialists and book your first appointment.
              </p>

              <a
                href="/doctors"
                className="group relative z-10 mt-8 inline-flex items-center gap-3 rounded-2xl bg-[#003F40] px-8 py-4 text-base font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#145B57] hover:shadow-xl"
              >
                Find a Doctor
                <ArrowRight
                  size={20}
                  className="transition-transform group-hover:translate-x-1"
                />
              </a>

              <div className="relative z-10 mt-8 flex flex-wrap justify-center gap-6 text-base text-[#65736F]">
                <span className="flex items-center gap-2">
                  <ShieldCheck size={19} className="text-[#258B76]" />
                  Trusted Care
                </span>
                <span className="flex items-center gap-2">
                  <HeartPulse size={19} className="text-[#258B76]" />
                  Patient Focused
                </span>
              </div>
            </div>
          </Reveal>

        ) : (

          /* APPOINTMENT CARDS */
          <div className="space-y-5">
            {appointments.map((appointment, index) => {
              const statusInfo = getStatusStyle(appointment.status);
              const StatusIcon = statusInfo.icon;

              return (
                <Reveal
                  key={appointment._id}
                  delay={Math.min(index * 100, 500)}
                >
                  <Tilt>
                    <div className="group relative overflow-hidden rounded-[28px] border border-[#D4E4DE] bg-white p-6 shadow-[0_8px_25px_rgba(0,52,53,0.035)] transition-all duration-300 hover:border-[#A7CFC2] hover:shadow-[0_20px_45px_rgba(0,52,53,0.09)] sm:p-8">

                      {/* Hover accent */}
                      <div className="absolute left-0 top-0 h-full w-1.5 origin-top scale-y-0 rounded-r-full bg-[#258B76] transition-transform duration-300 group-hover:scale-y-100" />

                      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                        {/* DOCTOR INFORMATION */}
                        <div className="flex min-w-0 items-start gap-5">
                          <div className="appointments-doctor-icon flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#DDF3ED] to-[#BDE6DA] text-[#256862] shadow-sm transition-transform duration-300 group-hover:scale-105">
                            <Stethoscope size={30} />
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-3">
                              <h3 className="text-xl font-bold text-[#003435] transition-colors group-hover:text-[#258B76] sm:text-2xl">
                                {appointment.doctor?.user?.name}
                              </h3>
                            </div>

                            <p className="mt-2 flex items-center gap-2 text-base font-semibold text-[#258B76]">
                              <UserRound size={18} />
                              {appointment.doctor?.specialization}
                            </p>

                            {appointment.reason && (
                              <div className="mt-4 inline-flex max-w-full items-start gap-2 rounded-xl bg-[#F5F8F6] px-4 py-3 transition-colors duration-300 group-hover:bg-[#EFF8F4]">
                                <ClipboardList
                                  size={19}
                                  className="mt-0.5 shrink-0 text-[#65736F]"
                                />
                                <p className="break-words text-base leading-6 text-[#52645F]">
                                  <span className="font-bold text-[#164B4D]">
                                    Reason:{" "}
                                  </span>
                                  {appointment.reason}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* APPOINTMENT DATE & TIME */}
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:min-w-[340px]">
                          <div className="rounded-2xl border border-[#DCEAE4] bg-[#F5F8F6] p-4 transition-all duration-300 group-hover:bg-[#EFF8F4]">
                            <div className="flex items-center gap-2 text-[#65736F]">
                              <CalendarDays size={19} />
                              <span className="text-base font-semibold">
                                Appointment Date
                              </span>
                            </div>

                            <p className="mt-3 text-base font-bold text-[#003435]">
                              {formatAppointmentDate(appointment.date)}
                            </p>
                          </div>

                          <div className="rounded-2xl border border-[#DCEAE4] bg-[#F5F8F6] p-4 transition-all duration-300 group-hover:bg-[#EFF8F4]">
                            <div className="flex items-center gap-2 text-[#65736F]">
                              <Clock3 size={19} />
                              <span className="text-base font-semibold">
                                Appointment Time
                              </span>
                            </div>

                            <p className="mt-3 text-base font-bold text-[#003435]">
                              {formatAppointmentTime(appointment.date)}
                            </p>
                          </div>
                        </div>

                        {/* STATUS & ACTION */}
                        <div className="flex flex-row items-center justify-between gap-4 border-t border-[#E5EEE9] pt-5 lg:min-w-[175px] lg:flex-col lg:items-end lg:justify-center lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
                          <div
                            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 transition-transform duration-300 group-hover:scale-105 ${statusInfo.badge}`}
                          >
                            <StatusIcon size={18} />
                            <span className="text-base font-bold capitalize">
                              {statusInfo.label}
                            </span>
                          </div>

                          {appointment.status !== "completed" &&
                            appointment.status !== "cancelled" && (
                              <button
                                onClick={() =>
                                  cancelAppointment(appointment._id)
                                }
                                className="group/cancel inline-flex items-center gap-2 rounded-xl border border-[#F2CACA] bg-[#FFF5F5] px-4 py-3 text-base font-bold text-[#B43D3D] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#E6A5A5] hover:bg-[#FDEAEA] hover:shadow-md active:scale-95"
                              >
                                <Ban
                                  size={18}
                                  className="transition-transform duration-300 group-hover/cancel:rotate-12"
                                />
                                Cancel
                              </button>
                            )}
                        </div>
                      </div>

                      {/* Bottom decorative line */}
                      <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-gradient-to-r from-[#258B76] to-[#ADEFE7] transition-all duration-500 group-hover:w-full" />
                    </div>
                  </Tilt>
                </Reveal>
              );
            })}
          </div>
        )}

        {/* BOTTOM INFORMATION */}
        {!loading && appointments.length > 0 && (
          <Reveal delay={150}>
            <div className="appointments-bottom-info mt-10 flex flex-col gap-4 rounded-2xl border border-[#CDE4DA] bg-[#E7F4F1] p-5 sm:flex-row sm:items-center">
              <div className="appointments-info-icon flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-[#256862] shadow-sm">
                <ShieldCheck size={25} />
              </div>

              <div>
                <h3 className="text-base font-bold text-[#164B4D]">
                  Keep Your Healthcare Journey on Track
                </h3>
                <p className="mt-1 text-base leading-7 text-[#52645F]">
                  Review your appointment details and contact your healthcare
                  provider if you need further assistance.
                </p>
              </div>
            </div>
          </Reveal>
        )}
      </main>

      <Footer />

      {/* Animation styles */}
      <style>{`
        @keyframes appointmentFadeUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes appointmentFadeLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes appointmentFloat {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-12px);
          }
        }

        @keyframes appointmentFloatReverse {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(10px);
          }
        }

        @keyframes appointmentPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.12);
            opacity: 0.75;
          }
        }

        @keyframes appointmentSpin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes appointmentGlow {
          0%, 100% {
            opacity: 0.45;
          }
          50% {
            opacity: 0.9;
          }
        }

        @keyframes appointmentSkeleton {
          0%, 100% {
            opacity: 0.65;
          }
          50% {
            opacity: 1;
          }
        }

        .appointments-enter-up {
          animation: appointmentFadeUp 800ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .appointments-enter-left {
          animation: appointmentFadeLeft 800ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .appointments-header-ring {
          animation: appointmentSpin 45s linear infinite;
        }

        .appointments-header-glow {
          animation: appointmentGlow 6s ease-in-out infinite;
        }

        .appointments-header-orbit {
          animation: appointmentFloat 7s ease-in-out infinite;
        }

        .appointments-hero-card {
          animation: appointmentFadeUp 900ms ease-out both, appointmentFloat 6s ease-in-out 1s infinite;
        }

        .appointments-floating-badge {
          animation: appointmentFloat 4s ease-in-out infinite;
        }

        .appointments-floating-badge-reverse {
          animation: appointmentFloatReverse 5s ease-in-out infinite;
        }

        .appointments-summary-icon {
          transition: transform 350ms ease;
        }

        .group:hover .appointments-summary-icon {
          transform: rotate(-7deg) scale(1.1);
        }

        .appointments-skeleton {
          animation: appointmentSkeleton 1.8s ease-in-out infinite;
        }

        .appointments-empty-icon {
          animation: appointmentFloat 5s ease-in-out infinite;
        }

        .appointments-empty-glow {
          animation: appointmentGlow 5s ease-in-out infinite;
        }

        .appointments-doctor-icon {
          transition: transform 350ms ease;
        }

        .group:hover .appointments-doctor-icon {
          transform: rotate(-5deg) scale(1.08);
        }

        .appointments-bottom-info {
          transition: transform 300ms ease, box-shadow 300ms ease;
        }

        .appointments-bottom-info:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 28px rgba(0, 52, 53, 0.07);
        }

        .appointments-info-icon {
          transition: transform 300ms ease;
        }

        .appointments-bottom-info:hover .appointments-info-icon {
          transform: rotate(8deg) scale(1.06);
        }

        @media (prefers-reduced-motion: reduce) {
          .my-appointments-page *,
          .my-appointments-page *::before,
          .my-appointments-page *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
};

export default MyAppointments;
