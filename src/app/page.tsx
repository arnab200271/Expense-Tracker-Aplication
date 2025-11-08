"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/Utils/supabaseClient";
import Register from "@/Auth/register/Register";
import Login from "@/Auth/login/Login";
import Styles from "@/Styles/regandlog.module.css";
import { FaSun, FaMoon } from "react-icons/fa";
import Welcomelodder from "@/Welcomelodder/Welcomelodder";
import Coinanimation from "@/Coinanimation/Coinanimation";

export default function Home() {
  const router = useRouter();
  const [showLogin, setShowLogin] = useState(false);
  const [darkmode, setDarkmode] = useState(false);
  const [checking, setChecking] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);
  const [justLoggedOut, setJustLoggedOut] = useState(false);
  useEffect(() => {
    const storedMode = localStorage.getItem("darkmode");
    if (storedMode === "true") {
      setDarkmode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("darkmode", darkmode.toString());
    if (darkmode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkmode]);
  useEffect(() => {
    const visited = localStorage.getItem("visited");
    const loggedOut = localStorage.getItem("justLoggedOut");

    if (loggedOut) {
      setJustLoggedOut(true);
      localStorage.removeItem("justLoggedOut");
      setShowWelcome(true);
    } else if (!visited) {
      setShowWelcome(true);
    } else {
      setShowWelcome(false);
    }
  }, []);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data?.session;

      if (session) {
        router.replace("/dashboard");
      } else {
        setChecking(false);
      }
    };
    checkSession();
  }, [router]);

  if (showWelcome) {
    return (
      <Welcomelodder
        onFinish={() => {
          localStorage.setItem("visited", "true");
          setShowWelcome(false);
          setJustLoggedOut(false);
        }}
        message={
          justLoggedOut
            ? "See you soon! Come back again."
            : "Welcome to Expenso"
        }
      />
    );
  }

  if (checking) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div
      className={`${
        Styles.container
      } relative overflow-hidden transition-colors duration-700 ${
        darkmode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <Coinanimation/>
      <button
        onClick={() => setDarkmode(!darkmode)}
        className={`absolute top-6 right-6 z-[9999] p-3 rounded-full shadow-md transition duration-500 ${
          darkmode
            ? "bg-yellow-400 text-gray-900 hover:bg-yellow-300"
            : "bg-gray-800 text-white hover:bg-gray-700"
        }`}
      >
        {darkmode ? <FaSun size={20} /> : <FaMoon size={20} />}
      </button>

      <div
        className={`absolute w-[2000px] h-[2000px] rounded-full top-[-10%] right-[50%] transform transition-all duration-700 ease-in-out ${
          showLogin ? "translate-x-[25%]" : "translate-x-[10%]"
        } ${
          darkmode
            ? "bg-gradient-to-r from-gray-700 to-gray-900 outline-4 outline-white"
            : "bg-gradient-to-r from-green-400 to-blue-500"
        }`}
        style={{ zIndex: 1000 }}
      ></div>

      <div
        className={`transition-all duration-700 ${
          showLogin ? "flex-row-reverse" : "flex-row"
        } w-full min-h-screen`}
      >
        {!showLogin && (
          <div
            className={`flex items-center justify-center ${
              darkmode
                ? "bg-gradient-to-r from-gray-700 to-gray-900"
                : "bg-white"
            }`}
          >
            <Register
              onLoginClick={() => setShowLogin(true)}
              darkMode={darkmode}
            />
          </div>
        )}

        {showLogin && (
          <div
            className={`${
              darkmode
                ? "bg-gradient-to-r from-gray-700 to-gray-900"
                : "bg-white text-red-700"
            }`}
          >
            <Login
              onBackclick={() => setShowLogin(false)}
              darkMode={darkmode}
            />
          </div>
        )}
      </div>
    </div>
  );
}
