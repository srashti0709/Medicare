
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
    <div className="services-page min-h-screen overflow-hidden bg-[#F5F8F6]">
      <Navbar />

      <main className="relative overflow-hidden py-10 md:py-14">
        {/* Background Decorations */}
        <div className="services-orb services-orb-one pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-[#ADEFE7]/30 blur-3xl" />
        <div className="services-orb services-orb-two pointer-events-none absolute -left-24 top-96 h-72 w-72 rounded-full bg-[#dcf3ee]/60 blur-3xl" />
        <div className="services-orb services-orb-three pointer-events-none absolute -bottom-20 right-1/4 h-64 w-64 rounded-full bg-[#ADEFE7]/20 blur-3xl" />

        <section className="relative mx-auto max-w-7xl px-4 sm:px-6">

          {/* Page Heading */}
          <div className="services-heading mb-12 text-center">
            <div className="services-heading-badge mb-5 inline-flex items-center gap-2 rounded-full border border-[#CBDAD6] bg-white px-4 py-2 text-base font-semibold text-[#256862] shadow-sm">
              <HeartPulse size={19} className="services-heart-icon" />
              Medicare Healthcare
            </div>

            <p className="mb-3 text-base font-bold uppercase tracking-widest text-[#256862]">
              Comprehensive Care
            </p>

            <h1 className="font-['Bricolage_Grotesque'] text-3xl font-bold tracking-tight text-[#003435] sm:text-4xl md:text-5xl">
              Our Healthcare Services
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[#65736F] sm:text-lg">
              Explore our range of medical services, diagnostic facilities,
              and specialized healthcare solutions designed around your needs.
            </p>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
              <div className="services-trust-item flex items-center gap-2 rounded-xl border border-[#CBDAD6] bg-white px-4 py-3 shadow-sm">
                <ShieldCheck size={21} className="text-[#256862]" />
                <span className="text-base font-medium text-[#164B4D]">
                  Trusted Healthcare
                </span>
              </div>

              <div className="services-trust-item flex items-center gap-2 rounded-xl border border-[#CBDAD6] bg-white px-4 py-3 shadow-sm">
                <Activity size={21} className="text-[#256862]" />
                <span className="text-base font-medium text-[#164B4D]">
                  Quality Medical Services
                </span>
              </div>
            </div>
          </div>

          {/* Services Section Header */}
          <div className="services-section-heading mb-7">
            <div className="flex items-center gap-3">
              <div className="h-8 w-1.5 rounded-full bg-[#258B76]" />
              <h2 className="font-['Bricolage_Grotesque'] text-2xl font-bold text-[#003435]">
                Explore Our Services
              </h2>
            </div>

            <p className="mt-2 text-base text-[#65736F]">
              Discover the healthcare facilities available at Medicare.
            </p>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="services-state-card rounded-3xl border border-[#CBDAD6] bg-white px-6 py-16 text-center shadow-sm">
              <div className="services-loading-icon mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#E7F4F1]">
                <LoaderCircle
                  size={38}
                  className="animate-spin text-[#256862]"
                />
              </div>

              <h3 className="text-xl font-bold text-[#003435]">
                Loading Services
              </h3>

              <p className="mt-3 text-base text-[#65736F]">
                Please wait while we fetch our healthcare services.
              </p>
            </div>
          ) : services.length === 0 ? (

            /* Empty State */
            <div className="services-state-card rounded-3xl border border-[#CBDAD6] bg-white px-6 py-16 text-center shadow-sm">
              <div className="services-empty-icon mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#E7F4F1]">
                <Stethoscope
                  size={38}
                  className="text-[#256862]"
                />
              </div>

              <h3 className="font-['Bricolage_Grotesque'] text-2xl font-bold text-[#003435]">
                No Services Available
              </h3>

              <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-[#65736F]">
                There are currently no healthcare services available.
                Please check back later.
              </p>
            </div>

          ) : (

            /* Services Grid */
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">

              {services.map((service, index) => (
                <div
                  key={service._id}
                  style={{ animationDelay: `${index * 120}ms` }}
                  className="services-card group relative overflow-hidden rounded-3xl border border-[#CBDAD6] bg-white shadow-[0_6px_24px_rgba(0,52,53,0.04)] transition-all duration-500 hover:-translate-y-2 hover:border-[#9ACFC3] hover:shadow-[0_20px_45px_rgba(0,52,53,0.12)]"
                >

                  {/* Card Image */}
                  <div className="relative h-[280px] overflow-hidden bg-[#E7F4F1]">

                    {service.image ? (
                      <img
                        src={service.image}
                        alt={service.name}
                        className="services-card-image h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Stethoscope
                          size={75}
                          strokeWidth={1.4}
                          className="services-placeholder-icon text-[#256862]"
                        />
                      </div>
                    )}

                    {/* Image Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#003435] via-[#003435]/35 to-transparent" />

                    {/* Service Label */}
                    <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/60 bg-white/95 px-4 py-2 shadow-sm transition-transform duration-300 group-hover:-translate-y-1">
                      <HeartPulse
                        size={16}
                        className="text-[#258B76]"
                      />
                      <span className="text-sm font-semibold text-[#164B4D]">
                        Healthcare Service
                      </span>
                    </div>

                    {/* Image Icon */}
                    <div className="services-arrow-icon absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-[#D4E4DE] bg-white/90 text-[#164B4D] transition-all duration-300 group-hover:rotate-12 group-hover:bg-[#003F40] group-hover:text-white">
                      <ArrowUpRight size={19} />
                    </div>

                    {/* Service Name on Image */}
                    <div className="absolute inset-x-0 bottom-0 p-6">
                      <div className="mb-3 flex items-center gap-2">
                        <ShieldCheck
                          size={17}
                          className="text-[#ADEFE7]"
                        />
                        <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm font-medium text-white">
                          Medicare Service
                        </span>
                      </div>

                      <h3 className="font-['Bricolage_Grotesque'] text-2xl font-bold leading-snug text-white transition-transform duration-300 group-hover:translate-x-1">
                        {service.name}
                      </h3>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6">

                    {/* Department */}
                    <div className="mb-5 flex items-center gap-3">
                      <div className="services-department-icon flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E7F4F1] transition-all duration-300">
                        <Activity
                          size={21}
                          className="text-[#256862]"
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="text-base text-[#65736F]">
                          Department
                        </p>

                        <p className="mt-1 text-base font-semibold text-[#164B4D]">
                          {service.department?.name || "Medical Department"}
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="min-h-[120px] rounded-2xl border border-[#E5EEEA] bg-[#F5F8F6] p-4 transition-colors duration-300 group-hover:border-[#CDE4DA] group-hover:bg-[#EFF8F4]">
                      <p className="line-clamp-4 text-base leading-relaxed text-[#52645F]">
                        {service.description}
                      </p>
                    </div>

                    {/* Bottom Section */}
                    <div className="mt-6 border-t border-[#E5EEEB] pt-5">
                      <div className="flex items-center justify-between text-[#256862] transition-colors group-hover:text-[#003435]">
                        <div className="flex items-center gap-2">
                          <ShieldCheck size={19} />
                          <span className="text-base font-bold">
                            Quality Healthcare
                          </span>
                        </div>

                        <div className="services-bottom-icon flex h-10 w-10 items-center justify-center rounded-xl bg-[#E7F4F1] transition-all duration-300 group-hover:bg-[#ADEFE7]">
                          <ArrowRight
                            size={21}
                            className="transition-transform duration-300 group-hover:translate-x-1"
                          />
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Bottom Decorative Line */}
                  <div className="services-card-line absolute bottom-0 left-0 h-[3px] w-0 bg-gradient-to-r from-[#258B76] to-[#ADEFE7] transition-all duration-500 group-hover:w-full" />
                </div>
              ))}

            </div>
          )}

          {/* Bottom Information Banner */}
          {!loading && services.length > 0 && (
            <div className="services-bottom-banner relative mt-10 overflow-hidden rounded-3xl bg-[#003435] p-6 shadow-lg shadow-[#003435]/10 sm:p-8">

              <div className="services-banner-ring absolute -right-10 -top-16 h-48 w-48 rounded-full border-[30px] border-white/5" />
              <div className="services-banner-glow absolute -bottom-24 -left-16 h-48 w-48 rounded-full bg-[#ADEFE7]/10 blur-3xl" />

              <div className="relative flex flex-col items-start gap-5 sm:flex-row sm:items-center">
                <div className="services-banner-icon flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#ADEFE7]">
                  <HeartPulse
                    size={27}
                    className="text-[#003435]"
                  />
                </div>

                <div>
                  <h3 className="font-['Bricolage_Grotesque'] text-xl font-bold text-white">
                    Your Health, Our Priority
                  </h3>

                  <p className="mt-2 text-base leading-relaxed text-[#D2E8E3]">
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

      {/* Animation Styles */}
      <style>{`
        .services-page {
          --services-ease: cubic-bezier(0.22, 1, 0.36, 1);
        }

        @keyframes servicesFadeUp {
          from {
            opacity: 0;
            transform: translateY(28px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes servicesFadeDown {
          from {
            opacity: 0;
            transform: translateY(-18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes servicesFloat {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(0, -22px, 0);
          }
        }

        @keyframes servicesFloatReverse {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(0, 20px, 0);
          }
        }

        @keyframes servicesPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.06);
            opacity: 0.75;
          }
        }

        @keyframes servicesSpin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes servicesIconBounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        .services-heading {
          animation: servicesFadeUp 0.8s var(--services-ease) both;
        }

        .services-heading-badge {
          animation: servicesFadeDown 0.8s var(--services-ease) both;
        }

        .services-heart-icon {
          animation: servicesPulse 3s ease-in-out infinite;
        }

        .services-section-heading {
          animation: servicesFadeUp 0.8s 0.15s var(--services-ease) both;
        }

        .services-trust-item {
          animation: servicesFadeUp 0.8s 0.25s var(--services-ease) both;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .services-trust-item:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 25px rgba(0, 52, 53, 0.08);
        }

        .services-orb-one {
          animation: servicesFloat 9s ease-in-out infinite;
        }

        .services-orb-two {
          animation: servicesFloatReverse 11s ease-in-out infinite;
        }

        .services-orb-three {
          animation: servicesFloat 12s ease-in-out infinite;
        }

        .services-card {
          opacity: 0;
          animation: servicesFadeUp 0.75s var(--services-ease) forwards;
          will-change: transform, opacity;
        }

        .services-card-image {
          transition: transform 0.8s var(--services-ease);
        }

        .services-placeholder-icon {
          animation: servicesFloat 5s ease-in-out infinite;
        }

        .services-arrow-icon {
          transition: transform 0.35s ease, background 0.35s ease, color 0.35s ease;
        }

        .services-department-icon {
          transition: transform 0.35s ease, background 0.35s ease;
        }

        .services-card:hover .services-department-icon {
          transform: rotate(-6deg) scale(1.08);
          background: #DDF3ED;
        }

        .services-card:hover .services-bottom-icon {
          transform: rotate(5deg) scale(1.08);
        }

        .services-state-card {
          animation: servicesFadeUp 0.7s var(--services-ease) both;
        }

        .services-loading-icon {
          animation: servicesPulse 2.5s ease-in-out infinite;
        }

        .services-empty-icon {
          animation: servicesFloat 4s ease-in-out infinite;
        }

        .services-bottom-banner {
          animation: servicesFadeUp 0.8s var(--services-ease) both;
        }

        .services-banner-ring {
          animation: servicesSpin 35s linear infinite;
        }

        .services-banner-icon {
          animation: servicesIconBounce 4s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .services-page *,
          .services-page *::before,
          .services-page *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }

          .services-card {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default Services;
