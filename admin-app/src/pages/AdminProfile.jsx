
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const AdminProfile = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");

  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [profileImage, setProfileImage] = useState("");
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
        setProfileImage(profile.profileImage || "");
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
          profileImage: profileImage.trim(),
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
      setProfileImage(updatedUser.profileImage || "");

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
    <div className="min-h-full w-full">
      <div className="px-3 py-4 sm:p-5 md:p-6 xl:p-8">
        <div className="max-w-[1450px] mx-auto space-y-5 sm:space-y-6">

          {/* PAGE HEADER */}
          <div>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 px-4 py-2 mb-4 sm:mb-5 rounded-xl border border-[#CBDAD6] bg-white text-[#164B4D] text-sm sm:text-base font-semibold hover:bg-[#E7F4F1] hover:border-[#9ADBD3] transition-colors"
            >
              <span className="text-xl">←</span>
              Back
            </button>

            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#2E9C8F] animate-pulse" />

              <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.16em] text-[#256862]">
                Account Management
              </span>
            </div>

            <h2 className="font-['Bricolage_Grotesque'] text-2xl sm:text-[25px] leading-8 font-semibold text-[#164B4D]">
              Admin Profile
            </h2>

            <p className="text-sm sm:text-base text-[#526563] mt-1">
              Manage your Medicare administrator account information.
            </p>
          </div>

          {/* LOADING */}
          {loading ? (
            <div className="bg-white rounded-2xl border border-[#DCEAE7] shadow-[0_8px_30px_-22px_rgba(15,52,55,0.45)] p-6 sm:p-10 flex items-center justify-center">
              <div className="flex items-center gap-3 text-sm sm:text-base text-[#667876]">
                <span className="w-5 h-5 rounded-full border-2 border-[#9ADBD3] border-t-[#164B4D] animate-spin" />
                Loading profile...
              </div>
            </div>
          ) : user ? (
            <>
              {/* PROFILE CARD */}
              <div className="bg-white rounded-2xl border border-[#DCEAE7] shadow-[0_8px_30px_-22px_rgba(15,52,55,0.45)] overflow-hidden">

                {/* PROFILE HEADER */}
                <div className="p-4 sm:p-6 xl:p-7 border-b border-[#E7EFED]">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">

                    <div className="w-20 h-20 rounded-2xl bg-[#DCF3EE] border border-[#C0DCD7] flex items-center justify-center shrink-0 overflow-hidden">
                      {profileImage ? (
                        <img
                          src={profileImage}
                          alt="Admin profile"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <span className="text-3xl">👨‍💼</span>
                      )}
                    </div>

                    <div className="min-w-0">
                      <h3 className="font-['Bricolage_Grotesque'] text-xl sm:text-[22px] font-semibold text-[#164B4D] break-words">
                        {user.name}
                      </h3>

                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#2E9C8F]" />

                        <p className="text-sm sm:text-base font-semibold text-[#256862] capitalize">
                          {user.role}
                        </p>
                      </div>
                    </div>

                  </div>
                </div>

                {/* FORM */}
                <div className="p-4 sm:p-6 xl:p-7">

                  {/* SUCCESS */}
                  {message && (
                    <div className="flex items-start sm:items-center gap-3 bg-[#EAF7F3] border border-[#BFDCD5] border-l-4 border-l-[#2E9C8F] text-[#256862] px-3 sm:px-4 py-3 rounded-xl text-sm sm:text-base font-medium mb-6">
                      <span className="w-6 h-6 shrink-0 rounded-full bg-[#ADEFE7] flex items-center justify-center text-[#00504A] font-bold">
                        ✓
                      </span>

                      <span>{message}</span>
                    </div>
                  )}

                  {/* ERROR */}
                  {error && (
                    <div className="flex items-start gap-3 bg-[#FFF1EE] border border-[#F3C9BF] border-l-4 border-l-[#F28B5B] text-[#A34A32] px-3 sm:px-4 py-3 rounded-xl text-sm sm:text-base mb-6">
                      <span className="w-6 h-6 shrink-0 rounded-full bg-[#FDE0D7] flex items-center justify-center font-bold">
                        !
                      </span>

                      <span className="break-words">{error}</span>
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="font-['Bricolage_Grotesque'] text-lg sm:text-[19px] font-semibold text-[#164B4D]">
                      Account Information
                    </h3>

                    <p className="text-sm sm:text-base text-[#667876] mt-1">
                      Update your administrator profile information.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">

                    {/* PROFILE IMAGE */}
                    <div>
                      <label className="block text-sm sm:text-base font-semibold text-[#164B4D] mb-1.5">
                        Profile Image URL
                      </label>

                      <input
                        type="url"
                        value={profileImage}
                        onChange={(e) => setProfileImage(e.target.value)}
                        placeholder="Paste your profile image URL"
                        className="w-full min-w-0 bg-white border border-[#CBDAD6] rounded-xl px-3.5 py-2.5 text-sm sm:text-base text-[#0F3437] placeholder:text-[#8FA6A2] outline-none transition focus:border-[#164B4D] focus:ring-2 focus:ring-[#9ADBD3]/60"
                      />

                      <p className="text-xs sm:text-sm text-[#8FA6A2] mt-1.5">
                        Add a direct image URL to display your profile picture across Medicare.
                      </p>

                      {/* IMAGE PREVIEW */}
                      {profileImage && (
                        <div className="mt-4">
                          <p className="text-sm sm:text-base font-semibold text-[#164B4D] mb-2">
                            Image Preview
                          </p>

                          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border border-[#CBDAD6] bg-[#F5F8F6] overflow-hidden">
                            <img
                              src={profileImage}
                              alt="Profile preview"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* FULL NAME */}
                    <div>
                      <label className="block text-sm sm:text-base font-semibold text-[#164B4D] mb-1.5">
                        Full Name
                      </label>

                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full min-w-0 bg-white border border-[#CBDAD6] rounded-xl px-3.5 py-2.5 text-sm sm:text-base text-[#0F3437] placeholder:text-[#8FA6A2] outline-none transition focus:border-[#164B4D] focus:ring-2 focus:ring-[#9ADBD3]/60"
                      />
                    </div>

                    {/* EMAIL */}
                    <div>
                      <label className="block text-sm sm:text-base font-semibold text-[#164B4D] mb-1.5">
                        Email
                      </label>

                      <input
                        type="email"
                        value={user.email}
                        disabled
                        className="w-full min-w-0 border border-[#DCEAE7] bg-[#F5F8F6] text-[#667876] rounded-xl px-3.5 py-2.5 text-sm sm:text-base cursor-not-allowed outline-none"
                      />

                      <p className="text-xs sm:text-sm text-[#8FA6A2] mt-1.5">
                        Administrator email cannot be changed here.
                      </p>
                    </div>

                    {/* ACCOUNT TYPE */}
                    <div>
                      <label className="block text-sm sm:text-base font-semibold text-[#164B4D] mb-1.5">
                        Account Type
                      </label>

                      <input
                        type="text"
                        value={user.role}
                        disabled
                        className="w-full min-w-0 border border-[#DCEAE7] bg-[#F5F8F6] text-[#667876] rounded-xl px-3.5 py-2.5 text-sm sm:text-base capitalize cursor-not-allowed outline-none"
                      />
                    </div>

                    {/* ACTION */}
                    <div className="pt-5 mt-2 border-t border-[#E7EFED] flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                      <div className="min-w-0">
                        <p className="text-sm sm:text-base font-semibold text-[#164B4D]">
                          Keep your profile updated
                        </p>

                        <p className="text-xs sm:text-sm text-[#8FA6A2] mt-0.5">
                          Changes will be saved to your Medicare account.
                        </p>
                      </div>

                      <button
                        type="submit"
                        disabled={saving}
                        className="w-full sm:w-auto px-6 py-2.5 bg-[#164B4D] hover:bg-[#0F3437] disabled:bg-[#8FA6A2] disabled:cursor-not-allowed text-white rounded-xl font-semibold text-sm sm:text-base shadow-[0_4px_12px_rgba(15,52,55,0.15)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9ADBD3] focus-visible:ring-offset-2"
                      >
                        {saving ? "Saving..." : "Save Changes"}
                      </button>

                    </div>
                  </form>
                </div>
              </div>

              {/* INFO CARD */}
              <div className="bg-[#DCF3EE] rounded-2xl p-4 sm:p-5 border border-[#C0DCD7] flex flex-col sm:flex-row items-start sm:items-center gap-4">

                <div className="w-11 h-11 rounded-xl bg-[#164B4D] text-white flex items-center justify-center shrink-0 text-lg">
                  ✓
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-['Bricolage_Grotesque'] text-base font-semibold text-[#164B4D]">
                      Medicare Administrator
                    </span>

                    <span className="px-2 py-0.5 rounded bg-[#ADEFE7] text-[#00504A] text-xs sm:text-sm font-bold">
                      ADMIN
                    </span>
                  </div>

                  <p className="text-sm sm:text-base text-[#526563] mt-0.5">
                    Your administrator profile controls the identity displayed
                    throughout the Medicare management dashboard.
                  </p>
                </div>

              </div>
            </>
          ) : (
            <div className="bg-white rounded-2xl border border-[#F3C9BF] shadow-[0_8px_30px_-22px_rgba(15,52,55,0.45)] p-6 sm:p-8 text-center">
              <p className="text-sm sm:text-base font-medium text-[#A34A32]">
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
