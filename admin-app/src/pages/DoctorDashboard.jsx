import { useEffect, useMemo, useState } from "react";
import api from "../api";

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
    pending: "bg-[#ffdbcd] text-[#7a3005]",
    confirmed: "bg-[#ADEFE7] text-[#00504a]",
    completed: "bg-[#dcf3ee] text-[#2c6e68]",
    cancelled: "bg-[#ffdad6] text-[#93000a]",
};

const statusDot = {
    pending: "bg-[#ff9665]",
    confirmed: "bg-[#256862]",
    completed: "bg-[#2c6e68]",
    cancelled: "bg-[#ba1a1a]",
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

    // UI-only state (design: filters, search, active notes subject)
    const [statusFilter, setStatusFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [activeId, setActiveId] = useState(null);

    const token = localStorage.getItem("adminToken");
    const doctorUser = JSON.parse(
        localStorage.getItem("adminUser") || "{}"
    );

    // Load the icon font used by the design (visual only)
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
                    appointmentsResponse.data.appointments
                );

                setStats(statsResponse.data.stats);
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
                {
                    notes: appointmentNotes,
                },
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
            console.error(
                "Failed to save consultation notes",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to save consultation notes"
            );
        } finally {
            setSavingNotes(null);
        }
    };

    // ---------- Derived values (display only) ----------
    const counts = useMemo(() => {
        const c = { all: appointments.length, pending: 0, confirmed: 0, completed: 0, cancelled: 0 };
        appointments.forEach((a) => {
            if (c[a.status] !== undefined) c[a.status] += 1;
        });
        return c;
    }, [appointments]);

    const filteredAppointments = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();
        return appointments.filter((a) => {
            const matchesStatus =
                statusFilter === "all" || a.status === statusFilter;
            const matchesSearch =
                !term ||
                (a.patient?.name || "").toLowerCase().includes(term) ||
                (a.patient?.email || "").toLowerCase().includes(term) ||
                String(a._id || "").toLowerCase().includes(term);
            return matchesStatus && matchesSearch;
        });
    }, [appointments, statusFilter, searchTerm]);

    const activeAppointment =
        appointments.find((a) => a._id === activeId) || appointments[0] || null;

    const activeNotesValue = activeAppointment
        ? notes[activeAppointment._id] ??
        activeAppointment.notes ??
        ""
        : "";

    const completionPercent = appointments.length
        ? Math.round((counts.completed / appointments.length) * 100)
        : 0;

    const hour = new Date().getHours();
    const greeting =
        hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
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
        "bg-white border border-[#CBDAD6] rounded-2xl shadow-sm";

    return (
        <div className={`min-h-screen bg-[#F5F8F6] text-[#0a1f1c] antialiased ${body}`}>
            {/* ================= TOP NAVBAR ================= */}
            <header className="sticky top-0 z-40 w-full bg-white border-b border-[#CBDAD6] shadow-[0_1px_8px_rgba(0,0,0,0.03)] backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-6">
                    {/* Logo */}
                    <div className="flex items-center gap-3 shrink-0">
                        <a className="flex items-center gap-2.5" href="/">
                            <div className="flex flex-col">
                                <span className={`${heading} text-[20px] font-bold text-[#003435] tracking-tight leading-none`}>
                                    Medicare
                                </span>
                                <span className="text-[10px] text-[#256862] font-semibold uppercase tracking-wider mt-0.5">
                                    Healthcare Intelligence
                                </span>
                            </div>
                        </a>
                    </div>

                    {/* Center nav */}
                    <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
                        <button
                            onClick={() => {
                                window.location.href = "/doctor-schedule";
                            }}
                            className="px-4 py-2 rounded-full text-[13px] font-semibold text-[#404848] hover:text-[#003435] hover:bg-[#E7F4F1] transition-colors"
                        >
                            My Schedule
                        </button>
                        <button
                            onClick={() => {
                                window.location.href = "/ai-risk-assessment";
                            }}
                            className="px-4 py-2 rounded-full text-[13px] font-semibold text-[#404848] hover:text-[#003435] hover:bg-[#E7F4F1] transition-colors inline-flex items-center gap-1.5"
                        >
                            <span>AI Risk Assessment</span>
                            <span className="px-1.5 rounded text-[10px] font-bold bg-[#ADEFE7] text-[#00201d]">
                                AI
                            </span>
                        </button>
                        <button
                            onClick={() => {
                                window.location.href = "/patients";
                            }}
                            className="px-4 py-2 rounded-full text-[13px] font-semibold text-[#404848] hover:text-[#003435] hover:bg-[#E7F4F1] transition-colors"
                        >
                            My Patients
                        </button>
                    </nav>

                    {/* Profile menu */}
                    <div className="flex items-center gap-3 lg:gap-4 shrink-0">
                        <div className="relative group">
                            <button className="flex items-center gap-2.5 p-1 rounded-full hover:bg-[#E7F4F1] transition-colors text-left">
                                <div className="relative">
                                    <div className="w-9 h-9 rounded-full bg-[#164B4D] text-white flex items-center justify-center text-[13px] font-bold ring-2 ring-[#ADEFE7]">
                                        {getInitials(doctorUser.name)}
                                    </div>
                                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#256862] ring-2 ring-white" />
                                </div>
                                <div className="hidden xl:flex flex-col">
                                    <span className="text-[13px] text-[#003435] font-bold leading-tight">
                                        {doctorUser.name}
                                    </span>
                                    <span className="text-[11px] text-[#404848] leading-none">
                                        Doctor
                                    </span>
                                </div>
                                <Icon name="expand_more" className="text-[#404848] text-[18px]" />
                            </button>

                            <div className="absolute right-0 pt-2 w-56 hidden group-hover:block z-50">
                                <div className="bg-white rounded-xl shadow-xl border border-[#CBDAD6] py-2">
                                    <div className="px-4 py-2 border-b border-[#CBDAD6]/50 xl:hidden">
                                        <p className="text-[13px] font-bold text-[#003435]">
                                            {doctorUser.name}
                                        </p>
                                        <p className="text-[11px] text-[#404848]">Doctor</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            window.location.href = "/doctor-profile";
                                        }}
                                        className="w-full flex items-center gap-2.5 px-4 py-2 text-[13px] font-semibold text-[#0a1f1c] hover:bg-[#e1f8f3] transition-colors text-left"
                                    >
                                        <Icon name="person" className="text-[18px] text-[#256862]" />
                                        <span>Doctor Profile &amp; Credentials</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            window.location.href = "/doctor-schedule";
                                        }}
                                        className="w-full flex items-center gap-2.5 px-4 py-2 text-[13px] font-semibold text-[#0a1f1c] hover:bg-[#e1f8f3] transition-colors text-left"
                                    >
                                        <Icon name="calendar_today" className="text-[18px] text-[#256862]" />
                                        <span>Duty Roster &amp; Shifts</span>
                                    </button>
                                    <div className="my-1 border-t border-[#CBDAD6]/50" />
                                    <button
                                        onClick={() => {
                                            localStorage.removeItem("adminToken");
                                            localStorage.removeItem("adminUser");
                                            window.location.href = "/";
                                        }}
                                        className="w-full flex items-center gap-2.5 px-4 py-2 text-[13px] font-semibold text-[#ba1a1a] hover:bg-[#ffdad6]/40 transition-colors text-left"
                                    >
                                        <Icon name="logout" className="text-[18px]" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* ================= MAIN ================= */}
            <main className="w-full">
                <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-8">
                    {/* ---------- Hero ---------- */}
                    <section className={`relative overflow-hidden ${cardBase}`}>
                        <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-[#ADEFE7]/30 blur-3xl pointer-events-none" />
                        <div className="absolute left-1/3 -bottom-24 w-72 h-72 rounded-full bg-[#B9ECEE]/30 blur-3xl pointer-events-none" />

                        <div className="relative p-6 lg:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
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
                                <p className="text-[14px] leading-[22px] text-[#404848]">
                                    Here's your clinical overview and patient queue for today.{" "}
                                    {todayLabel} • {stats.todayAppointments} scheduled encounters.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto shrink-0">
                                <button
                                    onClick={() => {
                                        window.location.href = "/doctor-schedule";
                                    }}
                                    className="inline-flex items-center justify-center gap-1 px-5 py-2.5 rounded-xl bg-[#dcf3ee] hover:bg-[#d6ede8] text-[#003435] text-[13px] font-semibold transition-colors shadow-sm"
                                >
                                    <Icon name="calendar_today" className="text-[18px]" />
                                    <span>My Schedule</span>
                                </button>
                                <button
                                    onClick={() => {
                                        window.location.href = "/doctor-profile";
                                    }}
                                    className="inline-flex items-center justify-center gap-1 px-5 py-2.5 rounded-xl bg-[#003435] hover:bg-[#164B4D] text-white text-[13px] font-semibold transition-colors shadow-sm"
                                >
                                    <Icon name="person" className="text-[18px]" />
                                    <span>My Profile</span>
                                </button>
                            </div>
                        </div>

                        <div className="px-6 lg:px-8 py-3 bg-[#E7F4F1]/60 border-t border-[#CBDAD6]/60 flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-[11px] text-[#404848] uppercase font-bold tracking-wider">
                                    Sync Buffer:
                                </span>
                                <span className="text-[12px] text-[#003435] font-bold">
                                    Encrypted Active Pipeline
                                </span>
                            </div>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => {
                                        window.location.href = "/doctor-schedule";
                                    }}
                                    className="text-[#256862] hover:text-[#003435] text-[11px] font-bold flex items-center gap-1 transition-colors"
                                >
                                    <span>My Shift Schedule</span>
                                    <Icon name="arrow_forward" className="text-[14px]" />
                                </button>
                                <span className="text-[#c0c8c8]">•</span>
                                <button
                                    onClick={() => {
                                        window.location.href = "/doctor-profile";
                                    }}
                                    className="text-[#256862] hover:text-[#003435] text-[11px] font-bold flex items-center gap-1 transition-colors"
                                >
                                    <span>Clinical Credentials</span>
                                    <Icon name="badge" className="text-[14px]" />
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* ---------- KPI cards ---------- */}
                    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                        {/* KPI 1 */}
                        <div className={`p-6 ${cardBase} flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all group`}>
                            <div className="flex items-start justify-between">
                                <div className="flex flex-col">
                                    <span className="text-[11px] uppercase tracking-wider text-[#404848] font-bold">
                                        Today's Appointments
                                    </span>
                                    <span className={`${heading} text-[36px] leading-[44px] font-bold text-[#003435] mt-1`}>
                                        {stats.todayAppointments}
                                    </span>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-[#E7F4F1] flex items-center justify-center text-[#003435] group-hover:bg-[#ADEFE7] transition-colors">
                                    <Icon name="calendar_today" className="text-[24px]" />
                                </div>
                            </div>
                            <div className="mt-4 pt-1 flex items-center justify-between">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#ffdbcd] text-[#7a3005] text-[11px] font-bold">
                                    <Icon name="priority_high" className="text-[14px]" />
                                    {counts.pending} Pending
                                </span>
                                <span className="text-[12px] text-[#404848]">
                                    {counts.confirmed} Confirmed
                                </span>
                            </div>
                        </div>

                        {/* KPI 2 */}
                        <div className={`p-6 ${cardBase} flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all group`}>
                            <div className="flex items-start justify-between">
                                <div className="flex flex-col">
                                    <span className="text-[11px] uppercase tracking-wider text-[#404848] font-bold">
                                        Upcoming Appointments
                                    </span>
                                    <span className={`${heading} text-[36px] leading-[44px] font-bold text-[#003435] mt-1`}>
                                        {stats.upcomingAppointments}
                                    </span>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-[#E7F4F1] flex items-center justify-center text-[#256862] group-hover:bg-[#ADEFE7] transition-colors">
                                    <Icon name="event_upcoming" className="text-[24px]" />
                                </div>
                            </div>
                            <div className="mt-4 pt-1 flex items-center justify-between">
                                <span className="text-[11px] text-[#256862] font-bold">
                                    Upcoming Encounters
                                </span>
                            </div>
                        </div>

                        {/* KPI 3 */}
                        <div className={`p-6 ${cardBase} flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all group`}>
                            <div className="flex items-start justify-between">
                                <div className="flex flex-col">
                                    <span className="text-[11px] uppercase tracking-wider text-[#404848] font-bold">
                                        Completed Appointments
                                    </span>
                                    <span className={`${heading} text-[36px] leading-[44px] font-bold text-[#003435] mt-1`}>
                                        {stats.completedAppointments}
                                    </span>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-[#E7F4F1] flex items-center justify-center text-[#003435] group-hover:bg-[#ADEFE7] transition-colors">
                                    <Icon name="check_circle" className="text-[24px]" />
                                </div>
                            </div>
                            <div className="mt-4 pt-1 flex items-center justify-between">
                                <div className="w-full bg-[#E7F4F1] rounded-full h-2 mr-3 overflow-hidden">
                                    <div
                                        className="bg-[#256862] h-2 rounded-full"
                                        style={{ width: `${completionPercent}%` }}
                                    />
                                </div>
                                <span className="text-[12px] font-bold text-[#256862]">
                                    {completionPercent}%
                                </span>
                            </div>
                        </div>

                        {/* KPI 4 */}
                        <div className={`p-6 ${cardBase} flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all group`}>
                            <div className="flex items-start justify-between">
                                <div className="flex flex-col">
                                    <span className="text-[11px] uppercase tracking-wider text-[#404848] font-bold">
                                        Total Patients
                                    </span>
                                    <span className={`${heading} text-[36px] leading-[44px] font-bold text-[#003435] mt-1`}>
                                        {stats.totalPatients}
                                    </span>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-[#E7F4F1] flex items-center justify-center text-[#003435] group-hover:bg-[#ADEFE7] transition-colors">
                                    <Icon name="folder_shared" className="text-[24px]" />
                                </div>
                            </div>
                            <div className="mt-4 pt-1 flex items-center justify-between">
                                <span className="text-[11px] text-[#003435] font-bold">
                                    Active Panel
                                </span>
                            </div>
                        </div>
                    </section>

                    {/* ---------- AI Risk Assessment ---------- */}
                    <section className="flex flex-col gap-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <div>
                                <div className="flex items-center gap-1">
                                    <Icon name="psychology" className="text-[#256862] text-[24px]" />
                                    <h3 className={`${heading} text-[24px] leading-[32px] font-semibold text-[#003435]`}>
                                        AI Risk Assessment
                                    </h3>
                                </div>
                                <p className="text-[12px] text-[#404848] mt-0.5">
                                    Select a health risk assessment to analyze patient data.
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    window.location.href = "/ai-risk-assessment";
                                }}
                                className="inline-flex items-center gap-1.5 text-[#256862] hover:text-[#003435] text-[13px] font-bold transition-colors"
                            >
                                <span>Explore Entire AI Suite</span>
                                <Icon name="arrow_forward" className="text-[18px]" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Diabetes */}
                            <div className={`relative p-6 ${cardBase} overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow`}>
                                <div className="h-1.5 absolute top-0 left-0 right-0 bg-gradient-to-r from-[#003435] to-[#ADEFE7]" />
                                <div>
                                    <div className="flex items-center gap-4 mb-2 mt-2">
                                        <div className="w-12 h-12 rounded-xl bg-[#E7F4F1] flex items-center justify-center text-[#003435]">
                                            <Icon name="vital_signs" className="text-[26px]" />
                                        </div>
                                        <div className="flex flex-col">
                                            <h4 className={`${heading} text-[18px] leading-[26px] font-semibold text-[#003435]`}>
                                                Diabetes Risk Assessment
                                            </h4>
                                            <span className="text-[12px] text-[#404848]">
                                                Fasting Glucose, HbA1c &amp; BMI Biomarkers
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-[12px] leading-[18px] text-[#404848] mb-4">
                                        Analyze patient health parameters and assess diabetes risk
                                        using the AI prediction model.
                                    </p>
                                </div>
                                <div className="flex items-center justify-end pt-1">
                                    <button
                                        onClick={() => {
                                            window.location.href = "/diabetes-prediction";
                                        }}
                                        className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-[#003435] hover:bg-[#164B4D] text-white text-[13px] font-semibold transition-colors shadow-sm"
                                    >
                                        <span>Check Diabetes Risk</span>
                                        <Icon name="arrow_forward" className="text-[16px]" />
                                    </button>
                                </div>
                            </div>

                            {/* Kidney */}
                            <div className={`relative p-6 ${cardBase} overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow`}>
                                <div className="h-1.5 absolute top-0 left-0 right-0 bg-gradient-to-r from-[#256862] to-[#B9ECEE]" />
                                <div>
                                    <div className="flex items-center gap-4 mb-2 mt-2">
                                        <div className="w-12 h-12 rounded-xl bg-[#E7F4F1] flex items-center justify-center text-[#256862]">
                                            <Icon name="nephrology" className="text-[26px]" />
                                        </div>
                                        <div className="flex flex-col">
                                            <h4 className={`${heading} text-[18px] leading-[26px] font-semibold text-[#003435]`}>
                                                Kidney Disease Risk Assessment
                                            </h4>
                                            <span className="text-[12px] text-[#404848]">
                                                eGFR Clearance, Albuminuria &amp; Serum Electrolytes
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-[12px] leading-[18px] text-[#404848] mb-4">
                                        AI-powered assessment for kidney disease risk factors.
                                    </p>
                                </div>
                                <div className="flex items-center justify-end pt-1">
                                    <button
                                        onClick={() => {
                                            window.location.href = "/kidney-disease-risk";
                                        }}
                                        className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-[#003435] hover:bg-[#164B4D] text-white text-[13px] font-semibold transition-colors shadow-sm"
                                    >
                                        <span>Check Kidney Risk</span>
                                        <Icon name="arrow_forward" className="text-[16px]" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ---------- My Appointments ---------- */}
                    <section className="flex flex-col gap-4">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-1 flex-wrap">
                                    <h3 className={`${heading} text-[24px] leading-[32px] font-semibold text-[#003435] mr-1`}>
                                        My Appointments
                                    </h3>
                                    <span className="px-2.5 py-0.5 rounded-full bg-[#dcf3ee] text-[11px] text-[#404848] font-bold">
                                        {appointments.length} Scheduled
                                    </span>
                                </div>
                                <p className="text-[12px] text-[#404848] mt-0.5">
                                    Active outpatient roster, consultation notes workspace, and patient inspection.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                                <div className="relative flex items-center min-w-[280px]">
                                    <Icon name="search" className="absolute left-3 text-[#404848] text-[18px]" />
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Search patient name or email..."
                                        className="w-full pl-9 pr-3 py-2 bg-white border border-[#CBDAD6] rounded-xl text-[12px] text-[#0a1f1c] placeholder:text-[#404848] focus:outline-none focus:border-[#256862] shadow-sm"
                                    />
                                </div>

                                <div className="flex items-center gap-1 p-1 bg-[#dcf3ee] rounded-xl overflow-x-auto">
                                    {filters.map((f) => (
                                        <button
                                            key={f.key}
                                            onClick={() => setStatusFilter(f.key)}
                                            className={`px-3 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-colors ${statusFilter === f.key
                                                    ? "bg-white text-[#003435] shadow-sm"
                                                    : "text-[#404848] hover:text-[#0a1f1c]"
                                                }`}
                                        >
                                            {f.label} ({counts[f.key]})
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                            {/* Left: appointment list */}
                            <div className="lg:col-span-7 flex flex-col gap-4">
                                {loading ? (
                                    <div className={`${cardBase} p-6`}>
                                        <p className="text-[#404848]">Loading appointments...</p>
                                    </div>
                                ) : appointments.length === 0 ? (
                                    <div className={`${cardBase} p-6`}>
                                        <p className="text-[#404848]">No appointments found.</p>
                                    </div>
                                ) : filteredAppointments.length === 0 ? (
                                    <div className={`${cardBase} p-6`}>
                                        <p className="text-[#404848]">
                                            No appointments match your search or filter.
                                        </p>
                                    </div>
                                ) : (
                                    filteredAppointments.map((appointment) => {
                                        const isActive =
                                            activeAppointment &&
                                            activeAppointment._id === appointment._id;
                                        const dateObj = new Date(appointment.date);

                                        return (
                                            <div
                                                key={appointment._id}
                                                className={`p-4 lg:p-6 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all relative overflow-hidden ${isActive
                                                        ? "border-2 border-[#256862]/40"
                                                        : "border border-[#CBDAD6]"
                                                    } ${appointment.status === "completed" ? "opacity-90" : ""}`}
                                            >
                                                {isActive && (
                                                    <div className="absolute left-0 top-0 bottom-0 w-2 bg-[#256862]" />
                                                )}

                                                <div className="flex flex-col gap-4 pl-1">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 rounded-xl bg-[#E7F4F1] flex items-center justify-center text-[16px] text-[#003435] font-bold shrink-0">
                                                                <span className={heading}>
                                                                    {getInitials(appointment.patient?.name)}
                                                                </span>
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <h4 className={`${heading} text-[18px] leading-[26px] font-semibold text-[#003435]`}>
                                                                    {appointment.patient?.name}
                                                                </h4>
                                                                <span className="text-[12px] text-[#404848]">
                                                                    {appointment.patient?.email}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-col items-end gap-1">
                                                            <span
                                                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold capitalize ${statusStyles[appointment.status] ||
                                                                    "bg-[#dcf3ee] text-[#2c6e68]"
                                                                    }`}
                                                            >
                                                                <span
                                                                    className={`w-1.5 h-1.5 rounded-full ${statusDot[appointment.status] || "bg-[#256862]"
                                                                        }`}
                                                                />
                                                                {appointment.status}
                                                            </span>
                                                            <span className={`${heading} text-[16px] font-semibold text-[#003435]`}>
                                                                {dateObj.toLocaleTimeString([], {
                                                                    hour: "2-digit",
                                                                    minute: "2-digit",
                                                                })}
                                                            </span>
                                                            <span className="text-[11px] text-[#404848]">
                                                                {dateObj.toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {appointment.reason && (
                                                        <div className="p-2 rounded-xl bg-[#e1f8f3] flex flex-col gap-1">
                                                            <span className="text-[11px] text-[#404848] uppercase font-bold tracking-wider">
                                                                Consultation Reason
                                                            </span>
                                                            <p className="text-[14px] text-[#0a1f1c] font-medium">
                                                                {appointment.reason}
                                                            </p>
                                                        </div>
                                                    )}

                                                    <div className="flex items-center justify-between pt-1 border-t border-[#e1f8f3] flex-wrap gap-2">
                                                        <div className="flex items-center gap-3">
                                                            <button
                                                                onClick={() =>
                                                                    setSelectedPatient(appointment.patient)
                                                                }
                                                                className="inline-flex items-center gap-1 text-[#256862] hover:text-[#003435] text-[11px] font-bold transition-colors"
                                                            >
                                                                <Icon name="visibility" className="text-[16px]" />
                                                                <span>View Patient</span>
                                                            </button>
                                                            <button
                                                                onClick={() => setActiveId(appointment._id)}
                                                                className="inline-flex items-center gap-1 text-[#256862] hover:text-[#003435] text-[11px] font-bold transition-colors"
                                                            >
                                                                <Icon name="edit_note" className="text-[16px]" />
                                                                <span>Open Notes</span>
                                                            </button>
                                                        </div>

                                                        <div className="flex flex-wrap items-center gap-1">
                                                            {(appointment.status === "pending" ||
                                                                appointment.status === "confirmed") && (
                                                                    <button
                                                                        onClick={() =>
                                                                            updateStatus(appointment._id, "cancelled")
                                                                        }
                                                                        className="px-3 py-1.5 rounded-lg bg-[#ffdad6] hover:bg-[#ffc9c3] text-[#93000a] text-[11px] font-bold transition-colors"
                                                                    >
                                                                        Cancel
                                                                    </button>
                                                                )}

                                                            {appointment.status === "pending" && (
                                                                <button
                                                                    onClick={() =>
                                                                        updateStatus(appointment._id, "confirmed")
                                                                    }
                                                                    className="px-3 py-1.5 rounded-lg bg-[#256862] hover:bg-[#256862]/90 text-white text-[11px] font-bold transition-colors shadow-sm"
                                                                >
                                                                    Confirm
                                                                </button>
                                                            )}

                                                            {appointment.status === "confirmed" && (
                                                                <button
                                                                    onClick={() =>
                                                                        updateStatus(appointment._id, "completed")
                                                                    }
                                                                    className="px-3 py-1.5 rounded-lg bg-[#003435] hover:bg-[#164B4D] text-white text-[11px] font-bold transition-colors shadow-sm"
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

                            {/* Right: consultation notes */}
                            <div className="lg:col-span-5 flex flex-col gap-4">
                                <div className={`p-6 ${cardBase} flex flex-col gap-4`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-[#164B4D] text-white flex items-center justify-center">
                                                <Icon name="edit_note" className="text-[18px]" />
                                            </div>
                                            <div>
                                                <h4 className={`${heading} text-[18px] leading-[26px] font-semibold text-[#003435]`}>
                                                    Clinical Consultation Notes
                                                </h4>
                                                <span className="text-[12px] text-[#404848]">
                                                    {activeAppointment
                                                        ? `Active Subject: ${activeAppointment.patient?.name}`
                                                        : "No appointment selected"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {activeAppointment ? (
                                        <>
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center justify-between">
                                                    <label className="text-[11px] uppercase tracking-wider text-[#404848] font-bold">
                                                        Diagnostic Impressions &amp; Care Plan
                                                    </label>
                                                    <span className="text-[11px] text-[#404848]">
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
                                                    rows="8"
                                                    placeholder="Add consultation notes..."
                                                    className="w-full p-4 bg-[#e1f8f3] border border-[#CBDAD6] rounded-xl text-[14px] leading-[22px] text-[#0a1f1c] placeholder:text-[#404848] focus:outline-none focus:bg-white focus:border-[#256862] shadow-inner transition-colors resize-none"
                                                />
                                            </div>

                                            <div className="flex flex-wrap gap-1.5">
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
                                                        className="px-2.5 py-1 rounded-lg bg-[#dcf3ee] hover:bg-[#d6ede8] text-[#0a1f1c] text-[11px] font-bold transition-colors border border-[#c0c8c8]/30"
                                                    >
                                                        {template.label}
                                                    </button>
                                                ))}
                                            </div>

                                            <div className="flex items-center justify-between pt-1 border-t border-[#e1f8f3]">
                                                <div className="flex items-center gap-1.5 text-[#256862] text-[11px] font-bold">
                                                    <Icon name="lock" className="text-[16px]" />
                                                    <span>Encrypted EHR Sync</span>
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
                                                    className="inline-flex items-center gap-1 px-4 py-2.5 rounded-xl bg-[#003435] hover:bg-[#164B4D] text-white text-[13px] font-semibold transition-colors shadow-sm disabled:opacity-50"
                                                >
                                                    <Icon
                                                        name={savingNotes === activeAppointment._id ? "refresh" : "save"}
                                                        className={`text-[18px] ${savingNotes === activeAppointment._id ? "animate-spin" : ""}`}
                                                    />
                                                    <span>
                                                        {savingNotes === activeAppointment._id
                                                            ? "Saving..."
                                                            : "Save Notes"}
                                                    </span>
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <p className="text-[14px] text-[#404848]">
                                            Select an appointment to add consultation notes.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            {/* ================= PATIENT MODAL ================= */}
            {selectedPatient && (
                <div className="fixed inset-0 z-50 bg-[#003435]/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col border border-[#CBDAD6]">
                        <div className="p-6 bg-[#E7F4F1] flex items-center justify-between border-b border-[#CBDAD6]">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-xl bg-[#164B4D] text-white flex items-center justify-center text-[18px] font-bold ring-2 ring-[#ADEFE7]">
                                    <span className={heading}>
                                        {getInitials(selectedPatient.name)}
                                    </span>
                                </div>
                                <h3 className={`${heading} text-[24px] leading-[32px] font-semibold text-[#003435]`}>
                                    Patient Details
                                </h3>
                            </div>
                            <button
                                onClick={() => setSelectedPatient(null)}
                                className="p-2 rounded-lg text-[#404848] hover:text-[#0a1f1c] hover:bg-[#dcf3ee] transition-colors"
                            >
                                <Icon name="close" className="text-[20px]" />
                            </button>
                        </div>

                        <div className="p-6 flex flex-col gap-4">
                            <div className="p-2 rounded-xl bg-[#e1f8f3] flex flex-col px-3 py-2">
                                <span className="text-[11px] text-[#404848] uppercase font-bold tracking-wider">
                                    Name
                                </span>
                                <span className="text-[14px] text-[#003435] font-semibold">
                                    {selectedPatient.name}
                                </span>
                            </div>
                            <div className="p-2 rounded-xl bg-[#e1f8f3] flex flex-col px-3 py-2">
                                <span className="text-[11px] text-[#404848] uppercase font-bold tracking-wider">
                                    Email
                                </span>
                                <span className="text-[14px] text-[#003435] font-semibold">
                                    {selectedPatient.email}
                                </span>
                            </div>
                        </div>

                        <div className="p-4 bg-[#e1f8f3] flex items-center justify-between border-t border-[#CBDAD6]">
                            <button
                                onClick={() => setSelectedPatient(null)}
                                className="w-full px-4 py-2.5 rounded-xl bg-[#003435] hover:bg-[#164B4D] text-white text-[13px] font-semibold transition-colors shadow-sm"
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