
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import api from "../api";

import {
  FileText,
  Upload,
  Sparkles,
  Brain,
  Search,
  CheckCircle2,
  AlertTriangle,
  MessageCircle,
  Bot,
  UserRound,
  Send,
  ShieldCheck,
  FileCheck,
  XCircle,
  LoaderCircle,
  ArrowLeft,
  FileUp,
  Activity,
  BarChart3,
  ClipboardList,
  Clock3,
  Stethoscope,
  PieChart,
  ListChecks,
  CircleHelp,
} from "lucide-react";

// Reduced motion preference
const useReducedMotion = () => {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    setReducedMotion(mediaQuery.matches);

    const handleChange = (event) => {
      setReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return reducedMotion;
};

// Reveal animation
const useInView = (options = {}) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      {
        threshold: 0.12,
        ...options,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return [ref, isVisible];
};

// Simple fade-and-slide reveal
const Reveal = ({
  children,
  delay = 0,
  className = "",
  direction = "up",
}) => {
  const [ref, isVisible] = useInView();
  const reducedMotion = useReducedMotion();

  const directions = {
    up: "translateY(24px)",
    down: "translateY(-18px)",
    left: "translateX(-20px)",
    right: "translateX(20px)",
    none: "scale(0.98)",
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: reducedMotion || isVisible ? 1 : 0,
        transform:
          reducedMotion || isVisible
            ? "translate3d(0, 0, 0) scale(1)"
            : directions[direction],
        transition: reducedMotion
          ? "none"
          : `opacity 650ms ease ${delay}ms, transform 650ms ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

// Reusable section heading
const SectionHeading = ({
  icon: Icon,
  title,
  description,
}) => (
  <div className="flex items-center gap-4">
    <div className="h-12 w-12 rounded-2xl bg-[#E7F4F1] flex items-center justify-center shrink-0">
      <Icon size={25} className="text-[#256862]" />
    </div>

    <div>
      <h2 className="text-xl sm:text-2xl font-bold text-[#003435] font-bricolage">
        {title}
      </h2>

      <p className="text-base text-[#65736F] mt-1">
        {description}
      </p>
    </div>
  </div>
);

// Reusable findings list
const FindingsList = ({
  items = [],
  icon: Icon,
  emptyMessage,
  itemClassName = "",
  iconClassName = "",
  textClassName = "",
}) => {
  if (!items.length) {
    return (
      <p className="text-base text-[#65736F] bg-[#F5F8F6] rounded-xl p-4">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="mt-6 space-y-3">
      {items.map((item, index) => (
        <div
          key={`${index}-${item}`}
          className={`report-item flex items-start gap-3 rounded-xl p-4 border ${itemClassName}`}
        >
          <Icon
            size={20}
            className={`shrink-0 mt-0.5 ${iconClassName}`}
          />

          <p className={`text-base leading-relaxed ${textClassName}`}>
            {item}
          </p>
        </div>
      ))}
    </div>
  );
};

// Reusable dashboard statistic card
const InsightStatCard = ({
  icon: Icon,
  label,
  count,
  description,
  color,
  background,
  border,
}) => (
  <div className="report-card bg-white border border-[#CBDAD6] rounded-2xl p-5 sm:p-6 shadow-[0_5px_20px_rgba(0,52,53,0.035)]">
    <div className="flex items-start justify-between gap-3">
      <div
        className="h-12 w-12 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: background }}
      >
        <Icon size={24} style={{ color }} />
      </div>

      <span
        className="text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-full"
        style={{
          backgroundColor: background,
          color,
          border: `1px solid ${border}`,
        }}
      >
        Report insight
      </span>
    </div>

    <p className="text-3xl sm:text-4xl font-bold text-[#003435] mt-5 tabular-nums">
      {count}
    </p>

    <h3 className="text-base font-bold text-[#164B4D] mt-1">
      {label}
    </h3>

    <p className="text-sm sm:text-base text-[#65736F] mt-2">
      {description}
    </p>
  </div>
);

// Normal vs abnormal distribution
const FindingsDistribution = ({
  normalCount,
  abnormalCount,
}) => {
  const total = normalCount + abnormalCount;

  const normalPercentage =
    total > 0 ? (normalCount / total) * 100 : 0;

  const abnormalPercentage =
    total > 0 ? (abnormalCount / total) * 100 : 0;

  return (
    <section className="report-card bg-white border border-[#CBDAD6] rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,52,53,0.05)] h-full">
      <SectionHeading
        icon={PieChart}
        title="Finding Distribution"
        description="Distribution of findings classified by AI."
      />

      {total > 0 ? (
        <>
          <div className="mt-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-base font-semibold text-[#164B4D]">
                Classified findings
              </span>

              <span className="text-xl font-bold text-[#003435] tabular-nums">
                {total}
              </span>
            </div>

            <div className="flex h-5 w-full overflow-hidden rounded-full bg-[#EAF0ED]">
              {normalCount > 0 && (
                <div
                  className="h-full bg-[#27804D]"
                  style={{
                    width: `${normalPercentage}%`,
                  }}
                />
              )}

              {abnormalCount > 0 && (
                <div
                  className="h-full bg-[#D28A25]"
                  style={{
                    width: `${abnormalPercentage}%`,
                  }}
                />
              )}
            </div>
          </div>

          <div className="mt-8 space-y-5">
            <div>
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className="h-3.5 w-3.5 rounded-full bg-[#27804D]" />
                  <span className="text-base font-medium text-[#404848]">
                    Normal
                  </span>
                </div>

                <div className="text-right">
                  <span className="font-bold text-[#003435] tabular-nums">
                    {normalCount}
                  </span>

                  <span className="text-sm text-[#65736F] ml-2">
                    ({normalPercentage.toFixed(0)}%)
                  </span>
                </div>
              </div>

              <div className="h-2.5 rounded-full bg-[#EAF7F0] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#27804D]"
                  style={{
                    width: `${normalPercentage}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className="h-3.5 w-3.5 rounded-full bg-[#D28A25]" />
                  <span className="text-base font-medium text-[#404848]">
                    Abnormal
                  </span>
                </div>

                <div className="text-right">
                  <span className="font-bold text-[#003435] tabular-nums">
                    {abnormalCount}
                  </span>

                  <span className="text-sm text-[#65736F] ml-2">
                    ({abnormalPercentage.toFixed(0)}%)
                  </span>
                </div>
              </div>

              <div className="h-2.5 rounded-full bg-[#FFF4DF] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#D28A25]"
                  style={{
                    width: `${abnormalPercentage}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="mt-7 bg-[#F5F8F6] rounded-2xl border border-[#E5EEEB] p-4">
            <p className="text-sm sm:text-base text-[#65736F] leading-relaxed">
              This distribution represents the counts returned
              in the AI analysis. It does not measure medical
              severity or indicate a diagnosis.
            </p>
          </div>
        </>
      ) : (
        <div className="mt-8 rounded-2xl bg-[#F5F8F6] border border-[#E5EEEB] p-6 text-center">
          <BarChart3
            size={32}
            className="text-[#8CA69C] mx-auto"
          />

          <p className="text-base font-semibold text-[#164B4D] mt-3">
            No classified findings available
          </p>

          <p className="text-sm text-[#65736F] mt-1">
            The AI response did not return normal or abnormal
            findings for this report.
          </p>
        </div>
      )}
    </section>
  );
};

// Analysis coverage
const AnalysisCoverage = ({
  keyFindings,
  normalValues,
  abnormalValues,
  questionsToDiscuss,
}) => {
  const sections = [
    {
      label: "Key findings",
      count: keyFindings.length,
      icon: Search,
    },
    {
      label: "Normal values",
      count: normalValues.length,
      icon: CheckCircle2,
    },
    {
      label: "Abnormal values",
      count: abnormalValues.length,
      icon: AlertTriangle,
    },
    {
      label: "Doctor discussion points",
      count: questionsToDiscuss.length,
      icon: MessageCircle,
    },
  ];

  const populatedSections = sections.filter(
    (section) => section.count > 0
  ).length;

  const coveragePercentage =
    (populatedSections / sections.length) * 100;

  return (
    <section className="report-card bg-white border border-[#CBDAD6] rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,52,53,0.05)] h-full">
      <SectionHeading
        icon={ListChecks}
        title="Analysis Coverage"
        description="An overview of the sections populated in the AI response."
      />

      <div className="mt-7 flex items-end justify-between gap-4">
        <div>
          <p className="text-3xl font-bold text-[#003435] tabular-nums">
            {populatedSections}/{sections.length}
          </p>

          <p className="text-sm text-[#65736F] mt-1">
            Sections containing findings
          </p>
        </div>

        <p className="text-xl font-bold text-[#256862] tabular-nums">
          {coveragePercentage.toFixed(0)}%
        </p>
      </div>

      <div className="h-3 rounded-full bg-[#E7F4F1] mt-4 overflow-hidden">
        <div
          className="h-full rounded-full bg-[#256862]"
          style={{
            width: `${coveragePercentage}%`,
          }}
        />
      </div>

      <div className="mt-7 space-y-3">
        {sections.map((section) => {
          const Icon = section.icon;
          const hasItems = section.count > 0;

          return (
            <div
              key={section.label}
              className="flex items-center justify-between gap-3 rounded-xl bg-[#F7FAF8] border border-[#E5EEEB] p-3.5"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  size={19}
                  className={
                    hasItems
                      ? "text-[#256862] shrink-0"
                      : "text-[#A0ADA7] shrink-0"
                  }
                />

                <span className="text-sm sm:text-base font-medium text-[#404848]">
                  {section.label}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-sm font-bold text-[#164B4D] tabular-nums">
                  {section.count}
                </span>

                {hasItems ? (
                  <CheckCircle2
                    size={18}
                    className="text-[#27804D]"
                  />
                ) : (
                  <span className="text-xs text-[#8A9992]">
                    Empty
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-sm text-[#65736F] mt-5 leading-relaxed">
        Coverage describes which AI response sections contain
        items. An empty section does not necessarily mean the
        original medical report was incomplete.
      </p>
    </section>
  );
};

// Doctor follow-up reminder
const DoctorFollowUp = ({ questionsToDiscuss }) => {
  const hasQuestions = questionsToDiscuss.length > 0;

  return (
    <section
      className={`report-card rounded-3xl border p-6 sm:p-7 ${hasQuestions
        ? "bg-[#FFF9EC] border-[#F0DDB5]"
        : "bg-[#F0F7F3] border-[#CDE5D6]"
        }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-5">
        <div
          className={`h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 ${hasQuestions ? "bg-[#FBEBC9]" : "bg-[#DCEFE3]"
            }`}
        >
          {hasQuestions ? (
            <Stethoscope
              size={27}
              className="text-[#A66B16]"
            />
          ) : (
            <CheckCircle2
              size={27}
              className="text-[#27804D]"
            />
          )}
        </div>

        <div className="flex-1">
          <p
            className={`text-sm font-bold uppercase tracking-wide ${hasQuestions ? "text-[#A66B16]" : "text-[#27804D]"
              }`}
          >
            Doctor discussion
          </p>

          <h3 className="text-xl font-bold text-[#003435] mt-1 font-bricolage">
            {hasQuestions
              ? "Questions to take to your doctor"
              : "No discussion questions returned"}
          </h3>

          <p className="text-base text-[#65736F] mt-2 leading-relaxed">
            {hasQuestions
              ? `The AI analysis returned ${questionsToDiscuss.length} discussion ${questionsToDiscuss.length === 1
                ? "point"
                : "points"
              }. You can review them and consider discussing them with your healthcare professional.`
              : "The AI did not return any discussion questions. You can still consult your doctor about any concerns or symptoms."}
          </p>
        </div>

        <div
          className={`rounded-2xl px-5 py-3 text-center shrink-0 ${hasQuestions ? "bg-[#FBEBC9]" : "bg-[#DCEFE3]"
            }`}
        >
          <p
            className={`text-2xl font-bold tabular-nums ${hasQuestions ? "text-[#A66B16]" : "text-[#27804D]"
              }`}
          >
            {questionsToDiscuss.length}
          </p>

          <p
            className={`text-xs font-semibold ${hasQuestions ? "text-[#A66B16]" : "text-[#27804D]"
              }`}
          >
            Discussion points
          </p>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-[#E6DCC5]">
        <p className="text-sm text-[#74684F] leading-relaxed">
          This reminder does not assign urgency or determine
          whether medical attention is required.
        </p>
      </div>
    </section>
  );
};

const HealthReportAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);

  const [question, setQuestion] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);

  const chatScrollRef = useRef(null);

  const reducedMotion = useReducedMotion();

  // Keep the newest chat message in view
  useEffect(() => {
    const node = chatScrollRef.current;

    if (!node) return;

    node.scrollTo({
      top: node.scrollHeight,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  }, [chatMessages, chatLoading, reducedMotion]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    if (
      selectedFile.type !== "application/pdf" &&
      !selectedFile.name.toLowerCase().endsWith(".pdf")
    ) {
      setUploadResult({
        success: false,
        message: "Please select a valid PDF file.",
      });

      setFile(null);
      event.target.value = "";
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setUploadResult({
        success: false,
        message: "The PDF file must be smaller than 5 MB.",
      });

      setFile(null);
      event.target.value = "";
      return;
    }

    setFile(selectedFile);
    setUploadResult(null);
    setChatMessages([]);
  };

  const handleUpload = async () => {
    if (!file || uploading) return;

    try {
      setUploading(true);
      setUploadResult(null);
      setChatMessages([]);

      const token = localStorage.getItem("userToken");

      if (!token) {
        throw new Error("Please log in again to upload your report.");
      }

      const formData = new FormData();
      formData.append("report", file);

      const response = await api.post(
        "/reports/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      setUploadResult(response.data);
    } catch (error) {
      console.error("Report Upload Error:", error);

      setUploadResult({
        success: false,
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to analyze health report.",
      });
    } finally {
      setUploading(false);
    }
  };


  const handleAskAI = async () => {
    if (
      !question.trim() ||
      !uploadResult?.data?.report_id ||
      chatLoading
    ) {
      return;
    }

    const userQuestion = question.trim();

    setChatMessages((previous) => [
      ...previous,
      {
        role: "user",
        content: userQuestion,
      },
    ]);

    setQuestion("");
    setChatLoading(true);

    try {
      const token = localStorage.getItem("userToken");

      if (!token) {
        throw new Error("Please log in again to continue.");
      }

      const response = await api.post(
        `/reports/${uploadResult.data.report_id}/chat`,
        {
          question: userQuestion,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setChatMessages((previous) => [
          ...previous,
          {
            role: "ai",
            content: response.data.answer,
            sources: Array.isArray(response.data.sources)
              ? response.data.sources
              : [],
          },
        ]);
      } else {
        setChatMessages((previous) => [
          ...previous,
          {
            role: "ai",
            content: "Sorry, I could not answer that question.",
            sources: [],
          },
        ]);
      }
    } catch (error) {
      console.error("AI Chat Error:", error);

      setChatMessages((previous) => [
        ...previous,
        {
          role: "ai",
          content:
            error.response?.data?.message ||
            error.message ||
            "Sorry, something went wrong while asking AI.",
          sources: [],
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };


  const aiData = uploadResult?.data;

  const keyFindings = Array.isArray(aiData?.key_findings)
    ? aiData.key_findings
    : [];

  const normalValues = Array.isArray(aiData?.normal_values)
    ? aiData.normal_values
    : [];

  const abnormalValues = Array.isArray(aiData?.abnormal_values)
    ? aiData.abnormal_values
    : [];

  const questionsToDiscuss = Array.isArray(
    aiData?.questions_to_discuss
  )
    ? aiData.questions_to_discuss
    : [];

  return (
    <div className="min-h-screen bg-[#F5F8F6] report-analyzer-page">
      <style>{`
        .report-card {
          transition: box-shadow 250ms ease, border-color 250ms ease;
        }

        .report-card:hover {
          box-shadow: 0 16px 38px rgba(0, 52, 53, 0.09);
          border-color: #B8D9CF;
        }

        .report-item {
          transition: background-color 200ms ease, border-color 200ms ease;
        }

        .report-item:hover {
          border-color: #9CCFC4;
          background-color: #F7FBF9;
        }

        .report-upload-area {
          transition: background-color 200ms ease, border-color 200ms ease;
        }

        .report-upload-area:hover {
          border-color: #256862;
          background-color: #F3FAF7;
        }

        .report-upload-button {
          position: relative;
          overflow: hidden;
          transition: transform 200ms ease, box-shadow 200ms ease,
            background-color 200ms ease;
        }

        .report-upload-button:hover:not(:disabled) {
          transform: translateY(-2px);
        }

        .report-upload-button:active:not(:disabled) {
          transform: scale(0.98);
        }

        .report-chat-scroll::-webkit-scrollbar {
          width: 6px;
        }

        .report-chat-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .report-chat-scroll::-webkit-scrollbar-thumb {
          background: #CBDAD6;
          border-radius: 20px;
        }

        @media (prefers-reduced-motion: reduce) {
          .report-analyzer-page *,
          .report-analyzer-page *::before,
          .report-analyzer-page *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <Navbar />

      <main className="relative overflow-hidden py-10 md:py-14">
        {/* Soft background decorations */}
        <div className="absolute -top-24 -right-20 h-80 w-80 rounded-full bg-[#ADEFE7]/25 blur-3xl pointer-events-none" />

        <div className="absolute top-[45%] -left-24 h-80 w-80 rounded-full bg-[#dcf3ee]/40 blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          {/* Page Heading */}
          <div className="text-center mb-12">
            <Reveal direction="none">
              <div className="mx-auto mb-7 h-24 w-24 rounded-3xl bg-white border border-[#CBDAD6] shadow-[0_12px_35px_rgba(0,52,53,0.08)] flex items-center justify-center">
                <div className="h-16 w-16 rounded-2xl bg-[#E7F4F1] flex items-center justify-center">
                  <FileText
                    size={34}
                    className="text-[#256862]"
                  />
                </div>
              </div>
            </Reveal>

            <Reveal direction="down">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#CBDAD6] bg-white px-4 py-2 text-base font-semibold text-[#256862] mb-5 shadow-sm">
                <Sparkles size={19} />
                AI-Powered Healthcare
              </div>
            </Reveal>

            <Reveal delay={100}>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#003435] tracking-tight font-bricolage">
                AI Health Report Analyzer
              </h1>
            </Reveal>

            <Reveal delay={180}>
              <p className="mt-4 text-base sm:text-lg text-[#65736F] max-w-2xl mx-auto leading-relaxed">
                Upload your health report and let AI explain
                important findings in simple language, helping you
                better understand your health information.
              </p>
            </Reveal>

            <Reveal delay={260}>
              <div className="flex flex-wrap items-center justify-center gap-4 mt-7">
                <div className="report-card flex items-center gap-2 bg-white border border-[#CBDAD6] rounded-xl px-4 py-3 shadow-sm">
                  <FileCheck
                    size={20}
                    className="text-[#256862]"
                  />

                  <span className="text-base font-medium text-[#164B4D]">
                    PDF Report Analysis
                  </span>
                </div>

                <div className="report-card flex items-center gap-2 bg-white border border-[#CBDAD6] rounded-xl px-4 py-3 shadow-sm">
                  <Brain
                    size={20}
                    className="text-[#256862]"
                  />

                  <span className="text-base font-medium text-[#164B4D]">
                    AI-Powered Insights
                  </span>
                </div>

                <div className="report-card flex items-center gap-2 bg-white border border-[#CBDAD6] rounded-xl px-4 py-3 shadow-sm">
                  <BarChart3
                    size={20}
                    className="text-[#256862]"
                  />

                  <span className="text-base font-medium text-[#164B4D]">
                    Visual Report Overview
                  </span>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Upload Section */}
          <Reveal>
            <section className="report-card bg-white border border-[#CBDAD6] rounded-3xl shadow-[0_12px_40px_rgba(0,52,53,0.06)] overflow-hidden">
              <div className="bg-[#003435] px-6 sm:px-8 py-7">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-[#ADEFE7] flex items-center justify-center shrink-0">
                    <FileText
                      size={28}
                      className="text-[#003435]"
                    />
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-white font-bricolage">
                      Upload Your Health Report
                    </h2>

                    <p className="text-base text-[#ADEFE7] mt-1">
                      Upload a PDF medical report to get AI-powered
                      insights.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <div className="report-upload-area border-2 border-dashed border-[#B8CEC7] rounded-3xl p-8 sm:p-12 text-center bg-[#FAFCFB]">
                  <div className="mx-auto mb-6 h-20 w-20 rounded-3xl bg-[#E7F4F1] flex items-center justify-center">
                    <FileUp
                      size={38}
                      className="text-[#256862]"
                    />
                  </div>

                  <h3 className="text-2xl font-bold text-[#003435] font-bricolage">
                    Select Your Medical Report
                  </h3>

                  <p className="text-base text-[#65736F] mt-3">
                    Choose a PDF file from your device to begin
                    analysis.
                  </p>

                  <label className="inline-block mt-7 cursor-pointer">
                    <span className="report-upload-button inline-flex items-center justify-center gap-3 bg-[#003435] hover:bg-[#164B4D] text-white px-7 py-4 rounded-2xl font-semibold text-base shadow-lg shadow-[#003435]/10">
                      <Upload size={21} />
                      Choose Report
                    </span>

                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>

                  <p className="text-base text-[#65736F] mt-5">
                    Accepted format: PDF · Maximum size: 5 MB
                  </p>

                  {file && (
                    <div className="mt-8 bg-[#E7F4F1] border border-[#B8DED5] rounded-2xl p-5 text-left">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center shrink-0">
                          <FileText
                            size={25}
                            className="text-[#256862]"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-base font-semibold text-[#164B4D]">
                            Selected File
                          </p>

                          <p className="text-base font-bold text-[#003435] mt-2 break-all">
                            {file.name}
                          </p>

                          <p className="text-base text-[#65736F] mt-1">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>

                        <CheckCircle2
                          size={23}
                          className="text-[#256862] shrink-0"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Analyze Button */}
                <div className="mt-8 text-center">
                  <button
                    onClick={handleUpload}
                    disabled={!file || uploading}
                    className={`report-upload-button inline-flex items-center justify-center gap-3 px-9 py-4 rounded-2xl font-bold text-base ${file && !uploading
                      ? "bg-[#003435] hover:bg-[#164B4D] text-white shadow-lg shadow-[#003435]/10"
                      : "bg-[#E3EBE8] text-[#91A39C] cursor-not-allowed"
                      }`}
                  >
                    {uploading ? (
                      <>
                        <LoaderCircle
                          size={22}
                          className="animate-spin"
                        />
                        Analyzing Report...
                      </>
                    ) : (
                      <>
                        <Sparkles size={21} />
                        Analyze Report
                      </>
                    )}
                  </button>

                  {uploading && (
                    <div className="mx-auto mt-6 w-full max-w-sm">
                      <div className="h-1.5 overflow-hidden rounded-full bg-[#E3EBE8]">
                        <div className="h-full w-1/3 rounded-full bg-[#258B76] animate-pulse" />
                      </div>

                      <p className="mt-3 text-base text-[#65736F]">
                        Reading your report and preparing insights...
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </Reveal>

          {/* Upload Result */}
          {uploadResult && (
            <Reveal delay={100}>
              <div
                className={`mt-6 rounded-2xl p-5 sm:p-6 border ${uploadResult.success
                  ? "bg-[#E7F4F1] border-[#B8DED5]"
                  : "bg-red-50 border-red-200"
                  }`}
              >
                <div className="flex items-center gap-3">
                  {uploadResult.success ? (
                    <CheckCircle2
                      size={25}
                      className="text-[#256862] shrink-0"
                    />
                  ) : (
                    <XCircle
                      size={25}
                      className="text-red-600 shrink-0"
                    />
                  )}

                  <p
                    className={`text-base font-semibold ${uploadResult.success
                      ? "text-[#164B4D]"
                      : "text-red-700"
                      }`}
                  >
                    {uploadResult.success
                      ? "Report analyzed successfully"
                      : uploadResult.message}
                  </p>
                </div>
              </div>
            </Reveal>
          )}

          {/* AI Analysis Results */}
          {aiData && uploadResult?.success && (
            <div className="mt-10 space-y-7">
              {/* Summary */}
              <Reveal>
                <section className="report-card bg-white border border-[#CBDAD6] rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,52,53,0.05)]">
                  <SectionHeading
                    icon={Brain}
                    title="AI Summary"
                    description="An overview of your uploaded health report."
                  />

                  <div className="mt-6 bg-[#F5F8F6] border border-[#E5EEEB] rounded-2xl p-6">
                    <p className="text-base text-[#404848] leading-8 whitespace-pre-line">
                      {aiData.summary ||
                        "No summary was returned for this report."}
                    </p>
                  </div>
                </section>
              </Reveal>

              {/* Report Insights Dashboard */}
              <Reveal delay={80}>
                <section className="space-y-6">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-2xl bg-[#E7F4F1] flex items-center justify-center">
                        <Activity
                          size={25}
                          className="text-[#256862]"
                        />
                      </div>

                      <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-[#003435] font-bricolage">
                          Report Insights Dashboard
                        </h2>

                        <p className="text-base text-[#65736F] mt-1">
                          A structured overview of your AI report analysis.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    <InsightStatCard
                      icon={Search}
                      label="Key Findings"
                      count={keyFindings.length}
                      description="Important points identified in the report."
                      color="#256862"
                      background="#E7F4F1"
                      border="#C8E5DC"
                    />

                    <InsightStatCard
                      icon={CheckCircle2}
                      label="Normal Findings"
                      count={normalValues.length}
                      description="Items classified as normal by AI."
                      color="#27804D"
                      background="#EAF7F0"
                      border="#CDE9D8"
                    />

                    <InsightStatCard
                      icon={AlertTriangle}
                      label="Abnormal Findings"
                      count={abnormalValues.length}
                      description="Items flagged as abnormal by AI."
                      color="#B7791F"
                      background="#FFF4DF"
                      border="#F0DDB5"
                    />

                    <InsightStatCard
                      icon={MessageCircle}
                      label="Discussion Points"
                      count={questionsToDiscuss.length}
                      description="Questions suggested for your doctor."
                      color="#6284A5"
                      background="#EDF3F9"
                      border="#D6E3F0"
                    />
                  </div>

                  {/* Distribution and Coverage */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <FindingsDistribution
                      normalCount={normalValues.length}
                      abnormalCount={abnormalValues.length}
                    />

                    <AnalysisCoverage
                      keyFindings={keyFindings}
                      normalValues={normalValues}
                      abnormalValues={abnormalValues}
                      questionsToDiscuss={questionsToDiscuss}
                    />
                  </div>

                  {/* Doctor Follow-up Reminder */}
                  <DoctorFollowUp
                    questionsToDiscuss={questionsToDiscuss}
                  />
                </section>
              </Reveal>

              {/* Key Findings */}
              <Reveal delay={100}>
                <section className="report-card bg-white border border-[#CBDAD6] rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,52,53,0.05)]">
                  <SectionHeading
                    icon={Search}
                    title="Key Findings"
                    description="Important points identified in your report."
                  />

                  <div className="mt-6 space-y-3">
                    {keyFindings.length > 0 ? (
                      keyFindings.map((finding, index) => (
                        <div
                          key={index}
                          className="report-item flex items-start gap-4 bg-[#F3F9F6] border border-[#DCEBE5] rounded-2xl p-5"
                        >
                          <div className="h-9 w-9 rounded-xl bg-[#E7F4F1] flex items-center justify-center shrink-0">
                            <span className="text-base font-bold text-[#256862]">
                              {index + 1}
                            </span>
                          </div>

                          <p className="text-base text-[#404848] leading-relaxed pt-1">
                            {finding}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-base text-[#65736F] bg-[#F5F8F6] rounded-xl p-4">
                        No key findings returned.
                      </p>
                    )}
                  </div>
                </section>
              </Reveal>

              {/* Normal and Abnormal Values */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Reveal direction="left" className="h-full">
                  <section className="report-card h-full bg-white border border-[#CBDAD6] rounded-3xl p-6 sm:p-7 shadow-[0_8px_30px_rgba(0,52,53,0.05)]">
                    <SectionHeading
                      icon={CheckCircle2}
                      title="Normal Values"
                      description="Values identified as normal."
                    />

                    <FindingsList
                      items={normalValues}
                      icon={CheckCircle2}
                      emptyMessage="No normal values returned."
                      itemClassName="bg-[#EAF7F0] border-[#CDE9D8]"
                      iconClassName="text-[#27804D]"
                      textClassName="text-[#285E3C]"
                    />
                  </section>
                </Reveal>

                <Reveal direction="right" delay={100} className="h-full">
                  <section className="report-card h-full bg-white border border-[#CBDAD6] rounded-3xl p-6 sm:p-7 shadow-[0_8px_30px_rgba(0,52,53,0.05)]">
                    <SectionHeading
                      icon={AlertTriangle}
                      title="Abnormal Values"
                      description="Values identified as abnormal."
                    />

                    <FindingsList
                      items={abnormalValues}
                      icon={AlertTriangle}
                      emptyMessage="No abnormal values identified."
                      itemClassName="bg-amber-50 border-amber-200"
                      iconClassName="text-amber-600"
                      textClassName="text-amber-900"
                    />
                  </section>
                </Reveal>
              </div>

              {/* Questions to Discuss */}
              <Reveal delay={100}>
                <section className="report-card bg-white border border-[#CBDAD6] rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,52,53,0.05)]">
                  <SectionHeading
                    icon={MessageCircle}
                    title="Questions to Discuss"
                    description="Questions you may want to discuss with your doctor."
                  />

                  <div className="mt-6 space-y-3">
                    {questionsToDiscuss.length > 0 ? (
                      questionsToDiscuss.map((item, index) => (
                        <div
                          key={index}
                          className="report-item flex items-start gap-4 bg-[#F3F9F6] border border-[#DCEBE5] rounded-2xl p-5"
                        >
                          <div className="h-9 w-9 rounded-xl bg-[#E7F4F1] flex items-center justify-center shrink-0">
                            <span className="text-base font-bold text-[#256862]">
                              {index + 1}
                            </span>
                          </div>

                          <p className="text-base text-[#404848] leading-relaxed pt-1">
                            {item}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-base text-[#65736F] bg-[#F5F8F6] rounded-xl p-4">
                        No discussion questions returned.
                      </p>
                    )}
                  </div>
                </section>
              </Reveal>
            </div>
          )}

          {/* Ask AI Section */}
          {aiData && uploadResult?.success && (
            <Reveal delay={120}>
              <section className="mt-8 report-card bg-white border border-[#CBDAD6] rounded-3xl overflow-hidden shadow-[0_12px_40px_rgba(0,52,53,0.06)]">
                <div className="bg-[#003435] px-6 sm:px-8 py-7">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-[#ADEFE7] flex items-center justify-center shrink-0">
                      <Bot
                        size={30}
                        className="text-[#003435]"
                      />
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold text-white font-bricolage">
                        Ask AI About Your Report
                      </h2>

                      <p className="text-base text-[#ADEFE7] mt-1">
                        Ask questions about your uploaded report.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-8">
                  {chatMessages.length === 0 && (
                    <div className="bg-[#F5F8F6] border border-[#E5EEEB] rounded-2xl p-7 text-center">
                      <div className="h-14 w-14 rounded-2xl bg-[#E7F4F1] flex items-center justify-center mx-auto mb-4">
                        <MessageCircle
                          size={27}
                          className="text-[#256862]"
                        />
                      </div>

                      <h3 className="text-lg font-bold text-[#003435]">
                        Start a Conversation
                      </h3>

                      <p className="text-base text-[#65736F] mt-2">
                        Ask a question to understand something in
                        your uploaded health report.
                      </p>
                    </div>
                  )}

                  {chatMessages.length > 0 && (
                    <div
                      ref={chatScrollRef}
                      className="report-chat-scroll space-y-5 max-h-[450px] overflow-y-auto pr-2"
                    >
                      {chatMessages.map((message, index) => (
                        <div
                          key={index}
                          className={`flex ${message.role === "user"
                            ? "justify-end"
                            : "justify-start"
                            }`}
                        >
                          <div
                            className={`flex items-start gap-3 max-w-[90%] sm:max-w-[80%] ${message.role === "user"
                              ? "flex-row-reverse"
                              : "flex-row"
                              }`}
                          >
                            <div
                              className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${message.role === "user"
                                ? "bg-[#003435]"
                                : "bg-[#E7F4F1]"
                                }`}
                            >
                              {message.role === "user" ? (
                                <UserRound
                                  size={21}
                                  className="text-white"
                                />
                              ) : (
                                <Bot
                                  size={21}
                                  className="text-[#256862]"
                                />
                              )}
                            </div>


                            <div
                              className={`rounded-2xl px-5 py-4 ${message.role === "user"
                                ? "bg-[#003435] text-white rounded-tr-sm"
                                : "bg-[#F0F6F3] border border-[#DCEBE5] text-[#164B4D] rounded-tl-sm"
                                }`}
                            >
                              <p className="text-base leading-relaxed whitespace-pre-line">
                                {message.content}
                              </p>

                              {message.role === "ai" &&
                                Array.isArray(message.sources) &&
                                message.sources.length > 0 && (
                                  <div className="mt-4 pt-3 border-t border-[#DCEBE5]">
                                    <p className="text-sm font-bold text-[#164B4D] mb-2">
                                      Trusted References
                                    </p>

                                    <div className="space-y-2">
                                      {message.sources.map((source, sourceIndex) => (
                                        <a
                                          key={`${source.url}-${sourceIndex}`}
                                          href={source.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="flex flex-col gap-0.5 text-sm text-[#256862] hover:text-[#003435] underline underline-offset-2 break-words"
                                        >
                                          <span className="font-semibold">
                                            {source.title}
                                          </span>

                                          <span className="text-xs text-[#65736F] no-underline">
                                            {source.organization}
                                          </span>
                                        </a>
                                      ))}
                                    </div>
                                  </div>
                                )}
                            </div>

                          </div>
                        </div>
                      ))}

                      {chatLoading && (
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-[#E7F4F1] flex items-center justify-center">
                            <Bot
                              size={21}
                              className="text-[#256862]"
                            />
                          </div>

                          <div className="flex items-center gap-3 bg-[#F0F6F3] border border-[#DCEBE5] rounded-2xl px-5 py-4">
                            <LoaderCircle
                              size={19}
                              className="animate-spin text-[#256862]"
                            />

                            <p className="text-base text-[#65736F]">
                              AI is preparing your answer...
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Chat Input */}
                  <div className="mt-7 flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={question}
                        onChange={(event) =>
                          setQuestion(event.target.value)
                        }
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            handleAskAI();
                          }
                        }}
                        placeholder="e.g. What does my hemoglobin level mean?"
                        disabled={chatLoading}
                        className="w-full border border-[#CBDAD6] rounded-2xl px-5 py-4 bg-[#FAFCFB] text-base text-[#003435] placeholder:text-[#8B9994] outline-none transition-all duration-200 focus:border-[#256862] focus:ring-4 focus:ring-[#ADEFE7]/40 disabled:bg-[#F1F5F3]"
                      />
                    </div>

                    <button
                      onClick={handleAskAI}
                      disabled={!question.trim() || chatLoading}
                      className={`report-upload-button inline-flex items-center justify-center gap-3 px-7 py-4 rounded-2xl font-bold text-base ${question.trim() && !chatLoading
                        ? "bg-[#003435] hover:bg-[#164B4D] text-white shadow-lg shadow-[#003435]/10"
                        : "bg-[#E3EBE8] text-[#91A39C] cursor-not-allowed"
                        }`}
                    >
                      {chatLoading ? (
                        <>
                          <LoaderCircle
                            size={21}
                            className="animate-spin"
                          />
                          Asking...
                        </>
                      ) : (
                        <>
                          <Send size={20} />
                          Ask AI
                        </>
                      )}
                    </button>
                  </div>

                  <div className="mt-5 flex items-start gap-3">
                    <ShieldCheck
                      size={20}
                      className="text-[#256862] shrink-0 mt-0.5"
                    />

                    <p className="text-base text-[#65736F] leading-relaxed">
                      AI answers are based on the uploaded report
                      and are for educational purposes only.
                    </p>
                  </div>
                </div>
              </section>
            </Reveal>
          )}

          {/* Medical Disclaimer */}
          <Reveal delay={100}>
            <div className="report-card mt-8 bg-amber-50 border border-amber-200 rounded-2xl p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <div className="h-11 w-11 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                  <AlertTriangle
                    size={23}
                    className="text-amber-700"
                  />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-amber-900">
                    Important Medical Disclaimer
                  </h3>

                  <p className="text-base text-amber-800 mt-2 leading-relaxed">
                    AI-generated information is for educational
                    purposes and should not replace advice from a
                    qualified healthcare professional.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Back to Home */}
          <Reveal delay={150}>
            <div className="text-center mt-9">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-[#256862] hover:text-[#003435] font-semibold text-base transition-all duration-200 hover:-translate-x-1"
              >
                <ArrowLeft size={20} />
                Back to Home
              </Link>
            </div>
          </Reveal>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HealthReportAnalyzer;
