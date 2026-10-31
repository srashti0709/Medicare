
import { useState } from "react";
import {
  HeartPulse,
  Bot,
  User,
  Sparkles,
  Send,
  Stethoscope,
  Building2,
  CalendarDays,
  ClipboardList,
  ShieldCheck,
  MessageCircle,
  ArrowUpRight,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const AIAssistant = () => {
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([
    {
      role: "ai",
      content:
        "Hi! 👋 I'm your Medicare AI Assistant. I can help you find doctors, explore services, and book appointments. How can I help you today?",
    },
  ]);

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMessage = message.trim();

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userMessage,
      },
    ]);

    setMessage("");

    try {
      const token = localStorage.getItem("userToken");

      const response = await fetch(
        "http://localhost:5000/api/assistant/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            message: userMessage,
            history: messages,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setMessages((prev) => [
          ...prev,
          {
            role: "ai",
            content: data.answer || data.message,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "ai",
            content: data.message || "Something went wrong.",
          },
        ]);
      }
    } catch (error) {
      console.error("AI Assistant Error:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: "Unable to connect to the Medicare Assistant.",
        },
      ]);
    }
  };

  return (
    <div className="medicare-ai min-h-screen flex flex-col overflow-hidden bg-[#F5F8F6] text-[#0A1F1C]">

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@500;600;700;800&family=Manrope:wght@400;500;600;700;800&display=swap');

        .medicare-ai {
          font-family: 'Manrope', sans-serif;
        }

        .medicare-ai h1,
        .medicare-ai h2,
        .medicare-ai h3,
        .medicare-ai .display-font {
          font-family: 'Bricolage Grotesque', sans-serif;
        }

        @keyframes ai-fade-up {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes ai-pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(173,239,231,.2);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(173,239,231,0);
          }
        }

        @keyframes ai-float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-7px);
          }
        }

        .ai-enter {
          animation: ai-fade-up .65s ease both;
        }

        .ai-message {
          animation: ai-fade-up .35s ease both;
        }

        .ai-pulse {
          animation: ai-pulse 2.5s ease-out infinite;
        }

        .ai-float {
          animation: ai-float 4s ease-in-out infinite;
        }

        .ai-input {
          transition: border-color .2s ease, box-shadow .2s ease;
        }

        .ai-input:focus-within {
          border-color: #256862;
          box-shadow: 0 0 0 4px rgba(37,104,98,.10);
          background: white;
        }

        .ai-action {
          transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease;
        }

        .ai-action:hover {
          transform: translateY(-3px);
          border-color: #9CCFC4;
          box-shadow: 0 8px 20px rgba(0,52,53,.07);
        }

        .ai-send {
          transition: transform .2s ease, box-shadow .2s ease, background .2s ease;
        }

        .ai-send:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 18px rgba(0,52,53,.2);
        }

        .ai-chat-scroll::-webkit-scrollbar {
          width: 6px;
        }

        .ai-chat-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .ai-chat-scroll::-webkit-scrollbar-thumb {
          background: #CBDAD6;
          border-radius: 20px;
        }

        @media (prefers-reduced-motion: reduce) {
          .ai-enter,
          .ai-message,
          .ai-pulse,
          .ai-float {
            animation: none !important;
          }

          .ai-action,
          .ai-send,
          .ai-input {
            transition: none !important;
          }
        }
      `}</style>

      <Navbar />

      <main className="relative flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">

        {/* Background Decoration */}

        <div className="pointer-events-none absolute top-10 left-0 h-64 w-64 rounded-full bg-[#ADEFE7]/30 blur-3xl" />

        <div className="pointer-events-none absolute bottom-10 right-0 h-72 w-72 rounded-full bg-[#D7ECE6]/60 blur-3xl" />

        <div className="relative z-10">

          {/* Page Header */}

          <div className="ai-enter text-center mb-9">

            <div className="ai-float inline-flex items-center justify-center w-[76px] h-[76px] rounded-[24px] bg-[#003435] text-[#ADEFE7] shadow-[0_12px_30px_rgba(0,52,53,.18)]">
              <HeartPulse size={38} strokeWidth={1.8} />
            </div>

            <div className="mt-5">

              <div className="inline-flex items-center gap-2 text-base font-extrabold uppercase tracking-[0.15em] text-[#256862]">
                <Sparkles size={17} />
                Your digital healthcare companion
              </div>

              <h1 className="display-font mt-3 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#003435]">
                Medicare AI Assistant
                <span className="text-[#56A99D]">.</span>
              </h1>

              <p className="mt-3 text-base leading-7 text-[#65736F] max-w-2xl mx-auto">
                Your AI assistant for doctors, services and appointments.
                Get help navigating your healthcare journey.
              </p>

            </div>

          </div>

          {/* Main Chat Container */}

          <div className="ai-enter overflow-hidden rounded-[28px] border border-[#CBDAD6] bg-white shadow-[0_20px_65px_rgba(0,52,53,.09)]">

            {/* Chat Header */}

            <div className="relative overflow-hidden bg-[#003435] px-5 py-5 sm:px-7">

              <div className="absolute -right-12 -top-20 h-48 w-48 rounded-full border border-[#ADEFE7]/15" />

              <div className="absolute -right-5 -top-12 h-32 w-32 rounded-full border border-[#ADEFE7]/15" />

              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                <div className="flex items-center gap-4">

                  <div className="ai-pulse flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#ADEFE7] text-[#003435]">
                    <Bot size={29} />
                  </div>

                  <div>

                    <h2 className="display-font text-xl sm:text-2xl font-bold text-white">
                      Medicare Assistant
                    </h2>

                    <div className="mt-1.5 flex items-center gap-2 text-base text-[#C3E9E2]">

                      <span className="h-2.5 w-2.5 rounded-full bg-[#78D9A8] shadow-[0_0_10px_rgba(120,217,168,.6)]" />

                      Online and ready to help

                    </div>

                  </div>

                </div>

                <div className="flex items-center gap-2 self-start sm:self-center rounded-xl border border-white/15 bg-white/[0.08] px-4 py-2.5 text-base font-semibold text-[#D7F2EC]">

                  <ShieldCheck size={18} />

                  Patient Support

                </div>

              </div>

            </div>

            {/* Chat Messages */}

            <div className="ai-chat-scroll h-[440px] sm:h-[500px] overflow-y-auto bg-[#F8FBF9] p-4 sm:p-7 space-y-6">

              <div className="mb-2 flex items-center justify-center">

                <span className="rounded-full border border-[#DCE9E4] bg-white px-4 py-2 text-base font-semibold text-[#83958E]">
                  Your conversation
                </span>

              </div>

              {messages.map((msg, index) => (

                <div
                  key={index}
                  className={`ai-message flex gap-3 ${
                    msg.role === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >

                  {/* AI Avatar */}

                  {msg.role !== "user" && (

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#DDF2EC] text-[#256862]">
                      <Bot size={21} />
                    </div>

                  )}

                  {/* Message Bubble */}

                  <div
                    className={`max-w-[88%] sm:max-w-[78%] px-5 py-4 rounded-2xl text-base leading-7 shadow-sm whitespace-pre-wrap break-words ${
                      msg.role === "user"
                        ? "bg-[#003435] text-white rounded-br-md"
                        : "bg-white border border-[#E2ECE7] text-[#344A45] rounded-bl-md"
                    }`}
                  >

                    {msg.content}

                  </div>

                  {/* User Avatar */}

                  {msg.role === "user" && (

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ADEFE7] text-[#003435]">
                      <User size={21} />
                    </div>

                  )}

                </div>

              ))}

            </div>

            {/* Quick Actions */}

            <div className="border-t border-[#E4ECE8] bg-white px-4 sm:px-7 pt-5 pb-6">

              <div className="mb-4 flex items-center gap-2">

                <Sparkles size={18} className="text-[#4D9286]" />

                <p className="text-base font-extrabold uppercase tracking-[0.12em] text-[#526B63]">
                  Quick actions
                </p>

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

                <button
                  onClick={() =>
                    setMessage("Find me a doctor")
                  }
                  className="ai-action flex items-center gap-3 rounded-2xl border border-[#DCE9E4] bg-[#F8FBF9] p-3.5 text-left"
                >

                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#DDF2EC] text-[#256862]">
                    <Stethoscope size={22} />
                  </span>

                  <span className="min-w-0">
                    <span className="block text-base font-extrabold text-[#003435]">
                      Find a Doctor
                    </span>

                    <span className="mt-1 block text-base text-[#82938C]">
                      Explore specialists
                    </span>
                  </span>

                  <ArrowUpRight size={17} className="ml-auto shrink-0 text-[#6D9187]" />

                </button>

                <button
                  onClick={() =>
                    setMessage("Show me available services")
                  }
                  className="ai-action flex items-center gap-3 rounded-2xl border border-[#DCE9E4] bg-[#F8FBF9] p-3.5 text-left"
                >

                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E5F0EC] text-[#256862]">
                    <Building2 size={22} />
                  </span>

                  <span className="min-w-0">
                    <span className="block text-base font-extrabold text-[#003435]">
                      Services
                    </span>

                    <span className="mt-1 block text-base text-[#82938C]">
                      Explore healthcare
                    </span>
                  </span>

                  <ArrowUpRight size={17} className="ml-auto shrink-0 text-[#6D9187]" />

                </button>

                <button
                  onClick={() =>
                    setMessage("Book an appointment")
                  }
                  className="ai-action flex items-center gap-3 rounded-2xl border border-[#DCE9E4] bg-[#F8FBF9] p-3.5 text-left"
                >

                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E1F2E9] text-[#3A8B69]">
                    <CalendarDays size={22} />
                  </span>

                  <span className="min-w-0">
                    <span className="block text-base font-extrabold text-[#003435]">
                      Book Appointment
                    </span>

                    <span className="mt-1 block text-base text-[#82938C]">
                      Schedule a visit
                    </span>
                  </span>

                  <ArrowUpRight size={17} className="ml-auto shrink-0 text-[#6D9187]" />

                </button>

                <button
                  onClick={() =>
                    setMessage("Show my appointments")
                  }
                  className="ai-action flex items-center gap-3 rounded-2xl border border-[#DCE9E4] bg-[#F8FBF9] p-3.5 text-left"
                >

                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E9E8F5] text-[#6864A0]">
                    <ClipboardList size={22} />
                  </span>

                  <span className="min-w-0">
                    <span className="block text-base font-extrabold text-[#003435]">
                      My Appointments
                    </span>

                    <span className="mt-1 block text-base text-[#82938C]">
                      View your bookings
                    </span>
                  </span>

                  <ArrowUpRight size={17} className="ml-auto shrink-0 text-[#6D9187]" />

                </button>

              </div>

            </div>

            {/* Message Input */}

            <div className="border-t border-[#CBDAD6] bg-white p-4 sm:p-6">

              <div className="ai-input flex items-center gap-3 rounded-2xl border border-[#CBDAD6] bg-[#F8FBF9] p-2 sm:p-2.5">

                <div className="hidden sm:flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E7F4F1] text-[#256862]">
                  <MessageCircle size={21} />
                </div>

                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSend();
                    }
                  }}
                  placeholder="Ask me anything..."
                  className="min-w-0 flex-1 bg-transparent px-3 py-3 text-base font-medium text-[#0A1F1C] outline-none placeholder:text-[#9AA9A4]"
                />

                <button
                  onClick={handleSend}
                  disabled={!message.trim()}
                  className={`ai-send flex shrink-0 items-center justify-center gap-2 rounded-xl px-4 sm:px-6 py-3.5 text-base font-extrabold transition ${
                    message.trim()
                      ? "bg-[#003435] text-white shadow-md hover:bg-[#164B4D]"
                      : "bg-[#E8EFEC] text-[#9AA9A4] cursor-not-allowed"
                  }`}
                >

                  <span className="hidden sm:inline">Send</span>

                  <Send size={19} />

                </button>

              </div>

              <p className="mt-3 flex items-center justify-center gap-2 text-base text-[#82938C]">
                <ShieldCheck size={16} className="text-[#4D9286]" />
                Your conversation is handled through the Medicare Assistant.
              </p>

            </div>

          </div>

          {/* Disclaimer */}

          <div className="mt-6 flex items-start gap-4 rounded-2xl border border-[#E8DDB8] bg-[#FFF9E9] p-5">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F9EDC8] text-[#9C7730]">
              <ShieldCheck size={23} />
            </div>

            <div>

              <h3 className="font-bold text-base text-[#735B27]">
                Important Healthcare Notice
              </h3>

              <p className="mt-1 text-base leading-7 text-[#806B3D]">
                The AI Assistant helps with navigation, appointments, doctors
                and services. It does not replace professional medical advice.
                Always consult a qualified healthcare professional for medical
                concerns.
              </p>

            </div>

          </div>

        </div>

      </main>

      <Footer />

    </div>
  );
};

export default AIAssistant;
