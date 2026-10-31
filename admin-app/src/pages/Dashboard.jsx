
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Doctors from "./Doctors";
import AddDoctor from "./AddDoctor";
import Patients from "./Patients";
import Appointments from "./Appointments";
import Departments from "./Departments";
import AddDepartment from "./AddDepartment";
import Services from "./Services";
import AddService from "./AddService";
import Settings from "./Settings";

import api from "../api";

const Dashboard = () => {
    const navigate = useNavigate();

    const [activePage, setActivePage] = useState("Dashboard");
    const [showAddDoctor, setShowAddDoctor] = useState(false);
    const [showAddDepartment, setShowAddDepartment] = useState(false);
    const [showAddService, setShowAddService] = useState(false);

    const [dashboardStats, setDashboardStats] = useState({
        totalDoctors: 0,
        totalPatients: 0,
        totalAppointments: 0,
        totalDepartments: 0,
        totalServices: 0,
    });

    const [statsLoading, setStatsLoading] = useState(true);
    const [recentAppointments, setRecentAppointments] = useState([]);
    const [appointmentsLoading, setAppointmentsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            const token = localStorage.getItem("adminToken");

            try {
                const statsResponse = await api.get("/dashboard/stats", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setDashboardStats(statsResponse.data.stats);
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setStatsLoading(false);
            }

            try {
                const recentResponse = await api.get(
                    "/dashboard/recent-appointments",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setRecentAppointments(
                    recentResponse.data.appointments
                );
            } catch (error) {
                console.error(
                    "Failed to fetch recent appointments",
                    error
                );
            } finally {
                setAppointmentsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const menuItems = [
        {
            name: "Dashboard",
            icon: "grid_view",
        },
        {
            name: "Doctors",
            icon: "stethoscope",
        },
        {
            name: "Patients",
            icon: "personal_injury",
        },
        {
            name: "Appointments",
            icon: "calendar_today",
        },
        {
            name: "Departments",
            icon: "apartment",
        },
        {
            name: "Services",
            icon: "medical_services",
        },
        {
            name: "Settings",
            icon: "settings",
        },
    ];

    const stats = [
        {
            title: "Total Active Doctors",
            value: dashboardStats.totalDoctors,
            icon: "stethoscope",
            extra: "Clinical staff",
        },
        {
            title: "Registered Patients",
            value: dashboardStats.totalPatients,
            icon: "personal_injury",
            extra: "Patient records",
        },
        {
            title: "Today's Appointments",
            value: dashboardStats.totalAppointments,
            icon: "calendar_clock",
            extra: "Scheduled visits",
        },
        {
            title: "Clinical Departments",
            value: dashboardStats.totalDepartments,
            icon: "apartment",
            extra: "Active departments",
        },
    ];

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
        window.location.href = "/";
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case "confirmed":
                return "bg-[#dff5ef] text-[#256862]";
            case "completed":
                return "bg-[#dcefed] text-[#164b4d]";
            case "cancelled":
                return "bg-[#ffe3dc] text-[#a53f16]";
            default:
                return "bg-[#fff0df] text-[#9a4a18]";
        }
    };

    const getInitials = (name = "") => {
        return name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
    };

    return (
        <div className="min-h-screen bg-[#e7f4f1] text-[#0a1f1c]">

            {/* Material Symbols */}
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..700&family=Manrope:wght@400..700&display=swap');
                    @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');

                    * {
                        scrollbar-width: none;
                    }

                    *::-webkit-scrollbar {
                        display: none;
                    }

                    .font-bricolage {
                        font-family: "Bricolage Grotesque", sans-serif;
                    }

                    .font-manrope {
                        font-family: "Manrope", sans-serif;
                    }

                    .material-symbols-outlined {
                        font-variation-settings:
                            "FILL" 0,
                            "wght" 500,
                            "GRAD" 0,
                            "opsz" 24;
                    }
                `}
            </style>

            <div className="flex min-h-screen">

                {/* ================= SIDEBAR ================= */}
                <aside className="fixed left-0 top-0 bottom-0 z-50 flex w-[270px] flex-col bg-[#164b4d] text-white shadow-[4px_0_20px_rgba(0,52,53,0.08)]">

                    {/* Logo */}
                    <div className="px-6 pt-7 pb-6">
                        <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#b9ecee] text-[#003435]">
                                <span className="material-symbols-outlined text-[23px]">
                                    health_and_safety
                                </span>
                            </div>

                            <div>
                                <h1 className="font-bricolage text-xl font-semibold tracking-tight">
                                    Medicare
                                </h1>

                                <p className="font-manrope mt-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#9dcfd1]">
                                    Healthcare Intelligence
                                </p>
                            </div>

                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto px-4 py-3">

                        {/* Overview */}
                        <div className="mb-7">

                            <p className="font-manrope mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-[#9dcfd1]/70">
                                Overview
                            </p>

                            <button
                                onClick={() => setActivePage("Dashboard")}
                                className={`font-manrope flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all ${
                                    activePage === "Dashboard"
                                        ? "bg-[#adefe7] font-bold text-[#00201d] shadow-sm"
                                        : "text-[#b9ecee] hover:bg-[#256862] hover:text-white"
                                }`}
                            >
                                <span className="material-symbols-outlined text-[20px]">
                                    grid_view
                                </span>

                                Dashboard
                            </button>

                        </div>

                        {/* Management */}
                        <div className="mb-7">

                            <p className="font-manrope mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-[#9dcfd1]/70">
                                Management
                            </p>

                            <div className="space-y-1">

                                {menuItems
                                    .filter(
                                        (item) =>
                                            item.name !== "Dashboard" &&
                                            item.name !== "Settings"
                                    )
                                    .map((item) => (
                                        <button
                                            key={item.name}
                                            onClick={() =>
                                                setActivePage(item.name)
                                            }
                                            className={`font-manrope flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all ${
                                                activePage === item.name
                                                    ? "bg-[#adefe7] font-bold text-[#00201d]"
                                                    : "text-[#b9ecee] hover:bg-[#256862] hover:text-white"
                                            }`}
                                        >
                                            <span className="material-symbols-outlined text-[20px]">
                                                {item.icon}
                                            </span>

                                            {item.name}
                                        </button>
                                    ))}
                            </div>
                        </div>

                        

                        {/* System */}
                        <div>

                            <p className="font-manrope mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-[#9dcfd1]/70">
                                System
                            </p>

                            <button
                                onClick={() => setActivePage("Settings")}
                                className={`font-manrope flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all ${
                                    activePage === "Settings"
                                        ? "bg-[#adefe7] font-bold text-[#00201d]"
                                        : "text-[#b9ecee] hover:bg-[#256862] hover:text-white"
                                }`}
                            >
                                <span className="material-symbols-outlined text-[20px]">
                                    settings
                                </span>

                                Settings
                            </button>

                        </div>

                    </nav>

                    {/* Admin profile */}
                    <div className="mx-4 mb-5 rounded-xl bg-[#003435]/45 p-4">

                        <div className="flex items-center gap-3">

                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#b9ecee] font-bricolage font-bold text-[#003435]">
                                A
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="font-manrope truncate text-sm font-semibold">
                                    Admin
                                </p>

                                <p className="font-manrope truncate text-[11px] text-[#9dcfd1]">
                                    Hospital Administrator
                                </p>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="text-[#9dcfd1] transition hover:text-white"
                            >
                                <span className="material-symbols-outlined text-[19px]">
                                    logout
                                </span>
                            </button>

                        </div>

                    </div>

                </aside>

                {/* ================= MAIN ================= */}
                <main className="ml-[270px] min-h-screen flex-1">

                    {/* Header */}
                    <header className="sticky top-0 z-40 flex h-[82px] items-center justify-between border-b border-[#c7ddd9] bg-[#f8fffd]/90 px-8 backdrop-blur-xl">

                        <div>
                            <h2 className="font-bricolage text-[25px] font-semibold tracking-tight text-[#164b4d]">
                                {activePage === "Dashboard"
                                    ? "Good morning, Admin"
                                    : activePage}
                            </h2>

                            <p className="font-manrope mt-1 text-xs text-[#526563]">
                                {activePage === "Dashboard"
                                    ? "Here's what's happening across Medicare today."
                                    : `Manage your Medicare ${activePage.toLowerCase()} here.`}
                            </p>
                        </div>

                        <div className="flex items-center gap-5">

                            {/* Search */}
                            <div className="relative hidden xl:block">

                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[19px] text-[#667876]">
                                    search
                                </span>

                                <input
                                    type="text"
                                    placeholder="Search patients, doctors, records..."
                                    className="font-manrope w-[290px] rounded-xl bg-[#e4f2ef] py-2.5 pl-10 pr-4 text-xs text-[#0a1f1c] outline-none transition focus:bg-white focus:ring-2 focus:ring-[#9dcfd1]"
                                />

                            </div>

                            {/* Notification */}
                            <button className="relative rounded-full p-2 text-[#526563] transition hover:bg-[#e1f0ed]">
                                <span className="material-symbols-outlined text-[22px]">
                                    notifications
                                </span>

                                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#ff9665] ring-2 ring-[#f8fffd]" />
                            </button>

                            {/* Profile */}
                            <button
                                onClick={() => navigate("/admin-profile")}
                                className="flex items-center gap-2"
                            >
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#164b4d] font-bricolage font-bold text-white">
                                    A
                                </div>

                                <div className="hidden text-left md:block">
                                    <p className="font-manrope text-xs font-bold text-[#0a1f1c]">
                                        Admin
                                    </p>

                                    <p className="font-manrope text-[10px] text-[#667876]">
                                        Administrator
                                    </p>
                                </div>

                                <span className="material-symbols-outlined text-[18px] text-[#667876]">
                                    expand_more
                                </span>
                            </button>

                        </div>

                    </header>

                    {/* ================= PAGE CONTENT ================= */}
                    <div className="p-6 xl:p-8">

                        {activePage === "Dashboard" && (
                            <div className="mx-auto max-w-[1450px] space-y-6">

                                {/* Operational status */}
                                <div className="flex flex-col justify-between gap-4 rounded-2xl bg-white p-5 shadow-[0_2px_12px_rgba(0,52,53,0.04)] lg:flex-row lg:items-center">

                                    <div className="flex items-center gap-3">

                                        <span className="relative flex h-2.5 w-2.5">
                                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#256862] opacity-60" />
                                            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#256862]" />
                                        </span>

                                        <div>
                                            <h3 className="font-bricolage text-base font-semibold text-[#164b4d]">
                                                Live Clinical Operations Grid
                                            </h3>

                                            <p className="font-manrope text-[11px] text-[#667876]">
                                                Medicare hospital operations • Real-time dashboard synchronized
                                            </p>
                                        </div>

                                    </div>

                                    <div className="flex flex-wrap items-center gap-2">

                                        <span className="font-manrope flex items-center gap-1.5 rounded-lg bg-[#e4f2ef] px-3 py-1.5 text-[10px] font-bold text-[#164b4d]">
                                            <span className="material-symbols-outlined text-[15px]">
                                                sensors
                                            </span>
                                            System Active
                                        </span>

                                        <span className="font-manrope flex items-center gap-1.5 rounded-lg bg-[#edf6f4] px-3 py-1.5 text-[10px] font-bold text-[#164b4d]">
                                            <span className="material-symbols-outlined text-[15px]">
                                                update
                                            </span>
                                            Live Data
                                        </span>

                                        <button className="font-manrope flex items-center gap-1.5 rounded-lg bg-[#164b4d] px-3.5 py-2 text-[10px] font-bold text-white transition hover:bg-[#003435]">
                                            <span className="material-symbols-outlined text-[17px]">
                                                file_download
                                            </span>
                                            Export Report
                                        </button>

                                    </div>

                                </div>

                                {/* Stats */}
                                <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

                                    {stats.map((stat, index) => (
                                        <div
                                            key={stat.title}
                                            className="group relative overflow-hidden rounded-2xl bg-white p-5 shadow-[0_2px_12px_rgba(0,52,53,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(0,52,53,0.08)]"
                                        >

                                            {index === 1 && (
                                                <div className="absolute left-0 top-0 h-full w-1 bg-[#164b4d]" />
                                            )}

                                            <div className="flex items-start justify-between">

                                                <div>

                                                    <p className="font-manrope text-[10px] font-bold uppercase tracking-[0.12em] text-[#667876]">
                                                        {stat.title}
                                                    </p>

                                                    <div className="mt-2 flex items-baseline gap-2">

                                                        <span className="font-bricolage text-[35px] font-bold tracking-tight text-[#164b4d]">
                                                            {statsLoading ? "..." : stat.value}
                                                        </span>

                                                        <span className="font-manrope rounded-md bg-[#dff5ef] px-2 py-0.5 text-[9px] font-bold text-[#256862]">
                                                            Active
                                                        </span>

                                                    </div>

                                                </div>

                                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e1f0ed] text-[#164b4d] transition group-hover:scale-105">
                                                    <span className="material-symbols-outlined text-[23px]">
                                                        {stat.icon}
                                                    </span>
                                                </div>

                                            </div>

                                            <div className="mt-4 flex items-center justify-between border-t border-[#edf2f1] pt-3">

                                                <span className="font-manrope flex items-center gap-1.5 text-[10px] font-medium text-[#526563]">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-[#256862]" />
                                                    {stat.extra}
                                                </span>

                                                <span className="font-manrope text-[9px] font-bold uppercase tracking-wider text-[#8a9a98]">
                                                    Medicare
                                                </span>

                                            </div>

                                        </div>
                                    ))}

                                </section>

                                {/* Main dashboard grid */}
                                <section className="grid grid-cols-1 gap-5 xl:grid-cols-12">

                                    {/* Appointments */}
                                    <div className="overflow-hidden rounded-2xl bg-white shadow-[0_2px_12px_rgba(0,52,53,0.04)] xl:col-span-8">

                                        <div className="flex flex-col justify-between gap-3 border-b border-[#edf2f1] p-5 sm:flex-row sm:items-center">

                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-bricolage text-xl font-semibold text-[#164b4d]">
                                                        Recent Appointments
                                                    </h3>

                                                    <span className="font-manrope rounded bg-[#e4f2ef] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#256862]">
                                                        Live
                                                    </span>
                                                </div>

                                                <p className="font-manrope mt-1 text-[11px] text-[#667876]">
                                                    Latest appointments booked in the hospital
                                                </p>
                                            </div>

                                            <button
                                                onClick={() =>
                                                    setActivePage("Appointments")
                                                }
                                                className="font-manrope flex items-center gap-1 text-xs font-bold text-[#256862] transition hover:text-[#003435]"
                                            >
                                                View All
                                                <span className="material-symbols-outlined text-[16px]">
                                                    arrow_forward
                                                </span>
                                            </button>

                                        </div>

                                        {appointmentsLoading ? (
                                            <div className="p-10 text-center">
                                                <div className="mx-auto mb-3 h-7 w-7 animate-spin rounded-full border-2 border-[#c5ddda] border-t-[#164b4d]" />
                                                <p className="font-manrope text-xs text-[#667876]">
                                                    Loading appointments...
                                                </p>
                                            </div>
                                        ) : recentAppointments.length === 0 ? (
                                            <div className="p-10 text-center">
                                                <span className="material-symbols-outlined text-4xl text-[#9db5b1]">
                                                    event_busy
                                                </span>

                                                <p className="font-manrope mt-2 text-sm font-semibold text-[#526563]">
                                                    No appointments found
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="overflow-x-auto">

                                                <table className="w-full min-w-[680px]">

                                                    <thead>
                                                        <tr className="bg-[#f2f8f6] text-left">

                                                            <th className="font-manrope px-5 py-3 text-[9px] font-bold uppercase tracking-[0.1em] text-[#667876]">
                                                                Patient
                                                            </th>

                                                            <th className="font-manrope px-5 py-3 text-[9px] font-bold uppercase tracking-[0.1em] text-[#667876]">
                                                                Doctor
                                                            </th>

                                                            <th className="font-manrope px-5 py-3 text-[9px] font-bold uppercase tracking-[0.1em] text-[#667876]">
                                                                Schedule
                                                            </th>

                                                            <th className="font-manrope px-5 py-3 text-[9px] font-bold uppercase tracking-[0.1em] text-[#667876]">
                                                                Status
                                                            </th>

                                                        </tr>
                                                    </thead>

                                                    <tbody className="divide-y divide-[#edf2f1]">

                                                        {recentAppointments.map(
                                                            (appointment) => (
                                                                <tr
                                                                    key={appointment._id}
                                                                    className="transition hover:bg-[#f7fbfa]"
                                                                >

                                                                    {/* Patient */}
                                                                    <td className="px-5 py-4">

                                                                        <div className="flex items-center gap-3">

                                                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#dff5ef] font-bricolage text-[10px] font-bold text-[#164b4d]">
                                                                                {getInitials(
                                                                                    appointment.patient?.name ||
                                                                                        "Unknown"
                                                                                )}
                                                                            </div>

                                                                            <div className="min-w-0">

                                                                                <p className="font-manrope truncate text-xs font-bold text-[#0a1f1c]">
                                                                                    {appointment.patient?.name ||
                                                                                        "Unknown"}
                                                                                </p>

                                                                                <p className="font-manrope truncate text-[10px] text-[#7a8987]">
                                                                                    {appointment.patient?.email ||
                                                                                        "-"}
                                                                                </p>

                                                                            </div>

                                                                        </div>

                                                                    </td>

                                                                    {/* Doctor */}
                                                                    <td className="px-5 py-4">

                                                                        <p className="font-manrope text-xs font-semibold text-[#0a1f1c]">
                                                                            Dr.{" "}
                                                                            {appointment.doctor?.user?.name ||
                                                                                "Unknown"}
                                                                        </p>

                                                                        <p className="font-manrope mt-0.5 text-[10px] text-[#7a8987]">
                                                                            {appointment.doctor?.specialization ||
                                                                                "-"}
                                                                        </p>

                                                                    </td>

                                                                    {/* Date */}
                                                                    <td className="px-5 py-4">

                                                                        <p className="font-manrope text-xs font-medium text-[#0a1f1c]">
                                                                            {new Date(
                                                                                appointment.date
                                                                            ).toLocaleDateString()}
                                                                        </p>

                                                                        <p className="font-manrope mt-0.5 text-[10px] text-[#256862]">
                                                                            {new Date(
                                                                                appointment.date
                                                                            ).toLocaleTimeString(
                                                                                [],
                                                                                {
                                                                                    hour: "2-digit",
                                                                                    minute: "2-digit",
                                                                                }
                                                                            )}
                                                                        </p>

                                                                    </td>

                                                                    {/* Status */}
                                                                    <td className="px-5 py-4">

                                                                        <span
                                                                            className={`font-manrope inline-flex rounded-md px-2 py-1 text-[9px] font-bold capitalize ${getStatusStyle(
                                                                                appointment.status
                                                                            )}`}
                                                                        >
                                                                            {appointment.status}
                                                                        </span>

                                                                    </td>

                                                                </tr>
                                                            )
                                                        )}

                                                    </tbody>

                                                </table>

                                            </div>
                                        )}

                                        <div className="flex items-center justify-between border-t border-[#edf2f1] px-5 py-3">

                                            <span className="font-manrope text-[10px] text-[#7a8987]">
                                                Showing {recentAppointments.length} recent appointments
                                            </span>

                                            <button
                                                onClick={() =>
                                                    setActivePage("Appointments")
                                                }
                                                className="font-manrope rounded-lg bg-[#e4f2ef] px-3 py-1.5 text-[10px] font-bold text-[#164b4d] transition hover:bg-[#d6eae6]"
                                            >
                                                Manage Appointments
                                            </button>

                                        </div>

                                    </div>

                                    {/* Clinical overview */}
                                    <div className="rounded-2xl bg-white p-5 shadow-[0_2px_12px_rgba(0,52,53,0.04)] xl:col-span-4">

                                        <div className="flex items-start justify-between">

                                            <div>
                                                <h3 className="font-bricolage text-xl font-semibold text-[#164b4d]">
                                                    Clinical Overview
                                                </h3>

                                                <p className="font-manrope mt-1 text-[11px] text-[#667876]">
                                                    Current Medicare operations
                                                </p>
                                            </div>

                                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e1f0ed] text-[#164b4d]">
                                                <span className="material-symbols-outlined text-[19px]">
                                                    monitoring
                                                </span>
                                            </div>

                                        </div>

                                        <div className="mt-5 space-y-4">

                                            {/* Departments */}
                                            <div className="rounded-xl bg-[#f2f8f6] p-4">

                                                <div className="flex items-center justify-between">

                                                    <div className="flex items-center gap-3">

                                                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#dcefed] text-[#164b4d]">
                                                            <span className="material-symbols-outlined text-[19px]">
                                                                apartment
                                                            </span>
                                                        </div>

                                                        <div>
                                                            <p className="font-manrope text-xs font-bold text-[#164b4d]">
                                                                Departments
                                                            </p>

                                                            <p className="font-manrope text-[10px] text-[#7a8987]">
                                                                Active clinical units
                                                            </p>
                                                        </div>

                                                    </div>

                                                    <span className="font-bricolage text-xl font-bold text-[#164b4d]">
                                                        {statsLoading
                                                            ? "..."
                                                            : dashboardStats.totalDepartments}
                                                    </span>

                                                </div>

                                            </div>

                                            {/* Doctors */}
                                            <div className="rounded-xl bg-[#f2f8f6] p-4">

                                                <div className="flex items-center justify-between">

                                                    <div className="flex items-center gap-3">

                                                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#dcefed] text-[#164b4d]">
                                                            <span className="material-symbols-outlined text-[19px]">
                                                                stethoscope
                                                            </span>
                                                        </div>

                                                        <div>
                                                            <p className="font-manrope text-xs font-bold text-[#164b4d]">
                                                                Medical Staff
                                                            </p>

                                                            <p className="font-manrope text-[10px] text-[#7a8987]">
                                                                Registered doctors
                                                            </p>
                                                        </div>

                                                    </div>

                                                    <span className="font-bricolage text-xl font-bold text-[#164b4d]">
                                                        {statsLoading
                                                            ? "..."
                                                            : dashboardStats.totalDoctors}
                                                    </span>

                                                </div>

                                            </div>

                                            {/* Patients */}
                                            <div className="rounded-xl bg-[#f2f8f6] p-4">

                                                <div className="flex items-center justify-between">

                                                    <div className="flex items-center gap-3">

                                                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#dcefed] text-[#164b4d]">
                                                            <span className="material-symbols-outlined text-[19px]">
                                                                personal_injury
                                                            </span>
                                                        </div>

                                                        <div>
                                                            <p className="font-manrope text-xs font-bold text-[#164b4d]">
                                                                Patients
                                                            </p>

                                                            <p className="font-manrope text-[10px] text-[#7a8987]">
                                                                Registered records
                                                            </p>
                                                        </div>

                                                    </div>

                                                    <span className="font-bricolage text-xl font-bold text-[#164b4d]">
                                                        {statsLoading
                                                            ? "..."
                                                            : dashboardStats.totalPatients}
                                                    </span>

                                                </div>

                                            </div>

                                        </div>

                                        {/* AI banner */}
                                        <div className="mt-4 overflow-hidden rounded-xl bg-[#164b4d] p-4">

                                            <div className="flex items-start gap-3">

                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#adefe7] text-[#164b4d]">
                                                    <span className="material-symbols-outlined text-[19px]">
                                                        psychology
                                                    </span>
                                                </div>

                                                <div>

                                                    <p className="font-manrope text-xs font-bold text-white">
                                                        Medicare AI
                                                    </p>

                                                    <p className="font-manrope mt-1 text-[10px] leading-4 text-[#b9ecee]">
                                                        AI health modules are ready for clinical analysis.
                                                    </p>

                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                </section>

                                {/* AI Health section */}
                                <section className="relative overflow-hidden rounded-2xl bg-[#003435] p-6 shadow-[0_8px_30px_rgba(0,52,53,0.14)]">

                                    <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#164b4d] blur-3xl" />
                                    <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-[#256862]/50 blur-3xl" />

                                    <div className="relative">

                                        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">

                                            <div>

                                                <div className="flex items-center gap-2">

                                                    <span className="font-manrope rounded bg-[#adefe7] px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-[#00201d]">
                                                        AI Module
                                                    </span>

                                                    <span className="font-manrope text-[9px] font-semibold uppercase tracking-wider text-[#9dcfd1]">
                                                        Medicare Intelligence
                                                    </span>

                                                </div>

                                                <h2 className="font-bricolage mt-2 text-2xl font-bold tracking-tight text-white">
                                                    AI Health Insights
                                                </h2>

                                                <p className="font-manrope mt-1 max-w-2xl text-xs text-[#9dcfd1]">
                                                    Intelligent predictive tools for clinical screening and patient risk analysis.
                                                </p>

                                            </div>

                                            <button className="font-manrope flex items-center gap-2 self-start rounded-lg bg-[#ff7f4d] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#e96d3d]">

                                                <span className="material-symbols-outlined text-[18px]">
                                                    bolt
                                                </span>

                                                Open AI Centre

                                            </button>

                                        </div>

                                        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">

                                            {/* Diabetes */}
                                            <div className="rounded-xl bg-[#164b4d]/80 p-4">

                                                <div className="flex items-center justify-between">

                                                    <span className="font-manrope text-[9px] font-bold uppercase tracking-wider text-[#9dcfd1]">
                                                        Metabolic Screening
                                                    </span>

                                                    <span className="material-symbols-outlined text-[#9dcfd1] text-[20px]">
                                                        vital_signs
                                                    </span>

                                                </div>

                                                <div className="mt-3 flex items-baseline gap-2">

                                                    <span className="font-bricolage text-3xl font-bold text-white">
                                                        —
                                                    </span>

                                                    <span className="font-manrope text-[10px] text-[#9dcfd1]">
                                                        assessments
                                                    </span>

                                                </div>

                                                <p className="font-manrope mt-1 text-[10px] text-[#b9ecee]">
                                                    Diabetes prediction module
                                                </p>

                                                <button className="font-manrope mt-4 flex items-center gap-1 text-[10px] font-bold text-[#adefe7]">
                                                    Open module
                                                    <span className="material-symbols-outlined text-[14px]">
                                                        arrow_forward
                                                    </span>
                                                </button>

                                            </div>

                                            {/* Kidney */}
                                            <div className="rounded-xl bg-[#164b4d]/80 p-4">

                                                <div className="flex items-center justify-between">

                                                    <span className="font-manrope text-[9px] font-bold uppercase tracking-wider text-[#9dcfd1]">
                                                        Nephrology Risk
                                                    </span>

                                                    <span className="material-symbols-outlined text-[#9dcfd1] text-[20px]">
                                                        nephrology
                                                    </span>

                                                </div>

                                                <div className="mt-3 flex items-baseline gap-2">

                                                    <span className="font-bricolage text-3xl font-bold text-white">
                                                        AI
                                                    </span>

                                                    <span className="font-manrope text-[10px] text-[#9dcfd1]">
                                                        powered
                                                    </span>

                                                </div>

                                                <p className="font-manrope mt-1 text-[10px] text-[#b9ecee]">
                                                    Kidney disease risk analysis
                                                </p>

                                                <button className="font-manrope mt-4 flex items-center gap-1 text-[10px] font-bold text-[#adefe7]">
                                                    Open module
                                                    <span className="material-symbols-outlined text-[14px]">
                                                        arrow_forward
                                                    </span>
                                                </button>

                                            </div>

                                            {/* Clinical alerts */}
                                            <div className="rounded-xl bg-[#164b4d]/90 p-4">

                                                <div className="flex items-center justify-between">

                                                    <span className="font-manrope text-[9px] font-bold uppercase tracking-wider text-[#ffb595]">
                                                        Clinical Intelligence
                                                    </span>

                                                    <span className="h-2 w-2 animate-pulse rounded-full bg-[#ff9665]" />

                                                </div>

                                                <div className="mt-3 flex items-baseline gap-2">

                                                    <span className="font-bricolage text-3xl font-bold text-[#ff9665]">
                                                        AI
                                                    </span>

                                                    <span className="font-manrope text-[10px] text-white">
                                                        ready
                                                    </span>

                                                </div>

                                                <p className="font-manrope mt-1 text-[10px] text-white/70">
                                                    Review available clinical prediction tools.
                                                </p>

                                                <button className="font-manrope mt-4 flex items-center gap-1 text-[10px] font-bold text-[#ffb595]">
                                                    Review AI tools
                                                    <span className="material-symbols-outlined text-[14px]">
                                                        arrow_forward
                                                    </span>
                                                </button>

                                            </div>

                                        </div>

                                        <div className="font-manrope mt-5 flex items-center justify-between border-t border-white/10 pt-3 text-[9px] text-[#7fa9a6]">

                                            <span className="flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-[14px] text-[#9dcfd1]">
                                                    verified_user
                                                </span>
                                                Medicare AI infrastructure
                                            </span>

                                            <span className="font-bold uppercase tracking-wider">
                                                System Status: Nominal
                                            </span>

                                        </div>

                                    </div>

                                </section>

                            </div>
                        )}

                        {/* ================= OTHER PAGES ================= */}

                        {activePage === "Doctors" && (
                            <>
                                {showAddDoctor ? (
                                    <AddDoctor
                                        onDoctorAdded={() => {
                                            setShowAddDoctor(false);
                                        }}
                                    />
                                ) : (
                                    <Doctors
                                        onAddDoctor={() => {
                                            setShowAddDoctor(true);
                                        }}
                                    />
                                )}
                            </>
                        )}

                        {activePage === "Patients" && <Patients />}

                        {activePage === "Appointments" && <Appointments />}

                        {activePage === "Departments" && (
                            <>
                                {showAddDepartment ? (
                                    <AddDepartment
                                        onDepartmentAdded={() => {
                                            setShowAddDepartment(false);
                                        }}
                                    />
                                ) : (
                                    <Departments
                                        onAddDepartment={() => {
                                            setShowAddDepartment(true);
                                        }}
                                    />
                                )}
                            </>
                        )}

                        {activePage === "Services" && (
                            <>
                                {showAddService ? (
                                    <AddService
                                        onServiceAdded={() => {
                                            setShowAddService(false);
                                        }}
                                    />
                                ) : (
                                    <Services
                                        onAddService={() => {
                                            setShowAddService(true);
                                        }}
                                    />
                                )}
                            </>
                        )}

                        {activePage === "Settings" && <Settings />}

                    </div>

                </main>
            </div>
        </div>
    );
};

export default Dashboard;
