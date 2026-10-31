import { useEffect, useState } from "react";
import api from "../api";

const DoctorProfile = () => {
  const token = localStorage.getItem("adminToken");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    specialization: "",
    department: "",
    qualification: "",
    experience: "",
    consultationFee: "",
    phone: "",
    about: "",
    isAvailable: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/doctors/my-profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const doctor = response.data.doctor;

        setFormData({
          name: doctor.user?.name || "",
          email: doctor.user?.email || "",
          specialization: doctor.specialization || "",
          department: doctor.department || "",
          qualification: doctor.qualification || "",
          experience: doctor.experience ?? "",
          consultationFee: doctor.consultationFee ?? "",
          phone: doctor.phone || "",
          about: doctor.about || "",
          isAvailable: doctor.isAvailable ?? true,
        });
      } catch (error) {
        console.error("Failed to fetch doctor profile", error);

        alert(
          error.response?.data?.message ||
            "Failed to fetch doctor profile"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const response = await api.patch(
        "/doctors/my-profile",
        {
          name: formData.name,
          specialization: formData.specialization,
          department: formData.department,
          qualification: formData.qualification,
          experience: Number(formData.experience),
          consultationFee: Number(formData.consultationFee),
          phone: formData.phone,
          about: formData.about,
          isAvailable: formData.isAvailable,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const doctor = response.data.doctor;

      setFormData((currentData) => ({
        ...currentData,
        name: doctor.user?.name || currentData.name,
        email: doctor.user?.email || currentData.email,
      }));

      alert("Profile updated successfully.");
    } catch (error) {
      console.error("Failed to update doctor profile", error);

      alert(
        error.response?.data?.message ||
          "Failed to update doctor profile"
      );
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-[#CBDAD6] bg-white px-4 py-3 text-[14px] text-[#0a1f1c] outline-none transition placeholder:text-[#899895] hover:border-[#8EAAA3] focus:border-[#256862] focus:ring-4 focus:ring-[#ADEFE7]/40";
  const labelClass =
    "mb-2 block text-[12px] font-semibold tracking-wide text-[#404848]";

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F8F6] px-4">
        <div className="flex items-center gap-3 rounded-2xl border border-[#CBDAD6] bg-white px-6 py-5 shadow-sm">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#B9D7D0] border-t-[#256862]" />
          <p className="text-sm font-medium text-[#164B4D]">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F8F6] px-4 py-7 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Page heading */}
        <div className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#B9DCD4] bg-[#E7F4F1] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#256862]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#256862]" />
              Doctor workspace
            </div>
            <h1 className="font-['Bricolage_Grotesque'] text-3xl font-bold tracking-tight text-[#003435] sm:text-[36px]">
              My Profile
            </h1>
            <p className="mt-2 max-w-xl text-[14px] leading-6 text-[#64736F]">
              Manage your professional details and keep your appointment
              information up to date.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-[#CBDAD6] bg-white px-4 py-3 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E7F4F1] text-lg text-[#256862]">
              ✦
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#81918C]">
                Profile status
              </p>
              <p className="mt-0.5 text-sm font-semibold text-[#164B4D]">
                {formData.isAvailable ? "Available for appointments" : "Currently unavailable"}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Professional information */}
          <section className="overflow-hidden rounded-2xl border border-[#CBDAD6] bg-white shadow-[0_3px_18px_rgba(0,52,53,0.04)]">
            <div className="flex items-center gap-4 border-b border-[#E4ECE9] bg-gradient-to-r from-[#E7F4F1] to-white px-5 py-5 sm:px-7">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#D5EEE8] text-xl text-[#256862]">
                ♙
              </div>
              <div>
                <h2 className="font-['Bricolage_Grotesque'] text-lg font-bold text-[#003435]">
                  Personal information
                </h2>
                <p className="mt-0.5 text-xs text-[#71817C]">
                  Your basic details and contact information
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-x-6 gap-y-5 p-5 sm:grid-cols-2 sm:p-7">
              <div>
                <label className={labelClass}>Full name <span className="text-[#BA5B4F]">*</span></label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Email address</label>
                <div className="relative">
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full cursor-not-allowed rounded-xl border border-[#DCE6E2] bg-[#F3F7F5] px-4 py-3 pr-12 text-[14px] text-[#82908C]"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#8A9A95]">🔒</span>
                </div>
                <p className="mt-1.5 text-[11px] text-[#899792]">Email address cannot be edited here.</p>
              </div>

              <div>
                <label className={labelClass}>Phone number</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Department <span className="text-[#BA5B4F]">*</span></label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Cardiology"
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          {/* Professional details */}
          <section className="overflow-hidden rounded-2xl border border-[#CBDAD6] bg-white shadow-[0_3px_18px_rgba(0,52,53,0.04)]">
            <div className="flex items-center gap-4 border-b border-[#E4ECE9] bg-gradient-to-r from-[#E7F4F1] to-white px-5 py-5 sm:px-7">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#D5EEE8] text-xl text-[#256862]">
                ✚
              </div>
              <div>
                <h2 className="font-['Bricolage_Grotesque'] text-lg font-bold text-[#003435]">
                  Professional details
                </h2>
                <p className="mt-0.5 text-xs text-[#71817C]">
                  Help patients understand your expertise and experience
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-x-6 gap-y-5 p-5 sm:grid-cols-2 sm:p-7">
              <div>
                <label className={labelClass}>Specialization <span className="text-[#BA5B4F]">*</span></label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  required
                  placeholder="e.g. General Physician"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Qualification <span className="text-[#BA5B4F]">*</span></label>
                <input
                  type="text"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  required
                  placeholder="e.g. MBBS, MD"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Experience <span className="text-[#BA5B4F]">*</span></label>
                <div className="relative">
                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    min="0"
                    required
                    placeholder="Years of experience"
                    className={`${inputClass} pr-20`}
                  />
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-[#81918C]">
                    Years
                  </span>
                </div>
              </div>

              <div>
                <label className={labelClass}>Consultation fee <span className="text-[#BA5B4F]">*</span></label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#64817A]">₹</span>
                  <input
                    type="number"
                    name="consultationFee"
                    value={formData.consultationFee}
                    onChange={handleChange}
                    min="0"
                    required
                    placeholder="Enter fee"
                    className={`${inputClass} pl-9`}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* About and availability */}
          <section className="overflow-hidden rounded-2xl border border-[#CBDAD6] bg-white shadow-[0_3px_18px_rgba(0,52,53,0.04)]">
            <div className="flex items-center gap-4 border-b border-[#E4ECE9] bg-gradient-to-r from-[#E7F4F1] to-white px-5 py-5 sm:px-7">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#D5EEE8] text-xl text-[#256862]">
                ▤
              </div>
              <div>
                <h2 className="font-['Bricolage_Grotesque'] text-lg font-bold text-[#003435]">
                  About & availability
                </h2>
                <p className="mt-0.5 text-xs text-[#71817C]">
                  Add a short introduction and manage your appointment status
                </p>
              </div>
            </div>

            <div className="space-y-6 p-5 sm:p-7">
              <div>
                <label className={labelClass}>About you</label>
                <textarea
                  name="about"
                  value={formData.about}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Write a brief introduction about your medical background, expertise and approach to patient care..."
                  className={`${inputClass} min-h-[130px] resize-y leading-6`}
                />
                <p className="mt-1.5 text-[11px] text-[#899792]">
                  A clear introduction helps patients learn more about you.
                </p>
              </div>

              <div className="flex flex-col justify-between gap-4 rounded-2xl border border-[#CDE5DE] bg-[#F0F8F5] p-4 sm:flex-row sm:items-center sm:px-5">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#256862] shadow-sm">
                    ✓
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#164B4D]">Available for appointments</p>
                    <p className="mt-1 max-w-md text-xs leading-5 text-[#71817C]">
                      Turn this off when you are not accepting new appointments.
                    </p>
                  </div>
                </div>

                <label className="inline-flex cursor-pointer items-center gap-3 self-start sm:self-center">
                  <span className={`text-xs font-semibold ${formData.isAvailable ? "text-[#256862]" : "text-[#81918C]"}`}>
                    {formData.isAvailable ? "Available" : "Unavailable"}
                  </span>
                  <input
                    type="checkbox"
                    id="isAvailable"
                    name="isAvailable"
                    checked={formData.isAvailable}
                    onChange={handleChange}
                    className="peer sr-only"
                  />
                  <span className="relative h-7 w-12 rounded-full bg-[#C8D5D0] transition peer-checked:bg-[#256862] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#256862] after:absolute after:left-1 after:top-1 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow-sm after:transition-transform peer-checked:after:translate-x-5" />
                </label>
              </div>
            </div>
          </section>

          {/* Form actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-[#DCE7E2] pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-5 text-[#82908C]">
              Make sure your professional information is accurate before saving.
            </p>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#003435] px-7 py-3 text-[13px] font-bold text-white shadow-[0_5px_14px_rgba(0,52,53,0.16)] transition hover:-translate-y-0.5 hover:bg-[#164B4D] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:translate-y-0"
            >
              {saving ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Saving changes...
                </>
              ) : (
                <>
                  <span className="text-base">✓</span>
                  Save changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorProfile;
