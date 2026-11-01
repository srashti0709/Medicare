
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../api";

import {
  Activity,
  ArrowUpRight,
  ArrowRight,
  HeartPulse,
  ShieldCheck,
  Stethoscope,
  LoaderCircle,
} from "lucide-react";

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get("/services");

        setServices(response.data.services);
      } catch (error) {
        console.error("Failed to fetch services", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F8F6]">
      <Navbar />

      <main className="relative overflow-hidden py-10 md:py-14">
        {/* Background Decorations */}
        <div className="absolute -top-24 -right-20 h-80 w-80 rounded-full bg-[#ADEFE7]/30 blur-3xl pointer-events-none" />
        <div className="absolute top-96 -left-24 h-72 w-72 rounded-full bg-[#dcf3ee]/60 blur-3xl pointer-events-none" />

        <section className="relative max-w-7xl mx-auto px-4 sm:px-6">

          {/* Page Heading */}
          <div className="text-center mb-12">

            <div className="inline-flex items-center gap-2 rounded-full border border-[#CBDAD6] bg-white px-4 py-2 text-base font-semibold text-[#256862] mb-5 shadow-sm">
              <HeartPulse size={19} />
              Medicare Healthcare
            </div>

            <p className="text-base font-bold uppercase tracking-widest text-[#256862] mb-3">
              Comprehensive Care
            </p>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#003435] tracking-tight">
              Our Healthcare Services
            </h1>

            <p className="mt-4 text-base sm:text-lg text-[#65736F] max-w-2xl mx-auto leading-relaxed">
              Explore our range of medical services, diagnostic facilities,
              and specialized healthcare solutions designed around your needs.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mt-7">
              <div className="flex items-center gap-2 bg-white border border-[#CBDAD6] rounded-xl px-4 py-3 shadow-sm">
                <ShieldCheck size={21} className="text-[#256862]" />
                <span className="text-base font-medium text-[#164B4D]">
                  Trusted Healthcare
                </span>
              </div>

              <div className="flex items-center gap-2 bg-white border border-[#CBDAD6] rounded-xl px-4 py-3 shadow-sm">
                <Activity size={21} className="text-[#256862]" />
                <span className="text-base font-medium text-[#164B4D]">
                  Quality Medical Services
                </span>
              </div>
            </div>
          </div>

          {/* Services Section Header */}
          <div className="mb-7">
            <h2 className="text-2xl font-bold text-[#003435]">
              Explore Our Services
            </h2>

            <p className="text-base text-[#65736F] mt-2">
              Discover the healthcare facilities available at Medicare.
            </p>
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
                Loading Services
              </h3>

              <p className="text-base text-[#65736F] mt-3">
                Please wait while we fetch our healthcare services.
              </p>
            </div>

          ) : services.length === 0 ? (

            /* Empty State */
            <div className="bg-white border border-[#CBDAD6] rounded-3xl py-16 px-6 text-center shadow-sm">
              <div className="h-20 w-20 rounded-3xl bg-[#E7F4F1] flex items-center justify-center mx-auto mb-6">
                <Stethoscope
                  size={38}
                  className="text-[#256862]"
                />
              </div>

              <h3 className="text-2xl font-bold text-[#003435]">
                No Services Available
              </h3>

              <p className="text-base text-[#65736F] mt-3 max-w-md mx-auto leading-relaxed">
                There are currently no healthcare services available.
                Please check back later.
              </p>
            </div>

          ) : (

            /* Services Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">

              {services.map((service) => (
                <div
                  key={service._id}
                  className="group bg-white border border-[#CBDAD6] rounded-3xl overflow-hidden shadow-[0_6px_24px_rgba(0,52,53,0.04)] hover:shadow-[0_16px_40px_rgba(0,52,53,0.12)] hover:-translate-y-1 hover:border-[#9ACFC3] transition-all duration-300"
                >

                  {/* Card Image */}
                  <div className="relative h-[280px] bg-[#E7F4F1] overflow-hidden">

                    {service.image ? (
                      <img
                        src={service.image}
                        alt={service.name}
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

                    {/* Image Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#003435] via-[#003435]/35 to-transparent" />

                    {/* Service Label */}
                    <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/95 border border-white/60 rounded-full px-4 py-2 shadow-sm">
                      <HeartPulse
                        size={16}
                        className="text-[#258B76]"
                      />
                      <span className="text-sm font-semibold text-[#164B4D]">
                        Healthcare Service
                      </span>
                    </div>

                    {/* Image Icon */}
                    <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 border border-[#D4E4DE] flex items-center justify-center text-[#164B4D] group-hover:bg-[#003F40] group-hover:text-white transition-all duration-300">
                      <ArrowUpRight size={19} />
                    </div>

                    {/* Service Name on Image */}
                    <div className="absolute bottom-0 inset-x-0 p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <ShieldCheck
                          size={17}
                          className="text-[#ADEFE7]"
                        />
                        <span className="text-sm font-medium text-white bg-white/10 border border-white/15 rounded-full px-3 py-1">
                          Medicare Service
                        </span>
                      </div>

                      <h3 className="text-2xl font-bold text-white leading-snug">
                        {service.name}
                      </h3>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6">

                    {/* Department */}
                    <div className="flex items-center gap-3 mb-5">
                      <div className="h-11 w-11 rounded-xl bg-[#E7F4F1] flex items-center justify-center shrink-0">
                        <Activity
                          size={21}
                          className="text-[#256862]"
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="text-base text-[#65736F]">
                          Department
                        </p>

                        <p className="text-base font-semibold text-[#164B4D] mt-1">
                          {service.department?.name || "Medical Department"}
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="bg-[#F5F8F6] border border-[#E5EEEA] rounded-2xl p-4 min-h-[120px]">
                      <p className="text-base text-[#52645F] leading-relaxed line-clamp-4">
                        {service.description}
                      </p>
                    </div>

                    {/* Bottom Section */}
                    <div className="mt-6 pt-5 border-t border-[#E5EEEB]">
                      <div className="flex items-center justify-between text-[#256862] group-hover:text-[#003435] transition-colors">
                        <div className="flex items-center gap-2">
                          <ShieldCheck size={19} />
                          <span className="text-base font-bold">
                            Quality Healthcare
                          </span>
                        </div>

                        <div className="h-10 w-10 rounded-xl bg-[#E7F4F1] group-hover:bg-[#ADEFE7] flex items-center justify-center transition-all duration-300">
                          <ArrowRight
                            size={21}
                            className="transition-transform duration-300 group-hover:translate-x-1"
                          />
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              ))}

            </div>
          )}

          {/* Bottom Information Banner */}
          {!loading && services.length > 0 && (
            <div className="mt-10 bg-[#003435] rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-lg shadow-[#003435]/10">

              <div className="absolute -right-10 -top-16 h-48 w-48 rounded-full border-[30px] border-white/5" />

              <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <div className="h-14 w-14 rounded-2xl bg-[#ADEFE7] flex items-center justify-center shrink-0">
                  <HeartPulse
                    size={27}
                    className="text-[#003435]"
                  />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white">
                    Your Health, Our Priority
                  </h3>

                  <p className="text-base text-[#D2E8E3] mt-2 leading-relaxed">
                    From diagnosis to specialized care, explore the services
                    that help you take a confident step towards better health.
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

export default Services;
