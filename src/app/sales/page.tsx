import { supabase } from "@/lib/supabase";
import { Sale } from "./types";
import { T } from "@/styles/theme";
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

function statusBadge(status: string) {
  const map: Record<string, string> = {
    Paid: "bg-green-100 text-green-700 border-green-200",
    Pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    Disputed: "bg-red-100 text-red-700 border-red-200",
  };
  return map[status] ?? "bg-gray-100 text-gray-600 border-gray-200";
}

function mono(val: number | null | undefined) {
  return `£${Number(val ?? 0).toFixed(2)}`;
}

export default async function SalesPage() {
  const { data: sales, error } = await supabase
    .from("milli_sales")
    .select("*")
    .order("date_of_shift", { ascending: false });

  return (
    <div className={`${T.cls.page} bg-gray-900 p-6 md:p-10`}>
      <div className="max-w-[1600px] mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-pink-50 rounded-lg">
            <ShoppingCart className="w-5 h-5 text-pink-500" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Sales Ledger</h1>
        </div>

        <div className={T.cls.tableWrap + " overflow-x-auto"}>
          <Table>
            <TableHeader className={T.cls.thead}>
              <TableRow className="border-gray-100 hover:bg-transparent">
                <TableHead className={T.cls.th}>Date</TableHead>
                <TableHead className={T.cls.th}>City</TableHead>
                <TableHead className={T.cls.th}>Venue</TableHead>
                <TableHead className={T.cls.th}>Seller</TableHead>
                <TableHead className={T.cls.th + " text-center"}>
                  Units
                </TableHead>
                <TableHead className={T.cls.th + " text-right"}>
                  Bar Earning
                </TableHead>
                <TableHead className={T.cls.th + " text-right"}>
                  Card £
                </TableHead>
                <TableHead className={T.cls.th + " text-right"}>
                  Cash £
                </TableHead>
                <TableHead className={T.cls.th + " text-right"}>
                  Total Rev
                </TableHead>
                <TableHead className={T.cls.th + " text-right"}>
                  Seller Comm
                </TableHead>
                <TableHead className={T.cls.th + " text-right"}>
                  Agency Comm
                </TableHead>
                <TableHead className={T.cls.th + " text-right"}>
                  Deductions
                </TableHead>
                <TableHead className={T.cls.th + " text-right"}>
                  Agency Fee
                </TableHead>
                <TableHead className={T.cls.th + " text-right"}>
                  Expected Rev
                </TableHead>
                <TableHead className={T.cls.th + " text-right"}>
                  Actual Rev
                </TableHead>
                <TableHead className={T.cls.th + " text-right"}>
                  Difference
                </TableHead>
                <TableHead className={T.cls.th + " text-center"}>
                  Paid Bar?
                </TableHead>
                <TableHead className={T.cls.th + " text-center"}>
                  Agency Sent?
                </TableHead>
                <TableHead className={T.cls.th + " text-right"}>
                  Agency £
                </TableHead>
                <TableHead className={T.cls.th + " text-center"}>
                  Status
                </TableHead>
                <TableHead className={T.cls.th + " text-right"}>
                  Images
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales && sales.length > 0 ? (
                sales.map((sale: Sale) => {
                  const diff = Number(sale.difference ?? 0);
                  return (
                    <TableRow
                      key={sale.id}
                      className={T.cls.tr}
                    >
                      <TableCell className="text-gray-500 text-xs whitespace-nowrap">
                        {sale.date_of_shift}
                      </TableCell>
                      <TableCell className="text-gray-600 text-xs whitespace-nowrap">
                        {sale.city ?? "—"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="border-gray-200 text-gray-600 whitespace-nowrap"
                        >
                          {sale.venue}
                        </Badge>
                      </TableCell>
                      <TableCell className={T.cls.td + " whitespace-nowrap"}>
                        {sale.full_name}
                      </TableCell>
                      <TableCell className="text-center text-gray-500 font-mono">
                        {sale.bottles_sold}
                      </TableCell>
                      <TableCell className="text-right font-mono text-gray-800">
                        {mono(sale.bar_amount)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-gray-800">
                        {mono(sale.card_amount)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-green-700">
                        {mono(sale.cash_collected)}
                      </TableCell>
                      <TableCell className="text-right font-mono font-bold text-gray-900">
                        {mono(sale.total_revenue)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-purple-700">
                        {mono(sale.seller_comm)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-blue-700">
                        {mono(sale.agency_comm)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-red-500">
                        {mono(sale.deductions)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-orange-600">
                        {mono(sale.agency_fee)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-gray-500">
                        {mono(sale.expected_rev)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-gray-800">
                        {mono(sale.actual_rev)}
                      </TableCell>
                      <TableCell
                        className={`text-right font-mono font-bold ${diff < 0 ? "text-red-600" : "text-green-600"}`}
                      >
                        {mono(diff)}
                      </TableCell>
                      <TableCell className="text-center text-lg">
                        {sale.paid_bar_directly ? "✅" : "❌"}
                      </TableCell>
                      <TableCell className="text-center text-lg">
                        {sale.agency_sent_money ? "✅" : "❌"}
                      </TableCell>
                      <TableCell className="text-right font-mono text-blue-700">
                        {mono(sale.agency_amount)}
                      </TableCell>
                      <TableCell className="text-center">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusBadge(sale.status)}`}
                        >
                          {sale.status ?? "Pending"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          {sale.receipt_images ? (
                            sale.receipt_images.split(", ").map((url, i) => (
                              // Added the <a tag here
                              <a
                                key={i}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer" // Recommended for security with target="_blank"
                                className="text-pink-500 hover:text-pink-600 transition-colors"
                              >
                                <Receipt className="w-4 h-4" />
                              </a>
                            ))
                          ) : (
                            <span className="text-[10px] text-gray-400 italic">
                              None
                            </span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={21}
                    className="h-48 text-center"
                  >
                    <div className="flex flex-col items-center justify-center text-gray-400 gap-2">
                      <Database className="w-8 h-8 opacity-20" />
                      <p className="text-sm font-medium text-gray-800">
                        No records found
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
