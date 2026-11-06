
import { useEffect, useRef, useState } from "react";
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

/* -------------------------------------------------- */
/* Animation helpers                                  */
/* -------------------------------------------------- */

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const useInView = (threshold = 0.12) => {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin: "0px 0px -6% 0px",
      }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [threshold]);

  return [ref, shown];
};

/* Scroll reveal */

const Reveal = ({ children, delay = 0, className = "" }) => {
  const [ref, shown] = useInView();

  return (
    <div
      ref={ref}
      className={`ai-reveal ${shown ? "ai-reveal-in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

/* Mouse-responsive 3D tilt */

const Tilt = ({
  children,
  className = "",
  max = 10,
  scale = 1.02,
}) => {
  const ref = useRef(null);

  const handleMove = (e) => {
    if (prefersReducedMotion() || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();

    if (!rect.width || !rect.height) return;

    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    ref.current.style.transition = "transform 0.12s ease-out";

    ref.current.style.transform = `
      perspective(1100px)
      rotateX(${(-y * max).toFixed(2)}deg)
      rotateY(${(x * max).toFixed(2)}deg)
      scale3d(${scale}, ${scale}, ${scale})
    `;
  };

  const handleLeave = () => {
    if (!ref.current) return;

    ref.current.style.transition =
      "transform 0.6s cubic-bezier(0.22,1,0.36,1)";

    ref.current.style.transform =
      "perspective(1100px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={className}
      style={{
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
};

/* -------------------------------------------------- */
/* Main component                                     */
/* -------------------------------------------------- */

const AIAssistant = () => {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatScrollRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      role: "ai",
      content:
        "Hi! 👋 I'm your Medicare AI Assistant. I can help you find doctors, explore services, and book appointments. How can I help you today?",
    },
  ]);

  /* Smoothly scroll the chat to the newest message */
  useEffect(() => {
    const node = chatScrollRef.current;
    if (!node) return;
    node.scrollTo({ top: node.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!message.trim() || isTyping) return;

    const userMessage = message.trim();

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userMessage,
      },
    ]);

    setMessage("");
    setIsTyping(true);

    try {
      const token = localStorage.getItem("userToken");

      const response = await api.post(
        "/assistant/chat",
        {
          message: userMessage,
          history: messages,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;

      if (data.success) {
        setMessages((prev) => [
          ...prev,
          {
            role: "ai",
            content: data.answer || data.message,
            sources: Array.isArray(data.sources)
              ? data.sources
              : [],
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
    } finally {
      setIsTyping(false);
    }
  };

  const quickActions = [
    {
      icon: Stethoscope,
      title: "Find a Doctor",
      description: "Explore specialists",
      message: "Find me a doctor",
      iconBg: "bg-[#DDF2EC]",
      iconColor: "text-[#256862]",
    },
    {
      icon: Building2,
      title: "Services",
      description: "Explore healthcare",
      message: "Show me available services",
      iconBg: "bg-[#E5F0EC]",
      iconColor: "text-[#256862]",
    },
    {
      icon: CalendarDays,
      title: "Book Appointment",
      description: "Schedule a visit",
      message: "Book an appointment",
      iconBg: "bg-[#E1F2E9]",
      iconColor: "text-[#3A8B69]",
    },
    {
      icon: ClipboardList,
      title: "My Appointments",
      description: "View your bookings",
      message: "Show my appointments",
      iconBg: "bg-[#E9E8F5]",
      iconColor: "text-[#6864A0]",
    },
  ];

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

        /* -------------------------------- */
        /* Entrance animations              */
        /* -------------------------------- */

        @keyframes ai-rise {
          from {
            opacity: 0;
            transform: translateY(38px) rotateX(10deg);
          }
          to {
            opacity: 1;
            transform: translateY(0) rotateX(0);
          }
        }

        @keyframes ai-fade-up {
          from {
            opacity: 0;
            transform: translateY(18px) scale(.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes ai-pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(173,239,231,.35);
          }
          100% {
            box-shadow: 0 0 0 17px rgba(173,239,231,0);
          }
        }

        @keyframes ai-float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-12px);
          }
        }

        @keyframes ai-float-slow {
          0%, 100% {
            transform: translate3d(0,0,0);
          }
          50% {
            transform: translate3d(18px,-20px,0);
          }
        }

        @keyframes ai-spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes ai-glow {
          0%, 100% {
            opacity: .5;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes ai-orbit {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(8deg);
          }
        }

        @keyframes ai-dot {
          0%, 80%, 100% {
            transform: translateY(0);
            opacity: .4;
          }
          40% {
            transform: translateY(-5px);
            opacity: 1;
          }
        }

        @keyframes ai-ecg {
          from {
            stroke-dashoffset: 100;
          }
          to {
            stroke-dashoffset: -100;
          }
        }

        .ai-enter {
          opacity: 0;
          animation: ai-rise .9s cubic-bezier(.22,1,.36,1) forwards;
        }

        .ai-message {
          animation: ai-fade-up .45s cubic-bezier(.22,1,.36,1) both;
        }

        .ai-float {
          animation: ai-float 6s ease-in-out infinite;
        }

        .ai-float-slow {
          animation: ai-float-slow 12s ease-in-out infinite;
        }

        .ai-spin {
          animation: ai-spin 35s linear infinite;
        }

        .ai-glow {
          animation: ai-glow 4s ease-in-out infinite;
        }

        .ai-pulse {
          animation: ai-pulse 2.5s ease-out infinite;
        }

        .ai-orbit {
          animation: ai-orbit 5s ease-in-out infinite;
        }

        .ai-dot {
          animation: ai-dot 1.2s ease-in-out infinite;
        }

        .ai-ecg {
          stroke-dasharray: 100;
          animation: ai-ecg 4s linear infinite;
        }

        /* -------------------------------- */
        /* Scroll reveal                    */
        /* -------------------------------- */

        .ai-reveal {
          opacity: 0;
          transform: perspective(1200px) translateY(42px) rotateX(9deg);
          transform-origin: 50% 100%;
          transition:
            opacity .9s cubic-bezier(.22,1,.36,1),
            transform .9s cubic-bezier(.22,1,.36,1);
        }

        .ai-reveal.ai-reveal-in {
          opacity: 1;
          transform: perspective(1200px) translateY(0) rotateX(0);
        }

        /* -------------------------------- */
        /* Chat and interaction effects     */
        /* -------------------------------- */

        .ai-input {
          transition:
            border-color .3s ease,
            box-shadow .3s ease,
            background .3s ease;
        }

        .ai-input:focus-within {
          border-color: #256862;
          box-shadow: 0 0 0 4px rgba(37,104,98,.10);
          background: white;
        }

        .ai-action {
          position: relative;
          transition:
            transform .35s cubic-bezier(.22,1,.36,1),
            box-shadow .35s ease,
            border-color .35s ease,
            background .35s ease;
        }

        .ai-action:hover {
          transform: translateY(-5px);
          border-color: #9CCFC4;
          background: white;
          box-shadow: 0 18px 35px rgba(0,52,53,.11);
        }

        .ai-action-icon {
          transition:
            transform .4s cubic-bezier(.22,1,.36,1),
            background .3s ease,
            color .3s ease;
        }

        .ai-action:hover .ai-action-icon {
          transform: rotate(-8deg) scale(1.1);
          background: #003F40;
          color: #ADEFE7;
        }

        .ai-action-arrow {
          transition: transform .3s ease;
        }

        .ai-action:hover .ai-action-arrow {
          transform: translate(3px,-3px);
        }

        .ai-send {
          transition:
            transform .25s ease,
            box-shadow .25s ease,
            background .25s ease;
        }

        .ai-send svg {
          transition: transform .3s cubic-bezier(.22,1,.36,1);
        }

        .ai-send:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 12px 24px rgba(0,52,53,.22);
        }

        .ai-send:hover:not(:disabled) svg {
          transform: translate(3px,-3px) rotate(8deg);
        }

        .ai-send:active:not(:disabled) {
          transform: scale(.96);
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

        .ai-card {
          transition:
            border-color .4s ease,
            box-shadow .4s ease;
        }

        .ai-card:hover {
          border-color: #ADEFE7;
          box-shadow: 0 28px 55px rgba(0,52,53,.13);
        }

        .ai-shine {
          position: relative;
          overflow: hidden;
        }

        .ai-shine::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(
            110deg,
            transparent 30%,
            rgba(255,255,255,.3) 50%,
            transparent 70%
          );
          transform: translateX(-130%);
          transition: transform .8s ease;
        }

        .ai-shine:hover::after {
          transform: translateX(130%);
        }

        /* -------------------------------- */
        /* Reduced motion                   */
        /* -------------------------------- */

        @media (prefers-reduced-motion: reduce) {
          .ai-enter,
          .ai-message,
          .ai-float,
          .ai-float-slow,
          .ai-spin,
          .ai-glow,
          .ai-pulse,
          .ai-orbit,
          .ai-dot {
            animation: none !important;
          }

          .ai-ecg {
            animation: none !important;
            stroke-dashoffset: 0;
          }

          .ai-reveal,
          .ai-reveal.ai-reveal-in {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
          }

          .ai-action,
          .ai-send,
          .ai-send svg,
          .ai-input,
          .ai-action-icon,
          .ai-action-arrow,
          .ai-card {
            transition: none !important;
          }

          .ai-chat-scroll {
            scroll-behavior: auto;
          }
        }
      `}</style>

      <Navbar />

      <main className="relative flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">

        {/* Background decorations */}

        <div className="ai-float-slow pointer-events-none absolute -top-10 -left-32 h-80 w-80 rounded-full bg-[#ADEFE7]/30 blur-3xl" />

        <div
          className="ai-float-slow pointer-events-none absolute top-[35%] -right-40 h-96 w-96 rounded-full bg-[#D7ECE6]/60 blur-3xl"
          style={{ animationDelay: "-4s" }}
        />

        <div
          className="ai-float-slow pointer-events-none absolute bottom-20 left-[35%] h-64 w-64 rounded-full bg-[#ADEFE7]/20 blur-3xl"
          style={{ animationDelay: "-7s" }}
        />

        {/* Decorative icons */}

        <div className="pointer-events-none absolute left-[7%] top-[22%] hidden text-[#258B76]/20 lg:block ai-float-slow">
          <PlusIcon />
        </div>

        <div
          className="pointer-events-none absolute right-[8%] top-[38%] hidden text-[#258B76]/20 lg:block ai-orbit"
        >
          <HeartPulse size={35} />
        </div>

        <div
          className="pointer-events-none absolute bottom-[20%] left-[5%] hidden text-[#256862]/20 lg:block ai-float"
        >
          <Sparkles size={32} />
        </div>

        <div className="relative z-10">

          {/* -------------------------------- */}
          {/* Page Header                      */}
          {/* -------------------------------- */}

          <div className="ai-enter text-center mb-10">

            <Tilt
              max={12}
              scale={1.06}
              className="inline-block"
            >
              <div className="ai-float relative flex items-center justify-center w-[76px] h-[76px] rounded-[24px] bg-[#003435] text-[#ADEFE7] shadow-[0_15px_35px_rgba(0,52,53,.2)]">
                <div className="absolute inset-0 rounded-[24px] border border-[#ADEFE7]/30" />
                <HeartPulse size={38} strokeWidth={1.8} />
              </div>
            </Tilt>

            <div className="mt-6">

              <div className="inline-flex items-center gap-2 text-base font-extrabold uppercase tracking-[0.15em] text-[#256862]">
                <Sparkles size={17} className="ai-glow" />
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

              <div className="mt-5 flex items-center justify-center gap-2 text-sm font-semibold text-[#4D9286]">
                <span className="h-2 w-2 rounded-full bg-[#258B76] ai-pulse" />
                Here to make healthcare simpler
              </div>

            </div>

          </div>

          {/* -------------------------------- */}
          {/* Main Chat Container              */}
          {/* -------------------------------- */}

          <Reveal>

            <div className="ai-card overflow-hidden rounded-[28px] border border-[#CBDAD6] bg-white shadow-[0_20px_65px_rgba(0,52,53,.09)]">

              {/* Chat Header */}

              <div className="relative overflow-hidden bg-[#003435] px-5 py-5 sm:px-7">

                <div className="ai-spin absolute -right-16 -top-24 h-56 w-56 rounded-full border-[25px] border-dashed border-[#ADEFE7]/10" />

                <div className="absolute -right-12 -top-20 h-48 w-48 rounded-full border border-[#ADEFE7]/15" />

                <div className="absolute -right-5 -top-12 h-32 w-32 rounded-full border border-[#ADEFE7]/15" />

                <div className="absolute -left-16 -bottom-24 h-48 w-48 rounded-full bg-[#ADEFE7]/5 blur-2xl" />

                {/* Animated heartbeat line */}

                <svg
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-10 w-full opacity-40"
                  viewBox="0 0 400 40"
                  preserveAspectRatio="none"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    className="ai-ecg"
                    pathLength="100"
                    d="M0 24 H120 L134 24 L146 6 L160 36 L172 14 L182 24 H400"
                    stroke="#ADEFE7"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>

                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                  <div className="flex items-center gap-4">

                    <Tilt max={10} scale={1.05}>
                      <div className="ai-pulse flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#ADEFE7] text-[#003435] shadow-lg">
                        <Bot size={29} />
                      </div>
                    </Tilt>

                    <div>

                      <h2 className="display-font text-xl sm:text-2xl font-bold text-white">
                        Medicare Assistant
                      </h2>

                      <div className="mt-1.5 flex items-center gap-2 text-base text-[#C3E9E2]">

                        <span className="relative flex h-2.5 w-2.5">
                          <span className="absolute inline-flex h-full w-full rounded-full bg-[#78D9A8] opacity-60 animate-ping" />
                          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#78D9A8]" />
                        </span>

                        Online and ready to help

                      </div>

                    </div>

                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center rounded-xl border border-white/15 bg-white/[0.08] px-4 py-2.5 text-base font-semibold text-[#D7F2EC] transition-all duration-300 hover:bg-white/[0.14]">

                    <ShieldCheck size={18} className="text-[#ADEFE7]" />

                    Patient Support

                  </div>

                </div>

              </div>

              {/* Chat Messages */}

              <div
                ref={chatScrollRef}
                className="ai-chat-scroll h-[440px] sm:h-[500px] overflow-y-auto scroll-smooth bg-[#F8FBF9] p-4 sm:p-7 space-y-6"
              >

                <div className="mb-2 flex items-center justify-center">

                  <span className="rounded-full border border-[#DCE9E4] bg-white px-4 py-2 text-base font-semibold text-[#83958E] shadow-sm">
                    Your conversation
                  </span>

                </div>

                {messages.map((msg, index) => (

                  <div
                    key={index}
                    className={`ai-message flex gap-3 ${msg.role === "user"
                        ? "justify-end"
                        : "justify-start"
                      }`}
                    style={{
                      animationDelay: `${Math.min(index * 100, 500)}ms`,
                    }}
                  >

                    {/* AI Avatar */}

                    {msg.role !== "user" && (

                      <Tilt max={8} scale={1.04} className="shrink-0">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#DDF2EC] text-[#256862] shadow-sm">
                          <Bot size={21} />
                        </div>

                      </Tilt>

                    )}

                    {/* Message Bubble */}

                    <div
                      className={`max-w-[88%] sm:max-w-[78%] px-5 py-4 rounded-2xl text-base leading-7 shadow-sm break-words transition-shadow duration-300 hover:shadow-md ${msg.role === "user"
                          ? "bg-[#003435] text-white rounded-br-md whitespace-pre-wrap"
                          : "bg-white border border-[#E2ECE7] text-[#344A45] rounded-bl-md"
                        }`}
                    >

                      <div className="whitespace-pre-wrap">
                        {msg.content}
                      </div>

                      {/* Trusted References */}

                      {msg.role === "ai" &&
                        Array.isArray(msg.sources) &&
                        msg.sources.length > 0 && (
                          <div className="mt-5 pt-4 border-t border-[#DCEBE5]">

                            <div className="mb-3 flex items-center gap-2">
                              <ShieldCheck
                                size={17}
                                className="shrink-0 text-[#256862]"
                              />

                              <p className="text-sm font-extrabold text-[#164B4D]">
                                Trusted References
                              </p>
                            </div>

                            <div className="space-y-3">
                              {msg.sources.map((source, sourceIndex) => (
                                <a
                                  key={`${source.url}-${sourceIndex}`}
                                  href={source.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="group flex items-start gap-2 text-sm text-[#256862] hover:text-[#003435] transition-colors break-words"
                                >
                                  <ArrowUpRight
                                    size={15}
                                    className="mt-0.5 shrink-0 text-[#4D9286] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                  />

                                  <span className="min-w-0">
                                    <span className="block font-bold underline underline-offset-2">
                                      {source.title}
                                    </span>

                                    <span className="mt-0.5 block text-xs text-[#82938C]">
                                      {source.organization}
                                    </span>
                                  </span>
                                </a>
                              ))}
                            </div>

                          </div>
                        )}

                    </div>

                    {/* User Avatar */}

                    {msg.role === "user" && (

                      <Tilt max={8} scale={1.04} className="shrink-0">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ADEFE7] text-[#003435] shadow-sm">
                          <User size={21} />
                        </div>

                      </Tilt>

                    )}

                  </div>

                ))}

                {/* Typing indicator */}

                {isTyping && (

                  <div className="ai-message flex justify-start gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#DDF2EC] text-[#256862] shadow-sm">
                      <Bot size={21} />
                    </div>

                    <div
                      className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-[#E2ECE7] bg-white px-5 py-5 shadow-sm"
                      aria-label="Medicare Assistant is typing"
                    >
                      {[0, 1, 2].map((dot) => (
                        <span
                          key={dot}
                          className="ai-dot h-2 w-2 rounded-full bg-[#258B76]"
                          style={{ animationDelay: `${dot * 0.18}s` }}
                        />
                      ))}
                    </div>

                  </div>

                )}

              </div>

              {/* -------------------------------- */}
              {/* Quick Actions                    */}
              {/* -------------------------------- */}

              <div className="border-t border-[#E4ECE8] bg-white px-4 sm:px-7 pt-5 pb-6">

                <div className="mb-5 flex items-center justify-between">

                  <div className="flex items-center gap-2">

                    <Sparkles size={18} className="text-[#4D9286] ai-glow" />

                    <p className="text-base font-extrabold uppercase tracking-[0.12em] text-[#526B63]">
                      Quick actions
                    </p>

                  </div>

                  <span className="hidden sm:block text-sm font-medium text-[#9AA9A4]">
                    Choose a topic to get started
                  </span>

                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

                  {quickActions.map((action, index) => {
                    const Icon = action.icon;

                    return (
                      <Reveal
                        key={action.title}
                        delay={index * 100}
                      >

                        <button
                          onClick={() => setMessage(action.message)}
                          className="ai-action ai-shine w-full flex items-center gap-3 rounded-2xl border border-[#DCE9E4] bg-[#F8FBF9] p-3.5 text-left"
                        >

                          <span className={`ai-action-icon flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${action.iconBg} ${action.iconColor}`}>
                            <Icon size={22} />
                          </span>

                          <span className="min-w-0">
                            <span className="block text-base font-extrabold text-[#003435]">
                              {action.title}
                            </span>

                            <span className="mt-1 block text-base text-[#82938C]">
                              {action.description}
                            </span>
                          </span>

                          <ArrowUpRight
                            size={17}
                            className="ai-action-arrow ml-auto shrink-0 text-[#6D9187]"
                          />

                        </button>

                      </Reveal>
                    );
                  })}

                </div>

              </div>

              {/* -------------------------------- */}
              {/* Message Input                    */}
              {/* -------------------------------- */}

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
                    disabled={!message.trim() || isTyping}
                    className={`ai-send ai-shine flex shrink-0 items-center justify-center gap-2 rounded-xl px-4 sm:px-6 py-3.5 text-base font-extrabold transition ${message.trim() && !isTyping
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

          </Reveal>

          {/* -------------------------------- */}
          {/* Disclaimer                       */}
          {/* -------------------------------- */}

          <Reveal delay={150}>

            <div className="ai-card mt-7 flex items-start gap-4 rounded-2xl border border-[#E8DDB8] bg-[#FFF9E9] p-5 shadow-sm">

              <div className="ai-orbit flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F9EDC8] text-[#9C7730]">
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

          </Reveal>

          {/* Bottom spacing */}

          <div className="h-5" />

        </div>

      </main>

      <Footer />

    </div>
  );
};

/* Small decorative plus icon */

const PlusIcon = () => (
  <svg
    width="36"
    height="36"
    viewBox="0 0 36 36"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M18 4V32M4 18H32"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

export default AIAssistant;
