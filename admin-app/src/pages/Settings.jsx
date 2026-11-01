import { useState } from "react";

const Settings = () => {
  const adminUser = JSON.parse(
    localStorage.getItem("adminUser") || "{}"
  );

  const [formData, setFormData] = useState({
    name: adminUser.name || "Admin",
    email: adminUser.email || "",
    hospitalName: "Medicare Hospital",
    phone: "",
    address: "",
  });

  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setSuccess("Settings saved successfully!");

    setTimeout(() => {
      setSuccess("");
    }, 3000);
  };

  return (
    <div className="medicare-settings-responsive min-h-full">
      <style>{`
  .medicare-settings-responsive {
    width: 100%;
    min-width: 0;
    font-family: 'Manrope', ui-sans-serif, system-ui, sans-serif;
  }

  .medicare-settings-responsive input,
  .medicare-settings-responsive textarea,
  .medicare-settings-responsive button {
    font-family: inherit;
  }

  @media (max-width: 767px) {
    /* Page spacing */
    .medicare-settings-responsive > div {
      padding: 16px;
    }

    .medicare-settings-responsive .max-w-\\[1450px\\] {
      width: 100%;
      min-width: 0;
    }

    /* Page heading */
    .medicare-settings-responsive h2 {
      font-size: 24px;
      line-height: 1.3;
    }

    .medicare-settings-responsive h3 {
      font-size: 18px;
      line-height: 1.4;
    }

    /* Settings sections */
    .medicare-settings-responsive form > div {
      padding: 20px;
    }

    .medicare-settings-responsive .grid {
      gap: 16px;
    }

    /* Inputs */
    .medicare-settings-responsive input,
    .medicare-settings-responsive textarea {
      width: 100%;
      min-width: 0;
      font-size: 16px;
      min-height: 44px;
    }

    .medicare-settings-responsive textarea {
      min-height: 100px;
    }

    /* Save section */
    .medicare-settings-responsive form > div:last-child {
      flex-wrap: wrap;
      align-items: flex-start;
      gap: 16px;
    }

    .medicare-settings-responsive form > div:last-child > div {
      min-width: 0;
    }

    .medicare-settings-responsive form > div:last-child button {
      width: 100%;
      min-height: 44px;
    }

    /* System information */
    .medicare-settings-responsive .bg-\\[\\#DCF3EE\\] {
      padding: 16px;
    }
  }

  @media (max-width: 480px) {
    .medicare-settings-responsive > div {
      padding: 12px;
    }

    /* Compact section spacing */
    .medicare-settings-responsive form > div {
      padding: 16px;
    }

    .medicare-settings-responsive form > div > div:first-child {
      margin-bottom: 16px;
    }

    /* Section descriptions */
    .medicare-settings-responsive form > div p {
      line-height: 1.6;
    }

    /* Save button area */
    .medicare-settings-responsive form > div:last-child {
      padding: 16px;
    }

    .medicare-settings-responsive form > div:last-child button {
      padding: 12px 16px;
    }

    /* Success message */
    .medicare-settings-responsive [class*="bg-[#EAF7F3]"] {
      padding: 12px;
      align-items: flex-start;
    }

    /* System information */
    .medicare-settings-responsive .bg-\\[\\#DCF3EE\\] {
      gap: 12px;
      padding: 14px;
    }

    .medicare-settings-responsive .bg-\\[\\#DCF3EE\\] p {
      font-size: 13px;
      line-height: 1.6;
    }
  }

  @media (max-width: 360px) {
    .medicare-settings-responsive > div {
      padding: 10px;
    }

    .medicare-settings-responsive form > div {
      padding: 14px;
    }

    .medicare-settings-responsive h2 {
      font-size: 22px;
    }

    .medicare-settings-responsive form > div:last-child {
      padding: 14px;
    }
  }
`}</style>
      <div className="p-6 xl:p-8">
        <div className="max-w-[1450px] mx-auto space-y-6">

          {/* PAGE HEADER */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-[#2E9C8F] animate-pulse" />

                <span className="text-base font-bold uppercase tracking-[0.16em] text-[#256862]">
                  System Configuration
                </span>
              </div>

              <h2 className="font-['Bricolage_Grotesque'] text-[25px] leading-8 font-semibold text-[#164B4D]">
                Settings
              </h2>

              <p className="text-base text-[#526563] mt-1">
                Manage hospital and administrator information.
              </p>
            </div>
          </div>

          {/* SUCCESS MESSAGE */}
          {success && (
            <div className="flex items-center gap-3 bg-[#EAF7F3] border border-[#BFDCD5] border-l-4 border-l-[#2E9C8F] text-[#256862] px-4 py-3 rounded-xl text-base font-medium">
              <span className="w-6 h-6 rounded-full bg-[#ADEFE7] flex items-center justify-center text-[#00504A] font-bold">
                ✓
              </span>

              <span>{success}</span>
            </div>
          )}

          {/* SETTINGS CARD */}
          <div className="bg-white rounded-2xl border border-[#DCEAE7] shadow-[0_8px_30px_-22px_rgba(15,52,55,0.45)] overflow-hidden">

            <form onSubmit={handleSubmit}>

              {/* ADMINISTRATOR INFORMATION */}
              <div className="p-6 xl:p-7 border-b border-[#E7EFED]">
                <div className="mb-5">
                  <h3 className="font-['Bricolage_Grotesque'] text-[19px] font-semibold text-[#164B4D]">
                    Administrator Information
                  </h3>

                  <p className="text-base text-[#667876] mt-1">
                    Manage the administrator details associated with this dashboard.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  {/* NAME */}
                  <div>
                    <label className="block text-base font-semibold text-[#164B4D] mb-1.5">
                      Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-white border border-[#CBDAD6] rounded-xl px-3.5 py-2.5 text-base text-[#0F3437] placeholder:text-[#8FA6A2] outline-none transition focus:border-[#164B4D] focus:ring-2 focus:ring-[#9ADBD3]/60"
                    />
                  </div>

                  {/* EMAIL */}
                  <div>
                    <label className="block text-base font-semibold text-[#164B4D] mb-1.5">
                      Email
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      disabled
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCEAE7] bg-[#F5F8F6] text-[#667876] text-base outline-none cursor-not-allowed"
                    />

                    <p className="text-base text-[#8FA6A2] mt-1.5">
                      Administrator email cannot be changed here.
                    </p>
                  </div>
                </div>
              </div>

              {/* HOSPITAL INFORMATION */}
              <div className="p-6 xl:p-7 border-b border-[#E7EFED]">
                <div className="mb-5">
                  <h3 className="font-['Bricolage_Grotesque'] text-[19px] font-semibold text-[#164B4D]">
                    Hospital Information
                  </h3>

                  <p className="text-base text-[#667876] mt-1">
                    Update the basic information displayed for your hospital.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  {/* HOSPITAL NAME */}
                  <div>
                    <label className="block text-base font-semibold text-[#164B4D] mb-1.5">
                      Hospital Name
                    </label>

                    <input
                      type="text"
                      name="hospitalName"
                      value={formData.hospitalName}
                      onChange={handleChange}
                      className="w-full bg-white border border-[#CBDAD6] rounded-xl px-3.5 py-2.5 text-base text-[#0F3437] placeholder:text-[#8FA6A2] outline-none transition focus:border-[#164B4D] focus:ring-2 focus:ring-[#9ADBD3]/60"
                    />
                  </div>

                  {/* PHONE */}
                  <div>
                    <label className="block text-base font-semibold text-[#164B4D] mb-1.5">
                      Phone
                    </label>

                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Hospital phone number"
                      className="w-full bg-white border border-[#CBDAD6] rounded-xl px-3.5 py-2.5 text-base text-[#0F3437] placeholder:text-[#8FA6A2] outline-none transition focus:border-[#164B4D] focus:ring-2 focus:ring-[#9ADBD3]/60"
                    />
                  </div>

                  {/* ADDRESS */}
                  <div className="md:col-span-2">
                    <label className="block text-base font-semibold text-[#164B4D] mb-1.5">
                      Address
                    </label>

                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Hospital address"
                      rows="3"
                      className="w-full bg-white border border-[#CBDAD6] rounded-xl px-3.5 py-2.5 text-base text-[#0F3437] placeholder:text-[#8FA6A2] outline-none transition focus:border-[#164B4D] focus:ring-2 focus:ring-[#9ADBD3]/60 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="px-6 xl:px-7 py-5 bg-[#F5F8F6] flex items-center justify-between gap-4">
                <div>
                  <p className="text-base font-semibold text-[#164B4D]">
                    Save your configuration
                  </p>

                  <p className="text-base text-[#8FA6A2] mt-0.5">
                    Changes will be applied to the current settings form.
                  </p>
                </div>

                <button
                  type="submit"
                  className="bg-[#164B4D] hover:bg-[#0F3437] text-white font-semibold px-6 py-2.5 rounded-xl text-base shadow-[0_4px_12px_rgba(15,52,55,0.15)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9ADBD3] focus-visible:ring-offset-2"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>

          {/* SYSTEM INFORMATION */}
          <div className="bg-[#DCF3EE] rounded-2xl p-5 border border-[#C0DCD7] flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-[#164B4D] text-white flex items-center justify-center shrink-0">
              ⚙
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-['Bricolage_Grotesque'] text-[16px] font-semibold text-[#164B4D]">
                  Medicare System Configuration
                </span>

                <span className="px-2 py-0.5 rounded bg-[#ADEFE7] text-[#00504A] text-base font-bold">
                  SYSTEM
                </span>
              </div>

              <p className="text-base text-[#526563] mt-0.5">
                Manage administrator and hospital information from one centralized configuration panel.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Settings;