
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Terms of Service | OmniFace",
    description:
        "Review the terms, acceptable use rules, AI forensic limitations, and service conditions for OmniFace.",
    alternates: {
        canonical: "/terms",
    },
};

const sections = [
    {
        id: "01",
        title: "Acceptance of Terms",
        content:
            "These Terms of Service govern your access to and use of OmniFace. By using the service, you agree to follow these terms and applicable laws. If you do not agree, discontinue use of the service.",
    },
    {
        id: "02",
        title: "Permitted Forensic Use",
        content:
            "OmniFace is intended to support responsible media authenticity research, deepfake detection, digital forensics, education, and other lawful analysis. You must have the necessary rights and permissions to upload and analyze any media you submit.",
    },
    {
        id: "03",
        title: "Prohibited Activities",
        content:
            "You must not use OmniFace to create or facilitate unauthorized deepfakes, impersonation, fraud, harassment, non-consensual intimate imagery, malicious reconnaissance, unlawful surveillance, or other harmful or illegal activities. You must not attempt to bypass security controls, abuse endpoints, or disrupt the service.",
    },
    {
        id: "04",
        title: "Media and User Responsibilities",
        content:
            "You are responsible for the files you upload and how you use the results. Do not upload material unlawfully obtained or material you are not authorized to process. You must respect privacy, intellectual property, consent requirements, and applicable data protection laws.",
    },
    {
        id: "05",
        title: "AI Detection Limitations",
        content:
            "OmniFace uses automated forensic analysis that may produce false positives, false negatives, or inconclusive results. Detection accuracy may vary with media quality, compression, transformations, model limitations, and other factors. Results are supporting forensic information, not conclusive proof of authenticity, manipulation, identity, or intent. Important decisions should involve independent verification and qualified human review.",
    },
    {
        id: "06",
        title: "Service Availability and Limitations",
        content:
            "The service may be modified, interrupted, rate-limited, or temporarily unavailable for maintenance, security, capacity, or operational reasons. Unless explicitly stated in a separate written agreement, no guaranteed uptime or uninterrupted availability is promised.",
    },
    {
        id: "07",
        title: "API Usage and Quotas",
        content:
            "API access, where available, is subject to the limits, file-size restrictions, request quotas, and usage rules published for the applicable account or endpoint. Do not evade rate limits or use multiple accounts to bypass restrictions. The actual quotas and enforcement rules depend on the deployed configuration and applicable plan.",
    },
    {
        id: "08",
        title: "Intellectual Property",
        content:
            "You retain any rights you already hold in the content you upload, subject to applicable law and third-party rights. You authorize only the processing reasonably necessary to provide the features you request. OmniFace branding, software, and other platform materials remain subject to their applicable ownership and licensing terms.",
    },
    {
        id: "09",
        title: "Suspension and Termination",
        content:
            "Access may be restricted or terminated where permitted by law if these terms are violated, the service is abused, or continued access creates a security or legal risk. Any operational enforcement mechanisms must be implemented and applied consistently with applicable law.",
    },
    {
        id: "10",
        title: "Disclaimers and Liability",
        content:
            "To the extent permitted by applicable law, the service is provided without a guarantee that every analysis will be accurate, complete, or suitable for a particular purpose. Nothing in these terms excludes liability or consumer rights that cannot legally be excluded. Applicable liability limits must be reviewed for the governing jurisdiction before publication.",
    },
    {
        id: "11",
        title: "Changes and Contact",
        content:
            "These terms may be updated when the service or its requirements change. Material changes should be reflected in an updated version with an effective date. Add a verified operator contact and any applicable governing-law details before publishing the final terms.",
    },
];

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-[#06080D] text-slate-200">
            <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-20">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm text-cyan-400 transition hover:text-cyan-300"
                >
                    <span aria-hidden="true">←</span>
                    Back to OmniFace
                </Link>

                <header className="mt-10 border-b border-cyan-400/20 pb-10">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400 sm:text-sm">
                        OmniFace / Legal & Responsible Use
                    </p>

                    <h1 className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-6xl">
                        Terms of Service
                    </h1>

                    <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
                        Rules for responsible use of the OmniFace multimodal
                        deepfake forensics and media analysis platform.
                    </p>

                    <p className="mt-4 text-xs text-slate-500">
                        Effective date: Pending publication
                    </p>
                </header>

                <section className="mt-8 rounded-xl border border-cyan-400/20 bg-cyan-400/[0.04] p-5 sm:p-6">
                    <h2 className="font-semibold text-white">
                        Use forensic AI responsibly
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                        Submit only content you are authorized to process.
                        Automated detection results require careful interpretation
                        and may need independent verification.
                    </p>
                </section>

                <nav
                    aria-label="Terms of service sections"
                    className="mt-8 rounded-xl border border-white/10 p-5 sm:p-6"
                >
                    <h2 className="font-semibold text-white">In these terms</h2>
                    <ol className="mt-4 grid gap-3 sm:grid-cols-2">
                        {sections.map((section) => (
                            <li key={section.id}>
                                <a
                                    href={`#section-${section.id}`}
                                    className="text-sm text-slate-400 transition hover:text-cyan-300"
                                >
                                    {section.id}. {section.title}
                                </a>
                            </li>
                        ))}
                    </ol>
                </nav>

                <div className="mt-8 space-y-5">
                    {sections.map((section) => (
                        <section
                            key={section.id}
                            id={`section-${section.id}`}
                            className="scroll-mt-8 rounded-xl border border-white/10 bg-white/[0.02] p-5 sm:p-7"
                        >
                            <h2 className="text-lg font-semibold text-cyan-300 sm:text-xl">
                                {section.id}. {section.title}
                            </h2>
                            <p className="mt-3 text-sm leading-7 text-slate-400 sm:text-base">
                                {section.content}
                            </p>
                        </section>
                    ))}
                </div>

                <footer className="mt-12 border-t border-white/10 pt-6">
                    <p className="text-xs leading-6 text-slate-500">
                        OmniFace / Responsible AI & Forensic Analysis
                    </p>
                    <div className="mt-3 flex flex-wrap gap-4 text-sm">
                        <Link
                            href="/privacy"
                            className="text-cyan-400 hover:text-cyan-300"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            href="/"
                            className="text-cyan-400 hover:text-cyan-300"
                        >
                            Return to homepage
                        </Link>
                    </div>
                </footer>
            </div>
        </main>
    );
}
