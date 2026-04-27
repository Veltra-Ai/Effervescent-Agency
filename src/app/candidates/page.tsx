import { supabase } from "@/lib/supabase";
import { CandidatesDashboard } from "./CandidatesDashboard";
import { AccessGate } from "../../security/AccessGate";
import { Candidate } from "./types";

export const dynamic = "force-dynamic";

export default async function CandidatesPage() {
  const { data, error } = await supabase
    .from("milli_candidates")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <AccessGate>
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 max-w-md w-full text-center">
            <p className="text-red-400 font-semibold mb-2">
              Failed to load candidates
            </p>
            <p className="text-gray-500 text-sm">{error.message}</p>
          </div>
        </div>
      </AccessGate>
    );
  }

  return (
    <AccessGate>
      <CandidatesDashboard initialCandidates={(data as Candidate[]) ?? []} />
    </AccessGate>
  );
}
