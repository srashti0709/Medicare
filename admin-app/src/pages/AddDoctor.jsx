import { useState } from "react";
import api from "../api";

const AddDoctor = ({ onDoctorAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    specialization: "",
    department: "",
    qualification: "",
    experience: "",
    consultationFee: "",
    phone: "",
    about: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

      await api.post(
        "/doctors",
        {
          ...formData,
          experience: Number(formData.experience),
          consultationFee: Number(formData.consultationFee),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Doctor added successfully!");

      setFormData({
        name: "",
        email: "",
        password: "",
        specialization: "",
        department: "",
        qualification: "",
        experience: "",
        consultationFee: "",
        phone: "",
        about: "",
      });

      if (onDoctorAdded) {
        onDoctorAdded();
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to add doctor. Please try again."
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
                Doctor Management
              </span>
            </div>

            <h2 className="font-['Bricolage_Grotesque'] text-[25px] leading-8 font-semibold text-[#164B4D]">
              Add Doctor
            </h2>

            <p className="text-xs text-[#526563] mt-1">
              Add a new doctor to the hospital.
            </p>
          </div>

          {/* FORM CARD */}
          <div className="bg-white rounded-2xl border border-[#DCEAE7] shadow-[0_8px_30px_-22px_rgba(15,52,55,0.45)] overflow-hidden">
            <div className="p-6 xl:p-7">
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
                {/* BASIC INFORMATION */}
                <div className="mb-6">
                  <h3 className="font-['Bricolage_Grotesque'] text-[19px] font-semibold text-[#164B4D]">
                    Basic Information
                  </h3>

                  <p className="text-xs text-[#667876] mt-1">
                    Enter the doctor's basic contact and account information.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* NAME */}
                  <div>
                    <label className="block text-[13px] font-semibold text-[#164B4D] mb-1.5">
                      Full Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Dr. John Smith"
                      required
                      className="w-full bg-white border border-[#CBDAD6] rounded-xl px-3.5 py-2.5 text-sm text-[#0F3437] placeholder:text-[#8FA6A2] outline-none transition focus:border-[#164B4D] focus:ring-2 focus:ring-[#9ADBD3]/60"
                    />
                  </div>

                  {/* EMAIL */}
                  <div>
                    <label className="block text-[13px] font-semibold text-[#164B4D] mb-1.5">
                      Email
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="doctor@medicare.com"
                      required
                      className="w-full bg-white border border-[#CBDAD6] rounded-xl px-3.5 py-2.5 text-sm text-[#0F3437] placeholder:text-[#8FA6A2] outline-none transition focus:border-[#164B4D] focus:ring-2 focus:ring-[#9ADBD3]/60"
                    />
                  </div>

                  {/* PASSWORD */}
                  <div>
                    <label className="block text-[13px] font-semibold text-[#164B4D] mb-1.5">
                      Password
                    </label>

                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Minimum 6 characters"
                      required
                      minLength={6}
                      className="w-full bg-white border border-[#CBDAD6] rounded-xl px-3.5 py-2.5 text-sm text-[#0F3437] placeholder:text-[#8FA6A2] outline-none transition focus:border-[#164B4D] focus:ring-2 focus:ring-[#9ADBD3]/60"
                    />
                  </div>

                  {/* PHONE */}
                  <div>
                    <label className="block text-[13px] font-semibold text-[#164B4D] mb-1.5">
                      Phone
                    </label>

                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="9876543210"
                      className="w-full bg-white border border-[#CBDAD6] rounded-xl px-3.5 py-2.5 text-sm text-[#0F3437] placeholder:text-[#8FA6A2] outline-none transition focus:border-[#164B4D] focus:ring-2 focus:ring-[#9ADBD3]/60"
                    />
                  </div>
                </div>

                {/* PROFESSIONAL INFORMATION */}
                <div className="mt-8 mb-6">
                  <h3 className="font-['Bricolage_Grotesque'] text-[19px] font-semibold text-[#164B4D]">
                    Professional Information
                  </h3>

                  <p className="text-xs text-[#667876] mt-1">
                    Add the doctor's specialization, department, experience,
                    and consultation details.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* SPECIALIZATION */}
                  <div>
                    <label className="block text-[13px] font-semibold text-[#164B4D] mb-1.5">
                      Specialization
                    </label>

                    <input
                      type="text"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleChange}
                      placeholder="Cardiologist"
                      required
                      className="w-full bg-white border border-[#CBDAD6] rounded-xl px-3.5 py-2.5 text-sm text-[#0F3437] placeholder:text-[#8FA6A2] outline-none transition focus:border-[#164B4D] focus:ring-2 focus:ring-[#9ADBD3]/60"
                    />
                  </div>

                  {/* DEPARTMENT */}
                  <div>
                    <label className="block text-[13px] font-semibold text-[#164B4D] mb-1.5">
                      Department
                    </label>

                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      placeholder="Cardiology"
                      required
                      className="w-full bg-white border border-[#CBDAD6] rounded-xl px-3.5 py-2.5 text-sm text-[#0F3437] placeholder:text-[#8FA6A2] outline-none transition focus:border-[#164B4D] focus:ring-2 focus:ring-[#9ADBD3]/60"
                    />
                  </div>

                  {/* QUALIFICATION */}
                  <div>
                    <label className="block text-[13px] font-semibold text-[#164B4D] mb-1.5">
                      Qualification
                    </label>

                    <input
                      type="text"
                      name="qualification"
                      value={formData.qualification}
                      onChange={handleChange}
                      placeholder="MBBS, MD Cardiology"
                      required
                      className="w-full bg-white border border-[#CBDAD6] rounded-xl px-3.5 py-2.5 text-sm text-[#0F3437] placeholder:text-[#8FA6A2] outline-none transition focus:border-[#164B4D] focus:ring-2 focus:ring-[#9ADBD3]/60"
                    />
                  </div>

                  {/* EXPERIENCE */}
                  <div>
                    <label className="block text-[13px] font-semibold text-[#164B4D] mb-1.5">
                      Experience (Years)
                    </label>

                    <input
                      type="number"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      placeholder="5"
                      min="0"
                      required
                      className="w-full bg-white border border-[#CBDAD6] rounded-xl px-3.5 py-2.5 text-sm text-[#0F3437] placeholder:text-[#8FA6A2] outline-none transition focus:border-[#164B4D] focus:ring-2 focus:ring-[#9ADBD3]/60"
                    />
                  </div>

                  {/* CONSULTATION FEE */}
                  <div>
                    <label className="block text-[13px] font-semibold text-[#164B4D] mb-1.5">
                      Consultation Fee (₹)
                    </label>

                    <input
                      type="number"
                      name="consultationFee"
                      value={formData.consultationFee}
                      onChange={handleChange}
                      placeholder="800"
                      min="0"
                      required
                      className="w-full bg-white border border-[#CBDAD6] rounded-xl px-3.5 py-2.5 text-sm text-[#0F3437] placeholder:text-[#8FA6A2] outline-none transition focus:border-[#164B4D] focus:ring-2 focus:ring-[#9ADBD3]/60"
                    />
                  </div>
                </div>

                {/* ABOUT */}
                <div className="mt-5">
                  <label className="block text-[13px] font-semibold text-[#164B4D] mb-1.5">
                    About Doctor
                  </label>

                  <textarea
                    name="about"
                    value={formData.about}
                    onChange={handleChange}
                    placeholder="Write a short description about the doctor..."
                    rows="5"
                    className="w-full bg-white border border-[#CBDAD6] rounded-xl px-3.5 py-2.5 text-sm text-[#0F3437] placeholder:text-[#8FA6A2] outline-none transition focus:border-[#164B4D] focus:ring-2 focus:ring-[#9ADBD3]/60 resize-none"
                  />
                </div>

                {/* ACTION AREA */}
                <div className="mt-8 pt-5 border-t border-[#E7EFED] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-[12px] font-semibold text-[#164B4D]">
                      Create doctor profile
                    </p>

                    <p className="text-[11px] text-[#8FA6A2] mt-0.5">
                      The doctor will be added to the Medicare registry.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          name: "",
                          email: "",
                          password: "",
                          specialization: "",
                          department: "",
                          qualification: "",
                          experience: "",
                          consultationFee: "",
                          phone: "",
                          about: "",
                        })
                      }
                      className="px-5 py-2.5 rounded-xl border border-[#CBDAD6] text-[#526563] hover:bg-[#F5F8F6] hover:border-[#9ADBD3] font-semibold text-sm transition"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2.5 rounded-xl bg-[#164B4D] hover:bg-[#0F3437] disabled:bg-[#8FA6A2] disabled:cursor-not-allowed text-white font-semibold text-sm shadow-[0_4px_12px_rgba(15,52,55,0.15)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9ADBD3] focus-visible:ring-offset-2"
                    >
                      {loading ? "Adding Doctor..." : "Add Doctor"}
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
                  Doctor Registry
                </span>

                <span className="px-2 py-0.5 rounded bg-[#ADEFE7] text-[#00504A] text-[10px] font-bold">
                  MEDICARE
                </span>
              </div>

              <p className="text-xs text-[#526563] mt-0.5">
                Add complete and accurate professional information so doctors
                can be managed across the Medicare system.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDoctor;