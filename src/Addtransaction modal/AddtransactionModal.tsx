"use client";

import { showAlert } from "@/Utils/alret";
import { supabase } from "@/Utils/supabaseClient";
import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Transaction } from "@/app/transaction/page";
import { showError, showWarning } from "@/Utils/Swalalret/Swalalret";
import { useCurrency } from "@/Utils/CurencyContext/Curencycontext";
import { convertCurrency } from "@/Utils/CurencyConverter/Converter";

interface AddTransactionModalProps {
  open: boolean;
  onClose: () => void;
  onTransactionAdded: (transaction: Transaction) => void;
}

type TransactionFormData = {
  type: "income" | "expense";
  date: string;
  time: string;
  category: string;
  amount: number;
  desc: string;
  payment_mode:
    | "Cash"
    | "Debit Card"
    | "Credit Card"
    | "PayPal"
    | "SEPA Transfer"
    | "Bank Transfer"
    | "PayPay";
};

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  open,
  onClose,
  onTransactionAdded,
}) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { curency, rate } = useCurrency();

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

  const paymentModes = getPaymentModes(curency);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<TransactionFormData>({
    defaultValues: {
      type: "expense",
      category: "",
      payment_mode: "Cash",
    },
  });

  const type = watch("type");

  // CATEGORY STATES
  const [categoryList, setCategoryList] = useState<string[]>([
    "Food",
    "Transportation",
    "Housing",
    "Shopping",
    "Education",
  ]);
  const DEFAULT_CATEGORIES = [
    "Food",
    "Transportation",
    "Housing",
    "Shopping",
    "Education",
  ];

  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      return showWarning("Category can't be empty!");
    }

    if (categoryList.includes(newCategory.trim())) {
      return showWarning("Category already exists!");
    }

    setCategoryList((prev) =>
      Array.from(new Set([...prev, newCategory.trim()]))
    );
    showAlert("Category added successfully!", "success");

    setNewCategory("");
    setShowCategoryInput(false);
  };

  const fetchCategories = async (userId: string) => {
    let combined: string[] = [];

    // Fetch from budgets
    const { data: budgetData } = await supabase
      .from("budgets")
      .select("category")
      .eq("user_id", userId);

    const budgetCats = (budgetData || [])
      .map((i) => i.category)
      .filter(Boolean);

    //  Fetch from transactions
    const { data: trxData } = await supabase
      .from("transactions")
      .select("category")
      .eq("user_id", userId);

    const trxCats = (trxData || []).map((i) => i.category).filter(Boolean);

    //  Combine → Default + Budget + Transaction + Locally Added
    combined = [
      ...new Set([
        ...DEFAULT_CATEGORIES,
        ...budgetCats,
        ...trxCats,
        ...categoryList, // user added but not yet saved in DB
      ]),
    ];

    //  Update state
    setCategoryList(combined);
  };

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getSession();
      const currentUser = data.session?.user ?? null;

      setUser(currentUser);

      if (currentUser) {
        fetchCategories(currentUser.id);
      }
    };

    loadUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          fetchCategories(currentUser.id);
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    .toISOString()
    .split("T")[0];
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const amount = watch("amount");

  const onSubmit: SubmitHandler<TransactionFormData> = async (formData) => {
    if (!user) {
      setMessage("You must be logged in to add transactions.");
      return;
    }

    const selectDate = new Date(formData.date);
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // Block previous months
    if (
      selectDate.getFullYear() < currentYear ||
      (selectDate.getFullYear() === currentYear &&
        selectDate.getMonth() < currentMonth)
    ) {
      showError("You cannot add transactions for previous months!");
      return;
    }

    setLoading(true);
    // const amountInINR = convertCurrency(
    //   Number(formData.amount),
    //   curency,
    //   "INR"
    // );
    const convertedAmount = Number(amount) / rate;

    const { data, error } = await supabase
      .from("transactions")
      .insert([
        {
          user_id: user.id,
          type: formData.type,
          date: formData.date,
          time: formData.time,
          category: formData.category,
          amount: convertedAmount,
          description: formData.desc,
          payment_mode: formData.payment_mode,
        },
      ])
      .select();

    if (error) {
      showAlert("Transaction add failed!", "error");
      setMessage(error.message);
    } else if (data && data.length > 0) {
      const newTrx = data[0];
      onTransactionAdded(newTrx);
      showAlert("Transaction added successfully!", "success");
      reset();
      onClose();
    }

    setLoading(false);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 h-screen min-h-screen flex items-center justify-center 
bg-black/40 backdrop-blur-sm z-50 px-4"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative 
  animate-[fadeIn_0.3s_ease] max-h-[90vh] overflow-y-auto "
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800">
            New Transaction
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 text-xl transition"
          >
            ✕
          </button>
        </div>

        {!user && (
          <p className="text-center text-red-500 mb-4">
            You must be logged in to add transactions.
          </p>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* TYPE */}
          <div className="flex gap-6 text-gray-800">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="income"
                {...register("type")}
                className="accent-green-600 w-4 h-4"
                checked={type === "income"}
              />
              <span className="font-medium text-green-700">Income</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="expense"
                {...register("type")}
                className="accent-red-600 w-4 h-4"
                checked={type === "expense"}
              />
              <span className="font-medium text-red-700">Expense</span>
            </label>
          </div>

          {/* DATE & TIME */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-800">
            <div>
              <label className="block text-sm font-medium mb-1">
                Choose Date
              </label>
              <input
                type="date"
                {...register("date", { required: true })}
                min={firstDayOfMonth}
                className="w-full border border-gray-400 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Choose Time
              </label>
              <input
                type="time"
                {...register("time", { required: true })}
                className="w-full border border-gray-400 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
              />
            </div>
          </div>

          {/* CATEGORY + AMOUNT */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-800">
            {/* CATEGORY */}
            <div>
              <label className="block text-sm font-medium mb-1">
                {type === "income" ? "Income Source" : "Expense Category"}
              </label>

              {type === "income" ? (
                <input
                  type="text"
                  {...register("category", { required: true })}
                  placeholder="Salary, Bonus..."
                  className="w-full border border-gray-400 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
                />
              ) : (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <select
                      {...register("category", { required: true })}
                      className="w-full border border-gray-400 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
                    >
                      <option value="">Select...</option>
                      {categoryList.map((cat, idx) => (
                        <option key={idx} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() => setShowCategoryInput(!showCategoryInput)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                    >
                      +
                    </button>
                  </div>

                  {showCategoryInput && (
                    <div className="flex flex-col gap-2 animate-fadeIn">
                      <label className="text-sm font-medium">
                        Add new category
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                          placeholder="Enter new category"
                          className="flex-1 border border-gray-400 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
                        />
                        <button
                          type="button"
                          onClick={handleAddCategory}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition z-50   min-w-[70px]       
                          sm:min-w-[80px]     
                          md:min-w-[90px]"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* AMOUNT */}
            <div>
              <label className="block text-sm font-medium mb-1">Amount</label>
              <input
                type="number"
                step="0.01"
                {...register("amount", { required: true })}
                placeholder={curency}
                className="w-full border border-gray-400 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
              />
            </div>
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-800">
              Description
            </label>
            <input
              type="text"
              {...register("desc")}
              placeholder="Enter description"
              className="w-full border border-gray-400 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none text-gray-800"
            />
          </div>

          {/* PAYMENT MODE */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-800">
              Payment Mode
            </label>

            <div className="flex flex-wrap gap-4 text-gray-800">
              {paymentModes.map((mode) => (
                <label
                  key={mode}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    value={mode}
                    {...register("payment_mode", { required: true })}
                    defaultChecked={mode === "Cash"}
                    className="accent-indigo-600 w-4 h-4 text-gray-800"
                  />
                  {mode}
                </label>
              ))}
            </div>

            {errors.payment_mode && (
              <p className="text-sm text-red-500 mt-1">
                Please select a payment mode.
              </p>
            )}
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-600 to-indigo-600 text-white py-2.5 rounded-lg 
        text-lg font-semibold hover:opacity-90 transition"
          >
            {loading ? "Adding..." : "Add Transaction"}
          </button>
        </form>

        {message && (
          <p className="text-center mt-3 text-sm text-gray-700">{message}</p>
        )}
      </div>
    </div>
  );
};

export default AddTransactionModal;
