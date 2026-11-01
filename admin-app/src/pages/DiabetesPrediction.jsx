import React, { useEffect, useState } from "react";
import axios from "axios";
import DoctorNavbar from "../components/DoctorNavbar";
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
        const styleId = "diabetes-prediction-responsive";

        if (document.getElementById(styleId)) return;

        const style = document.createElement("style");
        style.id = styleId;

        style.textContent = `
        @media (max-width: 767px) {
            /* Main page */
            .diabetes-page {
                overflow-x: hidden;
            }

            .diabetes-page main {
                padding: 28px 12px 0 !important;
                min-height: calc(100vh - 64px);
            }

            .diabetes-page .diabetes-content {
                padding: 16px 4px 24px !important;
            }

            /* Navbar */
            .diabetes-page .diabetes-navbar-inner {
                height: 64px !important;
                padding-left: 14px !important;
                padding-right: 14px !important;
                gap: 8px !important;
            }

            .diabetes-page .diabetes-navbar-inner > div:first-child span:first-child {
                font-size: 18px;
            }

            .diabetes-page .diabetes-navbar-inner > div:first-child span:last-child {
                font-size: 8px;
            }

            .diabetes-page .diabetes-navbar-inner .doctor-profile-button {
                padding: 3px;
            }

            .diabetes-page .diabetes-navbar-inner .doctor-profile-button > span {
                display: none;
            }

            /* Breadcrumb */
            .diabetes-page .diabetes-breadcrumb {
                flex-wrap: wrap;
                gap: 5px;
                font-size: 10px;
                line-height: 1.6;
            }

            .diabetes-page .diabetes-breadcrumb .material-symbols-outlined {
                font-size: 13px;
            }

            /* Page heading */
            .diabetes-page .diabetes-page-title {
                font-size: 25px !important;
                line-height: 1.25 !important;
            }

            .diabetes-page .diabetes-page-description {
                font-size: 12px;
                line-height: 1.7;
            }

            /* General cards */
            .diabetes-page .diabetes-card {
                padding: 16px !important;
                border-radius: 16px;
                margin-bottom: 16px;
            }

            /* Patient selection */
            .diabetes-page .patient-heading {
                gap: 10px;
            }

            .diabetes-page .patient-heading h2,
            .diabetes-page .clinical-heading h2,
            .diabetes-page .result-heading h2,
            .diabetes-page .history-heading h2 {
                font-size: 16px !important;
                line-height: 23px !important;
            }

            .diabetes-page .patient-heading p,
            .diabetes-page .clinical-heading p {
                font-size: 11px;
                line-height: 1.6;
            }

            .diabetes-page .patient-heading .patient-icon {
                width: 40px;
                height: 40px;
            }

            .diabetes-page .patient-heading .patient-title-row {
                flex-wrap: wrap;
                gap: 5px;
            }

            .diabetes-page .patient-selector {
                width: 100% !important;
            }

            .diabetes-page .patient-details {
                flex-direction: column;
                align-items: flex-start;
                gap: 9px;
            }

            .diabetes-page .patient-details .patient-divider {
                display: none;
            }

            .diabetes-page .patient-details > div {
                min-width: 0;
                overflow-wrap: anywhere;
            }

            /* Clinical measurements */
            .diabetes-page .clinical-heading {
                margin: -16px -16px 18px !important;
                padding: 17px 16px !important;
                gap: 10px;
            }

            .diabetes-page .clinical-heading > div:first-child {
                width: 36px;
                height: 36px;
            }

            .diabetes-page .clinical-fields {
                grid-template-columns: minmax(0, 1fr) !important;
                gap: 17px !important;
            }

            .diabetes-page .clinical-fields label {
                font-size: 12px;
            }

            .diabetes-page .clinical-fields input {
                font-size: 15px !important;
                padding: 12px 76px 12px 13px !important;
                min-height: 46px;
            }

            .diabetes-page .clinical-fields input + span {
                right: 10px;
                font-size: 10px;
                padding: 5px 7px;
            }

            .diabetes-page .clinical-fields > div > span {
                font-size: 10px;
                line-height: 1.5;
            }

            .diabetes-page .clinical-submit {
                padding-top: 16px;
                margin-top: 5px;
            }

            .diabetes-page .clinical-submit button {
                width: 100%;
                min-height: 48px;
                padding: 12px 15px;
                font-size: 12px;
            }

            /* Prediction result */
            .diabetes-page .prediction-result {
                padding: 16px !important;
            }

            .diabetes-page .result-heading {
                flex-direction: column;
                align-items: flex-start;
                gap: 12px;
                padding-bottom: 16px;
                margin-bottom: 16px;
            }

            .diabetes-page .result-heading > div:last-child {
                align-self: flex-start;
            }

            .diabetes-page .result-panels {
                gap: 13px !important;
            }

            .diabetes-page .probability-panel {
                padding: 15px !important;
            }

            .diabetes-page .probability-value {
                font-size: 36px !important;
                line-height: 44px !important;
            }

            .diabetes-page .probability-panel .prediction-label {
                font-size: 11px;
            }

            .diabetes-page .probability-panel .prediction-status {
                padding: 6px 9px;
                font-size: 10px;
            }

            .diabetes-page .result-detail {
                padding: 13px !important;
                gap: 10px;
            }

            .diabetes-page .result-detail .result-detail-icon {
                width: 35px;
                height: 35px;
            }

            .diabetes-page .result-notice {
                margin: 20px -16px -16px !important;
                padding: 13px 16px !important;
                align-items: flex-start;
                gap: 8px;
            }

            .diabetes-page .result-notice p {
                font-size: 10px;
                line-height: 1.6;
            }

            /* Prediction history */
            .diabetes-page .history-section {
                padding: 16px !important;
            }

            .diabetes-page .history-heading {
                flex-direction: column;
                align-items: flex-start;
                gap: 8px;
                padding-bottom: 15px;
            }

            .diabetes-page .history-heading > div:first-child > div {
                flex-wrap: wrap;
            }

            .diabetes-page .history-table-wrapper {
                margin: 0 -4px;
                overflow-x: auto;
                -webkit-overflow-scrolling: touch;
            }

            .diabetes-page .history-table {
                min-width: 610px;
                font-size: 12px;
            }

            .diabetes-page .history-table th,
            .diabetes-page .history-table td {
                padding: 12px 10px;
                white-space: nowrap;
            }

            /* Footer */
            .diabetes-page .diabetes-footer {
                padding: 20px 14px;
                margin-top: 18px;
            }

            .diabetes-page .diabetes-footer > div {
                text-align: center;
                gap: 8px;
            }

            .diabetes-page .diabetes-footer > div > div {
                flex-wrap: wrap;
                justify-content: center;
            }
        }

        @media (max-width: 380px) {
            .diabetes-page main {
                padding-left: 9px !important;
                padding-right: 9px !important;
            }

            .diabetes-page .diabetes-content {
                padding-left: 2px !important;
                padding-right: 2px !important;
            }

            .diabetes-page .diabetes-page-title {
                font-size: 22px !important;
            }

            .diabetes-page .diabetes-card,
            .diabetes-page .prediction-result,
            .diabetes-page .history-section {
                padding: 13px !important;
            }

            .diabetes-page .clinical-heading {
                margin: -13px -13px 16px !important;
                padding: 15px 13px !important;
            }

            .diabetes-page .result-notice {
                margin: 18px -13px -13px !important;
                padding: 12px 13px !important;
            }

            .diabetes-page .probability-value {
                font-size: 32px !important;
            }
        }
    `;

        document.head.appendChild(style);

        return () => {
            style.remove();
        };
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
            <DoctorNavbar />
            

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