
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  CalendarCheck,
  Clock3,
  GraduationCap,
  Stethoscope,
} from "lucide-react";
import api from "../api";

const FeaturedDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await api.get("/doctors");

        setDoctors(response.data.doctors.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch doctors", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      {/* Section Heading */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-[#E7F4F1] border border-[#D4E4DE] rounded-full px-4 py-2 mb-5">
            <Stethoscope size={18} className="text-[#258B76]" />
            <span className="text-base font-semibold text-[#164B4D]">
              Meet Our Doctors
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold font-['Bricolage_Grotesque'] text-[#003435] leading-tight">
            Trusted Specialists,
            <span className="text-[#258B76]"> Compassionate Care.</span>
          </h2>

          <p className="text-base md:text-lg text-[#52645F] mt-5 leading-relaxed">
            Your health deserves expert attention. Connect with experienced
            healthcare professionals who put your well-being first.
          </p>
        </div>

        <Link
          to="/doctors"
          className="hidden sm:inline-flex items-center gap-2 bg-[#003F40] hover:bg-[#145B57] text-white px-6 py-3.5 rounded-xl font-semibold text-base transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#003435]/15"
        >
          View All Doctors
          <ArrowUpRight size={19} />
        </Link>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="bg-white border border-[#D4E4DE] rounded-[28px] p-7 animate-pulse"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#E7F4F1] mb-6" />
              <div className="h-6 w-2/3 bg-[#E7F4F1] rounded-lg mb-4" />
              <div className="h-4 w-1/2 bg-[#E7F4F1] rounded-lg mb-6" />
              <div className="h-4 w-full bg-[#E7F4F1] rounded-lg mb-3" />
              <div className="h-4 w-3/4 bg-[#E7F4F1] rounded-lg" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {doctors.map((doctor) => (
            <Link
              key={doctor._id}
              to={`/doctors/${doctor._id}`}
              className="group relative bg-white border border-[#D4E4DE] rounded-[28px] p-7 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:border-[#9ACFC3] hover:shadow-[0_20px_50px_rgba(0,52,53,0.10)]"
            >
              {/* Decorative Background */}
              <div className="absolute top-0 right-0 w-36 h-36 bg-[#E7F4F1] rounded-bl-[100px] opacity-70 transition-all duration-300 group-hover:scale-110" />

              <div className="relative z-10">
                {/* Doctor Profile Image */}
                <div className="relative -mx-7 -mt-7 mb-7 h-[260px] bg-[#E7F4F1] overflow-hidden">
                  {doctor.profileImage ? (
                    <img
                      src={doctor.profileImage}
                      alt={doctor.user?.name || "Doctor"}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Stethoscope
                        size={75}
                        strokeWidth={1.4}
                        className="text-[#256862]"
                      />
                    </div>
                  )}

                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 border border-[#D4E4DE] flex items-center justify-center text-[#164B4D] group-hover:bg-[#003F40] group-hover:text-white group-hover:border-[#003F40] transition-all duration-300">
                    <ArrowUpRight size={19} />
                  </div>
                </div>

                {/* Doctor Details */}
                <h3 className="text-2xl font-bold font-['Bricolage_Grotesque'] text-[#003435] group-hover:text-[#258B76] transition-colors duration-300">
                  {doctor.user?.name}
                </h3>

                <div className="inline-flex items-center gap-2 mt-3 bg-[#E7F4F1] px-3.5 py-2 rounded-full">
                  <Award size={17} className="text-[#258B76]" />
                  <p className="text-base font-semibold text-[#164B4D]">
                    {doctor.specialization}
                  </p>
                </div>

                {/* Divider */}
                <div className="border-t border-[#E5EEEA] my-6" />

                {/* Qualification */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-9 h-9 shrink-0 rounded-xl bg-[#F0F7F4] flex items-center justify-center text-[#256862]">
                    <GraduationCap size={19} />
                  </div>

                  <div>
                    <p className="text-base text-[#65736F] mb-1">
                      Qualification
                    </p>
                    <p className="text-base font-semibold text-[#164B4D]">
                      {doctor.qualification}
                    </p>
                  </div>
                </div>

                {/* Experience */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 shrink-0 rounded-xl bg-[#F0F7F4] flex items-center justify-center text-[#256862]">
                    <Clock3 size={19} />
                  </div>

                  <div>
                    <p className="text-base text-[#65736F] mb-1">
                      Professional Experience
                    </p>
                    <p className="text-base font-semibold text-[#164B4D]">
                      {doctor.experience} years experience
                    </p>
                  </div>
                </div>

                {/* Profile Link */}
                <div className="mt-7 pt-5 border-t border-[#E5EEEA] flex items-center justify-between">
                  <span className="text-base font-semibold text-[#003F40] group-hover:text-[#258B76] transition-colors">
                    View Doctor Profile
                  </span>

                  <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[#E7F4F1] text-[#164B4D] group-hover:bg-[#003F40] group-hover:text-white transition-all duration-300">
                    <ArrowRight size={18} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Mobile View All Button */}
      <div className="mt-9 sm:hidden">
        <Link
          to="/doctors"
          className="w-full inline-flex items-center justify-center gap-2 bg-[#003F40] hover:bg-[#145B57] text-white px-6 py-4 rounded-xl font-semibold text-base transition-all duration-300"
        >
          View All Doctors
          <ArrowRight size={19} />
        </Link>
      </div>

      {/* Bottom Trust Note */}
      <div className="mt-12 bg-[#E7F4F1] border border-[#D4E4DE] rounded-2xl px-6 py-5 flex flex-col sm:flex-row items-center justify-center gap-3 text-center">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#258B76]">
          <CalendarCheck size={21} />
        </div>

        <p className="text-base text-[#164B4D] font-medium">
          Quality healthcare starts with the right specialist.
          <span className="font-bold text-[#003435]">
            {" "}Find the care you deserve.
          </span>
        </p>
      </div>
    </section>
  );
};

export default FeaturedDoctors;
