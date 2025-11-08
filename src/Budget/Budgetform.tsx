"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/Utils/supabaseClient";
import { useForm } from "react-hook-form";
import {  showError, showWarning } from "@/Utils/Swalalret/Swalalret";
import { showAlert } from "@/Utils/alret";
import { useCurrency } from "@/Utils/CurencyContext/Curencycontext";

type BudgetProps = {
  category: string;
  month: string;
  limit_amount: number;
};

const DEFAULT_CATEGORIES = [
  "Food",
  "Transportation",
  "Housing",
  "Shopping",
  "Education",
];

const BudgetForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BudgetProps>();

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const {curency,symbol,rate} = useCurrency()
  const [categoryList, setCategoryList] = useState<string[]>(DEFAULT_CATEGORIES);
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  //  Add Category (Only Local - No Supabase)
  const handleAddCategory = () => {
    const trimmed = newCategory.trim();

    if (!trimmed) return showWarning("Category can't be empty!");
    if (categoryList.includes(trimmed))
      return showWarning("Category already exists!");

    //  Only add to React state — NOT Supabase
    setCategoryList((prev) => [...prev, trimmed]);

    showAlert("Category added successfully!", "success");
    setNewCategory("");
    setShowCategoryInput(false);
  };

  //  Fetch categories from budgets table (previous saved budgets)
  // const fetchCategories = async (userId: string) => {
  //   const { data, error } = await supabase
  //     .from("budgets")
  //     .select("category")
  //     .eq("user_id", userId);

  //   if (error) {
  //     console.error("Error fetching categories:", error);
  //     return;
  //   }

  //   const fetched = data.map((item) => item.category).filter(Boolean);

  //   const combined = Array.from(
  //     new Set([...DEFAULT_CATEGORIES, ...fetched])
  //   );

  //   setCategoryList(combined);
  // };
  const fetchCategories = async (userId: string) => {

  const { data: budgetData, error: budgetErr } = await supabase
    .from("budgets")
    .select("category")
    .eq("user_id", userId);

  if (budgetErr) {
    console.error("Budget fetch error:", budgetErr);
  }

  const budgetCats = (budgetData || [])
    .map((item) => item.category)
    .filter(Boolean);

 
  const { data: trxData, error: trxErr } = await supabase
    .from("transactions")
    .select("category")
    .eq("user_id", userId)
    .eq("type","expense");
    

  if (trxErr) {
    console.error("Transaction fetch error:", trxErr);
  }

  const trxCats = (trxData || [])
    .map((item) => item.category)
    .filter(Boolean);

  const combined = [
    ...new Set([
      ...DEFAULT_CATEGORIES, // default
      ...budgetCats,         // saved budgets
      ...trxCats,            // transaction-added categories
    ]),
  ];

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


  const onSubmit = async (data: BudgetProps) => {
    if (!user) {
      return showError("You must be logged in!");
    }

    setLoading(true);
const convertedAmount = Number(data.limit_amount) / rate;
    const { error } = await supabase.from("budgets").insert([
      {
        user_id: user.id,
        email: user.email,
        category: data.category,
        month: data.month,
        limit_amount: convertedAmount,
      },
    ]);

    setLoading(false);

    if (error) {
      console.error(error);
      showError("Failed to add budget!");
    } else {
      showAlert("Budget added successfully!", "success");
      fetchCategories(user.id); 
      reset();
    }
  };

  return (
     <div className="flex justify-center items-center w-full min-h-screen px-4 lg:px-10">
      <div className="w-full max-w-2xl text-gray-700 p-8 rounded-2xl">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Add New Budget
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* Category */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Category
            </label>
            <select
              {...register("category", { required: true })}
              className="w-full px-4 py-2 rounded-md text-black border border-gray-400
              focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              <option value="">Select...</option>
              {categoryList.map((cat, i) => (
                <option key={i} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/*  Add Category Input */}
          {showCategoryInput && (
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Add Category
              </label>
              <div
                className="w-full "
              >
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-4 py-2 rounded-md text-black 
                       border border-gray-400 focus:outline-none  focus:ring-2 focus:ring-pink-400"
                  placeholder="Enter New Category"
                />
              </div>
            </div>
          )}

          {/*  Month */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Month
            </label>
            <input
              type="month"
              {...register("month", { required: true })}
              className="w-full px-4 py-2 rounded-md text-black border border-gray-400
              focus:outline-none focus:ring-2 focus:ring-pink-400"
              min={firstDayOfMonth.slice(0, 7)}
            />
          </div>

          {/*  Limit */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Budget Limit ({curency})
            </label>
            <input
              type="number"
              step="0.01"
              {...register("limit_amount", { required: true })}
              placeholder={`Enter amount (${curency})`}
              className="w-full px-4 py-2 rounded-md text-black border border-gray-400
              focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full text-white bg-gradient-to-r from-pink-500 to-blue-500 
            hover:opacity-90 py-2.5 rounded-md text-lg font-semibold"
          >
            {loading ? "Adding..." : "Add Budget"}
          </button>

          {/*  Add Category Button */}
          <button
            type="button"
            onClick={() =>
              showCategoryInput ? handleAddCategory() : setShowCategoryInput(true)
            }
            className="w-full text-white bg-green-500 py-2.5 rounded-md 
            text-lg font-semibold cursor-pointer"
          >
            {showCategoryInput ? "Save" : "Add category +"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BudgetForm;
