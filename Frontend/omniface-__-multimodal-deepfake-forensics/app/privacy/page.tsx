
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Privacy Policy | OmniFace",
    description:
        "Learn how OmniFace handles uploaded media, forensic analysis, personal information, and data privacy.",
    alternates: {
        canonical: "/privacy",
    },
};

const sections = [
    {
        title: "01. Information We Process",
        content:
            "OmniFace may process account details, uploaded images, videos, audio files, analysis results, and technical information needed to operate the service. The information processed depends on the features you use.",
    },
    {
        title: "02. Media and Biometric Information",
        content:
            "Uploaded media may contain identifiable faces, voices, and other sensitive information. Depending on the analysis features actually enabled, processing may involve facial crops, audio features, visual signals, or optical remote photoplethysmography (rPPG).",
    },
    {
        title: "03. Purpose of Processing",
        content:
            "Information may be used to perform media authenticity analysis, generate forensic assessments, maintain account functionality, protect the service, and troubleshoot technical problems.",
    },
    {
        title: "04. Data Storage and Retention",
        content:
            "Uploaded media and analysis results may be stored by the infrastructure providers used by OmniFace. The storage locations, retention periods, deletion procedures, and backup practices must be confirmed against the actual deployed system before this policy is published.",
    },
    {
        title: "05. Security Measures",
        content:
            "OmniFace should use appropriate access controls, secure network connections, and protected storage to safeguard information. Security measures should be described accurately and must not be claimed unless they have actually been implemented.",
    },
    {
        title: "06. Third-Party Services",
        content:
            "OmniFace may depend on third-party services for authentication, hosting, file storage, or media processing. The production policy should identify the providers involved and explain what information they process.",
    },
    {
        title: "07. Data Deletion and Privacy Rights",
        content:
            "Depending on applicable law, users may have rights to access, correct, or request deletion of their personal information. The available request process, response timelines, and applicable exceptions must be confirmed before publication.",
    },
    {
        title: "08. AI Forensic Assessment Disclaimer",
        content:
            "Automated deepfake detection is probabilistic and may produce false positives or false negatives. OmniFace results should be considered supporting forensic information rather than conclusive proof of authenticity, manipulation, identity, or intent.",
    },
    {
        title: "09. Policy Changes and Contact",
        content:
            "This policy should be updated when material changes are made to data processing practices. Add a verified privacy contact and the actual effective date before making the policy publicly available.",
    },
];

export default function PrivacyPage() {
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
                        OmniFace / Trust & Security
                    </p>

                    <h1 className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-6xl">
                        Privacy Policy
                    </h1>

                    <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
                        Transparency matters. Learn how information and media
                        may be processed when you use our forensic analysis platform.
                    </p>

                    <p className="mt-4 text-xs text-slate-500">
                        Effective date: Pending publication
                    </p>
                </header>

                <section className="mt-8 rounded-xl border border-cyan-400/20 bg-cyan-400/[0.04] p-5 sm:p-6">
                    <h2 className="font-semibold text-white">
                        Your privacy matters
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                        Media submitted for forensic analysis may contain sensitive
                        personal information. Review this policy before uploading
                        content.
                    </p>
                </section>

                <nav
                    aria-label="Privacy policy sections"
                    className="mt-8 rounded-xl border border-white/10 p-5 sm:p-6"
                >
                    <h2 className="font-semibold text-white">
                        In this policy
                    </h2>
                    <ol className="mt-4 grid gap-3 sm:grid-cols-2">
                        {sections.map((section) => (
                            <li key={section.title}>
                                <a
                                    href={`#section-${section.title.slice(0, 2)}`}
                                    className="text-sm text-slate-400 transition hover:text-cyan-300"
                                >
                                    {section.title}
                                </a>
                            </li>
                        ))}
                    </ol>
                </nav>

                <div className="mt-8 space-y-5">
                    {sections.map((section) => (
                        <section
                            key={section.title}
                            id={`section-${section.title.slice(0, 2)}`}
                            className="scroll-mt-8 rounded-xl border border-white/10 bg-white/[0.02] p-5 sm:p-7"
                        >
                            <h2 className="text-lg font-semibold text-cyan-300 sm:text-xl">
                                {section.title}
                            </h2>
                            <p className="mt-3 text-sm leading-7 text-slate-400 sm:text-base">
                                {section.content}
                            </p>
                        </section>
                    ))}
                </div>

                <footer className="mt-12 border-t border-white/10 pt-6">
                    <p className="text-xs leading-6 text-slate-500">
                        OmniFace / Privacy, Transparency & Responsible Forensics
                    </p>
                    <Link
                        href="/"
                        className="mt-3 inline-block text-sm text-cyan-400 hover:text-cyan-300"
                    >
                        Return to homepage
                    </Link>
                </footer>
            </div>
        </main>
    );
}
