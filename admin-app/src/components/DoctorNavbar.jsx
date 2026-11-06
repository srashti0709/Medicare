
import { useEffect, useState } from "react";

const Icon = ({ name, className = "" }) => (
    <span
        className={`material-symbols-outlined ${className}`}
        aria-hidden="true"
    >
        {name}
    </span>
);

const getInitials = (name = "") =>
    name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase() || "DR";

const DoctorNavbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    let doctorUser = {};

    try {
        doctorUser = JSON.parse(
            localStorage.getItem("adminUser") || "{}"
        );
    } catch (error) {
        doctorUser = {};
    }

    // Load Google Fonts and Material Symbols globally
    useEffect(() => {
        const href =
            "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..700&family=Manrope:wght@400..700&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap";

        const existingLink = document.querySelector(
            `link[href="${href}"]`
        );

        if (!existingLink) {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = href;
            document.head.appendChild(link);
        }
    }, []);

    const navItems = [
        { label: "My Schedule", path: "/doctor-schedule" },
        {
            label: "AI Risk Assessment",
            path: "/ai-risk-assessment",
            ai: true,
        },
        { label: "My Patients", path: "/patients" },
    ];

    const navigateTo = (path) => {
        setMobileMenuOpen(false);
        setMenuOpen(false);
        window.location.href = path;
    };

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
        window.location.href = "/";
    };

    return (
        <>
            <header className="sticky top-0 z-40 w-full bg-white border-b border-[#CBDAD6] shadow-[0_1px_8px_rgba(0,0,0,0.03)]">

                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-3">

                    {/* Logo */}
                    <a href="/" className="flex flex-col shrink-0">
                        <span className="font-['Bricolage_Grotesque'] text-[20px] sm:text-[22px] font-bold text-[#003435] tracking-tight leading-none">
                            Medicare
                        </span>

                        <span className="text-[9px] sm:text-[10px] text-[#256862] font-semibold uppercase tracking-wider mt-1">
                            Healthcare Intelligence
                        </span>
                    </a>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1 lg:gap-2">
                        {navItems.map((item) => (
                            <button
                                key={item.path}
                                onClick={() => navigateTo(item.path)}
                                className="px-3 lg:px-4 py-2 rounded-full text-[13px] font-semibold text-[#404848] hover:text-[#003435] hover:bg-[#E7F4F1] transition-colors inline-flex items-center gap-1.5 whitespace-nowrap"
                            >
                                {item.label}

                                {item.ai && (
                                    <span className="px-1.5 rounded text-[10px] font-bold bg-[#ADEFE7] text-[#00201d]">
                                        AI
                                    </span>
                                )}
                            </button>
                        ))}
                    </nav>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2 sm:gap-3">

                        {/* Profile */}
                        <div className="relative shrink-0">
                            <button
                                onClick={() => {
                                    setMenuOpen(!menuOpen);
                                    setMobileMenuOpen(false);
                                }}
                                aria-expanded={menuOpen}
                                aria-label="Open profile menu"
                                className="flex items-center gap-2 sm:gap-2.5 p-1 rounded-full hover:bg-[#E7F4F1] transition-colors text-left"
                            >
                                <div className="relative">
                                    <div className="w-9 h-9 rounded-full bg-[#164B4D] text-white flex items-center justify-center text-[13px] font-bold ring-2 ring-[#ADEFE7]">
                                        {getInitials(doctorUser.name)}
                                    </div>

                                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#256862] ring-2 ring-white" />
                                </div>

                                <div className="hidden xl:flex flex-col">
                                    <span className="text-[13px] text-[#003435] font-bold leading-tight">
                                        {doctorUser.name || "Doctor"}
                                    </span>

                                    <span className="text-[11px] text-[#404848] leading-none">
                                        Doctor
                                    </span>
                                </div>

                                <Icon
                                    name="expand_more"
                                    className="text-[#404848] text-[20px] hidden sm:block"
                                />
                            </button>

                            {/* Profile Dropdown */}
                            {menuOpen && (
                                <div className="absolute right-0 top-full pt-2 w-60 z-50">
                                    <div className="bg-white rounded-xl shadow-xl border border-[#CBDAD6] py-2">

                                        <div className="px-4 py-2 border-b border-[#CBDAD6]/50 xl:hidden">
                                            <p className="text-[13px] font-bold text-[#003435]">
                                                {doctorUser.name || "Doctor"}
                                            </p>

                                            <p className="text-[11px] text-[#404848]">
                                                Doctor
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => navigateTo("/doctor-profile")}
                                            className="w-full flex items-center gap-2.5 px-4 py-3 text-[13px] font-semibold text-[#0a1f1c] hover:bg-[#e1f8f3] text-left"
                                        >
                                            <Icon
                                                name="person"
                                                className="text-[18px] text-[#256862]"
                                            />
                                            Doctor Profile &amp; Credentials
                                        </button>

                                        <button
                                            onClick={() => navigateTo("/doctor-schedule")}
                                            className="w-full flex items-center gap-2.5 px-4 py-3 text-[13px] font-semibold text-[#0a1f1c] hover:bg-[#e1f8f3] text-left"
                                        >
                                            <Icon
                                                name="calendar_today"
                                                className="text-[18px] text-[#256862]"
                                            />
                                            Duty Roster &amp; Shifts
                                        </button>

                                        <div className="my-1 border-t border-[#CBDAD6]/50" />

                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-2.5 px-4 py-3 text-[13px] font-semibold text-[#ba1a1a] hover:bg-[#ffdad6]/40 text-left"
                                        >
                                            <Icon
                                                name="logout"
                                                className="text-[18px]"
                                            />
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Mobile Hamburger */}
                        <button
                            type="button"
                            onClick={() => {
                                setMobileMenuOpen(!mobileMenuOpen);
                                setMenuOpen(false);
                            }}
                            aria-label={
                                mobileMenuOpen
                                    ? "Close navigation menu"
                                    : "Open navigation menu"
                            }
                            aria-expanded={mobileMenuOpen}
                            aria-controls="doctor-mobile-navigation"
                            className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-[#E7F4F1] text-[#003435] hover:bg-[#ADEFE7] transition-colors"
                        >
                            <Icon
                                name={mobileMenuOpen ? "close" : "menu"}
                                className="text-[25px]"
                            />
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                {mobileMenuOpen && (
                    <div
                        id="doctor-mobile-navigation"
                        className="md:hidden border-t border-[#CBDAD6] bg-white px-4 py-3 shadow-lg animate-in slide-in-from-top-2 duration-200"
                    >
                        <nav className="flex flex-col gap-1">
                            {navItems.map((item) => (
                                <button
                                    key={item.path}
                                    onClick={() => navigateTo(item.path)}
                                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold text-[#164B4D] hover:bg-[#E7F4F1] transition-colors text-left"
                                >
                                    <span>{item.label}</span>

                                    <span className="flex items-center gap-2">
                                        {item.ai && (
                                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#ADEFE7] text-[#00201d]">
                                                AI
                                            </span>
                                        )}

                                        <Icon
                                            name="arrow_forward_ios"
                                            className="text-[15px] text-[#256862]"
                                        />
                                    </span>
                                </button>
                            ))}
                        </nav>
                    </div>
                )}
            </header>

            {/* Close menus when clicking outside */}
            {(menuOpen || mobileMenuOpen) && (
                <button
                    aria-label="Close navigation menus"
                    onClick={() => {
                        setMenuOpen(false);
                        setMobileMenuOpen(false);
                    }}
                    className="fixed inset-0 z-30 cursor-default"
                />
            )}
        </>
    );
};

export default DoctorNavbar;
