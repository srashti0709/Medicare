
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";

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
  Stethoscope,
  FileUp,
} from "lucide-react";

// Reduced motion preference
const useReducedMotion = () => {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

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

// Scroll reveal hook
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

// Scroll reveal component
const Reveal = ({
  children,
  delay = 0,
  className = "",
  direction = "up",
}) => {
  const [ref, isVisible] = useInView();
  const reducedMotion = useReducedMotion();

  const directions = {
    up: "translateY(35px)",
    down: "translateY(-25px)",
    left: "translateX(-35px)",
    right: "translateX(35px)",
    none: "scale(0.97)",
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
          : `opacity 700ms ease ${delay}ms, transform 700ms cubic-bezier(0.2, 0.7, 0.2, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

// Subtle 3D tilt effect
const Tilt = ({ children, className = "" }) => {
  const ref = useRef(null);
  const reducedMotion = useReducedMotion();

  const handleMouseMove = (event) => {
    if (reducedMotion || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -2;
    const rotateY = ((x - centerX) / centerX) * 2;

    ref.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  };

  const handleMouseLeave = () => {
    if (!ref.current) return;

    ref.current.style.transform =
      "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)";
  };

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transition: "transform 350ms ease",
        transformStyle: "preserve-3d",
      }}
    >
      {children}
    </div>
  );
};

const HealthReportAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);

  const [question, setQuestion] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);

  const reducedMotion = useReducedMotion();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      setFile(selectedFile);
      setUploadResult(null);
      setChatMessages([]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setUploading(true);
      setUploadResult(null);
      setChatMessages([]);

      const formData = new FormData();
      formData.append("report", file);

      const token = localStorage.getItem("userToken");
      const response = await axios.post(
        "http://localhost:5000/api/reports/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("REPORT RESPONSE:", response.data);

      setUploadResult(response.data);
    } catch (error) {
      console.error("Report Upload Error:", error);

      setUploadResult({
        success: false,
        message: "Failed to analyze health report",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleAskAI = async () => {
    if (!question.trim() || !uploadResult?.data?.report_text) return;

    const userQuestion = question.trim();

    setChatMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userQuestion,
      },
    ]);

    setQuestion("");
    setChatLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/report/chat",
        {
          report_text: uploadResult.data.report_text,
          question: userQuestion,
        }
      );

      if (response.data.success) {
        setChatMessages((prev) => [
          ...prev,
          {
            role: "ai",
            content: response.data.answer,
          },
        ]);
      } else {
        setChatMessages((prev) => [
          ...prev,
          {
            role: "ai",
            content: "Sorry, I could not answer that question.",
          },
        ]);
      }
    } catch (error) {
      console.error("AI Chat Error:", error);

      setChatMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: "Sorry, something went wrong while asking AI.",
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const aiData = uploadResult?.data;

  return (
    <div className="min-h-screen bg-[#F5F8F6] report-analyzer-page">
      <style>{`
        @keyframes reportFloat {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(0, -18px, 0);
          }
        }

        @keyframes reportFloatReverse {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(0, 16px, 0);
          }
        }

        @keyframes reportPulse {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.08);
          }
        }

        @keyframes reportSpin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes reportEntrance {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes reportMessage {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .report-float {
          animation: reportFloat 7s ease-in-out infinite;
        }

        .report-float-reverse {
          animation: reportFloatReverse 8s ease-in-out infinite;
        }

        .report-pulse {
          animation: reportPulse 5s ease-in-out infinite;
        }

        .report-spin {
          animation: reportSpin 24s linear infinite;
        }

        .report-message {
          animation: reportMessage 450ms ease-out both;
        }

        .report-card {
          transition: box-shadow 350ms ease, border-color 350ms ease;
        }

        .report-card:hover {
          box-shadow: 0 16px 40px rgba(0, 52, 53, 0.09);
          border-color: #B8CEC7;
        }

        .report-icon {
          transition: transform 350ms ease;
        }

        .report-card:hover .report-icon {
          transform: translateY(-4px) rotate(-5deg);
        }

        .report-upload-area {
          transition: background-color 300ms ease, border-color 300ms ease, transform 300ms ease;
        }

        .report-upload-area:hover {
          transform: translateY(-3px);
        }

        .report-header-icon {
          animation: reportFloat 5s ease-in-out infinite;
        }

        .report-upload-button {
          transition: transform 250ms ease, box-shadow 250ms ease, background-color 250ms ease;
        }

        .report-upload-button:hover {
          transform: translateY(-3px);
        }

        .report-upload-button:active {
          transform: scale(0.98);
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
        {/* Background Decorations */}
        <div className="absolute -top-24 -right-20 h-80 w-80 rounded-full bg-[#ADEFE7]/30 blur-3xl pointer-events-none report-float" />

        <div className="absolute top-[700px] -left-24 h-80 w-80 rounded-full bg-[#dcf3ee]/50 blur-3xl pointer-events-none report-float-reverse" />

        <div className="absolute top-[40%] right-[-70px] h-44 w-44 rounded-full border-[24px] border-[#ADEFE7]/10 pointer-events-none report-spin" />

        <div className="absolute bottom-44 left-[8%] h-20 w-20 rounded-full bg-[#ADEFE7]/20 blur-2xl pointer-events-none report-pulse" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          {/* Page Heading */}
          <div className="text-center mb-12">
            <Reveal direction="down">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#CBDAD6] bg-white px-4 py-2 text-base font-semibold text-[#256862] mb-5 shadow-sm">
                <Sparkles size={19} />
                AI-Powered Healthcare
              </div>
            </Reveal>

            <Reveal delay={120}>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#003435] tracking-tight font-bricolage">
                AI Health Report Analyzer
              </h1>
            </Reveal>

            <Reveal delay={220}>
              <p className="mt-4 text-base sm:text-lg text-[#65736F] max-w-2xl mx-auto leading-relaxed">
                Upload your health report and let AI explain important
                findings in simple language, helping you better understand
                your health information.
              </p>
            </Reveal>

            <Reveal delay={320}>
              <div className="flex flex-wrap items-center justify-center gap-4 mt-7">
                <div className="report-card flex items-center gap-2 bg-white border border-[#CBDAD6] rounded-xl px-4 py-3 shadow-sm">
                  <FileCheck size={20} className="text-[#256862]" />
                  <span className="text-base font-medium text-[#164B4D]">
                    PDF Report Analysis
                  </span>
                </div>

                <div className="report-card flex items-center gap-2 bg-white border border-[#CBDAD6] rounded-xl px-4 py-3 shadow-sm">
                  <Brain size={20} className="text-[#256862]" />
                  <span className="text-base font-medium text-[#164B4D]">
                    AI-Powered Insights
                  </span>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Upload Section */}
          <Reveal>
            <section className="report-card bg-white border border-[#CBDAD6] rounded-3xl shadow-[0_12px_40px_rgba(0,52,53,0.06)] overflow-hidden">
              {/* Section Header */}
              <div className="bg-[#003435] px-6 sm:px-8 py-7 relative overflow-hidden">
                <div className="absolute -right-8 -top-12 h-44 w-44 rounded-full border-[28px] border-white/5 report-spin" />
                <div className="absolute right-20 -bottom-16 h-36 w-36 rounded-full bg-[#ADEFE7]/10 blur-2xl report-pulse" />

                <div className="relative flex items-center gap-4">
                  <div className="report-header-icon h-14 w-14 rounded-2xl bg-[#ADEFE7] flex items-center justify-center shrink-0">
                    <FileText size={28} className="text-[#003435]" />
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-white font-bricolage">
                      Upload Your Health Report
                    </h2>
                    <p className="text-base text-[#ADEFE7] mt-1">
                      Upload a PDF medical report to get AI-powered insights.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                {/* File Upload Area */}
                <div className="report-upload-area border-2 border-dashed border-[#B8CEC7] rounded-3xl p-8 sm:p-12 text-center bg-[#FAFCFB] hover:border-[#256862] hover:bg-[#F3FAF7] transition-all duration-300">
                  <div className="report-icon h-20 w-20 rounded-3xl bg-[#E7F4F1] flex items-center justify-center mx-auto mb-6">
                    <FileUp size={38} className="text-[#256862]" />
                  </div>

                  <h3 className="text-2xl font-bold text-[#003435] font-bricolage">
                    Select Your Medical Report
                  </h3>

                  <p className="text-base text-[#65736F] mt-3">
                    Choose a PDF file from your device to begin analysis.
                  </p>

                  <label className="inline-block mt-7 cursor-pointer">
                    <span className="report-upload-button inline-flex items-center justify-center gap-3 bg-[#003435] hover:bg-[#164B4D] text-white px-7 py-4 rounded-2xl font-semibold text-base shadow-lg shadow-[#003435]/10 transition-all duration-300">
                      <Upload size={21} />
                      Choose Report
                    </span>

                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>

                  <p className="text-base text-[#65736F] mt-5">
                    Accepted format: PDF
                  </p>

                  {/* Selected File */}
                  {file && (
                    <div className="mt-8 bg-[#E7F4F1] border border-[#B8DED5] rounded-2xl p-5 text-left report-message">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center shrink-0">
                          <FileText size={25} className="text-[#256862]" />
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
                    className={`report-upload-button inline-flex items-center justify-center gap-3 px-9 py-4 rounded-2xl font-bold text-base transition-all duration-300 ${
                      file && !uploading
                        ? "bg-[#003435] hover:bg-[#164B4D] text-white shadow-lg shadow-[#003435]/10 hover:shadow-xl"
                        : "bg-[#E3EBE8] text-[#91A39C] cursor-not-allowed"
                    }`}
                  >
                    {uploading ? (
                      <>
                        <LoaderCircle size={22} className="animate-spin" />
                        Analyzing Report...
                      </>
                    ) : (
                      <>
                        <Sparkles size={21} />
                        Analyze Report
                      </>
                    )}
                  </button>
                </div>
              </div>
            </section>
          </Reveal>

          {/* Upload Result */}
          {uploadResult && (
            <Reveal delay={100}>
              <div
                className={`mt-6 rounded-2xl p-5 sm:p-6 border ${
                  uploadResult.success
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
                    className={`text-base font-semibold ${
                      uploadResult.success
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
              {/* AI Summary */}
              <Reveal>
                <Tilt>
                  <section className="report-card bg-white border border-[#CBDAD6] rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,52,53,0.05)]">
                    <div className="flex items-center gap-4">
                      <div className="report-icon h-12 w-12 rounded-2xl bg-[#E7F4F1] flex items-center justify-center shrink-0">
                        <Brain size={26} className="text-[#256862]" />
                      </div>

                      <div>
                        <h2 className="text-2xl font-bold text-[#003435] font-bricolage">
                          AI Summary
                        </h2>
                        <p className="text-base text-[#65736F] mt-1">
                          An overview of your uploaded health report.
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 bg-[#F5F8F6] border border-[#E5EEEB] rounded-2xl p-6">
                      <p className="text-base text-[#404848] leading-8 whitespace-pre-line">
                        {aiData.summary}
                      </p>
                    </div>
                  </section>
                </Tilt>
              </Reveal>

              {/* Key Findings */}
              <Reveal delay={100}>
                <section className="report-card bg-white border border-[#CBDAD6] rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,52,53,0.05)]">
                  <div className="flex items-center gap-4">
                    <div className="report-icon h-12 w-12 rounded-2xl bg-[#E7F4F1] flex items-center justify-center shrink-0">
                      <Search size={25} className="text-[#256862]" />
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold text-[#003435] font-bricolage">
                        Key Findings
                      </h2>
                      <p className="text-base text-[#65736F] mt-1">
                        Important points identified in your report.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    {aiData.key_findings?.map((finding, index) => (
                      <div
                        key={index}
                        className="report-message flex items-start gap-4 bg-[#F3F9F6] border border-[#DCEBE5] rounded-2xl p-5"
                        style={{
                          animationDelay: reducedMotion
                            ? "0ms"
                            : `${index * 100}ms`,
                        }}
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
                    ))}
                  </div>
                </section>
              </Reveal>

              {/* Normal and Abnormal Values */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Normal Values */}
                <Reveal>
                  <section className="report-card h-full bg-white border border-[#CBDAD6] rounded-3xl p-6 sm:p-7 shadow-[0_8px_30px_rgba(0,52,53,0.05)]">
                    <div className="flex items-center gap-4">
                      <div className="report-icon h-12 w-12 rounded-2xl bg-[#E7F4F1] flex items-center justify-center shrink-0">
                        <CheckCircle2
                          size={26}
                          className="text-[#256862]"
                        />
                      </div>

                      <div>
                        <h2 className="text-xl font-bold text-[#003435] font-bricolage">
                          Normal Values
                        </h2>
                        <p className="text-base text-[#65736F] mt-1">
                          Values identified as normal.
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 space-y-3">
                      {aiData.normal_values?.length > 0 ? (
                        aiData.normal_values.map((value, index) => (
                          <div
                            key={index}
                            className="report-message flex items-start gap-3 bg-[#EAF7F0] border border-[#CDE9D8] rounded-xl p-4"
                            style={{
                              animationDelay: reducedMotion
                                ? "0ms"
                                : `${index * 80}ms`,
                            }}
                          >
                            <CheckCircle2
                              size={20}
                              className="text-[#27804D] shrink-0 mt-0.5"
                            />

                            <p className="text-base text-[#285E3C] leading-relaxed">
                              {value}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-base text-[#65736F] bg-[#F5F8F6] rounded-xl p-4">
                          No normal values returned.
                        </p>
                      )}
                    </div>
                  </section>
                </Reveal>

                {/* Abnormal Values */}
                <Reveal delay={120}>
                  <section className="report-card h-full bg-white border border-[#CBDAD6] rounded-3xl p-6 sm:p-7 shadow-[0_8px_30px_rgba(0,52,53,0.05)]">
                    <div className="flex items-center gap-4">
                      <div className="report-icon h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0">
                        <AlertTriangle
                          size={26}
                          className="text-amber-600"
                        />
                      </div>

                      <div>
                        <h2 className="text-xl font-bold text-[#003435] font-bricolage">
                          Abnormal Values
                        </h2>
                        <p className="text-base text-[#65736F] mt-1">
                          Values requiring attention.
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 space-y-3">
                      {aiData.abnormal_values?.length > 0 ? (
                        aiData.abnormal_values.map((value, index) => (
                          <div
                            key={index}
                            className="report-message flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4"
                            style={{
                              animationDelay: reducedMotion
                                ? "0ms"
                                : `${index * 80}ms`,
                            }}
                          >
                            <AlertTriangle
                              size={20}
                              className="text-amber-600 shrink-0 mt-0.5"
                            />

                            <p className="text-base text-amber-900 leading-relaxed">
                              {value}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-base text-[#65736F] bg-[#F5F8F6] rounded-xl p-4">
                          No abnormal values identified.
                        </p>
                      )}
                    </div>
                  </section>
                </Reveal>
              </div>

              {/* Questions to Discuss */}
              <Reveal delay={100}>
                <section className="report-card bg-white border border-[#CBDAD6] rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,52,53,0.05)]">
                  <div className="flex items-center gap-4">
                    <div className="report-icon h-12 w-12 rounded-2xl bg-[#E7F4F1] flex items-center justify-center shrink-0">
                      <MessageCircle
                        size={25}
                        className="text-[#256862]"
                      />
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold text-[#003435] font-bricolage">
                        Questions to Discuss
                      </h2>
                      <p className="text-base text-[#65736F] mt-1">
                        Questions you may want to discuss with your doctor.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    {aiData.questions_to_discuss?.map((question, index) => (
                      <div
                        key={index}
                        className="report-message flex items-start gap-4 bg-[#F3F9F6] border border-[#DCEBE5] rounded-2xl p-5"
                        style={{
                          animationDelay: reducedMotion
                            ? "0ms"
                            : `${index * 100}ms`,
                        }}
                      >
                        <div className="h-9 w-9 rounded-xl bg-[#E7F4F1] flex items-center justify-center shrink-0">
                          <span className="text-base font-bold text-[#256862]">
                            {index + 1}
                          </span>
                        </div>

                        <p className="text-base text-[#404848] leading-relaxed pt-1">
                          {question}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              </Reveal>
            </div>
          )}

          {/* Ask AI Section */}
          {aiData && uploadResult?.success && (
            <Reveal delay={120}>
              <section className="mt-8 report-card bg-white border border-[#CBDAD6] rounded-3xl overflow-hidden shadow-[0_12px_40px_rgba(0,52,53,0.06)]">
                {/* Chat Header */}
                <div className="bg-[#003435] px-6 sm:px-8 py-7 relative overflow-hidden">
                  <div className="absolute -right-8 -top-12 h-44 w-44 rounded-full border-[28px] border-white/5 report-spin" />

                  <div className="absolute right-28 bottom-[-55px] h-32 w-32 rounded-full bg-[#ADEFE7]/10 blur-2xl report-pulse" />

                  <div className="relative flex items-center gap-4">
                    <div className="report-header-icon h-14 w-14 rounded-2xl bg-[#ADEFE7] flex items-center justify-center shrink-0">
                      <Bot size={30} className="text-[#003435]" />
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
                  {/* Chat Empty State */}
                  {chatMessages.length === 0 && (
                    <div className="report-message bg-[#F5F8F6] border border-[#E5EEEB] rounded-2xl p-7 text-center">
                      <div className="report-icon h-14 w-14 rounded-2xl bg-[#E7F4F1] flex items-center justify-center mx-auto mb-4">
                        <MessageCircle
                          size={27}
                          className="text-[#256862]"
                        />
                      </div>

                      <h3 className="text-lg font-bold text-[#003435]">
                        Start a Conversation
                      </h3>

                      <p className="text-base text-[#65736F] mt-2">
                        Ask a question to understand something in your
                        uploaded health report.
                      </p>
                    </div>
                  )}

                  {/* Chat Messages */}
                  {chatMessages.length > 0 && (
                    <div className="space-y-5 max-h-[450px] overflow-y-auto pr-2">
                      {chatMessages.map((message, index) => (
                        <div
                          key={index}
                          className={`report-message flex ${
                            message.role === "user"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                          style={{
                            animationDelay: reducedMotion
                              ? "0ms"
                              : `${Math.min(index * 50, 200)}ms`,
                          }}
                        >
                          <div
                            className={`flex items-start gap-3 max-w-[90%] sm:max-w-[80%] ${
                              message.role === "user"
                                ? "flex-row-reverse"
                                : "flex-row"
                            }`}
                          >
                            <div
                              className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                                message.role === "user"
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
                              className={`rounded-2xl px-5 py-4 ${
                                message.role === "user"
                                  ? "bg-[#003435] text-white rounded-tr-sm"
                                  : "bg-[#F0F6F3] border border-[#DCEBE5] text-[#164B4D] rounded-tl-sm"
                              }`}
                            >
                              <p className="text-base leading-relaxed whitespace-pre-line">
                                {message.content}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}

                      {chatLoading && (
                        <div className="flex items-center gap-3 report-message">
                          <div className="h-10 w-10 rounded-xl bg-[#E7F4F1] flex items-center justify-center">
                            <Bot
                              size={21}
                              className="text-[#256862]"
                            />
                          </div>

                          <div className="flex items-center gap-3 bg-[#F0F6F3] border border-[#DCEBE5] rounded-2xl px-5 py-4">
                            <LoaderCircle
                              size={20}
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
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
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
                      className={`report-upload-button inline-flex items-center justify-center gap-3 px-7 py-4 rounded-2xl font-bold text-base transition-all duration-300 ${
                        question.trim() && !chatLoading
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
                      AI answers are based on the uploaded report and
                      are for educational purposes only.
                    </p>
                  </div>
                </div>
              </section>
            </Reveal>
          )}

          {/* Medical Disclaimer */}
          <Reveal delay={100}>
            <div className="mt-8 bg-amber-50 border border-amber-200 rounded-2xl p-5 sm:p-6">
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
                    AI-generated information is for educational purposes
                    and should not replace advice from a qualified
                    healthcare professional.
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
                className="inline-flex items-center gap-2 text-[#256862] hover:text-[#003435] font-semibold text-base transition-all duration-300 hover:-translate-x-1"
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
