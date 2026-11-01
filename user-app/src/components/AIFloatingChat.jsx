
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Bot,
  X,
  Send,
  HeartPulse,
  Sparkles,
  Stethoscope,
  CalendarDays,
  ClipboardList,
  Building2,
  User,
  ShieldCheck,
  MessageCircle,
  Minus,
} from "lucide-react";

const AIFloatingChat = () => {
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: "ai",
      content:
        "Hi! 👋 I'm your Medicare AI Assistant. I can help you find doctors, explore services, and book appointments. How can I help you today?",
    },
  ]);

  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("userToken");

  const isPatient = Boolean(token && user?.role === "patient");

  const hiddenPages = [
    "/login",
    "/register",
    "/ai-assistant",
  ];

  const shouldShow =
    isPatient && !hiddenPages.includes(location.pathname);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [messages, loading, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const handleSend = async (text = message) => {
    if (!text.trim() || loading) return;

    const userMessage = text.trim();
    const currentHistory = messages;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userMessage,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/assistant/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
          body: JSON.stringify({
            message: userMessage,
            history: currentHistory,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setMessages((prev) => [
          ...prev,
          {
            role: "ai",
            content:
              data.answer ||
              data.message ||
              "I'm here to help!",
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "ai",
            content:
              data.message || "Something went wrong.",
          },
        ]);
      }
    } catch (error) {
      console.error("AI Assistant Error:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content:
            "Unable to connect to the Medicare Assistant. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!shouldShow) return null;

  const quickActions = [
    {
      title: "Find a Doctor",
      subtitle: "Explore specialists",
      icon: Stethoscope,
      color: "bg-[#DDF2EC] text-[#256862]",
      message: "Find me a doctor",
    },
    {
      title: "Services",
      subtitle: "Explore healthcare",
      icon: Building2,
      color: "bg-[#E5F0EC] text-[#256862]",
      message: "Show me available services",
    },
    {
      title: "Book Appointment",
      subtitle: "Schedule a visit",
      icon: CalendarDays,
      color: "bg-[#E1F2E9] text-[#3A8B69]",
      message: "Book an appointment",
    },
    {
      title: "My Appointments",
      subtitle: "View your bookings",
      icon: ClipboardList,
      color: "bg-[#E9E8F5] text-[#6864A0]",
      message: "Show my appointments",
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@500;600;700;800&family=Manrope:wght@400;500;600;700;800&display=swap');

        .medicare-floating-chat {
          font-family: 'Manrope', sans-serif;
        }

        .medicare-floating-chat h2,
        .medicare-floating-chat h3 {
          font-family: 'Bricolage Grotesque', sans-serif;
        }

        @keyframes medicare-chat-open {
          from {
            opacity: 0;
            transform: translateY(15px) scale(.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes medicare-chat-pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(173,239,231,.35);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(173,239,231,0);
          }
        }

        /* Floating heart movement */

        @keyframes medicare-heart-float {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-5px) scale(1.08);
          }
        }

        /* Three circular ripple rings */

        @keyframes medicare-heart-ripple {
          0% {
            transform: scale(.65);
            opacity: .8;
          }
          100% {
            transform: scale(2.5);
            opacity: 0;
          }
        }

        /* Soft glowing effect */

        @keyframes medicare-heart-glow {
          0%, 100% {
            filter: drop-shadow(0 0 4px rgba(173,239,231,.5));
          }
          50% {
            filter: drop-shadow(0 0 13px rgba(173,239,231,.95));
          }
        }

        .medicare-chat-animation {
          animation: medicare-chat-open .25s ease-out both;
        }

        .medicare-chat-pulse {
          animation: medicare-chat-pulse 2.5s infinite;
        }

        .medicare-heart-float {
          animation: medicare-heart-float 2.5s ease-in-out infinite,
                     medicare-heart-glow 2s ease-in-out infinite;
        }

        .medicare-heart-ripple {
          position: absolute;
          inset: 0;
          border: 2px solid rgba(173,239,231,.85);
          border-radius: 9999px;
          pointer-events: none;
          animation: medicare-heart-ripple 3s ease-out infinite;
        }

        .medicare-heart-ripple:nth-child(2) {
          animation-delay: 1s;
        }

        .medicare-heart-ripple:nth-child(3) {
          animation-delay: 2s;
        }

        .medicare-floating-chat ::-webkit-scrollbar {
          width: 5px;
        }

        .medicare-floating-chat ::-webkit-scrollbar-thumb {
          background: #CBDAD6;
          border-radius: 20px;
        }

        @media (prefers-reduced-motion: reduce) {
          .medicare-chat-animation,
          .medicare-chat-pulse,
          .medicare-heart-float,
          .medicare-heart-ripple {
            animation: none !important;
          }
        }
      `}</style>

      <div className="medicare-floating-chat fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-[60]">

        {/* Expanded Chat Window */}

        {isOpen && (
          <div className="medicare-chat-animation absolute bottom-[76px] right-0 w-[calc(100vw-40px)] sm:w-[390px] max-h-[min(620px,calc(100dvh-115px))] h-[min(590px,calc(100dvh-115px))] bg-white border border-[#CBDAD6] rounded-[24px] shadow-[0_20px_70px_rgba(0,52,53,.20)] overflow-hidden flex flex-col">

            {/* Header */}

            <div className="relative overflow-hidden shrink-0 bg-[#003435] px-4 py-4">

              <div className="absolute -right-8 -top-12 w-36 h-36 rounded-full border border-[#ADEFE7]/15" />

              <div className="relative z-10 flex items-center justify-between gap-3">

                <div className="flex items-center gap-3">

                  <div className="w-11 h-11 shrink-0 rounded-xl bg-[#ADEFE7] flex items-center justify-center text-[#003435]">
                    <Bot size={25} />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-white">
                      Medicare AI
                    </h2>

                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="w-2 h-2 rounded-full bg-[#78D9A8]" />
                      <span className="text-base text-[#C3E9E2]">
                        Online and ready to help
                      </span>
                    </div>
                  </div>

                </div>

                <div className="flex items-center gap-1">

                  <button
                    onClick={() => setIsOpen(false)}
                    aria-label="Minimize chat"
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-white/80 hover:bg-white/10 hover:text-white transition"
                  >
                    <Minus size={19} />
                  </button>

                  <button
                    onClick={() => setIsOpen(false)}
                    aria-label="Close chat"
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-white/80 hover:bg-white/10 hover:text-white transition"
                  >
                    <X size={20} />
                  </button>

                </div>

              </div>

            </div>

            {/* Messages */}

            <div className="flex-1 min-h-0 overflow-y-auto bg-[#F8FBF9] px-3.5 py-4 space-y-4">

              <div className="text-center">
                <span className="inline-block rounded-full border border-[#DCE9E4] bg-white px-3 py-1.5 text-base font-semibold text-[#83958E]">
                  Your conversation
                </span>
              </div>

              {messages.map((msg, index) => (

                <div
                  key={index}
                  className={`flex items-end gap-2 ${
                    msg.role === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >

                  {msg.role !== "user" && (
                    <div className="w-8 h-8 shrink-0 rounded-lg bg-[#DDF2EC] text-[#256862] flex items-center justify-center">
                      <Bot size={17} />
                    </div>
                  )}

                  <div
                    className={`max-w-[82%] px-3.5 py-3 rounded-2xl text-base leading-[1.65] whitespace-pre-wrap break-words shadow-sm ${
                      msg.role === "user"
                        ? "bg-[#003435] text-white rounded-br-sm"
                        : "bg-white border border-[#E2ECE7] text-[#344A45] rounded-bl-sm"
                    }`}
                  >
                    {msg.content}
                  </div>

                  {msg.role === "user" && (
                    <div className="w-8 h-8 shrink-0 rounded-lg bg-[#ADEFE7] text-[#003435] flex items-center justify-center">
                      <User size={17} />
                    </div>
                  )}

                </div>

              ))}

              {loading && (
                <div className="flex items-end gap-2">
                  <div className="w-8 h-8 shrink-0 rounded-lg bg-[#DDF2EC] text-[#256862] flex items-center justify-center">
                    <Bot size={17} />
                  </div>

                  <div className="bg-white border border-[#E2ECE7] rounded-2xl rounded-bl-sm px-4 py-3 text-base text-[#82938C]">
                    Medicare AI is typing...
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />

            </div>

            {/* Quick Actions */}

            {messages.length <= 2 && (
              <div className="shrink-0 border-t border-[#E4ECE8] bg-white px-3.5 pt-3 pb-3">

                <div className="flex items-center gap-1.5 mb-2.5">
                  <Sparkles size={16} className="text-[#4D9286]" />
                  <span className="text-base font-extrabold uppercase tracking-wider text-[#526B63]">
                    Quick actions
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">

                  {quickActions.map((action) => {
                    const Icon = action.icon;

                    return (
                      <button
                        key={action.title}
                        disabled={loading}
                        onClick={() => handleSend(action.message)}
                        className="flex items-center gap-2 rounded-xl border border-[#DCE9E4] bg-[#F8FBF9] p-2 text-left hover:border-[#9CCFC4] hover:bg-[#F0F8F5] transition disabled:opacity-50"
                      >
                        <span className={`w-8 h-8 shrink-0 rounded-lg flex items-center justify-center ${action.color}`}>
                          <Icon size={18} />
                        </span>

                        <span className="min-w-0">
                          <span className="block text-base font-bold text-[#003435] leading-tight">
                            {action.title}
                          </span>
                          <span className="block mt-1 text-base text-[#82938C]">
                            {action.subtitle}
                          </span>
                        </span>
                      </button>
                    );
                  })}

                </div>

              </div>
            )}

            {/* Input */}

            <div className="shrink-0 border-t border-[#CBDAD6] bg-white p-3">

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2 rounded-xl border border-[#CBDAD6] bg-[#F8FBF9] p-1.5 focus-within:border-[#256862] focus-within:ring-2 focus-within:ring-[#256862]/10"
              >

                <MessageCircle
                  size={18}
                  className="ml-2 shrink-0 text-[#4D9286]"
                />

                <input
                  ref={inputRef}
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask me anything..."
                  disabled={loading}
                  className="min-w-0 flex-1 bg-transparent px-1 py-2.5 text-base font-medium text-[#0A1F1C] outline-none placeholder:text-[#9AA9A4]"
                />

                <button
                  type="submit"
                  disabled={!message.trim() || loading}
                  aria-label="Send message"
                  className={`w-10 h-10 shrink-0 rounded-lg flex items-center justify-center transition ${
                    message.trim() && !loading
                      ? "bg-[#003435] text-white hover:bg-[#164B4D]"
                      : "bg-[#E8EFEC] text-[#9AA9A4] cursor-not-allowed"
                  }`}
                >
                  <Send size={18} />
                </button>

              </form>

              <p className="mt-2 flex items-center justify-center gap-1.5 text-base text-[#82938C]">
                <ShieldCheck size={16} className="text-[#4D9286]" />
                Medicare Assistant · Not a substitute for medical advice
              </p>

            </div>

          </div>
        )}

        {/* Floating Button */}

        <button
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? "Close Medicare AI Assistant" : "Open Medicare AI Assistant"}
          aria-expanded={isOpen}
          className={`relative w-[60px] h-[60px] rounded-full flex items-center justify-center shadow-[0_8px_25px_rgba(0,52,53,.25)] transition-all duration-300 hover:scale-105 ${
            isOpen
              ? "bg-[#164B4D] text-white"
              : "bg-[#003435] text-[#ADEFE7] medicare-chat-pulse"
          }`}
        >
          {!isOpen && (
            <>
              {/* Three glowing circular rings */}

              <span className="medicare-heart-ripple" />
              <span className="medicare-heart-ripple" />
              <span className="medicare-heart-ripple" />
            </>
          )}

          <span className={!isOpen ? "medicare-heart-float relative z-10" : "relative z-10"}>
            {isOpen ? (
              <X size={27} />
            ) : (
              <HeartPulse size={29} strokeWidth={2} />
            )}
          </span>

          {!isOpen && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full border-[3px] border-white bg-[#78D9A8] z-20" />
          )}
        </button>

        {!isOpen && (
          <div className="absolute right-[72px] bottom-3 whitespace-nowrap rounded-xl bg-[#003435] px-3 py-2 text-base font-bold text-white shadow-lg pointer-events-none">
            Chat with Medicare AI
          </div>
        )}

      </div>
    </>
  );
};

export default AIFloatingChat;
