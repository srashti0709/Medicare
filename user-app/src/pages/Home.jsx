import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarCheck,
  CheckCircle2,
  Clock3,
  Heart,
  HeartPulse,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  FileText,
  MessageCircle,
  Activity,
  Users,
  Star,
  Building2,
  BrainCircuit,
  ScanHeart,
  ClipboardCheck,
  Plus,
} from "lucide-react";

import Navbar from "../components/Navbar";
import WhyMedicare from "../components/WhyMedicare";
import FeaturedDoctors from "../components/FeaturedDoctors";
import FeaturedServices from "../components/FeaturedServices";
import Footer from "../components/Footer";

/* ------------------------------------------------------------------ */
/* Motion helpers (pure CSS + hooks, no extra dependencies)            */
/* ------------------------------------------------------------------ */

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Fires once when the element scrolls into view */
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
      { threshold, rootMargin: "0px 0px -6% 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, shown];
};

/* Scroll-reveal wrapper with a soft 3D entrance */
const Reveal = ({ children, delay = 0, className = "" }) => {
  const [ref, shown] = useInView();
  return (
    <div
      ref={ref}
      className={`mc-reveal ${shown ? "mc-in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

/* Mouse-driven 3D tilt. Children can use translateZ for depth. */
const Tilt = ({ children, className = "", max = 10, scale = 1.02 }) => {
  const ref = useRef(null);

  const handleMove = (e) => {
    if (prefersReducedMotion() || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    ref.current.style.transition = "transform 0.12s ease-out";
    ref.current.style.transform = `perspective(1100px) rotateX(${(-y * max).toFixed(
      2
    )}deg) rotateY(${(x * max).toFixed(2)}deg) scale3d(${scale},${scale},${scale})`;
  };

  const handleLeave = () => {
    if (!ref.current) return;
    ref.current.style.transition = "transform 0.6s cubic-bezier(0.22,1,0.36,1)";
    ref.current.style.transform =
      "perspective(1100px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={className}
      style={{ transformStyle: "preserve-3d", willChange: "transform" }}
    >
      {children}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* 3D hero scene: rotating medical cross, orbiting icons, ripple floor */
/* ------------------------------------------------------------------ */

const P3D = { transformStyle: "preserve-3d" };

/* A solid box built from six CSS faces */
const Cuboid = ({ w, h, d, colors }) => {
  const face = (fw, fh, transform, background) => ({
    position: "absolute",
    width: fw,
    height: fh,
    left: `calc(50% - ${fw / 2}px)`,
    top: `calc(50% - ${fh / 2}px)`,
    background,
    transform,
    backfaceVisibility: "hidden",
  });

  return (
    <div
      style={{
        position: "absolute",
        width: w,
        height: h,
        left: -w / 2,
        top: -h / 2,
        ...P3D,
      }}
    >
      <div style={face(w, h, `translateZ(${d / 2}px)`, colors.front)} />
      <div style={face(w, h, `rotateY(180deg) translateZ(${d / 2}px)`, colors.front)} />
      <div style={face(d, h, `rotateY(90deg) translateZ(${w / 2}px)`, colors.side)} />
      <div style={face(d, h, `rotateY(-90deg) translateZ(${w / 2}px)`, colors.side)} />
      <div style={face(w, d, `rotateX(90deg) translateZ(${h / 2}px)`, colors.cap)} />
      <div style={face(w, d, `rotateX(-90deg) translateZ(${h / 2}px)`, colors.cap)} />
    </div>
  );
};

/* A tilted ring with icon chips that orbit and always face the viewer */
const OrbitRing = ({ radius, chips, duration, reverse = false }) => {
  const direction = reverse ? "reverse" : "normal";

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        transform: "rotateX(72deg)",
        ...P3D,
      }}
    >
      <div
        style={{
          position: "absolute",
          width: radius * 2,
          height: radius * 2,
          left: -radius,
          top: -radius,
          borderRadius: "9999px",
          border: "1.5px dashed rgba(37,139,118,0.45)",
        }}
      />
      <div
        className="mc-orbit-spin"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          animationDuration: `${duration}s`,
          animationDirection: direction,
          ...P3D,
        }}
      >
        {chips.map(({ Icon, angle }) => (
          <div
            key={angle}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              transform: `rotateZ(${angle}deg)`,
              ...P3D,
            }}
          >
            <div
              className="mc-orbit-chip flex items-center justify-center rounded-2xl border border-[#D7E8E1] bg-white text-[#256862] shadow-[0_14px_28px_rgba(0,52,53,0.2)]"
              style={{
                position: "absolute",
                left: -24,
                top: -24,
                width: 48,
                height: 48,
                "--r": `${radius}px`,
                "--a": `${-angle}deg`,
                transform: `translateX(${radius}px) rotateZ(${-angle}deg) rotateX(-72deg)`,
                animationDuration: `${duration}s`,
                animationDirection: direction,
              }}
            >
              <Icon size={22} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const HeroScene = () => {
  const crossColors = {
    front: "#258B76",
    side: "#1B6B5C",
    cap: "#7ED6C6",
  };

  return (
    <div className="relative h-[430px] w-full sm:h-[520px]" style={P3D}>
      {/* Stage disc */}
      <div
        className="absolute inset-x-6 inset-y-4 rounded-full bg-[#DDF3ED]"
        style={{ transform: "translateZ(-140px)" }}
      />

      {/* Scene origin (centre of the stage) */}
      <div
        className="mc-scene-inner absolute left-1/2 top-1/2"
        style={{ width: 0, height: 0, ...P3D }}
      >
        {/* Floor with ripples */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            transform: "translateY(190px) rotateX(78deg)",
            ...P3D,
          }}
        >
          <div
            className="absolute rounded-full bg-[#C6E8DF]"
            style={{ width: 380, height: 380, left: -190, top: -190 }}
          />
          {[0, 1.2, 2.4].map((delay) => (
            <div
              key={delay}
              className="mc-ripple absolute rounded-full border-2 border-[#258B76]"
              style={{
                width: 380,
                height: 380,
                left: -190,
                top: -190,
                animationDelay: `${delay}s`,
              }}
            />
          ))}
        </div>

        {/* Orbit rings */}
        <OrbitRing
          radius={215}
          duration={24}
          chips={[
            { Icon: Stethoscope, angle: 0 },
            { Icon: HeartPulse, angle: 90 },
            { Icon: ShieldCheck, angle: 180 },
            { Icon: CalendarCheck, angle: 270 },
          ]}
        />
        <OrbitRing
          radius={140}
          duration={18}
          reverse
          chips={[
            { Icon: Activity, angle: 40 },
            { Icon: BrainCircuit, angle: 160 },
            { Icon: FileText, angle: 280 },
          ]}
        />

        {/* Rotating medical cross */}
        <div className="mc-bob" style={{ position: "absolute", left: 0, top: 0, ...P3D }}>
          <div style={{ transform: "rotateX(-14deg)", ...P3D }}>
            <div className="mc-rot-y" style={P3D}>
              <Cuboid w={90} h={270} d={90} colors={crossColors} />
              <Cuboid w={270} h={90} d={88} colors={crossColors} />
              {[0, 180].map((rot) => (
                <div
                  key={rot}
                  className="flex items-center justify-center text-white"
                  style={{
                    position: "absolute",
                    left: -24,
                    top: -24,
                    width: 48,
                    height: 48,
                    transform: `rotateY(${rot}deg) translateZ(47px)`,
                    backfaceVisibility: "hidden",
                  }}
                >
                  <HeartPulse size={38} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Heart-rate panel */}
      <div
        className="absolute right-2 top-2 hidden w-44 rounded-2xl border border-[#D7E8E1] bg-white p-3 shadow-[0_22px_45px_rgba(0,52,53,0.18)] sm:block"
        style={{ transform: "translateZ(50px)" }}
      >
        <div className="flex items-center justify-between">
          <span className="text-base font-semibold text-[#003435]">Heart Rate</span>
          <HeartPulse size={18} className="text-[#258B76]" />
        </div>
        <p className="mt-1 text-xl font-bold text-[#003435]">
          72 <span className="text-base font-medium text-[#65736F]">bpm</span>
        </p>
        <svg viewBox="0 0 120 36" className="mt-1 w-full" fill="none" aria-hidden="true">
          <path
            className="mc-ecg"
            pathLength="100"
            d="M0 20 H28 L34 20 L40 6 L48 32 L55 14 L60 20 H120"
            stroke="#258B76"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};

const Home = () => {
  const [chatRef, chatShown] = useInView(0.25);
  const [reportRef, reportShown] = useInView(0.25);

  return (
    <div className="min-h-screen overflow-hidden bg-[#F5F8F6] text-[#0a1f1c]">
      {/* Landing page animation styles */}
      <style>{`
        @keyframes mcRise {
          from { opacity: 0; transform: translateY(34px) rotateX(12deg); }
          to   { opacity: 1; transform: translateY(0) rotateX(0); }
        }
        @keyframes mcFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50%      { transform: translateY(-14px) rotate(1.2deg); }
        }
        @keyframes mcFloatSlow {
          0%, 100% { transform: translateY(0) translateX(0); }
          50%      { transform: translateY(-22px) translateX(10px); }
        }
        @keyframes mcDrift {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50%      { transform: translate3d(30px, 24px, 0) scale(1.08); }
        }
        @keyframes mcSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes mcPulseRing {
          0%   { box-shadow: 0 0 0 0 rgba(37,139,118,0.45); }
          100% { box-shadow: 0 0 0 16px rgba(37,139,118,0); }
        }
        @keyframes mcDraw {
          from { stroke-dashoffset: 340; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes mcDot {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40%           { transform: translateY(-5px); opacity: 1; }
        }
        @keyframes mcGlow {
          0%, 100% { opacity: 0.55; }
          50%      { opacity: 1; }
        }

        .mc-rise { opacity: 0; animation: mcRise 0.9s cubic-bezier(0.22,1,0.36,1) forwards; transform-origin: 50% 100%; }
        .mc-float { animation: mcFloat 6s ease-in-out infinite; }
        .mc-float-b { animation: mcFloat 7.5s ease-in-out infinite; animation-delay: -2s; }
        .mc-float-slow { animation: mcFloatSlow 9s ease-in-out infinite; }
        .mc-drift { animation: mcDrift 14s ease-in-out infinite; }
        .mc-spin-slow { animation: mcSpin 40s linear infinite; }
        .mc-pulse-ring { animation: mcPulseRing 2s ease-out infinite; }
        .mc-draw { stroke-dasharray: 340; stroke-dashoffset: 340; animation: mcDraw 1.2s 0.9s cubic-bezier(0.22,1,0.36,1) forwards; }
        .mc-glow { animation: mcGlow 4s ease-in-out infinite; }
        .mc-dot { animation: mcDot 1.2s ease-in-out infinite; }

        /* 3D hero scene */
        @keyframes mcBob {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-16px); }
        }
        @keyframes mcRotY {
          from { transform: rotateY(0deg); }
          to   { transform: rotateY(360deg); }
        }
        @keyframes mcSpinZ {
          from { transform: rotateZ(0deg); }
          to   { transform: rotateZ(360deg); }
        }
        @keyframes mcCounter {
          from { transform: translateX(var(--r)) rotateZ(var(--a)) rotateX(-72deg); }
          to   { transform: translateX(var(--r)) rotateZ(calc(var(--a) - 360deg)) rotateX(-72deg); }
        }
        @keyframes mcRipple {
          0%   { transform: scale(0.35); opacity: 0.55; }
          100% { transform: scale(1.1);  opacity: 0; }
        }
        @keyframes mcEcg {
          from { stroke-dashoffset: 100; }
          to   { stroke-dashoffset: -100; }
        }
        .mc-bob { animation: mcBob 6s ease-in-out infinite; }
        .mc-rot-y { animation: mcRotY 16s linear infinite; }
        .mc-orbit-spin { animation: mcSpinZ 22s linear infinite; }
        .mc-orbit-chip { animation: mcCounter 22s linear infinite; }
        .mc-ripple { animation: mcRipple 3.6s ease-out infinite; }
        .mc-ecg { stroke-dasharray: 100; animation: mcEcg 3s linear infinite; }
        .mc-scene-inner { transform: scale(0.72); }
        @media (min-width: 640px) { .mc-scene-inner { transform: scale(1); } }

        .mc-reveal {
          opacity: 0;
          transform: perspective(1200px) translateY(46px) rotateX(10deg);
          transform-origin: 50% 100%;
          transition: opacity 0.9s cubic-bezier(0.22,1,0.36,1), transform 0.9s cubic-bezier(0.22,1,0.36,1);
        }
        .mc-reveal.mc-in { opacity: 1; transform: perspective(1200px) translateY(0) rotateX(0); }

        .mc-pop { opacity: 0; transform: translateY(16px) scale(0.96); transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.22,1,0.36,1); }
        .mc-pop.mc-pop-in { opacity: 1; transform: none; }

        .mc-bar { width: 0; transition: width 1.4s cubic-bezier(0.22,1,0.36,1) 0.4s; }
        .mc-bar.mc-bar-in { width: var(--bar-w, 80%); }

        .mc-shine { position: relative; overflow: hidden; }
        .mc-shine::after {
          content: ""; position: absolute; inset: 0; pointer-events: none;
          background: linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.35) 50%, transparent 70%);
          transform: translateX(-130%); transition: transform 0.8s ease;
        }
        .mc-shine:hover::after { transform: translateX(130%); }

        .mc-card-3d { transition: box-shadow 0.4s ease, border-color 0.4s ease; }
        .mc-card-3d:hover { box-shadow: 0 28px 50px rgba(0,52,53,0.14); border-color: #ADEFE7; }

        @media (prefers-reduced-motion: reduce) {
          .mc-rise, .mc-reveal, .mc-pop { opacity: 1 !important; transform: none !important; animation: none !important; transition: none !important; }
          .mc-float, .mc-float-b, .mc-float-slow, .mc-drift, .mc-spin-slow, .mc-pulse-ring, .mc-glow, .mc-dot,
          .mc-bob, .mc-rot-y, .mc-orbit-spin, .mc-orbit-chip, .mc-ripple { animation: none !important; }
          .mc-ecg { animation: none !important; stroke-dashoffset: 0; }
          .mc-draw { animation: none !important; stroke-dashoffset: 0; }
          .mc-bar { transition: none !important; width: var(--bar-w, 80%); }
        }
      `}</style>

      <Navbar />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="mc-drift pointer-events-none absolute -right-40 -top-40 h-[550px] w-[550px] rounded-full bg-[#ADEFE7]/30 blur-3xl" />
        <div
          className="mc-drift pointer-events-none absolute -bottom-40 -left-40 h-[450px] w-[450px] rounded-full bg-[#dcf3ee]/70 blur-3xl"
          style={{ animationDelay: "-6s" }}
        />

        {/* Floating 3D medical shapes */}
        <div className="pointer-events-none absolute left-[46%] top-24 hidden text-[#258B76]/25 lg:block mc-float-slow">
          <Plus size={46} strokeWidth={3} />
        </div>
        <div
          className="pointer-events-none absolute bottom-24 left-[8%] hidden text-[#258B76]/20 lg:block mc-float-slow"
          style={{ animationDelay: "-3s" }}
        >
          <Plus size={30} strokeWidth={3} />
        </div>
        <div
          className="pointer-events-none absolute right-[6%] top-[58%] hidden text-[#256862]/20 lg:block mc-float-slow"
          style={{ animationDelay: "-5s" }}
        >
          <Heart size={34} />
        </div>

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-6 pb-20 pt-16 lg:grid-cols-2 lg:gap-16 lg:pb-28 lg:pt-24">

          {/* Hero content */}
          <div className="relative z-10" style={{ perspective: "1200px" }}>
            <div
              className="mc-rise mb-7 inline-flex items-center gap-2 rounded-full border border-[#B9DDD5] bg-white/80 px-5 py-3 shadow-sm"
              style={{ animationDelay: "0.05s" }}
            >
              <span className="flex h-2.5 w-2.5 rounded-full bg-[#258B76]">
                <span className="h-2.5 w-2.5 animate-ping rounded-full bg-[#258B76] opacity-50" />
              </span>
              <span className="text-base font-semibold tracking-wide text-[#256862]">
                YOUR HEALTH, OUR PRIORITY
              </span>
              <HeartPulse size={19} className="text-[#256862]" />
            </div>

            <h1 className="max-w-2xl font-['Bricolage_Grotesque'] text-5xl font-bold leading-[1.08] tracking-tight text-[#003435] sm:text-6xl lg:text-[68px]">
              <span
                className="mc-rise inline-block"
                style={{ animationDelay: "0.15s" }}
              >
                Better Care.
              </span>
              <br />
              <span
                className="mc-rise relative inline-block text-[#258B76]"
                style={{ animationDelay: "0.3s" }}
              >
                Better Health.
                <svg
                  className="absolute -bottom-3 left-0 w-full"
                  viewBox="0 0 320 14"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    className="mc-draw"
                    d="M3 10C80 2 210 2 316 8"
                    stroke="#ADEFE7"
                    strokeWidth="7"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <br />
              <span
                className="mc-rise inline-block text-[#003435]"
                style={{ animationDelay: "0.45s" }}
              >
                All in One Place.
              </span>
            </h1>

            <p
              className="mc-rise mt-8 max-w-xl text-lg leading-8 text-[#52645F]"
              style={{ animationDelay: "0.6s" }}
            >
              Your journey to better healthcare starts here. Discover trusted
              doctors, explore medical services, manage appointments, and
              understand your health with intelligent AI-powered assistance.
            </p>

            {/* Hero actions */}
            <div
              className="mc-rise mt-9 flex flex-col gap-4 sm:flex-row"
              style={{ animationDelay: "0.75s" }}
            >
              <Link
                to="/doctors"
                className="mc-shine group inline-flex items-center justify-center gap-3 rounded-2xl bg-[#003F40] px-8 py-4 text-base font-bold text-white shadow-[0_12px_25px_rgba(0,52,53,0.18)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#145B57] hover:shadow-[0_18px_35px_rgba(0,52,53,0.3)]"
              >
                <Stethoscope size={20} />
                Find a Doctor
                <ArrowUpRight
                  size={19}
                  className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </Link>

              <Link
                to="/services"
                className="inline-flex items-center justify-center gap-3 rounded-2xl border border-[#B8D2CB] bg-white px-8 py-4 text-base font-bold text-[#164B4D] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#256862] hover:bg-[#E7F4F1] hover:shadow-lg"
              >
                Explore Services
                <ArrowRight size={19} />
              </Link>
            </div>

            {/* Trust indicators */}
            <div
              className="mc-rise mt-12 flex flex-wrap items-center gap-x-8 gap-y-5 border-t border-[#D6E5DF] pt-7"
              style={{ animationDelay: "0.9s" }}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#DDF3ED] text-[#256862] shadow-sm">
                  <ShieldCheck size={23} />
                </div>
                <div>
                  <p className="text-base font-bold text-[#003435]">
                    Trusted Care
                  </p>
                  <p className="text-base text-[#65736F]">
                    Patient focused
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#DDF3ED] text-[#256862] shadow-sm">
                  <Clock3 size={23} />
                </div>
                <div>
                  <p className="text-base font-bold text-[#003435]">
                    Easy Booking
                  </p>
                  <p className="text-base text-[#65736F]">
                    Simple scheduling
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Hero image area */}
          <div
            className="mc-rise relative mx-auto w-full max-w-[560px] lg:ml-auto"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="mc-spin-slow absolute -right-8 -top-8 h-36 w-36 rounded-full border-[22px] border-dashed border-[#ADEFE7]/50" />
            <div className="mc-glow absolute -bottom-8 -left-8 h-36 w-36 rounded-full bg-[#ADEFE7]/40 blur-2xl" />

            <Tilt max={12} scale={1.02} className="relative">
              <HeroScene />

              {/* Floating appointment card (lifted in 3D) */}
              <div
                className="absolute -left-5 top-12 hidden sm:block lg:-left-16"
                style={{ transform: "translateZ(70px)" }}
              >
                <div className="mc-float max-w-[220px] rounded-2xl border border-[#D7E8E1] bg-white p-4 shadow-[0_22px_45px_rgba(0,52,53,0.18)]">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E1F5EE] text-[#256862]">
                      <CalendarCheck size={23} />
                    </div>
                    <div>
                      <p className="text-base font-bold text-[#003435]">
                        Appointments
                      </p>
                      <p className="text-base text-[#65736F]">Made simple</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-base font-semibold text-[#258B76]">
                    <CheckCircle2 size={18} />
                    Easy scheduling
                  </div>
                </div>
              </div>

              {/* Floating AI card (lifted in 3D) */}
              <div
                className="absolute -bottom-7 right-3 sm:right-0 lg:-right-10"
                style={{ transform: "translateZ(90px)" }}
              >
                <div className="mc-float-b max-w-[235px] rounded-2xl border border-[#D7E8E1] bg-white p-4 shadow-[0_22px_45px_rgba(0,52,53,0.18)]">
                  <div className="flex items-center gap-3">
                    <div className="mc-pulse-ring flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8E8F8] text-[#5556A4]">
                      <Sparkles size={23} />
                    </div>
                    <div>
                      <p className="text-base font-bold text-[#003435]">
                        AI Healthcare
                      </p>
                      <p className="text-base text-[#65736F]">
                        Smarter assistance
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Tilt>
          </div>
        </div>
      </section>

      {/* WHY MEDICARE */}
      <Reveal>
        <WhyMedicare />
      </Reveal>

      {/* FEATURED DOCTORS */}
      <Reveal>
        <FeaturedDoctors />
      </Reveal>

      {/* FEATURED SERVICES */}
      <Reveal>
        <FeaturedServices />
      </Reveal>

      {/* AI HEALTH REPORT ANALYZER */}
      <section className="relative overflow-hidden py-20">
        <div className="mc-drift pointer-events-none absolute -right-40 top-10 h-96 w-96 rounded-full bg-[#ADEFE7]/30 blur-3xl" />

        <Reveal className="relative mx-auto max-w-7xl px-6">
          <div className="overflow-hidden rounded-[36px] bg-[#003435] shadow-[0_25px_70px_rgba(0,52,53,0.15)]">
            <div className="grid grid-cols-1 items-center lg:grid-cols-2">

              {/* AI content */}
              <div className="px-8 py-14 sm:px-12 lg:px-14 lg:py-20">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#ADEFE7]/30 bg-white/10 px-5 py-3">
                  <Sparkles size={19} className="mc-glow text-[#ADEFE7]" />
                  <span className="text-base font-semibold text-[#ADEFE7]">
                    AI-POWERED HEALTHCARE
                  </span>
                </div>

                <h2 className="max-w-xl font-['Bricolage_Grotesque'] text-4xl font-bold leading-tight text-white sm:text-5xl">
                  Your Health Reports,
                  <span className="text-[#ADEFE7]"> Made Easier </span>
                  to Understand.
                </h2>

                <p className="mt-6 max-w-lg text-lg leading-8 text-[#D0E5DF]">
                  Medical reports can be difficult to understand. Upload your
                  report and get an AI-generated summary, important findings,
                  and answers to questions about the report.
                </p>

                <div ref={reportRef} className="mt-8 space-y-4">
                  {[
                    "AI-generated report summary",
                    "Identify important report values",
                    "Ask questions about your report",
                  ].map((item, i) => (
                    <div
                      key={item}
                      className={`mc-pop flex items-center gap-3 ${
                        reportShown ? "mc-pop-in" : ""
                      }`}
                      style={{ transitionDelay: `${i * 140 + 200}ms` }}
                    >
                      <CheckCircle2
                        size={21}
                        className="shrink-0 text-[#ADEFE7]"
                      />
                      <span className="text-base font-medium text-white">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>

                <Link
                  to="/health-report-analyzer"
                  className="mc-shine group mt-10 inline-flex items-center gap-3 rounded-2xl bg-[#ADEFE7] px-7 py-4 text-base font-bold text-[#003435] shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_18px_35px_rgba(173,239,231,0.35)]"
                >
                  Analyze My Report
                  <ArrowUpRight
                    size={20}
                    className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                  />
                </Link>

                <p className="mt-5 text-base text-[#C3DCD5]">
                  AI assistance is informational and does not replace
                  professional medical advice.
                </p>
              </div>

              {/* AI visual panel */}
              <div className="relative flex min-h-[450px] items-center justify-center overflow-hidden bg-gradient-to-br from-[#164B4D] to-[#256862] p-8 sm:p-12">
                <div className="mc-spin-slow absolute -right-20 -top-20 h-72 w-72 rounded-full border-[35px] border-white/5" />
                <div
                  className="mc-spin-slow absolute -bottom-20 -left-20 h-72 w-72 rounded-full border-[35px] border-white/5"
                  style={{ animationDirection: "reverse" }}
                />

                {/* Report illustration */}
                <div className="relative z-10 w-full max-w-sm" style={{ perspective: "1100px" }}>
                  <Tilt max={12} scale={1.03}>
                    <div className="rounded-3xl border border-white/20 bg-white/10 p-7 shadow-2xl backdrop-blur-xl">
                      <div className="flex items-center justify-between">
                        <div
                          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ADEFE7] text-[#003435]"
                          style={{ transform: "translateZ(40px)" }}
                        >
                          <FileText size={25} />
                        </div>
                        <div
                          className="rounded-full bg-[#ADEFE7]/20 px-4 py-2 text-base font-semibold text-[#ADEFE7]"
                          style={{ transform: "translateZ(30px)" }}
                        >
                          AI Analysis
                        </div>
                      </div>

                      <h3
                        className="mt-6 text-2xl font-bold text-white"
                        style={{ transform: "translateZ(30px)" }}
                      >
                        Health Report
                      </h3>
                      <p className="mt-2 text-base text-[#D0E5DF]">
                        Your report, explained in simple language.
                      </p>

                      <div className="mt-7 space-y-4">
                        <div
                          className="rounded-2xl bg-white/10 p-4"
                          style={{ transform: "translateZ(25px)" }}
                        >
                          <div className="flex items-center gap-3">
                            <ScanHeart
                              size={22}
                              className="text-[#ADEFE7]"
                            />
                            <span className="text-base font-semibold text-white">
                              Report Summary
                            </span>
                          </div>
                          <div className="mt-4 h-2 rounded-full bg-white/15">
                            <div
                              className={`mc-bar h-2 rounded-full bg-[#ADEFE7] ${
                                reportShown ? "mc-bar-in" : ""
                              }`}
                              style={{ "--bar-w": "80%" }}
                            />
                          </div>
                          <div className="mt-2 h-2 w-2/3 rounded-full bg-white/20" />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div
                            className="mc-float rounded-2xl bg-white/10 p-4"
                            style={{ transform: "translateZ(55px)" }}
                          >
                            <Activity size={21} className="text-[#ADEFE7]" />
                            <p className="mt-3 text-base font-semibold text-white">
                              Key Values
                            </p>
                            <p className="mt-1 text-base text-[#D0E5DF]">
                              Report insights
                            </p>
                          </div>
                          <div
                            className="mc-float-b rounded-2xl bg-white/10 p-4"
                            style={{ transform: "translateZ(55px)" }}
                          >
                            <MessageCircle
                              size={21}
                              className="text-[#ADEFE7]"
                            />
                            <p className="mt-3 text-base font-semibold text-white">
                              Ask AI
                            </p>
                            <p className="mt-1 text-base text-[#D0E5DF]">
                              Get explanations
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Tilt>
                </div>

                {/* Replace this illustration with a report-analysis image if desired */}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* MEDICARE AI ASSISTANT */}
      <section className="relative py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">

            {/* Assistant visual */}
            <Reveal className="relative order-2 lg:order-1">
              <div className="mc-drift absolute -left-10 -top-10 h-48 w-48 rounded-full bg-[#ADEFE7]/50 blur-3xl" />

              <Tilt max={7} scale={1.015}>
                <div className="relative overflow-hidden rounded-[32px] border border-[#D4E4DE] bg-white p-7 shadow-[0_30px_70px_rgba(0,52,53,0.12)] sm:p-10">
                  <div className="flex items-center justify-between border-b border-[#E3ECE8] pb-6">
                    <div className="flex items-center gap-4">
                      <div
                        className="mc-pulse-ring flex h-14 w-14 items-center justify-center rounded-2xl bg-[#003F40] text-[#ADEFE7]"
                        style={{ transform: "translateZ(40px)" }}
                      >
                        <BrainCircuit size={29} />
                      </div>
                      <div>
                        <h3 className="font-['Bricolage_Grotesque'] text-lg font-bold text-[#003435]">
                          Medicare AI
                        </h3>
                        <p className="mt-1 flex items-center gap-2 text-base text-[#65736F]">
                          <span className="h-2.5 w-2.5 rounded-full bg-[#258B76]" />
                          Healthcare assistant
                        </p>
                      </div>
                    </div>
                    <Sparkles size={24} className="mc-glow text-[#258B76]" />
                  </div>

                  <div ref={chatRef} className="mt-7 space-y-5">
                    <div
                      className={`mc-pop flex items-start gap-3 ${
                        chatShown ? "mc-pop-in" : ""
                      }`}
                      style={{ transitionDelay: "300ms" }}
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E7F4F1] text-[#256862]">
                        <BotIcon />
                      </div>
                      <div className="max-w-[85%] rounded-2xl rounded-tl-none bg-[#E7F4F1] p-4">
                        <p className="text-base leading-7 text-[#164B4D]">
                          Hello! How can I help you with your healthcare today?
                        </p>
                      </div>
                    </div>

                    <div
                      className={`mc-pop ml-auto flex max-w-[85%] items-start justify-end gap-3 ${
                        chatShown ? "mc-pop-in" : ""
                      }`}
                      style={{ transitionDelay: "1100ms" }}
                    >
                      <div className="rounded-2xl rounded-tr-none bg-[#003F40] p-4">
                        <p className="text-base leading-7 text-white">
                          I want to find a doctor.
                        </p>
                      </div>
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#DDF3ED] text-[#256862]">
                        <Users size={21} />
                      </div>
                    </div>

                    <div
                      className={`mc-pop flex items-start gap-3 ${
                        chatShown ? "mc-pop-in" : ""
                      }`}
                      style={{ transitionDelay: "1900ms" }}
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E7F4F1] text-[#256862]">
                        <BotIcon />
                      </div>
                      <div className="max-w-[85%] rounded-2xl rounded-tl-none bg-[#E7F4F1] p-4">
                        <p className="text-base leading-7 text-[#164B4D]">
                          Absolutely! I can help you explore doctors and find
                          available appointments.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    className="mt-7 flex items-center justify-between rounded-2xl border border-[#D4E4DE] bg-[#F5F8F6] p-4"
                    style={{ transform: "translateZ(30px)" }}
                  >
                    <span className="flex items-center gap-3 text-base text-[#65736F]">
                      Ask Medicare AI...
                      <span className="flex items-center gap-1" aria-hidden="true">
                        {[0, 1, 2].map((d) => (
                          <span
                            key={d}
                            className="mc-dot h-1.5 w-1.5 rounded-full bg-[#258B76]"
                            style={{ animationDelay: `${d * 0.18}s` }}
                          />
                        ))}
                      </span>
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#003F40] text-white">
                      <ArrowRight size={20} />
                    </div>
                  </div>
                  <p className="mt-4 text-center text-base text-[#65736F]">
                    Preview illustration — start a conversation in Medicare AI.
                  </p>
                </div>
              </Tilt>
            </Reveal>

            {/* Assistant content */}
            <Reveal className="order-1 lg:order-2" delay={150}>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#C8DED6] bg-[#E7F4F1] px-5 py-3">
                <Sparkles size={19} className="text-[#256862]" />
                <span className="text-base font-bold text-[#256862]">
                  MEET YOUR AI ASSISTANT
                </span>
              </div>

              <h2 className="font-['Bricolage_Grotesque'] text-4xl font-bold leading-tight text-[#003435] sm:text-5xl">
                Healthcare Guidance,
                <span className="text-[#258B76]"> Just a Conversation Away.</span>
              </h2>

              <p className="mt-6 text-lg leading-8 text-[#52645F]">
                Getting healthcare assistance should feel simple. Chat with
                Medicare AI to explore services, find doctors, check
                appointments, and get help navigating the platform.
              </p>

              <div className="mt-8 space-y-5">
                {[
                  {
                    icon: Stethoscope,
                    title: "Discover Doctors",
                    description: "Explore doctors and their specializations.",
                  },
                  {
                    icon: CalendarCheck,
                    title: "Appointment Assistance",
                    description: "Get help finding and booking appointments.",
                  },
                  {
                    icon: MessageCircle,
                    title: "Simple Conversations",
                    description: "Get platform assistance through natural chat.",
                  },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="group flex items-start gap-4 transition-transform duration-300 hover:translate-x-2"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#E7F4F1] text-[#256862] shadow-sm transition-all duration-300 group-hover:-rotate-6 group-hover:scale-110 group-hover:bg-[#003F40] group-hover:text-[#ADEFE7]">
                        <Icon size={23} />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-[#003435]">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-base leading-7 text-[#65736F]">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Link
                to="/ai-assistant"
                className="mc-shine group mt-9 inline-flex items-center gap-3 rounded-2xl bg-[#003F40] px-8 py-4 text-base font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#145B57] hover:shadow-[0_18px_35px_rgba(0,52,53,0.3)]"
              >
                Chat with Medicare AI
                <ArrowUpRight
                  size={20}
                  className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* HEALTHCARE EXPERIENCE SECTION */}
      <section className="py-20">
        <Reveal className="mx-auto max-w-7xl px-6">
          <div className="relative overflow-hidden rounded-[36px] border border-[#D3E5DE] bg-[#E7F4F1] p-8 sm:p-12 lg:p-16">
            <div className="mc-drift absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#ADEFE7]/60 blur-2xl" />

            <div className="relative grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
              <div>
                <span className="text-base font-bold uppercase tracking-[0.18em] text-[#258B76]">
                  THE MEDICARE EXPERIENCE
                </span>
                <h2 className="mt-5 max-w-xl font-['Bricolage_Grotesque'] text-4xl font-bold leading-tight text-[#003435] sm:text-5xl">
                  Everything You Need for a Better Healthcare Journey.
                </h2>
                <p className="mt-6 max-w-xl text-lg leading-8 text-[#52645F]">
                  From discovering healthcare professionals to understanding
                  your reports, Medicare brings important healthcare
                  experiences together in one convenient platform.
                </p>

                <Link
                  to="/services"
                  className="mc-shine group mt-8 inline-flex items-center gap-3 rounded-2xl bg-[#003F40] px-7 py-4 text-base font-bold text-white transition-all hover:-translate-y-1 hover:bg-[#145B57] hover:shadow-[0_18px_35px_rgba(0,52,53,0.3)]"
                >
                  Explore Medicare
                  <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              <div
                className="grid grid-cols-1 gap-4 sm:grid-cols-2"
                style={{ perspective: "1200px" }}
              >
                {[
                  {
                    icon: HeartPulse,
                    title: "Patient Focused",
                    text: "A convenient healthcare experience.",
                  },
                  {
                    icon: ShieldCheck,
                    title: "Care & Trust",
                    text: "Designed around your healthcare journey.",
                  },
                  {
                    icon: CalendarCheck,
                    title: "Easy Scheduling",
                    text: "Manage your appointments with ease.",
                  },
                  {
                    icon: BrainCircuit,
                    title: "AI Assistance",
                    text: "Get help through intelligent tools.",
                  },
                ].map((item, i) => {
                  const Icon = item.icon;

                  return (
                    <Reveal key={item.title} delay={i * 120}>
                      <Tilt max={14} scale={1.04}>
                        <div className="mc-card-3d rounded-2xl border border-white bg-white/85 p-6 shadow-sm">
                          <div
                            className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#DDF3ED] text-[#256862]"
                            style={{ transform: "translateZ(35px)" }}
                          >
                            <Icon size={24} />
                          </div>
                          <h3
                            className="mt-5 text-lg font-bold text-[#003435]"
                            style={{ transform: "translateZ(25px)" }}
                          >
                            {item.title}
                          </h3>
                          <p
                            className="mt-2 text-base leading-7 text-[#65736F]"
                            style={{ transform: "translateZ(15px)" }}
                          >
                            {item.text}
                          </p>
                        </div>
                      </Tilt>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="relative overflow-hidden px-6 pb-24 pt-10">
        <div className="mc-glow pointer-events-none absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-[#ADEFE7]/40 blur-3xl" />

        <Reveal className="relative mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-[36px] bg-[#003435] px-8 py-16 text-center shadow-[0_25px_70px_rgba(0,52,53,0.15)] sm:px-14 sm:py-20">
            <div className="mc-spin-slow absolute -left-24 -top-24 h-72 w-72 rounded-full border-[35px] border-white/5" />
            <div
              className="mc-spin-slow absolute -bottom-32 -right-20 h-80 w-80 rounded-full border-[35px] border-white/5"
              style={{ animationDirection: "reverse" }}
            />

            <div className="relative z-10 mx-auto max-w-3xl">
              <div className="mc-float mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ADEFE7] text-[#003435] shadow-[0_18px_35px_rgba(173,239,231,0.3)]">
                <Heart size={31} className="animate-pulse" />
              </div>

              <p className="mt-7 text-base font-bold uppercase tracking-[0.2em] text-[#ADEFE7]">
                YOUR WELLNESS STARTS HERE
              </p>

              <h2 className="mt-5 font-['Bricolage_Grotesque'] text-4xl font-bold leading-tight text-white sm:text-5xl">
                Take the First Step Towards Better Health.
              </h2>

              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#D0E5DF]">
                Find the right healthcare professional, explore available
                services, and make your next healthcare decision with confidence.
              </p>

              <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
                <Link
                  to="/doctors"
                  className="mc-shine group inline-flex items-center justify-center gap-3 rounded-2xl bg-[#ADEFE7] px-8 py-4 text-base font-bold text-[#003435] transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_18px_35px_rgba(173,239,231,0.35)]"
                >
                  Find a Doctor
                  <ArrowUpRight
                    size={20}
                    className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                  />
                </Link>

                <Link
                  to="/services"
                  className="inline-flex items-center justify-center gap-3 rounded-2xl border border-white/30 bg-white/10 px-8 py-4 text-base font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-white/20"
                >
                  Explore Services
                  <ArrowRight size={20} />
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-x-7 gap-y-4 text-base text-[#C3DCD5]">
                <span className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-[#ADEFE7]" />
                  Patient focused
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-[#ADEFE7]" />
                  Convenient access
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-[#ADEFE7]" />
                  Smarter assistance
                </span>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <Footer />
    </div>
  );
};

/* Small local icon component for the AI chat preview */
const BotIcon = () => (
  <BrainCircuit size={21} />
);

export default Home;