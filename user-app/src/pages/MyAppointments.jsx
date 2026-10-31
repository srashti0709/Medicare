
import { useEffect, useState } from "react";
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
  Sparkles,
  ClipboardList,
  RefreshCw,
  Ban,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../api";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
    <div className="min-h-screen overflow-hidden bg-[#F5F8F6] text-[#0a1f1c]">
      <Navbar />

      {/* PAGE HEADER */}
      <section className="relative overflow-hidden bg-[#003435]">
        <div className="pointer-events-none absolute -right-24 -top-36 h-96 w-96 rounded-full border-[45px] border-white/[0.04]" />
        <div className="pointer-events-none absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-[#ADEFE7]/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-14 md:py-20">
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#ADEFE7]/25 bg-white/10 px-5 py-3">
                <HeartPulse size={19} className="text-[#ADEFE7]" />
                <span className="text-base font-semibold tracking-wide text-[#ADEFE7]">
                  YOUR HEALTHCARE DASHBOARD
                </span>
              </div>

              <h1 className="font-['Bricolage_Grotesque'] text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
                My
                <span className="text-[#ADEFE7]"> Appointments</span>
              </h1>

              <p className="mt-5 max-w-xl text-lg leading-8 text-[#D0E5DF]">
                Keep track of your healthcare journey. View upcoming visits,
                manage your bookings, and stay connected with your doctors.
              </p>

              <div className="mt-7 flex items-center gap-3 text-base font-medium text-[#ADEFE7]">
                <ShieldCheck size={21} />
                Your healthcare journey, organized in one place.
              </div>
            </div>

            {/* Header illustration */}
            <div className="relative hidden h-48 w-48 shrink-0 items-center justify-center rounded-[36px] border border-white/15 bg-white/10 shadow-2xl backdrop-blur-md md:flex">
              <div className="absolute inset-3 rounded-[28px] border border-[#ADEFE7]/20" />
              <CalendarCheck
                size={88}
                strokeWidth={1.2}
                className="relative text-[#ADEFE7]"
              />
              <div className="absolute -right-4 -top-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ADEFE7] text-[#003435] shadow-lg">
                <CheckCircle2 size={27} />
              </div>
              <div className="absolute -bottom-4 -left-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#256862] shadow-lg">
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
                <div
                  key={item.title}
                  style={{ animationDelay: `${index * 100}ms` }}
                  className="animate-[fadeUp_0.6s_ease-out_both] rounded-3xl border border-[#D4E4DE] bg-white p-6 shadow-[0_8px_25px_rgba(0,52,53,0.04)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_18px_35px_rgba(0,52,53,0.09)]"
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.color}`}
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
              );
            })}
          </div>
        )}

        {/* SECTION TITLE */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
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

          <div className="flex items-center gap-2 rounded-xl border border-[#D4E4DE] bg-white px-4 py-3 text-base font-medium text-[#52645F]">
            <CalendarDays size={19} className="text-[#258B76]" />
            {appointments.length} Appointments
          </div>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="mb-7 flex items-start gap-4 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700 animate-[fadeUp_0.4s_ease-out]">
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
                className="animate-pulse rounded-3xl border border-[#D4E4DE] bg-white p-7"
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
          <div className="relative overflow-hidden rounded-[32px] border border-[#D4E4DE] bg-white px-6 py-16 text-center shadow-sm sm:px-12">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#ADEFE7]/30 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[#E7F4F1] blur-3xl" />

            <div className="relative z-10 mx-auto flex h-28 w-28 items-center justify-center rounded-[32px] bg-[#E7F4F1] text-[#256862] shadow-inner">
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
              className="group relative z-10 mt-8 inline-flex items-center gap-3 rounded-2xl bg-[#003F40] px-8 py-4 text-base font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#145B57]"
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

        ) : (

          /* APPOINTMENT CARDS */
          <div className="space-y-5">
            {appointments.map((appointment, index) => {
              const statusInfo = getStatusStyle(appointment.status);
              const StatusIcon = statusInfo.icon;

              return (
                <div
                  key={appointment._id}
                  style={{ animationDelay: `${index * 120}ms` }}
                  className="group relative animate-[fadeUp_0.6s_ease-out_both] overflow-hidden rounded-[28px] border border-[#D4E4DE] bg-white p-6 shadow-[0_8px_25px_rgba(0,52,53,0.035)] transition-all duration-300 hover:-translate-y-1 hover:border-[#A7CFC2] hover:shadow-[0_20px_45px_rgba(0,52,53,0.09)] sm:p-8"
                >
                  {/* Hover accent */}
                  <div className="absolute left-0 top-0 h-full w-1.5 origin-top scale-y-0 rounded-r-full bg-[#258B76] transition-transform duration-300 group-hover:scale-y-100" />

                  <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                    {/* DOCTOR INFORMATION */}
                    <div className="flex min-w-0 items-start gap-5">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#DDF3ED] to-[#BDE6DA] text-[#256862] shadow-sm transition-transform duration-300 group-hover:scale-105">
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
                          <div className="mt-4 inline-flex max-w-full items-start gap-2 rounded-xl bg-[#F5F8F6] px-4 py-3">
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
                      <div className="rounded-2xl border border-[#DCEAE4] bg-[#F5F8F6] p-4 transition-colors group-hover:bg-[#EFF8F4]">
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

                      <div className="rounded-2xl border border-[#DCEAE4] bg-[#F5F8F6] p-4 transition-colors group-hover:bg-[#EFF8F4]">
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
                        className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 ${statusInfo.badge}`}
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
                            className="group/cancel inline-flex items-center gap-2 rounded-xl border border-[#F2CACA] bg-[#FFF5F5] px-4 py-3 text-base font-bold text-[#B43D3D] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#E6A5A5] hover:bg-[#FDEAEA] hover:shadow-md"
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
              );
            })}
          </div>
        )}

        {/* BOTTOM INFORMATION */}
        {!loading && appointments.length > 0 && (
          <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-[#CDE4DA] bg-[#E7F4F1] p-5 sm:flex-row sm:items-center">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-[#256862] shadow-sm">
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
        )}
      </main>

      <Footer />

      {/* Animation styles */}
      <style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(22px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
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
