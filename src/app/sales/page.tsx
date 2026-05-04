import { supabase } from "@/lib/supabase";
import { Sale } from "./types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Receipt, ShoppingCart, Database } from "lucide-react";

export default async function SalesPage() {
  const { data: sales, error } = await supabase
    .from("milli_sales")
    .select("*")
    .order("date_of_shift", { ascending: false });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e5e7eb] p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-[#ffb6c1]/10 rounded-lg">
            <ShoppingCart className="w-5 h-5 text-[#ffb6c1]" />
          </div>
          <h1 className="text-xl font-bold text-white">Sales Ledger</h1>
        </div>

        <div className="bg-[#111111] rounded-xl border border-white/5 overflow-hidden shadow-2xl">
          <Table>
            <TableHeader className="bg-[#1a1a1a]">
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="text-gray-500 text-[10px] uppercase">
                  Date
                </TableHead>
                <TableHead className="text-gray-500 text-[10px] uppercase">
                  Venue
                </TableHead>
                <TableHead className="text-gray-500 text-[10px] uppercase">
                  Seller
                </TableHead>
                <TableHead className="text-gray-500 text-[10px] uppercase text-center">
                  Units
                </TableHead>
                <TableHead className="text-gray-500 text-[10px] uppercase text-right">
                  Bar £
                </TableHead>
                <TableHead className="text-gray-500 text-[10px] uppercase text-right">
                  Cash £
                </TableHead>
                <TableHead className="text-gray-500 text-[10px] uppercase text-center">
                  Paid Direct
                </TableHead>
                <TableHead className="text-gray-500 text-[10px] uppercase text-right">
                  Agency £
                </TableHead>
                <TableHead className="text-gray-500 text-[10px] uppercase text-right">
                  Images
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales && sales.length > 0 ? (
                sales.map((sale: Sale) => (
                  <TableRow
                    key={sale.id}
                    className="border-white/5 hover:bg-white/[0.02]"
                  >
                    <TableCell className="text-gray-400 text-xs">
                      {sale.date_of_shift}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="border-white/10 text-gray-300"
                      >
                        {sale.venue}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-200">
                      {sale.full_name}
                    </TableCell>
                    <TableCell className="text-center text-gray-400 font-mono">
                      {sale.bottles_sold}
                    </TableCell>
                    <TableCell className="text-right font-mono text-gray-300">
                      £{Number(sale.bar_amount).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-green-400">
                      £{Number(sale.cash_collected).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-center text-lg">
                      {sale.paid_bar_directly ? "✅" : "❌"}
                    </TableCell>
                    <TableCell className="text-right font-mono text-blue-400">
                      £{Number(sale.agency_amount).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {sale.receipt_images ? (
                          sale.receipt_images.split(", ").map((url, i) => (
                            <a
                              key={i}
                              href={url}
                              target="_blank"
                              className="text-[#ffb6c1] hover:text-white transition-colors"
                            >
                              <Receipt className="w-4 h-4" />
                            </a>
                          ))
                        ) : (
                          <span className="text-[10px] text-gray-700 italic">
                            None
                          </span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="h-48 text-center"
                  >
                    <div className="flex flex-col items-center justify-center text-gray-500 gap-2">
                      <Database className="w-8 h-8 opacity-20" />
                      <p className="text-sm font-medium text-gray-300">
                        No records found
                      </p>
                      <p className="text-xs">
                        Please submit your shift details via the tracker to see
                        data here.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
