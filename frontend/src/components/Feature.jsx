import { useEffect, useRef, useState } from "react";

function Feature() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      id: "unit",
      title: "One unit at a time.",
      description:
        "Find exactly what you need in a syllabus-aligned question bank, organised by subject and unit.",
      highlight: "Your syllabus, beautifully structured",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6"
        >
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      ),
    },
    {
      id: "focus",
      title: "Know what matters.",
      description:
        "Spot recurring exam themes and prioritise high-yield questions when study time is limited.",
      highlight: "Make every study session count",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6"
        >
          <path d="M12 3v18" />
          <path d="M3 12h18" />
          <path d="M7.5 7.5l9 9" />
          <path d="M16.5 7.5l-9 9" />
        </svg>
      ),
    },
    {
      id: "answers",
      title: "Answers that teach.",
      description:
        "Go beyond memorising with clear model answers, key concepts, and step-by-step explanations.",
      highlight: "Understand it. Then remember it.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      ),
    },
  ];

  return (
    <section
      id="features"
      ref={sectionRef}
      className="relative bg-[#0d0d0d] px-6 py-28 text-white md:px-12 lg:px-20 border-t border-white/[0.06] overflow-hidden"
    >
      {/* Subtle ambient lighting */}
      <div className="pointer-events-none absolute left-1/4 top-0 -translate-x-1/2 -translate-y-1/2 h-[380px] w-[500px] rounded-full bg-amber-500/[0.04] blur-3xl" />
      <div className="pointer-events-none absolute right-1/4 bottom-0 translate-x-1/2 translate-y-1/2 h-[380px] w-[500px] rounded-full bg-amber-500/[0.03] blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        {/* ─── Header: Tag + Split Layout ─── */}
        <div
          className={`flex flex-col gap-6 md:flex-row md:items-end md:justify-between transition-all duration-1000 ease-out ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div>
            <div className="mb-4 inline-flex items-center gap-2.5">
              <span className="h-[2px] w-6 rounded-full bg-amber-400" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
                A Little More Focused
              </span>
            </div>

            <h2
              className="text-3xl font-extrabold tracking-tight text-slate-100 sm:text-4xl md:text-5xl lg:text-[3.25rem] leading-[1.12]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Everything you need.
              <br />
              <span className="text-slate-200">Nothing in your way.</span>
            </h2>
          </div>

          <p
            className="max-w-md text-base leading-relaxed text-slate-400 md:text-lg pb-1"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Turn scattered notes and endless question banks into a clear path
            from your first unit to your final revision.
          </p>
        </div>

        {/* ─── 3 Feature Cards (Reference Image 1) ─── */}
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {features.map((feature, idx) => (
            <div
              key={feature.id}
              className={`group relative flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#141414]/90 p-8 backdrop-blur-sm transition-all duration-700 ease-out hover:-translate-y-1.5 hover:border-amber-400/30 hover:bg-[#181818] hover:shadow-2xl hover:shadow-amber-500/[0.06] ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-12 opacity-0"
              }`}
              style={{ transitionDelay: `${200 + idx * 150}ms` }}
            >
              <div>
                {/* Amber Icon Badge */}
                <div className="mb-8 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-amber-400/20 bg-amber-500/10 text-amber-400 transition-colors duration-300 group-hover:border-amber-400/40 group-hover:bg-amber-500/15 group-hover:text-amber-300">
                  {feature.icon}
                </div>

                {/* Title */}
                <h3
                  className="text-xl font-bold text-slate-100 sm:text-2xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {feature.title}
                </h3>

                {/* Description */}
                <p
                  className="mt-4 text-sm leading-relaxed text-slate-400"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  {feature.description}
                </p>
              </div>

              {/* Bottom Checked Highlight */}
              <div className="mt-8 pt-5 border-t border-white/[0.06] flex items-center gap-2 text-xs font-medium text-amber-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 shrink-0 text-amber-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{feature.highlight}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Feature;
