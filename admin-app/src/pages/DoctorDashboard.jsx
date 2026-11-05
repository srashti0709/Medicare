import { useEffect, useMemo, useState } from "react";
import api from "../api";
import DoctorNavbar from "../components/DoctorNavbar";

const heading = "font-['Bricolage_Grotesque',sans-serif]";
const body = "font-['Manrope',sans-serif]";

const Icon = ({ name, className = "" }) => (
    <span className={`material-symbols-outlined ${className}`}>{name}</span>
);

const getInitials = (name = "") =>
    name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase() || "PT";

const statusStyles = {
    pending: "bg-[#FFF0E8] text-[#9A431A]",
    confirmed: "bg-[#DDF5EF] text-[#12665D]",
    completed: "bg-[#E7F4F1] text-[#256862]",
    cancelled: "bg-[#FFE8E6] text-[#A83232]",
};

const statusDot = {
    pending: "bg-[#E68B55]",
    confirmed: "bg-[#256862]",
    completed: "bg-[#2C6E68]",
    cancelled: "bg-[#BA1A1A]",
};

const noteTemplates = [
    {
        label: "+ Vitals Stable",
        text: "- Vitals stable, cardiopulmonary exam unremarkable.",
    },
    {
        label: "+ Med Tolerance",
        text: "- Medication tolerance confirmed with no reported adverse symptoms.",
    },
    {
        label: "+ 90-Day Lab",
        text: "- Scheduled 90-day comprehensive laboratory follow-up.",
    },
];

const DoctorDashboard = () => {
    const [appointments, setAppointments] = useState([]);
    const [stats, setStats] = useState({
        todayAppointments: 0,
        upcomingAppointments: 0,
        completedAppointments: 0,
        totalPatients: 0,
    });

    const [loading, setLoading] = useState(true);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [notes, setNotes] = useState({});
    const [savingNotes, setSavingNotes] = useState(null);

    const [preConsultation, setPreConsultation] = useState(null);
    const [preConsultationLoading, setPreConsultationLoading] = useState(false);
    const [preConsultationError, setPreConsultationError] = useState("");
    const [preConsultationAppointmentId, setPreConsultationAppointmentId] =
        useState(null);

    const [statusFilter, setStatusFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [activeId, setActiveId] = useState(null);

    const token = localStorage.getItem("adminToken");
    const doctorUser = JSON.parse(
        localStorage.getItem("adminUser") || "{}"
    );

    useEffect(() => {
        const href =
            "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..700&family=Manrope:wght@400..700&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap";

        if (!document.querySelector(`link[href="${href}"]`)) {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = href;
            document.head.appendChild(link);
        }
    }, []);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [appointmentsResponse, statsResponse] =
                    await Promise.all([
                        api.get("/appointments/doctor", {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }),
                        api.get("/dashboard/doctor-stats", {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }),
                    ]);

                setAppointments(
                    appointmentsResponse.data.appointments || []
                );

                setStats(statsResponse.data.stats || {
                    todayAppointments: 0,
                    upcomingAppointments: 0,
                    completedAppointments: 0,
                    totalPatients: 0,
                });
            } catch (error) {
                console.error(
                    "Failed to fetch doctor dashboard data",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [token]);

    const updateStatus = async (appointmentId, status) => {
        try {
            await api.patch(
                `/appointments/${appointmentId}/status`,
                { status },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setAppointments((currentAppointments) =>
                currentAppointments.map((appointment) =>
                    appointment._id === appointmentId
                        ? { ...appointment, status }
                        : appointment
                )
            );
        } catch (error) {
            console.error("Failed to update appointment status", error);
            alert(
                error.response?.data?.message ||
                "Failed to update appointment status"
            );
        }
    };

    const saveNotes = async (appointmentId, appointmentNotes) => {
        if (!appointmentNotes.trim()) {
            alert("Please enter consultation notes.");
            return;
        }

        try {
            setSavingNotes(appointmentId);

            const response = await api.patch(
                `/appointments/${appointmentId}/notes`,
                { notes: appointmentNotes },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setAppointments((currentAppointments) =>
                currentAppointments.map((appointment) =>
                    appointment._id === appointmentId
                        ? response.data.appointment
                        : appointment
                )
            );

            alert("Consultation notes saved successfully.");
        } catch (error) {
            console.error("Failed to save consultation notes", error);

            alert(
                error.response?.data?.message ||
                "Failed to save consultation notes"
            );
        } finally {
            setSavingNotes(null);
        }
    };

    const fetchPreConsultationSummary = async (appointment) => {
        if (!["confirmed", "completed"].includes(appointment.status)) {
            return;
        }

        setActiveId(appointment._id);
        setPreConsultationAppointmentId(appointment._id);
        setPreConsultation(null);
        setPreConsultationError("");
        setPreConsultationLoading(true);

        try {
            const response = await api.get(
                `/appointments/${appointment._id}/pre-consultation`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setPreConsultation(response.data.data);
        } catch (error) {
            console.error(
                "Failed to fetch pre-consultation summary",
                error
            );

            setPreConsultationError(
                error.response?.data?.message ||
                "Unable to load the pre-consultation summary."
            );
        } finally {
            setPreConsultationLoading(false);
        }
    };

    const counts = useMemo(() => {
        const result = {
            all: appointments.length,
            pending: 0,
            confirmed: 0,
            completed: 0,
            cancelled: 0,
        };

        appointments.forEach((appointment) => {
            if (result[appointment.status] !== undefined) {
                result[appointment.status] += 1;
            }
        });

        return result;
    }, [appointments]);

    const filteredAppointments = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();

        return appointments.filter((appointment) => {
            const matchesStatus =
                statusFilter === "all" ||
                appointment.status === statusFilter;

            const matchesSearch =
                !term ||
                (appointment.patient?.name || "")
                    .toLowerCase()
                    .includes(term) ||
                (appointment.patient?.email || "")
                    .toLowerCase()
                    .includes(term) ||
                String(appointment._id || "")
                    .toLowerCase()
                    .includes(term);

            return matchesStatus && matchesSearch;
        });
    }, [appointments, statusFilter, searchTerm]);

    const activeAppointment =
        appointments.find((appointment) => appointment._id === activeId) ||
        appointments[0] ||
        null;

    const activeNotesValue = activeAppointment
        ? notes[activeAppointment._id] ??
        activeAppointment.notes ??
        ""
        : "";

    const completionPercent = appointments.length
        ? Math.round(
            (counts.completed / appointments.length) * 100
        )
        : 0;

    const hour = new Date().getHours();

    const greeting =
        hour < 12
            ? "Good morning"
            : hour < 18
                ? "Good afternoon"
                : "Good evening";

    const todayLabel = new Date().toLocaleDateString(undefined, {
        weekday: "long",
        month: "short",
        day: "numeric",
        year: "numeric",
    });

    const filters = [
        { key: "all", label: "All" },
        { key: "pending", label: "Pending" },
        { key: "confirmed", label: "Confirmed" },
        { key: "completed", label: "Completed" },
        { key: "cancelled", label: "Cancelled" },
    ];

    const cardBase =
        "bg-white border border-[#CBDAD6] rounded-2xl shadow-[0_3px_14px_rgba(0,52,53,0.035)]";

    const availableRecordCount =
        (preConsultation?.reports?.length || 0) +
        (preConsultation?.screenings?.length || 0) +
        (preConsultation?.previousAppointments?.length || 0);

    return (
        <div
            className={`doctor-dashboard-page min-h-screen bg-[#F5F8F6] text-[#0a1f1c] antialiased ${body}`}
        >
            <style>{`
                .doctor-dashboard-page {
                    --medicare-teal: #003435;
                    --medicare-secondary: #256862;
                    --medicare-mint: #E7F4F1;
                }

                .doctor-dashboard-page button {
                    -webkit-tap-highlight-color: transparent;
                }

                .doctor-dashboard-page button:focus-visible,
                .doctor-dashboard-page input:focus-visible,
                .doctor-dashboard-page textarea:focus-visible {
                    outline: 2px solid #256862;
                    outline-offset: 2px;
                }

                .doctor-dashboard-page .dashboard-card {
                    transition: box-shadow 180ms ease, border-color 180ms ease,
                        transform 180ms ease;
                }

                .doctor-dashboard-page .dashboard-card:hover {
                    box-shadow: 0 8px 24px rgba(0, 52, 53, 0.07);
                }

                .doctor-dashboard-page .summary-section {
                    scroll-margin-top: 24px;
                }

                .doctor-dashboard-page .appointment-grid > div {
                    min-width: 0;
                }

                .doctor-dashboard-page .summary-content {
                    max-height: 760px;
                    overflow-y: auto;
                    scrollbar-width: thin;
                    scrollbar-color: #CBDAD6 transparent;
                }

                .doctor-dashboard-page .summary-content::-webkit-scrollbar {
                    width: 5px;
                }

                .doctor-dashboard-page .summary-content::-webkit-scrollbar-thumb {
                    background: #CBDAD6;
                    border-radius: 20px;
                }

                @media (max-width: 767px) {
                    .doctor-dashboard-page main > div {
                        padding: 20px 14px;
                        gap: 24px;
                    }

                    .doctor-dashboard-page .hero-content {
                        padding: 20px;
                    }

                    .doctor-dashboard-page h1 {
                        font-size: 28px;
                        line-height: 1.25;
                        overflow-wrap: anywhere;
                    }

                    .doctor-dashboard-page h3 {
                        font-size: 21px;
                        line-height: 1.3;
                    }

                    .doctor-dashboard-page .hero-actions {
                        width: 100%;
                    }

                    .doctor-dashboard-page .hero-actions button {
                        flex: 1;
                    }

                    .doctor-dashboard-page .appointment-toolbar {
                        align-items: stretch;
                    }

                    .doctor-dashboard-page .appointment-search {
                        width: 100%;
                        min-width: 0;
                    }

                    .doctor-dashboard-page .filter-list {
                        max-width: 100%;
                        overflow-x: auto;
                        scrollbar-width: thin;
                        -webkit-overflow-scrolling: touch;
                    }

                    .doctor-dashboard-page .filter-list button {
                        flex-shrink: 0;
                    }

                    .doctor-dashboard-page .appointment-grid {
                        gap: 18px;
                    }

                    .doctor-dashboard-page .dashboard-panel {
                        padding: 18px;
                    }

                    .doctor-dashboard-page textarea {
                        min-width: 0;
                        width: 100%;
                        font-size: 13px;
                    }

                    .doctor-dashboard-page .appointment-card-header {
                        gap: 12px;
                    }

                    .doctor-dashboard-page .appointment-card-header > div:first-child {
                        min-width: 0;
                        flex: 1;
                    }

                    .doctor-dashboard-page .appointment-card-header h4 {
                        overflow-wrap: anywhere;
                    }

                    .doctor-dashboard-page .summary-grid {
                        grid-template-columns: repeat(2, minmax(0, 1fr));
                    }

                    .doctor-dashboard-page .summary-content {
                        max-height: none;
                        overflow: visible;
                    }
                }

                @media (max-width: 420px) {
                    .doctor-dashboard-page main > div {
                        padding: 16px 11px;
                        gap: 20px;
                    }

                    .doctor-dashboard-page h1 {
                        font-size: 25px;
                    }

                    .doctor-dashboard-page h3 {
                        font-size: 19px;
                    }

                    .doctor-dashboard-page .summary-grid {
                        grid-template-columns: 1fr;
                    }

                    .doctor-dashboard-page .appointment-card-header {
                        flex-wrap: wrap;
                    }

                    .doctor-dashboard-page .appointment-card-actions {
                        align-items: flex-start;
                    }
                }
            `}</style>

            <DoctorNavbar />

            <main className="w-full">
                <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-8">

                    {/* Hero */}
                    <section className={`relative overflow-hidden ${cardBase}`}>
                        <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-[#ADEFE7]/30 blur-3xl pointer-events-none" />
                        <div className="absolute left-1/3 -bottom-24 w-72 h-72 rounded-full bg-[#B9ECEE]/30 blur-3xl pointer-events-none" />

                        <div className="hero-content relative p-6 lg:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                            <div className="flex flex-col gap-1 max-w-3xl">
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E7F4F1] text-[#164B4D] text-[12px] font-bold border border-[#ADEFE7] tracking-wide uppercase">
                                        <span className="w-2 h-2 rounded-full bg-[#256862] animate-pulse" />
                                        Doctor Portal Active
                                    </span>
                                </div>

                                <h1 className={`${heading} text-[32px] leading-[40px] lg:text-[44px] lg:leading-[52px] font-bold text-[#003435] tracking-tight`}>
                                    {greeting}, {doctorUser.name}
                                </h1>

                                <p className="text-[14px] leading-[22px] text-[#404848] mt-1">
                                    Here's your clinical overview and patient queue for today.
                                    {" "}{todayLabel} • {stats.todayAppointments} scheduled encounters.
                                </p>
                            </div>

                            <div className="hero-actions flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto shrink-0">
                                <button
                                    onClick={() => {
                                        window.location.href = "/doctor-schedule";
                                    }}
                                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#dcf3ee] hover:bg-[#d6ede8] text-[#003435] text-[13px] font-semibold transition-colors"
                                >
                                    <Icon name="calendar_today" className="text-[18px]" />
                                    My Schedule
                                </button>

                                <button
                                    onClick={() => {
                                        window.location.href = "/doctor-profile";
                                    }}
                                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#003435] hover:bg-[#164B4D] text-white text-[13px] font-semibold transition-colors shadow-sm"
                                >
                                    <Icon name="person" className="text-[18px]" />
                                    My Profile
                                </button>
                            </div>
                        </div>

                        <div className="px-6 lg:px-8 py-3 bg-[#E7F4F1]/60 border-t border-[#CBDAD6]/60 flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                                <Icon name="verified_user" className="text-[#256862] text-[17px]" />
                                <span className="text-[11px] text-[#404848] uppercase font-bold tracking-wider">
                                    Workspace Status:
                                </span>
                                <span className="text-[12px] text-[#003435] font-bold">
                                    Secure Clinical Workspace
                                </span>
                            </div>

                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => {
                                        window.location.href = "/doctor-schedule";
                                    }}
                                    className="text-[#256862] hover:text-[#003435] text-[11px] font-bold flex items-center gap-1 transition-colors"
                                >
                                    My Shift Schedule
                                    <Icon name="arrow_forward" className="text-[14px]" />
                                </button>

                                <span className="text-[#c0c8c8]">•</span>

                                <button
                                    onClick={() => {
                                        window.location.href = "/doctor-profile";
                                    }}
                                    className="text-[#256862] hover:text-[#003435] text-[11px] font-bold flex items-center gap-1 transition-colors"
                                >
                                    Clinical Credentials
                                    <Icon name="badge" className="text-[14px]" />
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* KPI Cards */}
                    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                        <div className={`dashboard-card p-5 lg:p-6 ${cardBase}`}>
                            <div className="flex items-start justify-between">
                                <div>
                                    <span className="text-[11px] uppercase tracking-wider text-[#647472] font-bold">
                                        Today's Appointments
                                    </span>
                                    <p className={`${heading} text-[36px] leading-[44px] font-bold text-[#003435] mt-1`}>
                                        {stats.todayAppointments}
                                    </p>
                                </div>
                                <div className="w-11 h-11 rounded-xl bg-[#E7F4F1] flex items-center justify-center text-[#003435]">
                                    <Icon name="calendar_today" className="text-[23px]" />
                                </div>
                            </div>

                            <div className="mt-5 pt-3 border-t border-[#E7F0ED] flex items-center justify-between gap-2">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FFF0E8] text-[#9A431A] text-[11px] font-bold">
                                    <Icon name="schedule" className="text-[14px]" />
                                    {counts.pending} Pending
                                </span>
                                <span className="text-[12px] text-[#647472] font-medium">
                                    {counts.confirmed} Confirmed
                                </span>
                            </div>
                        </div>

                        <div className={`dashboard-card p-5 lg:p-6 ${cardBase}`}>
                            <div className="flex items-start justify-between">
                                <div>
                                    <span className="text-[11px] uppercase tracking-wider text-[#647472] font-bold">
                                        Upcoming Appointments
                                    </span>
                                    <p className={`${heading} text-[36px] leading-[44px] font-bold text-[#003435] mt-1`}>
                                        {stats.upcomingAppointments}
                                    </p>
                                </div>
                                <div className="w-11 h-11 rounded-xl bg-[#E7F4F1] flex items-center justify-center text-[#256862]">
                                    <Icon name="event_upcoming" className="text-[23px]" />
                                </div>
                            </div>

                            <div className="mt-5 pt-3 border-t border-[#E7F0ED]">
                                <span className="text-[11px] text-[#256862] font-bold">
                                    Upcoming Encounters
                                </span>
                            </div>
                        </div>

                        <div className={`dashboard-card p-5 lg:p-6 ${cardBase}`}>
                            <div className="flex items-start justify-between">
                                <div>
                                    <span className="text-[11px] uppercase tracking-wider text-[#647472] font-bold">
                                        Completed Appointments
                                    </span>
                                    <p className={`${heading} text-[36px] leading-[44px] font-bold text-[#003435] mt-1`}>
                                        {stats.completedAppointments}
                                    </p>
                                </div>
                                <div className="w-11 h-11 rounded-xl bg-[#E7F4F1] flex items-center justify-center text-[#003435]">
                                    <Icon name="check_circle" className="text-[23px]" />
                                </div>
                            </div>

                            <div className="mt-5 pt-3 border-t border-[#E7F0ED] flex items-center gap-3">
                                <div className="flex-1 bg-[#E7F4F1] rounded-full h-2 overflow-hidden">
                                    <div
                                        className="bg-[#256862] h-2 rounded-full transition-all"
                                        style={{ width: `${completionPercent}%` }}
                                    />
                                </div>
                                <span className="text-[12px] font-bold text-[#256862]">
                                    {completionPercent}%
                                </span>
                            </div>
                        </div>

                        <div className={`dashboard-card p-5 lg:p-6 ${cardBase}`}>
                            <div className="flex items-start justify-between">
                                <div>
                                    <span className="text-[11px] uppercase tracking-wider text-[#647472] font-bold">
                                        Total Patients
                                    </span>
                                    <p className={`${heading} text-[36px] leading-[44px] font-bold text-[#003435] mt-1`}>
                                        {stats.totalPatients}
                                    </p>
                                </div>
                                <div className="w-11 h-11 rounded-xl bg-[#E7F4F1] flex items-center justify-center text-[#003435]">
                                    <Icon name="folder_shared" className="text-[23px]" />
                                </div>
                            </div>

                            <div className="mt-5 pt-3 border-t border-[#E7F0ED]">
                                <span className="text-[11px] text-[#256862] font-bold">
                                    Active Patient Panel
                                </span>
                            </div>
                        </div>
                    </section>

                    {/* AI Risk Assessment */}
                    <section className="flex flex-col gap-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                                <div className="flex items-center gap-2">
                                    <Icon name="psychology" className="text-[#256862] text-[24px]" />
                                    <h3 className={`${heading} text-[24px] leading-[32px] font-semibold text-[#003435]`}>
                                        AI Risk Assessment
                                    </h3>
                                </div>
                                <p className="text-[12px] text-[#647472] mt-1">
                                    Access the available health risk assessment tools.
                                </p>
                            </div>

                            <button
                                onClick={() => {
                                    window.location.href = "/ai-risk-assessment";
                                }}
                                className="inline-flex items-center gap-1.5 text-[#256862] hover:text-[#003435] text-[13px] font-bold transition-colors"
                            >
                                Explore AI Suite
                                <Icon name="arrow_forward" className="text-[18px]" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className={`dashboard-card relative p-5 lg:p-6 ${cardBase} overflow-hidden flex flex-col justify-between`}>
                                <div className="h-1 absolute top-0 left-0 right-0 bg-gradient-to-r from-[#003435] to-[#ADEFE7]" />

                                <div>
                                    <div className="flex items-center gap-3 mb-3 mt-1">
                                        <div className="w-11 h-11 rounded-xl bg-[#E7F4F1] flex items-center justify-center text-[#003435]">
                                            <Icon name="vital_signs" className="text-[25px]" />
                                        </div>
                                        <div>
                                            <h4 className={`${heading} text-[18px] font-semibold text-[#003435]`}>
                                                Diabetes Risk Assessment
                                            </h4>
                                            <span className="text-[11px] text-[#647472]">
                                                Glucose, HbA1c and BMI biomarkers
                                            </span>
                                        </div>
                                    </div>

                                    <p className="text-[13px] leading-5 text-[#647472] mb-5">
                                        Assess diabetes-related risk factors using the available AI prediction model.
                                    </p>
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        onClick={() => {
                                            window.location.href = "/diabetes-prediction";
                                        }}
                                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#003435] hover:bg-[#164B4D] text-white text-[12px] font-semibold transition-colors"
                                    >
                                        Check Diabetes Risk
                                        <Icon name="arrow_forward" className="text-[16px]" />
                                    </button>
                                </div>
                            </div>

                            <div className={`dashboard-card relative p-5 lg:p-6 ${cardBase} overflow-hidden flex flex-col justify-between`}>
                                <div className="h-1 absolute top-0 left-0 right-0 bg-gradient-to-r from-[#256862] to-[#B9ECEE]" />

                                <div>
                                    <div className="flex items-center gap-3 mb-3 mt-1">
                                        <div className="w-11 h-11 rounded-xl bg-[#E7F4F1] flex items-center justify-center text-[#256862]">
                                            <Icon name="nephrology" className="text-[25px]" />
                                        </div>
                                        <div>
                                            <h4 className={`${heading} text-[18px] font-semibold text-[#003435]`}>
                                                Kidney Disease Risk Assessment
                                            </h4>
                                            <span className="text-[11px] text-[#647472]">
                                                Kidney health-related parameters
                                            </span>
                                        </div>
                                    </div>

                                    <p className="text-[13px] leading-5 text-[#647472] mb-5">
                                        Review kidney disease risk factors using the available AI prediction model.
                                    </p>
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        onClick={() => {
                                            window.location.href = "/kidney-disease-risk";
                                        }}
                                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#003435] hover:bg-[#164B4D] text-white text-[12px] font-semibold transition-colors"
                                    >
                                        Check Kidney Risk
                                        <Icon name="arrow_forward" className="text-[16px]" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Appointments */}
                    <section className="flex flex-col gap-4">
                        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h3 className={`${heading} text-[24px] leading-[32px] font-semibold text-[#003435]`}>
                                        My Appointments
                                    </h3>
                                    <span className="px-2.5 py-1 rounded-full bg-[#E7F4F1] text-[11px] text-[#256862] font-bold">
                                        {appointments.length} Scheduled
                                    </span>
                                </div>

                                <p className="text-[12px] text-[#647472] mt-1">
                                    Manage your patient queue, review history and maintain consultation notes.
                                </p>
                            </div>

                            <div className="appointment-toolbar flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                                <div className="appointment-search relative flex items-center min-w-[260px]">
                                    <Icon name="search" className="absolute left-3 text-[#647472] text-[18px]" />
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Search patients..."
                                        className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#CBDAD6] rounded-xl text-[12px] text-[#0a1f1c] placeholder:text-[#899693] focus:outline-none focus:border-[#256862]"
                                    />
                                </div>

                                <div className="filter-list flex items-center gap-1 p-1 bg-[#E7F4F1] rounded-xl">
                                    {filters.map((filter) => (
                                        <button
                                            key={filter.key}
                                            onClick={() => setStatusFilter(filter.key)}
                                            className={`px-3 py-2 rounded-lg text-[11px] font-bold whitespace-nowrap transition-colors ${
                                                statusFilter === filter.key
                                                    ? "bg-white text-[#003435] shadow-sm"
                                                    : "text-[#647472] hover:text-[#003435]"
                                            }`}
                                        >
                                            {filter.label} ({counts[filter.key]})
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Appointment list and clinical workspace */}
                        <div className="appointment-grid grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

                            {/* Left: Appointment List */}
                            <div className="lg:col-span-7 flex flex-col gap-3">
                                {loading ? (
                                    <div className={`${cardBase} p-8 text-center`}>
                                        <Icon name="progress_activity" className="text-[28px] text-[#256862] animate-spin" />
                                        <p className="text-[13px] text-[#647472] mt-2">
                                            Loading appointments...
                                        </p>
                                    </div>
                                ) : appointments.length === 0 ? (
                                    <div className={`${cardBase} p-8 text-center`}>
                                        <div className="w-12 h-12 mx-auto rounded-xl bg-[#E7F4F1] flex items-center justify-center text-[#256862]">
                                            <Icon name="calendar_month" className="text-[25px]" />
                                        </div>
                                        <p className="text-[14px] font-semibold text-[#003435] mt-3">
                                            No appointments yet
                                        </p>
                                        <p className="text-[12px] text-[#647472] mt-1">
                                            Your scheduled appointments will appear here.
                                        </p>
                                    </div>
                                ) : filteredAppointments.length === 0 ? (
                                    <div className={`${cardBase} p-7 text-center`}>
                                        <Icon name="search_off" className="text-[28px] text-[#647472]" />
                                        <p className="text-[13px] text-[#647472] mt-2">
                                            No appointments match your search or filter.
                                        </p>
                                    </div>
                                ) : (
                                    filteredAppointments.map((appointment) => {
                                        const isActive =
                                            activeAppointment?._id === appointment._id;

                                        const dateObj = new Date(appointment.date);

                                        return (
                                            <div
                                                key={appointment._id}
                                                className={`dashboard-card relative p-4 lg:p-5 rounded-2xl bg-white overflow-hidden ${
                                                    isActive
                                                        ? "border-2 border-[#256862]/50 shadow-[0_4px_18px_rgba(37,104,98,0.08)]"
                                                        : "border border-[#CBDAD6]"
                                                }`}
                                            >
                                                {isActive && (
                                                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#256862]" />
                                                )}

                                                <div className="flex flex-col gap-4 pl-1">
                                                    <div className="appointment-card-header flex items-start justify-between gap-3">
                                                        <div className="flex items-center gap-3 min-w-0">
                                                            <div className="w-11 h-11 rounded-xl bg-[#E7F4F1] flex items-center justify-center text-[15px] text-[#003435] font-bold shrink-0">
                                                                <span className={heading}>
                                                                    {getInitials(appointment.patient?.name)}
                                                                </span>
                                                            </div>

                                                            <div className="min-w-0">
                                                                <h4 className={`${heading} text-[17px] leading-6 font-semibold text-[#003435] truncate`}>
                                                                    {appointment.patient?.name || "Patient"}
                                                                </h4>
                                                                <p className="text-[11px] text-[#647472] truncate">
                                                                    {appointment.patient?.email}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-col items-end gap-1 shrink-0">
                                                            <span
                                                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold capitalize ${
                                                                    statusStyles[appointment.status] ||
                                                                    "bg-[#E7F4F1] text-[#256862]"
                                                                }`}
                                                            >
                                                                <span
                                                                    className={`w-1.5 h-1.5 rounded-full ${
                                                                        statusDot[appointment.status] ||
                                                                        "bg-[#256862]"
                                                                    }`}
                                                                />
                                                                {appointment.status}
                                                            </span>

                                                            <span className={`${heading} text-[15px] font-semibold text-[#003435]`}>
                                                                {dateObj.toLocaleTimeString([], {
                                                                    hour: "2-digit",
                                                                    minute: "2-digit",
                                                                })}
                                                            </span>

                                                            <span className="text-[10px] text-[#647472]">
                                                                {dateObj.toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {appointment.reason && (
                                                        <div className="px-3 py-2.5 rounded-xl bg-[#F2F8F6] border border-[#E4EFEB]">
                                                            <span className="text-[10px] text-[#647472] uppercase font-bold tracking-wider">
                                                                Consultation Reason
                                                            </span>
                                                            <p className="text-[13px] text-[#003435] font-medium mt-1">
                                                                {appointment.reason}
                                                            </p>
                                                        </div>
                                                    )}

                                                    <div className="appointment-card-actions flex items-center justify-between flex-wrap gap-3 pt-3 border-t border-[#EAF1EE]">
                                                        <div className="flex items-center flex-wrap gap-x-4 gap-y-2">
                                                            <button
                                                                onClick={() =>
                                                                    setSelectedPatient(appointment.patient)
                                                                }
                                                                className="inline-flex items-center gap-1.5 text-[#256862] hover:text-[#003435] text-[11px] font-bold transition-colors"
                                                            >
                                                                <Icon name="visibility" className="text-[16px]" />
                                                                View Patient
                                                            </button>

                                                            <button
                                                                onClick={() =>
                                                                    setActiveId(appointment._id)
                                                                }
                                                                className="inline-flex items-center gap-1.5 text-[#256862] hover:text-[#003435] text-[11px] font-bold transition-colors"
                                                            >
                                                                <Icon name="edit_note" className="text-[16px]" />
                                                                Open Notes
                                                            </button>

                                                            {["confirmed", "completed"].includes(appointment.status) && (
                                                                <button
                                                                    onClick={() =>
                                                                        fetchPreConsultationSummary(appointment)
                                                                    }
                                                                    className="inline-flex items-center gap-1.5 text-[#256862] hover:text-[#003435] text-[11px] font-bold transition-colors"
                                                                >
                                                                    <Icon name="clinical_notes" className="text-[16px]" />
                                                                    Pre-Consultation
                                                                </button>
                                                            )}
                                                        </div>

                                                        <div className="flex flex-wrap items-center gap-1.5">
                                                            {(appointment.status === "pending" ||
                                                                appointment.status === "confirmed") && (
                                                                <button
                                                                    onClick={() =>
                                                                        updateStatus(
                                                                            appointment._id,
                                                                            "cancelled"
                                                                        )
                                                                    }
                                                                    className="px-3 py-2 rounded-lg bg-[#FFE8E6] hover:bg-[#ffdad6] text-[#A83232] text-[10px] font-bold transition-colors"
                                                                >
                                                                    Cancel
                                                                </button>
                                                            )}

                                                            {appointment.status === "pending" && (
                                                                <button
                                                                    onClick={() =>
                                                                        updateStatus(
                                                                            appointment._id,
                                                                            "confirmed"
                                                                        )
                                                                    }
                                                                    className="px-3 py-2 rounded-lg bg-[#256862] hover:bg-[#164B4D] text-white text-[10px] font-bold transition-colors"
                                                                >
                                                                    Confirm
                                                                </button>
                                                            )}

                                                            {appointment.status === "confirmed" && (
                                                                <button
                                                                    onClick={() =>
                                                                        updateStatus(
                                                                            appointment._id,
                                                                            "completed"
                                                                        )
                                                                    }
                                                                    className="px-3 py-2 rounded-lg bg-[#003435] hover:bg-[#164B4D] text-white text-[10px] font-bold transition-colors"
                                                                >
                                                                    Complete
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            {/* Right: Pre-Consultation and Clinical Notes */}
                            <div className="lg:col-span-5 flex flex-col gap-4">

                                {/* Pre-Consultation Summary */}
                                <div className={`summary-section ${cardBase} overflow-hidden`}>
                                    <div className="px-5 py-5 border-b border-[#E5EFEB]">
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-[#E7F4F1] text-[#164B4D] flex items-center justify-center shrink-0">
                                                <Icon name="clinical_notes" className="text-[23px]" />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <h4 className={`${heading} text-[19px] leading-6 font-semibold text-[#003435]`}>
                                                    Pre-Consultation Summary
                                                </h4>
                                                <p className="text-[11px] leading-5 text-[#647472] mt-1">
                                                    Patient history and previous clinical records.
                                                </p>
                                            </div>
                                        </div>

                                        {activeAppointment &&
                                            ["confirmed", "completed"].includes(activeAppointment.status) && (
                                                <button
                                                    onClick={() =>
                                                        fetchPreConsultationSummary(activeAppointment)
                                                    }
                                                    disabled={preConsultationLoading}
                                                    className="w-full mt-4 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#003435] hover:bg-[#164B4D] text-white text-[12px] font-semibold disabled:opacity-50 transition-colors"
                                                >
                                                    <Icon
                                                        name={preConsultationLoading ? "refresh" : "sync"}
                                                        className={`text-[17px] ${
                                                            preConsultationLoading
                                                                ? "animate-spin"
                                                                : ""
                                                        }`}
                                                    />
                                                    {preConsultationLoading
                                                        ? "Loading Summary..."
                                                        : preConsultationAppointmentId === activeAppointment._id &&
                                                            preConsultation
                                                            ? "Refresh Summary"
                                                            : "Load Patient History"}
                                                </button>
                                            )}
                                    </div>

                                    <div className="summary-content p-5 flex flex-col gap-5">
                                        {!activeAppointment ? (
                                            <div className="p-5 rounded-xl bg-[#F2F8F6] text-center">
                                                <Icon name="clinical_notes" className="text-[28px] text-[#8BA7A0]" />
                                                <p className="text-[12px] text-[#647472] mt-2">
                                                    Select an appointment to view its pre-consultation summary.
                                                </p>
                                            </div>
                                        ) : !["confirmed", "completed"].includes(activeAppointment.status) ? (
                                            <div className="p-4 rounded-xl bg-[#F2F8F6] text-[#647472] text-[12px] leading-5">
                                                Pre-consultation summaries are available only for confirmed or completed appointments.
                                            </div>
                                        ) : preConsultationAppointmentId !== activeAppointment._id ? (
                                            <div className="p-5 rounded-xl bg-[#F2F8F6] text-center">
                                                <div className="w-11 h-11 mx-auto rounded-xl bg-[#E7F4F1] flex items-center justify-center text-[#256862]">
                                                    <Icon name="folder_open" className="text-[24px]" />
                                                </div>
                                                <p className="text-[12px] text-[#003435] font-semibold mt-3">
                                                    Patient history is ready
                                                </p>
                                                <p className="text-[11px] leading-5 text-[#647472] mt-1">
                                                    Load the summary to review available reports, AI screening results and previous consultations.
                                                </p>
                                            </div>
                                        ) : preConsultationLoading ? (
                                            <div className="py-8 text-center">
                                                <Icon name="progress_activity" className="text-[28px] text-[#256862] animate-spin" />
                                                <p className="text-[12px] text-[#647472] mt-2">
                                                    Retrieving patient history...
                                                </p>
                                            </div>
                                        ) : preConsultationError ? (
                                            <div className="p-4 rounded-xl bg-[#FFE8E6] border border-[#F4C7C2] text-[#A83232] text-[12px] leading-5">
                                                <div className="flex items-center gap-2 font-bold mb-1">
                                                    <Icon name="error" className="text-[17px]" />
                                                    Unable to load summary
                                                </div>
                                                {preConsultationError}
                                            </div>
                                        ) : preConsultation ? (
                                            <>
                                                {/* Patient Overview */}
                                                <div>
                                                    <p className="text-[10px] uppercase tracking-wider text-[#647472] font-bold">
                                                        Patient Overview
                                                    </p>

                                                    <h5 className={`${heading} text-[21px] font-semibold text-[#003435] mt-1`}>
                                                        {preConsultation.patient?.name || "Patient"}
                                                    </h5>

                                                    <p className="text-[11px] text-[#647472] mt-0.5 break-all">
                                                        {preConsultation.patient?.email || "Patient email unavailable"}
                                                    </p>

                                                    <span className={`inline-flex items-center gap-1.5 mt-3 px-2.5 py-1 rounded-lg text-[10px] font-bold capitalize ${
                                                        statusStyles[preConsultation.appointment?.status] || "bg-[#E7F4F1] text-[#256862]"
                                                    }`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${
                                                            statusDot[preConsultation.appointment?.status] || "bg-[#256862]"
                                                        }`} />
                                                        {preConsultation.appointment?.status}
                                                    </span>
                                                </div>

                                                {/* Summary Information */}
                                                <div className="summary-grid grid grid-cols-2 gap-2">
                                                    <div className="p-3 rounded-xl bg-[#F2F8F6] border border-[#E4EFEB]">
                                                        <div className="flex items-center gap-1.5 text-[#647472]">
                                                            <Icon name="calendar_today" className="text-[15px]" />
                                                            <p className="text-[9px] uppercase font-bold tracking-wide">
                                                                Appointment
                                                            </p>
                                                        </div>
                                                        <p className="mt-2 text-[12px] font-semibold text-[#003435]">
                                                            {new Date(
                                                                preConsultation.appointment.date
                                                            ).toLocaleDateString()}
                                                        </p>
                                                    </div>

                                                    <div className="p-3 rounded-xl bg-[#F2F8F6] border border-[#E4EFEB]">
                                                        <div className="flex items-center gap-1.5 text-[#647472]">
                                                            <Icon name="description" className="text-[15px]" />
                                                            <p className="text-[9px] uppercase font-bold tracking-wide">
                                                                Reports
                                                            </p>
                                                        </div>
                                                        <p className="mt-2 text-[19px] font-bold text-[#003435]">
                                                            {preConsultation.reports?.length || 0}
                                                        </p>
                                                    </div>

                                                    <div className="p-3 rounded-xl bg-[#F2F8F6] border border-[#E4EFEB]">
                                                        <div className="flex items-center gap-1.5 text-[#647472]">
                                                            <Icon name="monitor_heart" className="text-[15px]" />
                                                            <p className="text-[9px] uppercase font-bold tracking-wide">
                                                                AI Screenings
                                                            </p>
                                                        </div>
                                                        <p className="mt-2 text-[19px] font-bold text-[#003435]">
                                                            {preConsultation.screenings?.length || 0}
                                                        </p>
                                                    </div>

                                                    <div className="p-3 rounded-xl bg-[#F2F8F6] border border-[#E4EFEB]">
                                                        <div className="flex items-center gap-1.5 text-[#647472]">
                                                            <Icon name="history" className="text-[15px]" />
                                                            <p className="text-[9px] uppercase font-bold tracking-wide">
                                                                Consultations
                                                            </p>
                                                        </div>
                                                        <p className="mt-2 text-[19px] font-bold text-[#003435]">
                                                            {preConsultation.previousAppointments?.length || 0}
                                                        </p>
                                                    </div>
                                                </div>

                                                {preConsultation.appointment.reason && (
                                                    <div className="p-3 rounded-xl bg-[#F2F8F6] border border-[#E4EFEB]">
                                                        <p className="text-[9px] uppercase font-bold tracking-wide text-[#647472] mb-1">
                                                            Consultation Reason
                                                        </p>
                                                        <p className="text-[12px] leading-5 text-[#003435] font-medium">
                                                            {preConsultation.appointment.reason}
                                                        </p>
                                                    </div>
                                                )}

                                                <div className="h-px bg-[#E5EFEB]" />

                                                {/* Previous Report Analyses */}
                                                <div className="flex flex-col gap-3">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <div className="flex items-center gap-2 min-w-0">
                                                            <Icon name="description" className="text-[#256862] text-[19px]" />
                                                            <h5 className={`${heading} text-[15px] font-semibold text-[#003435]`}>
                                                                Report Analyses
                                                            </h5>
                                                        </div>
                                                        <span className="text-[10px] text-[#647472] shrink-0">
                                                            {preConsultation.reports?.length || 0}
                                                        </span>
                                                    </div>

                                                    {preConsultation.reports?.length ? (
                                                        <div className="flex flex-col gap-3">
                                                            {preConsultation.reports.map((report) => (
                                                                <div
                                                                    key={report._id}
                                                                    className="p-3 rounded-xl border border-[#CBDAD6] bg-white flex flex-col gap-3"
                                                                >
                                                                    <div className="flex flex-col gap-1">
                                                                        <p className="font-semibold text-[12px] text-[#003435] break-words">
                                                                            {report.originalFilename || "Uploaded report"}
                                                                        </p>
                                                                        <span className="text-[10px] text-[#647472]">
                                                                            {new Date(report.createdAt).toLocaleDateString()}
                                                                        </span>
                                                                    </div>

                                                                    {report.summary && (
                                                                        <p className="text-[11px] leading-5 text-[#647472]">
                                                                            {report.summary}
                                                                        </p>
                                                                    )}

                                                                    {[
                                                                        { label: "Key Findings", values: report.keyFindings },
                                                                        { label: "Abnormal Values", values: report.abnormalValues },
                                                                        { label: "Normal Values", values: report.normalValues },
                                                                        { label: "Questions to Discuss", values: report.questionsToDiscuss },
                                                                    ].map((group) =>
                                                                        group.values?.length ? (
                                                                            <div key={group.label}>
                                                                                <p className="text-[9px] font-bold uppercase tracking-wide text-[#256862] mb-1">
                                                                                    {group.label}
                                                                                </p>
                                                                                <ul className="list-disc pl-4 text-[11px] leading-5 text-[#647472]">
                                                                                    {group.values.map((value, index) => (
                                                                                        <li key={index}>{value}</li>
                                                                                    ))}
                                                                                </ul>
                                                                            </div>
                                                                        ) : null
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div className="p-3 rounded-xl bg-[#F2F8F6] border border-[#E4EFEB] flex items-start gap-2">
                                                            <Icon name="info" className="text-[#256862] text-[17px] mt-0.5" />
                                                            <div>
                                                                <p className="text-[11px] font-semibold text-[#003435]">
                                                                    No report analyses available
                                                                </p>
                                                                <p className="text-[10px] leading-5 text-[#647472] mt-1">
                                                                    No report analyses were found within the available appointment history.
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="h-px bg-[#E5EFEB]" />

                                                {/* Previous AI Screenings */}
                                                <div className="flex flex-col gap-3">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <div className="flex items-center gap-2 min-w-0">
                                                            <Icon name="monitor_heart" className="text-[#256862] text-[19px]" />
                                                            <h5 className={`${heading} text-[15px] font-semibold text-[#003435]`}>
                                                                AI Screening Results
                                                            </h5>
                                                        </div>
                                                        <span className="text-[10px] text-[#647472] shrink-0">
                                                            {preConsultation.screenings?.length || 0}
                                                        </span>
                                                    </div>

                                                    {preConsultation.screenings?.length ? (
                                                        <div className="flex flex-col gap-3">
                                                            {preConsultation.screenings.map((screening) => (
                                                                <div
                                                                    key={screening._id}
                                                                    className="p-3 rounded-xl border border-[#CBDAD6] bg-white"
                                                                >
                                                                    <div className="flex items-center justify-between gap-2">
                                                                        <p className="font-semibold text-[12px] text-[#003435] capitalize">
                                                                            {screening.disease || "Screening type unavailable"}
                                                                        </p>
                                                                        <span className="text-[10px] text-[#647472] shrink-0">
                                                                            {new Date(screening.createdAt).toLocaleDateString()}
                                                                        </span>
                                                                    </div>

                                                                    <p className="mt-2 text-[11px] text-[#647472]">
                                                                        Screening result:
                                                                        {" "}
                                                                        <strong className="text-[#003435]">
                                                                            {screening.prediction ?? "Not available"}
                                                                        </strong>
                                                                    </p>

                                                                    {screening.probability !== undefined && (
                                                                        <p className="mt-1 text-[11px] text-[#647472]">
                                                                            Recorded probability:
                                                                            {" "}
                                                                            <strong className="text-[#003435]">
                                                                                {screening.probability}
                                                                            </strong>
                                                                        </p>
                                                                    )}

                                                                    <p className="mt-2 text-[10px] text-[#256862]">
                                                                        Screening information only — not a diagnosis.
                                                                    </p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div className="p-3 rounded-xl bg-[#F2F8F6] border border-[#E4EFEB] flex items-start gap-2">
                                                            <Icon name="info" className="text-[#256862] text-[17px] mt-0.5" />
                                                            <div>
                                                                <p className="text-[11px] font-semibold text-[#003435]">
                                                                    No previous AI screening records
                                                                </p>
                                                                <p className="text-[10px] leading-5 text-[#647472] mt-1">
                                                                    No saved AI screening results were found within the available history.
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="h-px bg-[#E5EFEB]" />

                                                {/* Previous Consultations */}
                                                <div className="flex flex-col gap-3">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <div className="flex items-center gap-2 min-w-0">
                                                            <Icon name="history" className="text-[#256862] text-[19px]" />
                                                            <h5 className={`${heading} text-[15px] font-semibold text-[#003435]`}>
                                                                Previous Consultations
                                                            </h5>
                                                        </div>
                                                        <span className="text-[10px] text-[#647472] shrink-0">
                                                            {preConsultation.previousAppointments?.length || 0}
                                                        </span>
                                                    </div>

                                                    {preConsultation.previousAppointments?.length ? (
                                                        <div className="flex flex-col gap-3">
                                                            {preConsultation.previousAppointments.map((previous) => (
                                                                <div
                                                                    key={previous._id}
                                                                    className="p-3 rounded-xl border border-[#CBDAD6] bg-white"
                                                                >
                                                                    <div className="flex flex-col gap-1">
                                                                        <p className="font-semibold text-[12px] text-[#003435]">
                                                                            {previous.reason || "General consultation"}
                                                                        </p>
                                                                        <span className="text-[10px] text-[#647472]">
                                                                            {new Date(previous.date).toLocaleDateString()}
                                                                        </span>
                                                                    </div>

                                                                    {previous.notes && (
                                                                        <p className="mt-2 text-[11px] leading-5 text-[#647472] whitespace-pre-wrap">
                                                                            {previous.notes}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div className="p-3 rounded-xl bg-[#F2F8F6] border border-[#E4EFEB] flex items-start gap-2">
                                                            <Icon name="info" className="text-[#256862] text-[17px] mt-0.5" />
                                                            <div>
                                                                <p className="text-[11px] font-semibold text-[#003435]">
                                                                    No earlier consultations found
                                                                </p>
                                                                <p className="text-[10px] leading-5 text-[#647472] mt-1">
                                                                    No earlier completed consultations with this doctor were found.
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="pt-3 border-t border-[#E5EFEB]">
                                                    <div className="flex items-start gap-2">
                                                        <Icon name="verified_user" className="text-[#256862] text-[16px] mt-0.5 shrink-0" />
                                                        <p className="text-[10px] leading-5 text-[#647472]">
                                                            This summary includes records available up to the appointment date.
                                                            AI screening results are informational and should be interpreted
                                                            alongside clinical assessment.
                                                        </p>
                                                    </div>

                                                    <p className="text-[10px] text-[#256862] font-bold mt-3">
                                                        {availableRecordCount} total records available
                                                    </p>
                                                </div>
                                            </>
                                        ) : null}
                                    </div>
                                </div>

                                {/* Clinical Consultation Notes */}
                                <div className={`dashboard-panel ${cardBase} p-5 flex flex-col gap-4`}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-[#E7F4F1] text-[#164B4D] flex items-center justify-center shrink-0">
                                            <Icon name="edit_note" className="text-[23px]" />
                                        </div>

                                        <div className="min-w-0">
                                            <h4 className={`${heading} text-[19px] font-semibold text-[#003435]`}>
                                                Clinical Consultation Notes
                                            </h4>
                                            <p className="text-[11px] text-[#647472] mt-0.5">
                                                {activeAppointment
                                                    ? `Active patient: ${activeAppointment.patient?.name}`
                                                    : "No appointment selected"}
                                            </p>
                                        </div>
                                    </div>

                                    {activeAppointment ? (
                                        <>
                                            <div className="p-3 rounded-xl bg-[#F2F8F6] border border-[#E4EFEB]">
                                                <p className="text-[10px] uppercase tracking-wider text-[#647472] font-bold">
                                                    Current Appointment
                                                </p>
                                                <p className="text-[13px] font-semibold text-[#003435] mt-1">
                                                    {new Date(activeAppointment.date).toLocaleDateString()}
                                                </p>
                                                <span className={`inline-flex mt-2 px-2 py-1 rounded-md text-[10px] font-bold capitalize ${
                                                    statusStyles[activeAppointment.status] || ""
                                                }`}>
                                                    {activeAppointment.status}
                                                </span>
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center justify-between gap-2">
                                                    <label className="text-[10px] uppercase tracking-wider text-[#647472] font-bold">
                                                        Diagnostic Impressions &amp; Care Plan
                                                    </label>
                                                    <span className="text-[10px] text-[#647472] shrink-0">
                                                        {activeNotesValue.length} chars
                                                    </span>
                                                </div>

                                                <textarea
                                                    value={activeNotesValue}
                                                    onChange={(e) =>
                                                        setNotes((currentNotes) => ({
                                                            ...currentNotes,
                                                            [activeAppointment._id]: e.target.value,
                                                        }))
                                                    }
                                                    rows="9"
                                                    placeholder="Add consultation notes..."
                                                    className="w-full p-4 bg-[#F2F8F6] border border-[#CBDAD6] rounded-xl text-[13px] leading-[22px] text-[#0a1f1c] placeholder:text-[#899693] focus:outline-none focus:bg-white focus:border-[#256862] transition-colors resize-y"
                                                />
                                            </div>

                                            <div className="flex flex-wrap gap-2">
                                                {noteTemplates.map((template) => (
                                                    <button
                                                        key={template.label}
                                                        onClick={() =>
                                                            setNotes((currentNotes) => {
                                                                const current =
                                                                    currentNotes[activeAppointment._id] ??
                                                                    activeAppointment.notes ??
                                                                    "";

                                                                return {
                                                                    ...currentNotes,
                                                                    [activeAppointment._id]: current
                                                                        ? `${current}\n${template.text}`
                                                                        : template.text,
                                                                };
                                                            })
                                                        }
                                                        className="px-2.5 py-1.5 rounded-lg bg-[#E7F4F1] hover:bg-[#DDF1EB] text-[#164B4D] text-[10px] font-bold transition-colors border border-[#CBDAD6]"
                                                    >
                                                        {template.label}
                                                    </button>
                                                ))}
                                            </div>

                                            <div className="flex flex-col gap-3 pt-3 border-t border-[#EAF1EE]">
                                                <div className="flex items-center gap-1.5 text-[#256862] text-[10px] font-bold">
                                                    <Icon name="lock" className="text-[15px]" />
                                                    Secure Consultation Notes
                                                </div>

                                                <button
                                                    onClick={() =>
                                                        saveNotes(
                                                            activeAppointment._id,
                                                            notes[activeAppointment._id] ??
                                                            activeAppointment.notes ??
                                                            ""
                                                        )
                                                    }
                                                    disabled={savingNotes === activeAppointment._id}
                                                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#003435] hover:bg-[#164B4D] text-white text-[12px] font-semibold transition-colors disabled:opacity-50"
                                                >
                                                    <Icon
                                                        name={savingNotes === activeAppointment._id ? "refresh" : "save"}
                                                        className={`text-[17px] ${
                                                            savingNotes === activeAppointment._id
                                                                ? "animate-spin"
                                                                : ""
                                                        }`}
                                                    />

                                                    {savingNotes === activeAppointment._id
                                                        ? "Saving Notes..."
                                                        : "Save Consultation Notes"}
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="p-5 rounded-xl bg-[#F2F8F6] text-center">
                                            <Icon name="edit_note" className="text-[28px] text-[#8BA7A0]" />
                                            <p className="text-[12px] text-[#647472] mt-2">
                                                Select an appointment to add consultation notes.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            {/* Patient Details Modal */}
            {selectedPatient && (
                <div className="fixed inset-0 z-50 bg-[#003435]/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col border border-[#CBDAD6]">
                        <div className="p-5 lg:p-6 bg-[#E7F4F1] flex items-center justify-between border-b border-[#CBDAD6]">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-[#164B4D] text-white flex items-center justify-center text-[17px] font-bold ring-2 ring-[#ADEFE7]">
                                    <span className={heading}>
                                        {getInitials(selectedPatient.name)}
                                    </span>
                                </div>

                                <div>
                                    <h3 className={`${heading} text-[21px] font-semibold text-[#003435]`}>
                                        Patient Details
                                    </h3>
                                    <p className="text-[11px] text-[#647472]">
                                        Patient information
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => setSelectedPatient(null)}
                                className="p-2 rounded-lg text-[#647472] hover:text-[#003435] hover:bg-[#dcf3ee] transition-colors"
                            >
                                <Icon name="close" className="text-[20px]" />
                            </button>
                        </div>

                        <div className="p-6 flex flex-col gap-3">
                            <div className="p-4 rounded-xl bg-[#F2F8F6] border border-[#E4EFEB]">
                                <span className="text-[10px] text-[#647472] uppercase font-bold tracking-wider">
                                    Name
                                </span>
                                <p className="text-[14px] text-[#003435] font-semibold mt-1">
                                    {selectedPatient.name}
                                </p>
                            </div>

                            <div className="p-4 rounded-xl bg-[#F2F8F6] border border-[#E4EFEB]">
                                <span className="text-[10px] text-[#647472] uppercase font-bold tracking-wider">
                                    Email
                                </span>
                                <p className="text-[14px] text-[#003435] font-semibold mt-1 break-all">
                                    {selectedPatient.email}
                                </p>
                            </div>
                        </div>

                        <div className="p-4 bg-[#F2F8F6] flex items-center justify-end border-t border-[#CBDAD6]">
                            <button
                                onClick={() => setSelectedPatient(null)}
                                className="px-5 py-2.5 rounded-xl bg-[#003435] hover:bg-[#164B4D] text-white text-[12px] font-semibold transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorDashboard;