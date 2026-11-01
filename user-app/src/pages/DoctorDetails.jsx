
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Stethoscope,
    GraduationCap,
    BriefcaseMedical,
    IndianRupee,
    CalendarDays,
    HeartPulse,
    ShieldCheck,
    Award,
    UserRound,
    ArrowRight,
    LoaderCircle,
    AlertCircle,
    Sparkles,
    Clock3,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../api";

const DoctorDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDoctor = async () => {
            try {
                const response = await api.get(`/doctors/${id}`);

                setDoctor(response.data.doctor);
            } catch (error) {
                console.error("Failed to fetch doctor", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDoctor();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F5F8F6]">
                <Navbar />

                <div className="min-h-[65vh] flex flex-col items-center justify-center px-4">
                    <div className="h-20 w-20 rounded-3xl bg-[#E7F4F1] flex items-center justify-center mb-6">
                        <LoaderCircle
                            size={38}
                            className="text-[#256862] animate-spin"
                        />
                    </div>

                    <h2 className="text-2xl font-bold text-[#003435]">
                        Loading Doctor Details
                    </h2>

                    <p className="text-base text-[#65736F] mt-3">
                        Please wait while we fetch the doctor's information.
                    </p>
                </div>

                <Footer />
            </div>
        );
    }

    if (!doctor) {
        return (
            <div className="min-h-screen bg-[#F5F8F6]">
                <Navbar />

                <div className="min-h-[65vh] flex flex-col items-center justify-center px-4 text-center">
                    <div className="h-20 w-20 rounded-3xl bg-red-50 flex items-center justify-center mb-6">
                        <AlertCircle
                            size={38}
                            className="text-red-500"
                        />
                    </div>

                    <h2 className="text-2xl font-bold text-[#003435]">
                        Doctor Not Found
                    </h2>

                    <p className="text-base text-[#65736F] mt-3 max-w-md">
                        We couldn't find the doctor you're looking for.
                        Please return to the doctors section and try again.
                    </p>

                    <button
                        onClick={() => navigate("/doctors")}
                        className="mt-7 flex items-center gap-2 bg-[#003435] hover:bg-[#164B4D] text-white px-6 py-3 rounded-xl font-semibold text-base transition-all duration-300"
                    >
                        Explore Doctors
                        <ArrowRight size={19} />
                    </button>
                </div>

                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F5F8F6]">
            <Navbar />

            <main className="relative overflow-hidden py-10 md:py-14">
                {/* Background Decorations */}
                <div className="absolute -top-24 -right-20 h-80 w-80 rounded-full bg-[#ADEFE7]/30 blur-3xl pointer-events-none" />
                <div className="absolute bottom-10 -left-24 h-72 w-72 rounded-full bg-[#dcf3ee]/60 blur-3xl pointer-events-none" />

                <div className="relative max-w-6xl mx-auto px-4 sm:px-6">

                    {/* Page Heading */}
                    <div className="mb-9">
                        <div className="inline-flex items-center gap-2 rounded-full border border-[#CBDAD6] bg-white px-4 py-2 text-base font-semibold text-[#256862] mb-5 shadow-sm">
                            <HeartPulse size={19} />
                            Medicare Healthcare
                        </div>

                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#003435] tracking-tight">
                            Meet Your Doctor
                        </h1>

                        <p className="mt-3 text-base sm:text-lg text-[#65736F] max-w-2xl leading-relaxed">
                            Get to know your healthcare specialist, explore their
                            qualifications and experience, and book your consultation.
                        </p>
                    </div>

                    {/* Doctor Profile Card */}
                    <div className="bg-white border border-[#CBDAD6] rounded-3xl shadow-[0_12px_40px_rgba(0,52,53,0.06)] overflow-hidden">

                        {/* Profile Banner */}
                        <div className="relative bg-[#003435] px-6 sm:px-9 py-9 sm:py-11 overflow-hidden">
                            <div className="absolute -right-10 -top-20 h-64 w-64 rounded-full border-[35px] border-white/5" />
                            <div className="absolute right-40 -bottom-24 h-48 w-48 rounded-full bg-[#ADEFE7]/10 blur-3xl" />

                            <div className="relative flex flex-col md:flex-row gap-7 md:gap-9 items-center md:items-start">

                                {/* Doctor Profile Image */}
                                <div className="w-56 h-56 md:w-[280px] md:h-[280px] shrink-0 rounded-3xl bg-[#ADEFE7] border-4 border-white/20 flex items-center justify-center shadow-xl shadow-black/10 overflow-hidden">
                                    {doctor.profileImage ? (
                                        <img
                                            src={doctor.profileImage}
                                            alt={doctor.user?.name || "Doctor"}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.currentTarget.style.display = "none";
                                            }}
                                        />
                                    ) : (
                                        <Stethoscope
                                            size={80}
                                            strokeWidth={1.5}
                                            className="text-[#003435]"
                                        />
                                    )}
                                </div>

                                {/* Doctor Information */}
                                <div className="flex-1 text-center md:text-left">
                                    <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 text-[#ADEFE7] rounded-full px-4 py-2 text-base font-semibold mb-4">
                                        <ShieldCheck size={18} />
                                        Verified Healthcare Professional
                                    </div>

                                    <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                                        {doctor.user?.name}
                                    </h1>

                                    <p className="text-lg font-semibold text-[#ADEFE7] mt-3">
                                        {doctor.specialization}
                                    </p>

                                    <p className="text-base text-[#D2E8E3] mt-3">
                                        {doctor.qualification}
                                    </p>

                                    <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-6">
                                        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-xl px-4 py-3">
                                            <BriefcaseMedical
                                                size={19}
                                                className="text-[#ADEFE7]"
                                            />
                                            <span className="text-base text-white font-medium">
                                                {doctor.experience} Years Experience
                                            </span>
                                        </div>

                                        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-xl px-4 py-3">
                                            <IndianRupee
                                                size={19}
                                                className="text-[#ADEFE7]"
                                            />
                                            <span className="text-base text-white font-medium">
                                                ₹{doctor.consultationFee} Consultation
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Profile Content */}
                        <div className="p-6 sm:p-9">

                            {/* Information Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

                                {/* Specialization */}
                                <div className="group bg-[#F8FBF9] border border-[#CBDAD6] rounded-2xl p-5 hover:border-[#8DBBB0] hover:shadow-md transition-all duration-300">
                                    <div className="h-12 w-12 rounded-xl bg-[#E7F4F1] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                                        <Stethoscope
                                            size={24}
                                            className="text-[#256862]"
                                        />
                                    </div>

                                    <p className="text-base text-[#65736F] mb-2">
                                        Specialization
                                    </p>

                                    <h3 className="text-lg font-bold text-[#003435]">
                                        {doctor.specialization}
                                    </h3>
                                </div>

                                {/* Qualification */}
                                <div className="group bg-[#F8FBF9] border border-[#CBDAD6] rounded-2xl p-5 hover:border-[#8DBBB0] hover:shadow-md transition-all duration-300">
                                    <div className="h-12 w-12 rounded-xl bg-[#E7F4F1] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                                        <GraduationCap
                                            size={24}
                                            className="text-[#256862]"
                                        />
                                    </div>

                                    <p className="text-base text-[#65736F] mb-2">
                                        Qualification
                                    </p>

                                    <h3 className="text-lg font-bold text-[#003435]">
                                        {doctor.qualification}
                                    </h3>
                                </div>

                                {/* Experience */}
                                <div className="group bg-[#F8FBF9] border border-[#CBDAD6] rounded-2xl p-5 hover:border-[#8DBBB0] hover:shadow-md transition-all duration-300">
                                    <div className="h-12 w-12 rounded-xl bg-[#E7F4F1] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                                        <Award
                                            size={24}
                                            className="text-[#256862]"
                                        />
                                    </div>

                                    <p className="text-base text-[#65736F] mb-2">
                                        Professional Experience
                                    </p>

                                    <h3 className="text-lg font-bold text-[#003435]">
                                        {doctor.experience} Years
                                    </h3>
                                </div>
                            </div>

                            {/* About Doctor */}
                            <div className="mt-9 border-t border-[#E5EEEB] pt-8">
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="h-11 w-11 rounded-xl bg-[#E7F4F1] flex items-center justify-center">
                                        <UserRound
                                            size={23}
                                            className="text-[#256862]"
                                        />
                                    </div>

                                    <div>
                                        <h2 className="text-2xl font-bold text-[#003435]">
                                            About Doctor
                                        </h2>

                                        <p className="text-base text-[#65736F] mt-1">
                                            Professional background and introduction
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-[#F8FBF9] border border-[#CBDAD6] rounded-2xl p-6">
                                    <p className="text-base sm:text-lg text-[#404848] leading-8 whitespace-pre-line">
                                        {doctor.about || "No information available."}
                                    </p>
                                </div>
                            </div>

                            {/* Consultation Fee and Booking */}
                            <div className="mt-9 bg-[#E7F4F1] border border-[#B8DED5] rounded-3xl p-6 sm:p-8">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

                                    <div>
                                        <div className="flex items-center gap-2 text-[#256862] mb-3">
                                            <CalendarDays size={22} />
                                            <span className="text-base font-semibold">
                                                Ready to Schedule Your Visit?
                                            </span>
                                        </div>

                                        <h3 className="text-2xl sm:text-3xl font-bold text-[#003435]">
                                            Book Your Consultation
                                        </h3>

                                        <p className="text-base text-[#65736F] mt-2 max-w-lg leading-relaxed">
                                            Choose a convenient date and available time slot
                                            to schedule an appointment with this doctor.
                                        </p>
                                    </div>

                                    <div className="shrink-0">
                                        <p className="text-base text-[#65736F] mb-1">
                                            Consultation Fee
                                        </p>

                                        <p className="text-3xl font-bold text-[#003435]">
                                            ₹{doctor.consultationFee}
                                        </p>

                                        <button
                                            onClick={() =>
                                                navigate(
                                                    `/book-appointment?doctor=${doctor._id}`
                                                )
                                            }
                                            className="group mt-5 w-full md:w-auto flex items-center justify-center gap-3 bg-[#003435] hover:bg-[#164B4D] text-white px-7 py-4 rounded-2xl font-bold text-base shadow-lg shadow-[#003435]/10 hover:shadow-xl transition-all duration-300"
                                        >
                                            <CalendarDays size={21} />
                                            Book Appointment
                                            <ArrowRight
                                                size={20}
                                                className="transition-transform duration-200 group-hover:translate-x-1"
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Trust Information */}
                            <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-center">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck
                                        size={20}
                                        className="text-[#256862]"
                                    />
                                    <span className="text-base text-[#65736F]">
                                        Secure Appointment Booking
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <HeartPulse
                                        size={20}
                                        className="text-[#256862]"
                                    />
                                    <span className="text-base text-[#65736F]">
                                        Patient-Focused Healthcare
                                    </span>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Bottom Information */}
                    <div className="mt-7 flex items-start gap-4 bg-white border border-[#CBDAD6] rounded-2xl p-5">
                        <div className="h-11 w-11 rounded-xl bg-[#E7F4F1] flex items-center justify-center shrink-0">
                            <Sparkles
                                size={23}
                                className="text-[#256862]"
                            />
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-[#003435]">
                                Your Health, Our Priority
                            </h3>

                            <p className="text-base text-[#65736F] mt-1 leading-relaxed">
                                Medicare helps you connect with healthcare professionals
                                and manage your appointment journey with ease.
                            </p>
                        </div>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
};

export default DoctorDetails;
