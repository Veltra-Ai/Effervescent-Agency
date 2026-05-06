import { AccessGate } from "@/security/AccessGate";

export default function CandidatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AccessGate>{children}</AccessGate>;
}
