"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Check,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  AlertCircle,
  Calendar,
  User,
  Package,
  Smartphone,
  ExternalLink,
} from "lucide-react";
import { T, PALETTE } from "@/styles/theme";

const WEBHOOK_URL =
  "https://n8n.veltraai.net/webhook/Onboarding_Availability_form_submitted";

// ─── TYPES ────────────────────────────────────────────────────────────────────

interface FieldProps {
  children: React.ReactNode;
  required?: boolean;
}

interface InputProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}

interface CheckItemProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}

interface MonthSectionProps {
  label: string;
  dates: string[];
  selectedDates: string[];
  onToggle: (d: string) => void;
  defaultOpen?: boolean;
}

// ─── DYNAMIC DATES ────────────────────────────────────────────────────────────

function getOrdinalSuffix(d: number) {
  if (d === 1 || d === 21 || d === 31) return "st";
  if (d === 2 || d === 22) return "nd";
  if (d === 3 || d === 23) return "rd";
  return "th";
}

function buildDates(year: number, month: number, fromDay = 1): string[] {
  const monthName = new Date(year, month, 1).toLocaleString("en-GB", {
    month: "long",
  });
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const dates: string[] = [];
  for (let d = fromDay; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const dayName = date.toLocaleString("en-GB", { weekday: "long" });
    dates.push(`${dayName} ${d}${getOrdinalSuffix(d)} ${monthName}`);
  }
  return dates;
}

const now = new Date();
const CY = now.getFullYear();
const CM = now.getMonth();
const CD = now.getDate();
const NY = CM === 11 ? CY + 1 : CY;
const NM = CM === 11 ? 0 : CM + 1;
const CURRENT_MONTH_LABEL = now.toLocaleString("en-GB", {
  month: "long",
  year: "numeric",
});
const NEXT_MONTH_LABEL = new Date(NY, NM, 1).toLocaleString("en-GB", {
  month: "long",
  year: "numeric",
});
const CURRENT_DATES = buildDates(CY, CM, CD);
const NEXT_DATES = buildDates(NY, NM, 1);
const SHOW_NEXT_MONTH = CD >= 16;

const LOCATIONS = [
  "Nottingham",
  "cardiff",
  "Marbella",
  "Dubai",
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

// ─── UI PRIMITIVES ────────────────────────────────────────────────────────────

const onFocus = (
  e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
) => {
  e.currentTarget.style.boxShadow = `0 0 0 2px ${PALETTE.pinkMid}`;
  e.currentTarget.style.borderColor = PALETTE.pink;
};
const onBlur = (
  e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
) => {
  e.currentTarget.style.boxShadow = "";
  e.currentTarget.style.borderColor = T.border.input;
};

function FieldLabel({ children, required }: FieldProps) {
  return (
    <label
      style={{ color: T.text.muted }}
      className="block text-xs font-bold uppercase tracking-wider mb-1.5"
    >
      {children}
      {required && (
        <span
          style={{ color: T.text.brand }}
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
    <p
      style={{ color: T.text.badge.rejected }}
      className="mt-1.5 text-xs flex items-center gap-1"
    >
      <AlertCircle className="w-3 h-3 flex-shrink-0" /> {message}
    </p>
  );
}

function Input({ value, onChange, placeholder, type = "text" }: InputProps) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={onFocus}
      onBlur={onBlur}
      placeholder={placeholder}
      style={{
        background: T.bg.input,
        border: `1px solid ${T.border.input}`,
        color: T.text.primary,
        borderRadius: "0.75rem",
      }}
      className="w-full px-3 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none transition-all"
    />
  );
}

function Textarea({ value, onChange, placeholder, rows = 3 }: any) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={onFocus}
      onBlur={onBlur}
      rows={rows}
      placeholder={placeholder}
      style={{
        background: T.bg.input,
        border: `1px solid ${T.border.input}`,
        color: T.text.primary,
        borderRadius: "0.75rem",
      }}
      className="w-full px-3 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none resize-none transition-all"
    />
  );
}

function CheckItem({ checked, onChange, label }: CheckItemProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      style={
        checked
          ? {
              borderColor: T.border.brand,
              backgroundColor: T.bg.surface,
            }
          : {
              borderColor: T.border.default,
              backgroundColor: T.bg.surface,
            }
      }
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all hover:border-pink-300"
    >
      <div
        style={
          checked
            ? { backgroundColor: T.brand.primary, borderColor: T.brand.primary }
            : { borderColor: T.border.strong, backgroundColor: T.bg.surface }
        }
        className="w-4 h-4 rounded flex-shrink-0 border-2 flex items-center justify-center transition-all"
      >
        {checked && (
          <Check
            className="w-2.5 h-2.5"
            style={{ color: T.brand.primaryText }}
            strokeWidth={3}
          />
        )}
      </div>
      <p
        style={{ color: checked ? T.text.primary : T.text.muted }}
        className={`text-sm ${checked ? "font-medium" : ""}`}
      >
        {label}
      </p>
    </button>
  );
}

function MonthSection({
  label,
  dates,
  selectedDates,
  onToggle,
  defaultOpen = false,
}: MonthSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const selectedCount = dates.filter((d) => selectedDates.includes(d)).length;
  return (
    <div
      style={{ border: `1px solid ${T.border.default}` }}
      className="rounded-2xl overflow-hidden mb-2"
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{ background: T.bg.surfaceAlt }}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Calendar
            className="w-4 h-4"
            style={{ color: T.brand.primary }}
          />
          <span
            style={{ color: T.text.primary }}
            className="text-sm font-bold"
          >
            {label}
          </span>
          {selectedCount > 0 && (
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: T.brand.softBorder,
                color: PALETTE.pinkDark,
              }}
            >
              {selectedCount} selected
            </span>
          )}
        </div>
        <ChevronDown
          className="w-4 h-4 transition-transform duration-200"
          style={{
            color: T.text.muted,
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>
      {open && (
        <div
          style={{
            background: T.bg.surface,
            borderTop: `1px solid ${T.border.table}`,
          }}
          className="px-3 pb-3 pt-2 space-y-1.5"
        >
          {dates.map((d) => (
            <CheckItem
              key={d}
              checked={selectedDates.includes(d)}
              onChange={() => onToggle(d)}
              label={d}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 py-1">
      <p
        className="text-xs font-bold uppercase tracking-widest whitespace-nowrap"
        style={{ color: T.text.brand }}
      >
        {children}
      </p>
      <div
        className="flex-1 h-px"
        style={{ background: T.border.default }}
      />
    </div>
  );
}

function SuccessScreen() {
  return (
    <div
      style={{ background: T.bg.surfaceAlt }}
      className="min-h-screen flex items-center justify-center p-4"
    >
      <div
        style={{
          background: T.bg.surface,
          border: `1px solid ${T.border.default}`,
          boxShadow: T.shadow.lg,
        }}
        className="rounded-3xl p-10 max-w-sm w-full text-center"
      >
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{
            backgroundColor: T.bg.badge.approved,
            border: `2px solid ${T.text.badge.approved}`,
          }}
        >
          <Check
            className="w-7 h-7"
            style={{ color: T.text.badge.approved }}
            strokeWidth={2.5}
          />
        </div>
        <h2
          style={{ color: T.text.primary }}
          className="text-xl font-bold mb-2"
        >
          All Done!
        </h2>
        <p
          style={{ color: T.text.muted }}
          className="text-sm leading-relaxed"
        >
          We&apos;ve received your details. We&apos;ll be in touch shortly with
          next steps.
        </p>
      </div>
    </div>
  );
}

// ─── MAIN FORM ────────────────────────────────────────────────────────────────

function OnboardingForm() {
  const searchParams = useSearchParams();
  const candidateId = searchParams.get("id") ?? "";

  const [showForm, setShowForm] = useState(false);
  const [tab, setTab] = useState<"onboarding" | "availability">("onboarding");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [submitError, setSubmitError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [homeAddress, setHomeAddress] = useState("");
  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [emergencyRelationship, setEmergencyRelationship] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [bankSortCode, setBankSortCode] = useState("");
  const [unavailableAll, setUnavailableAll] = useState(false);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [comments, setComments] = useState("");
  const [unavailableReason, setUnavailableReason] = useState("");

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

  function handleSortCode(raw: string) {
    const digits = raw.replace(/\D/g, "").slice(0, 6);
    const parts = digits.match(/.{1,2}/g) ?? [];
    setBankSortCode(parts.join("-"));
  }

  function handleNext() {
    const e: Record<string, string> = {};
    if (!homeAddress.trim()) e.homeAddress = "Required";
    if (!emergencyContactName.trim()) e.emergencyContactName = "Required";
    if (!emergencyRelationship.trim()) e.emergencyRelationship = "Required";
    if (!emergencyPhone.trim()) e.emergencyPhone = "Required";
    if (bankAccountNumber.length !== 8)
      e.bankAccountNumber = "Must be 8 digits";
    if (bankSortCode.replace(/\D/g, "").length !== 6)
      e.bankSortCode = "Must be 6 digits";

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
      e.dates = "Select dates or mark unavailable";
    if (unavailableAll && !unavailableReason.trim())
      e.unavailableReason = "Please provide a reason";
    if (selectedLocations.length === 0)
      e.locations = "Select at least one location";
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }

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
            emergency_contact_name: emergencyContactName,
            emergency_contact_relationship: emergencyRelationship,
            emergency_contact_phone: emergencyPhone,
            bank_account_number: bankAccountNumber,
            bank_sort_code: bankSortCode,
          },
          availability: {
            unavailable_all_month: unavailableAll,
            unavailable_reason: unavailableAll ? unavailableReason : "",
            dates: unavailableAll ? [] : selectedDates,
            locations: selectedLocations,
            comments,
          },
        }),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) return <SuccessScreen />;

  // ── Landing / offer screen ───────────────────────────────────────────────
  if (!showForm) {
    return (
      <div
        style={{ background: T.bg.surfaceAlt, color: T.text.primary }}
        className="min-h-screen py-12 px-6"
      >
        <div className="max-w-xl mx-auto">
          <header className="mb-10">
            <h1
              className="text-4xl font-black italic tracking-tighter leading-none mb-4"
              style={{ color: T.text.brand }}
            >
              OFFER & NEXT STEPS
            </h1>
            <p
              style={{ color: T.text.secondary }}
              className="leading-relaxed"
            >
              Thank you for attending a trial shift with us. we were really
              pleased and would like to offer you the opportunity to work with
              us.
            </p>
          </header>

          <div className="space-y-6">
            {/* Contractual notice */}
            <div
              style={{
                background: T.bg.badge.rejected,
                border: `1px solid ${PALETTE.red}33`,
                borderRadius: "1rem",
              }}
              className="p-4"
            >
              <div
                style={{ color: T.text.badge.rejected }}
                className="flex items-center gap-2 mb-2 font-bold text-xs uppercase tracking-widest"
              >
                <AlertCircle className="w-4 h-4" /> CONTRACTUAL STATUS
              </div>
              <p
                style={{ color: T.text.secondary }}
                className="text-xs leading-relaxed"
              >
                All Effervescent Agency team members are engaged as Independent
                Contractors under a Contract for Services. By joining the
                roster, you acknowledge that you are a self-employed individual
                responsible for your own tax and National Insurance. There is no
                contract of employment, expressed or implied, between you and
                Effervescent Agency.
              </p>
            </div>

            {/* Equipment */}
            <section
              style={{
                background: T.bg.surface,
                border: `1px solid ${T.border.default}`,
                boxShadow: T.shadow.sm,
              }}
              className="rounded-3xl p-6"
            >
              <h2
                style={{ color: T.text.primary }}
                className="flex items-center gap-2 font-bold mb-4 uppercase text-sm tracking-widest"
              >
                <Package
                  className="w-5 h-5"
                  style={{ color: T.brand.primary }}
                />{" "}
                📦 Equipment
              </h2>
              <ul
                style={{ color: T.text.muted }}
                className="text-sm space-y-2 mb-6"
              >
                <li>• 25ml Jägerbomb cups (at least 100)</li>
                <li>• Shot tubes with rack (approved suppliers)</li>
                <li>• Tray (recommended)</li>
                <li>
                  • It Is Required To Buy The Equipment Before Your First Shift
                </li>
              </ul>
              <a
                href="https://effervescent-agency.sumupstore.com/product/shot-seller-starter-kit"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: T.brand.soft,
                  border: `1px solid ${T.brand.softBorder}`,
                  borderRadius: "0.75rem",
                }}
                className="flex items-center justify-between p-4 hover:bg-pink-100 transition-all"
              >
                <span
                  style={{ color: PALETTE.pinkDark }}
                  className="text-xs font-bold uppercase tracking-widest"
                >
                  Get Starter Kit
                </span>
                <ExternalLink
                  className="w-4 h-4"
                  style={{ color: T.text.muted }}
                />
              </a>
            </section>

            {/* What happens next */}
            <section
              style={{
                background: T.bg.surface,
                border: `1px solid ${T.border.default}`,
                boxShadow: T.shadow.sm,
              }}
              className="rounded-3xl p-6"
            >
              <h2
                style={{ color: T.text.primary }}
                className="flex items-center gap-2 font-bold mb-4 uppercase text-sm tracking-widest"
              >
                <Smartphone
                  className="w-5 h-5"
                  style={{ color: T.brand.primary }}
                />{" "}
                📲 What Happens Next
              </h2>
              <div
                style={{ color: T.text.muted }}
                className="text-xs space-y-3 leading-relaxed"
              >
                <p>
                  • You will receive an invitation to join{" "}
                  <strong style={{ color: T.text.secondary }}>RotaCloud</strong>
                  .
                </p>
                <p>
                  • You will be sent a{" "}
                  <strong style={{ color: T.text.secondary }}>
                    contract via email
                  </strong>{" "}
                  to review and e-sign.
                </p>
                <p>
                  • You will be added to our{" "}
                  <strong style={{ color: T.text.secondary }}>
                    WhatsApp group
                  </strong>
                  .
                </p>
                <p>
                  • Mandatory{" "}
                  <strong style={{ color: T.text.secondary }}>
                    e-learning modules
                  </strong>{" "}
                  will be sent to you.
                </p>
              </div>
            </section>

            {/* CTA */}
            <button
              onClick={() => {
                setShowForm(true);
                window.scrollTo(0, 0);
              }}
              style={{
                background: T.brand.primary,
                color: T.brand.primaryText,
                boxShadow: `0 20px 40px -15px ${T.brand.primary}66`,
              }}
              className="w-full py-5 rounded-2xl font-black flex items-center justify-center gap-3 transition-all active:scale-[0.98] hover:bg-pink-600"
            >
              ACCEPT & START FORMS <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Multi-step form ──────────────────────────────────────────────────────
  return (
    <div
      style={{ background: T.bg.surfaceAlt }}
      className="min-h-screen"
    >
      <div className="max-w-xl mx-auto px-4 py-8">
        {/* Tab switcher */}
        <div
          style={{
            background: T.bg.surface,
            border: `1px solid ${T.border.default}`,
            boxShadow: T.shadow.sm,
          }}
          className="flex gap-2 mb-5 rounded-2xl p-1.5"
        >
          {(["onboarding", "availability"] as const).map((t) => (
            <button
              key={t}
              onClick={() => t === "onboarding" && setTab("onboarding")}
              style={
                tab === t
                  ? {
                      backgroundColor: T.brand.primary,
                      color: T.brand.primaryText,
                    }
                  : { color: T.text.muted }
              }
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
                t === "availability" && tab === "onboarding"
                  ? "opacity-40 cursor-not-allowed"
                  : ""
              }`}
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
            </button>
          ))}
        </div>

        {/* Form card */}
        <div
          style={{
            background: T.bg.surface,
            border: `1px solid ${T.border.default}`,
            boxShadow: T.shadow.md,
          }}
          className="rounded-3xl overflow-hidden"
        >
          {/* Card header */}
          <div
            style={{
              background: `linear-gradient(135deg, ${T.brand.softBorder}, ${T.brand.soft})`,
              borderBottom: `1px solid ${T.brand.softBorder}`,
            }}
            className="px-6 py-5"
          >
            <p
              style={{ color: PALETTE.pinkDark }}
              className="text-xs font-semibold uppercase tracking-widest mb-0.5"
            >
              {tab === "onboarding" ? "Step 1 of 2" : "Step 2 of 2"}
            </p>
            <h2
              style={{ color: PALETTE.pinkDark }}
              className="text-xl font-bold"
            >
              {tab === "onboarding" ? "Your Details" : "Availability"}
            </h2>
          </div>

          {/* Form fields */}
          <div className="px-6 py-6 space-y-5">
            {tab === "onboarding" ? (
              <>
                <SectionTitle>Personal</SectionTitle>
                <div>
                  <FieldLabel required>Home Address</FieldLabel>
                  <Textarea
                    value={homeAddress}
                    onChange={setHomeAddress}
                    placeholder="Address, Postcode"
                  />
                  <FieldError message={errors.homeAddress} />
                </div>

                <SectionTitle>Emergency Contact</SectionTitle>
                <div>
                  <FieldLabel required>Name</FieldLabel>
                  <Input
                    value={emergencyContactName}
                    onChange={setEmergencyContactName}
                  />
                  <FieldError message={errors.emergencyContactName} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <FieldLabel required>Relationship</FieldLabel>
                    <Input
                      value={emergencyRelationship}
                      onChange={setEmergencyRelationship}
                    />
                  </div>
                  <div>
                    <FieldLabel required>Phone</FieldLabel>
                    <Input
                      value={emergencyPhone}
                      onChange={setEmergencyPhone}
                      type="tel"
                    />
                  </div>
                </div>

                <SectionTitle>Bank Details</SectionTitle>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <FieldLabel required>Account No.</FieldLabel>
                    <Input
                      value={bankAccountNumber}
                      onChange={(v) =>
                        setBankAccountNumber(v.replace(/\D/g, "").slice(0, 8))
                      }
                    />
                    <FieldError message={errors.bankAccountNumber} />
                  </div>
                  <div>
                    <FieldLabel required>Sort Code</FieldLabel>
                    <Input
                      value={bankSortCode}
                      onChange={handleSortCode}
                    />
                    <FieldError message={errors.bankSortCode} />
                  </div>
                </div>
              </>
            ) : (
              <>
                <FieldLabel required>Dates Available</FieldLabel>
                <FieldError message={errors.dates} />
                <CheckItem
                  checked={unavailableAll}
                  onChange={(v) => {
                    setUnavailableAll(v);
                    if (v) setSelectedDates([]);
                  }}
                  label="Unavailable All Month"
                />
                {unavailableAll && (
                  <div className="mt-3">
                    <FieldLabel required>Reason</FieldLabel>
                    <Textarea
                      value={unavailableReason}
                      onChange={setUnavailableReason}
                      placeholder="Enter reason..."
                    />
                    <FieldError message={errors.unavailableReason} />
                  </div>
                )}
                {!unavailableAll && (
                  <>
                    <MonthSection
                      label={CURRENT_MONTH_LABEL}
                      dates={CURRENT_DATES}
                      selectedDates={selectedDates}
                      onToggle={toggleDate}
                    />
                    {SHOW_NEXT_MONTH && (
                      <MonthSection
                        label={NEXT_MONTH_LABEL}
                        dates={NEXT_DATES}
                        selectedDates={selectedDates}
                        onToggle={toggleDate}
                      />
                    )}
                  </>
                )}

                <SectionTitle>Locations</SectionTitle>
                <FieldError message={errors.locations} />
                <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                  {LOCATIONS.map((l) => (
                    <CheckItem
                      key={l}
                      checked={selectedLocations.includes(l)}
                      onChange={() => toggleLocation(l)}
                      label={l}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Footer actions */}
          <div
            style={{ borderTop: `1px solid ${T.border.table}` }}
            className="px-6 py-4 flex justify-between items-center"
          >
            {tab === "availability" && (
              <button
                onClick={() => setTab("onboarding")}
                style={{ color: T.text.muted }}
                className="text-sm font-bold flex items-center gap-1 hover:text-gray-700 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            )}
            <button
              onClick={tab === "onboarding" ? handleNext : handleSubmit}
              disabled={submitting}
              style={{
                background: T.brand.primary,
                color: T.brand.primaryText,
              }}
              className="ml-auto px-8 py-3 rounded-xl font-bold disabled:opacity-50 hover:bg-pink-600 transition-colors"
            >
              {submitting
                ? "Submitting..."
                : tab === "onboarding"
                  ? "Next"
                  : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{ background: T.bg.surfaceAlt }}
          className="min-h-screen flex items-center justify-center"
        >
          <div
            className="w-8 h-8 border-2 rounded-full animate-spin"
            style={{
              borderColor: T.border.default,
              borderTopColor: T.brand.primary,
            }}
          />
        </div>
      }
    >
      <OnboardingForm />
    </Suspense>
  );
}
