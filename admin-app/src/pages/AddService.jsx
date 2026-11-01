
import { useEffect, useState } from "react";
import api from "../api";

const AddService = ({ onServiceAdded, onBack }) => {
  const [departments, setDepartments] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    department: "",
    image: "",
  });

  const [loading, setLoading] = useState(false);
  const [loadingDepartments, setLoadingDepartments] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchDepartments = async () => {
    try {
      const response = await api.get("/departments");
      setDepartments(response.data.departments);
    } catch (error) {
      setError("Failed to load departments");
    } finally {
      setLoadingDepartments(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const token = localStorage.getItem("adminToken");

      await api.post("/services", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccess("Service added successfully!");

      setFormData({
        name: "",
        description: "",
        department: "",
        image: "",
      });

      if (onServiceAdded) {
        onServiceAdded();
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to add service. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full w-full min-w-0">
      <div className="w-full min-w-0 p-3 sm:p-5 lg:p-6 xl:p-8">
        <div className="mx-auto w-full max-w-[1450px] space-y-5 sm:space-y-6">

          {/* PAGE HEADER */}
          <div>
            <button
              type="button"
              onClick={onBack}
              className="mb-4 inline-flex items-center gap-2 rounded-xl border border-[#CBDAD6] bg-white px-4 py-2 text-base font-semibold text-[#164B4D] shadow-sm transition hover:border-[#9BCBC3] hover:bg-[#E7F4F1] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9ADBD3]"
            >
              <span className="text-xl leading-none">←</span>
              Back to Services
            </button>

            <div className="mb-1 flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#2E9C8F]" />

              <span className="text-base font-bold uppercase tracking-[0.16em] text-[#256862]">
                Service Management
              </span>
            </div>

            <h2 className="font-['Bricolage_Grotesque'] text-[23px] font-semibold leading-8 text-[#164B4D] sm:text-[25px]">
              Add Service
            </h2>

            <p className="mt-1 text-base text-[#526563]">
              Add a new hospital service to the Medicare system.
            </p>
          </div>

          {/* FORM CARD */}
          <div className="overflow-hidden rounded-2xl border border-[#DCEAE7] bg-white shadow-[0_8px_30px_-22px_rgba(15,52,55,0.45)]">
            <div className="p-4 sm:p-6 xl:p-7">

              {/* CARD HEADER */}
              <div className="mb-6">
                <h3 className="font-['Bricolage_Grotesque'] text-[19px] font-semibold text-[#164B4D]">
                  Service Information
                </h3>

                <p className="mt-1 text-base text-[#667876]">
                  Enter the service details and assign it to a department.
                </p>
              </div>

              {/* SUCCESS */}
              {success && (
                <div className="mb-6 flex items-center gap-3 rounded-xl border border-[#BFDCD5] border-l-4 border-l-[#2E9C8F] bg-[#EAF7F3] px-4 py-3 text-base font-medium text-[#256862]">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#ADEFE7] font-bold text-[#00504A]">
                    ✓
                  </span>

                  <span>{success}</span>
                </div>
              )}

              {/* ERROR */}
              {error && (
                <div className="mb-6 flex items-start gap-3 rounded-xl border border-[#F3C9BF] border-l-4 border-l-[#F28B5B] bg-[#FFF1EE] px-4 py-3 text-base text-[#A34A32]">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#FDE0D7] font-bold">
                    !
                  </span>

                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>

                {/* BASIC INFORMATION */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">

                  {/* SERVICE NAME */}
                  <div className="min-w-0">
                    <label className="mb-1.5 block text-base font-semibold text-[#164B4D]">
                      Service Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. ECG"
                      required
                      className="w-full rounded-xl border border-[#CBDAD6] bg-white px-3.5 py-2.5 text-base text-[#0F3437] outline-none transition placeholder:text-[#8FA6A2] focus:border-[#164B4D] focus:ring-2 focus:ring-[#9ADBD3]/60"
                    />
                  </div>

                  {/* DEPARTMENT */}
                  <div className="min-w-0">
                    <label className="mb-1.5 block text-base font-semibold text-[#164B4D]">
                      Department
                    </label>

                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      required
                      disabled={loadingDepartments}
                      className="w-full rounded-xl border border-[#CBDAD6] bg-white px-3.5 py-2.5 text-base text-[#0F3437] outline-none transition focus:border-[#164B4D] focus:ring-2 focus:ring-[#9ADBD3]/60 disabled:bg-[#F5F8F6] disabled:text-[#8FA6A2]"
                    >
                      <option value="">
                        {loadingDepartments
                          ? "Loading departments..."
                          : "Select department"}
                      </option>

                      {departments.map((department) => (
                        <option
                          key={department._id}
                          value={department._id}
                        >
                          {department.name}
                        </option>
                      ))}
                    </select>
                  </div>

                </div>

                {/* DESCRIPTION */}
                <div className="mt-5">
                  <label className="mb-1.5 block text-base font-semibold text-[#164B4D]">
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter service description"
                    rows="5"
                    required
                    className="w-full resize-none rounded-xl border border-[#CBDAD6] bg-white px-3.5 py-2.5 text-base text-[#0F3437] outline-none transition placeholder:text-[#8FA6A2] focus:border-[#164B4D] focus:ring-2 focus:ring-[#9ADBD3]/60"
                  />
                </div>

                {/* SERVICE IMAGE URL */}
                <div className="mt-5">
                  <label className="mb-1.5 block text-base font-semibold text-[#164B4D]">
                    Service Image URL
                  </label>

                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="Paste service image URL"
                    className="w-full rounded-xl border border-[#CBDAD6] bg-white px-3.5 py-2.5 text-base text-[#0F3437] outline-none transition placeholder:text-[#8FA6A2] focus:border-[#164B4D] focus:ring-2 focus:ring-[#9ADBD3]/60"
                  />

                  <p className="mt-1.5 text-base text-[#8FA6A2]">
                    Add a direct image URL to display this service image in the user app.
                  </p>

                  {formData.image && (
                    <div className="mt-4 w-full max-w-sm">
                      <p className="mb-2 text-base font-semibold text-[#164B4D]">
                        Image Preview
                      </p>

                      <div className="h-40 overflow-hidden rounded-xl border border-[#CBDAD6] bg-[#F5F8F6] sm:h-44">
                        <img
                          src={formData.image}
                          alt="Service preview"
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* ACTION AREA */}
                <div className="mt-8 flex flex-col justify-between gap-4 border-t border-[#E7EFED] pt-5 sm:flex-row sm:items-center">

                  <div>
                    <p className="text-base font-semibold text-[#164B4D]">
                      Create service
                    </p>

                    <p className="mt-0.5 text-base text-[#8FA6A2]">
                      The service will be added to the Medicare registry.
                    </p>
                  </div>

                  <div className="flex w-full flex-col-reverse gap-3 sm:w-auto sm:flex-row sm:items-center">

                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          name: "",
                          description: "",
                          department: "",
                          image: "",
                        })
                      }
                      className="w-full rounded-xl border border-[#CBDAD6] px-5 py-2.5 text-base font-semibold text-[#526563] transition hover:border-[#9ADBD3] hover:bg-[#F5F8F6] sm:w-auto"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={loading || loadingDepartments}
                      className="w-full rounded-xl bg-[#164B4D] px-6 py-2.5 text-base font-semibold text-white shadow-[0_4px_12px_rgba(15,52,55,0.15)] transition-colors hover:bg-[#0F3437] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9ADBD3] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-[#8FA6A2] sm:w-auto"
                    >
                      {loading ? "Adding..." : "Add Service"}
                    </button>

                  </div>
                </div>

              </form>
            </div>
          </div>

          {/* INFO CARD */}
          <div className="flex flex-col items-start gap-4 rounded-2xl border border-[#C0DCD7] bg-[#DCF3EE] p-4 sm:p-5 md:flex-row md:items-center">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#164B4D] text-lg text-white">
              +
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-['Bricolage_Grotesque'] text-[16px] font-semibold text-[#164B4D]">
                  Service Registry
                </span>

                <span className="rounded bg-[#ADEFE7] px-2 py-0.5 text-base font-bold text-[#00504A]">
                  MEDICARE
                </span>
              </div>

              <p className="mt-0.5 text-base text-[#526563]">
                Assign each service to the appropriate department for easier
                management across the Medicare system.
              </p>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default AddService;
