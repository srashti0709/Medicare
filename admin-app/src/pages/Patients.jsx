
import { useEffect, useState } from "react";
import api from "../api";

/*
 * Medicare Patients Page
 * Standardized with Medicare Dashboard / Doctors page design.
 * Functionality and API logic preserved.
 */

const fontStyles = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;600;700&family=Manrope:wght@400;500;600;700&display=swap');

.medicare-patients {
    font-family: 'Manrope', ui-sans-serif, system-ui, sans-serif;
    color: #0A1F1C;
    -webkit-font-smoothing: antialiased;
}

.medicare-patients .md-display {
    font-family: 'Bricolage Grotesque', 'Manrope', ui-sans-serif, system-ui, sans-serif;
    letter-spacing: -0.02em;
}

.medicare-patients button,
.medicare-patients input {
    font-family: inherit;
}

@keyframes md-spin {
    to {
        transform: rotate(360deg);
    }
}

@keyframes md-modal-in {
    from {
        opacity: 0;
        transform: translateY(10px) scale(0.99);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

.medicare-patients .md-spinner {
    animation: md-spin 0.8s linear infinite;
}

.medicare-patients .md-modal {
    animation: md-modal-in 0.18s ease-out;
}

.medicare-patients ::-webkit-scrollbar {
    width: 7px;
    height: 7px;
}

.medicare-patients ::-webkit-scrollbar-track {
    background: #E7F4F1;
}

.medicare-patients ::-webkit-scrollbar-thumb {
    background: #9ADBD3;
    border-radius: 999px;
}

@media (prefers-reduced-motion: reduce) {
    .medicare-patients .md-spinner,
    .medicare-patients .md-modal {
        animation: none;
    }
}
    
/* =========================================
   RESPONSIVE PATIENTS PAGE
========================================= */

/* Tablets and mobile */
@media (max-width: 767px) {
    .medicare-patients-responsive > div:first-of-type {
        padding: 20px 14px;
    }

    .medicare-patients-responsive > div:first-of-type > div {
        gap: 20px;
    }

    /* Page heading */
    .medicare-patients-responsive h2.md-display {
        font-size: 25px;
        line-height: 32px;
    }

    .medicare-patients-responsive > div:first-of-type > div > div:first-child > p {
        font-size: 13px;
        line-height: 20px;
    }

    .medicare-patients-responsive > div:first-of-type > div > div:last-child {
        width: 100%;
    }

    .medicare-patients-responsive > div:first-of-type > div > div:last-child button {
        width: 100%;
        justify-content: center;
        min-height: 44px;
    }

    /* Statistics */
    .medicare-patients-responsive .grid.grid-cols-1.sm\:grid-cols-2.xl\:grid-cols-4 {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
    }

    .medicare-patients-responsive .grid.grid-cols-1.sm\:grid-cols-2.xl\:grid-cols-4 > div {
        padding: 14px;
        min-width: 0;
    }

    .medicare-patients-responsive .grid.grid-cols-1.sm\:grid-cols-2.xl\:grid-cols-4 > div > div:first-child {
        gap: 8px;
    }

    .medicare-patients-responsive .grid.grid-cols-1.sm\:grid-cols-2.xl\:grid-cols-4 > div > div:first-child > div:last-child {
        width: 36px;
        height: 36px;
        flex-shrink: 0;
    }

    .medicare-patients-responsive .grid.grid-cols-1.sm\:grid-cols-2.xl\:grid-cols-4 .md-display {
        font-size: 25px;
        line-height: 32px;
    }

    .medicare-patients-responsive .grid.grid-cols-1.sm\:grid-cols-2.xl\:grid-cols-4 > div > div:first-child span:first-child {
        font-size: 10px;
        line-height: 15px;
    }

    .medicare-patients-responsive .grid.grid-cols-1.sm\:grid-cols-2.xl\:grid-cols-4 > div > div:last-child {
        font-size: 11px;
        line-height: 16px;
        margin-top: 12px;
    }

    /* Patient registry table */
    .medicare-patients-responsive .overflow-x-auto {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
    }

    .medicare-patients-responsive table {
        min-width: 1050px;
    }

    .medicare-patients-responsive table th,
    .medicare-patients-responsive table td {
        padding: 12px 14px;
    }

    .medicare-patients-responsive table td button {
        min-height: 38px;
    }

    /* Table footer */
    .medicare-patients-responsive .border-t.border-\[\#EDF2F1\] {
        padding: 13px 14px;
    }

    /* Empty and loading states */
    .medicare-patients-responsive .text-center.px-10.py-20 {
        padding: 48px 18px;
    }

    /* Modals */
    .medicare-patients-responsive .fixed.inset-0.z-50 {
        padding: 12px;
        align-items: center;
        overflow-y: auto;
    }

    .medicare-patients-responsive .md-modal {
        width: 100%;
        max-width: 100%;
        max-height: calc(100dvh - 24px);
        overflow-y: auto;
        border-radius: 16px;
    }

    .medicare-patients-responsive .md-modal > div.px-6.py-5 {
        padding: 15px;
        gap: 10px;
    }

    .medicare-patients-responsive .md-modal > div.px-6.py-6,
    .medicare-patients-responsive .md-modal form {
        padding: 16px;
    }

    .medicare-patients-responsive .md-modal h3 {
        font-size: 18px;
        line-height: 24px;
    }

    .medicare-patients-responsive .md-modal .flex.items-center.justify-between.gap-5 {
        gap: 12px;
    }

    .medicare-patients-responsive .md-modal .flex.items-center.justify-between.gap-5 > span:last-child {
        max-width: 60%;
        overflow-wrap: anywhere;
    }

    .medicare-patients-responsive .md-modal input {
        min-height: 44px;
        font-size: 16px;
    }

    .medicare-patients-responsive .md-modal button {
        min-height: 42px;
    }
}

/* Small phones */
@media (max-width: 480px) {
    .medicare-patients-responsive > div:first-of-type {
        padding: 16px 11px;
    }

    .medicare-patients-responsive .grid.grid-cols-1.sm\:grid-cols-2.xl\:grid-cols-4 {
        gap: 10px;
    }

    .medicare-patients-responsive .grid.grid-cols-1.sm\:grid-cols-2.xl\:grid-cols-4 > div {
        padding: 12px 10px;
        border-radius: 14px;
    }

    .medicare-patients-responsive .grid.grid-cols-1.sm\:grid-cols-2.xl\:grid-cols-4 .md-display {
        font-size: 23px;
    }

    .medicare-patients-responsive .grid.grid-cols-1.sm\:grid-cols-2.xl\:grid-cols-4 > div > div:first-child > div:last-child {
        width: 32px;
        height: 32px;
    }

    .medicare-patients-responsive .grid.grid-cols-1.sm\:grid-cols-2.xl\:grid-cols-4 > div > div:last-child {
        font-size: 10px;
        line-height: 15px;
    }

    .medicare-patients-responsive .md-modal > div.px-6.py-5 {
        padding: 12px;
    }

    .medicare-patients-responsive .md-modal > div.px-6.py-6,
    .medicare-patients-responsive .md-modal form {
        padding: 13px;
    }

    .medicare-patients-responsive .md-modal .flex.items-center.gap-4.p-4 {
        align-items: flex-start;
        gap: 10px;
        padding: 12px;
    }

    .medicare-patients-responsive .md-modal .flex.items-center.gap-4.p-4 h4 {
        overflow-wrap: anywhere;
    }

    .medicare-patients-responsive .md-modal .flex.gap-3.pt-5 {
        flex-direction: column-reverse;
    }

    .medicare-patients-responsive .md-modal .flex.gap-3.pt-5 button {
        width: 100%;
        flex: none;
    }

    .medicare-patients-responsive .md-modal .flex.items-center.justify-between.gap-5 > span:last-child {
        max-width: 55%;
        font-size: 13px;
    }
}

/* Extra-small phones */
@media (max-width: 360px) {
    .medicare-patients-responsive .grid.grid-cols-1.sm\:grid-cols-2.xl\:grid-cols-4 {
        grid-template-columns: minmax(0, 1fr);
    }

    .medicare-patients-responsive .grid.grid-cols-1.sm\:grid-cols-2.xl\:grid-cols-4 > div {
        padding: 15px;
    }

    .medicare-patients-responsive .grid.grid-cols-1.sm\:grid-cols-2.xl\:grid-cols-4 > div > div:last-child {
        font-size: 12px;
    }
}

`;

const inputClass =
    "w-full bg-[#F5FAF8] border border-[#D5E5E1] rounded-xl px-3.5 py-2.5 text-base text-[#0A1F1C] placeholder:text-[#78908C] outline-none transition focus:border-[#256862] focus:ring-2 focus:ring-[#ADEFE7]/60";

const labelClass =
    "block text-base font-bold uppercase tracking-wider text-[#164B4D] mb-2";

const cardClass =
    "bg-white rounded-2xl shadow-[0_4px_18px_rgba(22,75,77,0.06)]";

const Patients = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [viewLoading, setViewLoading] = useState(false);
    const [editingPatient, setEditingPatient] = useState(null);
    const [editName, setEditName] = useState("");
    const [editEmail, setEditEmail] = useState("");
    const [saving, setSaving] = useState(false);
    const [statusLoading, setStatusLoading] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(null);

    const fetchPatients = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("adminToken");

            const response = await api.get("/users", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setPatients(response.data.patients);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to fetch patients"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    const handleViewPatient = async (patientId) => {
        try {
            setViewLoading(true);

            const token = localStorage.getItem("adminToken");

            const response = await api.get(
                `/users/patient/${patientId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setSelectedPatient(response.data.patient);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to fetch patient details"
            );
        } finally {
            setViewLoading(false);
        }
    };

    const handleEditPatient = (patient) => {
        setEditingPatient(patient);
        setEditName(patient.name || "");
        setEditEmail(patient.email || "");
        setError("");
    };

    const handleUpdatePatient = async (e) => {
        e.preventDefault();

        if (!editName.trim() || !editEmail.trim()) {
            setError("Name and email are required.");
            return;
        }

        try {
            setSaving(true);
            setError("");

            const token = localStorage.getItem("adminToken");

            const response = await api.patch(
                `/users/patient/${editingPatient._id}`,
                {
                    name: editName.trim(),
                    email: editEmail.trim(),
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const updatedPatient = response.data.patient;

            setPatients((currentPatients) =>
                currentPatients.map((patient) =>
                    patient._id === updatedPatient._id
                        ? updatedPatient
                        : patient
                )
            );

            setEditingPatient(null);
            setEditName("");
            setEditEmail("");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to update patient"
            );
        } finally {
            setSaving(false);
        }
    };

    const handleToggleStatus = async (patientId) => {
        try {
            setStatusLoading(patientId);
            setError("");

            const token = localStorage.getItem("adminToken");

            const response = await api.patch(
                `/users/patient/${patientId}/toggle-status`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const updatedPatient = response.data.patient;

            setPatients((currentPatients) =>
                currentPatients.map((patient) =>
                    patient._id === updatedPatient.id
                        ? {
                            ...patient,
                            isActive: updatedPatient.isActive,
                        }
                        : patient
                )
            );
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to update patient status"
            );
        } finally {
            setStatusLoading(null);
        }
    };

    const handleDeletePatient = async (patientId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this patient?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeleteLoading(patientId);
            setError("");

            const token = localStorage.getItem("adminToken");

            await api.delete(`/users/patient/${patientId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setPatients((currentPatients) =>
                currentPatients.filter(
                    (patient) => patient._id !== patientId
                )
            );
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to delete patient"
            );
        } finally {
            setDeleteLoading(null);
        }
    };

    const totalPatients = patients.length;

    const activePatients = patients.filter(
        (patient) => patient.isActive !== false
    ).length;

    const inactivePatients = patients.filter(
        (patient) => patient.isActive === false
    ).length;

    const newThisMonth = patients.filter((patient) => {
        if (!patient.createdAt) return false;

        const createdDate = new Date(patient.createdAt);
        const now = new Date();

        return (
            createdDate.getMonth() === now.getMonth() &&
            createdDate.getFullYear() === now.getFullYear()
        );
    }).length;

    return (
       <div className="medicare-patients medicare-patients-responsive min-h-full">
            <style>{fontStyles}</style>

            <div className="p-6 xl:p-8">
                <div className="max-w-[1450px] mx-auto space-y-6">

                    {/* PAGE HEADER */}
                    <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-base font-bold uppercase tracking-[0.18em] text-[#256862]">
                                    Patient Registry
                                </span>

                                <span className="w-1.5 h-1.5 rounded-full bg-[#256862]" />
                            </div>

                            <h2 className="md-display text-[25px] leading-tight font-semibold text-[#164B4D]">
                                Patients
                            </h2>

                            <p className="text-base text-[#526563] mt-1">
                                Manage registered patients and monitor their
                                healthcare records.
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#D5E5E1] text-[#164B4D] text-base font-semibold shadow-[0_2px_8px_rgba(22,75,77,0.04)] hover:bg-[#F2F8F6] transition-colors"
                            >
                                <span className="material-symbols-outlined text-[18px]">
                                    file_download
                                </span>

                                Export Registry
                            </button>
                        </div>
                    </div>

                    {/* ERROR */}
                    {error && (
                        <div
                            role="alert"
                            className="flex items-start gap-3 bg-[#FDF1EA] border border-[#F5CDB8] border-l-4 border-l-[#F28B5B] text-[#8F3A17] px-4 py-3 rounded-xl text-base font-medium"
                        >
                            <span className="material-symbols-outlined text-[19px] text-[#F28B5B]">
                                error
                            </span>

                            <span>{error}</span>
                        </div>
                    )}

                    {/* STATISTICS */}
                    {!loading && patients.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

                            {/* TOTAL */}
                            <div className={`${cardClass} p-5`}>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <span className="text-base font-bold uppercase tracking-wider text-[#667876]">
                                            Total Patients
                                        </span>

                                        <div className="md-display text-[30px] leading-10 font-bold text-[#164B4D] mt-1">
                                            {totalPatients}
                                        </div>
                                    </div>

                                    <div className="w-11 h-11 rounded-xl bg-[#DDF3EF] flex items-center justify-center text-[#256862]">
                                        <span className="material-symbols-outlined text-[23px]">
                                            group
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-4 flex items-center gap-1.5 text-base text-[#667876]">
                                    <span className="material-symbols-outlined text-[16px] text-[#256862]">
                                        groups
                                    </span>

                                    Registered patient records
                                </div>
                            </div>

                            {/* NEW THIS MONTH */}
                            <div className={`${cardClass} p-5`}>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <span className="text-base font-bold uppercase tracking-wider text-[#667876]">
                                            New This Month
                                        </span>

                                        <div className="md-display text-[30px] leading-10 font-bold text-[#164B4D] mt-1">
                                            {newThisMonth}
                                        </div>
                                    </div>

                                    <div className="w-11 h-11 rounded-xl bg-[#DDF3EF] flex items-center justify-center text-[#256862]">
                                        <span className="material-symbols-outlined text-[22px]">
                                            person_add
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-4 flex items-center gap-1.5 text-base text-[#667876]">
                                    <span className="material-symbols-outlined text-[16px] text-[#256862]">
                                        calendar_month
                                    </span>

                                    Current month registrations
                                </div>
                            </div>

                            {/* ACTIVE */}
                            <div className={`${cardClass} p-5`}>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <span className="text-base font-bold uppercase tracking-wider text-[#667876]">
                                            Active Patients
                                        </span>

                                        <div className="md-display text-[30px] leading-10 font-bold text-[#164B4D] mt-1">
                                            {activePatients}
                                        </div>
                                    </div>

                                    <div className="w-11 h-11 rounded-xl bg-[#D6EDE8] flex items-center justify-center text-[#164B4D]">
                                        <span className="material-symbols-outlined text-[24px]">
                                            vital_signs
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-4 flex items-center gap-2 text-base text-[#667876]">
                                    <span className="w-2 h-2 rounded-full bg-[#2E9C8F]" />

                                    Currently active accounts
                                </div>
                            </div>

                            {/* INACTIVE */}
                            <div className={`${cardClass} p-5`}>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <span className="text-base font-bold uppercase tracking-wider text-[#667876]">
                                            Inactive Patients
                                        </span>

                                        <div className="md-display text-[30px] leading-10 font-bold text-[#164B4D] mt-1">
                                            {inactivePatients}
                                        </div>
                                    </div>

                                    <div className="w-11 h-11 rounded-xl bg-[#FFE3D5] flex items-center justify-center text-[#8F3A17]">
                                        <span className="material-symbols-outlined text-[22px]">
                                            person_off
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-4 flex items-center gap-1.5 text-base text-[#667876]">
                                    <span className="material-symbols-outlined text-[16px] text-[#F28B5B]">
                                        info
                                    </span>

                                    Deactivated accounts
                                </div>
                            </div>
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
                                    stroke="#DCEBE7"
                                    strokeWidth="3"
                                />

                                <path
                                    d="M21 12a9 9 0 00-9-9"
                                    stroke="#164B4D"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                />
                            </svg>

                            <p className="text-base font-medium text-[#526563]">
                                Loading patients...
                            </p>
                        </div>
                    ) : patients.length === 0 ? (
                        /* EMPTY STATE */
                        <div className="bg-white rounded-2xl border border-dashed border-[#BFD3CF] px-10 py-20 text-center shadow-[0_4px_18px_rgba(22,75,77,0.06)]">
                            <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-[#DDEEEA] text-[#164B4D] flex items-center justify-center">
                                <span className="material-symbols-outlined text-[28px]">
                                    group_off
                                </span>
                            </div>

                            <p className="md-display text-lg font-semibold text-[#164B4D]">
                                No patients found
                            </p>

                            <p className="text-base text-[#667876] mt-1">
                                Patient records will appear here once
                                registered.
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* PATIENT REGISTRY */}
                            <div className="bg-white rounded-2xl shadow-[0_8px_24px_rgba(22,75,77,0.06)] overflow-hidden">

                                {/* TABLE */}
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse min-w-[1050px]">
                                        <thead>
                                            <tr className="bg-[#F2F8F6] border-b border-[#D5E5E1]">
                                                <th className="py-3.5 px-5 text-base font-bold uppercase tracking-[0.12em] text-[#667876]">
                                                    Patient
                                                </th>

                                                <th className="py-3.5 px-5 text-base font-bold uppercase tracking-[0.12em] text-[#667876]">
                                                    Email
                                                </th>

                                                <th className="py-3.5 px-5 text-base font-bold uppercase tracking-[0.12em] text-[#667876] whitespace-nowrap">
                                                    Registered
                                                </th>

                                                <th className="py-3.5 px-5 text-base font-bold uppercase tracking-[0.12em] text-[#667876]">
                                                    Status
                                                </th>

                                                <th className="py-3.5 px-5 text-base font-bold uppercase tracking-[0.12em] text-[#667876] text-right">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody className="divide-y divide-[#EDF2F1]">
                                            {patients.map((patient) => (
                                                <tr
                                                    key={patient._id}
                                                    className="group hover:bg-[#F2F8F6] transition-colors"
                                                >
                                                    {/* PATIENT */}
                                                    <td className="py-4 px-5">
                                                        <div className="flex items-center gap-3 min-w-[220px]">
                                                            <div className="relative shrink-0">
                                                                <div className="md-display relative w-11 h-11 overflow-hidden rounded-full bg-[#ADEFE7]/55 text-[#164B4D] flex items-center justify-center text-base font-bold ring-1 ring-[#C4E8E2]">
                                                                    <span>
                                                                        {patient.name?.charAt(0).toUpperCase()}
                                                                    </span>

                                                                    {patient.profileImage && (
                                                                        <img
                                                                            src={patient.profileImage}
                                                                            alt={patient.name}
                                                                            className="absolute inset-0 w-full h-full object-cover"
                                                                            onError={(e) => {
                                                                                e.currentTarget.style.display = "none";
                                                                            }}
                                                                        />
                                                                    )}
                                                                </div>

                                                                <span
                                                                    className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-white ${patient.isActive === false
                                                                        ? "bg-[#F28B5B]"
                                                                        : "bg-[#2E9C8F]"
                                                                        }`}
                                                                />
                                                            </div>

                                                            <div className="min-w-0">
                                                                <p className="text-base font-bold text-[#164B4D] truncate">
                                                                    {patient.name}
                                                                </p>

                                                                <p className="text-base text-[#78908C] mt-0.5 truncate">
                                                                    Patient Record
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* EMAIL */}
                                                    <td className="py-4 px-5">
                                                        <span className="text-base font-semibold text-[#0A1F1C]">
                                                            {patient.email}
                                                        </span>
                                                    </td>

                                                    {/* REGISTERED */}
                                                    <td className="py-4 px-5 whitespace-nowrap">
                                                        <span className="text-base text-[#667876] tabular-nums">
                                                            {new Date(
                                                                patient.createdAt
                                                            ).toLocaleDateString()}
                                                        </span>
                                                    </td>

                                                    {/* STATUS */}
                                                    <td className="py-4 px-5">
                                                        <span
                                                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-base font-bold ${patient.isActive === false
                                                                ? "bg-[#FFF0E8] text-[#A9532A]"
                                                                : "bg-[#ADEFE7]/45 text-[#256862]"
                                                                }`}
                                                        >
                                                            <span
                                                                className={`w-2 h-2 rounded-full ${patient.isActive === false
                                                                    ? "bg-[#F28B5B]"
                                                                    : "bg-[#256862]"
                                                                    }`}
                                                            />

                                                            {patient.isActive === false
                                                                ? "Inactive"
                                                                : "Active"}
                                                        </span>
                                                    </td>

                                                    {/* ACTIONS */}
                                                    <td className="py-4 px-5">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleViewPatient(
                                                                        patient._id
                                                                    )
                                                                }
                                                                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#F2F8F6] text-[#164B4D] text-base font-bold hover:bg-[#ADEFE7] transition-colors"
                                                            >
                                                                <span className="material-symbols-outlined text-[17px]">
                                                                    visibility
                                                                </span>
                                                                View
                                                            </button>

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleEditPatient(
                                                                        patient
                                                                    )
                                                                }
                                                                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#F2F8F6] text-[#164B4D] text-base font-bold hover:bg-[#ADEFE7] transition-colors"
                                                            >
                                                                <span className="material-symbols-outlined text-[17px]">
                                                                    edit_note
                                                                </span>
                                                                Edit
                                                            </button>

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleToggleStatus(
                                                                        patient._id
                                                                    )
                                                                }
                                                                disabled={
                                                                    statusLoading ===
                                                                    patient._id
                                                                }
                                                                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-base font-bold transition-colors disabled:opacity-50 ${patient.isActive
                                                                    ? "bg-[#FFF0E8] text-[#A9532A] hover:bg-[#FADBCB]"
                                                                    : "bg-[#164B4D] text-white hover:bg-[#003435]"
                                                                    }`}
                                                            >
                                                                {statusLoading === patient._id
                                                                    ? "Updating..."
                                                                    : patient.isActive === false
                                                                        ? "Activate"
                                                                        : "Deactivate"}
                                                            </button>

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleDeletePatient(
                                                                        patient._id
                                                                    )
                                                                }
                                                                disabled={
                                                                    deleteLoading ===
                                                                    patient._id
                                                                }
                                                                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FFF0E8] text-[#A9532A] text-base font-bold hover:bg-[#FADBCB] transition-colors disabled:opacity-50"
                                                            >
                                                                <span className="material-symbols-outlined text-[17px]">
                                                                    delete
                                                                </span>
                                                                {deleteLoading === patient._id
                                                                    ? "Deleting..."
                                                                    : "Delete"}
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* TABLE FOOTER */}
                                <div className="px-5 py-3.5 border-t border-[#EDF2F1] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                    <p className="text-base text-[#667876]">
                                        Showing{" "}
                                        <span className="font-bold text-[#164B4D]">
                                            1–{patients.length}
                                        </span>{" "}
                                        of{" "}
                                        <span className="font-bold text-[#164B4D]">
                                            {patients.length}
                                        </span>{" "}
                                        patients
                                    </p>

                                    <span className="text-base font-semibold text-[#667876]">
                                        Active patient registry
                                    </span>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* PATIENT DETAILS MODAL */}
            {selectedPatient && (
                <div className="fixed inset-0 bg-[#0F3437]/65 backdrop-blur-[3px] flex items-center justify-center p-4 z-50">
                    <div className="md-modal bg-white w-full max-w-lg rounded-2xl shadow-[0_24px_60px_-12px_rgba(15,52,55,0.45)] overflow-hidden">

                        <div className="h-1.5 bg-gradient-to-r from-[#164B4D] via-[#2E9C8F] to-[#9ADBD3]" />

                        <div className="flex items-center justify-between px-6 py-5 bg-[#F2F8F6] border-b border-[#E7EFED]">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[#D7EEE9] text-[#164B4D] flex items-center justify-center">
                                    <span className="material-symbols-outlined">
                                        clinical_notes
                                    </span>
                                </div>

                                <div>
                                    <h3 className="md-display text-xl font-semibold text-[#164B4D]">
                                        Patient Details
                                    </h3>

                                    <p className="text-base text-[#718884]">
                                        Patient profile information
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedPatient(null)
                                }
                                className="w-9 h-9 flex items-center justify-center rounded-xl text-[#718884] hover:text-[#164B4D] hover:bg-[#DCEBE7] transition-colors"
                            >
                                <span className="material-symbols-outlined">
                                    close
                                </span>
                            </button>
                        </div>

                        <div className="px-6 py-6">
                            {viewLoading ? (
                                <div className="py-10 text-center">
                                    <svg
                                        className="md-spinner w-7 h-7 mx-auto mb-3 text-[#164B4D]"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                    >
                                        <circle
                                            cx="12"
                                            cy="12"
                                            r="9"
                                            stroke="#DCEBE7"
                                            strokeWidth="3"
                                        />

                                        <path
                                            d="M21 12a9 9 0 00-9-9"
                                            stroke="#164B4D"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                        />
                                    </svg>

                                    <p className="text-base font-medium text-[#526563]">
                                        Loading patient...
                                    </p>
                                </div>
                            ) : (
                                <div>
                                    {/* IDENTITY */}
                                    <div className="flex items-center gap-4 p-4 rounded-xl bg-[#F2F8F6] mb-5">
                                        <div className="md-display w-14 h-14 shrink-0 overflow-hidden rounded-full bg-[#D7EEE9] text-[#164B4D] flex items-center justify-center text-lg font-bold ring-2 ring-[#9ADBD3]">
                                            {selectedPatient.profileImage ? (
                                                <img
                                                    src={selectedPatient.profileImage}
                                                    alt={selectedPatient.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = "none";
                                                    }}
                                                />
                                            ) : (
                                                selectedPatient.name?.charAt(0).toUpperCase()
                                            )}
                                        </div>

                                        <div>
                                            <h4 className="md-display text-lg font-bold text-[#164B4D]">
                                                {selectedPatient.name}
                                            </h4>

                                            <p className="text-base text-[#718884] mt-0.5">
                                                {selectedPatient.email}
                                            </p>
                                        </div>
                                    </div>

                                    {/* DETAILS */}
                                    <div>
                                        <div className="flex items-center justify-between gap-5 py-3.5 border-b border-[#E7EFED]">
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-[18px] text-[#718884]">
                                                    person
                                                </span>

                                                <span className="text-base font-medium text-[#5B7773]">
                                                    Name
                                                </span>
                                            </div>

                                            <span className="font-semibold text-[#0F3437] text-right">
                                                {selectedPatient.name}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between gap-5 py-3.5 border-b border-[#E7EFED]">
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-[18px] text-[#718884]">
                                                    mail
                                                </span>

                                                <span className="text-base font-medium text-[#5B7773]">
                                                    Email
                                                </span>
                                            </div>

                                            <span className="text-[#37595A] text-right break-all text-base">
                                                {selectedPatient.email}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between gap-5 py-3.5 border-b border-[#E7EFED]">
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-[18px] text-[#718884]">
                                                    badge
                                                </span>

                                                <span className="text-base font-medium text-[#5B7773]">
                                                    Account Type
                                                </span>
                                            </div>

                                            <span className="text-[#37595A] capitalize text-right text-base">
                                                {selectedPatient.role}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between gap-5 py-3.5 border-b border-[#E7EFED]">
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-[18px] text-[#718884]">
                                                    verified
                                                </span>

                                                <span className="text-base font-medium text-[#5B7773]">
                                                    Status
                                                </span>
                                            </div>

                                            <span
                                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-base font-bold ${selectedPatient.isActive ===
                                                    false
                                                    ? "bg-[#FFE8DC] text-[#963E18]"
                                                    : "bg-[#DDF3EF] text-[#164B4D]"
                                                    }`}
                                            >
                                                <span
                                                    className={`w-1.5 h-1.5 rounded-full ${selectedPatient.isActive ===
                                                        false
                                                        ? "bg-[#F28B5B]"
                                                        : "bg-[#2E9C8F]"
                                                        }`}
                                                />

                                                {selectedPatient.isActive ===
                                                    false
                                                    ? "Inactive"
                                                    : "Active"}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between gap-5 py-3.5">
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-[18px] text-[#718884]">
                                                    calendar_month
                                                </span>

                                                <span className="text-base font-medium text-[#5B7773]">
                                                    Registered On
                                                </span>
                                            </div>

                                            <span className="text-[#37595A] text-right tabular-nums text-base">
                                                {new Date(
                                                    selectedPatient.createdAt
                                                ).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setSelectedPatient(null)
                                        }
                                        className="w-full mt-5 px-4 py-2.5 rounded-xl bg-[#164B4D] hover:bg-[#0F3437] text-white text-base font-semibold transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* EDIT PATIENT MODAL */}
            {editingPatient && (
                <div className="fixed inset-0 bg-[#0F3437]/65 backdrop-blur-[3px] flex items-center justify-center p-4 z-50">
                    <div className="md-modal bg-white w-full max-w-lg rounded-2xl shadow-[0_24px_60px_-12px_rgba(15,52,55,0.45)] overflow-hidden">

                        <div className="h-1.5 bg-gradient-to-r from-[#164B4D] via-[#2E9C8F] to-[#9ADBD3]" />

                        <div className="flex items-center justify-between px-6 py-5 bg-[#F2F8F6] border-b border-[#E7EFED]">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[#D7EEE9] text-[#164B4D] flex items-center justify-center">
                                    <span className="material-symbols-outlined">
                                        edit_note
                                    </span>
                                </div>

                                <div>
                                    <h3 className="md-display text-xl font-semibold text-[#164B4D]">
                                        Edit Patient
                                    </h3>

                                    <p className="text-base text-[#718884]">
                                        Update patient information
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setEditingPatient(null)
                                }
                                className="w-9 h-9 flex items-center justify-center rounded-xl text-[#718884] hover:text-[#164B4D] hover:bg-[#DCEBE7] transition-colors"
                            >
                                <span className="material-symbols-outlined">
                                    close
                                </span>
                            </button>
                        </div>

                        <form
                            onSubmit={handleUpdatePatient}
                            className="space-y-5 px-6 py-6"
                        >
                            {/* NAME */}
                            <div>
                                <label className={labelClass}>
                                    Full Name
                                </label>

                                <input
                                    type="text"
                                    value={editName}
                                    onChange={(e) =>
                                        setEditName(e.target.value)
                                    }
                                    required
                                    className={inputClass}
                                />
                            </div>

                            {/* EMAIL */}
                            <div>
                                <label className={labelClass}>
                                    Email
                                </label>

                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#718884] text-base">
                                        mail
                                    </span>

                                    <input
                                        type="email"
                                        value={editEmail}
                                        onChange={(e) =>
                                            setEditEmail(e.target.value)
                                        }
                                        required
                                        className={`${inputClass} pl-10`}
                                    />
                                </div>
                            </div>

                            {/* ACTIONS */}
                            <div className="flex gap-3 pt-5 border-t border-[#E7EFED]">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setEditingPatient(null)
                                    }
                                    className="flex-1 px-4 py-2.5 rounded-xl border border-[#CBDAD6] bg-white hover:bg-[#F2F8F6] text-[#164B4D] text-base font-semibold transition-colors"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 px-4 py-2.5 rounded-xl bg-[#164B4D] hover:bg-[#0F3437] disabled:opacity-50 disabled:cursor-not-allowed text-white text-base font-semibold transition-colors flex items-center justify-center gap-2"
                                >
                                    {saving && (
                                        <span className="material-symbols-outlined text-base animate-spin">
                                            progress_activity
                                        </span>
                                    )}

                                    {saving
                                        ? "Saving..."
                                        : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Patients;
