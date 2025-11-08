import { useCurrency } from "@/Utils/CurencyContext/Curencycontext";
import React from "react";

const CurencyChanger = () => {
  const { curency, setCurrencyData, symbol } = useCurrency();

  return (
  <div className="flex flex-col items-center justify-center bg-[#0B1221] text-white p-6 rounded-2xl shadow-lg w-full max-w-sm sm:max-w-md md:max-w-lg mx-auto mt-10">
  <h2 className="text-2xl font-semibold mb-6 text-center text-blue-400">
    Change Currency
  </h2>

  <label className="block mb-3 text-gray-300 font-medium text-lg text-center sm:text-left">
    Select Your Currency:
  </label>

  <div className="relative w-full">
    <select
      className=" w-full  p-3 bg-[#141C2F] border border-gray-700 rounded-xl text-gray-100 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm sm:text-base"
      value={curency}
      onChange={(e) => setCurrencyData(e.target.value)}
    >
      <option value="INR">🇮🇳 INR (₹) – Indian Rupee</option>
      <option value="USD">🇺🇸 USD ($) – US Dollar</option>
      <option value="EUR">🇪🇺 EUR (€) – Euro</option>
      <option value="GBP">🇬🇧 GBP (£) – British Pound</option>
      <option value="JPY">🇯🇵 JPY (¥) – Japanese Yen</option>
    </select>

    {/* Dropdown Arrow Icon */}
    <div className="absolute inset-y-0  right-3 flex items-center pointer-events-none">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </div>
  </div>

  <p className="mt-6 text-center text-gray-300 text-sm sm:text-base">
    Current Currency:{" "}
    <span className="font-semibold text-blue-400">
      {symbol} {curency}
    </span>
  </p>
</div>


  );
};

export default CurencyChanger;
