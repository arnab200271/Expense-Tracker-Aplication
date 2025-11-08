"use client";
import Coinanimation from "@/Coinanimation/Coinanimation";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
const DisclaimerPage: React.FC = () => {
  const router = useRouter()
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollSpeed = 1;
    const interval = setInterval(() => {
      if (
        scrollContainer.scrollTop + scrollContainer.clientHeight >=
        scrollContainer.scrollHeight
      ) {
        scrollContainer.scrollTop = 0;
      } else {
        scrollContainer.scrollTop += scrollSpeed;
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);
 const handleBack = ()=>{
   router.back();
 }
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col justify-center items-center text-white px-4 py-12">
       <button
          onClick={handleBack}
          className="px-6 py-2 bg-gradient-to-r from-pink-500 to-blue-500 text-white rounded-lg font-semibold hover:opacity-90 transition  absolute left-10 top-10 cursor-pointer"
        >
          ← Back
        </button>
      <Coinanimation />
      <div className="max-w-3xl w-full bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6 md:p-10 text-center animate-fadeIn">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-pink-400 tracking-wide">
          ⚠️ Disclaimer
        </h1>
        <p className="text-gray-300 text-base md:text-lg mb-6">
          Please read this disclaimer carefully before using the Expense Tracker
          application.
        </p>

        <div
          ref={scrollRef}
          className="h-80 md:h-96 overflow-y-auto bg-gray-900/60 p-6 rounded-xl border border-gray-700 shadow-inner text-left scrollbar-thin scrollbar-thumb-pink-500 scrollbar-track-gray-700"
        >
          <p className="text-gray-200 leading-7 text-justify space-y-4">
            <span className="block mb-4">
              This Expense Tracker App is developed purely for educational and
              personal finance management purposes. It does not provide
              financial, legal, or investment advice. All data input and
              analysis are based on user-provided information and may not always
              reflect actual financial results.
            </span>

            <span className="block mb-4">
              The application is intended to help users monitor and manage their
              daily expenses, budget limits, and spending habits. While every
              effort has been made to ensure accuracy and reliability, the
              developer is not responsible for any errors, data loss, or
              financial consequences arising from its use.
            </span>

            <span className="block mb-4">
              The data stored in your Supabase account is private and not shared
              with any external party. However, you are solely responsible for
              maintaining the confidentiality of your credentials and data.
            </span>

            <span className="block mb-4">
              This app may undergo design updates, new features, or performance
              improvements without prior notice. Continued use of the app
              indicates that you accept these terms and any future
              modifications.
            </span>

            <span className="block mb-4">
              All logos, names, and design elements used within this project are
              for demonstration purposes only and belong to their respective
              owners. No copyright infringement is intended.
            </span>

            <span className="block mb-4">
              By using this Expense Tracker, you agree that you are solely
              responsible for your financial decisions and understand that this
              tool is provided "as-is" without any warranties.
            </span>

            <span className="block mb-4">
              Thank you for using this project! Manage your expenses smartly,
              stay organized, and build a financially aware lifestyle. 💰
            </span>
          </p>
        </div>

        {/* Footer Section */}
        <p className="mt-8 text-sm text-gray-400 italic">
          — Developed  by{" "}
          <span className="text-pink-400 font-semibold">Arnab Paladhi</span>
        </p>
        <p className="text-xs text-gray-500 mt-2">
          For learning and demonstration purposes only.
        </p>
      </div>
    </div>
  );
};

export default DisclaimerPage;
