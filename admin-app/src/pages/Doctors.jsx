import { useEffect, useMemo, useState } from "react";
import api from "../api";

/*
 * Medicare Doctors Dashboard
 * UI standardized with Medicare Dashboard.
 * API / functionality preserved.
 */

const fontStyles = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;600;700&family=Manrope:wght@400;500;600;700&display=swap');

.medicare-doctors {
    font-family: 'Manrope', ui-sans-serif, system-ui, sans-serif;
    color: #0A1F1C;
    -webkit-font-smoothing: antialiased;
}

.medicare-doctors .md-display {
    font-family: 'Bricolage Grotesque', 'Manrope', ui-sans-serif, system-ui, sans-serif;
    letter-spacing: -0.02em;
}

.medicare-doctors button,
.medicare-doctors input,
.medicare-doctors textarea,
.medicare-doctors select {
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

.medicare-doctors .md-spinner {
    animation: md-spin 0.8s linear infinite;
}

.medicare-doctors .md-modal {
    animation: md-modal-in 0.18s ease-out;
}

.medicare-doctors ::-webkit-scrollbar {
    width: 7px;
    height: 7px;
}

.medicare-doctors ::-webkit-scrollbar-track {
    background: #E1F8F3;
}

.medicare-doctors ::-webkit-scrollbar-thumb {
    background: #9ADBD3;
    border-radius: 999px;
}

@media (prefers-reduced-motion: reduce) {
    .medicare-doctors .md-spinner,
    .medicare-doctors .md-modal {
        animation: none;
    }
}
`;

const inputClass =
    "w-full bg-[#F2F8F6] border border-[#D5E5E1] rounded-xl px-3.5 py-2.5 text-sm text-[#0A1F1C] placeholder:text-[#78908C] outline-none transition focus:border-[#256862] focus:ring-2 focus:ring-[#ADEFE7]/60";

const labelClass =
    "block text-[10px] font-bold uppercase tracking-[0.12em] text-[#164B4D] mb-2";

const Doctors = ({ onAddDoctor }) => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [saving, setSaving] = useState(false);

    const [search, setSearch] = useState("");
    const [departmentFilter, setDepartmentFilter] =
        useState("All Departments");
    const [specializationFilter, setSpecializationFilter] =
        useState("All Specializations");
    const [availabilityFilter, setAvailabilityFilter] =
        useState("All Availability");

    const fetchDoctors = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/doctors");

            setDoctors(response.data.doctors);
        } catch (error) {
            setError(
                error.response?.data?.message || "Failed to fetch doctors"
            );
        } finally {
            setLoading(false);
        }
    };

    const updateDoctor = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);

            const token = localStorage.getItem("adminToken");

            const response = await api.patch(
                `/doctors/${selectedDoctor._id}`,
                {
                    name: selectedDoctor.user?.name,
                    specialization: selectedDoctor.specialization,
                    department: selectedDoctor.department,
                    qualification: selectedDoctor.qualification,
                    experience: Number(selectedDoctor.experience),
                    consultationFee: Number(selectedDoctor.consultationFee),
                    phone: selectedDoctor.phone || "",
                    about: selectedDoctor.about || "",
                    isAvailable: selectedDoctor.isAvailable,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setDoctors((currentDoctors) =>
                currentDoctors.map((doctor) =>
                    doctor._id === selectedDoctor._id
                        ? response.data.doctor
                        : doctor
                )
            );

            setSelectedDoctor(null);

            alert("Doctor updated successfully.");
        } catch (error) {
            console.error("Failed to update doctor", error);

            alert(
                error.response?.data?.message ||
                    "Failed to update doctor"
            );
        } finally {
            setSaving(false);
        }
    };

    const toggleAvailability = async (doctorId) => {
        try {
            const token = localStorage.getItem("adminToken");

            const response = await api.patch(
                `/doctors/${doctorId}/toggle-availability`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setDoctors((currentDoctors) =>
                currentDoctors.map((doctor) =>
                    doctor._id === doctorId
                        ? response.data.doctor
                        : doctor
                )
            );

            alert(response.data.message);
        } catch (error) {
            console.error(
                "Failed to update doctor availability",
                error
            );

            alert(
                error.response?.data?.message ||
                    "Failed to update doctor availability"
            );
        }
    };

    useEffect(() => {
        fetchDoctors();
    }, []);

    const departments = useMemo(() => {
        return [
            ...new Set(
                doctors
                    .map((doctor) => doctor.department)
                    .filter(Boolean)
            ),
        ].sort();
    }, [doctors]);

    const specializations = useMemo(() => {
        return [
            ...new Set(
                doctors
                    .map((doctor) => doctor.specialization)
                    .filter(Boolean)
            ),
        ].sort();
    }, [doctors]);

    const totalDoctors = doctors.length;

    const availableDoctors = doctors.filter(
        (doctor) => doctor.isAvailable
    ).length;

    const unavailableDoctors = doctors.filter(
        (doctor) => !doctor.isAvailable
    ).length;

    const availabilityPercentage =
        totalDoctors > 0
            ? Math.round((availableDoctors / totalDoctors) * 100)
            : 0;

    const filteredDoctors = useMemo(() => {
        const query = search.trim().toLowerCase();

        return doctors.filter((doctor) => {
            const name = doctor.user?.name?.toLowerCase() || "";
            const email = doctor.user?.email?.toLowerCase() || "";
            const specialization =
                doctor.specialization?.toLowerCase() || "";
            const department = doctor.department?.toLowerCase() || "";

            const matchesSearch =
                !query ||
                name.includes(query) ||
                email.includes(query) ||
                specialization.includes(query) ||
                department.includes(query);

            const matchesDepartment =
                departmentFilter === "All Departments" ||
                doctor.department === departmentFilter;

            const matchesSpecialization =
                specializationFilter === "All Specializations" ||
                doctor.specialization === specializationFilter;

            const matchesAvailability =
                availabilityFilter === "All Availability" ||
                (availabilityFilter === "Available" &&
                    doctor.isAvailable) ||
                (availabilityFilter === "Unavailable" &&
                    !doctor.isAvailable);

            return (
                matchesSearch &&
                matchesDepartment &&
                matchesSpecialization &&
                matchesAvailability
            );
        });
    }, [
        doctors,
        search,
        departmentFilter,
        specializationFilter,
        availabilityFilter,
    ]);

    const resetFilters = () => {
        setSearch("");
        setDepartmentFilter("All Departments");
        setSpecializationFilter("All Specializations");
        setAvailabilityFilter("All Availability");
    };

    return (
        <div className="medicare-doctors min-h-full">
            <style>{fontStyles}</style>

            {/* PAGE HEADER */}
            <div className="px-6 xl:px-8 pt-6 pb-5">
                <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
                    <div>
                        <div className="flex items-center gap-3 flex-wrap">
                            <h2 className="md-display text-[25px] leading-tight font-semibold text-[#164B4D]">
                                Doctors
                            </h2>

                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ADEFE7] text-[#164B4D] text-[10px] font-bold uppercase tracking-[0.12em]">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#256862]" />
                                Active Roster
                            </span>
                        </div>

                        <p className="text-xs text-[#526563] mt-1.5">
                            Manage doctors, clinical information, availability,
                            and department assignments.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            type="button"
                            onClick={fetchDoctors}
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-[#164B4D] rounded-xl shadow-sm border border-[#DDE9E6] hover:bg-[#E1F8F3] transition-all text-sm font-semibold"
                        >
                            <svg
                                className="w-[17px] h-[17px]"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M20 11a8.1 8.1 0 00-14.9-4L3 10" />
                                <path d="M3 5v5h5" />
                                <path d="M4 13a8.1 8.1 0 0014.9 4L21 14" />
                                <path d="M21 19v-5h-5" />
                            </svg>
                            Refresh
                        </button>

                        <button
                            type="button"
                            onClick={onAddDoctor}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#164B4D] text-white rounded-xl shadow-[0_5px_14px_rgba(0,52,53,0.18)] hover:bg-[#003435] transition-all text-sm font-semibold"
                        >
                            <span className="text-[#ADEFE7] text-lg leading-none">
                                +
                            </span>
                            Add Doctor
                        </button>
                    </div>
                </div>
            </div>

            {/* ERROR */}
            {error && (
                <div className="px-6 xl:px-8">
                    <div
                        role="alert"
                        className="mb-5 flex items-start gap-3 bg-[#FFF4ED] border border-[#F5D1BE] border-l-4 border-l-[#F28B5B] text-[#8F3A17] px-4 py-3 rounded-xl text-sm font-medium"
                    >
                        <svg
                            className="w-5 h-5 mt-0.5 shrink-0 text-[#F28B5B]"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-4a1 1 0 00-1 1v3a1 1 0 002 0V7a1 1 0 00-1-1zm0 8a1 1 0 100-2 1 1 0 000 2z"
                                clipRule="evenodd"
                            />
                        </svg>

                        <span>{error}</span>
                    </div>
                </div>
            )}

            {/* KPI CARDS */}
            {!loading && doctors.length > 0 && (
                <div className="px-6 xl:px-8 pb-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                        {/* Total */}
                        <div className="bg-white rounded-2xl p-5 shadow-[0_8px_24px_rgba(22,75,77,0.06)] flex items-center justify-between">
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#667876]">
                                    Total Physicians
                                </span>

                                <div className="flex items-baseline gap-2 mt-1">
                                    <span className="md-display text-[30px] font-semibold text-[#003435]">
                                        {totalDoctors}
                                    </span>
                                </div>

                                <span className="text-xs text-[#256862] font-semibold">
                                    {departments.length}{" "}
                                    {departments.length === 1
                                        ? "Department"
                                        : "Departments"}
                                </span>
                            </div>

                            <div className="w-12 h-12 rounded-xl bg-[#E1F8F3] text-[#164B4D] flex items-center justify-center">
                                <svg
                                    className="w-6 h-6"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                >
                                    <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M22 21v-2a4 4 0 00-3-3.87" />
                                    <path d="M16 3.13a4 4 0 010 7.75" />
                                </svg>
                            </div>
                        </div>

                        {/* Available */}
                        <div className="bg-white rounded-2xl p-5 shadow-[0_8px_24px_rgba(22,75,77,0.06)] flex items-center justify-between">
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#667876]">
                                    On-Duty / Ready
                                </span>

                                <div className="flex items-baseline gap-2 mt-1">
                                    <span className="md-display text-[30px] font-semibold text-[#003435]">
                                        {availableDoctors}
                                    </span>

                                    <span className="text-xs text-[#256862] font-bold">
                                        {availabilityPercentage}%
                                    </span>
                                </div>

                                <span className="text-xs text-[#667876]">
                                    Available for appointments
                                </span>
                            </div>

                            <div className="w-12 h-12 rounded-xl bg-[#ADEFE7]/45 text-[#256862] flex items-center justify-center">
                                <svg
                                    className="w-6 h-6"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <circle cx="12" cy="12" r="9" />
                                    <path d="M8 12l2.5 2.5L16 9" />
                                </svg>
                            </div>
                        </div>

                        {/* Unavailable */}
                        <div className="bg-white rounded-2xl p-5 shadow-[0_8px_24px_rgba(22,75,77,0.06)] flex items-center justify-between">
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#667876]">
                                    Unavailable
                                </span>

                                <div className="flex items-baseline gap-2 mt-1">
                                    <span className="md-display text-[30px] font-semibold text-[#C35E2C]">
                                        {unavailableDoctors}
                                    </span>

                                    <span className="text-xs text-[#A55A38] font-semibold">
                                        Off-duty
                                    </span>
                                </div>

                                <span className="text-xs text-[#667876]">
                                    Currently unavailable
                                </span>
                            </div>

                            <div className="w-12 h-12 rounded-xl bg-[#FFF0E8] text-[#C35E2C] flex items-center justify-center">
                                <svg
                                    className="w-6 h-6"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                    strokeLinecap="round"
                                >
                                    <circle cx="12" cy="12" r="9" />
                                    <path d="M8.5 8.5l7 7" />
                                    <path d="M15.5 8.5l-7 7" />
                                </svg>
                            </div>
                        </div>

                        {/* Departments */}
                        <div className="bg-white rounded-2xl p-5 shadow-[0_8px_24px_rgba(22,75,77,0.06)] flex items-center justify-between">
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#667876]">
                                    Departments
                                </span>

                                <div className="flex items-baseline gap-2 mt-1">
                                    <span className="md-display text-[30px] font-semibold text-[#003435]">
                                        {departments.length}
                                    </span>
                                </div>

                                <span className="text-xs text-[#667876]">
                                    Clinical departments
                                </span>
                            </div>

                            <div className="w-12 h-12 rounded-xl bg-[#E1F8F3] text-[#164B4D] flex items-center justify-center">
                                <svg
                                    className="w-6 h-6"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <rect
                                        x="3"
                                        y="4"
                                        width="18"
                                        height="16"
                                        rx="2"
                                    />
                                    <path d="M8 8h8" />
                                    <path d="M8 12h8" />
                                    <path d="M8 16h5" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* LOADING */}
            {loading ? (
                <div className="px-6 xl:px-8 pb-8">
                    <div className="bg-white rounded-2xl shadow-[0_8px_24px_rgba(22,75,77,0.06)] px-10 py-20 text-center">
                        <svg
                            className="md-spinner w-7 h-7 mx-auto mb-4 text-[#164B4D]"
                            viewBox="0 0 24 24"
                            fill="none"
                        >
                            <circle
                                cx="12"
                                cy="12"
                                r="9"
                                stroke="#D8EAE6"
                                strokeWidth="3"
                            />
                            <path
                                d="M21 12a9 9 0 00-9-9"
                                stroke="#164B4D"
                                strokeWidth="3"
                                strokeLinecap="round"
                            />
                        </svg>

                        <p className="text-sm font-semibold text-[#526563]">
                            Loading doctors...
                        </p>

                        <p className="text-xs text-[#667876] mt-1">
                            Preparing the active roster
                        </p>
                    </div>
                </div>
            ) : doctors.length === 0 ? (
                /* EMPTY STATE */
                <div className="px-6 xl:px-8 pb-8">
                    <div className="bg-white rounded-2xl border border-dashed border-[#BFD8D3] px-10 py-20 text-center">
                        <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-[#E1F8F3] text-[#164B4D] flex items-center justify-center">
                            <svg
                                className="w-7 h-7"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.6"
                            >
                                <circle cx="12" cy="8" r="3.5" />
                                <path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" />
                            </svg>
                        </div>

                        <h3 className="md-display text-lg font-semibold text-[#003435]">
                            No doctors found
                        </h3>

                        <p className="text-sm text-[#667876] mt-1">
                            Add a doctor to begin building your active roster.
                        </p>

                        <button
                            type="button"
                            onClick={onAddDoctor}
                            className="mt-5 px-5 py-2.5 rounded-xl bg-[#164B4D] text-white text-sm font-semibold hover:bg-[#003435] transition"
                        >
                            + Add Doctor
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    {/* FILTER BAR */}
                    <div className="px-6 xl:px-8 pb-5">
                        <div className="bg-white rounded-2xl shadow-[0_8px_24px_rgba(22,75,77,0.06)] p-5">
                            <div className="flex flex-col xl:flex-row xl:items-center gap-3">
                                {/* Search */}
                                <div className="relative flex-1 min-w-[260px]">
                                    <svg
                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[19px] h-[19px] text-[#667876]"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <circle
                                            cx="11"
                                            cy="11"
                                            r="7"
                                        />
                                        <path d="m20 20-4-4" />
                                    </svg>

                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        placeholder="Search doctors, specialty, department..."
                                        className="w-full pl-10 pr-4 py-2.5 bg-[#F2F8F6] rounded-xl text-sm text-[#0A1F1C] placeholder:text-[#667876] outline-none focus:ring-2 focus:ring-[#ADEFE7] transition"
                                    />
                                </div>

                                {/* Department */}
                                <div className="relative">
                                    <select
                                        value={departmentFilter}
                                        onChange={(e) =>
                                            setDepartmentFilter(
                                                e.target.value
                                            )
                                        }
                                        className="appearance-none min-w-[175px] bg-[#F2F8F6] text-[#0A1F1C] text-sm font-semibold px-3.5 py-2.5 pr-9 rounded-xl outline-none hover:bg-[#E7F3F0] transition cursor-pointer"
                                    >
                                        <option>All Departments</option>

                                        {departments.map((department) => (
                                            <option
                                                key={department}
                                                value={department}
                                            >
                                                {department}
                                            </option>
                                        ))}
                                    </select>

                                    <svg
                                        className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-[#667876]"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path d="m6 9 6 6 6-6" />
                                    </svg>
                                </div>

                                {/* Specialization */}
                                <div className="relative">
                                    <select
                                        value={specializationFilter}
                                        onChange={(e) =>
                                            setSpecializationFilter(
                                                e.target.value
                                            )
                                        }
                                        className="appearance-none min-w-[190px] bg-[#F2F8F6] text-[#0A1F1C] text-sm font-semibold px-3.5 py-2.5 pr-9 rounded-xl outline-none hover:bg-[#E7F3F0] transition cursor-pointer"
                                    >
                                        <option>All Specializations</option>

                                        {specializations.map(
                                            (specialization) => (
                                                <option
                                                    key={specialization}
                                                    value={specialization}
                                                >
                                                    {specialization}
                                                </option>
                                            )
                                        )}
                                    </select>

                                    <svg
                                        className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-[#667876]"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path d="m6 9 6 6 6-6" />
                                    </svg>
                                </div>

                                {/* Availability */}
                                <div className="relative">
                                    <select
                                        value={availabilityFilter}
                                        onChange={(e) =>
                                            setAvailabilityFilter(
                                                e.target.value
                                            )
                                        }
                                        className="appearance-none min-w-[155px] bg-[#F2F8F6] text-[#0A1F1C] text-sm font-semibold px-3.5 py-2.5 pr-9 rounded-xl outline-none hover:bg-[#E7F3F0] transition cursor-pointer"
                                    >
                                        <option>All Availability</option>
                                        <option value="Available">
                                            Available
                                        </option>
                                        <option value="Unavailable">
                                            Unavailable
                                        </option>
                                    </select>

                                    <svg
                                        className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-[#667876]"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path d="m6 9 6 6 6-6" />
                                    </svg>
                                </div>

                                {/* Reset */}
                                <button
                                    type="button"
                                    onClick={resetFilters}
                                    title="Reset Filters"
                                    className="p-2.5 bg-[#F2F8F6] text-[#667876] hover:text-[#003435] hover:bg-[#E7F3F0] rounded-xl transition"
                                >
                                    <svg
                                        className="w-5 h-5"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.7"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M3 4h18" />
                                        <path d="M6 8h12" />
                                        <path d="M9 12h6" />
                                        <path d="M10 16h4" />
                                        <path d="M11 20h2" />
                                    </svg>
                                </button>
                            </div>

                            <div className="flex items-center justify-between mt-3 px-1">
                                <p className="text-xs text-[#667876]">
                                    Showing{" "}
                                    <span className="font-bold text-[#164B4D]">
                                        {filteredDoctors.length}
                                    </span>{" "}
                                    of{" "}
                                    <span className="font-bold text-[#164B4D]">
                                        {doctors.length}
                                    </span>{" "}
                                    doctors
                                </p>

                                {(search ||
                                    departmentFilter !==
                                        "All Departments" ||
                                    specializationFilter !==
                                        "All Specializations" ||
                                    availabilityFilter !==
                                        "All Availability") && (
                                    <button
                                        type="button"
                                        onClick={resetFilters}
                                        className="text-xs font-bold text-[#256862] hover:text-[#003435]"
                                    >
                                        Clear filters
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* DOCTORS TABLE */}
                    <div className="px-6 xl:px-8 pb-8">
                        <div className="bg-white rounded-2xl shadow-[0_8px_24px_rgba(22,75,77,0.06)] overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-[1050px]">
                                    <thead>
                                        <tr className="bg-[#F2F8F6] border-b border-[#D5E5E1]">
                                            {[
                                                "Physician Profile",
                                                "Specialization",
                                                "Department",
                                                "Experience",
                                                "Consultation Fee",
                                                "Availability",
                                                "Status",
                                            ].map((heading) => (
                                                <th
                                                    key={heading}
                                                    className="py-3.5 px-5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#667876]"
                                                >
                                                    {heading}
                                                </th>
                                            ))}

                                            <th className="py-3.5 px-5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#667876] text-right">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-[#EDF2F1]">
                                        {filteredDoctors.map((doctor) => (
                                            <tr
                                                key={doctor._id}
                                                className="group hover:bg-[#F2F8F6] transition-colors"
                                            >
                                                {/* Profile */}
                                                <td className="py-4 px-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-11 h-11 rounded-full bg-[#ADEFE7]/55 text-[#164B4D] flex items-center justify-center shrink-0 ring-1 ring-[#C4E8E2]">
                                                            <span className="md-display text-[15px] font-bold">
                                                                {doctor.user?.name
                                                                    ?.charAt(0)
                                                                    .toUpperCase() ||
                                                                    "D"}
                                                            </span>
                                                        </div>

                                                        <div className="min-w-0">
                                                            <p className="md-display text-[15px] font-semibold text-[#003435] truncate group-hover:text-[#256862] transition-colors">
                                                                {
                                                                    doctor.user
                                                                        ?.name
                                                                }
                                                            </p>

                                                            <p className="text-xs text-[#667876] truncate mt-0.5">
                                                                {
                                                                    doctor.user
                                                                        ?.email
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Specialization */}
                                                <td className="py-4 px-5">
                                                    <span className="text-sm font-semibold text-[#0A1F1C]">
                                                        {
                                                            doctor.specialization
                                                        }
                                                    </span>
                                                </td>

                                                {/* Department */}
                                                <td className="py-4 px-5">
                                                    <span className="inline-flex px-2.5 py-1 rounded-lg bg-[#E7F3F0] text-[#164B4D] text-xs font-semibold">
                                                        {doctor.department}
                                                    </span>
                                                </td>

                                                {/* Experience */}
                                                <td className="py-4 px-5 whitespace-nowrap">
                                                    <span className="md-display text-[15px] font-semibold text-[#164B4D]">
                                                        {doctor.experience}
                                                    </span>

                                                    <span className="text-xs text-[#667876] ml-1">
                                                        yrs
                                                    </span>
                                                </td>

                                                {/* Fee */}
                                                <td className="py-4 px-5 whitespace-nowrap">
                                                    <span className="text-sm font-bold text-[#003435]">
                                                        ₹
                                                        {
                                                            doctor.consultationFee
                                                        }
                                                    </span>
                                                </td>

                                                {/* Availability */}
                                                <td className="py-4 px-5">
                                                    {doctor.isAvailable ? (
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ADEFE7]/45 text-[#256862] text-xs font-bold">
                                                            <span className="w-2 h-2 rounded-full bg-[#256862]" />
                                                            Available
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FFF0E8] text-[#A9532A] text-xs font-bold">
                                                            <span className="w-2 h-2 rounded-full bg-[#F28B5B]" />
                                                            Unavailable
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Status */}
                                                <td className="py-4 px-5">
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#E7F3F0] text-[#164B4D] text-[10px] font-bold uppercase tracking-[0.12em]">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-[#256862]" />
                                                        Active
                                                    </span>
                                                </td>

                                                {/* Actions */}
                                                <td className="py-4 px-5">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setSelectedDoctor(
                                                                    doctor
                                                                )
                                                            }
                                                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#F2F8F6] text-[#164B4D] text-xs font-bold hover:bg-[#ADEFE7] transition-colors"
                                                        >
                                                            <svg
                                                                className="w-3.5 h-3.5"
                                                                viewBox="0 0 20 20"
                                                                fill="currentColor"
                                                            >
                                                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                            </svg>
                                                            Edit
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                toggleAvailability(
                                                                    doctor._id
                                                                )
                                                            }
                                                            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                                                                doctor.isAvailable
                                                                    ? "bg-[#FFF0E8] text-[#A9532A] hover:bg-[#FADBCB]"
                                                                    : "bg-[#164B4D] text-white hover:bg-[#003435]"
                                                            }`}
                                                        >
                                                            {doctor.isAvailable
                                                                ? "Deactivate"
                                                                : "Activate"}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Empty filtered result */}
                            {filteredDoctors.length === 0 && (
                                <div className="py-16 text-center">
                                    <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-[#E1F8F3] text-[#164B4D] flex items-center justify-center">
                                        <svg
                                            className="w-6 h-6"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.7"
                                        >
                                            <circle
                                                cx="11"
                                                cy="11"
                                                r="7"
                                            />
                                            <path d="m20 20-4-4" />
                                        </svg>
                                    </div>

                                    <p className="text-sm font-semibold text-[#164B4D]">
                                        No matching doctors
                                    </p>

                                    <p className="text-xs text-[#667876] mt-1">
                                        Try changing your search or filters.
                                    </p>

                                    <button
                                        type="button"
                                        onClick={resetFilters}
                                        className="mt-4 text-xs font-bold text-[#256862] hover:text-[#003435]"
                                    >
                                        Reset filters
                                    </button>
                                </div>
                            )}

                            {/* Table footer */}
                            {filteredDoctors.length > 0 && (
                                <div className="px-5 py-3.5 border-t border-[#EDF2F1] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                    <p className="text-xs text-[#667876]">
                                        Showing{" "}
                                        <span className="font-bold text-[#164B4D]">
                                            1–{filteredDoctors.length}
                                        </span>{" "}
                                        of{" "}
                                        <span className="font-bold text-[#164B4D]">
                                            {doctors.length}
                                        </span>{" "}
                                        doctors
                                    </p>

                                    <span className="text-xs font-semibold text-[#667876]">
                                        Active roster
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}

            {/* EDIT DOCTOR MODAL */}
            {selectedDoctor && (
                <div className="fixed inset-0 bg-[#003435]/65 backdrop-blur-sm flex items-center justify-center px-4 py-6 z-50">
                    <div className="md-modal bg-white rounded-2xl w-full max-w-3xl shadow-[0_30px_80px_-20px_rgba(0,52,53,0.5)] max-h-[92vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="sticky top-0 z-10 flex items-start justify-between px-6 sm:px-7 py-5 border-b border-[#E4EFEC] bg-[#F2F8F6]">
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-xl bg-[#ADEFE7]/60 text-[#164B4D] flex items-center justify-center">
                                    <svg
                                        className="w-5 h-5"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.7"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                                        <circle
                                            cx="12"
                                            cy="7"
                                            r="4"
                                        />
                                    </svg>
                                </div>

                                <div>
                                    <h3 className="md-display text-xl font-semibold text-[#003435]">
                                        Edit Doctor
                                    </h3>

                                    <p className="text-xs text-[#667876] mt-0.5">
                                        Update physician profile and clinical
                                        details
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => setSelectedDoctor(null)}
                                className="w-9 h-9 flex items-center justify-center rounded-xl text-[#667876] hover:text-[#003435] hover:bg-[#E1F8F3] transition"
                            >
                                <svg
                                    className="w-5 h-5"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                >
                                    <path d="M6 6l12 12" />
                                    <path d="M18 6L6 18" />
                                </svg>
                            </button>
                        </div>

                        {/* Form */}
                        <form
                            onSubmit={updateDoctor}
                            className="px-6 sm:px-7 py-6"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* Name */}
                                <div>
                                    <label className={labelClass}>
                                        Name
                                    </label>

                                    <input
                                        type="text"
                                        value={
                                            selectedDoctor.user?.name || ""
                                        }
                                        onChange={(e) =>
                                            setSelectedDoctor((current) => ({
                                                ...current,
                                                user: {
                                                    ...current.user,
                                                    name: e.target.value,
                                                },
                                            }))
                                        }
                                        required
                                        className={inputClass}
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label className={labelClass}>
                                        Email
                                    </label>

                                    <input
                                        type="email"
                                        value={
                                            selectedDoctor.user?.email || ""
                                        }
                                        disabled
                                        className="w-full border border-[#DDE9E6] bg-[#EDF4F2] text-[#78908C] rounded-xl px-3.5 py-2.5 text-sm cursor-not-allowed"
                                    />
                                </div>

                                {/* Specialization */}
                                <div>
                                    <label className={labelClass}>
                                        Specialization
                                    </label>

                                    <input
                                        type="text"
                                        value={
                                            selectedDoctor.specialization ||
                                            ""
                                        }
                                        onChange={(e) =>
                                            setSelectedDoctor((current) => ({
                                                ...current,
                                                specialization:
                                                    e.target.value,
                                            }))
                                        }
                                        required
                                        className={inputClass}
                                    />
                                </div>

                                {/* Department */}
                                <div>
                                    <label className={labelClass}>
                                        Department
                                    </label>

                                    <input
                                        type="text"
                                        value={
                                            selectedDoctor.department || ""
                                        }
                                        onChange={(e) =>
                                            setSelectedDoctor((current) => ({
                                                ...current,
                                                department: e.target.value,
                                            }))
                                        }
                                        required
                                        className={inputClass}
                                    />
                                </div>

                                {/* Qualification */}
                                <div>
                                    <label className={labelClass}>
                                        Qualification
                                    </label>

                                    <input
                                        type="text"
                                        value={
                                            selectedDoctor.qualification ||
                                            ""
                                        }
                                        onChange={(e) =>
                                            setSelectedDoctor((current) => ({
                                                ...current,
                                                qualification:
                                                    e.target.value,
                                            }))
                                        }
                                        required
                                        className={inputClass}
                                    />
                                </div>

                                {/* Experience */}
                                <div>
                                    <label className={labelClass}>
                                        Experience (Years)
                                    </label>

                                    <input
                                        type="number"
                                        min="0"
                                        value={
                                            selectedDoctor.experience ?? ""
                                        }
                                        onChange={(e) =>
                                            setSelectedDoctor((current) => ({
                                                ...current,
                                                experience: e.target.value,
                                            }))
                                        }
                                        required
                                        className={inputClass}
                                    />
                                </div>

                                {/* Fee */}
                                <div>
                                    <label className={labelClass}>
                                        Consultation Fee
                                    </label>

                                    <input
                                        type="number"
                                        min="0"
                                        value={
                                            selectedDoctor.consultationFee ??
                                            ""
                                        }
                                        onChange={(e) =>
                                            setSelectedDoctor((current) => ({
                                                ...current,
                                                consultationFee:
                                                    e.target.value,
                                            }))
                                        }
                                        required
                                        className={inputClass}
                                    />
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className={labelClass}>
                                        Phone
                                    </label>

                                    <input
                                        type="text"
                                        value={selectedDoctor.phone || ""}
                                        onChange={(e) =>
                                            setSelectedDoctor((current) => ({
                                                ...current,
                                                phone: e.target.value,
                                            }))
                                        }
                                        className={inputClass}
                                    />
                                </div>
                            </div>

                            {/* About */}
                            <div className="mt-5">
                                <label className={labelClass}>
                                    About
                                </label>

                                <textarea
                                    rows="4"
                                    value={selectedDoctor.about || ""}
                                    onChange={(e) =>
                                        setSelectedDoctor((current) => ({
                                            ...current,
                                            about: e.target.value,
                                        }))
                                    }
                                    className={`${inputClass} resize-y leading-relaxed`}
                                />
                            </div>

                            {/* Availability */}
                            <div className="mt-5 rounded-xl border border-[#DDEAE7] bg-[#F2F8F6] p-4 flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm font-bold text-[#164B4D]">
                                        Appointment Availability
                                    </p>

                                    <p className="text-xs text-[#667876] mt-0.5">
                                        Allow patients to book appointments
                                        with this doctor.
                                    </p>
                                </div>

                                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                    <input
                                        type="checkbox"
                                        checked={
                                            selectedDoctor.isAvailable
                                        }
                                        onChange={(e) =>
                                            setSelectedDoctor((current) => ({
                                                ...current,
                                                isAvailable:
                                                    e.target.checked,
                                            }))
                                        }
                                        className="sr-only peer"
                                    />

                                    <div className="w-11 h-6 bg-[#C9DAD6] rounded-full peer peer-focus:ring-2 peer-focus:ring-[#ADEFE7] peer-checked:bg-[#256862] transition-colors after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-[18px] after:w-[18px] after:shadow-sm after:transition-transform peer-checked:after:translate-x-5" />
                                </label>
                            </div>

                            {/* Footer */}
                            <div className="mt-7 pt-5 border-t border-[#E4EFEC] flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setSelectedDoctor(null)
                                    }
                                    className="px-5 py-2.5 rounded-xl border border-[#CBDDD9] bg-white text-[#164B4D] text-sm font-semibold hover:bg-[#F2F8F6] transition"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-5 py-2.5 rounded-xl bg-[#164B4D] text-white text-sm font-semibold shadow-sm hover:bg-[#003435] transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
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

export default Doctors;