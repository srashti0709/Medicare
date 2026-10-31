import { useEffect, useState } from "react";
import {
  UserRound,
  Mail,
  ShieldCheck,
  Save,
  LoaderCircle,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  LockKeyhole,
} from "lucide-react";

import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../api";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("userToken");

        const response = await api.get("/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const profile = response.data.user;

        setUser(profile);
        setName(profile.name || "");
      } catch (error) {
        console.error("Failed to fetch profile", error);

        setError(
          error.response?.data?.message ||
            "Unable to load profile."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

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

      const token = localStorage.getItem("userToken");

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

      setUser(response.data.user);
      setName(response.data.user.name);

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      setMessage("Profile updated successfully.");
    } catch (error) {
      console.error("Failed to update profile", error);

      setError(
        error.response?.data?.message ||
          "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#F5F8F6] text-[#0a1f1c]">
      <Navbar />

      {/* PROFILE HEADER */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[450px] w-[450px] rounded-full bg-[#ADEFE7]/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-40 h-[350px] w-[350px] rounded-full bg-[#dcf3ee]/70 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 pb-10 pt-12 md:pb-14 md:pt-16">

          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 text-base font-semibold text-[#256862] transition-colors hover:text-[#003435]"
          >
            <ArrowLeft size={19} />
            Back to Home
          </Link>

          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#B9DDD5] bg-white/80 px-4 py-2.5 shadow-sm">
                <UserRound size={18} className="text-[#258B76]" />
                <span className="text-sm font-bold tracking-wide text-[#256862]">
                  YOUR MEDICARE ACCOUNT
                </span>
              </div>

              <h1 className="font-['Bricolage_Grotesque'] text-4xl font-bold leading-tight text-[#003435] sm:text-5xl lg:text-[56px]">
                My Profile<span className="text-[#258B76]">.</span>
              </h1>

              <p className="mt-4 max-w-xl text-base leading-7 text-[#52645F] sm:text-lg">
                Manage your personal information and keep your
                Medicare account details up to date.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-[#C8DED6] bg-white/80 px-5 py-4 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#DDF3ED] text-[#256862]">
                <ShieldCheck size={23} />
              </div>
              <div>
                <p className="text-sm font-bold text-[#003435]">
                  Account Security
                </p>
                <p className="mt-1 text-sm text-[#65736F]">
                  Personal details management
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROFILE CONTENT */}
      <section className="relative mx-auto max-w-7xl px-6 pb-20">

        {loading ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-[32px] border border-[#D4E4DE] bg-white shadow-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E7F4F1] text-[#258B76]">
              <LoaderCircle size={32} className="animate-spin" />
            </div>
            <p className="mt-5 text-lg font-bold text-[#003435]">
              Loading your profile
            </p>
            <p className="mt-2 text-sm text-[#65736F]">
              Please wait while we retrieve your account details.
            </p>
          </div>
        ) : user ? (
          <div className="grid grid-cols-1 items-start gap-7 lg:grid-cols-3">

            {/* LEFT PROFILE CARD */}
            <div className="overflow-hidden rounded-[30px] border border-[#D4E4DE] bg-white shadow-[0_15px_45px_rgba(0,52,53,0.06)] lg:col-span-1">

              <div className="relative overflow-hidden bg-[#003435] px-7 pb-10 pt-9 text-center">
                <div className="absolute -right-12 -top-16 h-48 w-48 rounded-full border-[25px] border-white/5" />
                <div className="absolute -bottom-24 -left-10 h-48 w-48 rounded-full border-[25px] border-white/5" />

                <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-[28px] border border-[#ADEFE7]/30 bg-[#ADEFE7] text-[#003435] shadow-lg">
                  <UserRound size={46} strokeWidth={1.7} />
                </div>

                <h2 className="relative mt-5 break-words font-['Bricolage_Grotesque'] text-2xl font-bold text-white">
                  {user.name}
                </h2>

                <p className="relative mt-2 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold capitalize text-[#ADEFE7]">
                  <span className="h-2 w-2 rounded-full bg-[#ADEFE7]" />
                  {user.role}
                </p>
              </div>

              <div className="space-y-5 p-6 sm:p-7">

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#8A9A94]">
                    ACCOUNT OVERVIEW
                  </p>
                </div>

                <div className="flex items-start gap-4 rounded-2xl bg-[#F5F8F6] p-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#DDF3ED] text-[#256862]">
                    <Mail size={21} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[#8A9A94]">
                      Email Address
                    </p>
                    <p className="mt-1 break-all text-sm font-semibold text-[#164B4D]">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-2xl bg-[#F5F8F6] p-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#DDF3ED] text-[#256862]">
                    <ShieldCheck size={21} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#8A9A94]">
                      Account Type
                    </p>
                    <p className="mt-1 text-sm font-bold capitalize text-[#164B4D]">
                      {user.role}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#C8DED6] bg-[#E7F4F1] p-4">
                  <div className="flex items-center gap-2 text-[#256862]">
                    <LockKeyhole size={18} />
                    <p className="text-sm font-bold">
                      Your Account
                    </p>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#52645F]">
                    Your account information is managed securely
                    through your Medicare profile.
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT EDIT PROFILE CARD */}
            <div className="rounded-[30px] border border-[#D4E4DE] bg-white p-6 shadow-[0_15px_45px_rgba(0,52,53,0.06)] sm:p-9 lg:col-span-2">

              <div className="mb-8 flex items-center gap-4 border-b border-[#E3ECE8] pb-7">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#E7F4F1] text-[#256862]">
                  <UserRound size={27} />
                </div>

                <div>
                  <h2 className="font-['Bricolage_Grotesque'] text-2xl font-bold text-[#003435] sm:text-3xl">
                    Personal Information
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-[#65736F]">
                    Update your details and manage your account.
                  </p>
                </div>
              </div>

              {/* SUCCESS MESSAGE */}
              {message && (
                <div className="mb-6 flex items-start gap-3 rounded-2xl border border-[#B8DED0] bg-[#E7F4F1] px-5 py-4 text-[#256862]">
                  <CheckCircle2 size={21} className="mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-bold">
                      Successfully Updated
                    </p>
                    <p className="mt-1 text-sm">
                      {message}
                    </p>
                  </div>
                </div>
              )}

              {/* ERROR MESSAGE */}
              {error && (
                <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
                  <AlertCircle size={21} className="mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-bold">
                      Something went wrong
                    </p>
                    <p className="mt-1 text-sm">
                      {error}
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-7">

                {/* FULL NAME */}
                <div>
                  <label className="mb-3 flex items-center gap-2 text-sm font-bold text-[#164B4D]">
                    <UserRound size={17} className="text-[#258B76]" />
                    Full Name
                  </label>

                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full rounded-2xl border border-[#CBDAD6] bg-[#FAFCFB] px-5 py-4 text-base text-[#003435] outline-none transition-all placeholder:text-[#9AA9A3] hover:border-[#8EBFB2] focus:border-[#258B76] focus:bg-white focus:ring-4 focus:ring-[#ADEFE7]/30"
                    required
                  />

                  <p className="mt-2 text-xs text-[#87958F]">
                    This is the name associated with your Medicare account.
                  </p>
                </div>

                {/* EMAIL */}
                <div>
                  <label className="mb-3 flex items-center gap-2 text-sm font-bold text-[#164B4D]">
                    <Mail size={17} className="text-[#258B76]" />
                    Email Address
                  </label>

                  <div className="relative">
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full cursor-not-allowed rounded-2xl border border-[#DCE8E3] bg-[#F0F5F2] px-5 py-4 pr-12 text-base text-[#81918A]"
                    />

                    <LockKeyhole
                      size={18}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-[#91A59C]"
                    />
                  </div>

                  <p className="mt-2 flex items-center gap-1.5 text-xs text-[#87958F]">
                    <ShieldCheck size={14} />
                    Your registered email address cannot be changed.
                  </p>
                </div>

                {/* ACCOUNT TYPE */}
                <div>
                  <label className="mb-3 flex items-center gap-2 text-sm font-bold text-[#164B4D]">
                    <ShieldCheck size={17} className="text-[#258B76]" />
                    Account Type
                  </label>

                  <div className="relative">
                    <input
                      type="text"
                      value={user.role}
                      disabled
                      className="w-full cursor-not-allowed rounded-2xl border border-[#DCE8E3] bg-[#F0F5F2] px-5 py-4 pr-12 text-base capitalize text-[#81918A]"
                    />

                    <LockKeyhole
                      size={18}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-[#91A59C]"
                    />
                  </div>

                  <p className="mt-2 text-xs text-[#87958F]">
                    Your account role is assigned by the platform.
                  </p>
                </div>

                {/* SUBMIT BUTTON */}
                <div className="border-t border-[#E3ECE8] pt-7">
                  <button
                    type="submit"
                    disabled={saving}
                    className="group inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-[#003F40] px-8 py-4 text-base font-bold text-white shadow-[0_12px_25px_rgba(0,52,53,0.15)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#145B57] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:w-auto"
                  >
                    {saving ? (
                      <>
                        <LoaderCircle size={20} className="animate-spin" />
                        Saving Changes...
                      </>
                    ) : (
                      <>
                        <Save size={20} />
                        Save Changes
                        <Sparkles
                          size={17}
                          className="transition-transform group-hover:rotate-12"
                        />
                      </>
                    )}
                  </button>

                  <p className="mt-4 text-xs leading-6 text-[#87958F]">
                    Make sure your information is correct before saving
                    your profile changes.
                  </p>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex min-h-[350px] flex-col items-center justify-center rounded-[30px] border border-[#D4E4DE] bg-white p-8 text-center shadow-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <AlertCircle size={32} />
            </div>
            <h2 className="mt-5 font-['Bricolage_Grotesque'] text-2xl font-bold text-[#003435]">
              Unable to Load Profile
            </h2>
            <p className="mt-2 max-w-md text-sm leading-7 text-[#65736F]">
              {error || "Unable to load profile."}
            </p>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Profile;