"use client";
import React, { useEffect, useState } from "react";
import { exportToPDF } from "@/Utils/Exportpdf";
import { exportToCSV } from "@/Utils/exportToCsv";
import Header from "../../../Layout/header/Header";
import Headertransaction from "@/transactionheader/Headertransaction";
import Table from "@/TransactionTable/Table";
import Panel from "@/Filterpanle/Panel";
import { supabase } from "@/Utils/supabaseClient";
import { useCurrency } from "@/Utils/CurencyContext/Curencycontext";

export type Transaction = {
  id: number;
  category: string;
  type: "income" | "expense";
  payment_mode: string;
  amount: number;
  description?: string;
  date?: string;
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from("transactions").select("*");
      if (!error && data) {
        setTransactions(data);
        setFilteredTransactions(data);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("realtime-transactions")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "transactions" },
        (payload) => {
          console.log("Realtime event:", payload);

          if (payload.eventType === "INSERT" && payload.new) {
            const newData = payload.new as Transaction;
            setTransactions((prev) => [...prev, newData]);
            setFilteredTransactions((prev) => [...prev, newData]);
          } else if (payload.eventType === "UPDATE" && payload.new) {
            const updatedData = payload.new as Transaction;
            setTransactions((prev) =>
              prev.map((t) => (t.id === updatedData.id ? updatedData : t))
            );
            setFilteredTransactions((prev) =>
              prev.map((t) => (t.id === updatedData.id ? updatedData : t))
            );
          } else if (payload.eventType === "DELETE" && payload.old) {
            const deletedId = payload.old.id;
            setTransactions((prev) => prev.filter((t) => t.id !== deletedId));
            setFilteredTransactions((prev) =>
              prev.filter((t) => t.id !== deletedId)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleExportCSV = () => {
    exportToCSV(
      filteredTransactions.length ? filteredTransactions : transactions,
      "transactions.csv"
    );
  };
  const { curency, symbol, rate } = useCurrency();
  const handleExportPDF = () => {
    exportToPDF(
      filteredTransactions.length ? filteredTransactions : transactions,
      { curency, symbol, rate },
      "transactions.pdf"
    );
  };

  const applyFilters = (filters: any) => {
    let filtered = [...transactions];

    if (filters.category) {
      filtered = filtered.filter(
        (t) => t.category.toLowerCase() === filters.category.toLowerCase()
      );
    }

    if (filters.cashflow?.length > 0) {
      filtered = filtered.filter((t) => filters.cashflow.includes(t.type));
    }

    if (filters.paymentMode?.length > 0) {
      filtered = filtered.filter((t) =>
        filters.paymentMode.includes(t.payment_mode)
      );
    }

    if (filters.minAmount) {
      filtered = filtered.filter((t) => t.amount >= Number(filters.minAmount));
    }
    if (filters.maxAmount) {
      filtered = filtered.filter((t) => t.amount <= Number(filters.maxAmount));
    }

    setFilteredTransactions(filtered);
  };

  const resetFilters = () => {
    setFilteredTransactions(transactions);
    setSearchQuery("");
  };

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredTransactions(transactions);
    } else {
      const q = searchQuery.toLowerCase();
      const filtered = transactions.filter(
        (t) =>
          t.category.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q) ||
          t.payment_mode.toLowerCase().includes(q)
      );
      setFilteredTransactions(filtered);
    }
  }, [searchQuery, transactions]);

  return (
    <div className="min-h-screen bg-gray-700 text-white flex flex-col 2xl:flex-row">
      <aside className="w-full lg:w-64 fixed lg:static top-0 left-0 z-40 bg-gray-900">
        <Header />
      </aside>

      <main className="flex-1 flex flex-col mt-16 lg:mt-0 lg:ml-64 p-4 space-y-6 transition-all duration-300">
        <div className="p-4 rounded-lg text-dark-800">
          <Headertransaction
            onSearch={setSearchQuery}
            onExportCSV={handleExportCSV}
            onExportPDF={handleExportPDF}
          />
        </div>

        <section className="p-4 rounded-lg w-full text-gray-800">
          <Panel
            onApply={applyFilters}
            onReset={resetFilters}
            currency={curency}
          />
        </section>

        <section className="p-4 rounded-lg overflow-x-auto text-gray-800">
          <Table
            transaction={filteredTransactions}
            filteredIds={filteredTransactions.map((t) => t.id)}
            searchQuery={searchQuery}
          />
        </section>
      </main>
    </div>
  );
}
