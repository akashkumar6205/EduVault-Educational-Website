import { useEffect, useRef, useState } from "react";

function How_it_work() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);



  const steps = [
    {
      num: "01",
      title: "Make it yours",
      desc: "Choose your course, semester, and subjects. Your syllabus becomes your study map.",
      pinColor: "#f97316",
      numColor: "text-orange-400",
      cardBg: "bg-orange-50",
      tilt: "-rotate-3",
      side: "left",
    },
    {
      num: "02",
      title: "Build your understanding",
      desc: "Practice by unit and save the questions you want to revisit.",
      pinColor: "#3b82f6",
      numColor: "text-blue-500",
      cardBg: "bg-blue-50",
      tilt: "rotate-3",
      side: "right",
    },
    {
      num: "03",
      title: "Walk in prepared",
      desc: "Track your progress, revise weak spots, and take a mock test before the real thing.",
      pinColor: "#a855f7",
      numColor: "text-purple-500",
      cardBg: "bg-purple-50",
      tilt: "-rotate-2",
      side: "left",
    },
  ];

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative px-6 py-28 md:px-12 lg:px-20 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #faf9f7 0%, #f5f3ef 100%)" }}
    >
      <div>
        <div className="mb-4 inline-flex items-center gap-2.5">
          <span className="h-[2px] w-6 rounded-full bg-amber-400" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
            Your Next Chapter
          </span>
        </div>
        <h2
          className="text-3xl font-bold tracking-tight text-black sm:text-4xl md:text-5xl lg:text-[3.25rem] leading-[1.12]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          From "Where do i start?" to "i'm
          <br/>
          <span className="text-black">ready."</span>
        </h2>
      </div>

      {/* ─── Notebook-style horizontal lines ─── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.12]">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="w-full border-b border-slate-400"
            style={{ height: "40px" }}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-4xl">

        {/* ─── Zigzag Path + Cards ─── */}
        <div className="relative">
          {/* Central vertical dashed connector */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-px border-l-2 border-dashed border-slate-300/60" />

          <div className="flex flex-col gap-16 md:gap-24">
            {steps.map((step, idx) => (
              <div
                key={step.num}
                className={`relative flex flex-col md:flex-row items-center transition-all duration-700 ease-out ${isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-14 opacity-0"
                  } ${step.side === "right"
                    ? "md:flex-row-reverse"
                    : ""
                  }`}
                style={{ transitionDelay: `${250 + idx * 200}ms` }}
              >
                {/* ─── Connector dot on the center line ─── */}
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 z-10 h-4 w-4 rounded-full bg-white border-2 border-slate-300 shadow-sm" />

                {/* ─── Horizontal arm from center to card ─── */}
                <div
                  className={`hidden md:block absolute top-1/2 -translate-y-1/2 h-px w-[calc(50%-140px)] border-t border-dashed border-slate-300/60 ${step.side === "left" ? "right-1/2 mr-2" : "left-1/2 ml-2"
                    }`}
                />

                {/* ─── Spacer for the other half ─── */}
                <div className="hidden md:block md:w-1/2" />

                {/* ─── Sticky Note Card ─── */}
                <div className="md:w-1/2 flex justify-center">
                  <div
                    className={`group relative max-w-xs w-full rounded-xl p-6 pb-7 shadow-xl transition-all duration-500 hover:scale-105 hover:shadow-2xl cursor-default ${step.cardBg} ${step.tilt}`}
                    style={{
                      boxShadow:
                        "4px 6px 18px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.06)",
                    }}
                  >
                    {/* ─── 3D Pushpin ─── */}
                    <div className="absolute -top-3.5 left-8 z-20">
                      {/* Pin shaft */}
                      <div
                        className="absolute top-[14px] left-1/2 -translate-x-1/2 w-[3px] h-[10px] rounded-b-full opacity-70"
                        style={{ backgroundColor: step.pinColor }}
                      />
                      {/* Pin head - outer */}
                      <div
                        className="relative h-7 w-7 rounded-full shadow-lg border-2 border-white/80 flex items-center justify-center"
                        style={{
                          backgroundColor: step.pinColor,
                          boxShadow: `0 3px 10px ${step.pinColor}55, 0 1px 3px rgba(0,0,0,0.15)`,
                        }}
                      >
                        {/* Pin head - highlight dot */}
                        <div
                          className="h-2.5 w-2.5 rounded-full"
                          style={{
                            background: `radial-gradient(circle at 35% 35%, rgba(255,255,255,0.85), ${step.pinColor})`,
                          }}
                        />
                      </div>
                    </div>

                    {/* ─── Step Number ─── */}
                    <p
                      className={`text-sm font-black ${step.numColor} mb-1`}
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {step.num}
                    </p>

                    {/* ─── Title ─── */}
                    <h3
                      className="text-lg font-bold text-slate-800 leading-snug"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {step.title}
                    </h3>

                    {/* ─── Description ─── */}
                    <p
                      className="mt-2.5 text-[13px] leading-relaxed text-slate-500"
                      style={{ fontFamily: "var(--font-sans)" }}
                    >
                      {step.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default How_it_work;
