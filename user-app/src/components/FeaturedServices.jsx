
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Activity,
  HeartPulse,
  Stethoscope,
  ShieldCheck,
} from "lucide-react";
import api from "../api";

const FeaturedServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get("/services");

        setServices(response.data.services.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch services", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      {/* Section Heading */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-[#E7F4F1] border border-[#D4E4DE] rounded-full px-4 py-2 mb-5">
            <HeartPulse size={18} className="text-[#258B76]" />
            <span className="text-base font-semibold text-[#164B4D]">
              Our Healthcare
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold font-['Bricolage_Grotesque'] text-[#003435] leading-tight">
            Healthcare Services
            <span className="text-[#258B76]"> Designed Around You.</span>
          </h2>

          <p className="text-base md:text-lg text-[#52645F] mt-5 leading-relaxed">
            Explore our range of healthcare services, designed to support
            your health and make quality medical care more accessible.
          </p>
        </div>

        <Link
          to="/services"
          className="hidden sm:inline-flex items-center gap-2 bg-[#003F40] hover:bg-[#145B57] text-white px-6 py-3.5 rounded-xl font-semibold text-base transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#003435]/15"
        >
          View All Services
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
              <div className="w-16 h-16 rounded-2xl bg-[#E7F4F1] mb-7" />
              <div className="h-6 w-2/3 bg-[#E7F4F1] rounded-lg mb-5" />
              <div className="h-4 w-full bg-[#E7F4F1] rounded-lg mb-3" />
              <div className="h-4 w-4/5 bg-[#E7F4F1] rounded-lg mb-7" />
              <div className="h-4 w-1/2 bg-[#E7F4F1] rounded-lg" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {services.map((service) => (
            <div
              key={service._id}
              className="group relative bg-white border border-[#D4E4DE] rounded-[28px] p-7 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:border-[#9ACFC3] hover:shadow-[0_20px_50px_rgba(0,52,53,0.10)]"
            >
              {/* Decorative Background */}
              <div className="absolute top-0 right-0 w-36 h-36 bg-[#E7F4F1] rounded-bl-[100px] opacity-70 transition-all duration-300 group-hover:scale-110" />

              <div className="relative z-10">
                {/* Service Icon */}
                <div className="flex items-start justify-between mb-7">
                  <div className="w-16 h-16 bg-[#E7F4F1] border border-[#D4E4DE] rounded-2xl flex items-center justify-center text-[#164B4D] group-hover:bg-[#DDF3ED] transition-colors duration-300">
                    <Stethoscope size={30} strokeWidth={1.8} />
                  </div>

                  <div className="w-10 h-10 rounded-full bg-[#F5F8F6] border border-[#D4E4DE] flex items-center justify-center text-[#164B4D] group-hover:bg-[#003F40] group-hover:text-white group-hover:border-[#003F40] transition-all duration-300">
                    <ArrowUpRight size={19} />
                  </div>
                </div>

                {/* Service Name */}
                <h3 className="text-2xl font-bold font-['Bricolage_Grotesque'] text-[#003435] group-hover:text-[#258B76] transition-colors duration-300">
                  {service.name}
                </h3>

                {/* Description */}
                <p className="text-base text-[#52645F] mt-4 leading-relaxed min-h-[80px]">
                  {service.description}
                </p>

                {/* Divider */}
                <div className="border-t border-[#E5EEEA] my-6" />

                {/* Department */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 shrink-0 rounded-xl bg-[#F0F7F4] flex items-center justify-center text-[#256862]">
                    <Activity size={20} />
                  </div>

                  <div>
                    <p className="text-base text-[#65736F] mb-1">
                      Department
                    </p>
                    <p className="text-base font-semibold text-[#164B4D]">
                      {service.department?.name}
                    </p>
                  </div>
                </div>

                {/* Bottom Label */}
                <div className="mt-7 pt-5 border-t border-[#E5EEEA] flex items-center justify-between">
                  <span className="text-base font-semibold text-[#003F40]">
                    Quality Healthcare
                  </span>

                  <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[#E7F4F1] text-[#164B4D] group-hover:bg-[#003F40] group-hover:text-white transition-all duration-300">
                    <ArrowRight size={18} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mobile View All Button */}
      <div className="mt-9 sm:hidden">
        <Link
          to="/services"
          className="w-full inline-flex items-center justify-center gap-2 bg-[#003F40] hover:bg-[#145B57] text-white px-6 py-4 rounded-xl font-semibold text-base transition-all duration-300"
        >
          View All Services
          <ArrowRight size={19} />
        </Link>
      </div>

      {/* Bottom Trust Note */}
      <div className="mt-12 bg-[#E7F4F1] border border-[#D4E4DE] rounded-2xl px-6 py-5 flex flex-col sm:flex-row items-center justify-center gap-3 text-center">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#258B76]">
          <ShieldCheck size={21} />
        </div>

        <p className="text-base text-[#164B4D] font-medium">
          Your well-being is our priority.
          <span className="font-bold text-[#003435]">
            {" "}Healthcare you can trust.
          </span>
        </p>
      </div>
    </section>
  );
};

export default FeaturedServices;