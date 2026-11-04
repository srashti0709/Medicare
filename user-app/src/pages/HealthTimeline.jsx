
import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileHeart,
  HeartPulse,
  RefreshCw,
  ShieldCheck,
  Stethoscope,
  ClipboardList,
  XCircle,
  ArrowRight,
  FileText,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../api";

const HealthTimeline = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [expandedReports, setExpandedReports] = useState([]);

  const fetchTimeline = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("userToken");

      const response = await api.get("/health-timeline", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setEvents(response.data.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load your health timeline. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimeline();
  }, []);

  const filteredEvents = useMemo(() => {
    if (activeFilter === "all") return events;

    return events.filter((event) => event.type === activeFilter);
  }, [events, activeFilter]);

  const appointmentCount = events.filter(
    (event) => event.type === "appointment"
  ).length;

  const screeningCount = events.filter(
    (event) => event.type === "screening"
  ).length;

  const reportCount = events.filter(
    (event) => event.type === "report"
  ).length;

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const toggleReport = (reportId) => {
    setExpandedReports((previous) =>
      previous.includes(reportId)
        ? previous.filter((id) => id !== reportId)
        : [...previous, reportId]
    );
  };

  const getStatus = (status) => {
    switch (status) {
      case "confirmed":
        return {
          label: "Confirmed",
          className: "bg-[#E0F5EC] text-[#16734D] border-[#B8E7D0]",
          icon: CheckCircle2,
        };

      case "completed":
        return {
          label: "Completed",
          className: "bg-[#E5EFFD] text-[#285FA6] border-[#C5D9F5]",
          icon: CheckCircle2,
        };

      case "cancelled":
        return {
          label: "Cancelled",
          className: "bg-[#FDEAEA] text-[#B43D3D] border-[#F4CACA]",
          icon: XCircle,
        };

      default:
        return {
          label: "Pending",
          className: "bg-[#FFF4D9] text-[#94630C] border-[#F1DCA6]",
          icon: Clock3,
        };
    }
  };

  const getEventStyle = (event) => {
    if (event.type === "appointment") {
      return {
        icon: Stethoscope,
        iconClass: "bg-[#E7F4F1] text-[#256862]",
        label: "Doctor Appointment",
      };
    }

    if (event.type === "report") {
      return {
        icon: FileHeart,
        iconClass: "bg-[#E0F5EC] text-[#16734D]",
        label: "Health Report",
      };
    }

    return {
      icon: event.disease === "diabetes" ? Activity : HeartPulse,
      iconClass: "bg-[#E5EFFD] text-[#285FA6]",
      label:
        event.disease === "diabetes"
          ? "Diabetes Screening"
          : "Kidney Screening",
    };
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#F5F8F6] text-[#0a1f1c]">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#003435]">
        <div className="pointer-events-none absolute -right-24 -top-36 h-96 w-96 rounded-full border-[45px] border-white/[0.04]" />
        <div className="pointer-events-none absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-[#ADEFE7]/10 blur-3xl" />
        <div className="pointer-events-none absolute right-[22%] top-10 h-24 w-24 rounded-full border border-[#ADEFE7]/10" />

        <div className="relative mx-auto max-w-7xl px-6 py-14 md:py-20">
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#ADEFE7]/25 bg-white/10 px-5 py-3">
                <HeartPulse size={19} className="text-[#ADEFE7]" />
                <span className="text-sm font-semibold tracking-wide text-[#ADEFE7]">
                  YOUR HEALTHCARE JOURNEY
                </span>
              </div>

              <h1 className="font-['Bricolage_Grotesque'] text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
                My Health{" "}
                <span className="text-[#ADEFE7]">Timeline</span>
              </h1>

              <p className="mt-5 max-w-xl text-lg leading-8 text-[#D0E5DF]">
                Your healthcare journey, brought together in one place.
                Follow your screenings, appointments, report analyses and
                consultation history over time.
              </p>

              <div className="mt-7 flex items-center gap-3 text-base font-medium text-[#ADEFE7]">
                <ShieldCheck size={21} />
                Your personal health history, securely organized.
              </div>
            </div>

            <div className="relative hidden h-48 w-48 shrink-0 items-center justify-center rounded-[36px] border border-white/15 bg-white/10 shadow-2xl backdrop-blur-md md:flex">
              <div className="absolute inset-3 rounded-[28px] border border-[#ADEFE7]/20" />
              <Activity
                size={88}
                strokeWidth={1.2}
                className="relative text-[#ADEFE7]"
              />
              <div className="absolute -right-4 -top-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ADEFE7] text-[#003435] shadow-lg">
                <FileHeart size={27} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-5 py-12 sm:px-6 md:py-16">
        {/* SUMMARY */}
        <div className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Total Health Records",
              count: events.length,
              icon: ClipboardList,
              color: "bg-[#E7F4F1] text-[#256862]",
            },
            {
              title: "Appointments",
              count: appointmentCount,
              icon: CalendarDays,
              color: "bg-[#E0F5EC] text-[#16734D]",
            },
            {
              title: "Health Screenings",
              count: screeningCount,
              icon: Activity,
              color: "bg-[#E5EFFD] text-[#285FA6]",
            },
            {
              title: "Report Analyses",
              count: reportCount,
              icon: FileText,
              color: "bg-[#E0F5EC] text-[#16734D]",
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-3xl border border-[#D4E4DE] bg-white p-6 shadow-[0_8px_25px_rgba(0,52,53,0.04)]"
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.color}`}
                  >
                    <Icon size={24} />
                  </div>

                  <span className="text-3xl font-bold tabular-nums text-[#003435]">
                    {loading ? "—" : item.count}
                  </span>
                </div>

                <h3 className="mt-5 text-base font-semibold text-[#65736F]">
                  {item.title}
                </h3>
              </div>
            );
          })}
        </div>

        {/* TIMELINE HEADER */}
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-1.5 rounded-full bg-[#258B76]" />
              <h2 className="font-['Bricolage_Grotesque'] text-2xl font-bold text-[#003435] sm:text-3xl">
                Your Health History
              </h2>
            </div>

            <p className="mt-3 text-base text-[#65736F]">
              A chronological view of your saved healthcare records.
            </p>
          </div>

          <button
            onClick={fetchTimeline}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#D4E4DE] bg-white px-5 py-3 text-base font-semibold text-[#164B4D] shadow-sm transition-all hover:bg-[#E7F4F1] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={18}
              className={loading ? "animate-spin" : ""}
            />
            Refresh Timeline
          </button>
        </div>

        {/* FILTERS */}
        <div className="mb-8 flex flex-wrap gap-3">
          {[
            { value: "all", label: "All Records" },
            { value: "appointment", label: "Appointments" },
            { value: "screening", label: "Screenings" },
            { value: "report", label: "Reports" },
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              className={`rounded-xl border px-5 py-3 text-sm font-semibold transition-all ${
                activeFilter === filter.value
                  ? "border-[#003F40] bg-[#003F40] text-white shadow-md"
                  : "border-[#D4E4DE] bg-white text-[#52645F] hover:border-[#A7CFC2] hover:bg-[#E7F4F1]"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-7 flex items-start gap-4 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
            <AlertCircle size={23} className="mt-0.5 shrink-0" />
            <div>
              <p className="text-base font-bold">
                Unable to load timeline
              </p>
              <p className="mt-1 text-base">{error}</p>
              <button
                onClick={fetchTimeline}
                className="mt-3 inline-flex items-center gap-2 text-sm font-bold underline"
              >
                Try again <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}

        {/* LOADING */}
        {loading ? (
          <div className="space-y-5">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-3xl border border-[#D4E4DE] bg-white p-7"
              >
                <div className="flex gap-5">
                  <div className="h-14 w-14 rounded-2xl bg-[#E7F4F1]" />
                  <div className="flex-1 space-y-4">
                    <div className="h-5 w-48 rounded-full bg-[#E7F4F1]" />
                    <div className="h-4 w-32 rounded-full bg-[#E7F4F1]" />
                    <div className="h-4 w-64 max-w-full rounded-full bg-[#E7F4F1]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : !error && filteredEvents.length === 0 ? (
          /* EMPTY STATE */
          <div className="rounded-[32px] border border-[#D4E4DE] bg-white px-6 py-16 text-center shadow-sm sm:px-12">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[30px] bg-[#E7F4F1] text-[#256862]">
              <HeartPulse size={48} strokeWidth={1.4} />
            </div>

            <h3 className="mt-7 font-['Bricolage_Grotesque'] text-2xl font-bold text-[#003435]">
              No Health Records Found
            </h3>

            <p className="mx-auto mt-3 max-w-md text-base leading-7 text-[#65736F]">
              {events.length === 0
                ? "Your saved appointments, screening results and report analyses will appear here as your healthcare journey grows."
                : "There are no records in this category yet. Choose another filter to see your history."}
            </p>
          </div>
        ) : (
          /* TIMELINE */
          <div className="relative">
            <div className="absolute bottom-8 left-[27px] top-8 hidden w-0.5 bg-[#CDE2D9] sm:block" />

            <div className="space-y-6">
              {filteredEvents.map((event) => {
                const style = getEventStyle(event);
                const Icon = style.icon;
                const statusInfo =
                  event.type === "appointment"
                    ? getStatus(event.status)
                    : null;
                const StatusIcon = statusInfo?.icon;
                const isReportExpanded = expandedReports.includes(event.id);

                return (
                  <article
                    key={`${event.type}-${event.id}`}
                    className="relative rounded-3xl border border-[#D4E4DE] bg-white p-5 shadow-[0_8px_25px_rgba(0,52,53,0.035)] transition-all duration-300 hover:border-[#A7CFC2] hover:shadow-[0_16px_35px_rgba(0,52,53,0.08)] sm:ml-16 sm:p-7"
                  >
                    <div
                      className={`absolute -left-[59px] top-8 hidden h-14 w-14 items-center justify-center rounded-2xl border-4 border-[#F5F8F6] sm:flex ${style.iconClass}`}
                    >
                      <Icon size={23} />
                    </div>

                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex min-w-0 items-start gap-4">
                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl sm:hidden ${style.iconClass}`}
                        >
                          <Icon size={22} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#258B76]">
                            {style.label}
                          </p>

                          <h3 className="mt-2 break-words text-lg font-bold text-[#003435] sm:text-xl">
                            {event.title}
                          </h3>

                          {event.type === "appointment" && (
                            <>
                              {event.description && (
                                <p className="mt-2 text-sm leading-6 text-[#65736F]">
                                  <span className="font-semibold text-[#164B4D]">
                                    Reason:{" "}
                                  </span>
                                  {event.description}
                                </p>
                              )}

                              {event.notes && (
                                <div className="mt-4 rounded-2xl border border-[#DCEBE5] bg-[#F5F8F6] p-4">
                                  <p className="text-xs font-bold uppercase tracking-wide text-[#258B76]">
                                    Consultation Notes
                                  </p>
                                  <p className="mt-2 whitespace-pre-line text-sm leading-6 text-[#52645F]">
                                    {event.notes}
                                  </p>
                                </div>
                              )}
                            </>
                          )}

                          {event.type === "screening" && (
                            <div className="mt-3 flex flex-wrap gap-3">
                              <span className="rounded-xl border border-[#D4E4DE] bg-[#F5F8F6] px-3 py-2 text-sm text-[#52645F]">
                                Model output:{" "}
                                <strong className="text-[#003435]">
                                  {event.prediction}
                                </strong>
                              </span>

                              {event.probability !== undefined && (
                                <span className="rounded-xl border border-[#D4E4DE] bg-[#F5F8F6] px-3 py-2 text-sm text-[#52645F]">
                                  Probability:{" "}
                                  <strong className="text-[#003435]">
                                    {Number(event.probability) <= 1
                                      ? `${(
                                          Number(event.probability) * 100
                                        ).toFixed(1)}%`
                                      : `${Number(
                                          event.probability
                                        ).toFixed(1)}%`}
                                  </strong>
                                </span>
                              )}
                            </div>
                          )}

                          {event.type === "report" && (
                            <div className="mt-4">
                              {event.filename && (
                                <div className="inline-flex max-w-full items-center gap-2 rounded-xl border border-[#D4E4DE] bg-[#F5F8F6] px-3 py-2 text-sm text-[#52645F]">
                                  <FileText
                                    size={16}
                                    className="shrink-0 text-[#258B76]"
                                  />
                                  <span className="break-all">
                                    {event.filename}
                                  </span>
                                </div>
                              )}

                              {event.summary && (
                                <div className="mt-4 rounded-2xl border border-[#DCEBE5] bg-[#F5F8F6] p-4">
                                  <p className="text-xs font-bold uppercase tracking-wide text-[#258B76]">
                                    AI Report Summary
                                  </p>
                                  <p className="mt-2 text-sm leading-7 text-[#52645F]">
                                    {event.summary}
                                  </p>
                                </div>
                              )}

                              <button
                                type="button"
                                onClick={() => toggleReport(event.id)}
                                className="mt-4 inline-flex items-center gap-2 rounded-xl border border-[#BBDCD0] bg-[#E7F4F1] px-4 py-2.5 text-sm font-bold text-[#164B4D] transition hover:bg-[#D9EEE7]"
                              >
                                {isReportExpanded
                                  ? "Hide Report Findings"
                                  : "View Report Findings"}
                                {isReportExpanded ? (
                                  <ChevronUp size={17} />
                                ) : (
                                  <ChevronDown size={17} />
                                )}
                              </button>

                              {isReportExpanded && (
                                <div className="mt-4 space-y-4">
                                  {[
                                    {
                                      title: "Key Findings",
                                      items: event.keyFindings,
                                      color: "border-[#BBDCD0] bg-[#F0F8F5]",
                                    },
                                    {
                                      title: "Normal Values",
                                      items: event.normalValues,
                                      color: "border-[#C5D9F5] bg-[#F2F6FD]",
                                    },
                                    {
                                      title: "Abnormal Values",
                                      items: event.abnormalValues,
                                      color: "border-[#F1DCA6] bg-[#FFFAED]",
                                    },
                                    {
                                      title: "Questions to Discuss",
                                      items: event.questionsToDiscuss,
                                      color: "border-[#DCCEF1] bg-[#F8F5FC]",
                                    },
                                  ]
                                    .filter(
                                      (section) =>
                                        Array.isArray(section.items) &&
                                        section.items.length > 0
                                    )
                                    .map((section) => (
                                      <div
                                        key={section.title}
                                        className={`rounded-2xl border p-4 ${section.color}`}
                                      >
                                        <h4 className="text-sm font-bold text-[#164B4D]">
                                          {section.title}
                                        </h4>

                                        <ul className="mt-3 space-y-2">
                                          {section.items.map((item, index) => (
                                            <li
                                              key={`${section.title}-${index}`}
                                              className="flex items-start gap-2 text-sm leading-6 text-[#52645F]"
                                            >
                                              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#258B76]" />
                                              <span>{item}</span>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {statusInfo && (
                        <span
                          className={`inline-flex w-fit shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-xs font-bold ${statusInfo.className}`}
                        >
                          <StatusIcon size={15} />
                          {statusInfo.label}
                        </span>
                      )}
                    </div>

                    <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[#E5EEEA] pt-4 text-sm text-[#65736F]">
                      <span className="inline-flex items-center gap-2">
                        <CalendarDays size={16} className="text-[#258B76]" />
                        {formatDate(event.date)}
                      </span>

                      {event.type === "appointment" && (
                        <span className="inline-flex items-center gap-2">
                          <Clock3 size={16} className="text-[#258B76]" />
                          {formatTime(event.date)}
                        </span>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}

        {/* DISCLAIMER */}
        <div className="mt-10 flex items-start gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:p-6">
          <AlertCircle
            size={22}
            className="mt-0.5 shrink-0 text-amber-700"
          />
          <div>
            <h3 className="text-base font-bold text-amber-900">
              Important Health Information
            </h3>
            <p className="mt-2 text-sm leading-6 text-amber-800">
              AI-generated report summaries and screening outputs are for
              informational purposes and are not medical diagnoses. Please
              discuss your reports and health concerns with a qualified
              healthcare professional.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HealthTimeline;
