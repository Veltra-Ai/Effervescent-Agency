"use client";

import { useState } from "react";
import { ChevronDown, AlertCircle } from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────

const B = "#FDB8D7";

const VENUES = [
  "Aberdeen",
  "Bedford",
  "Billericay (Essex)",
  "Birmingham",
  "Bristol",
  "Cardiff",
  "Chelmsford",
  "Cheltenham",
  "Chester",
  "Chichester",
  "Colchester",
  "Coventry",
  "Derby",
  "Dundee",
  "Evesham",
  "Exeter",
  "Glasgow",
  "Guildford",
  "Herne Bay",
  "Hinckley",
  "Hull",
  "Inverness",
  "Leicester",
  "Leeds",
  "Liverpool",
  "London - Aldgate",
  "London - Camden",
  "London - Edgware",
  "London - Greenwich",
  "London - Harlesden",
  "London - Hounslow",
  "Loughborough",
  "Manchester",
  "Mansfield",
  "Margate",
  "Milton Keynes",
  "Newcastle",
  "Newport",
  "Northampton",
  "Nottingham",
  "Peterborough",
  "Plymouth",
  "Portsmouth/Southsea",
  "Sheffield",
  "Southend",
  "Solihull",
  "Southampton",
  "St Albans",
  "Walsall",
  "Wolverhampton",
  "Worthing",
  "Thanet",
  "Swansea",
  "Wrexham",
  "Winchester",
  "Worcester",
];

// ─── Types ────────────────────────────────────────────────────────────────────

interface SalesForm {
  date: string;
  venue: string;
  name: string;
  bottles: string;
  barEarnings: string;
  card: string;
  cash: string;
  deductions: string;
}

const INITIAL: SalesForm = {
  date: "",
  venue: "",
  name: "",
  bottles: "",
  barEarnings: "",
  card: "",
  cash: "",
  deductions: "",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const onFocusBrand = (
  e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>,
) => {
  e.currentTarget.style.boxShadow = `0 0 0 2px ${B}55`;
  e.currentTarget.style.borderColor = B;
};
const onBlurBrand = (
  e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>,
) => {
  e.currentTarget.style.boxShadow = "";
  e.currentTarget.style.borderColor = "";
};

function parsePound(v: string): number {
  return parseFloat(v) || 0;
}

// ─── Computed fields (mirrors spreadsheet logic) ──────────────────────────────
// Total Revenue = Card + Cash
// Seller Commission = Total Revenue * 0.25
// Agency Commission = Total Revenue * 0.25
// Agency Fee = Card - Agency Commission - Deductions (card payout)

function compute(form: SalesForm) {
  const card = parsePound(form.card);
  const cash = parsePound(form.cash);
  const deductions = parsePound(form.deductions);

  const totalRevenue = card + cash;
  const sellerCommission = totalRevenue * 0.25;
  const agencyCommission = totalRevenue * 0.25;
  // Agency Fee = card payout = total card less agency commission
  const agencyFee = card - agencyCommission - deductions;

  return { totalRevenue, sellerCommission, agencyCommission, agencyFee };
}

function fmt(n: number) {
  return `£${n.toFixed(2)}`;
}

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
      <AlertCircle className="w-3 h-3 flex-shrink-0" />
      {message}
    </p>
  );
}

function TextInput({
  value,
  onChange,
  placeholder = "",
  type = "text",
  prefix,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  prefix?: string;
}) {
  return (
    <div className="relative">
      {prefix && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
          {prefix}
        </span>
      )}
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={{ colorScheme: "dark" }}
        className={`w-full py-2.5 border border-[#2a2a2a] rounded-xl text-sm
          bg-[#1a1a1a] text-white placeholder:text-gray-600
          focus:outline-none transition-all ${prefix ? "pl-7 pr-3" : "px-3"}`}
        onFocus={onFocusBrand}
        onBlur={onBlurBrand}
      />
    </div>
  );
}

function SelectInput({
  value,
  onChange,
  options,
  placeholder = "Select…",
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ colorScheme: "dark" }}
        className="w-full appearance-none px-3 py-2.5 border border-[#2a2a2a] rounded-xl text-sm
          bg-[#1a1a1a] text-white focus:outline-none transition-all"
        onFocus={onFocusBrand}
        onBlur={onBlurBrand}
      >
        <option
          value=""
          className="text-gray-500"
        >
          {placeholder}
        </option>
        {options.map((opt) => (
          <option
            key={opt}
            value={opt}
            className="text-white bg-[#1a1a1a]"
          >
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
    </div>
  );
}

function ReadonlyField({
  value,
  highlight,
}: {
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className="w-full px-3 py-2.5 rounded-xl text-sm font-semibold border"
      style={
        highlight
          ? {
              backgroundColor: `${B}12`,
              borderColor: `${B}30`,
              color: B,
            }
          : {
              backgroundColor: "#141414",
              borderColor: "#222",
              color: "#9ca3af",
            }
      }
    >
      {value}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SalesTrackerPage() {
  const [form, setForm] = useState<SalesForm>(INITIAL);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const upd = (patch: Partial<SalesForm>) =>
    setForm((f) => ({ ...f, ...patch }));
  const computed = compute(form);

  function validate(): Record<string, string> {
    const e: Record<string, string> = {};
    if (!form.date) e.date = "Date is required";
    if (!form.venue) e.venue = "Venue is required";
    if (!form.name.trim()) e.name = "Your name is required";
    if (!form.bottles.trim()) e.bottles = "Bottles sold is required";
    if (!form.card.trim() && !form.cash.trim())
      e.card = "Enter at least card or cash takings";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitting(true);

    const payload = {
      ...form,
      ...computed,
    };

    console.log("Sales Tracker Submission:", payload);

    // Simulate brief delay then alert
    await new Promise((r) => setTimeout(r, 600));
    setSubmitting(false);
    alert(
      `✅ Shift submitted!\n\nTotal Revenue: ${fmt(computed.totalRevenue)}\nYour Commission: ${fmt(computed.sellerCommission)}\nCard Payout: ${fmt(computed.agencyFee)}`,
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <form
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="bg-[#111111] rounded-3xl border border-[#1f1f1f] overflow-hidden shadow-2xl">
            {/* Card Header */}
            <div
              className="px-6 py-5"
              style={{
                background: `linear-gradient(135deg, #2a0d1c, #3d1228)`,
              }}
            >
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-1"
                style={{ color: `${B}90` }}
              >
                Effervescent Agency
              </p>
              <h2
                className="text-xl font-bold"
                style={{ color: B }}
              >
                Shift Sales Entry
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Fill in your shift details. Auto-calculated fields update as you
                type.
              </p>
            </div>

            <div className="px-6 py-6 space-y-5">
              {/* Row 1 — Date + Venue */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <FieldLabel required>Date</FieldLabel>
                  <TextInput
                    type="date"
                    value={form.date}
                    onChange={(v) => upd({ date: v })}
                  />
                  <FieldError message={errors.date} />
                </div>
                <div>
                  <FieldLabel required>Venue</FieldLabel>
                  <SelectInput
                    value={form.venue}
                    onChange={(v) => upd({ venue: v })}
                    options={VENUES}
                    placeholder="Select venue…"
                  />
                  <FieldError message={errors.venue} />
                </div>
              </div>

              {/* Row 2 — Name + Bottles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <FieldLabel required>Your Name</FieldLabel>
                  <TextInput
                    value={form.name}
                    onChange={(v) => upd({ name: v })}
                    placeholder="Jane Smith"
                  />
                  <FieldError message={errors.name} />
                </div>
                <div>
                  <FieldLabel required>Bottles Sold</FieldLabel>
                  <TextInput
                    type="number"
                    value={form.bottles}
                    onChange={(v) => upd({ bottles: v })}
                    placeholder="e.g. 1.5"
                  />
                  <p className="mt-1 text-[11px] text-gray-600">
                    To the point — e.g. 1 &amp; a half = 1.5
                  </p>
                  <FieldError message={errors.bottles} />
                </div>
              </div>

              {/* Row 3 — Bar Earnings + Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <FieldLabel>Bar Earnings</FieldLabel>
                  <TextInput
                    type="number"
                    value={form.barEarnings}
                    onChange={(v) => upd({ barEarnings: v })}
                    placeholder="0.00"
                    prefix="£"
                  />
                </div>
                <div>
                  <FieldLabel>Card Payments</FieldLabel>
                  <TextInput
                    type="number"
                    value={form.card}
                    onChange={(v) => upd({ card: v })}
                    placeholder="0.00"
                    prefix="£"
                  />
                  <FieldError message={errors.card} />
                </div>
              </div>

              {/* Row 4 — Cash + Deductions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <FieldLabel>Cash Payments (incl. tips)</FieldLabel>
                  <TextInput
                    type="number"
                    value={form.cash}
                    onChange={(v) => upd({ cash: v })}
                    placeholder="0.00"
                    prefix="£"
                  />
                </div>
                <div>
                  <FieldLabel>Deductions</FieldLabel>
                  <TextInput
                    type="number"
                    value={form.deductions}
                    onChange={(v) => upd({ deductions: v })}
                    placeholder="0.00"
                    prefix="£"
                  />
                  <p className="mt-1 text-[11px] text-gray-600">
                    Money borrowed from company for bottles
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-[#1f1f1f]" />

              {/* Auto-calculated section */}
              <div>
                <p
                  className="text-xs font-bold uppercase tracking-widest mb-3"
                  style={{ color: `${B}80` }}
                >
                  Auto-Calculated
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <FieldLabel>Total Revenue</FieldLabel>
                    <ReadonlyField value={fmt(computed.totalRevenue)} />
                  </div>
                  <div>
                    <FieldLabel>Seller Comm.</FieldLabel>
                    <ReadonlyField
                      value={fmt(computed.sellerCommission)}
                      highlight
                    />
                  </div>
                  <div>
                    <FieldLabel>Agency Comm.</FieldLabel>
                    <ReadonlyField value={fmt(computed.agencyCommission)} />
                  </div>
                  <div>
                    <FieldLabel>Agency Fee</FieldLabel>
                    <ReadonlyField value={fmt(computed.agencyFee)} />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-[#1a1a1a] flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                style={{
                  background: `linear-gradient(135deg, ${B}, #e89fbe)`,
                  color: "#1a0a10",
                }}
                className="flex items-center gap-2 px-8 py-2.5 rounded-xl text-sm font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:opacity-90"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#1a0a10]/30 border-t-[#1a0a10] rounded-full animate-spin" />
                    Submitting…
                  </>
                ) : (
                  "Submit Shift"
                )}
              </button>
            </div>
          </div>

          <p className="text-center text-xs text-gray-700 mt-4 pb-4">
            Make sure all details are correct before submitting.
          </p>
        </form>
      </div>
    </div>
  );
}

// CALCULATION LOGIC — based on Sales_Tracker PDF
// Total Revenue   = Card + Cash
// Seller Comm     = Total Revenue × 25%  ← inferred from example (£140 → £35), NOT explicitly stated in docs
// Agency Comm     = Total Revenue × 25%  ← same inference
// Deductions      = Money advanced by company to buy bottles (manual input)
// Agency Fee/Payout = Card − Agency Commission − Deductions
// NOTE: Bar Earnings column exists in sheet but has NO formula shown in PDF — stored but not used in calc
// CONFIRM commission % with agency before going live
