"use client";
import React, { useState } from "react";
import { Plus, Search } from "lucide-react";
import AddTransactionModal from "@/Addtransaction modal/AddtransactionModal";
import { FaAngleDown } from "react-icons/fa";
import { Transaction } from "@/app/transaction/page";
import { useCurrency } from "@/Utils/CurencyContext/Curencycontext";
import { exportToPDF } from "@/Utils/Exportpdf";
type HeadertransactionProps = {
  onSearch: (value: string) => void;
  onExportCSV: () => void;
  onExportPDF: () => void;
 
};

const Headertransaction: React.FC<HeadertransactionProps> = ({
  onSearch,
  onExportCSV,
  onExportPDF,
}) => {
  const [query, setQuery] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { curency, symbol, rate } = useCurrency();
  const handleExportPDF = () => {
    onExportPDF();
     console.log("Export clicked with:", { curency, symbol, rate });
    exportToPDF(transactions, { curency, symbol, rate });
  };

  const handleSearch = (value: string) => {
    setQuery(value);
    onSearch(value);
  };

  const handleAdd = () => {
    setOpenModal(true);
  };
  const handleTransactionAdded = (newTransaction: Transaction) => {
    setTransactions((prev) => [...prev, newTransaction]);
  };
  return (
    <>
      <div
        className="
        flex flex-wrap items-center justify-center
        gap-3 px-4 py-4 
        text-white
        w-full
        sm:flex-row flex-col
        "
      >
        <div
          className="
          relative w-full 
          sm:w-2/3 md:w-1/2 lg:w-2/5 xl:w-1/3 
          transition-all duration-300
          "
        >
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Search size={20} />
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search transactions..."
            className="
              w-full pl-10 pr-4 py-2 
              rounded-xl text-sm 
              bg-gray-800 border border-white 
              text-gray-200 placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-white
              transition-all duration-200
            "
          />
        </div>

        <button
          onClick={handleAdd}
          className="
            flex items-center gap-2 
            bg-indigo-600 hover:bg-indigo-700 
            px-5 py-2.5 rounded-xl 
            text-sm font-semibold
            transition-all duration-200
            shadow-md hover:shadow-lg
          "
        >
          <Plus size={18} /> Add Transaction
        </button>
        <div className="relative">
          <button
            onClick={() => setExportOpen((p) => !p)}
            className="
                      bg-green-600 text-white px-4 py-2 rounded-lg 
                      inline-flex items-center justify-center gap-2  
                      w-40 cursor-pointer transition
                      hover:bg-green-700"
          >
            <span>Export</span>
            <FaAngleDown size={20} className="text-white mt-1" />
          </button>

          {exportOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white rounded-md shadow-lg z-50 text-gray-700">
              <button
                onClick={() => {
                  onExportCSV();
                  setExportOpen(false);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Export CSV
              </button>
              <button
                onClick={() => {
                  handleExportPDF();
                  setExportOpen(false);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Export PDF
              </button>
            </div>
          )}
        </div>
      </div>

      <AddTransactionModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onTransactionAdded={handleTransactionAdded}
      />
    </>
  );
};

export default Headertransaction;
