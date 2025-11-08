"use client";

import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";

interface ProfessionalAlertProps {
  message: string;
  duration?: number; // auto-hide option (optional)
}


const Curencyalretmodal:React.FC<ProfessionalAlertProps> = ({ message,duration=0 }) => {
    const [visible, setVisible] = useState(true);
  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    // Trigger slide-in animation
    setAnimate(true);

    // Optional auto-hide
    if (duration > 0) {
      const timer = setTimeout(() => setVisible(false), duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  if (!visible) return null;
  return (
   <div
      className={`fixed top-10 right-3 w-full max-w-sm bg-gray-700 border-l-4 border-blue-600 text-white p-4 rounded-lg shadow-xl z-50 transform transition-all duration-500 ${
        animate ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"
      }`}
    >
      <div className="flex justify-between items-center">
        <p className="text-sm font-medium">{message}</p>
        <button
          onClick={() => setVisible(false)}
          className="ml-4 text-white  font-bold transition"
        >
          ✕
        </button>
      </div>
    </div>
  )
}

export default Curencyalretmodal