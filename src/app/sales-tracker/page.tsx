"use client";

import { useState, useRef } from "react";
import {
  ChevronDown,
  AlertCircle,
  Upload,
  X,
  CheckCircle2,
} from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────

const B = "#FDB8D7";
const WEBHOOK_URL = "https://n8n.veltraai.net/webhook/sales-tracker";

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
  email: string;
  bottles: string;
  barEarnings: string;
  card: string;
  cash: string;
  deductions: string;
  paidBarDirectly: "YES" | "NO" | "";
  agencySentMoney: "YES" | "NO" | "";
  images: string[]; // Base64 strings
}

const INITIAL: SalesForm = {
  date: "",
  venue: "",
  name: "",
  email: "",
  bottles: "",
  barEarnings: "",
  card: "",
  cash: "",
  deductions: "",
  paidBarDirectly: "",
  agencySentMoney: "",
  images: [],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parsePound(v: string): number {
  return parseFloat(v) || 0;
}

function compute(form: SalesForm) {
  const card = parsePound(form.card);
  const cash = parsePound(form.cash);
  const deductions = parsePound(form.deductions);

  const totalRevenue = card + cash;
  const rawCommission = totalRevenue * 0.25;
  // New Logic: Deduction is taken specifically from the Seller's Commission
  const sellerCommission = Math.max(0, rawCommission - deductions);

  return { totalRevenue, sellerCommission, deductionFromComm: deductions };
}

function fmt(n: number) {
  return `£${n.toFixed(2)}`;
}

// ─── UI Components ────────────────────────────────────────────────────────────

function FieldLabel({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
      {children}{" "}
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

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SalesTrackerPage() {
  const [form, setForm] = useState<SalesForm>(INITIAL);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const upd = (patch: Partial<SalesForm>) =>
    setForm((f) => ({ ...f, ...patch }));
  const computed = compute(form);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (form.images.length + files.length > 2) {
      alert("Maximum 2 images allowed");
      return;
    }

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setForm((prev) => ({
          ...prev,
          images: [...prev.images, base64String],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  function validate(): Record<string, string> {
    const e: Record<string, string> = {};
    if (!form.date) e.date = "Required";
    if (!form.venue) e.venue = "Required";
    if (!form.name.trim()) e.name = "Required";
    if (!form.email.trim() || !form.email.includes("@"))
      e.email = "Valid email required";
    if (!form.bottles.trim()) e.bottles = "Required";
    if (!form.card.trim() && !form.cash.trim())
      e.card = "Enter card or cash takings";
    if (!form.paidBarDirectly) e.paidBarDirectly = "Select an option";
    if (!form.agencySentMoney) e.agencySentMoney = "Select an option";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setErrors({});
    setSubmitting(true);

    const payload = {
      ...form,
      ...computed,
      submittedAt: new Date().toISOString(),
    };

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        throw new Error("Webhook failed");
      }
    } catch (err) {
      alert("Submission failed. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
        <div className="bg-[#111111] p-8 rounded-3xl border border-[#1f1f1f] text-center max-w-md w-full shadow-2xl">
          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Shift Submitted
          </h2>
          <p className="text-gray-400 mb-6">
            Your shift details and receipts have been sent successfully.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setForm(INITIAL);
            }}
            style={{ backgroundColor: B }}
            className="w-full py-3 rounded-xl text-black font-bold"
          >
            Submit Another Shift
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-[#FDB8D733]">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <form
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="bg-[#111111] rounded-[2rem] border border-[#1f1f1f] overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="px-8 py-7 bg-gradient-to-br from-[#2a0d1c] to-[#3d1228] border-b border-[#ffffff05]">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 opacity-60">
                Effervescent Agency
              </p>
              <h2
                className="text-2xl font-black italic tracking-tight"
                style={{ color: B }}
              >
                SHIFT SALES ENTRY
              </h2>
            </div>

            <div className="p-8 space-y-6">
              {/* Personal Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <FieldLabel required>Full Name</FieldLabel>
                  <input
                    className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FDB8D7] transition-all"
                    value={form.name}
                    onChange={(e) => upd({ name: e.target.value })}
                    placeholder="e.g. Jane Doe"
                  />
                  {errors.name && (
                    <p className="text-red-400 text-[10px] mt-1 font-bold">
                      {errors.name}
                    </p>
                  )}
                </div>
                <div>
                  <FieldLabel required>Email Address</FieldLabel>
                  <input
                    type="email"
                    className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FDB8D7] transition-all"
                    value={form.email}
                    onChange={(e) => upd({ email: e.target.value })}
                    placeholder="jane@example.com"
                  />
                  {errors.email && (
                    <p className="text-red-400 text-[10px] mt-1 font-bold">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Shift Basics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <FieldLabel required>Date</FieldLabel>
                  <input
                    type="date"
                    className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm focus:outline-none"
                    value={form.date}
                    onChange={(e) => upd({ date: e.target.value })}
                  />
                </div>
                <div>
                  <FieldLabel required>Venue</FieldLabel>
                  <select
                    className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm focus:outline-none appearance-none"
                    value={form.venue}
                    onChange={(e) => upd({ venue: e.target.value })}
                  >
                    <option value="">Select venue...</option>
                    {VENUES.map((v) => (
                      <option
                        key={v}
                        value={v}
                      >
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Numerical Data */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                <div>
                  <FieldLabel required>Bottles Sold</FieldLabel>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm focus:outline-none"
                    value={form.bottles}
                    onChange={(e) => upd({ bottles: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <FieldLabel>Card Total</FieldLabel>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500 text-sm">
                      £
                    </span>
                    <input
                      type="number"
                      className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl pl-7 pr-4 py-3 text-sm focus:outline-none"
                      value={form.card}
                      onChange={(e) => upd({ card: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div>
                  <FieldLabel>Cash Total</FieldLabel>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500 text-sm">
                      £
                    </span>
                    <input
                      type="number"
                      className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl pl-7 pr-4 py-3 text-sm focus:outline-none"
                      value={form.cash}
                      onChange={(e) => upd({ cash: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              {/* Deductions & Bar Earnings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <FieldLabel>Bar Earnings (Ref Only)</FieldLabel>
                  <input
                    type="number"
                    className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm focus:outline-none"
                    value={form.barEarnings}
                    onChange={(e) => upd({ barEarnings: e.target.value })}
                    placeholder="£ 0.00"
                  />
                </div>
                <div>
                  <FieldLabel>Advance/Deductions</FieldLabel>
                  <input
                    type="number"
                    className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm focus:outline-none border-dashed"
                    value={form.deductions}
                    onChange={(e) => upd({ deductions: e.target.value })}
                    placeholder="£ 0.00"
                  />
                  <p className="text-[10px] text-gray-500 mt-1 italic">
                    Money borrowed for bottles
                  </p>
                </div>
              </div>

              {/* Questions */}
              <div className="space-y-4 pt-2">
                <div className="p-4 bg-[#161616] rounded-2xl border border-[#222]">
                  <FieldLabel required>
                    Did you pay the bar directly?
                  </FieldLabel>
                  <div className="flex gap-4 mt-2">
                    {["YES", "NO"].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => upd({ paidBarDirectly: opt as any })}
                        className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${form.paidBarDirectly === opt ? "bg-white text-black" : "bg-[#222] text-gray-500"}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="p-4 bg-[#161616] rounded-2xl border border-[#222]">
                  <FieldLabel required>
                    Did agency send you money to pay bar?
                  </FieldLabel>
                  <div className="flex gap-4 mt-2">
                    {["YES", "NO"].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => upd({ agencySentMoney: opt as any })}
                        className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${form.agencySentMoney === opt ? "bg-white text-black" : "bg-[#222] text-gray-500"}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <FieldLabel>Receipts & Bottles (Max 2)</FieldLabel>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {form.images.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative group aspect-video rounded-xl overflow-hidden border border-[#333]"
                    >
                      <img
                        src={img}
                        alt="upload"
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => removeImage(idx)}
                        className="absolute top-2 right-2 p-1.5 bg-black/50 backdrop-blur-md rounded-full hover:bg-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {form.images.length < 2 && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-video rounded-xl border-2 border-dashed border-[#333] flex flex-col items-center justify-center text-gray-500 hover:border-[#FDB8D7] hover:text-[#FDB8D7] transition-all"
                    >
                      <Upload className="w-6 h-6 mb-2" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">
                        Upload Image
                      </span>
                    </button>
                  )}
                </div>
                <input
                  type="file"
                  hidden
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageUpload}
                  multiple
                />
              </div>

              {/* Calculations Area */}
              <div className="pt-6 border-t border-[#1f1f1f]">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-[#161616] rounded-2xl border border-[#222]">
                    <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">
                      Total Revenue
                    </p>
                    <p className="text-xl font-mono font-bold tracking-tighter">
                      {fmt(computed.totalRevenue)}
                    </p>
                  </div>
                  <div className="p-4 bg-[#FDB8D708] rounded-2xl border border-[#FDB8D720]">
                    <p
                      className="text-[10px] font-bold uppercase mb-1"
                      style={{ color: B }}
                    >
                      Your Commission
                    </p>
                    <p
                      className="text-xl font-mono font-bold tracking-tighter"
                      style={{ color: B }}
                    >
                      {fmt(computed.sellerCommission)}
                    </p>
                    {parsePound(form.deductions) > 0 && (
                      <p className="text-[9px] text-red-400 font-bold mt-1 uppercase">
                        After -{fmt(computed.deductionFromComm)} Deduction
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-6 bg-[#0f0f0f] border-t border-[#1a1a1a]">
              <button
                type="submit"
                disabled={submitting}
                style={{
                  background: submitting
                    ? "#333"
                    : `linear-gradient(135deg, ${B}, #e89fbe)`,
                  color: "#1a0a10",
                }}
                className="w-full py-4 rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl disabled:opacity-50 transition-all hover:scale-[1.01] active:scale-95"
              >
                {submitting
                  ? "Processing Submission..."
                  : "Confirm & Submit Shift"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
