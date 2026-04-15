"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Check,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  Calendar,
  User,
} from "lucide-react";

const B = "#FDB8D7";
const WEBHOOK_URL =
  "https://n8n.veltraai.net/webhook/Onboarding_Availability_form_submitted";

// ─── Dynamic dates for current month ─────────────────────────────────────────

function getCurrentMonthDates(): string[] {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const monthName = now.toLocaleString("en-GB", { month: "long" });
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const dates: string[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const dayName = date.toLocaleString("en-GB", { weekday: "long" });
    const suffix =
      d === 1 || d === 21 || d === 31
        ? "st"
        : d === 2 || d === 22
          ? "nd"
          : d === 3 || d === 23
            ? "rd"
            : "th";
    dates.push(`${dayName} ${d}${suffix} ${monthName}`);
  }
  return dates;
}

const CURRENT_MONTH = new Date().toLocaleString("en-GB", {
  month: "long",
  year: "numeric",
});
const DATES = getCurrentMonthDates();

const LOCATIONS = [
  "Nottingham",
  "Derby",
  "Newark",
  "Mansfield",
  "Leicester",
  "Nuneaton",
  "Loughborough",
  "Northampton",
  "Sheffield",
  "Birmingham",
  "Walsall",
  "Worthing/Brighton",
  "Plymouth",
  "Coventry",
  "Hull",
  "Exeter",
  "Stanmore (London)",
  "Camden (London)",
  "Greenwich (London)",
  "Aldgate (London)",
  "Edgware (London)",
  "Harlesden (London)",
  "Hounslow (London)",
  "Ealing (London)",
  "Bedford",
  "Portsmouth",
  "Southampton",
  "Winchester",
  "Hinckley",
  "Cheltenham",
  "Newport",
  "Maidstone",
  "Solihull",
  "Wolverhampton",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const onFocus = (
  e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
) => {
  e.currentTarget.style.boxShadow = `0 0 0 2px ${B}55`;
  e.currentTarget.style.borderColor = B;
};
const onBlur = (
  e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
) => {
  e.currentTarget.style.boxShadow = "";
  e.currentTarget.style.borderColor = "";
};

// ─── UI Primitives ────────────────────────────────────────────────────────────

function FieldLabel({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
      {children}
      {required && (
        <span
          style={{ color: B }}
          className="ml-0.5"
        >
          *
        </span>
      )}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
      <AlertCircle className="w-3 h-3 flex-shrink-0" /> {message}
    </p>
  );
}

function Input({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={onFocus}
      onBlur={onBlur}
      placeholder={placeholder}
      style={{ colorScheme: "dark" }}
      className="w-full px-3 py-2.5 border border-[#2a2a2a] rounded-xl text-sm
        bg-[#1a1a1a] text-white placeholder:text-gray-600 focus:outline-none transition-all"
    />
  );
}

function Textarea({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={onFocus}
      onBlur={onBlur}
      rows={rows}
      placeholder={placeholder}
      className="w-full px-3 py-2.5 border border-[#2a2a2a] rounded-xl text-sm
        bg-[#1a1a1a] text-white placeholder:text-gray-600 focus:outline-none resize-none transition-all"
    />
  );
}

function CheckItem({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      style={checked ? { borderColor: B, backgroundColor: `${B}12` } : {}}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all ${
        checked ? "" : "border-[#2a2a2a] bg-[#1a1a1a] hover:border-[#FDB8D7]/30"
      }`}
    >
      <div
        style={checked ? { backgroundColor: B, borderColor: B } : {}}
        className={`w-4 h-4 rounded flex-shrink-0 border-2 flex items-center justify-center transition-all ${
          checked ? "" : "border-[#444]"
        }`}
      >
        {checked && (
          <Check
            className="w-2.5 h-2.5 text-[#1a0a10]"
            strokeWidth={3}
          />
        )}
      </div>
      <p
        className={`text-sm ${checked ? "text-white font-medium" : "text-gray-400"}`}
      >
        {label}
      </p>
    </button>
  );
}

// ─── Success ──────────────────────────────────────────────────────────────────

function SuccessScreen() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="bg-[#111111] border border-[#1f1f1f] rounded-3xl p-10 max-w-sm w-full text-center">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{ backgroundColor: `${B}20`, border: `2px solid ${B}` }}
        >
          <Check
            className="w-7 h-7"
            style={{ color: B }}
            strokeWidth={2.5}
          />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">All Done!</h2>
        <p className="text-gray-400 text-sm leading-relaxed">
          We&apos;ve received your details. We&apos;ll be in touch shortly with
          next steps.
        </p>
      </div>
    </div>
  );
}

// ─── Main Form ────────────────────────────────────────────────────────────────

function OnboardingForm() {
  const searchParams = useSearchParams();
  const candidateId = searchParams.get("id") ?? "";

  const [tab, setTab] = useState<"onboarding" | "availability">("onboarding");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Tab 1
  const [homeAddress, setHomeAddress] = useState("");
  const [emergencyName, setEmergencyName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  // Tab 2
  const [unavailableAll, setUnavailableAll] = useState(false);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [comments, setComments] = useState("");

  function toggleDate(d: string) {
    setSelectedDates((p) =>
      p.includes(d) ? p.filter((x) => x !== d) : [...p, d],
    );
  }
  function toggleLocation(l: string) {
    setSelectedLocations((p) =>
      p.includes(l) ? p.filter((x) => x !== l) : [...p, l],
    );
  }

  function handleNext() {
    const e: Record<string, string> = {};
    if (!homeAddress.trim()) e.homeAddress = "Required";
    if (!emergencyName.trim()) e.emergencyName = "Required";
    if (!accountNumber.trim()) e.accountNumber = "Required";
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    setErrors({});
    setTab("availability");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit() {
    const e: Record<string, string> = {};
    if (!unavailableAll && selectedDates.length === 0)
      e.dates = "Select at least one date or mark unavailable all month";
    if (selectedLocations.length === 0)
      e.locations = "Select at least one location";
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    setErrors({});
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidate_id: candidateId,
          onboarding: {
            home_address: homeAddress,
            emergency_contact: emergencyName,
            bank_details: accountNumber,
          },
          availability: {
            month: CURRENT_MONTH,
            unavailable_all_month: unavailableAll,
            dates: unavailableAll ? [] : selectedDates,
            locations: selectedLocations,
            comments,
          },
        }),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) return <SuccessScreen />;

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-5 bg-[#111111] border border-[#1f1f1f] rounded-2xl p-1.5">
          {(["onboarding", "availability"] as const).map((t) => (
            <button
              key={t}
              onClick={() => t === "onboarding" && setTab("onboarding")}
              style={tab === t ? { backgroundColor: B, color: "#1a0a10" } : {}}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
                tab === t ? "" : "text-gray-500"
              } ${t === "availability" && tab === "onboarding" ? "opacity-40 cursor-not-allowed" : ""}`}
            >
              {t === "onboarding" ? (
                <>
                  <User className="w-4 h-4" /> Onboarding
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4" /> Availability
                </>
              )}
              {t === "onboarding" && tab === "availability" && (
                <Check
                  className="w-3.5 h-3.5"
                  strokeWidth={3}
                />
              )}
            </button>
          ))}
        </div>

        {/* Card */}
        <div className="bg-[#111111] border border-[#1f1f1f] rounded-3xl overflow-hidden shadow-2xl">
          {/* Header */}
          <div
            className="px-6 py-5"
            style={{ background: "linear-gradient(135deg, #2a0d1c, #3d1228)" }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-0.5"
              style={{ color: `${B}80` }}
            >
              {tab === "onboarding" ? "Step 1 of 2" : "Step 2 of 2"}
            </p>
            <h2
              className="text-xl font-bold"
              style={{ color: B }}
            >
              {tab === "onboarding"
                ? "Your Details"
                : `${CURRENT_MONTH} Availability`}
            </h2>
          </div>

          <div className="px-6 py-6 space-y-5">
            {/* ── Tab 1 ── */}
            {tab === "onboarding" && (
              <>
                <div>
                  <FieldLabel required>Home Address</FieldLabel>
                  <Textarea
                    value={homeAddress}
                    onChange={setHomeAddress}
                    placeholder="123 Example Street, City, Postcode"
                  />
                  <FieldError message={errors.homeAddress} />
                </div>

                <div>
                  <FieldLabel required>Emergency Contact Name</FieldLabel>
                  <Input
                    value={emergencyName}
                    onChange={setEmergencyName}
                    placeholder="Jane Smith"
                  />
                  <FieldError message={errors.emergencyName} />
                </div>

                <div>
                  <FieldLabel required>Bank Account Number</FieldLabel>
                  <Input
                    value={accountNumber}
                    onChange={setAccountNumber}
                    placeholder="12345678"
                    type="number"
                  />
                  <FieldError message={errors.accountNumber} />
                </div>
              </>
            )}

            {/* ── Tab 2 ── */}
            {tab === "availability" && (
              <>
                <div>
                  <FieldLabel required>Dates Available</FieldLabel>
                  <FieldError message={errors.dates} />
                  <div className="space-y-1.5 mt-2">
                    <CheckItem
                      checked={unavailableAll}
                      onChange={(v) => {
                        setUnavailableAll(v);
                        if (v) setSelectedDates([]);
                      }}
                      label="Unavailable All Month"
                    />
                    {!unavailableAll &&
                      DATES.map((d) => (
                        <CheckItem
                          key={d}
                          checked={selectedDates.includes(d)}
                          onChange={() => toggleDate(d)}
                          label={d}
                        />
                      ))}
                  </div>
                </div>

                <div>
                  <FieldLabel required>Locations Available</FieldLabel>
                  <FieldError message={errors.locations} />
                  <div className="space-y-1.5 mt-2">
                    {LOCATIONS.map((l) => (
                      <CheckItem
                        key={l}
                        checked={selectedLocations.includes(l)}
                        onChange={() => toggleLocation(l)}
                        label={l}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <FieldLabel>Comments</FieldLabel>
                  <Textarea
                    value={comments}
                    onChange={setComments}
                    placeholder="Anything else we should know…"
                  />
                </div>

                {submitError && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <p className="text-sm text-red-400">{submitError}</p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-[#1a1a1a] flex justify-between items-center">
            {tab === "availability" ? (
              <button
                onClick={() => {
                  setTab("onboarding");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border border-[#2a2a2a] text-gray-400 bg-[#141414] hover:border-[#FDB8D7]/50 hover:text-gray-200 transition-all"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            ) : (
              <div />
            )}

            {tab === "onboarding" ? (
              <button
                onClick={handleNext}
                style={{
                  background: `linear-gradient(135deg, ${B}, #e89fbe)`,
                  color: "#1a0a10",
                }}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg hover:opacity-90 transition-all"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                style={{
                  background: `linear-gradient(135deg, ${B}, #e89fbe)`,
                  color: "#1a0a10",
                }}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg disabled:opacity-50 hover:opacity-90 transition-all"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#1a0a10]/30 border-t-[#1a0a10] rounded-full animate-spin" />{" "}
                    Submitting…
                  </>
                ) : (
                  <>
                    Submit{" "}
                    <Check
                      className="w-4 h-4"
                      strokeWidth={3}
                    />
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-gray-700 mt-4 pb-4">
          Your information is handled securely.
        </p>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#FDB8D7]/30 border-t-[#FDB8D7] rounded-full animate-spin" />
        </div>
      }
    >
      <OnboardingForm />
    </Suspense>
  );
}
