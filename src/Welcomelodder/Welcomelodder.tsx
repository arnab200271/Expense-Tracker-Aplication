"use client";

import React, { useEffect, useState } from "react";
import { FaCoins } from "react-icons/fa";

type WelcomelodderProps = {
  onFinish: () => void;
  message?:string;
};

const Welcomelodder: React.FC<WelcomelodderProps> = ({ onFinish ,message}) => {
  const [visible, setVisible] = useState(true);
  const [coins, setCoins] = useState<number[]>([]);

  useEffect(() => {
    setCoins(Array.from({ length: 5 }).map(() => Math.random()));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onFinish();
    }, 7000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-center items-center bg-gradient-to-r from-purple-700 via-pink-500 to-red-500 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {coins.map((pos, i) => (
          <FaCoins
            key={i}
            className="absolute text-yellow-400 text-3xl animate-bounce-slow"
            style={{
              left: `${pos * 90}%`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>

      <FaCoins className="text-yellow-400 text-8xl mb-6 animate-bounce" />

      <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2 animate-pulse text-center">
        {message ||"Welcome to Expense Tracker"}
      </h1>
      <p className="text-white/80 mb-8 text-center text-lg">
        {message? "" : "Tracking your expenses made easy"}
      </p>

      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-40px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Welcomelodder;
