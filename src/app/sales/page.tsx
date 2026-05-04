import { supabase } from "@/lib/supabase";
import { Sale } from "./types";
import { T } from "@/styles/theme"; // Import your central theme
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
    <div className={`${T.cls.page} bg-gray-900 p-6 md:p-10`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-pink-50 rounded-lg">
            <ShoppingCart className="w-5 h-5 text-pink-500" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Sales Ledger</h1>
        </div>

        <div className={T.cls.tableWrap}>
          <Table>
            <TableHeader className={T.cls.thead}>
              <TableRow className="border-gray-100 hover:bg-transparent">
                <TableHead className={T.cls.th}>Date</TableHead>
                <TableHead className={T.cls.th}>Venue</TableHead>
                <TableHead className={T.cls.th}>Seller</TableHead>
                <TableHead className={T.cls.th + " text-center"}>
                  Units
                </TableHead>
                <TableHead className={T.cls.th + " text-right"}>
                  Bar £
                </TableHead>
                <TableHead className={T.cls.th + " text-right"}>
                  Cash £
                </TableHead>
                <TableHead className={T.cls.th + " text-center"}>
                  Paid Direct
                </TableHead>
                <TableHead className={T.cls.th + " text-right"}>
                  Agency £
                </TableHead>
                <TableHead className={T.cls.th + " text-right"}>
                  Images
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales && sales.length > 0 ? (
                sales.map((sale: Sale) => (
                  <TableRow
                    key={sale.id}
                    className={T.cls.tr}
                  >
                    <TableCell className="text-gray-500 text-xs">
                      {sale.date_of_shift}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="border-gray-200 text-gray-600"
                      >
                        {sale.venue}
                      </Badge>
                    </TableCell>
                    <TableCell className={T.cls.td}>{sale.full_name}</TableCell>
                    <TableCell className="text-center text-gray-500 font-mono">
                      {sale.bottles_sold}
                    </TableCell>
                    <TableCell className="text-right font-mono text-gray-800">
                      £{Number(sale.bar_amount).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-green-700">
                      £{Number(sale.cash_collected).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-center text-lg">
                      {sale.paid_bar_directly ? "✅" : "❌"}
                    </TableCell>
                    <TableCell className="text-right font-mono text-blue-700">
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
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={9}
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
