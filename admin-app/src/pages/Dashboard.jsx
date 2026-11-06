import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LiquidSkeleton from "../components/LiquidSkeleton";
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
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
                <aside
                    className={`fixed left-0 top-0 bottom-0 z-50 flex w-[270px] flex-col bg-[#164b4d] text-white shadow-[4px_0_20px_rgba(0,52,53,0.08)] transition-transform duration-300 ease-in-out ${isSidebarOpen
                        ? "translate-x-0"
                        : "-translate-x-full"
                        } md:translate-x-0`}
                >

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

                                <p className="font-manrope mt-0.5 text-base font-bold uppercase tracking-[0.14em] text-[#9dcfd1]">
                                    Healthcare Intelligence
                                </p>
                            </div>

                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex flex-1 flex-col overflow-y-auto px-4 py-3">

                        {/* Overview */}
                        <div className="mb-7">

                            <p className="font-manrope mb-2 px-3 text-base font-bold uppercase tracking-[0.15em] text-[#9dcfd1]/70">
                                Overview
                            </p>

                            <button
                                onClick={() => {
                                    setActivePage("Dashboard");
                                    setIsSidebarOpen(false);
                                }}
                                className={`font-manrope flex w-full items-center gap-3 rounded-xl px-4 py-3 text-base transition-all ${activePage === "Dashboard"
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

                            <p className="font-manrope mb-2 px-3 text-base font-bold uppercase tracking-[0.15em] text-[#9dcfd1]/70">
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
                                            onClick={() => {
                                                setActivePage(item.name);
                                                setIsSidebarOpen(false);
                                            }}
                                            className={`font-manrope flex w-full items-center gap-3 rounded-xl px-4 py-3 text-base transition-all ${activePage === item.name
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

                            <p className="font-manrope mb-2 px-3 text-base font-bold uppercase tracking-[0.15em] text-[#9dcfd1]/70">
                                System
                            </p>

                            <button
                                onClick={() => {
                                    setActivePage("Settings");
                                    setIsSidebarOpen(false);
                                }}
                                className={`font-manrope flex w-full items-center gap-3 rounded-xl px-4 py-3 text-base transition-all ${activePage === "Settings"
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
                                <p className="font-manrope truncate text-base font-semibold">
                                    Admin
                                </p>

                                <p className="font-manrope truncate text-base text-[#9dcfd1]">
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

                {/* Mobile Sidebar Overlay */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 z-40 bg-[#003435]/50 backdrop-blur-sm md:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* ================= MAIN ================= */}
                <main className="min-h-screen min-w-0 flex-1 md:ml-[270px]">
                    {/* Header */}
                    <header className="sticky top-0 z-40 flex min-h-[82px] flex-col items-start justify-between gap-4 border-b border-[#c7ddd9] bg-[#f8fffd]/90 px-4 py-4 backdrop-blur-xl sm:flex-row sm:items-center sm:px-6 lg:px-8">

                        {/* Heading + Notification + Profile */}
                        <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:flex-1">

                            <div className="flex min-w-0 items-center gap-3">

                                {/* Hamburger Menu */}
                                <button
                                    onClick={() =>
                                        setIsSidebarOpen(!isSidebarOpen)
                                    }
                                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e1f0ed] text-[#164b4d] transition hover:bg-[#d3e9e4] md:hidden"
                                    aria-label="Toggle navigation menu"
                                >
                                    <span className="material-symbols-outlined text-[25px]">
                                        {isSidebarOpen ? "close" : "menu"}
                                    </span>
                                </button>

                                {/* Dashboard Heading */}
                                <div className="min-w-0">
                                    <h2 className="font-bricolage text-[25px] font-semibold tracking-tight text-[#164b4d]">
                                        {activePage === "Dashboard"
                                            ? "Good morning, Admin"
                                            : activePage}
                                    </h2>

                                    <p className="font-manrope mt-1 text-base text-[#526563]">
                                        {activePage === "Dashboard"
                                            ? "Here's what's happening across Medicare today."
                                            : `Manage your Medicare ${activePage.toLowerCase()} here.`}
                                    </p>
                                </div>

                            </div>

                            {/* Notification + Profile */}
                            <div className="flex shrink-0 items-center gap-2 sm:gap-4">

                                
                                {/* Profile */}
                                <button
                                    onClick={() => navigate("/admin-profile")}
                                    className="flex items-center gap-2"
                                >
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#164b4d] font-bricolage font-bold text-white">
                                        A
                                    </div>

                                    <div className="hidden text-left md:block">
                                        <p className="font-manrope text-base font-bold text-[#0a1f1c]">
                                            Admin
                                        </p>

                                        <p className="font-manrope text-base text-[#667876]">
                                            Administrator
                                        </p>
                                    </div>

                                    <span className="material-symbols-outlined text-[18px] text-[#667876]">
                                        expand_more
                                    </span>
                                </button>

                            </div>

                        </div>

                        {/* Search */}
                        <div className="hidden 2xl:block">

                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[19px] text-[#667876]">
                                    search
                                </span>

                                <input
                                    type="text"
                                    placeholder="Search patients, doctors, records..."
                                    className="font-manrope w-[290px] rounded-xl bg-[#e4f2ef] py-2.5 pl-10 pr-4 text-base text-[#0a1f1c] outline-none transition focus:bg-white focus:ring-2 focus:ring-[#9dcfd1]"
                                />
                            </div>

                        </div>

                    </header>

                    {/* ================= PAGE CONTENT ================= */}
                    <div className="p-3 sm:p-5 lg:p-6 xl:p-8">

                        {activePage === "Dashboard" && (
                            <div className="mx-auto w-full max-w-[1450px] space-y-4 sm:space-y-6">

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

                                            <p className="font-manrope text-base text-[#667876]">
                                                Medicare hospital operations • Real-time dashboard synchronized
                                            </p>
                                        </div>

                                    </div>

                                    <div className="flex flex-wrap items-center gap-2">

                                        <span className="font-manrope flex items-center gap-1.5 rounded-lg bg-[#e4f2ef] px-3 py-1.5 text-base font-bold text-[#164b4d]">
                                            <span className="material-symbols-outlined text-[15px]">
                                                sensors
                                            </span>
                                            System Active
                                        </span>

                                        <span className="font-manrope flex items-center gap-1.5 rounded-lg bg-[#edf6f4] px-3 py-1.5 text-base font-bold text-[#164b4d]">
                                            <span className="material-symbols-outlined text-[15px]">
                                                update
                                            </span>
                                            Live Data
                                        </span>

                                        <button className="font-manrope flex items-center gap-1.5 rounded-lg bg-[#164b4d] px-3.5 py-2 text-base font-bold text-white transition hover:bg-[#003435]">
                                            <span className="material-symbols-outlined text-[17px]">
                                                file_download
                                            </span>
                                            Export Report
                                        </button>

                                    </div>

                                </div>

                                {/* Stats */}
                                {/* Stats */}
                                <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

                                    {stats.map((stat) => (
                                        <div
                                            key={stat.title}
                                            className="group relative overflow-hidden rounded-2xl bg-white p-5 shadow-[0_2px_12px_rgba(0,52,53,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(0,52,53,0.08)]"
                                        >
                                            {statsLoading ? (
                                                <div className="space-y-5">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1 space-y-3">
                                                            <LiquidSkeleton className="h-3 w-3/4 rounded-md" />
                                                            <LiquidSkeleton className="h-10 w-20 rounded-lg" />
                                                        </div>

                                                        <LiquidSkeleton className="h-11 w-11 rounded-xl" />
                                                    </div>

                                                    <div className="flex items-center justify-between border-t border-[#edf2f1] pt-4">
                                                        <LiquidSkeleton className="h-3 w-28 rounded-md" />
                                                        <LiquidSkeleton className="h-3 w-16 rounded-md" />
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <p className="font-manrope text-base font-bold uppercase tracking-[0.12em] text-[#667876]">
                                                                {stat.title}
                                                            </p>

                                                            <div className="mt-2 flex items-baseline gap-2">
                                                                <span className="font-bricolage text-[35px] font-bold tracking-tight text-[#164b4d]">
                                                                    {stat.value}
                                                                </span>

                                                                <span className="font-manrope rounded-md bg-[#dff5ef] px-2 py-0.5 text-base font-bold text-[#256862]">
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
                                                        <span className="font-manrope flex items-center gap-1.5 text-base font-medium text-[#526563]">
                                                            <span className="h-1.5 w-1.5 rounded-full bg-[#256862]" />
                                                            {stat.extra}
                                                        </span>

                                                        <span className="font-manrope text-base font-bold uppercase tracking-wider text-[#8a9a98]">
                                                            Medicare
                                                        </span>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ))}

                                </section>

                                {/* Main dashboard grid */}
                                <section className="grid min-w-0 grid-cols-1 gap-4 sm:gap-5 xl:grid-cols-12">

                                    {/* Appointments */}
                                    <div className="min-w-0 overflow-hidden rounded-2xl bg-white shadow-[0_2px_12px_rgba(0,52,53,0.04)] xl:col-span-8">

                                        <div className="flex flex-col justify-between gap-3 border-b border-[#edf2f1] p-5 sm:flex-row sm:items-center">

                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-bricolage text-xl font-semibold text-[#164b4d]">
                                                        Recent Appointments
                                                    </h3>

                                                    <span className="font-manrope rounded bg-[#e4f2ef] px-2 py-0.5 text-base font-bold uppercase tracking-wide text-[#256862]">
                                                        Live
                                                    </span>
                                                </div>

                                                <p className="font-manrope mt-1 text-base text-[#667876]">
                                                    Latest appointments booked in the hospital
                                                </p>
                                            </div>

                                            <button
                                                onClick={() =>
                                                    setActivePage("Appointments")
                                                }
                                                className="font-manrope flex items-center gap-1 text-base font-bold text-[#256862] transition hover:text-[#003435]"
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
                                                <p className="font-manrope text-base text-[#667876]">
                                                    Loading appointments...
                                                </p>
                                            </div>
                                        ) : recentAppointments.length === 0 ? (
                                            <div className="p-10 text-center">
                                                <span className="material-symbols-outlined text-4xl text-[#9db5b1]">
                                                    event_busy
                                                </span>

                                                <p className="font-manrope mt-2 text-base font-semibold text-[#526563]">
                                                    No appointments found
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="w-full overflow-x-auto">

                                                <table className="w-full min-w-[680px]">

                                                    <thead>
                                                        <tr className="bg-[#f2f8f6] text-left">

                                                            <th className="font-manrope px-5 py-3 text-base font-bold uppercase tracking-[0.1em] text-[#667876]">
                                                                Patient
                                                            </th>

                                                            <th className="font-manrope px-5 py-3 text-base font-bold uppercase tracking-[0.1em] text-[#667876]">
                                                                Doctor
                                                            </th>

                                                            <th className="font-manrope px-5 py-3 text-base font-bold uppercase tracking-[0.1em] text-[#667876]">
                                                                Schedule
                                                            </th>

                                                            <th className="font-manrope px-5 py-3 text-base font-bold uppercase tracking-[0.1em] text-[#667876]">
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

                                                                            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#dff5ef] font-bricolage text-base font-bold text-[#164b4d] ring-1 ring-inset ring-[#9ADBD3]">
                                                                                <span>
                                                                                    {getInitials(
                                                                                        appointment.patient?.name || "Unknown"
                                                                                    )}
                                                                                </span>

                                                                                {appointment.patient?.profileImage && (
                                                                                    <img
                                                                                        src={appointment.patient.profileImage}
                                                                                        alt={appointment.patient?.name || "Patient"}
                                                                                        className="absolute inset-0 h-full w-full object-cover"
                                                                                        onError={(e) => {
                                                                                            e.currentTarget.style.display = "none";
                                                                                        }}
                                                                                    />
                                                                                )}
                                                                            </div>

                                                                            <div className="min-w-0">

                                                                                <p className="font-manrope truncate text-base font-bold text-[#0a1f1c]">
                                                                                    {appointment.patient?.name ||
                                                                                        "Unknown"}
                                                                                </p>

                                                                                <p className="font-manrope truncate text-base text-[#7a8987]">
                                                                                    {appointment.patient?.email ||
                                                                                        "-"}
                                                                                </p>

                                                                            </div>

                                                                        </div>

                                                                    </td>

                                                                    {/* Doctor */}
                                                                    <td className="px-5 py-4">

                                                                        <p className="font-manrope text-base font-semibold text-[#0a1f1c]">
                                                                            Dr.{" "}
                                                                            {appointment.doctor?.user?.name ||
                                                                                "Unknown"}
                                                                        </p>

                                                                        <p className="font-manrope mt-0.5 text-base text-[#7a8987]">
                                                                            {appointment.doctor?.specialization ||
                                                                                "-"}
                                                                        </p>

                                                                    </td>

                                                                    {/* Date */}
                                                                    <td className="px-5 py-4">

                                                                        <p className="font-manrope text-base font-medium text-[#0a1f1c]">
                                                                            {new Date(
                                                                                appointment.date
                                                                            ).toLocaleDateString()}
                                                                        </p>

                                                                        <p className="font-manrope mt-0.5 text-base text-[#256862]">
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
                                                                            className={`font-manrope inline-flex rounded-md px-2 py-1 text-base font-bold capitalize ${getStatusStyle(
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

                                        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#edf2f1] px-5 py-3">

                                            <span className="font-manrope text-base text-[#7a8987]">
                                                Showing {recentAppointments.length} recent appointments
                                            </span>

                                            <button
                                                onClick={() =>
                                                    setActivePage("Appointments")
                                                }
                                                className="font-manrope rounded-lg bg-[#e4f2ef] px-3 py-1.5 text-base font-bold text-[#164b4d] transition hover:bg-[#d6eae6]"
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

                                                <p className="font-manrope mt-1 text-base text-[#667876]">
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
                                                            <p className="font-manrope text-base font-bold text-[#164b4d]">
                                                                Departments
                                                            </p>

                                                            <p className="font-manrope text-base text-[#7a8987]">
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
                                                            <p className="font-manrope text-base font-bold text-[#164b4d]">
                                                                Medical Staff
                                                            </p>

                                                            <p className="font-manrope text-base text-[#7a8987]">
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
                                                            <p className="font-manrope text-base font-bold text-[#164b4d]">
                                                                Patients
                                                            </p>

                                                            <p className="font-manrope text-base text-[#7a8987]">
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

                                                    <p className="font-manrope text-base font-bold text-white">
                                                        Medicare AI
                                                    </p>

                                                    <p className="font-manrope mt-1 text-base leading-4 text-[#b9ecee]">
                                                        AI health modules are ready for clinical analysis.
                                                    </p>

                                                </div>

                                            </div>

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
                                        onBack={() => {
                                            setShowAddDoctor(false);
                                        }}
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
                                        onBack={() => {
                                            setShowAddDepartment(false);
                                        }}
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
                                        onBack={() => {
                                            setShowAddService(false);
                                        }}
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