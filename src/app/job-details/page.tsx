"use client";

import { useState } from "react";
import {
  Smartphone,
  PlayCircle,
  Award,
  Shirt,
  AlertTriangle,
  ExternalLink,
  Upload,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { T, PALETTE } from "@/styles/theme";

export default function JobDetailsPage() {
  const [email, setEmail] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !file) {
      alert("Please provide both your email and the certificate file.");
      return;
    }

    setStatus("uploading");

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("certificate", file);

      const response = await fetch(
        "https://n8n.veltraai.net/webhook/certificate-uploaded-on-job-details-page",
        {
          method: "POST",
          body: formData,
        },
      );

      if (response.ok) {
        setStatus("success");
        alert("Submitted successfully!");
        setEmail("");
        setFile(null);
      } else {
        throw new Error("Failed to upload");
      }
    } catch (error) {
      console.error(error);
      setStatus("error");
      alert(
        "There was an error submitting your certificate. Please try again.",
      );
    } finally {
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <div
      style={{ background: T.bg.page, color: T.text.primary }}
      className="min-h-screen py-12 px-6"
    >
      <div className="max-w-2xl mx-auto">
        <header className="mb-10">
          <h1
            className="text-3xl font-black mb-2 italic"
            style={{ color: T.text.brand }}
          >
            WELCOME TO EFFERVESCENT 💃
          </h1>
          <p
            style={{ color: T.text.muted }}
            className="text-sm leading-relaxed"
          >
            Thank you for completing your onboarding form and availability
            submission. We've now sent you the next steps so you can begin
            preparing to work with us as a self-employed contractor.
          </p>
        </header>

        <div className="space-y-8">
          {/* 1. RotaCloud */}
          <section
            style={{
              background: T.bg.surface,
              border: `1px solid ${T.border.default}`,
            }}
            className="rounded-3xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Smartphone
                className="w-5 h-5"
                style={{ color: T.text.brand }}
              />
              <h2
                style={{ color: T.text.primary }}
                className="font-bold text-lg"
              >
                1. RotaCloud
              </h2>
            </div>
            <div
              style={{ color: T.text.muted }}
              className="text-sm space-y-3"
            >
              <p>
                You should now have received an email invitation to join
                RotaCloud. Please accept this as soon as possible — this is
                where you will view and accept shifts.
              </p>
              <div
                style={{
                  background: T.bg.surfaceAlt,
                  border: `1px solid ${T.border.default}`,
                }}
                className="p-4 rounded-xl space-y-2"
              >
                <p
                  style={{ color: T.text.primary }}
                  className="font-medium"
                >
                  Once logged in:
                </p>
                <ul className="list-disc ml-5 space-y-1">
                  <li>Download the RotaCloud app</li>
                  <li>Upload a clear profile photo of yourself</li>
                </ul>
              </div>
              <p className="text-xs italic">
                If you cannot find the invitation email, please check your
                junk/spam folder.
              </p>
            </div>
          </section>

          {/* 2. Training */}
          <section
            style={{
              background: T.bg.surface,
              border: `1px solid ${T.border.default}`,
            }}
            className="rounded-3xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <PlayCircle
                className="w-5 h-5"
                style={{ color: T.text.brand }}
              />
              <h2
                style={{ color: T.text.primary }}
                className="font-bold text-lg"
              >
                2. Training Videos
              </h2>
            </div>
            <p
              style={{ color: T.text.muted }}
              className="text-sm mb-4"
            >
              Please watch all training videos before your first shift. These
              explain how shifts work, sales techniques, venue expectations and
              equipment setup.
            </p>
            <a
              href="https://drive.google.com/drive/folders/1Pzvi1CYl7_o0X6xNHkZ9_k7bLO_3Rvz8?usp=sharing"
              style={{
                background: T.brand.soft,
                border: `1px solid ${T.brand.softBorder}`,
              }}
              className="flex items-center justify-between p-4 rounded-2xl hover:opacity-80 transition-opacity"
            >
              <span
                style={{ color: T.brand.primary }}
                className="font-bold"
              >
                Access Training Vault
              </span>
              <ExternalLink
                className="w-4 h-4"
                style={{ color: T.brand.primary }}
              />
            </a>
          </section>

          {/* 3. Challenge 25 */}
          <section
            style={{
              background: T.bg.surface,
              border: `1px solid ${T.border.default}`,
            }}
            className="rounded-3xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Award
                className="w-5 h-5"
                style={{ color: T.text.brand }}
              />
              <h2
                style={{ color: T.text.primary }}
                className="font-bold text-lg"
              >
                3. Challenge 25 Training (Mandatory)
              </h2>
            </div>
            <div
              style={{ color: T.text.muted }}
              className="text-sm space-y-4"
            >
              <p>
                This is mandatory to work in nightlife environments. Please
                complete the course within 1 week, or before your first shift if
                sooner.
              </p>
              <div className="space-y-2">
                <a
                  href="https://lccexternal.astute-elearning.com/Content/LXP/LXPLogin.aspx?ReturnUrl=%2f"
                  style={{
                    background: T.bg.surfaceAlt,
                    border: `1px solid ${T.border.default}`,
                    color: T.text.primary,
                  }}
                  className="block p-3 rounded-xl text-center font-bold hover:opacity-80 transition-opacity"
                >
                  Start E-Learning
                </a>
                <a
                  href="https://drive.google.com/file/d/1PHQkrDCJIekD1BvyGpNsfY_sqU9NgnkE/view?usp=sharing"
                  style={{ color: T.text.muted }}
                  className="block text-center text-xs underline"
                >
                  Watch: How to enrol (Demo Video)
                </a>
              </div>

              {/* Upload Certificate Form */}
              <form
                onSubmit={handleUpload}
                style={{
                  background: T.bg.surfaceAlt,
                  border: `1px dashed ${T.border.strong}`,
                }}
                className="mt-6 p-5 rounded-2xl space-y-4"
              >
                <p
                  style={{ color: T.text.primary }}
                  className="font-bold text-xs uppercase tracking-wider"
                >
                  Upload Certificate
                </p>

                <input
                  type="email"
                  placeholder="Your Email Address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    background: T.bg.input,
                    border: `1px solid ${T.border.input}`,
                    color: T.text.primary,
                  }}
                  className="w-full rounded-xl px-4 py-2 text-sm focus:outline-none transition-colors placeholder:text-gray-400"
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = T.border.inputFocus;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = T.border.input;
                  }}
                />

                <div className="relative">
                  <input
                    type="file"
                    id="cert-upload"
                    required
                    accept=".pdf,image/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                  <label
                    htmlFor="cert-upload"
                    style={{
                      background: T.bg.surface,
                      border: `1px solid ${T.border.default}`,
                      color: T.text.muted,
                    }}
                    className="flex items-center justify-center gap-2 w-full p-3 rounded-xl cursor-pointer hover:opacity-80 transition-all text-xs font-medium"
                  >
                    {file ? (
                      <span
                        style={{ color: T.text.primary }}
                        className="truncate"
                      >
                        {file.name}
                      </span>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        <span>Select Certificate (PDF/Image)</span>
                      </>
                    )}
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={status === "uploading"}
                  className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  style={{
                    backgroundColor: T.brand.primary,
                    color: T.brand.primaryText,
                  }}
                >
                  {status === "uploading" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : status === "success" ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : null}
                  {status === "uploading"
                    ? "Uploading..."
                    : "Submit Certificate"}
                </button>
              </form>

              <p className="text-center text-xs font-medium">
                Alternatively, email certificate to:{" "}
                <span style={{ color: T.text.brand }}>
                  hello@effervescent.agency
                </span>
              </p>
            </div>
          </section>

          {/* Dress Code */}
          <section
            style={{
              background: T.bg.surface,
              border: `1px solid ${T.border.default}`,
            }}
            className="rounded-3xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Shirt
                className="w-5 h-5"
                style={{ color: T.text.brand }}
              />
              <h2
                style={{ color: T.text.primary }}
                className="font-bold text-lg"
              >
                Dress Code
              </h2>
            </div>
            <div
              style={{ color: T.text.muted }}
              className="text-sm space-y-3"
            >
              <p>
                Standard dress code is{" "}
                <span
                  style={{ color: T.text.primary }}
                  className="font-bold underline"
                >
                  ALL BLACK
                </span>{" "}
                unless otherwise stated. We expect everyone representing
                Effervescent to take pride in their appearance.
              </p>
              <div className="grid grid-cols-2 gap-2 text-[11px] uppercase font-bold tracking-widest">
                {[
                  "No Tracksuits",
                  "No Gymwear",
                  "No Jeans",
                  "No Trainers*",
                ].map((rule) => (
                  <div
                    key={rule}
                    style={{
                      background: T.bg.badge.rejected,
                      border: `1px solid ${PALETTE.red}22`,
                      color: T.text.badge.rejected,
                    }}
                    className="p-2 rounded"
                  >
                    {rule}
                  </div>
                ))}
              </div>
              <p className="text-[10px]">
                *Except black Converse-style trainers.
              </p>
            </div>
          </section>

          {/* Ground Rules */}
          <section
            style={{
              background: T.bg.badge.rejected,
              border: `1px solid ${PALETTE.red}33`,
            }}
            className="rounded-3xl p-6"
          >
            <div
              className="flex items-center gap-3 mb-4"
              style={{ color: T.text.badge.rejected }}
            >
              <AlertTriangle className="w-5 h-5" />
              <h2 className="font-bold text-lg uppercase tracking-tight">
                Important Ground Rules
              </h2>
            </div>
            <div
              style={{ color: T.text.muted }}
              className="text-xs space-y-4"
            >
              <div className="space-y-2">
                <p
                  style={{ color: T.text.primary }}
                  className="font-bold uppercase"
                >
                  No drinking or drug use
                </p>
                <p>
                  This results in immediate termination of the contractor
                  relationship.
                </p>
              </div>
              <div className="space-y-1">
                <p
                  style={{ color: T.text.primary }}
                  className="font-bold"
                >
                  Sickness & Cancellations
                </p>
                <p>
                  Report sickness before 10am. Two cancellations in 3 months may
                  result in suspension.
                </p>
              </div>
              <div className="space-y-1">
                <p
                  style={{ color: T.text.primary }}
                  className="font-bold"
                >
                  Shift Allocation
                </p>
                <p>
                  Based on performance, reliability, and venue feedback. Busiest
                  shifts go to those who arrive prepared.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
