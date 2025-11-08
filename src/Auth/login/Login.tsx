"use client";
import React, { useEffect, useState } from "react";
import Styles from "@/Styles/regandlog.module.css";
import {
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaHamburger,
  FaHome,
  FaBriefcaseMedical,
  FaCheckCircle,
  FaLock,
} from "react-icons/fa";
import { BsAirplaneFill } from "react-icons/bs";
import clsx from "clsx";
import { useForm } from "react-hook-form";
import { supabase } from "@/Utils/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Typewriteranimation from "@/Typewriteranimation/Typewriteranimation";
import { showAlert } from "@/Utils/alret";
type LoginProps = {
  onBackclick: () => void;
  darkMode: boolean;
};
type Formdata = {
  email: string;
  password: string;
};
const Login: React.FC<LoginProps> = ({ onBackclick, darkMode }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<Formdata>();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowpassword] = useState(false);
  const router = useRouter();
  const emailValue = watch("email");
  const passwordValue = watch("password");
  const onSubmit = async (data: Formdata) => {
    //console.log("Submisson value",data)
    try {
      setLoading(true);
      setMessage("");
      setSubmitting(true);
      const { data: loginData, error } = await supabase.auth.signInWithPassword(
        {
          email: data.email,
          password: data.password,
        }
      );

      if (error) {
        setMessage(" Login failed: " + error.message);
         showAlert("Login failed ","error")
        setSubmitting(false);
        return;
      }

      if (loginData.session) {
        setMessage(" Login successful!");
        showAlert("Login successful","success")
        console.log("Session:", loginData.session);
        router.push("/dashboard");
      } else {
        setMessage("Please verify your email before logging in.");
        showAlert("Please verify your email before logging in","warning")
      }

      reset();
    } catch (err: any) {
      setMessage("Something went wrong: " + err.message);
      showAlert("Something went wrong","error")
    } finally {
      setLoading(false);
    }
  };
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue || "");
  const isPasswordValid = (passwordValue || "").length >= 6;

  return (
    <div>
      <div className={Styles.regmain}>
        <div className="text-center">
          <div className={`mb-5 flex justify-center items-center mb-5 min-h-[3rem] md:min-h-[4rem]`}>
            <Typewriteranimation
              texts={[
                "Expense Tracker",
                "Track Your Expenses",
                "Save Smartly",
                "Manage Income & Budget",
              ]}
              typingSpeed={120}
              deletingSpeed={50}
              pauseTime={1500}
            
            />
          </div>

          <div className="flex justify-evenly items-center mb-4 flex-wrap">
            <BsAirplaneFill
              className=" text-white hover:text-violet-600 cursor-pointer  "
              size={44}
            />
            <FaHamburger className=" text-white  " size={44} />
            <FaHome className=" text-white  " size={44} />
            <FaBriefcaseMedical className=" text-white  " size={44} />
          </div>
          <h2 className="text-3xl text-white  ">
            Dont Have An Account Register Now
          </h2>
          <p className="mt-2 text-white">
            Welcome back to Expense Tracker — your smart companion for managing
            income, expenses, and savings effortlessly.
          </p>
          <button
            className="border border-white text-white bg-transparent rounded-lg py-3 px-4  hover:text-white cursor-pointer transition duration-300 mt-2"
            onClick={onBackclick}
          >
            Register Now
          </button>
        </div>
        <div>
          <div>
            <h2
              className={`text-3xl  text-center font-semibold  mb-4 me-5 ${
                darkMode ? "font-semibold text-indigo-400" : "text-gray-700"
              }`}
            >
              Hello,Welcome Back !
            </h2>

            <form
              className={clsx(Styles.regform, "space-y-4 w-full")}
              onSubmit={handleSubmit(onSubmit)}
            >
              {/* Email */}
              <div
                className={clsx(
                  Styles.formbox,
                  "positon-relative rounded-md border border-slate-300 dark:border-slate-700:text-black-900 dark:text-slate-100 focus:outline-none p-2",
                  darkMode
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-gray-100 text-gray-900 border-gray-300",
                  isEmailValid
                    ? "border-green-500 bg-green-50"
                    : darkMode
                    ? "border-gray-600 bg-gray-700 text-white"
                    : "border-gray-300 bg-gray-100 text-gray-900"
                )}
              >
                <input
                  type="email"
                  placeholder="Email"
                  className={clsx(
                    Styles.input,
                    "w-full px-4 py-2 rounded-md   text-slate-900 dark:text-slate-100 focus:outline-none ",
                    isEmailValid
                      ? "border-green-500 focus:ring-green-400"
                      : "border-gray-300 focus:ring-purple-400"
                  )}
                  {...register("email", {
                    required: "Email is required",
                  })}
                />
                <div className={clsx(Styles.formicons)}>
                  {isEmailValid ? (
                    <FaCheckCircle
                      size={24}
                      className="text-green-500 transition-all duration-300"
                    />
                  ) : (
                    <FaEnvelope size={24} />
                  )}
                </div>
              </div>

              {/* Password */}
              <div
                className={clsx(
                  Styles.formbox,
                  "positon-relative rounded-md border border-slate-300 dark:border-slate-700:text-black-900 dark:text-slate-100 focus:outline-none p-2"
                )}
              >
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password"
                  className={clsx(
                    Styles.input,
                    "w-full px-4 py-2 rounded-md   text-slate-900 dark:text-slate-100 focus:outline-none ",
                    isPasswordValid
                      ? "border-green-500 focus:ring-green-400"
                      : "border-gray-300 focus:ring-purple-400"
                  )}
                  {...register("password", {
                    required: "password is required",
                  })}
                />
                {/* <button
                  className={clsx(Styles.formicons)}
                  type="button"
                  onMouseDown={() => setShowpassword(true)}
                  onMouseUp={() => setShowpassword(false)}
                  onMouseLeave={() => setShowpassword(false)}
                  onTouchStart={() => setShowpassword(true)}
                  onTouchEnd={() => setShowpassword(false)}
                >
                  {showPassword ? (
                    <FaEyeSlash size={24} />
                  ) : (
                    <FaEye size={24} />
                  )}
                </button> */}
                <span className="absolute right-2 top-3 text-gray-500">
                  {isPasswordValid ? (
                    <FaCheckCircle
                      size={24}
                      className="text-green-500 animate-pulse"
                    />
                  ) : (
                    <FaLock size={24} className="text-gray-500" />
                  )}
                </span>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className={`w-full py-2 px-4 rounded-md font-bold cursor-pointer transition flex items-center justify-center gap-2
    ${
      darkMode
        ? "bg-white text-gray-900 border border-white"
        : "bg-violet-500 text-white hover:bg-yellow-500"
    }
  `}
              >
                {submitting && (
                  <div
                    className={`w-5 h-5 border-4  border-t-transparent rounded-full animate-spin ${
                      darkMode ? "border-gray-800" : " border-white"
                    }`}
                  ></div>
                )}
                {submitting ? "Logging in..." : "Login"}
              </button>
            </form>
            <Link href="/forgetpassword" className="text-white">
              Forget Password
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
