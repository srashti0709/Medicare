import { useEffect, useState } from "react";
import api from "../api";

const AdminProfile = () => {
  const token = localStorage.getItem("adminToken");

  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const profile = response.data.user;

        setUser(profile);
        setName(profile.name || "");
      } catch (error) {
        console.error("Failed to fetch admin profile", error);

        setError(
          error.response?.data?.message || "Unable to load profile."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const response = await api.patch(
        "/users/profile",
        {
          name: name.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedUser = response.data.user;

      setUser(updatedUser);
      setName(updatedUser.name);

      localStorage.setItem(
        "adminUser",
        JSON.stringify(updatedUser)
      );

      setMessage("Profile updated successfully.");
    } catch (error) {
      console.error("Failed to update admin profile", error);

      setError(
        error.response?.data?.message ||
          "Failed to update profile."
      );
    } finally {
      setSaving(false);
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
                Account Management
              </span>
            </div>

            <h2 className="font-['Bricolage_Grotesque'] text-[25px] leading-8 font-semibold text-[#164B4D]">
              Admin Profile
            </h2>

            <p className="text-xs text-[#526563] mt-1">
              Manage your Medicare administrator account information.
            </p>
          </div>

          {/* LOADING */}
          {loading ? (
            <div className="bg-white rounded-2xl border border-[#DCEAE7] shadow-[0_8px_30px_-22px_rgba(15,52,55,0.45)] p-10 flex items-center justify-center">
              <div className="flex items-center gap-3 text-sm text-[#667876]">
                <span className="w-5 h-5 rounded-full border-2 border-[#9ADBD3] border-t-[#164B4D] animate-spin" />
                Loading profile...
              </div>
            </div>
          ) : user ? (
            <>
              {/* PROFILE CARD */}
              <div className="bg-white rounded-2xl border border-[#DCEAE7] shadow-[0_8px_30px_-22px_rgba(15,52,55,0.45)] overflow-hidden">
                {/* PROFILE HEADER */}
                <div className="p-6 xl:p-7 border-b border-[#E7EFED]">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                    <div className="w-20 h-20 rounded-2xl bg-[#DCF3EE] border border-[#C0DCD7] flex items-center justify-center shrink-0">
                      <span className="text-3xl">👨‍💼</span>
                    </div>

                    <div>
                      <h3 className="font-['Bricolage_Grotesque'] text-[22px] font-semibold text-[#164B4D]">
                        {user.name}
                      </h3>

                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#2E9C8F]" />

                        <p className="text-xs font-semibold text-[#256862] capitalize">
                          {user.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* FORM */}
                <div className="p-6 xl:p-7">
                  {/* SUCCESS */}
                  {message && (
                    <div className="flex items-center gap-3 bg-[#EAF7F3] border border-[#BFDCD5] border-l-4 border-l-[#2E9C8F] text-[#256862] px-4 py-3 rounded-xl text-sm font-medium mb-6">
                      <span className="w-6 h-6 rounded-full bg-[#ADEFE7] flex items-center justify-center text-[#00504A] font-bold">
                        ✓
                      </span>

                      <span>{message}</span>
                    </div>
                  )}

                  {/* ERROR */}
                  {error && (
                    <div className="flex items-start gap-3 bg-[#FFF1EE] border border-[#F3C9BF] border-l-4 border-l-[#F28B5B] text-[#A34A32] px-4 py-3 rounded-xl text-sm mb-6">
                      <span className="w-6 h-6 shrink-0 rounded-full bg-[#FDE0D7] flex items-center justify-center font-bold">
                        !
                      </span>

                      <span>{error}</span>
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="font-['Bricolage_Grotesque'] text-[19px] font-semibold text-[#164B4D]">
                      Account Information
                    </h3>

                    <p className="text-xs text-[#667876] mt-1">
                      Update your administrator profile information.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* FULL NAME */}
                    <div>
                      <label className="block text-[13px] font-semibold text-[#164B4D] mb-1.5">
                        Full Name
                      </label>

                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
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
                        value={user.email}
                        disabled
                        className="w-full border border-[#DCEAE7] bg-[#F5F8F6] text-[#667876] rounded-xl px-3.5 py-2.5 text-sm cursor-not-allowed outline-none"
                      />

                      <p className="text-[11px] text-[#8FA6A2] mt-1.5">
                        Administrator email cannot be changed here.
                      </p>
                    </div>

                    {/* ACCOUNT TYPE */}
                    <div>
                      <label className="block text-[13px] font-semibold text-[#164B4D] mb-1.5">
                        Account Type
                      </label>

                      <input
                        type="text"
                        value={user.role}
                        disabled
                        className="w-full border border-[#DCEAE7] bg-[#F5F8F6] text-[#667876] rounded-xl px-3.5 py-2.5 text-sm capitalize cursor-not-allowed outline-none"
                      />
                    </div>

                    {/* ACTION */}
                    <div className="pt-5 mt-2 border-t border-[#E7EFED] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <p className="text-[12px] font-semibold text-[#164B4D]">
                          Keep your profile updated
                        </p>

                        <p className="text-[11px] text-[#8FA6A2] mt-0.5">
                          Changes will be saved to your Medicare account.
                        </p>
                      </div>

                      <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-2.5 bg-[#164B4D] hover:bg-[#0F3437] disabled:bg-[#8FA6A2] disabled:cursor-not-allowed text-white rounded-xl font-semibold text-sm shadow-[0_4px_12px_rgba(15,52,55,0.15)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9ADBD3] focus-visible:ring-offset-2"
                      >
                        {saving ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* INFO CARD */}
              <div className="bg-[#DCF3EE] rounded-2xl p-5 border border-[#C0DCD7] flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#164B4D] text-white flex items-center justify-center shrink-0 text-lg">
                  ✓
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-['Bricolage_Grotesque'] text-[16px] font-semibold text-[#164B4D]">
                      Medicare Administrator
                    </span>

                    <span className="px-2 py-0.5 rounded bg-[#ADEFE7] text-[#00504A] text-[10px] font-bold">
                      ADMIN
                    </span>
                  </div>

                  <p className="text-xs text-[#526563] mt-0.5">
                    Your administrator profile controls the identity displayed
                    throughout the Medicare management dashboard.
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-2xl border border-[#F3C9BF] shadow-[0_8px_30px_-22px_rgba(15,52,55,0.45)] p-8 text-center">
              <p className="text-sm font-medium text-[#A34A32]">
                Unable to load profile.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;