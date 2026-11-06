import { useEffect, useState } from "react";
import axios from "axios";
import DoctorNavbar from "../components/DoctorNavbar";
const heading = "font-['Bricolage_Grotesque',sans-serif]";
const body = "font-['Manrope',sans-serif]";
import api from "../api";

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
    { label: "Dashboard", path: "/doctor-dashboard" },
    { label: "My Schedule", path: "/doctor-schedule" },
    { label: "My Profile", path: "/doctor-profile" },
    { label: "AI Risk Assessment", path: "/ai-risk-assessment" },
];

const initialForm = {
    patient: "",
    age: "",
    bp: "",
    sg: "",
    al: "",
    su: "",
    rbc: "normal",
    pc: "normal",
    pcc: "notpresent",
    ba: "notpresent",
    bgr: "",
    bu: "",
    sc: "",
    sod: "",
    pot: "",
    hemo: "",
    pcv: "",
    wbcc: "",
    rbcc: "",
    htn: "no",
    dm: "no",
    cad: "no",
    appet: "good",
    pe: "no",
    ane: "no"
};

function KidneyDiseaseRisk() {
    const [formData, setFormData] = useState(initialForm);
    const [patients, setPatients] = useState([]);
    const [predictionHistory, setPredictionHistory] = useState([]);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [patientsLoading, setPatientsLoading] = useState(true);
    const [historyLoading, setHistoryLoading] = useState(false);

    // Visual only: logged-in doctor's name for the header
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

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const token = localStorage.getItem("adminToken");

            const response = await api.get(
                "/users",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const patientList = Array.isArray(response.data.patients)
                ? response.data.patients
                : [];

            setPatients(patientList);

            setPatients(patientList);
        } catch (error) {
            console.error("Failed to fetch patients:", error);
        } finally {
            setPatientsLoading(false);
        }
    };

    const fetchPredictionHistory = async (patientId) => {
        if (!patientId) {
            setPredictionHistory([]);
            return;
        }

        setHistoryLoading(true);

        try {
            const response = await api.get(
                `/kidney/predictions/${patientId}`
            );

            setPredictionHistory(response.data.data || []);
        } catch (error) {
            console.error(
                "Failed to fetch kidney prediction history:",
                error
            );

            setPredictionHistory([]);
        } finally {
            setHistoryLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });

        if (name === "patient") {
            setResult(null);
            setPredictionHistory([]);
            fetchPredictionHistory(value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.patient) {
            setResult({
                error: "Please select a patient first."
            });
            return;
        }

        setLoading(true);
        setResult(null);

        try {
            const numericFields = [
                "age",
                "bp",
                "sg",
                "al",
                "su",
                "bgr",
                "bu",
                "sc",
                "sod",
                "pot",
                "hemo",
                "pcv",
                "wbcc",
                "rbcc"
            ];

            const data = {
                ...formData
            };

            numericFields.forEach((field) => {
                data[field] = Number(data[field]);
            });

            const response = await api.get(
                `/kidney/predictions/${patientId}`
            );

            setResult(response.data.data);

            await fetchPredictionHistory(formData.patient);
        } catch (error) {
            console.error("Kidney prediction error:", error);

            setResult({
                error:
                    error.response?.data?.message ||
                    "Failed to generate kidney disease prediction."
            });
        } finally {
            setLoading(false);
        }
    };

    // ---------- Display-only derived values ----------
    const selectedPatient = patients.find((p) => p._id === formData.patient);
    const hasResult = result && !result.error;
    const isHigher = hasResult && result.prediction === 1;
    const resultPercent = hasResult ? result.probability * 100 : 0;

    const SectionHeader = ({ letter, title, subtitle, count }) => (
        <div className="flex items-center justify-between pb-2 mb-4 border-b-2 border-[#d6ede8]">
            <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-[#d6ede8] text-[#003435] flex items-center justify-center font-bold text-[12px]">
                    {letter}
                </span>
                <div>
                    <h3 className={`${heading} text-[18px] leading-[26px] text-[#003435] font-bold`}>
                        {title}
                    </h3>
                    {subtitle && (
                        <p className="text-[12px] text-[#404848]">{subtitle}</p>
                    )}
                </div>
            </div>
            {count && (
                <span className="text-[11px] font-bold text-[#404848]">{count}</span>
            )}
        </div>
    );

    return (
        <div className={`kidney-risk-page min-h-screen bg-[#F5F8F6] text-[#0a1f1c] antialiased ${body}`}>
            <style>{`
    /* Tablet and mobile */
    @media (max-width: 767px) {
        .kidney-risk-navbar > div {
            height: 64px;
            padding-left: 14px;
            padding-right: 14px;
        }

        .kidney-risk-navbar > div > div:first-child {
            gap: 0;
        }

        .kidney-risk-navbar > div > div:first-child > div {
            flex-wrap: wrap;
            gap: 5px;
        }

        .kidney-risk-navbar > div > div:first-child span:first-child {
            font-size: 17px;
        }

        .kidney-risk-navbar > div > div:first-child span:nth-child(2) {
            font-size: 8px;
            padding: 3px 5px;
        }

        .kidney-risk-navbar > div > div:last-child {
            gap: 6px;
        }

        .kidney-risk-main {
            padding: 64px 14px 0;
        }

        .kidney-risk-main > div {
            padding-bottom: 32px;
        }

        .kidney-risk-main h1 {
            font-size: 26px;
            line-height: 33px;
        }

        .kidney-risk-main form {
            gap: 16px;
        }

        .kidney-risk-main form > div,
        .kidney-risk-main form .lg\\:col-span-5,
        .kidney-risk-main form .lg\\:col-span-7 {
            padding: 16px;
            min-width: 0;
        }

        .kidney-risk-main form .grid {
            min-width: 0;
        }

        .kidney-risk-main form input,
        .kidney-risk-main form select {
            min-height: 42px;
            font-size: 14px;
        }

        .kidney-risk-main form label {
            line-height: 1.4;
        }

        .kidney-risk-main form h3 {
            font-size: 16px;
            line-height: 22px;
        }

        .kidney-risk-main form .grid.grid-cols-2 {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .kidney-risk-main form .flex.items-center.justify-between.pb-2 {
            align-items: flex-start;
            gap: 10px;
        }

        .kidney-risk-main form .flex.items-center.justify-between.pb-2 > span {
            flex-shrink: 0;
        }

        .kidney-risk-main form > div:last-child {
            align-items: stretch;
            padding: 14px;
        }

        .kidney-risk-main form > div:last-child button {
            width: 100%;
            min-height: 46px;
            white-space: normal;
            text-align: center;
        }

        /* Assessment result */
        .kidney-risk-main .mt-8.bg-white {
            padding: 16px;
        }

        .kidney-risk-main .mt-8.bg-white h2 {
            font-size: 20px;
            line-height: 27px;
        }

        .kidney-risk-main .mt-8.bg-white .text-\\[44px\\] {
            font-size: 32px;
            line-height: 40px;
        }

        .kidney-risk-main .mt-8.bg-white .text-\\[36px\\] {
            font-size: 29px;
            line-height: 36px;
        }

        /* Prediction history */
        .kidney-risk-main table {
            min-width: 520px;
        }

        .kidney-risk-main table th,
        .kidney-risk-main table td {
            padding: 12px 10px;
            white-space: nowrap;
        }

        .kidney-risk-page footer {
            padding: 22px 14px;
            text-align: center;
        }

        .kidney-risk-page footer > div > div {
            flex-wrap: wrap;
            justify-content: center;
        }
    }

    /* Small phones */
    @media (max-width: 480px) {
        .kidney-risk-navbar > div {
            padding-left: 12px;
            padding-right: 12px;
        }

        .kidney-risk-navbar > div > div:first-child span:nth-child(2) {
            max-width: 145px;
            white-space: normal;
            line-height: 1.2;
        }

        .kidney-risk-main {
            padding-left: 10px;
            padding-right: 10px;
        }

        .kidney-risk-main h1 {
            font-size: 23px;
            line-height: 29px;
        }

        .kidney-risk-main form > div,
        .kidney-risk-main form .lg\\:col-span-5,
        .kidney-risk-main form .lg\\:col-span-7 {
            padding: 13px;
        }

        .kidney-risk-main form .grid.grid-cols-2 {
            grid-template-columns: minmax(0, 1fr);
        }

        .kidney-risk-main form .flex.items-center.justify-between.pb-2 {
            flex-wrap: wrap;
        }

        .kidney-risk-main form .flex.items-center.justify-between.pb-2 > span {
            margin-left: 36px;
        }

        .kidney-risk-main .mt-8.bg-white {
            padding: 13px;
        }

        .kidney-risk-main .mt-8.bg-white .flex.items-center.gap-4 {
            align-items: flex-start;
            gap: 10px;
        }

        .kidney-risk-main .mt-8.bg-white .text-\\[44px\\] {
            font-size: 28px;
            line-height: 36px;
        }

        .kidney-risk-main .mt-8.bg-white .text-\\[36px\\] {
            font-size: 25px;
            line-height: 32px;
        }

        .kidney-risk-main .mt-8.bg-white .flex.justify-between.items-baseline {
            align-items: flex-start;
            gap: 8px;
            flex-wrap: wrap;
        }

        .kidney-risk-main .mt-8.bg-white .flex.justify-between.text-\\[12px\\] {
            flex-wrap: nowrap;
        }

        .kidney-risk-page footer > div > div {
            gap: 8px;
        }

        .kidney-risk-page footer span:last-child {
            font-size: 10px;
            line-height: 16px;
        }
    }

    /* Very narrow phones */
    @media (max-width: 360px) {
        .kidney-risk-navbar > div > div:first-child span:nth-child(2) {
            display: none;
        }

        .kidney-risk-main h1 {
            font-size: 21px;
        }

        .kidney-risk-main form .flex.items-center.gap-4 {
            gap: 9px;
        }
    }
`}</style>
            {/* ================= TOP NAVBAR ================= */}
            <DoctorNavbar />

            {/* ================= MAIN ================= */}
            <main className="kidney-risk-main w-full max-w-7xl mx-auto px-5 pt-24 bg-[#F5F8F6] min-h-[calc(100vh-80px)]">
                <div className="flex flex-col w-full pb-16">
                    {/* ---------- Header ---------- */}
                    <div className="w-full flex flex-col gap-2 pt-4 pb-6">
                        <nav className="flex items-center gap-1 text-[12px] text-[#404848]">
                            <button
                                type="button"
                                onClick={() => {
                                    window.location.href = "/doctor-dashboard";
                                }}
                                className="hover:text-[#003435] transition-colors flex items-center gap-1"
                            >
                                <Icon name="home" className="text-[14px]" />
                                Dashboard
                            </button>
                            <span className="text-[#c0c8c8] text-[11px]">/</span>
                            <button
                                type="button"
                                onClick={() => {
                                    window.location.href = "/ai-risk-assessment";
                                }}
                                className="hover:text-[#003435] transition-colors"
                            >
                                AI Risk Assessment
                            </button>
                            <span className="text-[#c0c8c8] text-[11px]">/</span>
                            <span className="text-[#003435] font-semibold">
                                Kidney Disease Risk
                            </span>
                        </nav>

                        <div className="flex flex-col gap-1.5 max-w-3xl mt-2">
                            <div className="flex flex-wrap items-center gap-1 mb-1">
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#164b4d] text-white text-[11px] font-bold tracking-wider uppercase">
                                    <Icon name="neurology" className="text-[12px]" />
                                    AI-Assisted Assessment
                                </span>
                            </div>
                            <h1 className={`${heading} text-[32px] leading-[40px] text-[#003435] font-bold tracking-tight`}>
                                Kidney Disease Risk Assessment
                            </h1>
                            <p className="text-[14px] leading-[22px] text-[#404848]">
                                AI-assisted kidney disease risk assessment using blood, urine and clinical
                                history markers to support early screening.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        {/* ---------- Patient selection ---------- */}
                        <div className="w-full bg-white rounded-xl shadow-sm p-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-[#d6ede8] flex items-center justify-center text-[#003435] shrink-0 shadow-inner">
                                        <Icon name="person_search" className="text-[24px]" />
                                    </div>
                                    <div>
                                        <h2 className={`${heading} text-[18px] leading-[26px] text-[#0a1f1c] font-semibold`}>
                                            Patient Information
                                        </h2>
                                        <p className="text-[12px] text-[#404848]">
                                            Select a patient to run an assessment and view their prediction history.
                                        </p>
                                    </div>
                                </div>

                                <div className="w-full md:w-96">
                                    <label
                                        htmlFor="patient-select"
                                        className="block text-[11px] text-[#404848] mb-1 uppercase tracking-wider font-bold"
                                    >
                                        Select Patient
                                    </label>
                                    <div className="relative">
                                        <select
                                            id="patient-select"
                                            name="patient"
                                            value={formData.patient}
                                            onChange={handleChange}
                                            required
                                            disabled={patientsLoading}
                                            className="w-full appearance-none bg-[#e1f8f3] text-[#0a1f1c] text-[14px] py-2.5 pl-3 pr-10 rounded-lg outline-none cursor-pointer focus:bg-white focus:ring-2 focus:ring-[#256862] shadow-sm disabled:opacity-60"
                                        >
                                            <option value="">
                                                {patientsLoading
                                                    ? "Loading patients..."
                                                    : "Select a patient"}
                                            </option>

                                            {patients.map((patient) => (
                                                <option
                                                    key={patient._id}
                                                    value={patient._id}
                                                >
                                                    {patient.name} — {patient.email}
                                                </option>
                                            ))}
                                        </select>
                                        <Icon
                                            name="unfold_more"
                                            className="absolute right-3 top-2.5 text-[#404848] pointer-events-none text-[20px]"
                                        />
                                    </div>
                                </div>
                            </div>

                            {selectedPatient && (
                                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 p-4 bg-[#e1f8f3] rounded-xl">
                                    <div className="flex flex-col">
                                        <span className="text-[11px] text-[#404848] uppercase font-bold">
                                            Patient
                                        </span>
                                        <span className="text-[13px] text-[#003435] font-bold">
                                            {selectedPatient.name}
                                        </span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[11px] text-[#404848] uppercase font-bold">
                                            Email
                                        </span>
                                        <span className="text-[13px] text-[#0a1f1c] font-semibold">
                                            {selectedPatient.email}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ---------- Sections A & B ---------- */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            <div className="lg:col-span-5 bg-white rounded-xl shadow-sm p-6">
                                <SectionHeader
                                    letter="A"
                                    title="Basic & Vital Measurements"
                                    count="3 Parameters"
                                />
                                <div className="flex flex-col gap-4">
                                    <Input
                                        label="Age"
                                        unit="years"
                                        name="age"
                                        value={formData.age}
                                        onChange={handleChange}
                                        type="number"
                                        required
                                    />

                                    <Input
                                        label="Blood Pressure"
                                        unit="mmHg"
                                        hint="Standard resting arterial pressure."
                                        name="bp"
                                        value={formData.bp}
                                        onChange={handleChange}
                                        type="number"
                                        required
                                    />

                                    <Input
                                        label="Specific Gravity"
                                        unit="sg"
                                        hint="Indicator of tubular concentrating capacity."
                                        name="sg"
                                        value={formData.sg}
                                        onChange={handleChange}
                                        type="number"
                                        step="0.001"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="lg:col-span-7 bg-white rounded-xl shadow-sm p-6">
                                <SectionHeader
                                    letter="B"
                                    title="Urine Analysis & Sedimentation"
                                    count="6 Parameters"
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input
                                        label="Albumin"
                                        unit="0–5"
                                        name="al"
                                        value={formData.al}
                                        onChange={handleChange}
                                        type="number"
                                        min="0"
                                        max="5"
                                        required
                                    />

                                    <Input
                                        label="Sugar"
                                        unit="0–5"
                                        name="su"
                                        value={formData.su}
                                        onChange={handleChange}
                                        type="number"
                                        min="0"
                                        max="5"
                                        required
                                    />

                                    <Select
                                        label="Red Blood Cells"
                                        name="rbc"
                                        value={formData.rbc}
                                        onChange={handleChange}
                                        options={["normal", "abnormal"]}
                                    />

                                    <Select
                                        label="Pus Cell"
                                        name="pc"
                                        value={formData.pc}
                                        onChange={handleChange}
                                        options={["normal", "abnormal"]}
                                    />

                                    <Select
                                        label="Pus Cell Clumps"
                                        name="pcc"
                                        value={formData.pcc}
                                        onChange={handleChange}
                                        options={["notpresent", "present"]}
                                    />

                                    <Select
                                        label="Bacteria"
                                        name="ba"
                                        value={formData.ba}
                                        onChange={handleChange}
                                        options={["notpresent", "present"]}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* ---------- Section C ---------- */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-center justify-between pb-2 mb-4 border-b-2 border-[#d6ede8]">
                                <div className="flex items-center gap-2">
                                    <span className="w-7 h-7 rounded-lg bg-[#d6ede8] text-[#003435] flex items-center justify-center font-bold text-[12px]">
                                        C
                                    </span>
                                    <div>
                                        <h3 className={`${heading} text-[18px] leading-[26px] text-[#003435] font-bold`}>
                                            Blood & Renal Filtration Panel
                                        </h3>
                                        <p className="text-[12px] text-[#404848]">
                                            Core serum analytes, electrolyte balance and hematologic biomarkers.
                                        </p>
                                    </div>
                                </div>
                                <span className="px-2.5 py-1 rounded bg-[#adefe7] text-[#2c6e68] text-[11px] font-bold">
                                    9 Lab Analytes
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <Input
                                    panel
                                    label="Blood Glucose Random"
                                    unit="mg/dL"
                                    name="bgr"
                                    value={formData.bgr}
                                    onChange={handleChange}
                                    type="number"
                                    required
                                />

                                <Input
                                    panel
                                    label="Blood Urea"
                                    unit="mg/dL"
                                    name="bu"
                                    value={formData.bu}
                                    onChange={handleChange}
                                    type="number"
                                    required
                                />

                                <Input
                                    panel
                                    label="Serum Creatinine"
                                    unit="mg/dL"
                                    name="sc"
                                    value={formData.sc}
                                    onChange={handleChange}
                                    type="number"
                                    step="0.1"
                                    required
                                />

                                <Input
                                    panel
                                    label="Sodium"
                                    unit="mEq/L"
                                    name="sod"
                                    value={formData.sod}
                                    onChange={handleChange}
                                    type="number"
                                    required
                                />

                                <Input
                                    panel
                                    label="Potassium"
                                    unit="mEq/L"
                                    name="pot"
                                    value={formData.pot}
                                    onChange={handleChange}
                                    type="number"
                                    step="0.1"
                                    required
                                />

                                <Input
                                    panel
                                    label="Hemoglobin"
                                    unit="g/dL"
                                    name="hemo"
                                    value={formData.hemo}
                                    onChange={handleChange}
                                    type="number"
                                    step="0.1"
                                    required
                                />

                                <Input
                                    panel
                                    label="Packed Cell Volume"
                                    unit="%"
                                    name="pcv"
                                    value={formData.pcv}
                                    onChange={handleChange}
                                    type="number"
                                    required
                                />

                                <Input
                                    panel
                                    label="White Blood Cell Count"
                                    unit="cells/cumm"
                                    name="wbcc"
                                    value={formData.wbcc}
                                    onChange={handleChange}
                                    type="number"
                                    required
                                />

                                <Input
                                    panel
                                    label="Red Blood Cell Count"
                                    unit="millions/cumm"
                                    name="rbcc"
                                    value={formData.rbcc}
                                    onChange={handleChange}
                                    type="number"
                                    step="0.1"
                                    required
                                />
                            </div>
                        </div>

                        {/* ---------- Section D ---------- */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <SectionHeader
                                letter="D"
                                title="Medical History & Clinical Indicators"
                                count="6 Variables"
                            />
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                <Select
                                    label="Hypertension"
                                    name="htn"
                                    value={formData.htn}
                                    onChange={handleChange}
                                    options={["yes", "no"]}
                                />

                                <Select
                                    label="Diabetes Mellitus"
                                    name="dm"
                                    value={formData.dm}
                                    onChange={handleChange}
                                    options={["yes", "no"]}
                                />

                                <Select
                                    label="Coronary Artery Disease"
                                    name="cad"
                                    value={formData.cad}
                                    onChange={handleChange}
                                    options={["yes", "no"]}
                                />

                                <Select
                                    label="Appetite"
                                    name="appet"
                                    value={formData.appet}
                                    onChange={handleChange}
                                    options={["good", "poor"]}
                                />

                                <Select
                                    label="Pedal Edema"
                                    name="pe"
                                    value={formData.pe}
                                    onChange={handleChange}
                                    options={["yes", "no"]}
                                />

                                <Select
                                    label="Anemia"
                                    name="ane"
                                    value={formData.ane}
                                    onChange={handleChange}
                                    options={["yes", "no"]}
                                />
                            </div>
                        </div>

                        {/* ---------- Submit bar ---------- */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-[#d6ede8]/60 rounded-xl shadow-sm">
                            <div className="flex items-center gap-2">
                                <Icon name="task_alt" className="text-[#256862] text-[24px]" />
                                <div>
                                    <span className="text-[13px] text-[#003435] font-bold block">
                                        Ready to run the assessment
                                    </span>
                                    <span className="text-[12px] text-[#404848]">
                                        Review all values, then generate the AI risk estimate.
                                    </span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-[#003435] text-white text-[13px] font-bold shadow-md hover:bg-[#164b4d] transition-all active:scale-[0.98] disabled:opacity-50"
                            >
                                <Icon
                                    name={loading ? "refresh" : "biotech"}
                                    className={`text-[20px] ${loading ? "animate-spin" : ""}`}
                                />
                                {loading
                                    ? "Analyzing..."
                                    : "Check Kidney Disease Risk"}
                            </button>
                        </div>
                    </form>

                    {/* ---------- Result ---------- */}
                    {hasResult && (
                        <div className="mt-8 bg-white rounded-2xl shadow-md p-6 relative overflow-hidden">
                            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#003435] via-[#256862] to-[#adefe7]" />

                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b-2 border-[#d6ede8]">
                                <div className="flex items-center gap-4">
                                    <div
                                        className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${isHigher
                                            ? "bg-[#ffdad6] text-[#93000a]"
                                            : "bg-[#adefe7] text-[#2c6e68]"
                                            }`}
                                    >
                                        <Icon
                                            name={isHigher ? "warning" : "check_circle"}
                                            className="text-[24px]"
                                        />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-1 flex-wrap">
                                            <h2 className={`${heading} text-[24px] leading-[32px] text-[#003435] font-bold`}>
                                                AI Assessment Result
                                            </h2>
                                            <span className="px-2.5 py-0.5 rounded-full bg-[#adefe7] text-[#2c6e68] text-[11px] font-bold uppercase tracking-wider">
                                                Assessment Complete
                                            </span>
                                        </div>
                                        <span className="text-[12px] text-[#404848]">
                                            AI-assisted kidney disease risk estimate
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6">
                                <div className="lg:col-span-6 flex flex-col p-4 bg-[#e1f8f3] rounded-xl">
                                    <span className="text-[11px] uppercase tracking-wider text-[#404848] font-bold">
                                        Predictive Risk Classification
                                    </span>
                                    <div className="flex items-baseline gap-2 mt-1">
                                        <span
                                            className={`${heading} text-[44px] leading-[52px] font-bold tracking-tight ${isHigher ? "text-[#762d02]" : "text-[#256862]"
                                                }`}
                                        >
                                            {isHigher ? "Higher Risk" : "Lower Risk"}
                                        </span>
                                    </div>
                                </div>

                                <div className="lg:col-span-6 flex flex-col justify-between p-4 bg-[#e1f8f3] rounded-xl">
                                    <div className="flex justify-between items-baseline mb-1.5">
                                        <span className="text-[12px] text-[#404848] font-semibold">
                                            Calculated CKD Probability
                                        </span>
                                        <div className="flex items-baseline gap-1">
                                            <span
                                                className={`${heading} text-[36px] leading-[44px] font-bold ${isHigher ? "text-[#762d02]" : "text-[#256862]"
                                                    }`}
                                            >
                                                {resultPercent.toFixed(2)}%
                                            </span>
                                        </div>
                                    </div>

                                    <div className="w-full bg-white h-3.5 rounded-full overflow-hidden relative shadow-inner p-0.5">
                                        <div
                                            className={`h-full rounded-full ${isHigher
                                                ? "bg-gradient-to-r from-[#256862] to-[#762d02]"
                                                : "bg-[#256862]"
                                                }`}
                                            style={{
                                                width: `${Math.min(100, Math.max(0, resultPercent))}%`
                                            }}
                                        />
                                    </div>

                                    <div className="flex justify-between text-[12px] text-[#404848] font-semibold mt-1.5">
                                        <span>0%</span>
                                        <span>100%</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 p-2 px-3 bg-[#e1f8f3] rounded-lg flex items-center gap-2 text-[#404848]">
                                <Icon name="shield" className="text-[#707979] text-[18px] shrink-0" />
                                <p className="text-[12px]">
                                    <strong>Clinical Governance Notice:</strong> This AI assessment is a
                                    risk-screening aid and should not be treated as a medical diagnosis.
                                </p>
                            </div>
                        </div>
                    )}

                    {result?.error && (
                        <div className="mt-6 bg-[#ffdad6] text-[#93000a] rounded-xl p-4 flex items-center gap-2 text-[14px] font-semibold">
                            <Icon name="error" className="text-[20px]" />
                            {result.error}
                        </div>
                    )}

                    {/* ---------- History ---------- */}
                    <div className="mt-8 bg-white rounded-2xl shadow-sm p-6">
                        <div className="pb-4 border-b-2 border-[#d6ede8]">
                            <div className="flex items-center gap-1 flex-wrap">
                                <h2 className={`${heading} text-[18px] leading-[26px] text-[#003435] font-bold`}>
                                    Kidney Prediction History
                                </h2>
                                {selectedPatient && (
                                    <span className="px-2 py-0.5 rounded-full bg-[#dcf3ee] text-[#256862] text-[12px] font-bold">
                                        {selectedPatient.name}
                                    </span>
                                )}
                            </div>
                            <p className="text-[12px] text-[#404848]">
                                Historical record of algorithmic risk scores across prior assessments.
                            </p>
                        </div>

                        <div className="mt-4">
                            {!formData.patient ? (
                                <p className="text-[14px] text-[#404848]">
                                    Select a patient to view prediction history.
                                </p>
                            ) : historyLoading ? (
                                <p className="text-[14px] text-[#404848]">
                                    Loading prediction history...
                                </p>
                            ) : predictionHistory.length === 0 ? (
                                <p className="text-[14px] text-[#404848]">
                                    No kidney predictions found for this patient.
                                </p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-[#e1f8f3] text-[11px] text-[#404848] uppercase tracking-wider font-bold">
                                                <th className="py-3 px-4 rounded-l-lg">
                                                    Date
                                                </th>
                                                <th className="py-3 px-4">
                                                    Prediction
                                                </th>
                                                <th className="py-3 px-4 rounded-r-lg">
                                                    Probability
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody className="divide-y divide-[#dcf3ee] text-[14px]">
                                            {predictionHistory.map((item) => (
                                                <tr
                                                    key={item._id}
                                                    className="hover:bg-[#e1f8f3]/50 transition-colors"
                                                >
                                                    <td className="py-3.5 px-4 text-[#0a1f1c] font-semibold">
                                                        {new Date(
                                                            item.createdAt
                                                        ).toLocaleString()}
                                                    </td>

                                                    <td className="py-3.5 px-4">
                                                        <div className="flex items-center gap-2">
                                                            <span
                                                                className={`w-2.5 h-2.5 rounded-full shrink-0 ${item.prediction === 1
                                                                    ? "bg-[#ff9665]"
                                                                    : "bg-[#256862]"
                                                                    }`}
                                                            />
                                                            <span
                                                                className={
                                                                    item.prediction === 1
                                                                        ? "text-[#762d02] font-bold"
                                                                        : "text-[#256862] font-bold"
                                                                }
                                                            >
                                                                {item.prediction === 1
                                                                    ? "Higher Risk"
                                                                    : "Lower Risk"}
                                                            </span>
                                                        </div>
                                                    </td>

                                                    <td className="py-3.5 px-4">
                                                        <span
                                                            className={`${heading} text-[18px] leading-[26px] font-bold ${item.prediction === 1
                                                                ? "text-[#762d02]"
                                                                : "text-[#256862]"
                                                                }`}
                                                        >
                                                            {(
                                                                item.probability * 100
                                                            ).toFixed(2)}
                                                            %
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
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
}

function Input({
    label,
    name,
    value,
    onChange,
    type = "text",
    step,
    min,
    max,
    required,
    unit,
    hint,
    panel
}) {
    return (
        <div className={panel ? "p-3 bg-[#e1f8f3]/70 rounded-lg" : ""}>
            <div className="flex justify-between items-baseline mb-1">
                <label
                    htmlFor={`input-${name}`}
                    className="text-[13px] text-[#0a1f1c] font-semibold"
                >
                    {label}
                </label>
                {unit && (
                    <span className="text-[11px] font-bold text-[#404848]">
                        {unit}
                    </span>
                )}
            </div>

            <input
                id={`input-${name}`}
                name={name}
                value={value}
                onChange={onChange}
                type={type}
                step={step}
                min={min}
                max={max}
                required={required}
                className={`w-full text-[14px] text-[#0a1f1c] px-3.5 py-2 rounded-lg outline-none focus:ring-2 focus:ring-[#256862] shadow-sm transition-all ${panel
                    ? "bg-white"
                    : "bg-[#e1f8f3] focus:bg-white"
                    }`}
            />

            {hint && (
                <p className="text-[12px] text-[#404848] mt-1">{hint}</p>
            )}
        </div>
    );
}

function Select({
    label,
    name,
    value,
    onChange,
    options
}) {
    return (
        <div className="flex flex-col">
            <label
                htmlFor={`input-${name}`}
                className="text-[13px] text-[#0a1f1c] font-semibold mb-1"
            >
                {label}
            </label>

            <div className="relative">
                <select
                    id={`input-${name}`}
                    name={name}
                    value={value}
                    onChange={onChange}
                    className="w-full appearance-none bg-[#e1f8f3] text-[#0a1f1c] text-[14px] pl-3 pr-9 py-2 rounded-lg outline-none cursor-pointer focus:bg-white focus:ring-2 focus:ring-[#256862] shadow-sm"
                >
                    {options.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
                <Icon
                    name="expand_more"
                    className="absolute right-2.5 top-2 text-[#404848] pointer-events-none text-[18px]"
                />
            </div>
        </div>
    );
}

export default KidneyDiseaseRisk;