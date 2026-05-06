"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import { Upload, CheckCircle2 } from "lucide-react";

const BRAND_PINK = "#FFB8D7";
const WEBHOOK_URL = "https://n8n.veltraai.net/webhook/sales-tracker";

const VENUES = [
  "Boxpark Liverpool",
  "Tibu",
  "Portside",
  "Zanettis",
  "Babilonia",
  "Kova Beach",
  "Linekers Marbella",
  "2Funky",
  "Binks Yard",
  "Bounty",
  "Cavendish",
  "Crib",
  "Cucamara",
  "Fat Cat Derby",
  "Ghost",
  "Grumpy Monkey",
  "Hukka",
  "Icon",
  "Icon BAR CRAW",
  "The Camden",
  "Lace Bar",
  "Loft Bar",
  "Mixing House",
  "The Nest",
  "New Foresters",
  "Oz Bar",
  "Pitcher & Piano",
  "Popworld",
  "Revolution South",
  "Revs de cuba",
  "Route One",
  "Secret Garden",
  "Secret vault",
  "Steins Derby",
  "The Kings",
  "The Mail Room",
  "Trent Navigation",
  "Tunnel",
  "Vat & Fiddle",
  "Vibe",
  "XOYO",
].sort();

const STATUS_OPTIONS = ["Pending", "Paid", "Disputed"];

interface SalesForm {
  date: string;
  city: string;
  venue: string;
  name: string;
  bottles: string;
  barEarning: string;
  card: string;
  cash: string;
  deductions: string;
  agencyFee: string;
  expectedRev: string;
  paidBarDirectly: "YES" | "NO";
  agencySentMoney: "YES" | "NO";
  agencyAmount: string;
  status: string;
  bottleImage: string | null;
  paymentImage: string | null;
}

const INITIAL: SalesForm = {
  date: "",
  city: "",
  venue: "",
  name: "",
  bottles: "",
  barEarning: "",
  card: "",
  cash: "",
  deductions: "",
  agencyFee: "",
  expectedRev: "",
  paidBarDirectly: "NO",
  agencySentMoney: "NO",
  agencyAmount: "",
  status: "Pending",
  bottleImage: null,
  paymentImage: null,
};

function FieldLabel({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block text-[10px] font-black uppercase tracking-[0.15em] mb-2 text-gray-900">
      {children}{" "}
      {required && (
        <span
          style={{ color: BRAND_PINK }}
          className="ml-1"
        >
          *
        </span>
      )}
    </label>
  );
}

function CalcRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
        {label}
      </span>
      <span className="text-sm font-black text-gray-900 font-mono">
        {value}
      </span>
    </div>
  );
}

function calcValues(form: SalesForm) {
  const cash = parseFloat(form.cash) || 0;
  const card = parseFloat(form.card) || 0;
  const barEarning = parseFloat(form.barEarning) || 0;
  const deductions = parseFloat(form.deductions) || 0;
  const agencyFee = parseFloat(form.agencyFee) || 0;
  const expectedRev = parseFloat(form.expectedRev) || 0;

  const totalRevenue = cash + card;
  const sellerComm = (totalRevenue - barEarning) * 0.5;
  const agencyComm = (totalRevenue - barEarning) * 0.5;
  const actualRev = totalRevenue - deductions - agencyFee;
  const difference = expectedRev - actualRev;

  return { totalRevenue, sellerComm, agencyComm, actualRev, difference };
}

export default function SalesTrackerPage() {
  const [form, setForm] = useState<SalesForm>(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const upd = (patch: Partial<SalesForm>) =>
    setForm((f) => ({ ...f, ...patch }));

  const handleUpload = (
    type: "bottle" | "payment",
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () =>
      upd({
        [type === "bottle" ? "bottleImage" : "paymentImage"]:
          reader.result as string,
      });
    reader.readAsDataURL(file);
  };

  const { totalRevenue, sellerComm, agencyComm, actualRev, difference } =
    calcValues(form);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const imagesArray = [];
    if (form.bottleImage) imagesArray.push(form.bottleImage);
    if (form.paymentImage) imagesArray.push(form.paymentImage);

    const payload = {
      date: form.date,
      city: form.city,
      venue: form.venue,
      name: form.name,
      bottles: form.bottles,
      barEarning: form.barEarning,
      card: form.card,
      cash: form.cash,
      totalRevenue: totalRevenue.toFixed(2),
      sellerComm: sellerComm.toFixed(2),
      agencyComm: agencyComm.toFixed(2),
      deductions: form.deductions,
      agencyFee: form.agencyFee,
      actualRev: actualRev.toFixed(2),
      expectedRev: form.expectedRev,
      difference: difference.toFixed(2),
      paidBarDirectly: form.paidBarDirectly,
      agencySentMoney: form.agencySentMoney,
      agencyAmount: form.agencyAmount,
      status: form.status,
      images: imagesArray,
    };

    try {
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        throw new Error("Failed to submit");
      }
    } catch (err) {
      console.error(err);
      alert("Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted)
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center bg-gray-50">
        <div className="p-12 rounded-[3rem] bg-white border border-gray-100 shadow-sm">
          <CheckCircle2 className="w-16 h-16 mx-auto mb-6 text-green-500" />
          <h2 className="text-2xl font-black mb-6 uppercase tracking-tighter text-gray-900">
            Shift Submitted
          </h2>
          <button
            onClick={() => {
              setSubmitted(false);
              setForm(INITIAL);
            }}
            style={{ backgroundColor: BRAND_PINK }}
            className="px-8 py-4 rounded-2xl font-black uppercase text-xs text-white"
          >
            New Entry
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen p-6 font-sans bg-gray-50">
      <div className="max-w-xl mx-auto space-y-6">
        <header className="flex flex-col items-center pt-4">
          <Image
            src="/logo.jpeg"
            alt="Logo"
            width={100}
            height={100}
            className="rounded-xl shadow-lg"
          />
          <h1
            className="text-3xl font-black italic tracking-tighter uppercase mt-4"
            style={{ color: BRAND_PINK }}
          >
            Sales Breakdown
          </h1>
        </header>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* ── Block 1: Basic Info ── */}
          <div className="p-8 rounded-[2rem] bg-white border border-gray-100 shadow-sm space-y-4">
            <FieldLabel required>Date</FieldLabel>
            <input
              type="date"
              className="w-full rounded-2xl px-6 py-4 bg-gray-50 border border-gray-200 text-gray-900 font-medium"
              value={form.date}
              onChange={(e) => upd({ date: e.target.value })}
              required
            />

            <FieldLabel required>City</FieldLabel>
            <input
              className="w-full rounded-2xl px-6 py-4 bg-gray-50 border border-gray-200 text-gray-900 font-medium placeholder:text-gray-400"
              placeholder="e.g. Manchester"
              value={form.city}
              onChange={(e) => upd({ city: e.target.value })}
              required
            />

            <FieldLabel required>Venue</FieldLabel>
            <select
              className="w-full rounded-2xl px-6 py-4 bg-gray-50 border border-gray-200 text-gray-900 font-medium"
              value={form.venue}
              onChange={(e) => upd({ venue: e.target.value })}
              required
            >
              <option value="">Select Venue</option>
              {VENUES.map((v) => (
                <option
                  key={v}
                  value={v}
                >
                  {v}
                </option>
              ))}
            </select>

            <FieldLabel required>Full Name</FieldLabel>
            <input
              className="w-full rounded-2xl px-6 py-4 bg-gray-50 border border-gray-200 text-gray-900 font-medium placeholder:text-gray-400"
              placeholder="Enter your name"
              value={form.name}
              onChange={(e) => upd({ name: e.target.value })}
              required
            />
          </div>

          {/* ── Block 2: Sales Figures ── */}
          <div className="p-8 rounded-[2rem] bg-white border border-gray-100 shadow-sm space-y-4">
            <FieldLabel required>Exact Units Sold</FieldLabel>
            <input
              type="number"
              step="0.01"
              placeholder="0.00"
              className="w-full rounded-2xl px-6 py-4 bg-gray-50 border border-gray-200 text-gray-900 font-medium placeholder:text-gray-400"
              value={form.bottles}
              onChange={(e) => upd({ bottles: e.target.value })}
              required
            />

            <FieldLabel required>Bar Earning (£)</FieldLabel>
            <input
              type="number"
              step="0.01"
              placeholder="£0.00"
              className="w-full rounded-2xl px-6 py-4 bg-gray-50 border border-gray-200 text-gray-900 font-medium placeholder:text-gray-400"
              value={form.barEarning}
              onChange={(e) => upd({ barEarning: e.target.value })}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel required>Card (£)</FieldLabel>
                <input
                  type="number"
                  step="0.01"
                  placeholder="£0.00"
                  className="w-full rounded-2xl px-6 py-4 bg-gray-50 border border-gray-200 text-gray-900 font-medium placeholder:text-gray-400"
                  value={form.card}
                  onChange={(e) => upd({ card: e.target.value })}
                  required
                />
              </div>
              <div>
                <FieldLabel required>Cash (£)</FieldLabel>
                <input
                  type="number"
                  step="0.01"
                  placeholder="£0.00"
                  className="w-full rounded-2xl px-6 py-4 bg-gray-50 border border-gray-200 text-gray-900 font-medium placeholder:text-gray-400"
                  value={form.cash}
                  onChange={(e) => upd({ cash: e.target.value })}
                  required
                />
              </div>
            </div>

            <FieldLabel>Deductions (£)</FieldLabel>
            <input
              type="number"
              step="0.01"
              placeholder="£0.00"
              className="w-full rounded-2xl px-6 py-4 bg-gray-50 border border-gray-200 text-gray-900 font-medium placeholder:text-gray-400"
              value={form.deductions}
              onChange={(e) => upd({ deductions: e.target.value })}
            />

            <FieldLabel>Agency Fee (£)</FieldLabel>
            <input
              type="number"
              step="0.01"
              placeholder="£0.00"
              className="w-full rounded-2xl px-6 py-4 bg-gray-50 border border-gray-200 text-gray-900 font-medium placeholder:text-gray-400"
              value={form.agencyFee}
              onChange={(e) => upd({ agencyFee: e.target.value })}
            />

            <FieldLabel>Expected Revenue (£)</FieldLabel>
            <input
              type="number"
              step="0.01"
              placeholder="£0.00"
              className="w-full rounded-2xl px-6 py-4 bg-gray-50 border border-gray-200 text-gray-900 font-medium placeholder:text-gray-400"
              value={form.expectedRev}
              onChange={(e) => upd({ expectedRev: e.target.value })}
            />
          </div>

          {/* ── Block 3: Live Calculations ── */}
          <div className="p-8 rounded-[2rem] bg-white border border-gray-100 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 mb-4">
              Auto Calculations
            </p>
            <CalcRow
              label="Total Revenue"
              value={`£${totalRevenue.toFixed(2)}`}
            />
            <CalcRow
              label="Seller Commission"
              value={`£${sellerComm.toFixed(2)}`}
            />
            <CalcRow
              label="Agency Commission"
              value={`£${agencyComm.toFixed(2)}`}
            />
            <CalcRow
              label="Actual Revenue"
              value={`£${actualRev.toFixed(2)}`}
            />
            <CalcRow
              label="Difference (Expected vs Actual)"
              value={`£${difference.toFixed(2)}`}
            />
          </div>

          {/* ── Block 4: Payment Questions ── */}
          <div className="p-8 rounded-[2rem] bg-white border border-gray-100 shadow-sm space-y-4">
            <FieldLabel required>
              Did you make any payment to the bar?
            </FieldLabel>
            <div className="flex gap-4">
              {(["YES", "NO"] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => upd({ paidBarDirectly: opt })}
                  style={
                    form.paidBarDirectly === opt
                      ? { backgroundColor: BRAND_PINK, color: "white" }
                      : { background: "#f3f4f6", color: "#6b7280" }
                  }
                  className="flex-1 py-4 rounded-2xl font-black text-xs transition-all"
                >
                  {opt}
                </button>
              ))}
            </div>

            <FieldLabel required>
              Did the agency send you money to help pay the bar?
            </FieldLabel>
            <div className="flex gap-4">
              {(["YES", "NO"] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => upd({ agencySentMoney: opt })}
                  style={
                    form.agencySentMoney === opt
                      ? { backgroundColor: BRAND_PINK, color: "white" }
                      : { background: "#f3f4f6", color: "#6b7280" }
                  }
                  className="flex-1 py-4 rounded-2xl font-black text-xs transition-all"
                >
                  {opt}
                </button>
              ))}
            </div>
            {form.agencySentMoney === "YES" && (
              <input
                type="number"
                step="0.01"
                placeholder="Amount sent by agency"
                className="w-full rounded-2xl px-6 py-4 bg-gray-50 border border-gray-200 text-gray-900 font-medium mt-2"
                value={form.agencyAmount}
                onChange={(e) => upd({ agencyAmount: e.target.value })}
                required
              />
            )}

            <FieldLabel required>Status</FieldLabel>
            <select
              className="w-full rounded-2xl px-6 py-4 bg-gray-50 border border-gray-200 text-gray-900 font-medium"
              value={form.status}
              onChange={(e) => upd({ status: e.target.value })}
              required
            >
              {STATUS_OPTIONS.map((s) => (
                <option
                  key={s}
                  value={s}
                >
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* ── Block 5: Image Uploads ── */}
          <div className="p-8 rounded-[2rem] bg-white border border-gray-100 shadow-sm grid grid-cols-2 gap-4">
            {(["bottle", "payment"] as const).map((type) => (
              <div key={type}>
                <FieldLabel>
                  {type === "bottle" ? "Bottle Photo" : "Payment Proof"}
                </FieldLabel>
                <label className="block w-full h-32 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer overflow-hidden bg-gray-50">
                  {form[`${type}Image`] ? (
                    <Image
                      src={form[`${type}Image`]!}
                      alt="Receipt"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <Upload className="text-gray-400" />
                  )}
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => handleUpload(type, e)}
                  />
                </label>
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{ backgroundColor: BRAND_PINK }}
            className="w-full py-6 rounded-3xl font-black uppercase text-white shadow-xl transition-opacity disabled:opacity-50"
          >
            {submitting ? "Sending..." : "Submit Shift Data"}
          </button>
        </form>
      </div>
    </div>
  );
}
