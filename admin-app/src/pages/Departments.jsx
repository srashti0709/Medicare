import { useEffect, useMemo, useState } from "react";
import api from "../api";

/*
 * Medicare theme
 * Deep Teal  #164B4D
 * Dark Teal  #0F3437
 * Soft Aqua  #9ADBD3
 * Warm Coral #F28B5B
 * Off-white  #F5F8F6
 * Soft Gray  #E7EFED
 */

const fontStyles = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;600;700&family=Manrope:wght@400;500;600;700&display=swap');

.medicare-departments {
    font-family: 'Manrope', ui-sans-serif, system-ui, sans-serif;
    color: #0F3437;
    -webkit-font-smoothing: antialiased;
}

.medicare-departments .md-display {
    font-family: 'Bricolage Grotesque', 'Manrope', ui-sans-serif, system-ui, sans-serif;
    letter-spacing: -0.02em;
}

.medicare-departments button,
.medicare-departments input,
.medicare-departments textarea,
.medicare-departments select {
    font-family: inherit;
}

@keyframes md-spin {
    to {
        transform: rotate(360deg);
    }
}

.medicare-departments .md-spinner {
    animation: md-spin 0.8s linear infinite;
}

@media (prefers-reduced-motion: reduce) {
    .medicare-departments .md-spinner {
        animation: none;
    }
}
`;

const Departments = ({ onAddDepartment }) => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [saving, setSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const fetchDepartments = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/departments");
            setDepartments(response.data.departments);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                    "Failed to fetch departments"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    const updateDepartment = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);

            const token = localStorage.getItem("adminToken");

            const response = await api.patch(
                `/departments/${selectedDepartment._id}`,
                {
                    name: selectedDepartment.name,
                    description: selectedDepartment.description || "",
                    image: selectedDepartment.image || "",
                    isActive: selectedDepartment.isActive,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setDepartments((currentDepartments) =>
                currentDepartments.map((department) =>
                    department._id === selectedDepartment._id
                        ? response.data.department
                        : department
                )
            );

            setSelectedDepartment(null);

            alert("Department updated successfully.");
        } catch (error) {
            console.error("Failed to update department", error);

            alert(
                error.response?.data?.message ||
                    "Failed to update department"
            );
        } finally {
            setSaving(false);
        }
    };

    const toggleDepartmentStatus = async (departmentId) => {
        try {
            const token = localStorage.getItem("adminToken");

            const response = await api.patch(
                `/departments/${departmentId}/toggle-status`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setDepartments((currentDepartments) =>
                currentDepartments.map((department) =>
                    department._id === departmentId
                        ? response.data.department
                        : department
                )
            );

            alert(response.data.message);
        } catch (error) {
            console.error(
                "Failed to update department status",
                error
            );

            alert(
                error.response?.data?.message ||
                    "Failed to update department status"
            );
        }
    };

    const filteredDepartments = useMemo(() => {
        return departments.filter((department) => {
            const matchesSearch =
                department.name
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                department.description
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase());

            const matchesStatus =
                statusFilter === "all" ||
                (statusFilter === "active" && department.isActive) ||
                (statusFilter === "inactive" && !department.isActive);

            return matchesSearch && matchesStatus;
        });
    }, [departments, searchTerm, statusFilter]);

    const totalDepartments = departments.length;

    const activeDepartments = departments.filter(
        (department) => department.isActive
    ).length;

    const inactiveDepartments =
        totalDepartments - activeDepartments;

    const getInitial = (name) => {
        return name?.charAt(0)?.toUpperCase() || "D";
    };

    return (
        <div className="medicare-departments min-h-full">
            <style>{fontStyles}</style>

            <div className="p-6 xl:p-8">
                <div className="max-w-[1450px] mx-auto space-y-6">

                    {/* PAGE HEADER */}
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
                        <div>
                            <div className="flex items-center gap-2 mb-1.5">
                                <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#256862]">
                                    Clinical Architecture
                                </span>

                                <span className="w-1.5 h-1.5 rounded-full bg-[#92D2CB]" />

                                <span className="text-[11px] font-semibold tracking-[0.04em] text-[#526563]">
                                    SYS-DEP-v4.2
                                </span>
                            </div>

                            <h1 className="md-display text-[25px] leading-8 font-semibold text-[#164B4D]">
                                Departments
                            </h1>

                            <p className="text-xs text-[#526563] mt-1">
                                Organize specialties, doctors and services
                                across Medicare.
                            </p>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                            <button
                                type="button"
                                onClick={onAddDepartment}
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#164B4D] text-white text-[13px] font-bold shadow-[0_8px_18px_-12px_rgba(15,52,55,0.7)] hover:bg-[#0F3437] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9ADBD3] focus-visible:ring-offset-2"
                            >
                                <span className="text-[18px] leading-none">
                                    +
                                </span>

                                Add Department
                            </button>
                        </div>
                    </div>

                    {/* ERROR */}
                    {error && (
                        <div
                            role="alert"
                            className="flex items-start gap-3 bg-[#FDF1EA] border border-[#F5CDB8] border-l-4 border-l-[#F28B5B] text-[#8F3A17] px-4 py-3 rounded-xl text-sm font-medium"
                        >
                            <span className="material-symbols-outlined text-[18px] text-[#F28B5B]">
                                error
                            </span>

                            <span>{error}</span>
                        </div>
                    )}

                    {/* LOADING */}
                    {loading ? (
                        <div className="bg-white rounded-2xl border border-[#DCEAE7] shadow-[0_8px_30px_-22px_rgba(15,52,55,0.45)] px-10 py-20 text-center">
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
                                    stroke="#DCEAE7"
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
                                Loading departments...
                            </p>
                        </div>
                    ) : departments.length === 0 ? (
                        /* EMPTY STATE */
                        <div className="bg-white rounded-2xl border border-dashed border-[#BFD3CF] px-10 py-20 text-center">
                            <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-[#E1F3F0] text-[#164B4D] flex items-center justify-center">
                                <span className="material-symbols-outlined text-[28px]">
                                    domain
                                </span>
                            </div>

                            <h3 className="md-display text-lg font-semibold text-[#0F3437]">
                                No departments found
                            </h3>

                            <p className="text-sm text-[#6F8884] mt-1">
                                Add your first Medicare department to
                                get started.
                            </p>

                            <button
                                type="button"
                                onClick={onAddDepartment}
                                className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#164B4D] text-white text-[13px] font-bold hover:bg-[#0F3437] transition-colors"
                            >
                                <span className="text-[18px]">
                                    +
                                </span>

                                Add Department
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* OVERVIEW STATISTICS */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

                                {/* TOTAL */}
                                <div className="bg-white rounded-2xl p-5 border border-[#DCEAE7] shadow-[0_8px_30px_-22px_rgba(15,52,55,0.45)] hover:border-[#9ADBD3] transition-all">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#6F8884]">
                                                Total Departments
                                            </span>

                                            <span className="md-display text-[34px] leading-[42px] font-bold text-[#003435] block mt-1">
                                                {totalDepartments}
                                            </span>
                                        </div>

                                        <div className="w-10 h-10 rounded-lg bg-[#E1F3F0] text-[#164B4D] flex items-center justify-center">
                                            <span className="material-symbols-outlined text-[21px]">
                                                domain
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mt-4">
                                        <span className="text-xs text-[#6F8884]">
                                            Registered units
                                        </span>

                                        <span className="text-[11px] font-bold text-[#256862]">
                                            All units
                                        </span>
                                    </div>
                                </div>

                                {/* ACTIVE */}
                                <div className="bg-white rounded-2xl p-5 border border-[#DCEAE7] shadow-[0_8px_30px_-22px_rgba(15,52,55,0.45)] hover:border-[#9ADBD3] transition-all">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#6F8884]">
                                                Active Departments
                                            </span>

                                            <span className="md-display text-[34px] leading-[42px] font-bold text-[#003435] block mt-1">
                                                {activeDepartments}
                                            </span>
                                        </div>

                                        <div className="w-10 h-10 rounded-lg bg-[#E1F3F0] text-[#256862] flex items-center justify-center">
                                            <span className="material-symbols-outlined text-[21px]">
                                                check_circle
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mt-4">
                                        <span className="text-xs text-[#6F8884]">
                                            Currently operational
                                        </span>

                                        <span className="px-2 py-0.5 rounded bg-[#ADEFE7] text-[#00201D] text-[10px] font-bold">
                                            Active
                                        </span>
                                    </div>
                                </div>

                                {/* INACTIVE */}
                                <div className="bg-white rounded-2xl p-5 border border-[#DCEAE7] shadow-[0_8px_30px_-22px_rgba(15,52,55,0.45)] hover:border-[#9ADBD3] transition-all">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#6F8884]">
                                                Inactive Departments
                                            </span>

                                            <span className="md-display text-[34px] leading-[42px] font-bold text-[#003435] block mt-1">
                                                {inactiveDepartments}
                                            </span>
                                        </div>

                                        <div className="w-10 h-10 rounded-lg bg-[#F1F4F3] text-[#7A8F8B] flex items-center justify-center">
                                            <span className="material-symbols-outlined text-[21px]">
                                                pause_circle
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mt-4">
                                        <span className="text-xs text-[#6F8884]">
                                            Currently inactive
                                        </span>

                                        <span className="text-[11px] font-bold text-[#8A9D99]">
                                            Needs attention
                                        </span>
                                    </div>
                                </div>

                                {/* COVERAGE */}
                                <div className="bg-white rounded-2xl p-5 border border-[#DCEAE7] shadow-[0_8px_30px_-22px_rgba(15,52,55,0.45)] hover:border-[#9ADBD3] transition-all">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#6F8884]">
                                                Department Coverage
                                            </span>

                                            <span className="md-display text-[34px] leading-[42px] font-bold text-[#003435] block mt-1">
                                                {totalDepartments
                                                    ? Math.round(
                                                          (activeDepartments /
                                                              totalDepartments) *
                                                              100
                                                      )
                                                    : 0}
                                                %
                                            </span>
                                        </div>

                                        <div className="w-10 h-10 rounded-lg bg-[#E1F3F0] text-[#256862] flex items-center justify-center">
                                            <span className="material-symbols-outlined text-[21px]">
                                                event_available
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mt-4">
                                        <span className="text-xs text-[#6F8884]">
                                            Active unit ratio
                                        </span>

                                        <span className="text-[11px] font-bold text-[#256862]">
                                            Live
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* TOOLBAR */}
                            <div className="bg-white rounded-2xl p-3 sm:p-4 border border-[#DCEAE7] shadow-[0_8px_30px_-22px_rgba(15,52,55,0.45)] flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">

                                <div className="flex flex-1 items-center gap-3">
                                    <div className="relative flex-1">
                                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#819894] text-[18px]">
                                            search
                                        </span>

                                        <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={(e) =>
                                                setSearchTerm(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Search departments..."
                                            className="w-full pl-10 pr-4 py-2.5 bg-[#E1F8F3] text-[#0F3437] placeholder:text-[#819894] rounded-xl text-sm outline-none focus:bg-white focus:ring-1 focus:ring-[#9ADBD3] transition-all"
                                        />
                                    </div>

                                    <select
                                        value={statusFilter}
                                        onChange={(e) =>
                                            setStatusFilter(
                                                e.target.value
                                            )
                                        }
                                        className="px-3 py-2.5 bg-[#E1F8F3] text-[#0F3437] rounded-xl text-xs font-semibold outline-none cursor-pointer focus:ring-1 focus:ring-[#9ADBD3]"
                                    >
                                        <option value="all">
                                            Status: All
                                        </option>

                                        <option value="active">
                                            Active Only
                                        </option>

                                        <option value="inactive">
                                            Inactive Only
                                        </option>
                                    </select>
                                </div>

                                <div className="flex items-center justify-between lg:justify-end gap-4">
                                    <span className="text-[11px] font-semibold text-[#6F8884]">
                                        Showing {filteredDepartments.length} of{" "}
                                        {totalDepartments} departments
                                    </span>

                                    <div className="flex items-center bg-[#E1F8F3] p-1 rounded-xl">
                                        <button
                                            type="button"
                                            className="p-1.5 rounded-lg bg-white text-[#164B4D] shadow-sm"
                                            title="Grid view"
                                        >
                                            <span className="material-symbols-outlined text-[18px] block">
                                                grid_view
                                            </span>
                                        </button>

                                        <span
                                            className="p-1.5 rounded-lg text-[#819894]"
                                            title="Table view"
                                        >
                                            <span className="material-symbols-outlined text-[18px] block">
                                                table_rows
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* MAIN WORKSPACE */}
                            <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">

                                {/* DEPARTMENT GRID */}
                                <div className="xl:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {filteredDepartments.length === 0 ? (
                                        <div className="md:col-span-2 bg-white rounded-2xl border border-dashed border-[#BFD3CF] px-8 py-16 text-center">
                                            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-[#E7EFED] text-[#164B4D] flex items-center justify-center">
                                                <span className="material-symbols-outlined text-[24px]">
                                                    search_off
                                                </span>
                                            </div>

                                            <h3 className="md-display text-lg font-semibold text-[#0F3437]">
                                                No matching departments
                                            </h3>

                                            <p className="text-sm text-[#6F8884] mt-1">
                                                Try changing your search or
                                                status filter.
                                            </p>
                                        </div>
                                    ) : (
                                        filteredDepartments.map(
                                            (department) => (
                                                <div
                                                    key={department._id}
                                                    onClick={() =>
                                                        setSelectedDepartment(
                                                            department
                                                        )
                                                    }
                                                    className={`bg-white rounded-2xl p-5 relative overflow-hidden transition-all duration-200 cursor-pointer ${
                                                        selectedDepartment?._id ===
                                                        department._id
                                                            ? "shadow-[0_10px_35px_-18px_rgba(15,52,55,0.65)] border border-[#9ADBD3]"
                                                            : "shadow-[0_8px_30px_-22px_rgba(15,52,55,0.45)] border border-[#DCEAE7] hover:border-[#9ADBD3] hover:shadow-[0_10px_30px_-18px_rgba(15,52,55,0.6)]"
                                                    }`}
                                                >
                                                    {/* SELECTED INDICATOR */}
                                                    {selectedDepartment?._id ===
                                                        department._id && (
                                                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#164B4D] to-[#ADEFE7]" />
                                                    )}

                                                    {/* CARD HEADER */}
                                                    <div className="flex items-start justify-between gap-3 mb-4">
                                                        <div className="flex items-center gap-3 min-w-0">
                                                            <div
                                                                className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-lg font-bold ${
                                                                    department.isActive
                                                                        ? "bg-[#ADEFE7]/60 text-[#164B4D]"
                                                                        : "bg-[#E7EFED] text-[#819894]"
                                                                }`}
                                                            >
                                                                {department.image ? (
                                                                    <img
                                                                        src={
                                                                            department.image
                                                                        }
                                                                        alt={
                                                                            department.name
                                                                        }
                                                                        className={`w-full h-full rounded-xl object-cover ${
                                                                            department.isActive
                                                                                ? ""
                                                                                : "grayscale opacity-70"
                                                                        }`}
                                                                        onError={(
                                                                            e
                                                                        ) => {
                                                                            e.currentTarget.style.display =
                                                                                "none";
                                                                        }}
                                                                    />
                                                                ) : (
                                                                    getInitial(
                                                                        department.name
                                                                    )
                                                                )}
                                                            </div>

                                                            <div className="min-w-0">
                                                                <div className="flex items-center gap-2">
                                                                    <h3
                                                                        className={`md-display text-[18px] leading-[26px] font-bold truncate ${
                                                                            department.isActive
                                                                                ? "text-[#003435]"
                                                                                : "text-[#6F8884]"
                                                                        }`}
                                                                    >
                                                                        {
                                                                            department.name
                                                                        }
                                                                    </h3>

                                                                    <span
                                                                        className={`w-2 h-2 rounded-full flex-shrink-0 ${
                                                                            department.isActive
                                                                                ? "bg-[#256862]"
                                                                                : "bg-[#A9BCB8]"
                                                                        }`}
                                                                    />
                                                                </div>

                                                                <span className="text-[10px] text-[#819894] block mt-0.5 uppercase tracking-[0.08em] font-semibold">
                                                                    Medicare Clinical
                                                                    Unit
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-1 flex-shrink-0">
                                                            <span
                                                                className={`px-2 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase ${
                                                                    department.isActive
                                                                        ? "bg-[#ADEFE7] text-[#00201D]"
                                                                        : "bg-[#F1F4F3] text-[#6F8884]"
                                                                }`}
                                                            >
                                                                {department.isActive
                                                                    ? "Active"
                                                                    : "Inactive"}
                                                            </span>

                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();

                                                                    setSelectedDepartment(
                                                                        department
                                                                    );
                                                                }}
                                                                className="p-1 rounded-lg text-[#819894] hover:text-[#0F3437] hover:bg-[#E7EFED] transition-colors"
                                                                title="Edit department"
                                                            >
                                                                <span className="material-symbols-outlined text-[18px]">
                                                                    more_vert
                                                                </span>
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* DESCRIPTION */}
                                                    <p
                                                        className={`text-sm leading-6 line-clamp-3 mb-5 ${
                                                            department.isActive
                                                                ? "text-[#5B7773]"
                                                                : "text-[#819894]"
                                                        }`}
                                                    >
                                                        {department.description ||
                                                            "No description available for this department."}
                                                    </p>

                                                    {/* INFO BAR */}
                                                    <div
                                                        className={`rounded-xl p-3 mb-4 ${
                                                            department.isActive
                                                                ? "bg-[#E1F8F3]"
                                                                : "bg-[#F5F8F6]"
                                                        }`}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <span
                                                                    className={`material-symbols-outlined text-[18px] ${
                                                                        department.isActive
                                                                            ? "text-[#256862]"
                                                                            : "text-[#819894]"
                                                                    }`}
                                                                >
                                                                    {department.isActive
                                                                        ? "verified"
                                                                        : "pause_circle"}
                                                                </span>

                                                                <span className="text-[11px] font-bold uppercase tracking-wider text-[#6F8884]">
                                                                    Department
                                                                    Status
                                                                </span>
                                                            </div>

                                                            <span
                                                                className={`text-xs font-bold ${
                                                                    department.isActive
                                                                        ? "text-[#164B4D]"
                                                                        : "text-[#819894]"
                                                                }`}
                                                            >
                                                                {department.isActive
                                                                    ? "Operational"
                                                                    : "Inactive"}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* CARD FOOTER */}
                                                    <div className="flex items-center justify-between pt-1">
                                                        <span className="text-[11px] font-semibold text-[#819894]">
                                                            Medicare Department
                                                        </span>

                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();

                                                                setSelectedDepartment(
                                                                    department
                                                                );
                                                            }}
                                                            className="text-[12px] font-bold text-[#256862] hover:text-[#164B4D] inline-flex items-center gap-1 transition-colors"
                                                        >
                                                            Manage Unit

                                                            <span className="material-symbols-outlined text-[14px]">
                                                                arrow_forward
                                                            </span>
                                                        </button>
                                                    </div>
                                                </div>
                                            )
                                        )
                                    )}
                                </div>

                                {/* DETAILS PANEL */}
                                <div className="xl:col-span-4 bg-white rounded-2xl p-5 border border-[#DCEAE7] shadow-[0_8px_30px_-22px_rgba(15,52,55,0.45)] xl:sticky xl:top-24">
                                    {selectedDepartment ? (
                                        <>
                                            {/* PANEL HEADER */}
                                            <div className="flex items-start justify-between pb-4 mb-4 border-b border-[#E7EFED]">
                                                <div>
                                                    <span className="text-[10px] font-bold text-[#256862] uppercase tracking-[0.12em]">
                                                        Unit Inspection
                                                    </span>

                                                    <h2 className="md-display text-[20px] leading-7 font-semibold text-[#164B4D] mt-0.5">
                                                        Department Details
                                                    </h2>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setSelectedDepartment(
                                                            null
                                                        )
                                                    }
                                                    className="p-1.5 rounded-xl text-[#819894] hover:bg-[#E7EFED] hover:text-[#0F3437] transition-colors"
                                                    title="Close details"
                                                >
                                                    <span className="material-symbols-outlined text-[19px]">
                                                        close
                                                    </span>
                                                </button>
                                            </div>

                                            {/* UNIT BANNER */}
                                            <div className="bg-[#E1F8F3] rounded-xl p-4 mb-4">
                                                <div className="flex items-start gap-3">
                                                    <div className="w-11 h-11 rounded-lg bg-white text-[#164B4D] flex items-center justify-center flex-shrink-0 shadow-sm">
                                                        <span className="material-symbols-outlined text-[22px]">
                                                            domain
                                                        </span>
                                                    </div>

                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <h3 className="md-display text-[17px] font-bold text-[#003435] break-words">
                                                                {
                                                                    selectedDepartment.name
                                                                }
                                                            </h3>
                                                        </div>

                                                        <span
                                                            className={`inline-flex items-center gap-1.5 mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                                                selectedDepartment.isActive
                                                                    ? "bg-[#ADEFE7] text-[#00201D]"
                                                                    : "bg-[#F1F4F3] text-[#6F8884]"
                                                            }`}
                                                        >
                                                            <span
                                                                className={`w-1.5 h-1.5 rounded-full ${
                                                                    selectedDepartment.isActive
                                                                        ? "bg-[#256862]"
                                                                        : "bg-[#A9BCB8]"
                                                                }`}
                                                            />

                                                            {selectedDepartment.isActive
                                                                ? "Active"
                                                                : "Inactive"}
                                                        </span>
                                                    </div>
                                                </div>

                                                <p className="text-xs leading-5 text-[#5B7773] mt-4">
                                                    {selectedDepartment.description ||
                                                        "No description available for this department."}
                                                </p>
                                            </div>

                                            {/* DEPARTMENT IMAGE */}
                                            {selectedDepartment.image && (
                                                <div className="mb-4 rounded-xl overflow-hidden bg-[#E7EFED]">
                                                    <img
                                                        src={
                                                            selectedDepartment.image
                                                        }
                                                        alt={
                                                            selectedDepartment.name
                                                        }
                                                        className="w-full h-40 object-cover"
                                                        onError={(e) => {
                                                            e.currentTarget.parentElement.style.display =
                                                                "none";
                                                        }}
                                                    />
                                                </div>
                                            )}

                                            {/* DEPARTMENT STATUS */}
                                            <div className="mb-5">
                                                <span className="text-[10px] font-bold text-[#6F8884] uppercase tracking-[0.1em] block mb-2">
                                                    Department Status
                                                </span>

                                                <div className="flex items-center justify-between py-3 px-3 rounded-xl bg-[#E1F8F3]">
                                                    <div className="flex items-center gap-2">
                                                        <span
                                                            className={`material-symbols-outlined text-[19px] ${
                                                                selectedDepartment.isActive
                                                                    ? "text-[#256862]"
                                                                    : "text-[#819894]"
                                                            }`}
                                                        >
                                                            {selectedDepartment.isActive
                                                                ? "check_circle"
                                                                : "pause_circle"}
                                                        </span>

                                                        <span className="text-xs font-semibold text-[#0F3437]">
                                                            Operational status
                                                        </span>
                                                    </div>

                                                    <span
                                                        className={`text-xs font-bold ${
                                                            selectedDepartment.isActive
                                                                ? "text-[#256862]"
                                                                : "text-[#819894]"
                                                        }`}
                                                    >
                                                        {selectedDepartment.isActive
                                                            ? "Active"
                                                            : "Inactive"}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* QUICK INFORMATION */}
                                            <div className="space-y-2 mb-5">
                                                <span className="text-[10px] font-bold text-[#6F8884] uppercase tracking-[0.1em] block mb-2">
                                                    Department Information
                                                </span>

                                                <div className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-[#F5F8F6]">
                                                    <div className="flex items-center gap-2">
                                                        <span className="material-symbols-outlined text-[#256862] text-[18px]">
                                                            badge
                                                        </span>

                                                        <span className="text-xs font-medium text-[#37595A]">
                                                            Department ID
                                                        </span>
                                                    </div>

                                                    <span className="text-[10px] font-bold text-[#6F8884] max-w-[130px] truncate">
                                                        {selectedDepartment._id}
                                                    </span>
                                                </div>

                                                <div className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-[#F5F8F6]">
                                                    <div className="flex items-center gap-2">
                                                        <span className="material-symbols-outlined text-[#256862] text-[18px]">
                                                            description
                                                        </span>

                                                        <span className="text-xs font-medium text-[#37595A]">
                                                            Description
                                                        </span>
                                                    </div>

                                                    <span className="text-[10px] font-bold text-[#6F8884]">
                                                        {selectedDepartment.description
                                                            ? "Available"
                                                            : "Not added"}
                                                    </span>
                                                </div>

                                                <div className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-[#F5F8F6]">
                                                    <div className="flex items-center gap-2">
                                                        <span className="material-symbols-outlined text-[#256862] text-[18px]">
                                                            image
                                                        </span>

                                                        <span className="text-xs font-medium text-[#37595A]">
                                                            Department Image
                                                        </span>
                                                    </div>

                                                    <span className="text-[10px] font-bold text-[#6F8884]">
                                                        {selectedDepartment.image
                                                            ? "Available"
                                                            : "Not added"}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* ACTIONS */}
                                            <div className="flex flex-col gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        toggleDepartmentStatus(
                                                            selectedDepartment._id
                                                        )
                                                    }
                                                    className={`w-full py-2.5 rounded-xl text-[12px] font-bold transition-all ${
                                                        selectedDepartment.isActive
                                                            ? "bg-[#FDEEE6] text-[#A8441A] hover:bg-[#F9E2D5]"
                                                            : "bg-[#164B4D] text-white hover:bg-[#0F3437]"
                                                    }`}
                                                >
                                                    {selectedDepartment.isActive
                                                        ? "Deactivate Department"
                                                        : "Activate Department"}
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setSelectedDepartment(
                                                            selectedDepartment
                                                        )
                                                    }
                                                    className="w-full py-2.5 rounded-xl bg-[#E1F8F3] text-[#0F3437] hover:bg-[#D6EDE8] transition-colors text-[12px] font-bold"
                                                >
                                                    Edit Department
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        /* EMPTY DETAILS PANEL */
                                        <div className="py-12 text-center">
                                            <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-[#E1F8F3] text-[#164B4D] flex items-center justify-center">
                                                <span className="material-symbols-outlined text-[26px]">
                                                    domain
                                                </span>
                                            </div>

                                            <h3 className="md-display text-lg font-semibold text-[#0F3437]">
                                                Department Details
                                            </h3>

                                            <p className="text-xs leading-5 text-[#6F8884] mt-1.5 max-w-[250px] mx-auto">
                                                Select a department card to
                                                inspect its details and manage
                                                its status.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    {/* EDIT MODAL */}
                    {selectedDepartment && (
                        <div className="fixed inset-0 bg-[#203431]/45 backdrop-blur-sm flex items-center justify-center px-4 py-6 z-50">
                            <div className="bg-white rounded-2xl w-full max-w-lg shadow-[0_25px_70px_rgba(15,52,55,0.25)] overflow-hidden max-h-[90vh] overflow-y-auto">

                                {/* MODAL HEADER */}
                                <div className="px-6 py-5 bg-[#E1F8F3] flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-[#164B4D] text-white flex items-center justify-center">
                                            <span className="material-symbols-outlined text-[20px]">
                                                edit
                                            </span>
                                        </div>

                                        <div>
                                            <h3 className="md-display text-[19px] font-bold text-[#003435]">
                                                Edit Department
                                            </h3>

                                            <p className="text-[11px] text-[#5B7773] mt-0.5">
                                                Update department information
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setSelectedDepartment(null)
                                        }
                                        className="w-8 h-8 rounded-xl text-[#819894] hover:bg-white hover:text-[#0F3437] transition-colors flex items-center justify-center"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">
                                            close
                                        </span>
                                    </button>
                                </div>

                                {/* MODAL BODY */}
                                <form
                                    onSubmit={updateDepartment}
                                    className="p-6"
                                >
                                    {/* NAME */}
                                    <div>
                                        <label className="block text-[11px] font-bold text-[#37595A] uppercase tracking-wider mb-2">
                                            Department Name
                                        </label>

                                        <input
                                            type="text"
                                            value={
                                                selectedDepartment.name || ""
                                            }
                                            onChange={(e) =>
                                                setSelectedDepartment(
                                                    (current) => ({
                                                        ...current,
                                                        name: e.target.value,
                                                    })
                                                )
                                            }
                                            required
                                            className="w-full border border-[#D5E0DD] rounded-xl px-4 py-3 text-sm text-[#0F3437] bg-[#F5F8F6] outline-none focus:bg-white focus:border-[#164B4D] focus:ring-2 focus:ring-[#9ADBD3]/50 transition"
                                        />
                                    </div>

                                    {/* DESCRIPTION */}
                                    <div className="mt-5">
                                        <label className="block text-[11px] font-bold text-[#37595A] uppercase tracking-wider mb-2">
                                            Description
                                        </label>

                                        <textarea
                                            rows="4"
                                            value={
                                                selectedDepartment.description ||
                                                ""
                                            }
                                            onChange={(e) =>
                                                setSelectedDepartment(
                                                    (current) => ({
                                                        ...current,
                                                        description:
                                                            e.target.value,
                                                    })
                                                )
                                            }
                                            placeholder="Enter department description..."
                                            className="w-full border border-[#D5E0DD] rounded-xl px-4 py-3 text-sm text-[#0F3437] bg-[#F5F8F6] outline-none focus:bg-white focus:border-[#164B4D] focus:ring-2 focus:ring-[#9ADBD3]/50 transition resize-none"
                                        />
                                    </div>

                                    {/* IMAGE */}
                                    <div className="mt-5">
                                        <label className="block text-[11px] font-bold text-[#37595A] uppercase tracking-wider mb-2">
                                            Image URL
                                        </label>

                                        <input
                                            type="text"
                                            value={
                                                selectedDepartment.image || ""
                                            }
                                            onChange={(e) =>
                                                setSelectedDepartment(
                                                    (current) => ({
                                                        ...current,
                                                        image: e.target.value,
                                                    })
                                                )
                                            }
                                            placeholder="Enter image URL..."
                                            className="w-full border border-[#D5E0DD] rounded-xl px-4 py-3 text-sm text-[#0F3437] bg-[#F5F8F6] outline-none focus:bg-white focus:border-[#164B4D] focus:ring-2 focus:ring-[#9ADBD3]/50 transition"
                                        />
                                    </div>

                                    {/* ACTIVE STATUS */}
                                    <div className="mt-5 p-3 rounded-xl bg-[#F5F8F6] flex items-center justify-between">
                                        <div>
                                            <label
                                                htmlFor="departmentStatus"
                                                className="text-sm font-bold text-[#0F3437]"
                                            >
                                                Department is active
                                            </label>

                                            <p className="text-[11px] text-[#6F8884] mt-0.5">
                                                Controls whether this department
                                                is operational.
                                            </p>
                                        </div>

                                        <input
                                            type="checkbox"
                                            id="departmentStatus"
                                            checked={
                                                selectedDepartment.isActive
                                            }
                                            onChange={(e) =>
                                                setSelectedDepartment(
                                                    (current) => ({
                                                        ...current,
                                                        isActive:
                                                            e.target.checked,
                                                    })
                                                )
                                            }
                                            className="w-5 h-5 accent-[#164B4D]"
                                        />
                                    </div>

                                    {/* MODAL ACTIONS */}
                                    <div className="mt-6 pt-5 border-t border-[#E7EFED] flex justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setSelectedDepartment(null)
                                            }
                                            className="px-4 py-2.5 rounded-xl border border-[#D5E0DD] text-[#37595A] text-[13px] font-semibold hover:bg-[#F5F8F6] transition-colors"
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className="px-5 py-2.5 rounded-xl bg-[#164B4D] text-white text-[13px] font-bold hover:bg-[#0F3437] transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9ADBD3] focus-visible:ring-offset-2"
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
            </div>
        </div>
    );
};

export default Departments;