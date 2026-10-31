
import { useEffect, useState } from "react";
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
  UserRound,
  Sparkles,
} from "lucide-react";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

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
    <div className="min-h-screen bg-[#F5F8F6]">
      <Navbar />

      <main className="relative overflow-hidden py-10 md:py-14">

        {/* Background Decorations */}
        <div className="absolute -top-24 -right-20 h-80 w-80 rounded-full bg-[#ADEFE7]/30 blur-3xl pointer-events-none" />
        <div className="absolute top-96 -left-24 h-72 w-72 rounded-full bg-[#dcf3ee]/60 blur-3xl pointer-events-none" />

        <section className="relative max-w-6xl mx-auto px-4 sm:px-6">

          {/* Page Heading */}
          <div className="text-center mb-12">

            <div className="inline-flex items-center gap-2 rounded-full border border-[#CBDAD6] bg-white px-4 py-2 text-base font-semibold text-[#256862] mb-5 shadow-sm">
              <HeartPulse size={19} />
              Medicare Healthcare
            </div>

            <p className="text-base font-bold uppercase tracking-widest text-[#256862] mb-3">
              Our Specialists
            </p>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#003435] tracking-tight">
              Find Your Doctor
            </h1>

            <p className="mt-4 text-base sm:text-lg text-[#65736F] max-w-2xl mx-auto leading-relaxed">
              Connect with experienced healthcare professionals and
              find the right specialist for your healthcare needs.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mt-7">
              <div className="flex items-center gap-2 bg-white border border-[#CBDAD6] rounded-xl px-4 py-3 shadow-sm">
                <ShieldCheck
                  size={21}
                  className="text-[#256862]"
                />
                <span className="text-base font-medium text-[#164B4D]">
                  Trusted Healthcare
                </span>
              </div>

              <div className="flex items-center gap-2 bg-white border border-[#CBDAD6] rounded-xl px-4 py-3 shadow-sm">
                <Users
                  size={21}
                  className="text-[#256862]"
                />
                <span className="text-base font-medium text-[#164B4D]">
                  Experienced Specialists
                </span>
              </div>
            </div>
          </div>

          {/* Doctors Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">

            <div>
              <h2 className="text-2xl font-bold text-[#003435]">
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

          {/* Loading State */}
          {loading ? (
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

          ) : doctors.length === 0 ? (

            /* Empty State */
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

          ) : (

            /* Doctors Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">

              {doctors.map((doctor) => (
                <Link
                  key={doctor._id}
                  to={`/doctors/${doctor._id}`}
                  className="group bg-white border border-[#CBDAD6] rounded-3xl overflow-hidden shadow-[0_6px_24px_rgba(0,52,53,0.04)] hover:shadow-[0_16px_40px_rgba(0,52,53,0.12)] hover:-translate-y-1 transition-all duration-300"
                >

                  {/* Card Top */}
                  <div className="relative bg-[#003435] px-6 pt-7 pb-8 overflow-hidden">

                    <div className="absolute -right-8 -top-12 h-36 w-36 rounded-full border-[22px] border-white/5" />

                    <div className="relative flex items-center justify-between">

                      {/* Doctor Icon */}
                      <div className="w-20 h-20 bg-[#ADEFE7] rounded-2xl flex items-center justify-center shadow-lg shadow-black/10 group-hover:scale-105 transition-transform duration-300">
                        <Stethoscope
                          size={38}
                          strokeWidth={1.6}
                          className="text-[#003435]"
                        />
                      </div>

                      {/* Verified Label */}
                      <div className="flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-3 py-2">
                        <ShieldCheck
                          size={17}
                          className="text-[#ADEFE7]"
                        />

                        <span className="text-base font-medium text-white">
                          Specialist
                        </span>
                      </div>
                    </div>

                    <div className="relative mt-5">
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
                      <div className="h-10 w-10 rounded-xl bg-[#E7F4F1] flex items-center justify-center shrink-0">
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
                      <div className="h-10 w-10 rounded-xl bg-[#E7F4F1] flex items-center justify-center shrink-0">
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
                      <div className="h-10 w-10 rounded-xl bg-[#E7F4F1] flex items-center justify-center shrink-0">
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
                            className="transition-transform duration-300 group-hover:translate-x-1"
                          />
                        </div>
                      </div>
                    </div>

                  </div>
                </Link>
              ))}

            </div>
          )}

          {/* Bottom Information Banner */}
          {!loading && doctors.length > 0 && (
            <div className="mt-10 bg-[#003435] rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-lg shadow-[#003435]/10">

              <div className="absolute -right-10 -top-16 h-48 w-48 rounded-full border-[30px] border-white/5" />

              <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-5">

                <div className="h-14 w-14 rounded-2xl bg-[#ADEFE7] flex items-center justify-center shrink-0">
                  <Sparkles
                    size={27}
                    className="text-[#003435]"
                  />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white">
                    The Right Care Starts Here
                  </h3>

                  <p className="text-base text-[#D2E8E3] mt-2 leading-relaxed">
                    Explore doctor profiles, learn about their expertise,
                    and choose the specialist who fits your healthcare needs.
                  </p>
                </div>

              </div>
            </div>
          )}

        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Doctors;
