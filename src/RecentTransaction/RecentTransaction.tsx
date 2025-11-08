"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/Utils/supabaseClient";
import { useCurrency } from "@/Utils/CurencyContext/Curencycontext";
import { convertCurrency } from "@/Utils/CurencyConverter/Converter";

type Transaction = {
  id: number;
  date: string;
  category: string;
  payment_mode: "Cash" | "Debit Card" | "Credit Card";
  description: string;
  amount: number;
  type: "income" | "expense";
};
const RecentTransaction = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const {curency,symbol,rate} = useCurrency()
  const fetchTransactions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) setError(error.message);
    else setTransactions(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="container flex justify-center items-center  ">
      <div className="bg-white shadow p-6 rounded-2xl mt-5  w-[90%] md:w-[90%] overflow-x-auto">
        <h3 className="font-semibold text-lg mb-4 text-gray-700">
          Recent Transactions
        </h3>

        {loading ? (
          <p className="text-gray-500 text-center py-6">Loading...</p>
        ) : transactions.length === 0 ? (
          <p className="text-gray-500 text-center py-6">
            No recent transactions found.
          </p>
        ) : (
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-4 text-left rounded-tl-lg">Date</th>
                <th className="py-3 px-4 text-left">Category</th>
                <th className="py-3 px-4 text-left">Payment Mode</th>
                <th className="py-3 px-4 text-left">Description</th>
                <th className="py-3 px-4 text-right rounded-tr-lg">Amount</th>
              </tr>
            </thead>

            <tbody className="text-gray-700 text-sm font-medium">
              {transactions.map((t, i) => (
                <tr
                  key={i}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="py-3 px-4 whitespace-nowrap">{t.date}</td>
                  <td className="py-3 px-4 whitespace-nowrap">{t.category}</td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {t.payment_mode}
                  </td>
                  <td className="py-3 px-4">{t.description || "—"}</td>
                  <td
                    className={`py-3 px-4 text-right font-semibold ${
                      t.amount > 0 ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {symbol} {(t.amount * rate).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default RecentTransaction;
