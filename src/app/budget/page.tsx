"use client";
import Budgetform from "@/Budget/Budgetform";
import Header from "../../../Layout/header/Header";
import React, { useState } from "react";
import Budgetlimit from "@/Budget/Budgetlimit";
import {
  FaHamburger,
  FaHome,
  FaBriefcaseMedical,
} from "react-icons/fa";
import { BsAirplaneFill } from "react-icons/bs";
const Userbudget = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <div className=" min-h-screen bg-gray-700 text-white transition-all duration-300">
      {/* ===== Sidebar / Header Section ===== */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-0"
        }  fixed md:relative h-full transition-all duration-300 overflow-hidden z-50`}
      >
        <Header />
      </div>

      {/* ===== Main Content Section ===== */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarOpen ? "md:ml-64" : "ml-0"
        }`}
      >
        {/* ===== Top Bar Toggle (Mobile only) ===== */}
        <div className="md:hidden bg-gray-700 p-3 flex justify-between items-center shadow-md">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white  px-3 py-2 rounded-md"
          ></button>
        </div>

        {/* ===== Content Area ===== */}
        <div className="flex flex-col flex-1 gap-8 p-6 md:p-10 bg-gray-700 text-gray-200 overflow-auto">
          {/* ===== Form Section ===== */}
          <div className="w-full bg-white text-gray-900 rounded-2xl shadow-lg p-6 md:p-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-center text-gray-800">
              Add Monthly Budget
            </h2>
            <p className="text-center text-gray-500 mb-6 text-sm md:text-base leading-relaxed">
              Set your monthly spending goals by adding categories like{" "}
              <strong>Food</strong>,<strong> Travel</strong>, or{" "}
              <strong>Shopping</strong>. This helps you track expenses and stay
              within your financial limits every month.
            </p>
            <div className="flex justify-evenly items-center mb-4 flex-wrap relative top-20">
              <BsAirplaneFill
                className="text-sky-500 cursor-pointer"
                size={44}
              />
              <FaHamburger className="text-amber-600" size={44} />
              <FaHome className="text-emerald-400" size={44} />
              <FaBriefcaseMedical className="text-rose-500" size={44} />
            </div>
            <Budgetform />
          </div>

          {/* ===== Table Section ===== */}
          <div className="w-full bg-white text-gray-700 rounded-2xl shadow-lg p-6 md:p-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-800">
              Budget Summary
            </h2>
            <Budgetlimit />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Userbudget;
