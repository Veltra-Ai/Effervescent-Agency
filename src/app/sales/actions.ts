"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { Sale } from "./types";

function calcDerived(sale: Partial<Sale>) {
  const cash = Number(sale.cash_collected ?? 0);
  const card = Number(sale.card_amount ?? 0);
  const bar = Number(sale.bar_amount ?? 0);
  const deductions = Number(sale.deductions ?? 0);
  const agencyFee = Number(sale.agency_fee ?? 0);
  const expectedRev = Number(sale.expected_rev ?? 0);

  const total_revenue = cash + card;
  const seller_comm = (total_revenue - bar) * 0.5;
  const agency_comm = (total_revenue - bar) * 0.5;
  const actual_rev = total_revenue - deductions - agencyFee;
  const difference = expectedRev - actual_rev;

  return { total_revenue, seller_comm, agency_comm, actual_rev, difference };
}

export async function getSales(): Promise<Sale[]> {
  const { data, error } = await supabase
    .from("milli_sales")
    .select("*")
    .order("date_of_shift", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function updateSale(
  id: number,
  editState: Partial<Sale>,
): Promise<Sale> {
  const derived = calcDerived(editState);

  const payload = {
    date_of_shift: editState.date_of_shift,
    city: editState.city,
    venue: editState.venue,
    full_name: editState.full_name,
    bottles_sold: Number(editState.bottles_sold) || 0,
    bar_amount: Number(editState.bar_amount) || 0,
    card_amount: Number(editState.card_amount) || 0,
    cash_collected: Number(editState.cash_collected) || 0,
    deductions: Number(editState.deductions) || 0,
    agency_fee: Number(editState.agency_fee) || 0,
    expected_rev: Number(editState.expected_rev) || 0,
    agency_amount: Number(editState.agency_amount) || 0,
    paid_bar_directly:
      editState.paid_bar_directly === true ||
      (editState.paid_bar_directly as unknown as string) === "true",
    agency_sent_money:
      editState.agency_sent_money === true ||
      (editState.agency_sent_money as unknown as string) === "true",
    status: editState.status,
    ...derived,
  };

  const { data, error } = await supabase
    .from("milli_sales")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/sales");
  return data as Sale;
}
