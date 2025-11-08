"use client";
import React, { useEffect, useState } from "react";
import Header from "../../../Layout/header/Header";
import Amaunt from "@/Recent Trans/Amaunt";
import ThemeToggle from "@/ThemeToggle/Themetoggle";
import RecentTransaction from "@/RecentTransaction/RecentTransaction";
import { supabase } from "@/Utils/supabaseClient";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  Filler,
} from "chart.js";
import { useCurrency } from "@/Utils/CurencyContext/Curencycontext";
import Curencyalretmodal from "@/Curencyalretmodal/Curencyalretmodal";

ChartJS.register(ArcElement, Tooltip, Legend, Title, Filler);

interface SummaryCard {
  title: string;
  amount: string;
  color: string;
}

interface Transaction {
  id: number;
  type: string;
  date: string;
  category: string;
  payment_mode: string;
  description: string;
  amount: number;
}

const Dashboard = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { curency, symbol, rate } = useCurrency();
const [showAlert, setShowAlert] = useState(false);
  // ===== Fetch transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("id", { ascending: false });

      if (error) console.error("Error fetching transactions:", error);
      else setTransactions(data || []);
      setLoading(false);
    };
    fetchTransactions();
  }, []);

  // ===== Helper function: Convert currency
  const convert = (amount: number) => {
    const validRate = parseFloat(rate.toString() || "1");
    return (amount * validRate).toFixed(2);
  };

  // ===== Calculate totals
  const incomeTotal = transactions
    .filter((t) => t.type.toLowerCase() === "income")
    .reduce((a, b) => a + b.amount, 0);

  const expenseTotal = transactions
    .filter((t) => t.type.toLowerCase() === "expense")
    .reduce((a, b) => a + b.amount, 0);

  const balance = incomeTotal - expenseTotal;

  const convertedIncome = convert(incomeTotal);
  const convertedExpense = convert(expenseTotal);
  const convertedBalance = convert(balance);

  // ===== Summary cards data
  const summary: SummaryCard[] = [
    {
      title: "Income",
      amount: `${convertedIncome}`,
      color: "text-blue-600",
    },
    {
      title: "Expenses",
      amount: `${convertedExpense}`,
      color: "text-pink-600",
    },
    {
      title: "Balance",
      amount: `${convertedBalance}`,
      color: "text-green-600",
    },
    {
      title: "Transactions",
      amount: `${transactions.length}`,
      color: "text-sky-600",
    },
  ];

  // ===== Expense breakdown
  const expenses = transactions.filter(
    (t) => t.type.toLowerCase() === "expense"
  );

  const categoryTotals: { [key: string]: number } = {};
  expenses.forEach((item) => {
    if (categoryTotals[item.category])
      categoryTotals[item.category] += item.amount;
    else categoryTotals[item.category] = item.amount;
  });

  const labels = Object.keys(categoryTotals);
  const amounts = Object.values(categoryTotals);

  const totalExpense = amounts.reduce((a, b) => a + b, 0);
  const convertedTotalExpense = parseFloat(convert(totalExpense));

  const expensesWithPercent = labels.map((label, i) => {
    const convertedAmount = parseFloat(convert(amounts[i]));
    return {
      name: label,
      amount: convertedAmount.toFixed(2),
      percent: ((convertedAmount / convertedTotalExpense) * 100).toFixed(1) + "%",
    };
  });

  // ===== Pie Chart setup
  const pieData = {
    labels,
    datasets: [
      {
        data: amounts.map((amt) => parseFloat(convert(amt))),
        backgroundColor: [
          "#4F46E5",
          "#EC4899",
          "#10B981",
          "#F59E0B",
          "#3B82F6",
          "#8B5CF6",
          "#EF4444",
          "#14B8A6",
          "#F97316",
          "#84CC16",
        ],
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  const pieOptions = {
    plugins: {
      legend: { position: "bottom" as const },
      title: {
        display: true,
        text: `Expense Distribution (${curency})`,
        font: { size: 18 },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  // ===== Loading state
  if (loading)
    return <p className="text-center text-white text-lg mt-10">Loading...</p>;

  // ===== Render
  return (
    <div className="bg-gray-800 min-h-screen pb-10 text-gray-800">
      <Curencyalretmodal message="Please set your currency type from Settings"/>
      <div className="flex flex-col lg:flex-row justify-center lg:justify-evenly w-full lg:w-[90%] mx-auto px-4">
        {/* Sidebar */}
        <div className="w-full lg:w-[20%] mb-6 lg:mb-0">
          <Header />
        </div>

        {/* Main content */}
        <div className="space-y-8 w-full lg:w-[80%]">
          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
            {summary.map((item, index) => (
              <div
                key={index}
                className="bg-white p-5 rounded-2xl shadow text-center hover:shadow-lg transition w-full"
              >
                <h2 className={`text-2xl font-bold ${item.color}`}>
                  {item.title !== "Transactions" && <span>{symbol} </span>}
                  {item.amount}
                </h2>
                <p className="text-gray-500 mt-2">{item.title}</p>
              </div>
            ))}
          </div>

          {/* Expense Chart */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Total Expenses ({curency})
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="flex justify-center items-center h-[250px] sm:h-[300px] md:h-[350px] lg:h-[450px]">
                {amounts.length > 0 ? (
                  <Pie data={pieData} options={pieOptions} />
                ) : (
                  <p className="text-gray-500">No expense data available</p>
                )}
              </div>

              <div className="max-h-[450px] overflow-y-auto">
                <ul className="divide-y divide-gray-200">
                  {expensesWithPercent.map((exp, index) => (
                    <li
                      key={index}
                      className="flex justify-between py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition px-2"
                    >
                      <span>{exp.name}</span>
                      <span>
                        {symbol} {exp.amount}{" "}
                        <span className="text-gray-400 text-sm">
                          ({exp.percent})
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Recent Income & Expense Section */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <Amaunt />
          </div>

          {/* Recent Transactions Table */}
          <div className="bg-white p-6 rounded-2xl shadow mt-10 overflow-x-auto">
            <RecentTransaction />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
