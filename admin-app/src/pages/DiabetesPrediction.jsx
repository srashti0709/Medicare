import React, { useEffect, useState } from "react";
import axios from "axios";

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
    { label: "Dashboard", path: "/doctor-dashboard" },
    { label: "My Schedule", path: "/doctor-schedule" },
    { label: "My Profile", path: "/doctor-profile" },
    { label: "AI Risk Assessment", path: "/ai-risk-assessment" },
];

// Presentation-only description of the form fields (names match your formData keys)
const fields = [
    {
        name: "Pregnancies",
        label: "Pregnancies",
        icon: "family_restroom",
        unit: "count",
        hint: "Zero or total number of pregnancies",
        placeholder: "Pregnancies",
    },
    {
        name: "Glucose",
        label: "Glucose Level",
        icon: "water_drop",
        unit: "mg/dL",
        hint: "Fasting blood glucose (Normal: 70–99 mg/dL)",
        placeholder: "Glucose",
    },
    {
        name: "BloodPressure",
        label: "Blood Pressure",
        icon: "monitor_heart",
        unit: "mmHg",
        hint: "Diastolic blood pressure (Normal: < 80 mmHg)",
        placeholder: "Blood Pressure",
    },
    {
        name: "SkinThickness",
        label: "Skin Thickness",
        icon: "layers",
        unit: "mm",
        hint: "Triceps skin fold thickness",
        placeholder: "Skin Thickness",
    },
    {
        name: "Insulin",
        label: "Insulin",
        icon: "science",
        unit: "µU/mL",
        hint: "2-hour serum insulin",
        placeholder: "Insulin",
    },
    {
        name: "BMI",
        label: "Body Mass Index (BMI)",
        icon: "scale",
        unit: "kg/m²",
        hint: "Weight in kg / (Height in m)² (Overweight: ≥ 25.0)",
        placeholder: "BMI",
        step: "0.1",
    },
    {
        name: "DiabetesPedigreeFunction",
        label: "Diabetes Pedigree Function",
        icon: "strikethrough_s",
        unit: "score",
        hint: "Hereditary lineage weight score",
        placeholder: "Diabetes Pedigree Function",
        step: "0.001",
    },
    {
        name: "Age",
        label: "Age",
        icon: "calendar_month",
        unit: "years",
        hint: "Completed age at assessment time",
        placeholder: "Age",
    },
];

const DiabetesPrediction = () => {
    const [formData, setFormData] = useState({
        patient: "",
        Pregnancies: "",
        Glucose: "",
        BloodPressure: "",
        SkinThickness: "",
        Insulin: "",
        BMI: "",
        DiabetesPedigreeFunction: "",
        Age: ""
    });

    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [patients, setPatients] = useState([]);
    const [patientsLoading, setPatientsLoading] = useState(true);

    const [predictionHistory, setPredictionHistory] = useState([]);
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
        const fetchPatients = async () => {
            try {
                const token = localStorage.getItem("adminToken");

                const response = await axios.get(
                    "http://localhost:5000/api/users",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                console.log("PATIENT RESPONSE:", response.data);
                setPatients(response.data.patients);
            } catch (error) {
                console.error("Failed to fetch patients", error);
            } finally {
                setPatientsLoading(false);
            }
        };

        fetchPatients();
    }, []);

    const fetchPredictionHistory = async (patientId) => {
        if (!patientId) {
            setPredictionHistory([]);
            return;
        }

        try {
            setHistoryLoading(true);

            const response = await axios.get(
                `http://localhost:5000/api/diabetes/predictions/${patientId}`
            );

            setPredictionHistory(response.data.data);
        } catch (error) {
            console.error("Failed to fetch prediction history", error);
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

        try {
            setLoading(true);
            setResult(null);

            const response = await axios.post(
                "http://localhost:5000/api/diabetes/predict",
                {
                    patient: formData.patient,
                    Pregnancies: Number(formData.Pregnancies),
                    Glucose: Number(formData.Glucose),
                    BloodPressure: Number(formData.BloodPressure),
                    SkinThickness: Number(formData.SkinThickness),
                    Insulin: Number(formData.Insulin),
                    BMI: Number(formData.BMI),
                    DiabetesPedigreeFunction: Number(
                        formData.DiabetesPedigreeFunction
                    ),
                    Age: Number(formData.Age)
                }
            );

            setResult(response.data.data);

            // Refresh history after new prediction
            fetchPredictionHistory(formData.patient);
        } catch (error) {
            console.error(error);
            alert("Failed to generate prediction");
        } finally {
            setLoading(false);
        }
    };

    // ---------- Display-only derived values ----------
    const selectedPatient = patients.find((p) => p._id === formData.patient);

    const resultProbability = result ? result.probability * 100 : 0;
    const resultThreshold = result ? Number(result.threshold) : null;
    const resultThresholdPercent =
        resultThreshold !== null && !Number.isNaN(resultThreshold)
            ? resultThreshold <= 1
                ? resultThreshold * 100
                : resultThreshold
            : null;
    const isHigher = result && result.prediction === 1;

    const inputClass =
        "w-full bg-[#e1f8f3] text-[#0a1f1c] text-[18px] leading-[26px] font-bold rounded-xl px-4 py-3 pr-20 placeholder:text-[#707979] placeholder:font-medium placeholder:text-[14px] focus:outline-none focus:ring-2 focus:ring-[#003435] shadow-inner " +
        heading;

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
                <div className="w-full max-w-7xl mx-auto px-6 py-8">
                    {/* ---------- Page header ---------- */}
                    <header className="flex flex-col gap-4 mb-8">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <nav
                                aria-label="Breadcrumb"
                                className="flex items-center gap-2 text-[13px] font-semibold text-[#404848]"
                            >
                                <button
                                    onClick={() => {
                                        window.location.href = "/doctor-dashboard";
                                    }}
                                    className="hover:text-[#003435] transition-colors flex items-center gap-1.5"
                                >
                                    <Icon name="dashboard" className="text-[16px]" />
                                    <span>Dashboard</span>
                                </button>
                                <Icon name="chevron_right" className="text-[14px] text-[#c0c8c8]" />
                                <button
                                    onClick={() => {
                                        window.location.href = "/ai-risk-assessment";
                                    }}
                                    className="hover:text-[#003435] transition-colors"
                                >
                                    AI Risk Assessment
                                </button>
                                <Icon name="chevron_right" className="text-[14px] text-[#c0c8c8]" />
                                <span className="font-bold text-[#003435]">Diabetes Prediction</span>
                            </nav>
                        </div>

                        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pt-1">
                            <div>
                                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-[#adefe7] text-[#2c6e68] text-[11px] uppercase tracking-wider font-bold mb-2">
                                    <Icon name="neurology" className="text-[14px]" />
                                    Clinical Intelligence Suite
                                </div>
                                <h1 className={`${heading} text-[32px] leading-[40px] text-[#003435] font-bold tracking-tight`}>
                                    Diabetes Risk Prediction
                                </h1>
                                <p className="text-[14px] leading-[22px] text-[#404848] mt-1 max-w-3xl">
                                    Evaluate patient health parameters using the AI model to estimate
                                    diabetes risk and support preemptive clinical protocols.
                                </p>
                            </div>
                        </div>
                    </header>

                    <form onSubmit={handleSubmit}>
                        {/* ---------- Patient selection ---------- */}
                        <section className="bg-white rounded-2xl p-6 mb-6 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#164b4d] via-[#256862] to-[#b9ecee]" />
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-[#e1f8f3] flex items-center justify-center text-[#003435] shrink-0 shadow-sm">
                                        <Icon
                                            name="how_to_reg"
                                            className="text-[24px]"
                                            style={{ fontVariationSettings: "'FILL' 1" }}
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2">
                                            <h2 className={`${heading} text-[18px] leading-[26px] text-[#003435] font-bold`}>
                                                Patient Information
                                            </h2>
                                            <span className="bg-[#adefe7] text-[#2c6e68] px-2 py-0.5 rounded text-[11px] font-bold">
                                                Active Care Roster
                                            </span>
                                        </div>
                                        <p className="text-[12px] text-[#404848] mt-0.5">
                                            Select a registered patient to review their prediction history
                                            and run a new assessment.
                                        </p>
                                    </div>
                                </div>

                                <div className="w-full lg:w-96 flex flex-col gap-1">
                                    <label
                                        htmlFor="patient-selector"
                                        className="text-[11px] text-[#404848] uppercase font-bold tracking-wider"
                                    >
                                        Select Registered Patient *
                                    </label>
                                    <div className="relative flex items-center">
                                        <select
                                            id="patient-selector"
                                            name="patient"
                                            value={formData.patient}
                                            onChange={handleChange}
                                            className="w-full bg-[#e1f8f3] text-[#0a1f1c] text-[14px] font-semibold rounded-xl px-4 py-3 pr-10 appearance-none focus:outline-none focus:ring-2 focus:ring-[#003435] shadow-inner"
                                            required
                                        >
                                            <option value="">
                                                {patientsLoading
                                                    ? "Loading patients..."
                                                    : "Select Patient"}
                                            </option>

                                            {patients.map((patient) => (
                                                <option key={patient._id} value={patient._id}>
                                                    {patient.name} - {patient.email}
                                                </option>
                                            ))}
                                        </select>
                                        <Icon
                                            name="unfold_more"
                                            className="absolute right-3 pointer-events-none text-[#404848]"
                                        />
                                    </div>
                                </div>
                            </div>

                            {selectedPatient && (
                                <div className="mt-5 bg-[#e1f8f3]/60 rounded-xl px-4 py-3 flex flex-wrap items-center gap-4 lg:gap-6 text-[12px] text-[#404848]">
                                    <div className="flex items-center gap-2">
                                        <Icon name="person" className="text-[16px] text-[#003435]" />
                                        <span>
                                            Patient:{" "}
                                            <strong className="text-[#0a1f1c] font-semibold">
                                                {selectedPatient.name}
                                            </strong>
                                        </span>
                                    </div>
                                    <div className="h-3 w-px bg-[#c0c8c8]" />
                                    <div className="flex items-center gap-2">
                                        <Icon name="mail" className="text-[16px] text-[#003435]" />
                                        <span>
                                            Email:{" "}
                                            <strong className="text-[#0a1f1c] font-semibold">
                                                {selectedPatient.email}
                                            </strong>
                                        </span>
                                    </div>
                                </div>
                            )}
                        </section>

                        {/* ---------- Clinical measurements ---------- */}
                        <section className="bg-white rounded-2xl p-6 lg:p-8 mb-6 shadow-sm">
                            <div className="flex flex-col md:flex-row md:items-center justify-between bg-[#e1f8f3]/40 -mx-6 -mt-6 lg:-mx-8 lg:-mt-8 p-6 lg:p-8 rounded-t-2xl mb-6">
                                <div className="flex items-start gap-3.5">
                                    <div className="w-10 h-10 rounded-xl bg-[#164b4d] text-white flex items-center justify-center shrink-0">
                                        <Icon name="vital_signs" className="text-[20px]" />
                                    </div>
                                    <div>
                                        <h2 className={`${heading} text-[18px] leading-[26px] text-[#003435] font-bold`}>
                                            Clinical Measurements
                                        </h2>
                                        <p className="text-[14px] text-[#404848] mt-0.5">
                                            Enter the patient's recorded diagnostic parameters to generate a
                                            diabetes risk estimate.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {fields.map((field) => (
                                        <div key={field.name} className="flex flex-col gap-1.5">
                                            <label
                                                htmlFor={`input-${field.name}`}
                                                className="text-[13px] text-[#0a1f1c] font-semibold flex items-center gap-1.5"
                                            >
                                                <Icon name={field.icon} className="text-[16px] text-[#256862]" />
                                                <span>{field.label}</span>
                                            </label>
                                            <div className="relative flex items-center">
                                                <input
                                                    id={`input-${field.name}`}
                                                    type="number"
                                                    {...(field.step ? { step: field.step } : {})}
                                                    name={field.name}
                                                    placeholder={field.placeholder}
                                                    value={formData[field.name]}
                                                    onChange={handleChange}
                                                    className={inputClass}
                                                    required
                                                />
                                                <span className="absolute right-4 text-[12px] font-semibold text-[#404848] bg-[#dcf3ee] px-2.5 py-1 rounded-md pointer-events-none">
                                                    {field.unit}
                                                </span>
                                            </div>
                                            <span className="text-[12px] text-[#404848]">{field.hint}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-6 mt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#003435] hover:bg-[#164b4d] text-white text-[13px] font-bold tracking-wide transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-3 group disabled:opacity-60"
                                    >
                                        <Icon
                                            name={loading ? "sync" : "auto_awesome"}
                                            className={`text-[20px] ${loading ? "animate-spin" : "group-hover:scale-110 transition-transform"}`}
                                        />
                                        <span>
                                            {loading
                                                ? "Predicting..."
                                                : "Predict Diabetes Risk"}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </section>
                    </form>

                    {/* ---------- Prediction result ---------- */}
                    {result && (
                        <section className="bg-gradient-to-br from-white via-white to-[#e1f8f3]/70 rounded-2xl p-6 lg:p-8 mb-6 shadow-md relative overflow-hidden">
                            <div className="absolute -right-24 -top-24 w-80 h-80 bg-[#adefe7]/30 rounded-full blur-3xl pointer-events-none" />

                            <div className="relative flex flex-wrap items-center justify-between gap-4 pb-6 mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-[#003435] text-white flex items-center justify-center shadow-sm">
                                        <Icon name="analytics" className="text-[20px]" />
                                    </div>
                                    <div>
                                        <h2 className={`${heading} text-[18px] leading-[26px] text-[#003435] font-bold`}>
                                            Prediction Result
                                        </h2>
                                        <p className="text-[12px] text-[#404848]">
                                            AI-assisted diabetes risk estimate
                                        </p>
                                    </div>
                                </div>
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#adefe7] text-[#2c6e68] text-[11px] font-bold">
                                    <Icon name="check_circle" className="text-[14px]" />
                                    <span>Inference Complete</span>
                                </div>
                            </div>

                            <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                                {/* Probability panel */}
                                <div className="lg:col-span-7 bg-[#e1f8f3]/50 rounded-2xl p-6 flex flex-col justify-between">
                                    <div className="flex flex-col">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-[13px] text-[#404848] uppercase font-bold tracking-wider">
                                                Prediction
                                            </span>
                                            <span
                                                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-bold shadow-sm ${isHigher
                                                        ? "bg-[#ffdbcd] text-[#360f00]"
                                                        : "bg-[#adefe7] text-[#00201d]"
                                                    }`}
                                            >
                                                <Icon
                                                    name={isHigher ? "warning" : "check_circle"}
                                                    className="text-[16px]"
                                                />
                                                <span>{isHigher ? "Higher Risk" : "Lower Risk"}</span>
                                            </span>
                                        </div>

                                        <div className="flex flex-col my-3">
                                            <span className={`${heading} text-[44px] leading-[52px] text-[#003435] font-extrabold tracking-tight`}>
                                                {resultProbability.toFixed(2)}%
                                            </span>
                                            <span className="text-[13px] text-[#404848] font-medium">
                                                Predicted probability of diabetes
                                            </span>
                                        </div>

                                        <div className="mt-6 flex flex-col gap-2">
                                            <div className="flex justify-between text-[11px] text-[#404848] font-bold">
                                                <span>0%</span>
                                                {resultThresholdPercent !== null && (
                                                    <span className="text-[#762d02]">
                                                        Threshold: {resultThresholdPercent.toFixed(0)}%
                                                    </span>
                                                )}
                                                <span>100%</span>
                                            </div>
                                            <div className="relative w-full h-4 rounded-full bg-[#d6ede8] overflow-visible">
                                                <div
                                                    className={`absolute top-0 left-0 bottom-0 rounded-full opacity-90 ${isHigher
                                                            ? "bg-gradient-to-r from-[#256862] to-[#531c00]"
                                                            : "bg-[#256862]"
                                                        }`}
                                                    style={{ width: `${Math.min(100, Math.max(0, resultProbability))}%` }}
                                                />
                                                {resultThresholdPercent !== null && (
                                                    <div
                                                        className="absolute -top-1 -bottom-1 w-0.5 bg-[#762d02]"
                                                        style={{ left: `${Math.min(100, Math.max(0, resultThresholdPercent))}%` }}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Details panel */}
                                <div className="lg:col-span-5 flex flex-col justify-between gap-4">
                                    <div className="bg-[#e1f8f3]/40 rounded-xl p-4 flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-[#164b4d] text-white flex items-center justify-center shrink-0">
                                            <Icon name="speed" className="text-[20px]" />
                                        </div>
                                        <div className="flex-1">
                                            <span className="text-[11px] text-[#404848] uppercase font-bold tracking-wider">
                                                Decision Threshold
                                            </span>
                                            <p className={`${heading} text-[18px] leading-[26px] text-[#003435] font-bold mt-0.5`}>
                                                {result.threshold}
                                            </p>
                                            <p className="text-[12px] text-[#404848] mt-1">
                                                Probabilities at or above this cutoff are classified as higher risk.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-[#e1f8f3]/40 rounded-xl p-4 flex items-start gap-4">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${isHigher ? "bg-[#762d02] text-white" : "bg-[#256862] text-white"}`}>
                                            <Icon name="clinical_notes" className="text-[20px]" />
                                        </div>
                                        <div className="flex-1">
                                            <span className="text-[11px] text-[#404848] uppercase font-bold tracking-wider">
                                                Classification
                                            </span>
                                            <p className={`${heading} text-[18px] leading-[26px] text-[#003435] font-bold mt-0.5`}>
                                                {isHigher ? "Higher Risk" : "Lower Risk"}
                                            </p>
                                            <p className="text-[12px] text-[#404848] mt-1">
                                                Interpret alongside clinical evaluation and the patient's history.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="relative mt-8 bg-[#e1f8f3]/40 -mx-6 -mb-6 lg:-mx-8 lg:-mb-8 p-4 px-6 lg:px-8 rounded-b-2xl flex items-center gap-3 text-[#404848]">
                                <Icon name="verified_user" className="text-[18px] shrink-0 text-[#707979]" />
                                <p className="text-[12px]">
                                    <strong>Notice:</strong> This AI-generated estimate is designed solely for
                                    clinical decision support and does not constitute an autonomous medical
                                    diagnosis. Interpret alongside licensed physician evaluation and the full
                                    patient record.
                                </p>
                            </div>
                        </section>
                    )}

                    {/* ---------- Prediction history ---------- */}
                    {formData.patient && (
                        <section className="bg-white rounded-2xl p-6 lg:p-8 mb-6 shadow-sm">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 gap-4">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h2 className={`${heading} text-[18px] leading-[26px] text-[#003435] font-bold`}>
                                            Prediction History
                                        </h2>
                                        <span className="bg-[#adefe7] text-[#2c6e68] px-2 py-0.5 rounded text-[11px] font-bold">
                                            {predictionHistory.length} Total Records
                                        </span>
                                    </div>
                                    {selectedPatient && (
                                        <p className="text-[12px] text-[#404848] mt-0.5">
                                            Historical diabetes assessments for {selectedPatient.name}.
                                        </p>
                                    )}
                                </div>
                            </div>

                            {historyLoading ? (
                                <p className="text-[14px] text-[#404848]">
                                    Loading prediction history...
                                </p>
                            ) : predictionHistory.length === 0 ? (
                                <p className="text-[14px] text-[#404848]">
                                    No previous predictions found.
                                </p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-[14px] border-collapse">
                                        <thead>
                                            <tr className="bg-[#e1f8f3] text-[#404848] text-[11px] uppercase tracking-wider">
                                                <th className="py-3 px-4 rounded-l-xl">Prediction</th>
                                                <th className="py-3 px-4">Probability</th>
                                                <th className="py-3 px-4">Threshold</th>
                                                <th className="py-3 px-4 rounded-r-xl">Date</th>
                                            </tr>
                                        </thead>

                                        <tbody className="text-[#0a1f1c]">
                                            {predictionHistory.map((prediction) => {
                                                const higher = prediction.prediction === 1;
                                                const percent = prediction.probability * 100;

                                                return (
                                                    <tr
                                                        key={prediction._id}
                                                        className="hover:bg-[#e1f8f3]/60 transition-colors"
                                                    >
                                                        <td className="py-4 px-4 font-semibold">
                                                            <span
                                                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${higher
                                                                        ? "bg-[#ffdbcd] text-[#360f00]"
                                                                        : "bg-[#adefe7] text-[#00201d]"
                                                                    }`}
                                                            >
                                                                <Icon
                                                                    name={higher ? "warning" : "check_circle"}
                                                                    className="text-[14px]"
                                                                />
                                                                {higher ? "Higher Risk" : "Lower Risk"}
                                                            </span>
                                                        </td>

                                                        <td className="py-4 px-4">
                                                            <div className="flex items-center gap-2">
                                                                <span className={`${heading} text-[18px] leading-[26px] text-[#003435] font-bold`}>
                                                                    {percent.toFixed(2)}%
                                                                </span>
                                                                <div className="w-16 h-2 rounded-full bg-[#d6ede8] overflow-hidden">
                                                                    <div
                                                                        className={`h-full rounded-full ${higher ? "bg-[#531c00]" : "bg-[#256862]"}`}
                                                                        style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </td>

                                                        <td className="py-4 px-4 text-[12px] font-semibold text-[#404848]">
                                                            {prediction.threshold}
                                                        </td>

                                                        <td className="py-4 px-4 text-[#003435] font-semibold">
                                                            {prediction.createdAt
                                                                ? new Date(
                                                                    prediction.createdAt
                                                                ).toLocaleString()
                                                                : "N/A"}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </section>
                    )}
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

export default DiabetesPrediction;