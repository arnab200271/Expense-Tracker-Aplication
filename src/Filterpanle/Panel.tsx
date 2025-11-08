"use client";
import { supabase } from "@/Utils/supabaseClient";
import React, { useEffect, useState } from "react";
import { FaRedoAlt } from "react-icons/fa";

interface FilterProps {
  onApply: (filters: any) => void;
  onReset: () => void;
  currency: string;
}

const Panel: React.FC<FilterProps> = ({ onApply, onReset, currency }) => {
  const [category, setCategory] = useState("");
  const [cashflow, setCashflow] = useState<string[]>([]);
  const [paymentMode, setPaymentMode] = useState<string[]>([]);
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");

  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");
  const getPaymentModes = (cur: string) => {
    const cleanCur = cur.replace(/[^A-Z]/g, "");

    switch (cleanCur) {
      case "INR":
        return ["Cash", "UPI", "Debit Card", "Credit Card"];
      case "USD":
        return ["Cash", "Debit Card", "Credit Card", "PayPal"];
      case "EUR":
        return ["Cash", "Debit Card", "Credit Card", "SEPA Transfer"];
      case "GBP":
        return ["Cash", "Debit Card", "Credit Card", "Bank Transfer"];
      case "JPY":
        return ["Cash", "Debit Card", "Credit Card", "PayPay"];
      default:
        return ["Cash", "Debit Card", "Credit Card"];
    }
  };

  const paymentModesAvailable = getPaymentModes(currency);

  const [categoryList, setCategoryList] = useState<string[]>([
    "Food",
    "Transportation",
    "Housing",
    "Shopping",
    "Education",
  ]);

  const toggleCheck = (stateArray: string[], value: string, setter: any) => {
    setter(
      stateArray.includes(value)
        ? stateArray.filter((v) => v !== value)
        : [...stateArray, value]
    );
  };
  const featchBudgetcategory = async (user_id: string) => {
    const { data, error } = await supabase
      .from("budgets")
      .select("category")
      .eq(" user_id", user_id);
    if (error) {
      console.log("Budget featching error", error);
    }
    const budgetCats = (data || [])
      .map((item) => item.category)
      .filter(Boolean);
    setCategoryList((prev) => {
      const combined = [...new Set([...budgetCats, ...prev])];
      return combined;
    });
  };
  // const fetchCategories = async () => {
  //   const { data: session } = await supabase.auth.getSession();
  //   const userId = session?.session?.user?.id;

  //   if (!userId) return;

  //   const { data, error } = await supabase
  //     .from("transactions")
  //     .select("category")
  //     .eq("user_id", userId);

  //   if (error) {
  //     console.error("Category fetch error:", error);
  //     return;
  //   }

  //   const fetched = data.map((item) => item.category).filter(Boolean);

  //   const combined = Array.from(new Set([...categoryList, ...fetched]));

  //   setCategoryList(combined);
  // };

  useEffect(() => {
    const loadUser = async () => {
      const { data: session } = await supabase.auth.getSession();
      const userId = session?.session?.user?.id;

      if (userId) {
        featchBudgetcategory(userId);
      }
    };

    loadUser();
  }, []);
  useEffect(() => {
    setPaymentMode([]);
  }, [currency]);

  const handleApply = () => {
    onApply({
      category,
      cashflow,
      paymentMode,
      minAmount,
      maxAmount,
      minDate,
      maxDate,
    });
  };
  const handleReset = () => {
    setCategory("");
    setCashflow([]);
    setPaymentMode([]);
    setMinAmount("");
    setMaxAmount("");
    setMinDate("");
    setMaxDate("");

    onReset();
  };

  return (
    <div className="container flex lg:justify-end md:justify-center sm:justify-center items-center">
      <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg p-5 md:p-6 lg:mx-4 my-5 border border-gray-100 dark:border-gray-800 lg:w-[1150px]">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Filters
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
          {/*  DATE RANGE */}
          <div className="flex flex-col ">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
              Date Range
            </label>

            <input
              type="date"
              value={minDate}
              onChange={(e) => setMinDate(e.target.value)}
              className="border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-indigo-400 min-w[80px] sm-min-w[80px]"
            />
          </div>
          {/*  CATEGORY */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
              Category
            </label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-indigo-400"
            >
              <option value="">Select Category</option>

              {categoryList.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/*  CASHFLOW */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
              Type
            </label>

            <div className="flex gap-4">
              {/* <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={cashflow.includes("income")}
                  onChange={() => toggleCheck(cashflow, "income", setCashflow)}
                  className="accent-indigo-600"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Income
                </span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={cashflow.includes("expense")}
                  onChange={() => toggleCheck(cashflow, "expense", setCashflow)}
                  className="accent-indigo-600"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Expense
                </span>
              </label> */}
              <span>All Expense</span>
            </div>
          </div>

          {/* PAYMENT MODE */}
          <div className="flex flex-wrap gap-4">
            {paymentModesAvailable.map((mode) => (
              <label key={mode} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={paymentMode.includes(mode)}
                  onChange={() =>
                    toggleCheck(paymentMode, mode, setPaymentMode)
                  }
                  className="accent-indigo-600"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {mode}
                </span>
              </label>
            ))}
          </div>

          {/*  AMOUNT RANGE */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
              Amount
            </label>

            <div className="flex items-center gap-3">
              <input
                type="number"
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
                placeholder={`Min ${currency}`}
                className="w-1/2 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-indigo-400"
              />

              <input
                type="number"
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
                placeholder={`Max ${currency}`}
                className="w-1/2 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-indigo-400"
              />
            </div>
          </div>
        </div>

        {/*  Buttons */}
        <div className="flex justify-end mt-6 gap-5">
          <button
            onClick={handleReset}
            className="px-4 py-3 text-sm border rounded-lg bg-pink-500 text-white flex items-center gap-1 w-[120px] justify-center hover:bg-pink-400"
          >
            Reset <FaRedoAlt />
          </button>

          <button
            onClick={handleApply}
            className="px-4 py-2 text-sm rounded-lg bg-sky-600 text-white hover:bg-indigo-700"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default Panel;
