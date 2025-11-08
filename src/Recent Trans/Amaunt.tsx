"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/Utils/supabaseClient";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

import { Line, Bar } from "react-chartjs-2";

const Amaunt = () => {
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("date", { ascending: true });

      if (error) console.error("Error fetching transactions:", error);
      else setTransactions(data || []);
    };

    fetchData();
  }, []);

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const monthlyData = monthNames.map((month) => {
    const monthTransactions = transactions.filter((t) => {
      const d = new Date(t.date);
      return monthNames[d.getMonth()] === month;
    });

    const income = monthTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);

    const expense = monthTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);

    return { month, income, expense };
  });

  const lineData = {
    labels: monthlyData.map((d) => d.month),
    datasets: [
      {
        label: "Balance (Income - Expense)",
        data: monthlyData.map((d) => d.income - d.expense),
        fill: true,
        borderColor: "#4f46e5",
        backgroundColor: "rgba(79,70,229,0.2)",
        tension: 0.3,
      },
    ],
  };

  const barData = {
    labels: monthlyData.map((d) => d.month),
    datasets: [
      {
        label: "Income",
        data: monthlyData.map((d) => d.income),
        backgroundColor: "rgba(34,197,94,0.6)",
      },
      {
        label: "Expense",
        data: monthlyData.map((d) => d.expense),
        backgroundColor: "rgba(239,68,68,0.6)",
      },
    ],
  };

  return (
   <div className="w-[95%] md:w-[90%] lg:w-[85%] mt-6 mx-auto">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    
    {/* <=========Line Chart========> */}
    <div className="bg-white shadow p-4 rounded-2xl flex flex-col justify-center items-center">
      <h3 className="font-semibold mb-4 text-gray-800 text-center">
        Account - Balance
      </h3>
      <div className="w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px]">
        <Line data={lineData} options={{ maintainAspectRatio: false }} />
      </div>
    </div>

    {/* <====Barchart====> */}
    <div className="bg-white shadow p-4 rounded-2xl flex flex-col justify-center items-center">
      <h3 className="font-semibold mb-4 text-gray-800 text-center">
        Income - Expense
      </h3>
      <div className="w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px]">
        <Bar data={barData} options={{ maintainAspectRatio: false }} />
      </div>
    </div>

  </div>
</div>

  );
};

export default Amaunt;
