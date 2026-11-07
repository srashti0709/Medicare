
import { useState } from "react";
import api from "../api";

const AddDoctor = ({ onDoctorAdded, onBack }) => {
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
    profileImage: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [temporaryPassword, setTemporaryPassword] = useState("");

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
    setTemporaryPassword("");
    setLoading(true);

    try {
      const token = localStorage.getItem("adminToken");

      const response = await api.post(
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

      setTemporaryPassword(
        response.data.temporaryPassword
      );
      setSuccess("Doctor added successfully!");

      setFormData({
        name: "",
        email: "",
        specialization: "",
        department: "",
        qualification: "",
        experience: "",
        consultationFee: "",
        phone: "",
        about: "",
        profileImage: "",
      });


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
              Back to Doctors
            </button>

            <div className="mb-1 flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#2E9C8F]" />

              <span className="text-base font-bold uppercase tracking-[0.16em] text-[#256862]">
                Doctor Management
              </span>
            </div>

            <h2 className="font-['Bricolage_Grotesque'] text-[23px] font-semibold leading-8 text-[#164B4D] sm:text-[25px]">
              Add Doctor
            </h2>

            <p className="mt-1 text-base text-[#526563]">
              Add a new doctor to the hospital.
            </p>
          </div>

          {/* FORM CARD */}
          <div className="overflow-hidden rounded-2xl border border-[#DCEAE7] bg-white shadow-[0_8px_30px_-22px_rgba(15,52,55,0.45)]">
            <div className="p-4 sm:p-6 xl:p-7">

              {/* SUCCESS */}
              {success && (
                <div className="mb-6 space-y-3">
                  <div className="flex items-center gap-3 rounded-xl border border-[#BFDCD5] border-l-4 border-l-[#2E9C8F] bg-[#EAF7F3] px-4 py-3 text-base font-medium text-[#256862]">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#ADEFE7] font-bold text-[#00504A]">
                      ✓
                    </span>

                    <span>{success}</span>
                  </div>

                  {temporaryPassword && (
                    <div className="rounded-xl border border-[#C0DCD7] bg-[#DCF3EE] p-4">
                      <h3 className="font-semibold text-[#164B4D]">
                        Doctor Login Credentials
                      </h3>

                      <p className="mt-1 text-base text-[#526563]">
                        Share these credentials securely with the doctor.
                        This temporary password will not be shown again.
                      </p>

                      <div className="mt-3 rounded-lg border border-[#CBDAD6] bg-white p-3">
                        <p className="text-sm font-semibold text-[#526563]">
                          Temporary Password
                        </p>

                        <p className="mt-1 break-all font-mono text-lg font-bold text-[#003435]">
                          {temporaryPassword}
                        </p>
                      </div>

                      <p className="mt-3 text-sm text-[#526563]">
                        The doctor must change this password after logging in.
                      </p>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      if (onDoctorAdded) {
                        onDoctorAdded();
                      }
                    }}
                    className="rounded-xl bg-[#164B4D] px-5 py-2.5 text-base font-semibold text-white hover:bg-[#0F3437]"
                  >
                    Back to Doctors List
                  </button>
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
                <div className="mb-6">
                  <h3 className="font-['Bricolage_Grotesque'] text-[19px] font-semibold text-[#164B4D]">
                    Basic Information
                  </h3>

                  <p className="mt-1 text-base text-[#667876]">
                    Enter the doctor's basic contact and account information.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">

                  {/* NAME */}
                  <div className="min-w-0">
                    <label className="mb-1.5 block text-base font-semibold text-[#164B4D]">
                      Full Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Dr. John Smith"
                      required
                      className="w-full rounded-xl border border-[#CBDAD6] bg-white px-3.5 py-2.5 text-base text-[#0F3437] outline-none transition placeholder:text-[#8FA6A2] focus:border-[#164B4D] focus:ring-2 focus:ring-[#9ADBD3]/60"
                    />
                  </div>

                  {/* EMAIL */}
                  <div className="min-w-0">
                    <label className="mb-1.5 block text-base font-semibold text-[#164B4D]">
                      Email
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="doctor@medicare.com"
                      required
                      className="w-full rounded-xl border border-[#CBDAD6] bg-white px-3.5 py-2.5 text-base text-[#0F3437] outline-none transition placeholder:text-[#8FA6A2] focus:border-[#164B4D] focus:ring-2 focus:ring-[#9ADBD3]/60"
                    />
                  </div>

                  {/* PHONE */}
                  <div className="min-w-0">
                    <label className="mb-1.5 block text-base font-semibold text-[#164B4D]">
                      Phone
                    </label>

                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="9876543210"
                      className="w-full rounded-xl border border-[#CBDAD6] bg-white px-3.5 py-2.5 text-base text-[#0F3437] outline-none transition placeholder:text-[#8FA6A2] focus:border-[#164B4D] focus:ring-2 focus:ring-[#9ADBD3]/60"
                    />
                  </div>

                </div>

                {/* PROFESSIONAL INFORMATION */}
                <div className="mb-6 mt-7 sm:mt-8">
                  <h3 className="font-['Bricolage_Grotesque'] text-[19px] font-semibold text-[#164B4D]">
                    Professional Information
                  </h3>

                  <p className="mt-1 text-base text-[#667876]">
                    Add the doctor's specialization, department, experience,
                    and consultation details.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">

                  {/* SPECIALIZATION */}
                  <div className="min-w-0">
                    <label className="mb-1.5 block text-base font-semibold text-[#164B4D]">
                      Specialization
                    </label>

                    <input
                      type="text"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleChange}
                      placeholder="Cardiologist"
                      required
                      className="w-full rounded-xl border border-[#CBDAD6] bg-white px-3.5 py-2.5 text-base text-[#0F3437] outline-none transition placeholder:text-[#8FA6A2] focus:border-[#164B4D] focus:ring-2 focus:ring-[#9ADBD3]/60"
                    />
                  </div>

                  {/* DEPARTMENT */}
                  <div className="min-w-0">
                    <label className="mb-1.5 block text-base font-semibold text-[#164B4D]">
                      Department
                    </label>

                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      placeholder="Cardiology"
                      required
                      className="w-full rounded-xl border border-[#CBDAD6] bg-white px-3.5 py-2.5 text-base text-[#0F3437] outline-none transition placeholder:text-[#8FA6A2] focus:border-[#164B4D] focus:ring-2 focus:ring-[#9ADBD3]/60"
                    />
                  </div>

                  {/* QUALIFICATION */}
                  <div className="min-w-0">
                    <label className="mb-1.5 block text-base font-semibold text-[#164B4D]">
                      Qualification
                    </label>

                    <input
                      type="text"
                      name="qualification"
                      value={formData.qualification}
                      onChange={handleChange}
                      placeholder="MBBS, MD Cardiology"
                      required
                      className="w-full rounded-xl border border-[#CBDAD6] bg-white px-3.5 py-2.5 text-base text-[#0F3437] outline-none transition placeholder:text-[#8FA6A2] focus:border-[#164B4D] focus:ring-2 focus:ring-[#9ADBD3]/60"
                    />
                  </div>

                  {/* EXPERIENCE */}
                  <div className="min-w-0">
                    <label className="mb-1.5 block text-base font-semibold text-[#164B4D]">
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
                      className="w-full rounded-xl border border-[#CBDAD6] bg-white px-3.5 py-2.5 text-base text-[#0F3437] outline-none transition placeholder:text-[#8FA6A2] focus:border-[#164B4D] focus:ring-2 focus:ring-[#9ADBD3]/60"
                    />
                  </div>

                  {/* CONSULTATION FEE */}
                  <div className="min-w-0">
                    <label className="mb-1.5 block text-base font-semibold text-[#164B4D]">
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
                      className="w-full rounded-xl border border-[#CBDAD6] bg-white px-3.5 py-2.5 text-base text-[#0F3437] outline-none transition placeholder:text-[#8FA6A2] focus:border-[#164B4D] focus:ring-2 focus:ring-[#9ADBD3]/60"
                    />
                  </div>

                </div>

                {/* PROFILE IMAGE */}
                <div className="mb-6 mt-7 sm:mt-8">
                  <h3 className="font-['Bricolage_Grotesque'] text-[19px] font-semibold text-[#164B4D]">
                    Doctor Profile Image
                  </h3>

                  <p className="mt-1 text-base text-[#667876]">
                    Add an image URL to display the doctor's photograph across Medicare.
                  </p>
                </div>

                <div className="grid grid-cols-1 items-start gap-5 sm:grid-cols-2">

                  <div className="min-w-0">
                    <label className="mb-1.5 block text-base font-semibold text-[#164B4D]">
                      Profile Image URL
                    </label>

                    <input
                      type="url"
                      name="profileImage"
                      value={formData.profileImage}
                      onChange={handleChange}
                      placeholder="https://example.com/doctor.jpg"
                      className="w-full rounded-xl border border-[#CBDAD6] bg-white px-3.5 py-2.5 text-base text-[#0F3437] outline-none transition placeholder:text-[#8FA6A2] focus:border-[#164B4D] focus:ring-2 focus:ring-[#9ADBD3]/60"
                    />

                    <p className="mt-2 text-base text-[#8FA6A2]">
                      Paste a publicly accessible image URL.
                    </p>
                  </div>

                  <div className="min-w-0">
                    <label className="mb-1.5 block text-base font-semibold text-[#164B4D]">
                      Image Preview
                    </label>

                    <div className="flex h-32 w-32 max-w-full items-center justify-center overflow-hidden rounded-2xl border border-[#CBDAD6] bg-[#F5F8F6]">
                      {formData.profileImage ? (
                        <img
                          src={formData.profileImage}
                          alt="Doctor preview"
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <span className="px-3 text-center text-base text-[#8FA6A2]">
                          Image preview will appear here
                        </span>
                      )}
                    </div>
                  </div>

                </div>

                {/* ABOUT */}
                <div className="mt-5">
                  <label className="mb-1.5 block text-base font-semibold text-[#164B4D]">
                    About Doctor
                  </label>

                  <textarea
                    name="about"
                    value={formData.about}
                    onChange={handleChange}
                    placeholder="Write a short description about the doctor..."
                    rows="5"
                    className="w-full resize-none rounded-xl border border-[#CBDAD6] bg-white px-3.5 py-2.5 text-base text-[#0F3437] outline-none transition placeholder:text-[#8FA6A2] focus:border-[#164B4D] focus:ring-2 focus:ring-[#9ADBD3]/60"
                  />
                </div>

                {/* ACTION AREA */}
                <div className="mt-8 flex flex-col justify-between gap-4 border-t border-[#E7EFED] pt-5 sm:flex-row sm:items-center">

                  <div>
                    <p className="text-base font-semibold text-[#164B4D]">
                      Create doctor profile
                    </p>

                    <p className="mt-0.5 text-base text-[#8FA6A2]">
                      A temporary login password will be generated automatically.
                    </p>
                  </div>

                  <div className="flex w-full flex-col-reverse gap-3 sm:w-auto sm:flex-row sm:items-center">

                    <button
                      type="button"
                      onClick={() => {
                        setFormData({
                          name: "",
                          email: "",
                          specialization: "",
                          department: "",
                          qualification: "",
                          experience: "",
                          consultationFee: "",
                          phone: "",
                          about: "",
                          profileImage: "",
                        });
                        setTemporaryPassword("");
                        setSuccess("");
                        setError("");
                      }}
                      className="w-full rounded-xl border border-[#CBDAD6] px-5 py-2.5 text-base font-semibold text-[#526563] transition hover:border-[#9ADBD3] hover:bg-[#F5F8F6] sm:w-auto"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-xl bg-[#164B4D] px-6 py-2.5 text-base font-semibold text-white shadow-[0_4px_12px_rgba(15,52,55,0.15)] transition-colors hover:bg-[#0F3437] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9ADBD3] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-[#8FA6A2] sm:w-auto"
                    >
                      {loading ? "Adding Doctor..." : "Add Doctor"}
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
                  Doctor Registry
                </span>

                <span className="rounded bg-[#ADEFE7] px-2 py-0.5 text-base font-bold text-[#00504A]">
                  MEDICARE
                </span>
              </div>

              <p className="mt-0.5 text-base text-[#526563]">
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
