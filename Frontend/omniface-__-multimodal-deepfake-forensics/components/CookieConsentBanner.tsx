
"use client";

import { useEffect, useState } from "react";

type ConsentPreferences = {
    essential: true;
    analytics: boolean;
    updatedAt: string;
};

const STORAGE_KEY = "omniface_cookie_consent";

function saveConsent(analytics: boolean): ConsentPreferences {
    const preferences: ConsentPreferences = {
        essential: true,
        analytics,
        updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));

    return preferences;
}

export default function CookieConsentBanner() {
    const [visible, setVisible] = useState(false);
    const [customizing, setCustomizing] = useState(false);
    const [analytics, setAnalytics] = useState(false);

    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);

            if (!stored) {
                setVisible(true);
                return;
            }

            const parsed = JSON.parse(stored);

            if (
                parsed?.essential === true &&
                typeof parsed?.analytics === "boolean"
            ) {
                setAnalytics(parsed.analytics);
                setVisible(false);
            } else {
                setVisible(true);
            }
        } catch {
            setVisible(true);
        }
    }, []);

    function chooseConsent(allowAnalytics: boolean) {
        try {
            saveConsent(allowAnalytics);
            setAnalytics(allowAnalytics);
            setVisible(false);
            setCustomizing(false);

            // Analytics initialization will be connected separately.
            // Do not initialize analytics before consent is granted.
        } catch (error) {
            console.error("Unable to save cookie preferences:", error);
        }
    }

    if (!visible) return null;

    return (
        <aside
            role="dialog"
            aria-modal="false"
            aria-labelledby="cookie-title"
            aria-describedby="cookie-description"
            className="fixed inset-x-3 bottom-3 z-[100] mx-auto max-w-4xl rounded-2xl border border-cyan-400/30 bg-[#080D16]/95 p-5 text-slate-200 shadow-[0_0_40px_rgba(34,211,238,0.12)] backdrop-blur-xl sm:inset-x-6 sm:bottom-6 sm:p-7"
        >
            <div className="flex flex-col gap-5">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
                        OmniFace / Privacy Controls
                    </p>

                    <h2
                        id="cookie-title"
                        className="mt-2 text-xl font-bold text-white sm:text-2xl"
                    >
                        Your privacy. Your choice.
                    </h2>

                    <p
                        id="cookie-description"
                        className="mt-2 max-w-3xl text-sm leading-6 text-slate-400"
                    >
                        Essential storage supports core website functionality.
                        With your permission, analytics may help us understand
                        how the platform is used. You can reject or customize
                        non-essential analytics preferences.
                    </p>

                    <p className="mt-2 text-xs text-slate-500">
                        Read our{" "}
                        <a
                            href="/privacy"
                            className="text-cyan-400 underline underline-offset-4 hover:text-cyan-300"
                        >
                            Privacy Policy
                        </a>
                        {" "}for more information.
                    </p>
                </div>

                {customizing && (
                    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h3 className="font-semibold text-white">
                                    Essential storage
                                </h3>
                                <p className="mt-1 text-sm text-slate-400">
                                    Required for core functionality and cannot be
                                    disabled through this control.
                                </p>
                            </div>

                            <input
                                type="checkbox"
                                checked
                                disabled
                                aria-label="Essential storage always enabled"
                                className="mt-1 accent-cyan-400"
                            />
                        </div>

                        <div className="mt-4 flex items-start justify-between gap-4">
                            <div>
                                <h3 className="font-semibold text-white">
                                    Analytics
                                </h3>
                                <p className="mt-1 text-sm text-slate-400">
                                    Allow analytics technologies to measure product
                                    usage, subject to the configured analytics service.
                                </p>
                            </div>

                            <input
                                type="checkbox"
                                checked={analytics}
                                onChange={(event) => setAnalytics(event.target.checked)}
                                aria-label="Allow analytics"
                                className="mt-1 accent-cyan-400"
                            />
                        </div>
                    </div>
                )}

                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                    <button
                        type="button"
                        onClick={() => chooseConsent(true)}
                        className="rounded-lg bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
                    >
                        Accept All
                    </button>

                    <button
                        type="button"
                        onClick={() => chooseConsent(false)}
                        className="rounded-lg border border-white/15 px-5 py-3 text-sm font-medium text-white transition hover:border-cyan-400/50 hover:bg-white/5"
                    >
                        Reject Non-Essential
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            if (customizing) {
                                chooseConsent(analytics);
                            } else {
                                setCustomizing(true);
                            }
                        }}
                        className="rounded-lg px-4 py-3 text-sm font-medium text-cyan-300 transition hover:bg-cyan-400/10"
                    >
                        {customizing ? "Save Preferences" : "Customize"}
                    </button>
                </div>
            </div>
        </aside>
    );
}
