import { useEffect, useMemo, useState } from "react";
import api from "../api";

/*
 * Medicare Services Dashboard
 * Functionality preserved:
 * - Fetch services
 * - Fetch departments
 * - Update service
 * - Toggle service status
 * - Add service callback
 * - Edit modal
 */

const fontStyles = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;600;700&family=Manrope:wght@400;500;600;700&display=swap');

.medicare-services {
  font-family: 'Manrope', ui-sans-serif, system-ui, sans-serif;
  color: #0F3437;
  -webkit-font-smoothing: antialiased;
}

.medicare-services .md-display {
  font-family: 'Bricolage Grotesque', 'Manrope', ui-sans-serif, system-ui, sans-serif;
  letter-spacing: -0.02em;
}

.medicare-services button,
.medicare-services input,
.medicare-services select,
.medicare-services textarea {
  font-family: inherit;
}

@keyframes md-spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes md-modal-in {
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.99);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.medicare-services .md-spinner {
  animation: md-spin 0.8s linear infinite;
}

.medicare-services .md-modal {
  animation: md-modal-in 0.18s ease-out;
}

@media (prefers-reduced-motion: reduce) {
  .medicare-services .md-spinner,
  .medicare-services .md-modal {
    animation: none;
  }
}
`;

const inputClass =
  "w-full bg-white border border-[#CBDAD6] rounded-xl px-3.5 py-2.5 text-sm text-[#0F3437] placeholder:text-[#8FA6A2] outline-none transition focus:border-[#164B4D] focus:ring-2 focus:ring-[#9ADBD3]/60";

const labelClass =
  "block text-[13px] font-semibold text-[#164B4D] mb-1.5";

const Services = ({ onAddService }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/services");
      setServices(response.data.services);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to fetch services"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await api.get("/departments");
      setDepartments(response.data.departments);
    } catch (error) {
      console.error("Failed to fetch departments", error);
    }
  };

  useEffect(() => {
    fetchServices();
    fetchDepartments();
  }, []);

  const updateService = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const token = localStorage.getItem("adminToken");

      const response = await api.patch(
        `/services/${selectedService._id}`,
        {
          name: selectedService.name,
          description: selectedService.description || "",
          department:
            selectedService.department?._id ||
            selectedService.department,
          image: selectedService.image || "",
          isActive: selectedService.isActive,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setServices((currentServices) =>
        currentServices.map((service) =>
          service._id === selectedService._id
            ? response.data.service
            : service
        )
      );

      setSelectedService(null);

      alert("Service updated successfully.");
    } catch (error) {
      console.error("Failed to update service", error);

      alert(
        error.response?.data?.message ||
          "Failed to update service"
      );
    } finally {
      setSaving(false);
    }
  };

  const toggleServiceStatus = async (serviceId) => {
    try {
      const token = localStorage.getItem("adminToken");

      const response = await api.patch(
        `/services/${serviceId}/toggle-status`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setServices((currentServices) =>
        currentServices.map((service) =>
          service._id === serviceId
            ? response.data.service
            : service
        )
      );

      alert(response.data.message);
    } catch (error) {
      console.error(
        "Failed to update service status",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to update service status"
      );
    }
  };

  const totalServices = services.length;

  const activeServices = services.filter(
    (service) => service.isActive
  ).length;

  const inactiveServices = services.filter(
    (service) => !service.isActive
  ).length;

  const departmentCount = new Set(
    services
      .map((service) => service.department?.name)
      .filter(Boolean)
  ).size;

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const search = searchTerm.toLowerCase().trim();

      const serviceName =
        service.name?.toLowerCase() || "";

      const description =
        service.description?.toLowerCase() || "";

      const department =
        service.department?.name?.toLowerCase() || "";

      const matchesSearch =
        !search ||
        serviceName.includes(search) ||
        description.includes(search) ||
        department.includes(search);

      const matchesDepartment =
        departmentFilter === "all" ||
        service.department?.name === departmentFilter;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && service.isActive) ||
        (statusFilter === "inactive" && !service.isActive);

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesStatus
      );
    });
  }, [
    services,
    searchTerm,
    departmentFilter,
    statusFilter,
  ]);

  const resetFilters = () => {
    setSearchTerm("");
    setDepartmentFilter("all");
    setStatusFilter("all");
  };

  return (
    <div className="medicare-services min-h-full">
      <style>{fontStyles}</style>

      <div className="p-6 xl:p-8">
        <div className="max-w-[1450px] mx-auto space-y-6">

          {/* PAGE HEADER */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-[#2E9C8F] animate-pulse" />

                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#256862]">
                  Clinical Operations
                </span>
              </div>

              <h2 className="md-display text-[25px] leading-8 font-semibold text-[#164B4D]">
                Services
              </h2>

              <p className="text-xs text-[#526563] mt-1">
                Manage hospital services and departments across
                inpatient and outpatient care.
              </p>
            </div>

            <button
              onClick={onAddService}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#164B4D] text-white text-sm font-semibold shadow-[0_4px_12px_rgba(15,52,55,0.15)] hover:bg-[#0F3437] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9ADBD3] focus-visible:ring-offset-2"
            >
              <span className="text-lg leading-none">
                +
              </span>

              Add Service
            </button>
          </div>

          {/* ERROR */}
          {error && (
            <div
              role="alert"
              className="flex items-start gap-3 bg-[#FDF1EA] border border-[#F5CDB8] border-l-4 border-l-[#F28B5B] text-[#8F3A17] px-4 py-3 rounded-xl text-sm font-medium"
            >
              <span className="text-[#F28B5B] font-bold">
                !
              </span>

              <span>{error}</span>
            </div>
          )}

          {/* OVERVIEW METRICS */}
          {!loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

              {/* TOTAL */}
              <div className="bg-white rounded-2xl p-5 border border-[#DCEAE7] shadow-[0_8px_30px_-22px_rgba(15,52,55,0.45)] hover:border-[#9ADBD3] transition-all flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-[#5B7773] uppercase tracking-wider">
                    Total Services
                  </span>

                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="md-display text-[36px] leading-[44px] font-bold text-[#164B4D]">
                      {totalServices}
                    </span>

                    <span className="text-[11px] font-semibold text-[#256862]">
                      Catalog
                    </span>
                  </div>

                  <p className="text-xs text-[#5B7773] mt-1">
                    Registered hospital services
                  </p>
                </div>

                <div className="w-12 h-12 rounded-xl bg-[#E1F3F0] text-[#164B4D] flex items-center justify-center">
                  <span className="text-2xl">
                    +
                  </span>
                </div>
              </div>

              {/* ACTIVE */}
              <div className="bg-white rounded-2xl p-5 border border-[#DCEAE7] shadow-[0_8px_30px_-22px_rgba(15,52,55,0.45)] hover:border-[#9ADBD3] transition-all flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-[#5B7773] uppercase tracking-wider">
                    Active Services
                  </span>

                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="md-display text-[36px] leading-[44px] font-bold text-[#164B4D]">
                      {activeServices}
                    </span>

                    <span className="px-1.5 py-0.5 rounded bg-[#ADEFE7] text-[#00504A] text-[11px] font-bold">
                      Live
                    </span>
                  </div>

                  <p className="text-xs text-[#5B7773] mt-1">
                    Available for booking
                  </p>
                </div>

                <div className="w-12 h-12 rounded-xl bg-[#E1F3F0] text-[#256862] flex items-center justify-center">
                  <span className="text-xl">
                    ✓
                  </span>
                </div>
              </div>

              {/* INACTIVE */}
              <div className="bg-white rounded-2xl p-5 border border-[#DCEAE7] shadow-[0_8px_30px_-22px_rgba(15,52,55,0.45)] hover:border-[#9ADBD3] transition-all flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-[#5B7773] uppercase tracking-wider">
                    Inactive Services
                  </span>

                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="md-display text-[36px] leading-[44px] font-bold text-[#531C00]">
                      {inactiveServices}
                    </span>

                    <span className="px-1.5 py-0.5 rounded bg-[#FFDBCD] text-[#7A3005] text-[11px] font-bold">
                      Review
                    </span>
                  </div>

                  <p className="text-xs text-[#5B7773] mt-1">
                    Currently unavailable
                  </p>
                </div>

                <div className="w-12 h-12 rounded-xl bg-[#FDEEE6] text-[#A8441A] flex items-center justify-center">
                  <span className="text-xl">
                    II
                  </span>
                </div>
              </div>

              {/* DEPARTMENTS */}
              <div className="bg-white rounded-2xl p-5 border border-[#DCEAE7] shadow-[0_8px_30px_-22px_rgba(15,52,55,0.45)] hover:border-[#9ADBD3] transition-all flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-[#5B7773] uppercase tracking-wider">
                    Departments Covered
                  </span>

                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="md-display text-[36px] leading-[44px] font-bold text-[#164B4D]">
                      {departmentCount}
                    </span>

                    <span className="text-[11px] font-semibold text-[#256862]">
                      Clinical
                    </span>
                  </div>

                  <p className="text-xs text-[#5B7773] mt-1">
                    Departments represented
                  </p>
                </div>

                <div className="w-12 h-12 rounded-xl bg-[#E7EFED] text-[#164B4D] flex items-center justify-center">
                  <span className="text-xl">
                    ▦
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* MAIN REGISTRY */}
          <div className="bg-white rounded-2xl border border-[#DCEAE7] shadow-[0_8px_30px_-22px_rgba(15,52,55,0.45)] overflow-hidden">

            {/* REGISTRY HEADER */}
            <div className="px-6 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="md-display text-[24px] leading-8 font-semibold text-[#164B4D]">
                  Service Registry
                </h3>

                <p className="text-xs text-[#526563] mt-1">
                  Central directory of hospital services and departments.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E7EFED] text-[#5B7773] text-[11px] font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#2E9C8F]" />
                  Registry synced
                </div>

                <button
                  onClick={fetchServices}
                  className="w-9 h-9 rounded-xl bg-[#F5F8F6] hover:bg-[#E7EFED] text-[#5B7773] flex items-center justify-center transition-colors"
                  title="Refresh services"
                >
                  ↻
                </button>
              </div>
            </div>

            {/* FILTER BAR */}
            <div className="px-6 pb-4">
              <div className="flex flex-col lg:flex-row gap-2.5">

                {/* SEARCH */}
                <div className="relative flex-1">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5B7773]">
                    ⌕
                  </span>

                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) =>
                      setSearchTerm(e.target.value)
                    }
                    placeholder="Search services by name, department, or keyword..."
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F5F8F6] border border-transparent rounded-xl text-sm text-[#0F3437] placeholder:text-[#8FA6A2] outline-none focus:bg-white focus:border-[#CBDAD6] focus:ring-2 focus:ring-[#9ADBD3]/50 transition"
                  />
                </div>

                {/* DEPARTMENT */}
                <select
                  value={departmentFilter}
                  onChange={(e) =>
                    setDepartmentFilter(e.target.value)
                  }
                  className="lg:w-52 px-3.5 py-2.5 bg-[#F5F8F6] border border-transparent rounded-xl text-[13px] font-semibold text-[#0F3437] outline-none focus:bg-white focus:border-[#CBDAD6] focus:ring-2 focus:ring-[#9ADBD3]/50"
                >
                  <option value="all">
                    All Departments
                  </option>

                  {departments.map((department) => (
                    <option
                      key={department._id}
                      value={department.name}
                    >
                      {department.name}
                    </option>
                  ))}
                </select>

                {/* STATUS */}
                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value)
                  }
                  className="lg:w-40 px-3.5 py-2.5 bg-[#F5F8F6] border border-transparent rounded-xl text-[13px] font-semibold text-[#0F3437] outline-none focus:bg-white focus:border-[#CBDAD6] focus:ring-2 focus:ring-[#9ADBD3]/50"
                >
                  <option value="all">
                    Status: All
                  </option>

                  <option value="active">
                    Active
                  </option>

                  <option value="inactive">
                    Inactive
                  </option>
                </select>

                {/* RESET */}
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#F5F8F6] hover:bg-[#E7EFED] rounded-xl text-[13px] font-semibold text-[#5B7773] transition-colors"
                >
                  ↺
                  Reset
                </button>
              </div>
            </div>

            {/* LOADING */}
            {loading ? (
              <div className="px-10 py-20 text-center border-t border-[#EDF2F1]">
                <svg
                  className="md-spinner w-7 h-7 mx-auto mb-4 text-[#164B4D]"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    stroke="#E7EFED"
                    strokeWidth="3"
                  />

                  <path
                    d="M21 12a9 9 0 00-9-9"
                    stroke="#164B4D"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>

                <p className="text-sm font-medium text-[#526563]">
                  Loading services...
                </p>
              </div>
            ) : filteredServices.length === 0 ? (
              /* EMPTY */
              <div className="px-10 py-20 text-center border-t border-[#EDF2F1]">
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-[#E7EFED] text-[#164B4D] flex items-center justify-center text-2xl">
                  +
                </div>

                <h4 className="md-display text-lg font-semibold text-[#164B4D]">
                  No services found.
                </h4>

                <p className="text-sm text-[#526563] mt-1">
                  Try adjusting your search or filters.
                </p>
              </div>
            ) : (
              <>
                {/* TABLE */}
                <div className="overflow-x-auto border-t border-[#EDF2F1] w-full">
                  <table className="w-full min-w-[1000px] text-left">
                    <thead>
                      <tr className="bg-[#F2F8F6]">
                        <th className="px-6 py-3.5 text-[11px] font-bold text-[#526563] uppercase tracking-wider">
                          Service
                        </th>

                        <th className="px-5 py-3.5 text-[11px] font-bold text-[#526563] uppercase tracking-wider">
                          Department
                        </th>

                        <th className="px-5 py-3.5 text-[11px] font-bold text-[#526563] uppercase tracking-wider">
                          Description
                        </th>

                        <th className="px-5 py-3.5 text-[11px] font-bold text-[#526563] uppercase tracking-wider">
                          Status
                        </th>

                        <th className="px-6 py-3.5 text-[11px] font-bold text-[#526563] uppercase tracking-wider text-right">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredServices.map((service) => (
                        <tr
                          key={service._id}
                          className={`border-b border-[#EDF2F1] last:border-b-0 hover:bg-[#F7FBFA] transition-colors ${
                            !service.isActive
                              ? "bg-[#F5F8F6]/60"
                              : ""
                          }`}
                        >
                          {/* SERVICE */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3.5">
                              <div
                                className={`md-display w-10 h-10 shrink-0 rounded-xl flex items-center justify-center text-base font-bold ring-1 ring-inset ${
                                  service.isActive
                                    ? "bg-[#9ADBD3]/45 text-[#164B4D] ring-[#9ADBD3]"
                                    : "bg-[#FFDBCD] text-[#7A3005] ring-[#F28B5B]/30"
                                }`}
                              >
                                {service.name
                                  ?.charAt(0)
                                  .toUpperCase()}
                              </div>

                              <div className="min-w-0">
                                <p className="font-semibold text-[14px] text-[#0F3437] truncate max-w-[280px]">
                                  {service.name}
                                </p>

                                <p className="text-[11px] text-[#8FA6A2] mt-0.5">
                                  Clinical service
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* DEPARTMENT */}
                          <td className="px-5 py-4">
                            <span className="px-2.5 py-1 rounded-lg bg-[#E7EFED] text-[12px] font-semibold text-[#37595A] inline-block whitespace-nowrap">
                              {service.department?.name ||
                                "Unknown"}
                            </span>
                          </td>

                          {/* DESCRIPTION */}
                          <td className="px-5 py-4 max-w-[380px]">
                            <p className="text-[13px] text-[#667876] truncate">
                              {service.description ||
                                "No description"}
                            </p>
                          </td>

                          {/* STATUS */}
                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                                service.isActive
                                  ? "bg-[#ADEFE7] text-[#00504A] border-[#92D2CB]"
                                  : "bg-[#FFDBCD] text-[#7A3005] border-[#F28B5B]/40"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  service.isActive
                                    ? "bg-[#256862]"
                                    : "bg-[#F28B5B]"
                                }`}
                              />

                              {service.isActive
                                ? "Active"
                                : "Inactive"}
                            </span>
                          </td>

                          {/* ACTIONS */}
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() =>
                                  setSelectedService(service)
                                }
                                className="px-3 py-1.5 rounded-xl bg-[#F5F8F6] hover:bg-[#E7EFED] text-[#164B4D] text-[12px] font-semibold transition-colors"
                              >
                                Edit
                              </button>

                              <button
                                onClick={() =>
                                  toggleServiceStatus(
                                    service._id
                                  )
                                }
                                className={`px-3 py-1.5 rounded-xl text-[12px] font-semibold transition-colors ${
                                  service.isActive
                                    ? "bg-white border border-[#F28B5B]/50 text-[#A8441A] hover:bg-[#F28B5B] hover:text-white"
                                    : "bg-[#164B4D] text-white hover:bg-[#0F3437]"
                                }`}
                              >
                                {service.isActive
                                  ? "Deactivate"
                                  : "Activate"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* FOOTER */}
                <div className="px-6 py-4 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-[#667876]">
                    <span>
                      Showing{" "}
                      <strong className="text-[#0F3437]">
                        {filteredServices.length}
                      </strong>{" "}
                      of{" "}
                      <strong className="text-[#0F3437]">
                        {totalServices}
                      </strong>{" "}
                      services
                    </span>

                    <span className="text-[#B8C9C5]">
                      •
                    </span>

                    <span className="text-[#256862] font-semibold">
                      Active: {activeServices}
                    </span>

                    <span className="text-[#B8C9C5]">
                      •
                    </span>

                    <span className="text-[#A8441A] font-semibold">
                      Inactive: {inactiveServices}
                    </span>
                  </div>

                  <span className="text-[11px] text-[#8FA6A2]">
                    Registry updated from live services
                  </span>
                </div>
              </>
            )}
          </div>

          {/* AI ADVISORY */}
          <div className="bg-[#DCF3EE] rounded-2xl p-5 border border-[#C0DCD7] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-[#164B4D] text-white flex items-center justify-center shrink-0">
                ✦
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="md-display text-[16px] font-semibold text-[#164B4D]">
                    Medicare Services Intelligence
                  </span>

                  <span className="px-2 py-0.5 rounded bg-[#ADEFE7] text-[#00504A] text-[10px] font-bold">
                    HEALTH IQ
                  </span>
                </div>

                <p className="text-xs text-[#526563] mt-0.5">
                  Service availability and department assignments
                  are synchronized with your hospital management
                  system.
                </p>
              </div>
            </div>
          </div>

          {/* EDIT SERVICE MODAL */}
          {selectedService && (
            <div className="fixed inset-0 bg-[#0F3437]/60 backdrop-blur-[3px] flex items-center justify-center p-4 z-50">
              <div className="md-modal bg-white w-full max-w-xl rounded-2xl shadow-[0_24px_60px_-12px_rgba(15,52,55,0.45)] border border-[#DCEAE7] overflow-hidden max-h-[90vh] flex flex-col">

                {/* MODAL HEADER */}
                <div className="flex items-start justify-between px-7 py-5 border-b border-[#E7EFED] bg-[#F5F8F6]">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.16em] font-bold text-[#256862] mb-1">
                      Service Management
                    </p>

                    <h3 className="md-display text-[22px] font-semibold text-[#164B4D]">
                      Edit Service
                    </h3>

                    <p className="text-sm text-[#526563] mt-1">
                      Update service information
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      setSelectedService(null)
                    }
                    className="w-8 h-8 flex items-center justify-center rounded-xl text-[#5B7773] hover:text-[#0F3437] hover:bg-[#E7EFED] text-2xl transition-colors"
                  >
                    ×
                  </button>
                </div>

                {/* FORM */}
                <form
                  onSubmit={updateService}
                  className="overflow-y-auto"
                >
                  <div className="space-y-5 px-7 py-6">

                    {/* SERVICE NAME */}
                    <div>
                      <label className={labelClass}>
                        Service Name
                      </label>

                      <input
                        type="text"
                        value={selectedService.name || ""}
                        onChange={(e) =>
                          setSelectedService(
                            (current) => ({
                              ...current,
                              name: e.target.value,
                            })
                          )
                        }
                        required
                        className={inputClass}
                      />
                    </div>

                    {/* DEPARTMENT */}
                    <div>
                      <label className={labelClass}>
                        Department
                      </label>

                      <select
                        value={
                          selectedService.department?._id ||
                          selectedService.department ||
                          ""
                        }
                        onChange={(e) =>
                          setSelectedService(
                            (current) => ({
                              ...current,
                              department:
                                e.target.value,
                            })
                          )
                        }
                        required
                        className={inputClass}
                      >
                        <option value="">
                          Select Department
                        </option>

                        {departments.map(
                          (department) => (
                            <option
                              key={department._id}
                              value={department._id}
                            >
                              {department.name}
                            </option>
                          )
                        )}
                      </select>
                    </div>

                    {/* DESCRIPTION */}
                    <div>
                      <label className={labelClass}>
                        Description
                      </label>

                      <textarea
                        rows="4"
                        value={
                          selectedService.description ||
                          ""
                        }
                        onChange={(e) =>
                          setSelectedService(
                            (current) => ({
                              ...current,
                              description:
                                e.target.value,
                            })
                          )
                        }
                        required
                        className={`${inputClass} resize-none`}
                      />
                    </div>

                    {/* IMAGE */}
                    <div>
                      <label className={labelClass}>
                        Image URL
                      </label>

                      <input
                        type="text"
                        value={
                          selectedService.image || ""
                        }
                        onChange={(e) =>
                          setSelectedService(
                            (current) => ({
                              ...current,
                              image: e.target.value,
                            })
                          )
                        }
                        placeholder="Enter image URL..."
                        className={inputClass}
                      />
                    </div>

                    {/* STATUS */}
                    <div className="flex items-center justify-between gap-4 p-4 bg-[#F5F8F6] border border-[#E7EFED] rounded-xl">
                      <div>
                        <p className="text-sm font-semibold text-[#164B4D]">
                          Service is active
                        </p>

                        <p className="text-xs text-[#526563] mt-0.5">
                          Allow this service to remain available.
                        </p>
                      </div>

                      <input
                        type="checkbox"
                        checked={
                          selectedService.isActive
                        }
                        onChange={(e) =>
                          setSelectedService(
                            (current) => ({
                              ...current,
                              isActive:
                                e.target.checked,
                            })
                          )
                        }
                        className="w-5 h-5 accent-[#164B4D]"
                      />
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="px-7 py-5 bg-[#F5F8F6] border-t border-[#E7EFED] flex gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedService(null)
                      }
                      className="flex-1 px-4 py-2.5 rounded-xl border border-[#CBDAD6] bg-white hover:bg-[#E7EFED] text-[#164B4D] text-sm font-semibold transition-colors"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={saving}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-[#164B4D] hover:bg-[#0F3437] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold shadow-sm transition-colors"
                    >
                      {saving
                        ? "Saving..."
                        : "Save Changes"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Services;