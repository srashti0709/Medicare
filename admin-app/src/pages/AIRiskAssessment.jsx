import React, { useEffect } from "react";

const heading = "font-['Bricolage_Grotesque',sans-serif]";
const body = "font-['Manrope',sans-serif]";

const Icon = ({ name, className = "", style }) => (
    <span className={`material-symbols-outlined ${className}`} style={style}>
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

const navItems = [
    { label: "Dashboard", path: "/doctor-dashboard", active: false },
    { label: "My Schedule", path: "/doctor-schedule", active: false },
    { label: "My Profile", path: "/doctor-profile", active: false },
    { label: "AI Risk Assessment", path: "/ai-risk-assessment", active: true },
];

const AIRiskAssessment = () => {
    // Visual only: read the logged-in doctor's name for the header
    let doctorUser = {};
    try {
        doctorUser = JSON.parse(localStorage.getItem("adminUser") || "{}");
    } catch (e) {
        doctorUser = {};
    }

    // Load fonts used by the design (visual only)
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
            <main className="w-full max-w-7xl mx-auto px-5 pt-20 bg-[#F5F8F6] min-h-[calc(100vh-80px)]">
                <div className="flex flex-col w-full">
                    <div className="w-full max-w-6xl mx-auto px-6 py-8">
                        {/* Breadcrumb */}
                        <nav
                            aria-label="Breadcrumb"
                            className="flex items-center gap-2 mb-4 text-[12px] text-[#404848]"
                        >
                            <button
                                onClick={() => {
                                    window.location.href = "/doctor-dashboard";
                                }}
                                className="flex items-center gap-1.5 hover:text-[#003435] transition-colors"
                            >
                                <Icon name="home" className="text-[16px]" />
                                <span>Doctor Portal</span>
                            </button>
                            <Icon name="chevron_right" className="text-[14px] text-[#707979]" />
                            <span className="font-semibold text-[#003435]">AI Risk Assessment</span>
                        </nav>

                        {/* Page header */}
                        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6">
                            <div className="flex items-start gap-4">
                                
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#256862] opacity-75" />
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#256862]" />
                                        </span>
                                        <span className="text-[11px] uppercase tracking-wider text-[#256862] font-bold">
                                            Clinical Intelligence Suite
                                        </span>
                                    </div>
                                    <h1 className={`${heading} text-[32px] leading-[40px] text-[#003435] font-bold tracking-tight`}>
                                        AI Risk Assessment
                                    </h1>
                                    <p className="text-[14px] leading-[22px] text-[#404848] mt-0.5">
                                        Select an AI-powered health risk assessment to support informed clinical decision-making.
                                    </p>
                                </div>
                            </div>
                        </header>

                        {/* Intro panel */}
                        <section className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm relative overflow-hidden mb-8">
                            <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-gradient-to-br from-[#adefe7]/20 to-[#d0e7e2]/30 blur-3xl pointer-events-none" />
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                                <div className="lg:col-span-7 flex flex-col">
                                    <span className="text-[11px] uppercase tracking-wider text-[#256862] font-bold mb-2">
                                        Clinical Decision Support
                                    </span>
                                    <h2 className={`${heading} text-[24px] leading-[32px] text-[#164b4d] font-bold mb-3`}>
                                        Intelligent Healthcare. Informed Decisions.
                                    </h2>
                                    <p className="text-[14px] text-[#404848] mb-6 leading-relaxed">
                                        Explore AI-assisted screening tools designed to analyze patient health
                                        parameters and support clinical risk assessment. These models process
                                        multi-parameter clinical indicators to identify early risk patterns,
                                        empowering clinicians with predictive triage insights.
                                    </p>
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#e1f8f3] text-[#164b4d] w-fit">
                                        <Icon name="info" className="text-[14px] text-[#256862]" />
                                        <span className="text-[11px] font-bold">
                                            Supportive Screening Workflow — Does not replace clinical diagnosis.
                                        </span>
                                    </div>
                                </div>

                                <div className="lg:col-span-5 flex flex-col gap-3 p-4 rounded-xl bg-[#e1f8f3]/70">
                                    <div className="flex items-center justify-between pb-2 mb-1">
                                        <span className="text-[11px] uppercase tracking-wider text-[#404848] font-bold">
                                            Available Assessments
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <Icon name="vital_signs" className="text-[#164b4d] text-[20px]" />
                                            <div className="flex flex-col">
                                                <span className="text-[13px] text-[#0a1f1c] font-semibold">
                                                    Metabolic Biomarkers
                                                </span>
                                                <span className="text-[12px] text-[#404848]">
                                                    Fasting Glucose, HbA1c, Lipids
                                                </span>
                                            </div>
                                        </div>
                                        <span className="bg-[#adefe7] text-[#2c6e68] px-2 py-0.5 rounded text-[11px] font-bold uppercase">
                                            Active
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <Icon name="biotech" className="text-[#164b4d] text-[20px]" />
                                            <div className="flex flex-col">
                                                <span className="text-[13px] text-[#0a1f1c] font-semibold">
                                                    Renal Clearance
                                                </span>
                                                <span className="text-[12px] text-[#404848]">
                                                    eGFR, Albuminuria, Serum Cr
                                                </span>
                                            </div>
                                        </div>
                                        <span className="bg-[#adefe7] text-[#2c6e68] px-2 py-0.5 rounded text-[11px] font-bold uppercase">
                                            Active
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Assessment cards */}
                        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                            {/* Diabetes */}
                            <article className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group">
                                <div>
                                    <div className="flex items-center justify-between gap-2 mb-6">
                                        <span className="bg-[#adefe7]/40 text-[#164b4d] font-bold text-[11px] tracking-wider px-3 py-1 rounded-full uppercase">
                                            Metabolic Health
                                        </span>
                                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#e1f8f3] text-[#164b4d]">
                                            <Icon name="auto_awesome" className="text-[12px] text-[#256862]" />
                                            <span className="text-[12px] font-semibold">AI Prediction Model</span>
                                        </div>
                                    </div>

                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#e1f8f3] to-[#adefe7]/30 flex items-center justify-center mb-6 text-[#003435] group-hover:scale-105 transition-transform duration-300 shadow-sm">
                                        <Icon name="show_chart" className="text-[30px]" />
                                    </div>

                                    <h3 className={`${heading} text-[24px] leading-[32px] text-[#003435] font-bold mb-3`}>
                                        Diabetes Risk Assessment
                                    </h3>
                                    <p className="text-[14px] text-[#404848] mb-6 leading-relaxed">
                                        Analyze patient health parameters and assess diabetes risk using the AI
                                        model, including potential metabolic stability markers.
                                    </p>

                                    <div className="space-y-3 mb-6 bg-[#e1f8f3]/50 p-4 rounded-xl">
                                        {[
                                            "Continuous fasting glucose, HbA1c & BMI parameter analysis",
                                            "AI-assisted non-linear insulin resistance risk estimation",
                                            "Structured clinical risk stratification & encounter triage",
                                        ].map((item) => (
                                            <div key={item} className="flex items-start gap-2.5">
                                                <Icon name="check_circle" className="text-[#256862] text-[16px] shrink-0 mt-0.5" />
                                                <span className="text-[12px] text-[#0a1f1c]">{item}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mb-8">
                                        <span className="text-[11px] uppercase tracking-wider text-[#404848] font-bold block mb-2.5">
                                            Evaluated Biometric Inputs
                                        </span>
                                        <div className="flex flex-wrap gap-2">
                                            {["Fasting Glucose", "HbA1c %", "BMI Index", "Lipid Panels"].map((tag) => (
                                                <span key={tag} className="px-2.5 py-1 rounded bg-[#e1f8f3] text-[#404848] text-[13px] font-semibold">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        window.location.href = "/diabetes-prediction";
                                    }}
                                    className="w-full bg-[#164b4d] hover:bg-[#003435] text-white px-6 py-3.5 rounded-xl text-[13px] font-semibold flex items-center justify-between transition-colors shadow-sm focus:ring-2 focus:ring-[#92d2cb] focus:outline-none"
                                >
                                    <span>Start Assessment</span>
                                    <Icon name="arrow_forward" className="text-[18px]" />
                                </button>
                            </article>

                            {/* Kidney */}
                            <article className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group">
                                <div>
                                    <div className="flex items-center justify-between gap-2 mb-6">
                                        <span className="bg-[#d6ede8] text-[#164b4d] font-bold text-[11px] tracking-wider px-3 py-1 rounded-full uppercase">
                                            Renal Health
                                        </span>
                                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#e1f8f3] text-[#164b4d]">
                                            <Icon name="auto_awesome" className="text-[12px] text-[#256862]" />
                                            <span className="text-[12px] font-semibold">AI-Assisted Assessment</span>
                                        </div>
                                    </div>

                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#e1f8f3] to-[#b9ecee]/40 flex items-center justify-center mb-6 text-[#003435] group-hover:scale-105 transition-transform duration-300 shadow-sm">
                                        <Icon name="ecg_heart" className="text-[30px]" />
                                    </div>

                                    <h3 className={`${heading} text-[24px] leading-[32px] text-[#003435] font-bold mb-3`}>
                                        Kidney Disease Risk Assessment
                                    </h3>
                                    <p className="text-[14px] text-[#404848] mb-6 leading-relaxed">
                                        AI-powered assessment for kidney disease risk factors and early
                                        nephropathy triage.
                                    </p>

                                    <div className="space-y-3 mb-6 bg-[#e1f8f3]/50 p-4 rounded-xl">
                                        {[
                                            "eGFR clearance, serum creatinine & albuminuria evaluation",
                                            "Longitudinal nephrosclerosis decline pattern detection",
                                            "Standardized CKD staging & urgent nephrology triage",
                                        ].map((item) => (
                                            <div key={item} className="flex items-start gap-2.5">
                                                <Icon name="check_circle" className="text-[#256862] text-[16px] shrink-0 mt-0.5" />
                                                <span className="text-[12px] text-[#0a1f1c]">{item}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mb-8">
                                        <span className="text-[11px] uppercase tracking-wider text-[#404848] font-bold block mb-2.5">
                                            Evaluated Biometric Inputs
                                        </span>
                                        <div className="flex flex-wrap gap-2">
                                            {["eGFR Clearance", "Serum Creatinine", "BUN", "Albumin/Cr Ratio"].map((tag) => (
                                                <span key={tag} className="px-2.5 py-1 rounded bg-[#e1f8f3] text-[#404848] text-[13px] font-semibold">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        window.location.href = "/kidney-disease-risk";
                                    }}
                                    className="w-full bg-[#164b4d] hover:bg-[#003435] text-white px-6 py-3.5 rounded-xl text-[13px] font-semibold flex items-center justify-between transition-colors shadow-sm focus:ring-2 focus:ring-[#92d2cb] focus:outline-none"
                                >
                                    <span>Check Kidney Risk</span>
                                    <Icon name="arrow_forward" className="text-[18px]" />
                                </button>
                            </article>
                        </section>

                        {/* Governance strip */}
                        <section className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm">
                            <div className="mb-6">
                                <h2 className={`${heading} text-[18px] leading-[26px] text-[#164b4d] font-semibold`}>
                                    Designed to Support Clinical Review
                                </h2>
                                <p className="text-[12px] text-[#404848]">
                                    AI outputs assist, and never replace, the treating clinician's judgment.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 mb-6">
                                {[
                                    {
                                        icon: "psychology",
                                        title: "AI-Assisted Screening",
                                        text: "Multi-parameter biometric parsing designed to highlight early deviations before acute symptoms manifest.",
                                    },
                                    {
                                        icon: "dataset",
                                        title: "Structured Parameter Analysis",
                                        text: "Standardized lab inputs benchmarked against clinical guidelines and longitudinal cohort baselines.",
                                    },
                                    {
                                        icon: "verified_user",
                                        title: "Clinician-Led Interpretation",
                                        text: "Every output serves strictly as diagnostic support, keeping therapeutic decisions under certified physician oversight.",
                                    },
                                ].map((item) => (
                                    <div key={item.title} className="flex flex-col gap-2">
                                        <div className="w-10 h-10 rounded-lg bg-[#e1f8f3] flex items-center justify-center text-[#164b4d] mb-1">
                                            <Icon name={item.icon} className="text-[20px]" />
                                        </div>
                                        <h3 className="text-[13px] text-[#0a1f1c] font-bold">{item.title}</h3>
                                        <p className="text-[12px] text-[#404848] leading-relaxed">{item.text}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-6">
                                <div className="p-4 rounded-xl bg-[#e1f8f3] flex items-start gap-3">
                                    <Icon name="policy" className="text-[#256862] shrink-0 text-[18px] mt-0.5" />
                                    <p className="text-[12px] text-[#404848] leading-relaxed">
                                        <span className="font-semibold text-[#0a1f1c]">Institutional Disclaimer:</span>{" "}
                                        AI-generated risk estimates are intended to support clinical assessment and
                                        should not be used as a standalone diagnosis. All assessments require review
                                        by a licensed medical practitioner in accordance with institutional clinical
                                        governance protocols.
                                    </p>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </main>

            {/* ================= FOOTER ================= */}
            <footer className="w-full bg-[#e1f8f3] py-8 mt-8">
                <div className="max-w-7xl mx-auto px-5 flex flex-col md:flex-row items-center justify-between gap-4 text-[12px] text-[#404848]">
                    <div className="flex items-center gap-2">
                        <span className={`${heading} text-[18px] leading-[26px] text-[#003435] font-bold`}>
                            Medicare
                        </span>
                        <span className="text-[11px] font-bold">
                            © {new Date().getFullYear()} Medicare Healthcare Intelligence Platform.
                        </span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default AIRiskAssessment;