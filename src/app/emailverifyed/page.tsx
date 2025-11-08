"use client";

import { useEffect } from "react";
import { supabase } from "@/Utils/supabaseClient";
import { useRouter } from "next/navigation";
import { FaCheckCircle } from "react-icons/fa";
export default function EmailVerified() {
  const router = useRouter();

  useEffect(() => {
    const clearSession = async () => {
      await supabase.auth.signOut();
      setTimeout(() => {
        router.push("/");
      }, 1500);
    };

    clearSession();
  }, []);

  return (
    <div className="flex items-center justify-center h-screen text-xl font-semibold bg-gray-900">
       <div className="flex flex-col items-center justify-center h-screen  dark:bg-gray-900 text-gray-800 dark:text-gray-100 px-4">
      <div className="flex flex-col items-center bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8 space-y-4 animate-fade-in">
        <FaCheckCircle className="text-green-500 text-6xl animate-bounce" />
        <h1 className="text-2xl md:text-3xl font-bold text-center">
          Email Verified Successfully!
        </h1>
        <p className="text-center text-gray-500 dark:text-gray-300">
          Redirecting to Login...
        </p>
      </div>
    </div>
    </div>
  );
}
