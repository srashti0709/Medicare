import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../api";

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
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        <div className="text-center mb-10">
          <p className="text-blue-600 font-semibold mb-2">
            Healthcare Services
          </p>

          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
            Our Services
          </h1>

          <p className="mt-3 text-slate-600">
            Explore the healthcare services available at Medicare.
          </p>
        </div>

        {loading ? (
          <p className="text-center text-slate-500">
            Loading services...
          </p>
        ) : services.length === 0 ? (
          <p className="text-center text-slate-500">
            No services available.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {services.map((service) => (
              <div
                key={service._id}
                className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition"
              >
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-2xl mb-5">
                  🏥
                </div>

                <h2 className="text-xl font-bold text-slate-900">
                  {service.name}
                </h2>

                <p className="text-slate-600 mt-3 leading-relaxed">
                  {service.description}
                </p>

                <p className="text-sm text-blue-600 font-medium mt-4">
                  {service.department?.name}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
};

export default Services;