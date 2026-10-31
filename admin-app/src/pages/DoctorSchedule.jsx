import { useEffect, useState } from "react";
import api from "../api";

const DoctorSchedule = () => {
  const token = localStorage.getItem("adminToken");

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const [formData, setFormData] = useState({
    workingDays: [],
    startTime: "09:00",
    endTime: "17:00",
    slotDuration: 30,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await api.get(
          "/schedules/my-schedule",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const schedule = response.data.schedule;

        setFormData({
          workingDays: schedule.workingDays || [],
          startTime: schedule.startTime || "09:00",
          endTime: schedule.endTime || "17:00",
          slotDuration: schedule.slotDuration || 30,
        });
      } catch (error) {
        if (error.response?.status !== 404) {
          console.error(
            "Failed to fetch schedule",
            error
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [token]);

  const handleDayChange = (day) => {
    setFormData((currentData) => {
      const isSelected =
        currentData.workingDays.includes(day);

      return {
        ...currentData,
        workingDays: isSelected
          ? currentData.workingDays.filter(
              (currentDay) => currentDay !== day
            )
          : [...currentData.workingDays, day],
      };
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]:
        name === "slotDuration"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.workingDays.length === 0) {
      alert("Please select at least one working day.");
      return;
    }

    if (formData.startTime >= formData.endTime) {
      alert("End time must be after start time.");
      return;
    }

    try {
      setSaving(true);

      const response = await api.patch(
        "/schedules/my-schedule",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFormData({
        workingDays:
          response.data.schedule.workingDays || [],
        startTime:
          response.data.schedule.startTime,
        endTime:
          response.data.schedule.endTime,
        slotDuration:
          response.data.schedule.slotDuration,
      });

      alert("Schedule saved successfully.");
    } catch (error) {
      console.error(
        "Failed to save schedule",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to save schedule"
      );
    } finally {
      setSaving(false);
    }
  };

  const labelClass =
    "mb-2 block text-[12px] font-semibold tracking-wide text-[#404848]";
  const inputClass =
    "w-full rounded-xl border border-[#CBDAD6] bg-white px-4 py-3 text-[14px] text-[#0a1f1c] outline-none transition hover:border-[#8EAAA3] focus:border-[#256862] focus:ring-4 focus:ring-[#ADEFE7]/40";

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F8F6] px-4">
        <div className="flex items-center gap-3 rounded-2xl border border-[#CBDAD6] bg-white px-6 py-5 shadow-sm">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#B9D7D0] border-t-[#256862]" />
          <p className="text-sm font-medium text-[#164B4D]">
            Loading your schedule...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F8F6] px-4 py-7 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Page heading */}
        <div className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#B9DCD4] bg-[#E7F4F1] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#256862]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#256862]" />
              Appointment management
            </div>
            <h1 className="font-['Bricolage_Grotesque'] text-3xl font-bold tracking-tight text-[#003435] sm:text-[36px]">
              My Schedule
            </h1>
            <p className="mt-2 max-w-xl text-[14px] leading-6 text-[#64736F]">
              Set your weekly working hours and appointment slot preferences.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-[#CBDAD6] bg-white px-4 py-3 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E7F4F1] text-xl text-[#256862]">
              ◷
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#81918C]">
                Current selection
              </p>
              <p className="mt-0.5 text-sm font-semibold text-[#164B4D]">
                {formData.workingDays.length} working {formData.workingDays.length === 1 ? "day" : "days"}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Working days */}
          <section className="overflow-hidden rounded-2xl border border-[#CBDAD6] bg-white shadow-[0_3px_18px_rgba(0,52,53,0.04)]">
            <div className="flex items-center gap-4 border-b border-[#E4ECE9] bg-gradient-to-r from-[#E7F4F1] to-white px-5 py-5 sm:px-7">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#D5EEE8] text-xl text-[#256862]">
                ▦
              </div>
              <div>
                <h2 className="font-['Bricolage_Grotesque'] text-lg font-bold text-[#003435]">
                  Working days
                </h2>
                <p className="mt-0.5 text-xs text-[#71817C]">
                  Choose the days you are available to see patients
                </p>
              </div>
            </div>

            <div className="p-5 sm:p-7">
              <label className={labelClass}>Select your weekly availability</label>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {days.map((day) => {
                  const isSelected = formData.workingDays.includes(day);

                  return (
                    <label
                      key={day}
                      className={`group flex cursor-pointer items-center justify-between gap-2 rounded-xl border px-4 py-3.5 transition ${
                        isSelected
                          ? "border-[#5D9B8E] bg-[#E7F4F1] shadow-[0_2px_8px_rgba(37,104,98,0.07)]"
                          : "border-[#DCE7E2] bg-white hover:border-[#A9C8BE] hover:bg-[#F7FAF8]"
                      }`}
                    >
                      <span className={`text-[13px] font-semibold ${
                        isSelected ? "text-[#164B4D]" : "text-[#52615C]"
                      }`}>
                        {day}
                      </span>
                      <input
                        type="checkbox"
                        checked={formData.workingDays.includes(day)}
                        onChange={() => handleDayChange(day)}
                        className="h-4 w-4 cursor-pointer accent-[#256862] focus:ring-[#ADEFE7]"
                      />
                    </label>
                  );
                })}
              </div>

              <div className="mt-5 flex items-start gap-2 rounded-xl bg-[#F3F8F5] px-4 py-3">
                <span className="mt-0.5 text-sm text-[#256862]">ⓘ</span>
                <p className="text-xs leading-5 text-[#71817C]">
                  Select every day on which you want patients to be able to book appointments.
                </p>
              </div>
            </div>
          </section>

          {/* Working hours */}
          <section className="overflow-hidden rounded-2xl border border-[#CBDAD6] bg-white shadow-[0_3px_18px_rgba(0,52,53,0.04)]">
            <div className="flex items-center gap-4 border-b border-[#E4ECE9] bg-gradient-to-r from-[#E7F4F1] to-white px-5 py-5 sm:px-7">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#D5EEE8] text-xl text-[#256862]">
                ◷
              </div>
              <div>
                <h2 className="font-['Bricolage_Grotesque'] text-lg font-bold text-[#003435]">
                  Working hours
                </h2>
                <p className="mt-0.5 text-xs text-[#71817C]">
                  Define when your appointment hours begin and end
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 sm:gap-6 sm:p-7">
              <div>
                <label className={labelClass}>Start time</label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
                <p className="mt-1.5 text-[11px] text-[#899792]">
                  Your first available appointment time
                </p>
              </div>

              <div>
                <label className={labelClass}>End time</label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
                <p className="mt-1.5 text-[11px] text-[#899792]">
                  Your final appointment window ends here
                </p>
              </div>
            </div>
          </section>

          {/* Appointment slots */}
          <section className="overflow-hidden rounded-2xl border border-[#CBDAD6] bg-white shadow-[0_3px_18px_rgba(0,52,53,0.04)]">
            <div className="flex items-center gap-4 border-b border-[#E4ECE9] bg-gradient-to-r from-[#E7F4F1] to-white px-5 py-5 sm:px-7">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#D5EEE8] text-xl text-[#256862]">
                ◴
              </div>
              <div>
                <h2 className="font-['Bricolage_Grotesque'] text-lg font-bold text-[#003435]">
                  Appointment slots
                </h2>
                <p className="mt-0.5 text-xs text-[#71817C]">
                  Choose how long each patient appointment should last
                </p>
              </div>
            </div>

            <div className="p-5 sm:p-7">
              <label className={labelClass}>Appointment slot duration</label>
              <div className="relative">
                <select
                  name="slotDuration"
                  value={formData.slotDuration}
                  onChange={handleChange}
                  className={`${inputClass} appearance-none pr-11`}
                >
                  <option value={15}>15 minutes</option>
                  <option value={20}>20 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>60 minutes</option>
                </select>
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#64817A]">
                  ▾
                </span>
              </div>
              <p className="mt-2 text-[11px] text-[#899792]">
                This duration is used to organize the length of each appointment slot.
              </p>
            </div>
          </section>

          {/* Save actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-[#DCE7E2] pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-5 text-[#82908C]">
              Your selected days and hours will be used for appointment scheduling.
            </p>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#003435] px-7 py-3 text-[13px] font-bold text-white shadow-[0_5px_14px_rgba(0,52,53,0.16)] transition hover:-translate-y-0.5 hover:bg-[#164B4D] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:translate-y-0"
            >
              {saving ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Saving schedule...
                </>
              ) : (
                <>
                  <span className="text-base">✓</span>
                  Save schedule
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorSchedule;
