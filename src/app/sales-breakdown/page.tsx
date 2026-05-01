"use client";

import { useState, useRef, ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import { ChevronDown, Upload, X, CheckCircle2 } from "lucide-react";
import { T, PALETTE } from "@/styles/theme";

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

interface SalesForm {
  date: string;
  venue: string;
  name: string;
  bottles: string;
  cash: string;
  barAmount: string;
  paidBarDirectly: "YES" | "NO";
  agencySentMoney: "YES" | "NO";
  agencyAmount: string;
  images: string[];
}

const INITIAL: SalesForm = {
  date: "",
  venue: "",
  name: "",
  bottles: "",
  cash: "",
  barAmount: "",
  paidBarDirectly: "NO",
  agencySentMoney: "NO",
  agencyAmount: "",
  images: [],
};

function FieldLabel({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label
      style={{ color: T.text.muted }}
      className="block text-[10px] font-black uppercase tracking-[0.15em] mb-2"
    >
      {children}{" "}
      {required && (
        <span
          style={{ color: T.text.brand }}
          className="ml-1"
        >
          *
        </span>
      )}
    </label>
  );
}

export default function SalesTrackerPage() {
  const [form, setForm] = useState<SalesForm>(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const upd = (patch: Partial<SalesForm>) =>
    setForm((f) => ({ ...f, ...patch }));

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (form.images.length + files.length > 2) {
      alert("Max 2 images allowed");
      e.target.value = "";
      return;
    }

    const newImagesPromises = files.map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(newImagesPromises).then((base64Strings) => {
      setForm((prev) => ({
        ...prev,
        images: [...prev.images, ...base64Strings],
      }));
      if (fileInputRef.current) fileInputRef.current.value = "";
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) setSubmitted(true);
    } catch (err) {
      alert("Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted)
    return (
      <div
        style={{ background: T.bg.page }}
        className="min-h-screen flex items-center justify-center p-6 text-center"
      >
        <div
          style={{
            background: T.bg.surface,
            border: `1px solid ${T.border.default}`,
          }}
          className="p-12 rounded-[3rem]"
        >
          <CheckCircle2
            className="w-16 h-16 mx-auto mb-6"
            style={{ color: T.text.badge.approved }}
          />
          <h2
            style={{ color: T.text.primary }}
            className="text-2xl font-black mb-6 uppercase tracking-tighter"
          >
            Shift Submitted
          </h2>
          <button
            onClick={() => {
              setSubmitted(false);
              setForm(INITIAL);
            }}
            style={{
              backgroundColor: T.brand.primary,
              color: T.brand.primaryText,
            }}
            className="px-8 py-4 rounded-2xl font-black uppercase text-xs"
          >
            New Entry
          </button>
        </div>
      </div>
    );

  return (
    <div
      style={{ background: T.bg.page, color: T.text.primary }}
      className="min-h-screen p-6 font-sans"
    >
      <div className="max-w-xl mx-auto py-12 space-y-8">
        <header className="text-center">
          <h1
            className="text-4xl font-black italic tracking-tighter uppercase"
            style={{ color: T.text.brand }}
          >
            Sales Breakdown
          </h1>
        </header>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* SECTION 1: IDENTITY */}
          <div
            style={{
              background: T.bg.surface,
              border: `1px solid ${T.border.default}`,
            }}
            className="p-8 rounded-[2.5rem] space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <FieldLabel required>Date</FieldLabel>
                <input
                  type="date"
                  style={{
                    colorScheme: "light",
                    background: T.bg.inputHover,
                    border: `1px solid ${T.border.input}`,
                    color: T.text.primary,
                  }}
                  className="w-full rounded-2xl px-6 py-4 text-sm outline-none focus:border-pink-400"
                  value={form.date}
                  onChange={(e) => upd({ date: e.target.value })}
                  required
                />
              </div>
              <div>
                <FieldLabel required>Venue</FieldLabel>
                <div className="relative">
                  <select
                    style={{
                      background: T.bg.inputHover,
                      border: `1px solid ${T.border.input}`,
                      color: T.text.primary,
                    }}
                    className="w-full rounded-2xl px-6 py-4 text-sm outline-none appearance-none cursor-pointer focus:border-pink-400"
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
                  <ChevronDown
                    className="absolute right-6 top-4 w-4 h-4 pointer-events-none"
                    style={{ color: T.text.muted }}
                  />
                </div>
              </div>
            </div>
            <div>
              <FieldLabel required>Full Name</FieldLabel>
              <input
                style={{
                  background: T.bg.inputHover,
                  border: `1px solid ${T.border.input}`,
                  color: T.text.primary,
                }}
                className="w-full rounded-2xl px-6 py-4 text-sm outline-none focus:border-pink-400 placeholder:text-gray-400"
                value={form.name}
                placeholder="Enter your name"
                onChange={(e) => upd({ name: e.target.value })}
                required
              />
            </div>
          </div>

          {/* SECTION 2: BAR PAYMENT LOGIC */}
          <div
            style={{
              background: T.bg.surface,
              border: `1px solid ${T.border.default}`,
            }}
            className="p-8 rounded-[2.5rem] space-y-6"
          >
            <div className="grid grid-cols-1 gap-6">
              <div>
                <FieldLabel required>Amount paid or owed to the bar</FieldLabel>
                <input
                  type="number"
                  step="0.01"
                  placeholder="£0.00"
                  style={{
                    background: T.bg.inputHover,
                    border: `1px solid ${T.border.input}`,
                    color: T.text.primary,
                  }}
                  className="w-full rounded-2xl px-6 py-4 text-sm outline-none focus:border-pink-400 placeholder:text-gray-400"
                  value={form.barAmount}
                  onChange={(e) => upd({ barAmount: e.target.value })}
                  required
                />
              </div>
              <div>
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
                          ? {
                              backgroundColor: T.brand.primary,
                              color: T.brand.primaryText,
                            }
                          : {
                              background: T.bg.surfaceAlt,
                              color: T.text.muted,
                              border: `1px solid ${T.border.default}`,
                            }
                      }
                      className="flex-1 py-4 rounded-2xl font-black text-xs transition-all"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: AGENCY LOGIC */}
          <div
            style={{
              background: T.bg.surface,
              border: `1px solid ${T.border.default}`,
            }}
            className="p-8 rounded-[2.5rem] space-y-6"
          >
            <FieldLabel required>
              Did the agency send you money to help pay the bar?
            </FieldLabel>
            <div className="flex gap-4">
              {(["YES", "NO"] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() =>
                    upd({
                      agencySentMoney: opt,
                      agencyAmount: opt === "NO" ? "0" : form.agencyAmount,
                    })
                  }
                  style={
                    form.agencySentMoney === opt
                      ? {
                          backgroundColor: T.brand.primary,
                          color: T.brand.primaryText,
                        }
                      : {
                          background: T.bg.surfaceAlt,
                          color: T.text.muted,
                          border: `1px solid ${T.border.default}`,
                        }
                  }
                  className="flex-1 py-4 rounded-2xl font-black text-xs transition-all"
                >
                  {opt}
                </button>
              ))}
            </div>
            {form.agencySentMoney === "YES" && (
              <div className="pt-2 animate-in fade-in slide-in-from-top-2">
                <FieldLabel required>How much did the agency send?</FieldLabel>
                <input
                  type="number"
                  step="0.01"
                  placeholder="£0.00"
                  style={{
                    background: T.bg.inputHover,
                    border: `1px solid ${T.border.input}`,
                    color: T.text.primary,
                  }}
                  className="w-full rounded-2xl px-6 py-4 text-sm outline-none focus:border-pink-400 placeholder:text-gray-400"
                  value={form.agencyAmount}
                  onChange={(e) => upd({ agencyAmount: e.target.value })}
                  required
                />
              </div>
            )}
          </div>

          {/* SECTION 4: SALES DATA */}
          <div
            style={{
              background: T.bg.surface,
              border: `1px solid ${T.border.default}`,
            }}
            className="p-8 rounded-[2.5rem] space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FieldLabel required>Exact units sold (e.g. 3.5)</FieldLabel>
                <input
                  type="number"
                  step="0.01"
                  style={{
                    background: T.bg.inputHover,
                    border: `1px solid ${T.border.input}`,
                    color: T.text.primary,
                  }}
                  className="w-full rounded-2xl px-6 py-4 text-sm outline-none focus:border-pink-400"
                  value={form.bottles}
                  onChange={(e) => upd({ bottles: e.target.value })}
                  required
                />
              </div>
              <div>
                <FieldLabel required>Physical Cash Collected</FieldLabel>
                <input
                  type="number"
                  step="0.01"
                  placeholder="£0.00"
                  style={{
                    background: T.bg.inputHover,
                    border: `1px solid ${T.border.input}`,
                    color: T.text.primary,
                  }}
                  className="w-full rounded-2xl px-6 py-4 text-sm outline-none focus:border-pink-400 placeholder:text-gray-400"
                  value={form.cash}
                  onChange={(e) => upd({ cash: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          {/* SECTION 5: Images */}
          <div
            style={{
              background: T.bg.surface,
              border: `1px solid ${T.border.default}`,
            }}
            className="p-8 rounded-[2.5rem] space-y-6"
          >
            <FieldLabel>Upload Images</FieldLabel>
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{ border: `2px dashed ${T.border.strong}` }}
              className="rounded-[2rem] p-8 text-center cursor-pointer hover:border-pink-400 transition-all group"
            >
              <Upload
                className="w-8 h-8 mx-auto mb-2 opacity-20 group-hover:opacity-100"
                style={{ color: T.text.primary }}
              />
              <p
                style={{ color: T.text.muted }}
                className="text-[10px] font-bold uppercase tracking-widest"
              >
                Tap to upload images
              </p>
              <input
                type="file"
                ref={fileInputRef}
                hidden
                multiple
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>
            {form.images.length > 0 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2 no-scrollbar">
                {form.images.map((img, i) => (
                  <div
                    key={i}
                    style={{ border: `1px solid ${T.border.default}` }}
                    className="relative w-20 h-20 flex-shrink-0 rounded-2xl overflow-hidden"
                  >
                    <Image
                      src={img}
                      alt="Receipt"
                      fill
                      className="object-cover opacity-60"
                      unoptimized
                    />
                    <button
                      type="button"
                      onClick={() =>
                        upd({
                          images: form.images.filter((_, idx) => idx !== i),
                        })
                      }
                      style={{ background: T.bg.page }}
                      className="absolute top-1 right-1 rounded-full p-1"
                    >
                      <X
                        className="w-3 h-3"
                        style={{ color: T.text.primary }}
                      />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <button
              type="submit"
              disabled={submitting}
              style={{
                backgroundColor: T.brand.primary,
                color: T.brand.primaryText,
              }}
              className="w-full py-6 rounded-3xl font-black uppercase tracking-[0.2em] text-xs shadow-xl transition-all disabled:opacity-50"
            >
              {submitting ? "Sending..." : "Submit Shift Data"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
