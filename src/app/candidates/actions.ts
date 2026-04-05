'use server';

import { supabase } from '@/lib/supabase';
import { Candidate } from './types';

const APPROVED_WEBHOOK = 'https://n8n.veltraai.net/webhook/candidate-approved';

export async function approveCandidate(candidate: Candidate): Promise<{ error?: string }> {
  const { error } = await supabase
    .from('milli_candidates')
    .update({ status: 'approved' })
    .eq('id', candidate.id);

  if (error) return { error: error.message };

  try {
    await fetch(APPROVED_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...candidate, status: 'approved' }),
    });
  } catch {
    // Webhook failure is non-fatal — status is already updated
  }

  return {};
}

export async function rejectCandidate(id: string): Promise<{ error?: string }> {
  const { error } = await supabase
    .from('milli_candidates')
    .update({ status: 'rejected' })
    .eq('id', id);

  if (error) return { error: error.message };
  return {};
}
