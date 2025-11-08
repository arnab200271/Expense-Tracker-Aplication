"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/Utils/supabaseClient";
import { showError, showWarning } from "@/Utils/Swalalret/Swalalret";
import { showAlert } from "@/Utils/alret";
import { useCurrency } from "@/Utils/CurencyContext/Curencycontext";
import { convertCurrency } from "@/Utils/CurencyConverter/Converter";

type Budget = {
  id: number;
  category: string;
  month: string;
  limit_amount: number;
  email: string;
  user_id: string;
};

type Transaction = {
  id: number;
  category: string;
  amount: number;
  type: string;
  user_id: string;
};

type Summary = Budget & {
  spent: number;
  status: string;
};

const BudgetSummary: React.FC = () => {
  const [summaryData, setSummaryData] = useState<Summary[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [budgetsUpdated, setBudgetsUpdated] = useState<Summary[]>([]);
  const { curency, symbol, rate } = useCurrency();
  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) console.error("User fetch error:", error.message);
      else setUserId(data.user?.id || null);
    };
    getUser();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      setLoading(true);

      const { data: budgets } = await supabase
        .from("budgets")
        .select("*")
        .eq("user_id", userId);

      const { data: transactions } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", userId)
        .eq("type", "expense");

      const spentByCategory = (transactions || []).reduce((acc: any, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});

      const final = (budgets || []).map((b) => {
        const spent = spentByCategory[b.category] || 0;
        return {
          ...b,
          spent,
          status: spent > b.limit_amount ? "Over Budget" : "Within Limit",
        };
      });
      final
        .filter((b) => b.spent > b.limit_amount)
        .forEach((b) => {
          const spentCovert = convertCurrency(b.spent, "INR", curency);
          const LimitCovert = convertCurrency(b.limit_amount, "INR", curency);
          const currencySymbol =
            curency === "USD"
              ? "$"
              : curency === "EUR"
              ? "€"
              : curency === "JPY"
              ? "¥"
              : curency === "GBP"
              ? "£"
              : "₹";
          showWarning(
            `⚠️ You have exceeded your "${b.category}" budget!\n` +
              `Spent: ${currencySymbol}${spentCovert.toFixed(
                2
              )} / Limit: ${currencySymbol}${LimitCovert.toFixed(2)}`
          );
        });
      setSummaryData(final);
      setLoading(false);
    };

    fetchData();
  }, [userId, budgetsUpdated]);

  const handleDelete = async (id: number) => {
    const confirmdelete = confirm("Are You Sure You Want To Delete?");
    if (!confirmdelete) return;
    const { data, error } = await supabase
      .from("budgets")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) return showError("Delete Failed");

    showAlert("Deleted Successfully!", "success");

    setSummaryData((prev) => prev.filter((b) => b.id !== id));
  };

  if (loading)
    return <p className="text-center text-gray-500 mt-6">Loading...</p>;

  if (summaryData.length === 0)
    return (
      <p className="text-center text-gray-500 mt-6">No budget data found.</p>
    );

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 mt-8 rounded-2xl bg-white dark:bg-gray-800 shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-gray-200">
        💰 Budget Summary
      </h2>

      {/* Scroll container */}
      <div className="w-full overflow-x-auto">
        <table className="min-w-[700px] w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700 text-left text-xs sm:text-sm md:text-base text-gray-800 dark:text-gray-100">
              <th className="py-2 px-3 border">Category</th>
              <th className="py-2 px-3 border">Month</th>
              <th className="py-2 px-3 border">Limit {curency}</th>
              <th className="py-2 px-3 border">Spent {curency}</th>
              <th className="py-2 px-3 border text-center">Status</th>
              <th className="py-2 px-3 border text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {summaryData.map((b) => (
              <tr
                key={b.id}
                className={`border text-xs sm:text-sm md:text-base ${
                  b.status === "Over Budget"
                    ? "bg-red-100 dark:bg-red-800"
                    : "bg-green-100 dark:bg-green-800"
                }`}
              >
                <td className="py-2 px-3 border text-gray-800 dark:text-gray-100">
                  {b.category}
                </td>
                <td className="py-2 px-3 border text-gray-800 dark:text-gray-100">
                  {b.month}
                </td>
                <td className="py-2 px-3 border text-gray-800 dark:text-gray-100">
                   `{symbol} {(b.limit_amount * rate).toFixed(2)}`
                </td>
                <td className="py-2 px-3 border text-gray-800 dark:text-gray-100">
                   `{symbol} {(b.spent * rate).toFixed(2)}`
                </td>
                <td
                  className={`py-2 px-3 border text-center font-semibold ${
                    b.status === "Over Budget"
                      ? "text-red-600 dark:text-red-300"
                      : "text-green-600 dark:text-green-300"
                  }`}
                >
                  {b.status}
                </td>
                <td className="py-2 px-3 border text-center">
                  <button
                    onClick={() => handleDelete(b.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-xs sm:text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BudgetSummary;
