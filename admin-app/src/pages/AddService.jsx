import { useEffect, useState } from "react";
import api from "../api";

const AddService = ({ onServiceAdded }) => {
  const [departments, setDepartments] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    department: "",
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
    <div className="min-h-full">
      <div className="p-6 xl:p-8">
        <div className="max-w-[1450px] mx-auto space-y-6">
          {/* PAGE HEADER */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#2E9C8F] animate-pulse" />

              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#256862]">
                Service Management
              </span>
            </div>

            <h2 className="font-['Bricolage_Grotesque'] text-[25px] leading-8 font-semibold text-[#164B4D]">
              Add Service
            </h2>

            <p className="text-xs text-[#526563] mt-1">
              Add a new hospital service to the Medicare system.
            </p>
          </div>

          {/* FORM CARD */}
          <div className="bg-white rounded-2xl border border-[#DCEAE7] shadow-[0_8px_30px_-22px_rgba(15,52,55,0.45)] overflow-hidden">
            <div className="p-6 xl:p-7">
              {/* CARD HEADER */}
              <div className="mb-6">
                <h3 className="font-['Bricolage_Grotesque'] text-[19px] font-semibold text-[#164B4D]">
                  Service Information
                </h3>

                <p className="text-xs text-[#667876] mt-1">
                  Enter the service details and assign it to a department.
                </p>
              </div>

              {/* SUCCESS */}
              {success && (
                <div className="mb-6 flex items-center gap-3 bg-[#EAF7F3] border border-[#BFDCD5] border-l-4 border-l-[#2E9C8F] text-[#256862] px-4 py-3 rounded-xl text-sm font-medium">
                  <span className="w-6 h-6 rounded-full bg-[#ADEFE7] flex items-center justify-center text-[#00504A] font-bold">
                    ✓
                  </span>

                  <span>{success}</span>
                </div>
              )}

              {/* ERROR */}
              {error && (
                <div className="mb-6 flex items-start gap-3 bg-[#FFF1EE] border border-[#F3C9BF] border-l-4 border-l-[#F28B5B] text-[#A34A32] px-4 py-3 rounded-xl text-sm">
                  <span className="w-6 h-6 shrink-0 rounded-full bg-[#FDE0D7] flex items-center justify-center font-bold">
                    !
                  </span>

                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* SERVICE NAME */}
                  <div>
                    <label className="block text-[13px] font-semibold text-[#164B4D] mb-1.5">
                      Service Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. ECG"
                      required
                      className="w-full bg-white border border-[#CBDAD6] rounded-xl px-3.5 py-2.5 text-sm text-[#0F3437] placeholder:text-[#8FA6A2] outline-none transition focus:border-[#164B4D] focus:ring-2 focus:ring-[#9ADBD3]/60"
                    />
                  </div>

                  {/* DEPARTMENT */}
                  <div>
                    <label className="block text-[13px] font-semibold text-[#164B4D] mb-1.5">
                      Department
                    </label>

                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      required
                      disabled={loadingDepartments}
                      className="w-full bg-white border border-[#CBDAD6] rounded-xl px-3.5 py-2.5 text-sm text-[#0F3437] outline-none transition focus:border-[#164B4D] focus:ring-2 focus:ring-[#9ADBD3]/60 disabled:bg-[#F5F8F6] disabled:text-[#8FA6A2]"
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
                  <label className="block text-[13px] font-semibold text-[#164B4D] mb-1.5">
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter service description"
                    rows="5"
                    required
                    className="w-full bg-white border border-[#CBDAD6] rounded-xl px-3.5 py-2.5 text-sm text-[#0F3437] placeholder:text-[#8FA6A2] outline-none transition focus:border-[#164B4D] focus:ring-2 focus:ring-[#9ADBD3]/60 resize-none"
                  />
                </div>

                {/* ACTION AREA */}
                <div className="mt-8 pt-5 border-t border-[#E7EFED] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-[12px] font-semibold text-[#164B4D]">
                      Create service
                    </p>

                    <p className="text-[11px] text-[#8FA6A2] mt-0.5">
                      The service will be added to the Medicare registry.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          name: "",
                          description: "",
                          department: "",
                        })
                      }
                      className="px-5 py-2.5 rounded-xl border border-[#CBDAD6] text-[#526563] hover:bg-[#F5F8F6] hover:border-[#9ADBD3] font-semibold text-sm transition"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={loading || loadingDepartments}
                      className="bg-[#164B4D] hover:bg-[#0F3437] disabled:bg-[#8FA6A2] disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 rounded-xl text-sm shadow-[0_4px_12px_rgba(15,52,55,0.15)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9ADBD3] focus-visible:ring-offset-2"
                    >
                      {loading ? "Adding..." : "Add Service"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* INFO CARD */}
          <div className="bg-[#DCF3EE] rounded-2xl p-5 border border-[#C0DCD7] flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-[#164B4D] text-white flex items-center justify-center shrink-0 text-lg">
              +
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-['Bricolage_Grotesque'] text-[16px] font-semibold text-[#164B4D]">
                  Service Registry
                </span>

                <span className="px-2 py-0.5 rounded bg-[#ADEFE7] text-[#00504A] text-[10px] font-bold">
                  MEDICARE
                </span>
              </div>

              <p className="text-xs text-[#526563] mt-0.5">
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