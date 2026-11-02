
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  CalendarDays,
  Clock3,
  Stethoscope,
  ClipboardList,
  ShieldCheck,
  HeartPulse,
  UserRound,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  LoaderCircle,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../api";

/* ---------------------------------
   Animation Helpers
---------------------------------- */

const useReducedMotion = () => {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

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
  const [ref, isVisible] = useInView();
  const reducedMotion = useReducedMotion();

  const transforms = {
    up: "translate3d(0, 35px, 0)",
    down: "translate3d(0, -25px, 0)",
    left: "translate3d(-35px, 0, 0)",
    right: "translate3d(35px, 0, 0)",
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
            : transforms[direction],
        transition: reducedMotion
          ? "none"
          : `opacity 750ms ease, transform 750ms cubic-bezier(0.22, 1, 0.36, 1)`,
        transitionDelay: reducedMotion ? "0ms" : `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

const Tilt = ({ children, className = "" }) => {
  const ref = useRef(null);
  const reducedMotion = useReducedMotion();

  const handleMouseMove = (event) => {
    if (reducedMotion) return;

    const element = ref.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const rotateY = ((x / rect.width) - 0.5) * 3;
    const rotateX = (0.5 - y / rect.height) * 3;

    element.style.transform = `
      perspective(1100px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      translateY(-3px)
    `;
  };

  const handleMouseLeave = () => {
    if (!ref.current) return;

    ref.current.style.transform = "perspective(1100px) rotateX(0) rotateY(0) translateY(0)";
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

/* ---------------------------------
   Main Component
---------------------------------- */

const BookAppointment = () => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const selectedDoctorId = searchParams.get("doctor");

  const [doctors, setDoctors] = useState([]);
  const [doctor, setDoctor] = useState(selectedDoctorId || "");
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingDoctors, setFetchingDoctors] = useState(true);
  const [fetchingSlots, setFetchingSlots] = useState(false);
  const [error, setError] = useState("");

  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await api.get("/doctors");

        setDoctors(response.data.doctors);
      } catch (error) {
        console.error("Failed to fetch doctors", error);
      } finally {
        setFetchingDoctors(false);
      }
    };

    fetchDoctors();
  }, []);

  useEffect(() => {
    const fetchSlots = async () => {
      if (!doctor || !date) {
        setSlots([]);
        setSelectedSlot("");
        return;
      }

      try {
        setFetchingSlots(true);
        setError("");
        setSelectedSlot("");

        const response = await api.get("/slots", {
          params: {
            doctorId: doctor,
            date,
          },
        });

        setSlots(response.data.slots || []);
      } catch (error) {
        setSlots([]);

        setError(
          error.response?.data?.message ||
            "Failed to fetch available slots."
        );
      } finally {
        setFetchingSlots(false);
      }
    };

    fetchSlots();
  }, [doctor, date]);

  const getTodayDate = () => {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("userToken");

    if (!token) {
      navigate("/login");
      return;
    }

    if (!selectedSlot) {
      setError("Please select an available time slot.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await api.post(
        "/appointments",
        {
          doctor,
          date: `${date}T${selectedSlot}`,
          reason,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate("/my-appointments");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to book appointment."
      );
    } finally {
      setLoading(false);
    }
  };

  const selectedDoctor = doctors.find(
    (item) => item._id === doctor
  );

  return (
    <div className="min-h-screen bg-[#F5F8F6] overflow-hidden">
      <style>{`
        @keyframes bookingFloat {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(0, -17px, 0);
          }
        }

        @keyframes bookingFloatReverse {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(0, 15px, 0);
          }
        }

        @keyframes bookingPulse {
          0%, 100% {
            opacity: 0.35;
            transform: scale(0.95);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.08);
          }
        }

        @keyframes bookingSpin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes bookingEntrance {
          from {
            opacity: 0;
            transform: translateY(22px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .booking-float {
          animation: bookingFloat 7s ease-in-out infinite;
        }

        .booking-float-reverse {
          animation: bookingFloatReverse 8s ease-in-out infinite;
        }

        .booking-pulse {
          animation: bookingPulse 5s ease-in-out infinite;
        }

        .booking-spin {
          animation: bookingSpin 24s linear infinite;
        }

        .booking-entrance {
          animation: bookingEntrance 800ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .booking-card {
          transition:
            box-shadow 350ms ease,
            border-color 350ms ease,
            transform 350ms ease;
        }

        .booking-card:hover {
          box-shadow: 0 18px 45px rgba(0, 52, 53, 0.09);
          border-color: #A9C9C0;
        }

        .booking-icon {
          transition: transform 350ms ease;
        }

        .booking-card:hover .booking-icon {
          transform: translateY(-3px) scale(1.06);
        }

        .booking-slot {
          transition:
            transform 250ms ease,
            box-shadow 250ms ease,
            background-color 250ms ease;
        }

        .booking-slot:not(:disabled):hover {
          transform: translateY(-3px);
        }

        @media (prefers-reduced-motion: reduce) {
          .booking-float,
          .booking-float-reverse,
          .booking-pulse,
          .booking-spin,
          .booking-entrance {
            animation: none !important;
          }

          .booking-card,
          .booking-icon,
          .booking-slot {
            transition: none !important;
          }
        }
      `}</style>

      <Navbar />

      <main className="relative overflow-hidden py-10 md:py-14">
        {/* Animated Background Decorations */}
        <div className="absolute -top-24 -right-20 h-80 w-80 rounded-full bg-[#ADEFE7]/30 blur-3xl pointer-events-none booking-float" />

        <div className="absolute bottom-10 -left-24 h-72 w-72 rounded-full bg-[#dcf3ee]/60 blur-3xl pointer-events-none booking-float-reverse" />

        <div className="absolute top-[30%] right-[8%] w-24 h-24 rounded-full border border-[#ADEFE7]/40 pointer-events-none booking-spin" />

        <div className="absolute top-[45%] left-[4%] w-3 h-3 rounded-full bg-[#ADEFE7]/70 blur-[1px] booking-pulse pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">

          {/* Page Heading */}
          <Reveal>
            <div className="mb-9">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#CBDAD6] bg-white px-4 py-2 text-base font-semibold text-[#256862] mb-5 shadow-sm hover:shadow-md transition-shadow duration-300">
                <HeartPulse size={19} className="booking-pulse" />
                Medicare Healthcare
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#003435] tracking-tight">
                Book Your Appointment
              </h1>

              <p className="mt-3 text-base sm:text-lg text-[#65736F] max-w-2xl leading-relaxed">
                Your health deserves the right care. Choose your
                preferred doctor, select a convenient time, and
                schedule your appointment.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-7 items-start">

            {/* Main Booking Form */}
            <Reveal
              className="lg:col-span-2"
              delay={120}
            >
              <div className="bg-white border border-[#CBDAD6] rounded-3xl shadow-[0_12px_40px_rgba(0,52,53,0.06)] overflow-hidden booking-card">

                {/* Form Header */}
                <div className="bg-[#003435] px-6 sm:px-8 py-7 relative overflow-hidden">
                  <div className="absolute -right-8 -top-12 h-44 w-44 rounded-full border-[28px] border-white/5 booking-spin" />

                  <div className="absolute right-20 -bottom-16 h-36 w-36 rounded-full bg-[#ADEFE7]/10 blur-2xl booking-pulse" />

                  <div className="relative flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-[#ADEFE7] flex items-center justify-center shrink-0 booking-icon">
                      <CalendarDays
                        size={28}
                        className="text-[#003435]"
                      />
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        Appointment Details
                      </h2>
                      <p className="text-base text-[#ADEFE7] mt-1">
                        Complete the details below to book your visit.
                      </p>
                    </div>
                  </div>
                </div>

                <form
                  onSubmit={handleBooking}
                  className="p-6 sm:p-8 space-y-8"
                >

                  {/* Error Message */}
                  {error && (
                    <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl px-5 py-4 text-red-700 booking-entrance">
                      <AlertCircle
                        size={22}
                        className="shrink-0 mt-0.5"
                      />
                      <p className="text-base font-medium">
                        {error}
                      </p>
                    </div>
                  )}

                  {/* Doctor Selection */}
                  <section className="booking-entrance">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-xl bg-[#E7F4F1] flex items-center justify-center booking-icon">
                        <Stethoscope
                          size={21}
                          className="text-[#256862]"
                        />
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-[#003435]">
                          Choose Your Doctor
                        </h3>
                        <p className="text-base text-[#65736F]">
                          Select the specialist you want to consult.
                        </p>
                      </div>
                    </div>

                    <div className="relative">
                      <select
                        value={doctor}
                        onChange={(e) => {
                          setDoctor(e.target.value);
                          setDate("");
                          setSlots([]);
                          setSelectedSlot("");
                        }}
                        required
                        disabled={fetchingDoctors}
                        className="w-full appearance-none border border-[#CBDAD6] rounded-2xl px-5 py-4 pr-12 bg-[#FAFCFB] text-base text-[#0a1f1c] outline-none transition-all duration-200 focus:border-[#256862] focus:ring-4 focus:ring-[#ADEFE7]/40 hover:border-[#8EAAA3] disabled:bg-[#F1F5F3] disabled:cursor-not-allowed"
                      >
                        <option value="">
                          {fetchingDoctors
                            ? "Loading doctors..."
                            : "Select a doctor"}
                        </option>

                        {doctors.map((item) => (
                          <option key={item._id} value={item._id}>
                            {item.user?.name} — {item.specialization}
                          </option>
                        ))}
                      </select>

                      <UserRound
                        size={21}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-[#65736F] pointer-events-none"
                      />
                    </div>
                  </section>

                  <div className="border-t border-[#E5EEEB]" />

                  {/* Date Selection */}
                  <section className="booking-entrance">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-xl bg-[#E7F4F1] flex items-center justify-center booking-icon">
                        <CalendarDays
                          size={21}
                          className="text-[#256862]"
                        />
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-[#003435]">
                          Select Appointment Date
                        </h3>
                        <p className="text-base text-[#65736F]">
                          Choose your preferred date for the visit.
                        </p>
                      </div>
                    </div>

                    <input
                      type="date"
                      value={date}
                      onChange={(e) => {
                        setDate(e.target.value);
                        setSelectedSlot("");
                      }}
                      required
                      min={getTodayDate()}
                      disabled={!doctor}
                      className="w-full border border-[#CBDAD6] rounded-2xl px-5 py-4 bg-[#FAFCFB] text-base text-[#0a1f1c] outline-none transition-all duration-200 focus:border-[#256862] focus:ring-4 focus:ring-[#ADEFE7]/40 hover:border-[#8EAAA3] disabled:bg-[#F1F5F3] disabled:cursor-not-allowed"
                    />

                    {!doctor && (
                      <p className="mt-3 text-base text-[#65736F] flex items-center gap-2">
                        <AlertCircle size={18} />
                        Please select a doctor before choosing a date.
                      </p>
                    )}
                  </section>

                  <div className="border-t border-[#E5EEEB]" />

                  {/* Time Slot Selection */}
                  {doctor && date && (
                    <section className="booking-entrance">
                      <div className="flex items-center gap-3 mb-5">
                        <div className="h-10 w-10 rounded-xl bg-[#E7F4F1] flex items-center justify-center booking-icon">
                          <Clock3
                            size={21}
                            className="text-[#256862]"
                          />
                        </div>

                        <div>
                          <h3 className="text-lg font-bold text-[#003435]">
                            Available Time Slots
                          </h3>
                          <p className="text-base text-[#65736F]">
                            Select a suitable time for your appointment.
                          </p>
                        </div>
                      </div>

                      {fetchingSlots ? (
                        <div className="flex items-center justify-center gap-3 border border-[#CBDAD6] bg-[#F5F8F6] rounded-2xl p-7 booking-entrance">
                          <LoaderCircle
                            size={23}
                            className="animate-spin text-[#256862]"
                          />
                          <p className="text-base font-medium text-[#65736F]">
                            Loading available slots...
                          </p>
                        </div>
                      ) : slots.length === 0 ? (
                        <div className="text-center border border-dashed border-[#CBDAD6] bg-[#F8FBF9] rounded-2xl p-7 booking-entrance">
                          <Clock3
                            size={30}
                            className="mx-auto mb-3 text-[#8BA39C]"
                          />
                          <p className="text-base font-semibold text-[#164B4D]">
                            No available slots for this date.
                          </p>
                          <p className="text-base text-[#65736F] mt-2">
                            Please try selecting another date.
                          </p>
                        </div>
                      ) : (
                        <>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {slots.map((slot, index) => (
                              <button
                                key={slot}
                                type="button"
                                onClick={() => setSelectedSlot(slot)}
                                style={{
                                  animation: reducedMotion
                                    ? "none"
                                    : `bookingEntrance 500ms ease ${index * 65}ms both`,
                                }}
                                className={`booking-slot group flex items-center justify-center gap-2 px-4 py-4 rounded-2xl border font-semibold text-base ${
                                  selectedSlot === slot
                                    ? "bg-[#003435] text-white border-[#003435] shadow-lg shadow-[#003435]/15 scale-[1.02]"
                                    : "bg-[#FAFCFB] text-[#164B4D] border-[#CBDAD6] hover:border-[#256862] hover:bg-[#E7F4F1]"
                                }`}
                              >
                                <Clock3
                                  size={18}
                                  className={
                                    selectedSlot === slot
                                      ? "text-[#ADEFE7]"
                                      : "text-[#256862]"
                                  }
                                />

                                {slot}

                                {selectedSlot === slot && (
                                  <CheckCircle2
                                    size={18}
                                    className="text-[#ADEFE7]"
                                  />
                                )}
                              </button>
                            ))}
                          </div>

                          {selectedSlot && (
                            <div className="mt-4 flex items-center gap-3 bg-[#E7F4F1] border border-[#B8DED5] rounded-xl px-4 py-3 booking-entrance">
                              <CheckCircle2
                                size={21}
                                className="text-[#256862]"
                              />
                              <p className="text-base font-semibold text-[#164B4D]">
                                Selected appointment time: {selectedSlot}
                              </p>
                            </div>
                          )}
                        </>
                      )}
                    </section>
                  )}

                  <div className="border-t border-[#E5EEEB]" />

                  {/* Reason for Visit */}
                  <section className="booking-entrance">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-xl bg-[#E7F4F1] flex items-center justify-center booking-icon">
                        <ClipboardList
                          size={21}
                          className="text-[#256862]"
                        />
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-[#003435]">
                          Reason for Visit
                        </h3>
                        <p className="text-base text-[#65736F]">
                          Tell us briefly about your health concern.
                        </p>
                      </div>
                    </div>

                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Briefly describe your reason for the appointment..."
                      rows="4"
                      className="w-full border border-[#CBDAD6] rounded-2xl px-5 py-4 bg-[#FAFCFB] text-base text-[#0a1f1c] placeholder:text-[#8B9994] outline-none resize-none transition-all duration-200 focus:border-[#256862] focus:ring-4 focus:ring-[#ADEFE7]/40 hover:border-[#8EAAA3]"
                    />
                  </section>

                  {/* Submit Button */}
                  <div className="booking-entrance">
                    <button
                      type="submit"
                      disabled={loading || !selectedSlot}
                      className="group w-full flex items-center justify-center gap-3 bg-[#003435] hover:bg-[#164B4D] disabled:bg-[#A8C2BC] disabled:cursor-not-allowed text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-lg shadow-[#003435]/10 hover:shadow-xl hover:shadow-[#003435]/15 hover:-translate-y-0.5 transition-all duration-300"
                    >
                      {loading ? (
                        <>
                          <LoaderCircle
                            size={22}
                            className="animate-spin"
                          />
                          Booking Your Appointment...
                        </>
                      ) : (
                        <>
                          <CalendarDays size={22} />
                          Confirm Appointment
                          <ArrowRight
                            size={21}
                            className="transition-transform duration-200 group-hover:translate-x-1"
                          />
                        </>
                      )}
                    </button>

                    <div className="flex items-start gap-3 justify-center text-center mt-6">
                      <ShieldCheck
                        size={20}
                        className="text-[#256862] shrink-0 mt-0.5"
                      />
                      <p className="text-base text-[#65736F]">
                        Your appointment details are handled securely by
                        Medicare.
                      </p>
                    </div>
                  </div>
                </form>
              </div>
            </Reveal>

            {/* Right Information Panel */}
            <aside className="space-y-6">

              {/* Booking Summary */}
              <Reveal delay={220} direction="right">
                <Tilt>
                  <div className="bg-white border border-[#CBDAD6] rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,52,53,0.05)] booking-card">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-11 w-11 rounded-xl bg-[#E7F4F1] flex items-center justify-center booking-icon">
                        <ClipboardList
                          size={23}
                          className="text-[#256862]"
                        />
                      </div>

                      <div>
                        <h3 className="text-xl font-bold text-[#003435]">
                          Booking Summary
                        </h3>
                        <p className="text-base text-[#65736F]">
                          Your selected details
                        </p>
                      </div>
                    </div>

                    <div className="space-y-5">

                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-xl bg-[#F0F6F3] flex items-center justify-center shrink-0 booking-icon">
                          <Stethoscope
                            size={20}
                            className="text-[#256862]"
                          />
                        </div>

                        <div className="min-w-0">
                          <p className="text-base text-[#65736F]">
                            Doctor
                          </p>
                          <p className="text-base font-semibold text-[#003435] mt-1 break-words">
                            {selectedDoctor
                              ? selectedDoctor.user?.name
                              : "Not selected"}
                          </p>
                          {selectedDoctor && (
                            <p className="text-base text-[#65736F] mt-1">
                              {selectedDoctor.specialization}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="border-t border-[#E5EEEB]" />

                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-xl bg-[#F0F6F3] flex items-center justify-center shrink-0 booking-icon">
                          <CalendarDays
                            size={20}
                            className="text-[#256862]"
                          />
                        </div>

                        <div>
                          <p className="text-base text-[#65736F]">
                            Appointment Date
                          </p>
                          <p className="text-base font-semibold text-[#003435] mt-1">
                            {date || "Not selected"}
                          </p>
                        </div>
                      </div>

                      <div className="border-t border-[#E5EEEB]" />

                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-xl bg-[#F0F6F3] flex items-center justify-center shrink-0 booking-icon">
                          <Clock3
                            size={20}
                            className="text-[#256862]"
                          />
                        </div>

                        <div>
                          <p className="text-base text-[#65736F]">
                            Appointment Time
                          </p>
                          <p className="text-base font-semibold text-[#003435] mt-1">
                            {selectedSlot || "Not selected"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Booking Status */}
                    <div className="mt-6 bg-[#E7F4F1] border border-[#B8DED5] rounded-2xl p-4 transition-all duration-300">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2
                          size={20}
                          className="text-[#256862]"
                        />
                        <p className="text-base font-bold text-[#164B4D]">
                          Appointment Status
                        </p>
                      </div>

                      <p className="text-base text-[#256862]">
                        {selectedSlot
                          ? "Time slot selected. Ready to confirm."
                          : "Complete the booking details to continue."}
                      </p>
                    </div>
                  </div>
                </Tilt>
              </Reveal>

              {/* Helpful Information */}
              <Reveal delay={350} direction="right">
                <Tilt>
                  <div className="bg-[#003435] rounded-3xl p-6 text-white relative overflow-hidden shadow-lg shadow-[#003435]/10 booking-card">
                    <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full border-[25px] border-white/5 booking-spin" />

                    <div className="absolute -right-5 bottom-4 w-24 h-24 rounded-full bg-[#ADEFE7]/10 blur-2xl booking-pulse" />

                    <div className="relative">
                      <div className="h-12 w-12 rounded-2xl bg-[#ADEFE7] flex items-center justify-center mb-5 booking-icon">
                        <Sparkles
                          size={24}
                          className="text-[#003435]"
                        />
                      </div>

                      <h3 className="text-xl font-bold mb-3">
                        Your Health Matters
                      </h3>

                      <p className="text-base text-[#D2E8E3] leading-relaxed">
                        A timely consultation can make a difference.
                        Choose a suitable doctor and schedule your visit
                        with confidence.
                      </p>

                      <div className="mt-6 flex items-center gap-3 border-t border-white/15 pt-5">
                        <ShieldCheck
                          size={22}
                          className="text-[#ADEFE7]"
                        />
                        <p className="text-base font-medium text-[#ADEFE7]">
                          Care you can count on.
                        </p>
                      </div>
                    </div>
                  </div>
                </Tilt>
              </Reveal>

            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookAppointment;
