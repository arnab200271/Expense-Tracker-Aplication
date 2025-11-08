import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { convertCurrency } from "@/Utils/CurencyConverter/Converter";

type CurrencyData = {
  curency: string;
  symbol: string;
  rate: number;
};

//  Main export to PDF function
export function exportToPDF(
  transactions: any[],
  currencyData?: CurrencyData,
  filename = "transactions.pdf"
) {
  // if (!transactions || transactions.length === 0) {
  //   alert("No transactions to export.");
  //   return;
  // }

  //  Safe fallback for undefined currencyData
  const curency = currencyData?.curency || "INR";
  const symbol = currencyData?.symbol || "₹";
  const rate = currencyData?.rate || 1;

  console.log("📄 Exporting PDF with:", { curency, symbol, rate });

  // Create new PDF document
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  doc.setFontSize(14);
  doc.text("Transaction Report", 40, 40);

  //  Calculate totals (converted)
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce(
      (sum, t) => sum + convertCurrency(Number(t.amount), "INR", curency),
      0
    );

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce(
      (sum, t) => sum + convertCurrency(Number(t.amount), "INR", curency),
      0
    );

  //  Display totals
  doc.setFontSize(11);
  doc.text(`Total Income: ${symbol}${totalIncome.toLocaleString()}`, 40, 60);
  doc.text(`Total Expense: ${symbol}${totalExpense.toLocaleString()}`, 40, 76);

  // 📋 Table data with converted amounts
  const rows = transactions.map((t) => [
    t.date ?? "",
    t.category ?? "",
    t.type ?? "",
    t.payment_mode ?? "",
    t.description ?? "",
    `${symbol}${convertCurrency(Number(t.amount), "INR", curency).toLocaleString()}`,
  ]);

  autoTable(doc, {
    head: [["Date", "Category", "Type", "Payment", "Description", "Amount"]],
    body: rows,
    startY: 100,
    styles: { fontSize: 9, cellPadding: 4 },
    headStyles: { fillColor: [22, 160, 133] }, // nice teal color
  });

  //  Save the file
  doc.save(filename);
}
