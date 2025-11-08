"use client"
import React, { useEffect } from 'react'
import { FaEnvelopeOpenText } from "react-icons/fa";

interface Props {
  open: boolean;
  message: string;
  onClose: () => void;
}
const Verifymodal:React.FC<Props> = ({open,message,onClose}) => {
    useEffect(() => {
    if (open) {
      const timer = setTimeout(onClose, 4500); 
      return () => clearTimeout(timer);
    }
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div>
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-2xl max-w-sm w-full text-center animate-fade-in">
        
        <FaEnvelopeOpenText className="text-blue-500 text-5xl mx-auto mb-4 animate-bounce" />

        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          {message}
        </h2>

        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Check your email inbox for verification link.
        </p>

        <button
          onClick={onClose}
          className="mt-5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
        >
          OK
        </button>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.85); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fadeIn .35s ease-out;
        }
      `}</style>
    </div>
    </div>
  )
}

export default Verifymodal