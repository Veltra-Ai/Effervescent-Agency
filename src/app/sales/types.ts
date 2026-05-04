export interface Sale {
  id: number;
  created_at: string;
  date_of_shift: string;
  venue: string;
  full_name: string;
  bottles_sold: number;
  bar_amount: number;
  cash_collected: number;
  paid_bar_directly: boolean;
  agency_sent_money: boolean;
  agency_amount: number;
  receipt_images: string | null;
}
