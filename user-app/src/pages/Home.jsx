
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

const Home = () => {
  return (
    <div className="min-h-screen overflow-hidden bg-[#F5F8F6] text-[#0a1f1c]">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="pointer-events-none absolute -right-40 -top-40 h-[550px] w-[550px] rounded-full bg-[#ADEFE7]/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-40 h-[450px] w-[450px] rounded-full bg-[#dcf3ee]/70 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-6 pb-20 pt-16 lg:grid-cols-2 lg:gap-16 lg:pb-28 lg:pt-24">

          {/* Hero content */}
          <div className="relative z-10">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#B9DDD5] bg-white/80 px-5 py-3 shadow-sm">
              <span className="flex h-2.5 w-2.5 rounded-full bg-[#258B76]">
                <span className="h-2.5 w-2.5 animate-ping rounded-full bg-[#258B76] opacity-50" />
              </span>
              <span className="text-base font-semibold tracking-wide text-[#256862]">
                YOUR HEALTH, OUR PRIORITY
              </span>
              <HeartPulse size={19} className="text-[#256862]" />
            </div>

            <h1 className="max-w-2xl font-['Bricolage_Grotesque'] text-5xl font-bold leading-[1.08] tracking-tight text-[#003435] sm:text-6xl lg:text-[68px]">
              Better Care.
              <br />
              <span className="relative inline-block text-[#258B76]">
                Better Health.
                <svg
                  className="absolute -bottom-3 left-0 w-full"
                  viewBox="0 0 320 14"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 10C80 2 210 2 316 8"
                    stroke="#ADEFE7"
                    strokeWidth="7"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <br />
              <span className="text-[#003435]">All in One Place.</span>
            </h1>

            <p className="mt-8 max-w-xl text-lg leading-8 text-[#52645F]">
              Your journey to better healthcare starts here. Discover trusted
              doctors, explore medical services, manage appointments, and
              understand your health with intelligent AI-powered assistance.
            </p>

            {/* Hero actions */}
            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/doctors"
                className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-[#003F40] px-8 py-4 text-base font-bold text-white shadow-[0_12px_25px_rgba(0,52,53,0.18)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#145B57] hover:shadow-xl"
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
                className="inline-flex items-center justify-center gap-3 rounded-2xl border border-[#B8D2CB] bg-white px-8 py-4 text-base font-bold text-[#164B4D] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#256862] hover:bg-[#E7F4F1]"
              >
                Explore Services
                <ArrowRight size={19} />
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-5 border-t border-[#D6E5DF] pt-7">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#DDF3ED] text-[#256862]">
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
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#DDF3ED] text-[#256862]">
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
          <div className="relative mx-auto w-full max-w-[560px] lg:ml-auto">
            <div className="absolute -right-8 -top-8 h-36 w-36 rounded-full border-[22px] border-[#ADEFE7]/40" />
            <div className="absolute -bottom-8 -left-8 h-36 w-36 rounded-full bg-[#ADEFE7]/40 blur-2xl" />

            <div className="relative rounded-[36px] border border-[#C8DDD6] bg-white p-3 shadow-[0_30px_80px_rgba(0,52,53,0.12)]">
              {/* Replace this area with your hero healthcare photo */}
              <div className="relative flex min-h-[420px] items-center justify-center overflow-hidden rounded-[28px] bg-gradient-to-br from-[#DDF3ED] via-[#C4EAE1] to-[#A6DAD0] sm:min-h-[490px]">

                <img
                  src="/images/hero.png"
                  alt="3D cartoon illustration of a doctor consulting a patient"
                  className="absolute inset-0 h-full w-full object-cover"
                />


                

                {/* PHOTO PLACEHOLDER:
                    Replace the content above with your image, for example:
                    <img src="/images/hero-doctor.jpg"
                         alt="Doctor providing healthcare"
                         className="absolute inset-0 h-full w-full object-cover" />
                */}
              </div>
            </div>

            {/* Floating appointment card */}
            <div className="absolute -left-5 top-12 hidden max-w-[220px] rounded-2xl border border-[#D7E8E1] bg-white p-4 shadow-xl sm:block lg:-left-16">
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

            {/* Floating AI card */}
            <div className="absolute -bottom-7 right-3 max-w-[235px] rounded-2xl border border-[#D7E8E1] bg-white p-4 shadow-xl sm:right-0 lg:-right-10">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8E8F8] text-[#5556A4]">
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
        </div>
      </section>

      {/* QUICK BENEFITS STRIP */}
      <section className="relative z-10 mx-auto -mt-2 max-w-7xl px-6 pb-10">
        <div className="grid grid-cols-1 gap-4 rounded-3xl border border-[#D4E4DE] bg-white p-5 shadow-[0_15px_45px_rgba(0,52,53,0.05)] sm:grid-cols-2 lg:grid-cols-4 lg:p-7">
          {[
            {
              icon: Stethoscope,
              title: "Find Specialists",
              description: "Connect with doctors",
            },
            {
              icon: CalendarCheck,
              title: "Book Appointments",
              description: "Schedule with ease",
            },
            {
              icon: FileText,
              title: "Understand Reports",
              description: "AI-powered insights",
            },
            {
              icon: MessageCircle,
              title: "Get Assistance",
              description: "Chat with Medicare AI",
            },
          ].map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className={`flex items-center gap-4 px-3 py-3 transition-all duration-300 hover:-translate-y-1 ${index !== 0 ? "lg:border-l lg:border-[#E0EBE6] lg:pl-6" : ""
                  }`}
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#E7F4F1] text-[#256862]">
                  <Icon size={26} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#003435]">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-base text-[#65736F]">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* WHY MEDICARE */}
      <WhyMedicare />

      {/* FEATURED DOCTORS */}
      <FeaturedDoctors />

      {/* FEATURED SERVICES */}
      <FeaturedServices />

      {/* AI HEALTH REPORT ANALYZER */}
      <section className="relative overflow-hidden py-20">
        <div className="pointer-events-none absolute -right-40 top-10 h-96 w-96 rounded-full bg-[#ADEFE7]/30 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6">
          <div className="overflow-hidden rounded-[36px] bg-[#003435] shadow-[0_25px_70px_rgba(0,52,53,0.15)]">
            <div className="grid grid-cols-1 items-center lg:grid-cols-2">

              {/* AI content */}
              <div className="px-8 py-14 sm:px-12 lg:px-14 lg:py-20">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#ADEFE7]/30 bg-white/10 px-5 py-3">
                  <Sparkles size={19} className="text-[#ADEFE7]" />
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

                <div className="mt-8 space-y-4">
                  {[
                    "AI-generated report summary",
                    "Identify important report values",
                    "Ask questions about your report",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3">
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
                  className="group mt-10 inline-flex items-center gap-3 rounded-2xl bg-[#ADEFE7] px-7 py-4 text-base font-bold text-[#003435] shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-white"
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
                <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full border-[35px] border-white/5" />
                <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full border-[35px] border-white/5" />

                {/* Report illustration / image placeholder */}
                <div className="relative z-10 w-full max-w-sm rounded-3xl border border-white/20 bg-white/10 p-7 shadow-2xl backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ADEFE7] text-[#003435]">
                      <FileText size={25} />
                    </div>
                    <div className="rounded-full bg-[#ADEFE7]/20 px-4 py-2 text-base font-semibold text-[#ADEFE7]">
                      AI Analysis
                    </div>
                  </div>

                  <h3 className="mt-6 text-2xl font-bold text-white">
                    Health Report
                  </h3>
                  <p className="mt-2 text-base text-[#D0E5DF]">
                    Your report, explained in simple language.
                  </p>

                  <div className="mt-7 space-y-4">
                    <div className="rounded-2xl bg-white/10 p-4">
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
                        <div className="h-2 w-4/5 rounded-full bg-[#ADEFE7]" />
                      </div>
                      <div className="mt-2 h-2 w-2/3 rounded-full bg-white/20" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-white/10 p-4">
                        <Activity size={21} className="text-[#ADEFE7]" />
                        <p className="mt-3 text-base font-semibold text-white">
                          Key Values
                        </p>
                        <p className="mt-1 text-base text-[#D0E5DF]">
                          Report insights
                        </p>
                      </div>
                      <div className="rounded-2xl bg-white/10 p-4">
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

                {/* Replace this illustration with a report-analysis image if desired */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MEDICARE AI ASSISTANT */}
      <section className="relative py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">

            {/* Assistant visual */}
            <div className="relative order-2 lg:order-1">
              <div className="absolute -left-10 -top-10 h-48 w-48 rounded-full bg-[#ADEFE7]/50 blur-3xl" />

              <div className="relative overflow-hidden rounded-[32px] border border-[#D4E4DE] bg-white p-7 shadow-[0_20px_55px_rgba(0,52,53,0.08)] sm:p-10">
                <div className="flex items-center justify-between border-b border-[#E3ECE8] pb-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#003F40] text-[#ADEFE7]">
                      <BrainCircuit size={29} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#003435]">
                        Medicare AI
                      </h3>
                      <p className="mt-1 flex items-center gap-2 text-base text-[#65736F]">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#258B76]" />
                        Healthcare assistant
                      </p>
                    </div>
                  </div>
                  <Sparkles size={24} className="text-[#258B76]" />
                </div>

                <div className="mt-7 space-y-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E7F4F1] text-[#256862]">
                      <BotIcon />
                    </div>
                    <div className="max-w-[85%] rounded-2xl rounded-tl-none bg-[#E7F4F1] p-4">
                      <p className="text-base leading-7 text-[#164B4D]">
                        Hello! How can I help you with your healthcare today?
                      </p>
                    </div>
                  </div>

                  <div className="ml-auto flex max-w-[85%] items-start justify-end gap-3">
                    <div className="rounded-2xl rounded-tr-none bg-[#003F40] p-4">
                      <p className="text-base leading-7 text-white">
                        I want to find a doctor.
                      </p>
                    </div>
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#DDF3ED] text-[#256862]">
                      <Users size={21} />
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
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

                <div className="mt-7 flex items-center justify-between rounded-2xl border border-[#D4E4DE] bg-[#F5F8F6] p-4">
                  <span className="text-base text-[#65736F]">
                    Ask Medicare AI...
                  </span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#003F40] text-white">
                    <ArrowRight size={20} />
                  </div>
                </div>
                <p className="mt-4 text-center text-base text-[#65736F]">
                  Preview illustration — start a conversation in Medicare AI.
                </p>
              </div>
            </div>

            {/* Assistant content */}
            <div className="order-1 lg:order-2">
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
                    <div key={item.title} className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#E7F4F1] text-[#256862]">
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
                className="group mt-9 inline-flex items-center gap-3 rounded-2xl bg-[#003F40] px-8 py-4 text-base font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#145B57]"
              >
                Chat with Medicare AI
                <ArrowUpRight
                  size={20}
                  className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* HEALTHCARE EXPERIENCE SECTION */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="relative overflow-hidden rounded-[36px] border border-[#D3E5DE] bg-[#E7F4F1] p-8 sm:p-12 lg:p-16">
            <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#ADEFE7]/60 blur-2xl" />

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
                  className="group mt-8 inline-flex items-center gap-3 rounded-2xl bg-[#003F40] px-7 py-4 text-base font-bold text-white transition-all hover:-translate-y-1 hover:bg-[#145B57]"
                >
                  Explore Medicare
                  <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="rounded-2xl border border-white bg-white/85 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#DDF3ED] text-[#256862]">
                        <Icon size={24} />
                      </div>
                      <h3 className="mt-5 text-lg font-bold text-[#003435]">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-base leading-7 text-[#65736F]">
                        {item.text}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="relative overflow-hidden px-6 pb-24 pt-10">
        <div className="pointer-events-none absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-[#ADEFE7]/40 blur-3xl" />

        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[36px] bg-[#003435] px-8 py-16 text-center shadow-[0_25px_70px_rgba(0,52,53,0.15)] sm:px-14 sm:py-20">
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full border-[35px] border-white/5" />
          <div className="absolute -bottom-32 -right-20 h-80 w-80 rounded-full border-[35px] border-white/5" />

          <div className="relative z-10 mx-auto max-w-3xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ADEFE7] text-[#003435] shadow-lg">
              <Heart size={31} />
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
                className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-[#ADEFE7] px-8 py-4 text-base font-bold text-[#003435] transition-all duration-300 hover:-translate-y-1 hover:bg-white"
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
