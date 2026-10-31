
import { useState } from "react";
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
  ClipboardList,
  HeartPulse,
  ArrowLeft,
  Stethoscope,
  FileUp,
  GraduationCap,
} from "lucide-react";

const HealthReportAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);

  const [question, setQuestion] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);

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

      const token = localStorage.getItem("token");

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
    <div className="min-h-screen bg-[#F5F8F6]">
      <Navbar />

      <main className="relative overflow-hidden py-10 md:py-14">

        {/* Background Decorations */}
        <div className="absolute -top-24 -right-20 h-80 w-80 rounded-full bg-[#ADEFE7]/30 blur-3xl pointer-events-none" />
        <div className="absolute top-[700px] -left-24 h-80 w-80 rounded-full bg-[#dcf3ee]/50 blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">

          {/* Page Heading */}
          <div className="text-center mb-12">

            <div className="inline-flex items-center gap-2 rounded-full border border-[#CBDAD6] bg-white px-4 py-2 text-base font-semibold text-[#256862] mb-5 shadow-sm">
              <Sparkles size={19} />
              AI-Powered Healthcare
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#003435] tracking-tight">
              AI Health Report Analyzer
            </h1>

            <p className="mt-4 text-base sm:text-lg text-[#65736F] max-w-2xl mx-auto leading-relaxed">
              Upload your health report and let AI explain important
              findings in simple language, helping you better understand
              your health information.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mt-7">
              <div className="flex items-center gap-2 bg-white border border-[#CBDAD6] rounded-xl px-4 py-3 shadow-sm">
                <FileCheck size={20} className="text-[#256862]" />
                <span className="text-base font-medium text-[#164B4D]">
                  PDF Report Analysis
                </span>
              </div>

              <div className="flex items-center gap-2 bg-white border border-[#CBDAD6] rounded-xl px-4 py-3 shadow-sm">
                <Brain size={20} className="text-[#256862]" />
                <span className="text-base font-medium text-[#164B4D]">
                  AI-Powered Insights
                </span>
              </div>
            </div>
          </div>

          {/* Upload Section */}
          <section className="bg-white border border-[#CBDAD6] rounded-3xl shadow-[0_12px_40px_rgba(0,52,53,0.06)] overflow-hidden">

            {/* Section Header */}
            <div className="bg-[#003435] px-6 sm:px-8 py-7 relative overflow-hidden">
              <div className="absolute -right-8 -top-12 h-44 w-44 rounded-full border-[28px] border-white/5" />
              <div className="absolute right-20 -bottom-16 h-36 w-36 rounded-full bg-[#ADEFE7]/10 blur-2xl" />

              <div className="relative flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-[#ADEFE7] flex items-center justify-center shrink-0">
                  <FileText size={28} className="text-[#003435]" />
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-white">
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
              <div className="border-2 border-dashed border-[#B8CEC7] rounded-3xl p-8 sm:p-12 text-center bg-[#FAFCFB] hover:border-[#256862] hover:bg-[#F3FAF7] transition-all duration-300">

                <div className="h-20 w-20 rounded-3xl bg-[#E7F4F1] flex items-center justify-center mx-auto mb-6">
                  <FileUp size={38} className="text-[#256862]" />
                </div>

                <h3 className="text-2xl font-bold text-[#003435]">
                  Select Your Medical Report
                </h3>

                <p className="text-base text-[#65736F] mt-3">
                  Choose a PDF file from your device to begin analysis.
                </p>

                <label className="inline-block mt-7 cursor-pointer">
                  <span className="inline-flex items-center justify-center gap-3 bg-[#003435] hover:bg-[#164B4D] text-white px-7 py-4 rounded-2xl font-semibold text-base shadow-lg shadow-[#003435]/10 transition-all duration-300">
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
                  <div className="mt-8 bg-[#E7F4F1] border border-[#B8DED5] rounded-2xl p-5 text-left">
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
                  className={`inline-flex items-center justify-center gap-3 px-9 py-4 rounded-2xl font-bold text-base transition-all duration-300 ${
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

          {/* Upload Result */}
          {uploadResult && (
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
          )}

          {/* AI Analysis Results */}
          {aiData && uploadResult?.success && (
            <div className="mt-10 space-y-7">

              {/* AI Summary */}
              <section className="bg-white border border-[#CBDAD6] rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,52,53,0.05)]">

                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-[#E7F4F1] flex items-center justify-center shrink-0">
                    <Brain size={26} className="text-[#256862]" />
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-[#003435]">
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

              {/* Key Findings */}
              <section className="bg-white border border-[#CBDAD6] rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,52,53,0.05)]">

                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-[#E7F4F1] flex items-center justify-center shrink-0">
                    <Search size={25} className="text-[#256862]" />
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-[#003435]">
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
                      className="flex items-start gap-4 bg-[#F3F9F6] border border-[#DCEBE5] rounded-2xl p-5"
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

              {/* Normal and Abnormal Values */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Normal Values */}
                <section className="bg-white border border-[#CBDAD6] rounded-3xl p-6 sm:p-7 shadow-[0_8px_30px_rgba(0,52,53,0.05)]">

                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-[#E7F4F1] flex items-center justify-center shrink-0">
                      <CheckCircle2
                        size={26}
                        className="text-[#256862]"
                      />
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-[#003435]">
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
                          className="flex items-start gap-3 bg-[#EAF7F0] border border-[#CDE9D8] rounded-xl p-4"
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

                {/* Abnormal Values */}
                <section className="bg-white border border-[#CBDAD6] rounded-3xl p-6 sm:p-7 shadow-[0_8px_30px_rgba(0,52,53,0.05)]">

                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0">
                      <AlertTriangle
                        size={26}
                        className="text-amber-600"
                      />
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-[#003435]">
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
                          className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4"
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
              </div>

              {/* Questions to Discuss */}
              <section className="bg-white border border-[#CBDAD6] rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,52,53,0.05)]">

                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-[#E7F4F1] flex items-center justify-center shrink-0">
                    <MessageCircle
                      size={25}
                      className="text-[#256862]"
                    />
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-[#003435]">
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
                      className="flex items-start gap-4 bg-[#F3F9F6] border border-[#DCEBE5] rounded-2xl p-5"
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
            </div>
          )}

          {/* Ask AI Section */}
          {aiData && uploadResult?.success && (
            <section className="mt-8 bg-white border border-[#CBDAD6] rounded-3xl overflow-hidden shadow-[0_12px_40px_rgba(0,52,53,0.06)]">

              {/* Chat Header */}
              <div className="bg-[#003435] px-6 sm:px-8 py-7 relative overflow-hidden">
                <div className="absolute -right-8 -top-12 h-44 w-44 rounded-full border-[28px] border-white/5" />

                <div className="relative flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-[#ADEFE7] flex items-center justify-center shrink-0">
                    <Bot size={30} className="text-[#003435]" />
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-white">
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
                        className={`flex ${
                          message.role === "user"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div className={`flex items-start gap-3 max-w-[90%] sm:max-w-[80%] ${
                          message.role === "user"
                            ? "flex-row-reverse"
                            : "flex-row"
                        }`}>

                          <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                            message.role === "user"
                              ? "bg-[#003435]"
                              : "bg-[#E7F4F1]"
                          }`}>
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
                      <div className="flex items-center gap-3">
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
                    className={`inline-flex items-center justify-center gap-3 px-7 py-4 rounded-2xl font-bold text-base transition-all duration-300 ${
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
          )}

          {/* Medical Disclaimer */}
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

          {/* Back to Home */}
          <div className="text-center mt-9">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-[#256862] hover:text-[#003435] font-semibold text-base transition-colors duration-200"
            >
              <ArrowLeft size={20} />
              Back to Home
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HealthReportAnalyzer;
