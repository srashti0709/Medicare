import {
  ArrowUpRight,
  CalendarCheck,
  HeartPulse,
  Stethoscope,
} from "lucide-react";

const WhyMedicare = () => {
  const features = [
    {
      icon: Stethoscope,
      number: "01",
      title: "Expert Doctors",
      description:
        "Connect with experienced doctors across different medical specialties.",
    },
    {
      icon: CalendarCheck,
      number: "02",
      title: "Easy Appointments",
      description:
        "Book and manage your doctor appointments quickly and easily.",
    },
    {
      icon: HeartPulse,
      number: "03",
      title: "Quality Services",
      description:
        "Explore reliable healthcare services designed around your needs.",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#F5F8F6] py-16 sm:py-20">
      {/* Soft background accents matching the Home hero */}
      <div className="pointer-events-none absolute -right-40 top-0 h-[420px] w-[420px] rounded-full bg-[#ADEFE7]/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-40 h-[380px] w-[380px] rounded-full bg-[#dcf3ee]/50 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Section heading */}
        <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-14">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#B9DDD5] bg-white/80 px-5 py-3 shadow-sm">
            <HeartPulse size={19} className="text-[#256862]" />
            <span className="text-base font-semibold tracking-wide text-[#256862]">
              WHY MEDICARE?
            </span>
          </div>

          <h2 className="font-['Bricolage_Grotesque'] text-4xl font-bold leading-tight tracking-tight text-[#003435] sm:text-5xl">
            Healthcare Made{" "}
            <span className="text-[#258B76]">Easier.</span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-[#52645F]">
            Everything you need to manage your healthcare in one place,
            with convenient access to trusted medical care.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-7">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group relative overflow-hidden rounded-[28px] border border-[#D4E4DE] bg-white p-8 shadow-[0_12px_35px_rgba(0,52,53,0.045)] transition-all duration-300 hover:-translate-y-2 hover:border-[#B9DDD5] hover:shadow-[0_22px_45px_rgba(0,52,53,0.09)] sm:p-9"
              >
                {/* Subtle card decoration */}
                <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#E7F4F1]/80 transition-transform duration-500 group-hover:scale-125" />

                <div className="relative flex items-center justify-between">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#D4E4DE] bg-[#E7F4F1] text-[#256862] transition-all duration-300 group-hover:border-[#003F40] group-hover:bg-[#003F40] group-hover:text-[#ADEFE7]">
                    <Icon size={28} strokeWidth={1.8} />
                  </div>

                  <span className="font-['Bricolage_Grotesque'] text-4xl font-bold text-[#DCECE6] transition-colors duration-300 group-hover:text-[#ADEFE7]">
                    {feature.number}
                  </span>
                </div>

                <h3 className="relative mt-8 font-['Bricolage_Grotesque'] text-2xl font-bold text-[#003435]">
                  {feature.title}
                </h3>

                <p className="relative mt-4 text-base leading-8 text-[#65736F]">
                  {feature.description}
                </p>

                <div className="relative mt-8 flex items-center justify-between border-t border-[#E5EFEB] pt-5">
                  <span className="text-base font-semibold text-[#256862]">
                    Medicare Care
                  </span>

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E7F4F1] text-[#256862] transition-all duration-300 group-hover:bg-[#003F40] group-hover:text-white">
                    <ArrowUpRight size={20} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Closing trust line */}
        <div className="mt-11 flex flex-col items-center justify-center gap-3 text-center sm:flex-row">
          <div className="flex -space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#F5F8F6] bg-[#DDF3ED] text-[#256862]">
              <Stethoscope size={18} />
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#F5F8F6] bg-[#ADEFE7] text-[#003435]">
              <HeartPulse size={18} />
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#F5F8F6] bg-[#E7F4F1] text-[#256862]">
              <CalendarCheck size={18} />
            </div>
          </div>

          <p className="text-base font-medium text-[#52645F]">
            Thoughtful healthcare, made simpler for everyone.
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhyMedicare;