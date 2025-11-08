import { Transaction } from "@/app/transaction/page";

export function exportToCSV(transactions: Transaction[], filename = "transactions.csv") {
  if (!transactions || transactions.length === 0) {
    alert("No transactions to export.");
    return;
  }

  const headers = ["Date", "Category", "Type", "Payment Mode", "Description", "Amount"];

  const escapeCSV = (value: any) => {
    if (value === null || value === undefined) return "";
    const str = String(value);
   
    if (/[",\n]/.test(str)) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const rows = transactions.map((t) =>
    [
      escapeCSV(t.date ?? ""),
      escapeCSV(t.category),
      escapeCSV(t.type),
      escapeCSV(t.payment_mode),
      escapeCSV(t.description ?? ""),
      escapeCSV(t.amount),
    ].join(",")
  );

  const csvContent = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
