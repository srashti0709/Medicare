import { useEffect, useMemo, useState } from "react";
import api from "../api";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";

const fontStyles = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;600;700&family=Manrope:wght@400;500;600;700&display=swap');

.medicare-appointments {
    font-family: 'Manrope', ui-sans-serif, system-ui, sans-serif;
    color: #0A1F1C;
    -webkit-font-smoothing: antialiased;
    width: 100%;
    min-width: 0;
}

.medicare-appointments .md-display {
    font-family: 'Bricolage Grotesque', 'Manrope', ui-sans-serif, system-ui, sans-serif;
    letter-spacing: -0.02em;
}

.medicare-appointments button,
.medicare-appointments input,
.medicare-appointments textarea,
.medicare-appointments select {
    font-family: inherit;
}

@keyframes md-spin {
    to {
        transform: rotate(360deg);
    }
}

@keyframes md-pulse {
    0%, 100% {
        opacity: 0.35;
        transform: scale(0.85);
    }

    50% {
        opacity: 1;
        transform: scale(1);
    }
}

.medicare-appointments .md-spinner {
    animation: md-spin 0.8s linear infinite;
}

.medicare-appointments .md-live-dot {
    animation: md-pulse 1.8s ease-in-out infinite;
}

.medicare-appointments ::-webkit-scrollbar {
    width: 7px;
    height: 7px;
}

.medicare-appointments ::-webkit-scrollbar-track {
    background: #E7EFED;
}

.medicare-appointments ::-webkit-scrollbar-thumb {
    background: #9ADBD3;
    border-radius: 999px;
}

/* Prevent grid children from forcing horizontal page overflow */
.medicare-appointments .grid,
.medicare-appointments .flex {
    min-width: 0;
}

.medicare-appointments .overflow-x-auto {
    max-width: 100%;
    -webkit-overflow-scrolling: touch;
}

/* TABLET RESPONSIVENESS */
@media (min-width: 768px) and (max-width: 1279px) {

    .medicare-appointments > div {
        padding: 24px;
    }

    .medicare-appointments .max-w-\\[1450px\\] {
        width: 100%;
    }

    .medicare-appointments table {
        min-width: 900px;
    }

    .medicare-appointments .grid.grid-cols-12 {
        grid-template-columns: repeat(12, minmax(0, 1fr));
    }

    .medicare-appointments .xl\\:col-span-8,
    .medicare-appointments .xl\\:col-span-4 {
        grid-column: span 12 / span 12;
        min-width: 0;
    }

    .medicare-appointments .xl\\:sticky {
        position: static;
    }
}

/* MOBILE RESPONSIVENESS */
@media (max-width: 767px) {

    /* PAGE SPACING */
    .medicare-appointments > div {
        padding: 14px;
    }

    .medicare-appointments .max-w-\\[1450px\\] {
        width: 100%;
        max-width: 100%;
        gap: 18px;
    }

    /* PAGE HEADER */
    .medicare-appointments h1 {
        font-size: 23px;
    }

    .medicare-appointments .tracking-\\[0\\.15em\\] {
        letter-spacing: 0.08em;
    }

    .medicare-appointments .xl\\:flex-row {
        flex-direction: column;
        align-items: flex-start;
    }

    /* GENERAL TYPOGRAPHY */
    .medicare-appointments .text-base {
        font-size: 12px;
        line-height: 1.5;
    }

    .medicare-appointments .text-lg {
        font-size: 16px;
        line-height: 1.4;
    }

    .medicare-appointments .text-\\[25px\\] {
        font-size: 23px;
    }

    .medicare-appointments .text-\\[30px\\] {
        font-size: 25px;
    }

    .medicare-appointments .text-\\[26px\\] {
        font-size: 23px;
    }

    /* METRIC CARDS */
    .medicare-appointments .grid-cols-2 {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .medicare-appointments .p-5 {
        padding: 12px;
    }

    .medicare-appointments .p-4 {
        padding: 12px;
    }

    .medicare-appointments .p-3\\.5 {
        padding: 11px;
    }

    .medicare-appointments .p-3 {
        padding: 10px;
    }

    .medicare-appointments .gap-5 {
        gap: 12px;
    }

    .medicare-appointments .gap-4 {
        gap: 10px;
    }

    /* METRIC LABELS */
    .medicare-appointments .uppercase {
        overflow-wrap: anywhere;
    }

    .medicare-appointments .tracking-\\[0\\.12em\\] {
        letter-spacing: 0.06em;
    }

    /* UTILITY BAR */
    .medicare-appointments .flex-wrap {
        row-gap: 8px;
    }

    /* LIVE SCHEDULE */
    .medicare-appointments .grid-cols-2 {
        min-width: 0;
    }

    .medicare-appointments .grid-cols-2 > * {
        min-width: 0;
    }

    .medicare-appointments .grid-cols-2 button {
        padding: 9px;
    }

    /* MAIN CONTENT */
    .medicare-appointments .grid-cols-12 {
        grid-template-columns: minmax(0, 1fr);
    }

    .medicare-appointments .col-span-12 {
        grid-column: 1 / -1;
        width: 100%;
        min-width: 0;
    }

    .medicare-appointments .xl\\:sticky {
        position: static;
        top: auto;
    }

    /* APPOINTMENT TABLE */
    .medicare-appointments table {
        min-width: 950px;
        width: 950px;
        table-layout: auto;
    }

    .medicare-appointments th,
    .medicare-appointments td {
        white-space: nowrap;
        padding: 12px;
    }

    .medicare-appointments td {
        vertical-align: middle;
    }

    .medicare-appointments .overflow-x-auto {
        overflow-x: auto;
        overflow-y: hidden;
        scrollbar-width: thin;
    }

    /* TABLE HEADER */
    .medicare-appointments .px-5.sm\\:px-6 {
        padding-left: 12px;
        padding-right: 12px;
    }

    /* TABLE FOOTER */
    .medicare-appointments .gap-4.text-base {
        flex-wrap: wrap;
        gap: 8px;
    }

    /* DETAILS PANEL */
    .medicare-appointments .grid-cols-2 {
        min-width: 0;
    }

    .medicare-appointments .rounded-2xl {
        border-radius: 15px;
    }

    /* PATIENT DETAILS */
    .medicare-appointments .w-12.h-12 {
        width: 40px;
        height: 40px;
    }

    /* BUTTONS */
    .medicare-appointments button {
        touch-action: manipulation;
    }

    .medicare-appointments .flex.items-center.gap-2 {
        min-width: 0;
    }

    /* EMPTY STATE */
    .medicare-appointments .px-10 {
        padding-left: 16px;
        padding-right: 16px;
    }

    .medicare-appointments .py-20 {
        padding-top: 48px;
        padding-bottom: 48px;
    }

    /* ERROR MESSAGE */
    .medicare-appointments [role="alert"] {
        padding: 12px;
        font-size: 12px;
    }
}

/* EXTRA SMALL MOBILE SCREENS */
@media (max-width: 380px) {

    .medicare-appointments > div {
        padding: 10px;
    }

    .medicare-appointments .grid-cols-2 {
        grid-template-columns: minmax(0, 1fr);
    }

    .medicare-appointments .p-5 {
        padding: 13px;
    }

    .medicare-appointments .text-base {
        font-size: 12px;
    }

    .medicare-appointments .text-\\[30px\\] {
        font-size: 24px;
    }

    .medicare-appointments .gap-5 {
        gap: 10px;
    }
}

@media (prefers-reduced-motion: reduce) {
    .medicare-appointments .md-spinner,
    .medicare-appointments .md-live-dot {
        animation: none;
    }
}
`;

const cardClass =
    "bg-white rounded-2xl border border-[#DCEAE7] shadow-[0_8px_30px_-22px_rgba(22,75,77,0.45)]";

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("adminToken");

            const response = await api.get("/appointments", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = response.data.appointments || [];

            setAppointments(data);

            setSelectedAppointment((current) => {
                if (!current) return data[0] || null;

                return (
                    data.find(
                        (appointment) => appointment._id === current._id
                    ) ||
                    data[0] ||
                    null
                );
            });
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to fetch appointments"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const getStatusStyle = (status) => {
        switch (status) {
            case "confirmed":
                return "bg-[#E1F3F0] text-[#164B4D] border-[#9ADBD3]";

            case "completed":
                return "bg-[#DDF1ED] text-[#164B4D] border-[#B9D8D4]";

            case "cancelled":
                return "bg-[#F1F4F3] text-[#6F8884] border-[#D5E0DD]";

            default:
                return "bg-[#FDEEE6] text-[#9A3F18] border-[#F28B5B]/50";
        }
    };

    const getStatusDot = (status) => {
        switch (status) {
            case "confirmed":
                return "bg-[#2E9C8F]";

            case "completed":
                return "bg-[#164B4D]";

            case "cancelled":
                return "bg-[#A9BCB8]";

            default:
                return "bg-[#F28B5B]";
        }
    };

    const formatDoctorName = (name) => {
        if (!name) return "Unknown";

        return name.toLowerCase().startsWith("dr.")
            ? name
            : `Dr. ${name}`;
    };

    const getInitials = (name, fallback = "P") => {
        if (!name) return fallback;

        return name
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part.charAt(0).toUpperCase())
            .join("");
    };

    const formatDate = (date) => {
        if (!date) return "-";

        return new Date(date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const formatTime = (date) => {
        if (!date) return "-";

        return new Date(date).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const isToday = (date) => {
        if (!date) return false;

        const appointmentDate = new Date(date);
        const today = new Date();

        return (
            appointmentDate.getDate() === today.getDate() &&
            appointmentDate.getMonth() === today.getMonth() &&
            appointmentDate.getFullYear() === today.getFullYear()
        );
    };

    const updateStatus = async (appointmentId, status) => {
        try {
            const token = localStorage.getItem("adminToken");

            await api.patch(
                `/appointments/${appointmentId}/status`,
                { status },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            fetchAppointments();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to update appointment status"
            );
        }
    };

    const totalAppointments = appointments.length;

    const pendingAppointments = appointments.filter(
        (appointment) => appointment.status === "pending"
    ).length;

    const confirmedAppointments = appointments.filter(
        (appointment) => appointment.status === "confirmed"
    ).length;

    const completedAppointments = appointments.filter(
        (appointment) => appointment.status === "completed"
    ).length;

    const cancelledAppointments = appointments.filter(
        (appointment) => appointment.status === "cancelled"
    ).length;

    const todayAppointments = appointments.filter(
        (appointment) => isToday(appointment.date)
    ).length;

    const upcomingAppointments = useMemo(() => {
        return [...appointments]
            .filter((appointment) => {
                if (!appointment.date) return false;

                const date = new Date(appointment.date);

                return (
                    date >= new Date() &&
                    appointment.status !== "cancelled"
                );
            })
            .sort(
                (a, b) =>
                    new Date(a.date).getTime() -
                    new Date(b.date).getTime()
            )
            .slice(0, 8);
    }, [appointments]);
    const appointmentDensity = useMemo(() => {
        const hourlyData = Array.from({ length: 13 }, (_, index) => {
            const hour = index + 8;

            return {
                hour,
                time: new Date(2000, 0, 1, hour).toLocaleTimeString([], {
                    hour: "numeric",
                    hour12: true,
                }),
                appointments: 0,
                records: [],
            };
        });

        appointments
            .filter(
                (appointment) =>
                    isToday(appointment.date) &&
                    appointment.status !== "cancelled"
            )
            .forEach((appointment) => {
                const hour = new Date(appointment.date).getHours();

                if (hour >= 8 && hour <= 20) {
                    const slot = hourlyData[hour - 8];

                    slot.appointments += 1;
                    slot.records.push(appointment);
                }
            });

        return hourlyData;
    }, [appointments]);

    const completedRate =
        totalAppointments > 0
            ? Math.round(
                (completedAppointments / totalAppointments) * 100
            )
            : 0;

    return (
        <div className="medicare-appointments min-h-full">
            <style>{fontStyles}</style>

            <div className="p-6 xl:p-8">
                <div className="max-w-[1450px] mx-auto space-y-6">

                    {/* PAGE HEADER */}
                    <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1.5">
                                <span className="w-2 h-2 rounded-full bg-[#2E9C8F]" />

                                <span className="text-base font-bold tracking-[0.15em] uppercase text-[#2E8179]">
                                    Clinical Operations • Scheduling
                                </span>
                            </div>

                            <h1 className="md-display text-[25px] font-semibold text-[#164B4D] leading-tight">
                                Appointments
                            </h1>

                            <p className="text-base text-[#526563] mt-1">
                                Track and manage patient appointments across
                                Medicare.
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#E1F3F0] border border-[#C9E8E3]">
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="absolute inline-flex h-full w-full rounded-full bg-[#2E9C8F] opacity-40 animate-ping" />

                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#2E9C8F]" />
                                </span>

                                <span className="text-base font-bold text-[#164B4D]">
                                    Live Registry
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* ERROR */}
                    {error && (
                        <div
                            role="alert"
                            className="flex items-start gap-3 bg-[#FDF1EA] border border-[#F5CDB8] border-l-4 border-l-[#F28B5B] text-[#8F3A17] px-4 py-3.5 rounded-xl text-base font-medium"
                        >
                            <svg
                                className="w-5 h-5 mt-0.5 shrink-0 text-[#F28B5B]"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-4a1 1 0 00-1 1v3a1 1 0 002 0V7a1 1 0 00-1-1zm0 8a1 1 0 100-2 1 1 0 000 2z"
                                    clipRule="evenodd"
                                />
                            </svg>

                            <span>{error}</span>
                        </div>
                    )}

                    {/* LOADING */}
                    {loading ? (
                        <div
                            className={`${cardClass} px-10 py-20 text-center`}
                        >
                            <svg
                                className="md-spinner w-7 h-7 mx-auto mb-4 text-[#164B4D]"
                                viewBox="0 0 24 24"
                                fill="none"
                                aria-hidden="true"
                            >
                                <circle
                                    cx="12"
                                    cy="12"
                                    r="9"
                                    stroke="#E7EFED"
                                    strokeWidth="3"
                                />

                                <path
                                    d="M21 12a9 9 0 00-9-9"
                                    stroke="#164B4D"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                />
                            </svg>

                            <p className="text-base font-semibold text-[#526563]">
                                Loading appointments...
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* METRIC CARDS */}
                            <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">

                                {/* TODAY */}
                                <div
                                    className={`${cardClass} p-5 hover:border-[#9ADBD3] transition-all`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-base font-bold uppercase tracking-[0.12em] text-[#667876]">
                                            Today's Total
                                        </span>

                                        <div className="w-9 h-9 rounded-xl bg-[#E1F3F0] text-[#164B4D] flex items-center justify-center">
                                            <svg
                                                className="w-4 h-4"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.8"
                                            >
                                                <rect
                                                    x="3"
                                                    y="5"
                                                    width="18"
                                                    height="16"
                                                    rx="2"
                                                />

                                                <path d="M16 3v4M8 3v4M3 10h18" />
                                            </svg>
                                        </div>
                                    </div>

                                    <div className="mt-3 flex items-baseline justify-between">
                                        <span className="md-display text-[30px] font-semibold text-[#164B4D]">
                                            {todayAppointments}
                                        </span>

                                        <span className="px-2 py-0.5 rounded-full bg-[#E1F3F0] text-[#164B4D] text-base font-bold">
                                            TODAY
                                        </span>
                                    </div>

                                    <p className="text-base text-[#667876] mt-1">
                                        Appointments scheduled today
                                    </p>
                                </div>

                                {/* UPCOMING */}
                                <div
                                    className={`${cardClass} p-5 hover:border-[#9ADBD3] transition-all`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-base font-bold uppercase tracking-[0.12em] text-[#667876]">
                                            Upcoming
                                        </span>

                                        <div className="w-9 h-9 rounded-xl bg-[#E7EFED] text-[#256862] flex items-center justify-center">
                                            <svg
                                                className="w-4 h-4"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.8"
                                            >
                                                <circle
                                                    cx="12"
                                                    cy="12"
                                                    r="9"
                                                />

                                                <path d="M12 7v5l3 2" />
                                            </svg>
                                        </div>
                                    </div>

                                    <div className="mt-3 flex items-baseline justify-between">
                                        <span className="md-display text-[30px] font-semibold text-[#164B4D]">
                                            {upcomingAppointments.length}
                                        </span>

                                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E7EFED] text-[#256862] text-base font-bold">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#2E9C8F]" />
                                            SCHEDULED
                                        </span>
                                    </div>

                                    <p className="text-base text-[#667876] mt-1">
                                        Future active appointments
                                    </p>
                                </div>

                                {/* COMPLETED */}
                                <div
                                    className={`${cardClass} p-5 hover:border-[#9ADBD3] transition-all`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-base font-bold uppercase tracking-[0.12em] text-[#667876]">
                                            Completed
                                        </span>

                                        <div className="w-9 h-9 rounded-xl bg-[#DDF1ED] text-[#164B4D] flex items-center justify-center">
                                            <svg
                                                className="w-4 h-4"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.8"
                                            >
                                                <circle
                                                    cx="12"
                                                    cy="12"
                                                    r="9"
                                                />

                                                <path d="m8 12 2.5 2.5L16 9" />
                                            </svg>
                                        </div>
                                    </div>

                                    <div className="mt-3 flex items-baseline justify-between">
                                        <span className="md-display text-[30px] font-semibold text-[#164B4D]">
                                            {completedAppointments}
                                        </span>

                                        <span className="px-2 py-0.5 rounded-full bg-[#DDF1ED] text-[#164B4D] text-base font-bold">
                                            {completedRate}% RATE
                                        </span>
                                    </div>

                                    <p className="text-base text-[#667876] mt-1">
                                        Successfully completed sessions
                                    </p>
                                </div>

                                {/* ATTENTION */}
                                <div
                                    className={`${cardClass} p-5 hover:border-[#F2C4A9] transition-all`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-base font-bold uppercase tracking-[0.12em] text-[#667876]">
                                            Attention
                                        </span>

                                        <div className="w-9 h-9 rounded-xl bg-[#FDEEE6] text-[#C25A2A] flex items-center justify-center">
                                            <svg
                                                className="w-4 h-4"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.8"
                                            >
                                                <circle
                                                    cx="12"
                                                    cy="12"
                                                    r="9"
                                                />

                                                <path d="M12 7v5" />

                                                <circle
                                                    cx="12"
                                                    cy="16"
                                                    r=".7"
                                                    fill="currentColor"
                                                />
                                            </svg>
                                        </div>
                                    </div>

                                    <div className="mt-3 flex items-baseline justify-between">
                                        <span className="md-display text-[30px] font-semibold text-[#164B4D]">
                                            {pendingAppointments}
                                        </span>

                                        <span className="px-2 py-0.5 rounded-full bg-[#FDEEE6] text-[#9A3F18] text-base font-bold">
                                            PENDING
                                        </span>
                                    </div>

                                    <p className="text-base text-[#667876] mt-1">
                                        {cancelledAppointments} cancelled
                                        appointments
                                    </p>
                                </div>
                            </div>

                            {/* UTILITY BAR */}
                            <div className={`${cardClass} p-4`}>
                                <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                                    <div>
                                        <p className="text-base font-bold uppercase tracking-[0.14em] text-[#667876]">
                                            Clinical Operations
                                        </p>

                                        <p className="text-base font-semibold text-[#164B4D] mt-1">
                                            Scheduling Orchestration
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2">
                                        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#F2F8F6] border border-[#E7EFED]">
                                            <span className="w-2 h-2 rounded-full bg-[#2E9C8F]" />

                                            <span className="text-base font-semibold text-[#526563]">
                                                {totalAppointments} Total Records
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#E1F3F0]">
                                            <span className="w-2 h-2 rounded-full bg-[#2E9C8F]" />

                                            <span className="text-base font-bold text-[#164B4D]">
                                                {confirmedAppointments} Confirmed
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#FDEEE6]">
                                            <span className="w-2 h-2 rounded-full bg-[#F28B5B]" />

                                            <span className="text-base font-bold text-[#9A3F18]">
                                                {pendingAppointments} Pending
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* EMPTY STATE */}
                            {appointments.length === 0 ? (
                                <div className="bg-white rounded-2xl border border-dashed border-[#BFD3CF] px-10 py-20 text-center">
                                    <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-[#E7EFED] text-[#164B4D] flex items-center justify-center">
                                        <svg
                                            className="w-7 h-7"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.6"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <rect
                                                x="4"
                                                y="5"
                                                width="16"
                                                height="15"
                                                rx="2"
                                            />

                                            <path d="M4 10h16M9 3v4M15 3v4" />
                                        </svg>
                                    </div>

                                    <h3 className="md-display text-lg font-semibold text-[#164B4D]">
                                        No appointments found
                                    </h3>

                                    <p className="text-base text-[#667876] mt-1">
                                        There are currently no appointments in
                                        the registry.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {/* MAIN CONTENT */}
                                    <div className="grid grid-cols-12 gap-5 items-start">

                                        {/* LEFT */}
                                        <div className="col-span-12 xl:col-span-8 flex flex-col gap-5">

                                            {/* LIVE SCHEDULE */}
                                            {/* LIVE SCHEDULE — APPOINTMENT DENSITY */}
                                            <div className={`${cardClass} p-5 overflow-hidden`}>
                                                <div className="flex items-center justify-between gap-4 mb-5">
                                                    <div className="flex items-center gap-2">
                                                        <span className="w-2.5 h-2.5 rounded-full bg-[#2E9C8F] md-live-dot" />

                                                        <span className="text-base font-bold uppercase tracking-[0.12em] text-[#667876]">
                                                            Live Day Tracker • Appointment Density
                                                        </span>
                                                    </div>

                                                    <span className="hidden sm:block text-base font-bold uppercase tracking-wider text-[#2E8179]">
                                                        {todayAppointments} today
                                                    </span>
                                                </div>

                                                <div className="w-full h-[260px]">
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <BarChart
                                                            data={appointmentDensity}
                                                            margin={{
                                                                top: 15,
                                                                right: 10,
                                                                left: -20,
                                                                bottom: 5,
                                                            }}
                                                            barCategoryGap="30%"
                                                            onClick={(data) => {
                                                                const selectedHour =
                                                                    data?.activePayload?.[0]?.payload?.hour;

                                                                if (selectedHour === undefined) return;

                                                                const appointment = appointments.find(
                                                                    (item) =>
                                                                        isToday(item.date) &&
                                                                        item.status !== "cancelled" &&
                                                                        new Date(item.date).getHours() === selectedHour
                                                                );

                                                                if (appointment) {
                                                                    setSelectedAppointment(appointment);
                                                                }
                                                            }}
                                                        >
                                                            <CartesianGrid
                                                                strokeDasharray="3 3"
                                                                vertical={false}
                                                                stroke="#E7EFED"
                                                            />

                                                            <XAxis
                                                                dataKey="time"
                                                                tick={{
                                                                    fill: "#718B87",
                                                                    fontSize: 12,
                                                                    fontWeight: 600,
                                                                }}
                                                                axisLine={{ stroke: "#DCEAE7" }}
                                                                tickLine={false}
                                                                interval={1}
                                                            />

                                                            <YAxis
                                                                allowDecimals={false}
                                                                tick={{
                                                                    fill: "#718B87",
                                                                    fontSize: 12,
                                                                }}
                                                                axisLine={false}
                                                                tickLine={false}
                                                                width={35}
                                                            />

                                                            <Tooltip
                                                                cursor={{ fill: "#E1F3F0", opacity: 0.5 }}
                                                                contentStyle={{
                                                                    backgroundColor: "#FFFFFF",
                                                                    border: "1px solid #DCEAE7",
                                                                    borderRadius: "12px",
                                                                    boxShadow: "0 8px 25px rgba(22,75,77,0.12)",
                                                                    padding: "12px 15px",
                                                                }}
                                                                labelStyle={{
                                                                    color: "#164B4D",
                                                                    fontWeight: 700,
                                                                    marginBottom: 5,
                                                                }}
                                                                formatter={(value) => [
                                                                    `${value} appointment${value !== 1 ? "s" : ""}`,
                                                                    "Density",
                                                                ]}
                                                            />

                                                            <Bar
                                                                dataKey="appointments"
                                                                name="Appointments"
                                                                fill="#2E9C8F"
                                                                radius={[7, 7, 0, 0]}
                                                                maxBarSize={35}
                                                                activeBar={{
                                                                    fill: "#164B4D",
                                                                    stroke: "#9ADBD3",
                                                                    strokeWidth: 2,
                                                                }}
                                                                cursor="pointer"
                                                            />
                                                        </BarChart>
                                                    </ResponsiveContainer>
                                                </div>

                                                <div className="flex items-center justify-between flex-wrap gap-2 mt-3 pt-3 border-t border-[#E7EFED]">
                                                    <div className="flex items-center gap-2">
                                                        <span className="w-2.5 h-2.5 rounded-sm bg-[#2E9C8F]" />
                                                        <span className="text-base font-semibold text-[#667876]">
                                                            Appointments per hour
                                                        </span>
                                                    </div>

                                                    <span className="text-base font-semibold text-[#718B87]">
                                                        8 AM – 8 PM
                                                    </span>
                                                </div>
                                            </div>

                                            {/* APPOINTMENT REGISTRY */}
                                            <div
                                                className={`${cardClass} overflow-hidden`}
                                            >
                                                {/* TABLE HEADER */}
                                                <div className="px-5 sm:px-6 py-4 bg-[#F2F8F6] border-b border-[#E7EFED] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <h2 className="md-display text-lg font-semibold text-[#164B4D]">
                                                                Scheduled
                                                                Appointments
                                                            </h2>

                                                            <span className="px-2 py-0.5 rounded-full bg-[#ADEFE7] text-[#164B4D] text-base font-bold">
                                                                {
                                                                    appointments.length
                                                                }
                                                            </span>
                                                        </div>

                                                        <p className="text-base text-[#667876] mt-1">
                                                            Current hospital
                                                            appointment records
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center gap-2 text-base font-bold uppercase tracking-wider text-[#667876]">
                                                        <span className="w-2 h-2 rounded-full bg-[#2E9C8F]" />
                                                        Registry synced
                                                    </div>
                                                </div>

                                                {/* TABLE */}
                                                <div className="overflow-x-auto w-full">
                                                    <table className="w-full table-fixed">
                                                        <thead>
                                                            <tr className="bg-[#164B4D] text-left">
                                                                <th className="px-5 py-3 text-base font-bold uppercase tracking-[0.08em] text-[#DDF4F1]">
                                                                    Patient
                                                                </th>

                                                                <th className="px-5 py-3 text-base font-bold uppercase tracking-[0.08em] text-[#DDF4F1]">
                                                                    Doctor
                                                                </th>

                                                                <th className="px-5 py-3 text-base font-bold uppercase tracking-[0.08em] text-[#DDF4F1]">
                                                                    Date & Time
                                                                </th>

                                                                <th className="px-5 py-3 text-base font-bold uppercase tracking-[0.08em] text-[#DDF4F1]">
                                                                    Reason
                                                                </th>

                                                                <th className="px-5 py-3 text-base font-bold uppercase tracking-[0.08em] text-[#DDF4F1]">
                                                                    Status
                                                                </th>

                                                                <th className="px-5 py-3 text-base font-bold uppercase tracking-[0.08em] text-[#DDF4F1]">
                                                                    Actions
                                                                </th>
                                                            </tr>
                                                        </thead>

                                                        <tbody>
                                                            {appointments.map(
                                                                (
                                                                    appointment
                                                                ) => {
                                                                    const isSelected =
                                                                        selectedAppointment?._id ===
                                                                        appointment._id;

                                                                    return (
                                                                        <tr
                                                                            key={
                                                                                appointment._id
                                                                            }
                                                                            onClick={() =>
                                                                                setSelectedAppointment(
                                                                                    appointment
                                                                                )
                                                                            }
                                                                            className={`border-b border-[#EDF2F1] last:border-b-0 cursor-pointer transition-colors ${isSelected
                                                                                    ? "bg-[#E1F3F0]/60"
                                                                                    : "hover:bg-[#F7FBFA]"
                                                                                }`}
                                                                        >
                                                                            {/* PATIENT */}
                                                                            <td className="px-5 py-4">
                                                                                <div className="flex items-center gap-3">
                                                                                    <div
                                                                                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-base font-bold shrink-0 ${isSelected
                                                                                                ? "bg-[#164B4D] text-white"
                                                                                                : "bg-[#E1F3F0] text-[#164B4D]"
                                                                                            }`}
                                                                                    >
                                                                                        {getInitials(
                                                                                            appointment
                                                                                                .patient
                                                                                                ?.name
                                                                                        )}
                                                                                    </div>

                                                                                    <div className="min-w-0">
                                                                                        <p className="font-bold text-base text-[#0A1F1C] leading-snug">
                                                                                            {appointment
                                                                                                .patient
                                                                                                ?.name ||
                                                                                                "Unknown"}
                                                                                        </p>

                                                                                        <p className="text-base text-[#718B87] mt-0.5 truncate max-w-[170px]">
                                                                                            {appointment
                                                                                                .patient
                                                                                                ?.email ||
                                                                                                "-"}
                                                                                        </p>
                                                                                    </div>
                                                                                </div>
                                                                            </td>

                                                                            {/* DOCTOR */}
                                                                            <td className="px-5 py-4">
                                                                                <p className="font-bold text-base text-[#0A1F1C] leading-snug">
                                                                                    {formatDoctorName(
                                                                                        appointment
                                                                                            .doctor
                                                                                            ?.user
                                                                                            ?.name
                                                                                    )}
                                                                                </p>

                                                                                <p className="text-base font-semibold text-[#2E8179] mt-0.5">
                                                                                    {appointment
                                                                                        .doctor
                                                                                        ?.specialization ||
                                                                                        "-"}
                                                                                </p>
                                                                            </td>

                                                                            {/* DATE */}
                                                                            <td className="px-5 py-4">
                                                                                <p className="text-base font-bold text-[#0A1F1C] whitespace-nowrap tabular-nums">
                                                                                    {formatTime(
                                                                                        appointment.date
                                                                                    )}
                                                                                </p>

                                                                                <p className="text-base text-[#718B87] mt-0.5 whitespace-nowrap">
                                                                                    {formatDate(
                                                                                        appointment.date
                                                                                    )}
                                                                                </p>
                                                                            </td>

                                                                            {/* REASON */}
                                                                            <td className="px-5 py-4">
                                                                                <p className="text-base text-[#37595A] max-w-[190px] truncate">
                                                                                    {appointment.reason ||
                                                                                        "Not specified"}
                                                                                </p>
                                                                            </td>

                                                                            {/* STATUS */}
                                                                            <td className="px-5 py-4">
                                                                                <span
                                                                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-base font-bold capitalize border ${getStatusStyle(
                                                                                        appointment.status
                                                                                    )}`}
                                                                                >
                                                                                    <span
                                                                                        className={`w-1.5 h-1.5 rounded-full ${getStatusDot(
                                                                                            appointment.status
                                                                                        )}`}
                                                                                    />

                                                                                    {
                                                                                        appointment.status
                                                                                    }
                                                                                </span>
                                                                            </td>

                                                                            {/* ACTIONS */}
                                                                            <td
                                                                                className="px-5 py-4"
                                                                                onClick={(
                                                                                    event
                                                                                ) =>
                                                                                    event.stopPropagation()
                                                                                }
                                                                            >
                                                                                <div className="flex items-center gap-2">
                                                                                    {appointment.status ===
                                                                                        "pending" && (
                                                                                            <>
                                                                                                <button
                                                                                                    onClick={() =>
                                                                                                        updateStatus(
                                                                                                            appointment._id,
                                                                                                            "confirmed"
                                                                                                        )
                                                                                                    }
                                                                                                    className="px-3 py-1.5 rounded-xl text-base font-bold bg-[#164B4D] text-white hover:bg-[#0F3437] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9ADBD3]"
                                                                                                >
                                                                                                    Confirm
                                                                                                </button>

                                                                                                <button
                                                                                                    onClick={() =>
                                                                                                        updateStatus(
                                                                                                            appointment._id,
                                                                                                            "cancelled"
                                                                                                        )
                                                                                                    }
                                                                                                    className="px-2.5 py-1.5 rounded-xl text-base font-bold text-[#A8441A] hover:bg-[#FDEEE6] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28B5B]/50"
                                                                                                >
                                                                                                    Cancel
                                                                                                </button>
                                                                                            </>
                                                                                        )}

                                                                                    {appointment.status ===
                                                                                        "confirmed" && (
                                                                                            <>
                                                                                                <button
                                                                                                    onClick={() =>
                                                                                                        updateStatus(
                                                                                                            appointment._id,
                                                                                                            "completed"
                                                                                                        )
                                                                                                    }
                                                                                                    className="px-3 py-1.5 rounded-xl text-base font-bold border border-[#B9D8D4] bg-white text-[#164B4D] hover:bg-[#164B4D] hover:text-white hover:border-[#164B4D] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9ADBD3]"
                                                                                                >
                                                                                                    Complete
                                                                                                </button>

                                                                                                <button
                                                                                                    onClick={() =>
                                                                                                        updateStatus(
                                                                                                            appointment._id,
                                                                                                            "cancelled"
                                                                                                        )
                                                                                                    }
                                                                                                    className="px-2.5 py-1.5 rounded-xl text-base font-bold text-[#A8441A] hover:bg-[#FDEEE6] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28B5B]/50"
                                                                                                >
                                                                                                    Cancel
                                                                                                </button>
                                                                                            </>
                                                                                        )}

                                                                                    {appointment.status ===
                                                                                        "completed" && (
                                                                                            <span className="inline-flex items-center gap-1.5 text-base font-semibold text-[#5E7B77]">
                                                                                                <span className="w-1.5 h-1.5 rounded-full bg-[#2E9C8F]" />
                                                                                                Completed
                                                                                            </span>
                                                                                        )}

                                                                                    {appointment.status ===
                                                                                        "cancelled" && (
                                                                                            <span className="inline-flex items-center gap-1.5 text-base font-semibold text-[#8A9D99]">
                                                                                                <span className="w-1.5 h-1.5 rounded-full bg-[#A9BCB8]" />
                                                                                                No actions
                                                                                            </span>
                                                                                        )}
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                    );
                                                                }
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>

                                                {/* TABLE FOOTER */}
                                                <div className="px-5 sm:px-6 py-3.5 border-t border-[#E7EFED] bg-[#FAFCFB] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                                    <p className="text-base text-[#718B87]">
                                                        Showing{" "}
                                                        <span className="font-bold text-[#164B4D]">
                                                            {appointments.length}
                                                        </span>{" "}
                                                        appointment
                                                        {appointments.length !==
                                                            1
                                                            ? "s"
                                                            : ""}
                                                    </p>

                                                    <div className="flex items-center gap-4 text-base">
                                                        <span className="flex items-center gap-1.5 text-[#718B87]">
                                                            <span className="w-2 h-2 rounded-full bg-[#F28B5B]" />
                                                            Pending:{" "}
                                                            {
                                                                pendingAppointments
                                                            }
                                                        </span>

                                                        <span className="flex items-center gap-1.5 text-[#718B87]">
                                                            <span className="w-2 h-2 rounded-full bg-[#2E9C8F]" />
                                                            Confirmed:{" "}
                                                            {
                                                                confirmedAppointments
                                                            }
                                                        </span>

                                                        <span className="hidden sm:flex items-center gap-1.5 text-[#718B87]">
                                                            <span className="w-2 h-2 rounded-full bg-[#164B4D]" />
                                                            Completed:{" "}
                                                            {
                                                                completedAppointments
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* RIGHT — APPOINTMENT DETAILS */}
                                        <div className="col-span-12 xl:col-span-4">
                                            <div className="xl:sticky xl:top-20 bg-white rounded-2xl border border-[#DCEAE7] shadow-[0_12px_35px_-20px_rgba(22,75,77,0.4)] overflow-hidden">

                                                {/* PANEL HEADER */}
                                                <div className="px-5 py-4 bg-[#164B4D] text-white flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <svg
                                                            className="w-5 h-5 text-[#9ADBD3]"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="1.8"
                                                        >
                                                            <rect
                                                                x="4"
                                                                y="3"
                                                                width="16"
                                                                height="18"
                                                                rx="2"
                                                            />

                                                            <path d="M8 8h8M8 12h8M8 16h5" />
                                                        </svg>

                                                        <span className="md-display text-lg font-semibold">
                                                            Appointment Details
                                                        </span>
                                                    </div>

                                                    <span className="px-2 py-0.5 rounded-full bg-[#ADEFE7] text-[#164B4D] text-base font-bold uppercase tracking-wide">
                                                        Selected
                                                    </span>
                                                </div>

                                                {selectedAppointment ? (
                                                    <div className="p-5 flex flex-col gap-4">

                                                        {/* PATIENT SUMMARY */}
                                                        <div className="p-3.5 bg-[#F2F8F6] rounded-xl flex items-center justify-between gap-3">
                                                            <div className="flex items-center gap-3 min-w-0">
                                                                <div className="w-12 h-12 rounded-full bg-[#164B4D] text-white flex items-center justify-center text-base font-bold shrink-0 shadow-sm">
                                                                    {getInitials(
                                                                        selectedAppointment
                                                                            .patient
                                                                            ?.name
                                                                    )}
                                                                </div>

                                                                <div className="min-w-0">
                                                                    <span className="md-display text-lg font-semibold text-[#0A1F1C] block truncate">
                                                                        {selectedAppointment
                                                                            .patient
                                                                            ?.name ||
                                                                            "Unknown"}
                                                                    </span>

                                                                    <span className="text-base text-[#718B87] block truncate mt-0.5">
                                                                        {selectedAppointment
                                                                            .patient
                                                                            ?.email ||
                                                                            "No email available"}
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            <span className="text-base font-bold px-2 py-1 rounded-md bg-[#E7EFED] text-[#164B4D] shrink-0">
                                                                PATIENT
                                                            </span>
                                                        </div>

                                                        {/* DOCTOR / SPECIALIZATION */}
                                                        <div className="grid grid-cols-2 gap-2">
                                                            <div className="p-3 bg-[#F2F8F6] rounded-xl">
                                                                <span className="block text-base font-bold uppercase tracking-wider text-[#667876]">
                                                                    Attending Doctor
                                                                </span>

                                                                <span className="block text-base font-bold text-[#164B4D] mt-1.5">
                                                                    {formatDoctorName(
                                                                        selectedAppointment
                                                                            .doctor
                                                                            ?.user
                                                                            ?.name
                                                                    )}
                                                                </span>

                                                                <span className="block text-base text-[#2E8179] mt-0.5">
                                                                    {selectedAppointment
                                                                        .doctor
                                                                        ?.specialization ||
                                                                        "-"}
                                                                </span>
                                                            </div>

                                                            <div className="p-3 bg-[#F2F8F6] rounded-xl">
                                                                <span className="block text-base font-bold uppercase tracking-wider text-[#667876]">
                                                                    Appointment Type
                                                                </span>

                                                                <span className="block text-base font-bold text-[#164B4D] mt-1.5">
                                                                    Consultation
                                                                </span>

                                                                <span className="block text-base text-[#667876] mt-0.5">
                                                                    Hospital Visit
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* SESSION WINDOW */}
                                                        <div className="p-3.5 bg-white border border-[#E7EFED] rounded-xl shadow-sm">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <span className="text-base font-bold uppercase tracking-wider text-[#667876]">
                                                                    Session Window
                                                                </span>

                                                                <span
                                                                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-base font-bold capitalize border ${getStatusStyle(
                                                                        selectedAppointment.status
                                                                    )}`}
                                                                >
                                                                    <span
                                                                        className={`w-1.5 h-1.5 rounded-full ${getStatusDot(
                                                                            selectedAppointment.status
                                                                        )}`}
                                                                    />

                                                                    {
                                                                        selectedAppointment.status
                                                                    }
                                                                </span>
                                                            </div>

                                                            <div className="flex items-baseline justify-between gap-3">
                                                                <div>
                                                                    <span className="md-display text-[26px] font-semibold text-[#164B4D]">
                                                                        {formatTime(
                                                                            selectedAppointment.date
                                                                        )}
                                                                    </span>

                                                                    <span className="block text-base text-[#718B87] mt-0.5">
                                                                        {formatDate(
                                                                            selectedAppointment.date
                                                                        )}
                                                                    </span>
                                                                </div>

                                                                <div className="w-9 h-9 rounded-xl bg-[#E1F3F0] text-[#256862] flex items-center justify-center">
                                                                    <svg
                                                                        className="w-4 h-4"
                                                                        viewBox="0 0 24 24"
                                                                        fill="none"
                                                                        stroke="currentColor"
                                                                        strokeWidth="1.8"
                                                                    >
                                                                        <circle
                                                                            cx="12"
                                                                            cy="12"
                                                                            r="9"
                                                                        />

                                                                        <path d="M12 7v5l3 2" />
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* REASON */}
                                                        <div>
                                                            <span className="block text-base font-bold uppercase tracking-wider text-[#667876] mb-1.5">
                                                                Reason for Visit
                                                            </span>

                                                            <div className="p-3.5 bg-[#F2F8F6] rounded-xl text-base leading-relaxed text-[#37595A]">
                                                                {selectedAppointment.reason ||
                                                                    "No reason was specified for this appointment."}
                                                            </div>
                                                        </div>

                                                        {/* OPERATIONAL SIGNAL */}
                                                        <div className="p-3.5 bg-[#E1F3F0]/55 rounded-xl">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <div className="w-8 h-8 rounded-xl bg-[#ADEFE7] text-[#164B4D] flex items-center justify-center">
                                                                    <svg
                                                                        className="w-4 h-4"
                                                                        viewBox="0 0 24 24"
                                                                        fill="none"
                                                                        stroke="currentColor"
                                                                        strokeWidth="1.8"
                                                                    >
                                                                        <path d="M12 3v18M3 12h18" />

                                                                        <circle
                                                                            cx="12"
                                                                            cy="12"
                                                                            r="8"
                                                                        />
                                                                    </svg>
                                                                </div>

                                                                <div>
                                                                    <span className="block text-base font-bold uppercase tracking-wider text-[#164B4D]">
                                                                        Appointment
                                                                        Signal
                                                                    </span>

                                                                    <span className="block text-base text-[#526563] mt-0.5">
                                                                        Current registry
                                                                        status
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center justify-between">
                                                                <span className="text-base font-semibold text-[#37595A]">
                                                                    {selectedAppointment.status ===
                                                                        "confirmed"
                                                                        ? "Ready for patient check-in"
                                                                        : selectedAppointment.status ===
                                                                            "pending"
                                                                            ? "Awaiting confirmation"
                                                                            : selectedAppointment.status ===
                                                                                "completed"
                                                                                ? "Session completed"
                                                                                : "Appointment slot cancelled"}
                                                                </span>

                                                                <span
                                                                    className={`w-2.5 h-2.5 rounded-full ${getStatusDot(
                                                                        selectedAppointment.status
                                                                    )}`}
                                                                />
                                                            </div>
                                                        </div>

                                                        {/* ACTIONS */}
                                                        <div className="flex flex-col gap-2 pt-1">
                                                            {selectedAppointment.status ===
                                                                "pending" && (
                                                                    <>
                                                                        <button
                                                                            onClick={() =>
                                                                                updateStatus(
                                                                                    selectedAppointment._id,
                                                                                    "confirmed"
                                                                                )
                                                                            }
                                                                            className="w-full py-2.5 px-4 rounded-xl bg-[#164B4D] hover:bg-[#0F3437] text-white text-base font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
                                                                        >
                                                                            <svg
                                                                                className="w-4 h-4"
                                                                                viewBox="0 0 24 24"
                                                                                fill="none"
                                                                                stroke="currentColor"
                                                                                strokeWidth="1.8"
                                                                            >
                                                                                <path d="m5 12 4 4L19 6" />
                                                                            </svg>

                                                                            Confirm
                                                                            Appointment
                                                                        </button>

                                                                        <button
                                                                            onClick={() =>
                                                                                updateStatus(
                                                                                    selectedAppointment._id,
                                                                                    "cancelled"
                                                                                )
                                                                            }
                                                                            className="w-full py-2.5 px-4 rounded-xl bg-[#FDEEE6] hover:bg-[#F9E1D4] text-[#A8441A] text-base font-bold flex items-center justify-center gap-2 transition-all"
                                                                        >
                                                                            Cancel
                                                                            Appointment
                                                                        </button>
                                                                    </>
                                                                )}

                                                            {selectedAppointment.status ===
                                                                "confirmed" && (
                                                                    <>
                                                                        <button
                                                                            onClick={() =>
                                                                                updateStatus(
                                                                                    selectedAppointment._id,
                                                                                    "completed"
                                                                                )
                                                                            }
                                                                            className="w-full py-2.5 px-4 rounded-xl bg-[#164B4D] hover:bg-[#0F3437] text-white text-base font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
                                                                        >
                                                                            <svg
                                                                                className="w-4 h-4"
                                                                                viewBox="0 0 24 24"
                                                                                fill="none"
                                                                                stroke="currentColor"
                                                                                strokeWidth="1.8"
                                                                            >
                                                                                <path d="m5 12 4 4L19 6" />
                                                                            </svg>

                                                                            Mark as
                                                                            Completed
                                                                        </button>

                                                                        <button
                                                                            onClick={() =>
                                                                                updateStatus(
                                                                                    selectedAppointment._id,
                                                                                    "cancelled"
                                                                                )
                                                                            }
                                                                            className="w-full py-2.5 px-4 rounded-xl bg-[#FDEEE6] hover:bg-[#F9E1D4] text-[#A8441A] text-base font-bold flex items-center justify-center gap-2 transition-all"
                                                                        >
                                                                            Cancel
                                                                            Appointment
                                                                        </button>
                                                                    </>
                                                                )}

                                                            {selectedAppointment.status ===
                                                                "completed" && (
                                                                    <div className="w-full py-2.5 rounded-xl bg-[#E1F3F0] text-[#164B4D] text-base font-bold flex items-center justify-center gap-2">
                                                                        <span className="w-2 h-2 rounded-full bg-[#2E9C8F]" />

                                                                        Appointment
                                                                        Completed
                                                                    </div>
                                                                )}

                                                            {selectedAppointment.status ===
                                                                "cancelled" && (
                                                                    <div className="w-full py-2.5 rounded-xl bg-[#F1F4F3] text-[#718B87] text-base font-bold flex items-center justify-center gap-2">
                                                                        <span className="w-2 h-2 rounded-full bg-[#A9BCB8]" />

                                                                        Appointment
                                                                        Cancelled
                                                                    </div>
                                                                )}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="p-10 text-center">
                                                        <div className="w-12 h-12 mx-auto rounded-xl bg-[#E7EFED] text-[#164B4D] flex items-center justify-center mb-3">
                                                            <svg
                                                                className="w-6 h-6"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="1.7"
                                                            >
                                                                <rect
                                                                    x="4"
                                                                    y="5"
                                                                    width="16"
                                                                    height="15"
                                                                    rx="2"
                                                                />

                                                                <path d="M4 10h16M9 3v4M15 3v4" />
                                                            </svg>
                                                        </div>

                                                        <p className="text-base font-semibold text-[#164B4D]">
                                                            Select an appointment
                                                        </p>

                                                        <p className="text-base text-[#718B87] mt-1">
                                                            Choose a record to
                                                            inspect its details.
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* SMART CAPACITY */}
                                            <div
                                                className={`${cardClass} mt-4 p-3.5 flex items-start gap-3`}
                                            >
                                                <div className="w-9 h-9 rounded-xl bg-[#ADEFE7] text-[#164B4D] flex items-center justify-center shrink-0">
                                                    <svg
                                                        className="w-4 h-4"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="1.8"
                                                    >
                                                        <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" />

                                                        <path d="M19 16l.7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16z" />
                                                    </svg>
                                                </div>

                                                <div>
                                                    <span className="block text-base font-bold uppercase tracking-wider text-[#164B4D]">
                                                        Smart Capacity Insight
                                                    </span>

                                                    <span className="block text-base text-[#667876] mt-1 leading-relaxed">
                                                        Appointment availability
                                                        and workload are derived
                                                        from the current hospital
                                                        registry.
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Appointments;