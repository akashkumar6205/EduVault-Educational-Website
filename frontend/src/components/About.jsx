import { useState, useRef, useEffect } from "react";
import libraryBg from "../assets/library-bg.jpg";

function About() {
    const [openFaq, setOpenFaq] = useState(0); // 0 is open by default as in reference image
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

    const faqs = [
        {
            question: "Is UnitWise free to use?",
            answer:
                "Yes. You can explore subjects, try selected questions, and view sample model answers for free. Upgrade only when you want full access to your study toolkit.",
        },
        {
            question: "Does it match my university syllabus?",
            answer:
                "Yes, absolutely. UnitWise aligns directly with official university curriculums and organizes content by semester, subject, and unit so you focus solely on what matters for your examinations.",
        },
        {
            question: "Can I try it without creating an account?",
            answer:
                "Yes. You can preview unit-wise notes, explore past year paper trends, and review sample answers in guest mode without needing to register or enter credentials.",
        },
        {
            question: "How are model answers prepared?",
            answer:
                "All model answers are formulated by experienced educators and top rankers following standard university marking schemes, complete with step-by-step logic, diagrams, and key definitions.",
        },
    ];

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <div id="about" ref={sectionRef} className="w-full bg-[#0d0c0b] text-slate-200">
            {/* ─────────────────────────────────────────────────────────────
          SECTION 1: FAQ / "A Little Clarity"
         ───────────────────────────────────────────────────────────── */}
            <section className="relative px-6 py-24 md:px-12 lg:px-20 border-t border-white/[0.06] overflow-hidden">
                {/* Subtle ambient lighting */}
                <div className="pointer-events-none absolute -top-40 right-1/4 h-[350px] w-[500px] rounded-full bg-amber-500/[0.03] blur-3xl" />
                <div className="pointer-events-none absolute bottom-0 left-10 h-[300px] w-[400px] rounded-full bg-amber-600/[0.02] blur-3xl" />

                <div
                    className={`mx-auto max-w-7xl grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16 transition-all duration-1000 ease-out ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                        }`}
                >
                    {/* Left Column: Heading & Contact Note */}
                    <div className="lg:col-span-5 flex flex-col justify-between">
                        <div>
                            {/* Eyebrow tag */}
                            <div className="mb-4 inline-flex items-center gap-2.5">
                                <span className="h-[2px] w-6 rounded-full bg-[#d4a03d]" />
                                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#d4a03d]">
                                    A Little Clarity
                                </span>
                            </div>

                            {/* Main Heading */}
                            <h2
                                className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-[3.25rem] leading-[1.12]"
                                style={{ fontFamily: "var(--font-display)" }}
                            >
                                Good questions.
                                <br />
                                Clear answers.
                            </h2>
                        </div>

                        {/* Still curious note */}
                        <div className="mt-8 lg:mt-16 text-sm text-zinc-400 leading-relaxed font-normal">
                            <p>Still curious about something?</p>
                            <p>
                                We&apos;re at{" "}
                                <a
                                    href="mailto:hello@unitwise.in"
                                    className="text-zinc-300 hover:text-amber-400 transition-colors underline decoration-zinc-700 hover:decoration-amber-400"
                                >
                                    hello@unitwise.in
                                </a>
                                .
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Accordion */}
                    <div className="lg:col-span-7">
                        <div className="border-t border-white/[0.12]">
                            {faqs.map((faq, index) => {
                                const isOpen = openFaq === index;
                                return (
                                    <div
                                        key={faq.question}
                                        className="border-b border-white/[0.12] transition-colors"
                                    >
                                        <button
                                            onClick={() => toggleFaq(index)}
                                            className="w-full py-6 flex items-center justify-between text-left group gap-4 transition-colors"
                                            aria-expanded={isOpen}
                                        >
                                            <span
                                                className="text-base sm:text-lg font-medium text-zinc-100 group-hover:text-amber-300 transition-colors"
                                                style={{ fontFamily: "var(--font-sans)" }}
                                            >
                                                {faq.question}
                                            </span>
                                            <span className="flex-shrink-0 text-xl font-light text-[#d4a03d] transition-transform duration-200">
                                                {isOpen ? "−" : "+"}
                                            </span>
                                        </button>

                                        <div
                                            className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-56 pb-6 opacity-100" : "max-h-0 pb-0 opacity-0"
                                                }`}
                                        >
                                            <p
                                                className="text-sm sm:text-[15px] leading-relaxed text-zinc-400 pr-8"
                                                style={{ fontFamily: "var(--font-sans)" }}
                                            >
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* ─────────────────────────────────────────────────────────────
          SECTION 2: CTA Banner with Library Background
         ───────────────────────────────────────────────────────────── */}
            <section className="relative px-6 py-28 md:py-36 md:px-12 lg:px-20 overflow-hidden flex items-center justify-center text-center">
                {/* Background Image Layer */}
                <div className="absolute inset-0">
                    <img
                        src={libraryBg}
                        alt="Library background"
                        className="h-full w-full object-cover object-center brightness-90 contrast-[1.05]"
                    />
                    {/* Subtle dark tint to maintain contrast while keeping the library scenery clearly visible */}
                    <div className="absolute inset-0 bg-black/45" />
                    {/* Smooth top and bottom edge blend into neighboring sections */}
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0d0c0b] via-transparent to-[#0c0b0a] opacity-90" />
                </div>

                {/* Content */}
                <div className="relative z-10 mx-auto max-w-3xl">
                    {/* Eyebrow tag */}
                    <div className="mb-5 inline-flex items-center gap-2.5 justify-center">
                        <span className="h-[2px] w-6 rounded-full bg-[#d4a03d]" />
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#d4a03d]">
                            Your Future is Worth the Focus
                        </span>
                    </div>

                    {/* Heading */}
                    <h2
                        className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl leading-[1.12]"
                        style={{ fontFamily: "var(--font-display)" }}
                    >
                        The next chapter starts
                        <br />
                        with one unit.
                    </h2>

                    {/* Subtitle */}
                    <p
                        className="mt-6 text-sm sm:text-base md:text-lg leading-relaxed text-zinc-300/85 max-w-xl mx-auto"
                        style={{ fontFamily: "var(--font-sans)" }}
                    >
                        Bring your ambition. We&apos;ll bring the structure. Let&apos;s make this semester count.
                    </p>

                    {/* Buttons */}
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                        <a
                            href="#signup"
                            className="group inline-flex items-center gap-2 rounded-lg bg-[#d4a03d] px-6 py-3.5 text-sm sm:text-base font-semibold text-[#181510] shadow-lg shadow-amber-900/20 transition-all duration-300 hover:bg-[#e0aa42] hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <span>Start Preparing Free</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </a>

                        <a
                            href="#guest"
                            className="inline-flex items-center rounded-lg border border-white/20 bg-black/40 px-6 py-3.5 text-sm sm:text-base font-medium text-slate-200 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-white/30 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Explore as Guest
                        </a>
                    </div>
                </div>
            </section>

            {/* ─────────────────────────────────────────────────────────────
          SECTION 3: Footer (Clean Horizontal Bar)
         ───────────────────────────────────────────────────────────── */}
            <footer className="relative w-full bg-white border-t border-slate-200 px-6 py-8 md:px-12 lg:px-20 text-slate-700">
                <div className="mx-auto flex flex-col md:flex-row items-center justify-between gap-6 max-w-7xl">
                    {/* Brand + Version Badge */}
                    <div className="flex items-center gap-3">
                        <span className="text-xl font-black tracking-tight text-slate-900" style={{ fontFamily: "var(--font-display)" }}>
                            Edu<span className="text-amber-400">Vault</span>
                        </span>
                        <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500 border border-slate-200/70">
                            v1.0
                        </span>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
                        {[
                            { name: "Home", href: "#home" },
                            { name: "Features", href: "#features" },
                            { name: "How It Works", href: "#how-it-works" },
                            { name: "About", href: "#about" },
                            { name: "Privacy", href: "#privacy" },
                            { name: "Contact", href: "#contact" },
                        ].map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
                                style={{ fontFamily: "var(--font-sans)" }}
                            >
                                {link.name}
                            </a>
                        ))}
                    </nav>

                    {/* Right Section: Copyright & Back to Top Button */}
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="text-sm text-slate-400" style={{ fontFamily: "var(--font-sans)" }}>
                            © 2026 EduVault. All rights reserved.
                        </div>

                        {/* Back to Top Button on the bottom right of the footer */}
                        <button
                            onClick={scrollToTop}
                            className="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-xs transition-all duration-300 hover:bg-[#d4a03d] hover:border-[#d4a03d] hover:text-gray-900 hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                            title="Back to Top"
                            aria-label="Back to top"
                        >
                            <span>Back to Top</span>
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200/80 group-hover:bg-black/10 transition-colors">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-3 w-3 transition-transform duration-300 group-hover:-translate-y-0.5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                </svg>
                            </span>
                        </button>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default About;
