
import { useState } from "react";
import api from "../api";

const AddDepartment = ({ onDepartmentAdded, onBack }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("adminToken");

      await api.post("/departments", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFormData({
        name: "",
        description: "",
        image: "",
      });

      if (onDepartmentAdded) {
        onDepartmentAdded();
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to add department. Please try again."
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
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 mb-5 px-4 py-2 rounded-xl border border-[#CBDAD6] bg-white text-[#164B4D] text-base font-semibold shadow-sm transition hover:bg-[#E7F4F1] hover:border-[#9BCBC3] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9ADBD3]"
            >
              <span className="text-xl leading-none">←</span>
              Back to Departments
            </button>

            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#2E9C8F] animate-pulse" />

              <span className="text-base font-bold uppercase tracking-[0.16em] text-[#256862]">
                Department Management
              </span>
            </div>

            <h2 className="font-['Bricolage_Grotesque'] text-[25px] leading-8 font-semibold text-[#164B4D]">
              Add Department
            </h2>

            <p className="text-base text-[#526563] mt-1">
              Add a new department to the hospital.
            </p>
          </div>

          {/* FORM CARD */}
          <div className="bg-white rounded-2xl border border-[#DCEAE7] shadow-[0_8px_30px_-22px_rgba(15,52,55,0.45)] overflow-hidden">
            <div className="p-6 xl:p-7">

              {/* CARD HEADER */}
              <div className="mb-6">
                <h3 className="font-['Bricolage_Grotesque'] text-[19px] font-semibold text-[#164B4D]">
                  Department Information
                </h3>

                <p className="text-base text-[#667876] mt-1">
                  Enter the basic information for the new hospital department.
                </p>
              </div>

              {/* ERROR */}
              {error && (
                <div className="mb-6 flex items-start gap-3 bg-[#FFF1EE] border border-[#F3C9BF] border-l-4 border-l-[#F28B5B] text-[#A34A32] px-4 py-3 rounded-xl text-base">
                  <span className="w-6 h-6 shrink-0 rounded-full bg-[#FDE0D7] flex items-center justify-center font-bold">
                    !
                  </span>

                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">

                {/* DEPARTMENT NAME */}
                <div>
                  <label className="block text-base font-semibold text-[#164B4D] mb-1.5">
                    Department Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Cardiology"
                    required
                    className="w-full bg-white border border-[#CBDAD6] rounded-xl px-3.5 py-2.5 text-base text-[#0F3437] placeholder:text-[#8FA6A2] outline-none transition focus:border-[#164B4D] focus:ring-2 focus:ring-[#9ADBD3]/60"
                  />
                </div>

                {/* DEPARTMENT IMAGE URL */}
                <div>
                  <label className="block text-base font-semibold text-[#164B4D] mb-1.5">
                    Department Image URL
                  </label>

                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://example.com/department-image.jpg"
                    className="w-full bg-white border border-[#CBDAD6] rounded-xl px-3.5 py-2.5 text-base text-[#0F3437] placeholder:text-[#8FA6A2] outline-none transition focus:border-[#164B4D] focus:ring-2 focus:ring-[#9ADBD3]/60"
                  />

                  <p className="text-base text-[#667876] mt-2">
                    Paste a direct image URL to display the department image.
                  </p>

                  {formData.image && (
                    <div className="mt-4">
                      <p className="text-base font-semibold text-[#164B4D] mb-2">
                        Image Preview
                      </p>

                      <div className="w-full max-w-xs h-48 rounded-xl border border-[#CBDAD6] bg-[#F5F8F6] overflow-hidden">
                        <img
                          src={formData.image}
                          alt="Department preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* DESCRIPTION */}
                <div>
                  <label className="block text-base font-semibold text-[#164B4D] mb-1.5">
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter department description"
                    rows="5"
                    className="w-full bg-white border border-[#CBDAD6] rounded-xl px-3.5 py-2.5 text-base text-[#0F3437] placeholder:text-[#8FA6A2] outline-none transition focus:border-[#164B4D] focus:ring-2 focus:ring-[#9ADBD3]/60 resize-none"
                  />
                </div>

                {/* ACTION AREA */}
                <div className="pt-2 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-base font-semibold text-[#164B4D]">
                      Create department
                    </p>

                    <p className="text-base text-[#8FA6A2] mt-0.5">
                      The department will be added to the hospital registry.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#164B4D] hover:bg-[#0F3437] disabled:bg-[#8FA6A2] disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 rounded-xl text-base shadow-[0_4px_12px_rgba(15,52,55,0.15)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9ADBD3] focus-visible:ring-offset-2"
                  >
                    {loading ? "Adding..." : "Add Department"}
                  </button>
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
                  Department Registry
                </span>

                <span className="px-2 py-0.5 rounded bg-[#ADEFE7] text-[#00504A] text-base font-bold">
                  MEDICARE
                </span>
              </div>

              <p className="text-base text-[#526563] mt-0.5">
                Keep department names and descriptions clear so they can be
                easily identified across the Medicare system.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AddDepartment;
