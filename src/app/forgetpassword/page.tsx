"use client";
import Coinanimation from "@/Coinanimation/Coinanimation";
import { supabase } from "@/Utils/supabaseClient";
import Styles from "@/Styles/regandlog.module.css";
import clsx from "clsx";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEnvelope, FaCheckCircle,FaArrowRight } from "react-icons/fa";
import { showAlert } from "@/Utils/alret";
type forgetdata = {
  email: string;
};
const Forgetpassword: React.FC<forgetdata> = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<forgetdata>();
  const emailValue = watch("email");
  const handleReset = async (data: forgetdata) => {
    try {
      setLoading(true);
      setMessage(null);
      const redirectTo = `${window.location.origin}/resetpassword`;
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo,
      });
      if (error) throw error;
      //alert("Check email inbox ");
      setMessage("Check email for reset password");
      showAlert("Check email for reset password","success")
      reset();
    } catch (error: any) {
      //alert("Opps Somthing wrong try agin letter");
      showAlert("Opps Somthing wrong try agin letter","error")
      setMessage(`${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue || "");
  return (
    <div>
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-600 via-pink-500 to-red-500">
        <Coinanimation />
        <form
          onSubmit={handleSubmit(handleReset)}
          className="bg-white rounded-2xl shadow-xl p-8 w-80 md:w-96 text-center"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Forgot Password?
          </h2>
          <p className="text-gray-600 text-sm mb-6">
            Enter your email and we'll send a reset link.
          </p>
          <div className="relative w-full border border-gray-300 p-3 rounded-md  mb-3 focus:outline-none focus:ring-2 focus:ring-purple-500 flex">
            <input
              type="email"
              placeholder="Enter your email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email address",
                },
              })}
              className="w-full focus:outline-none"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mb-2">
                {errors.email.message}
              </p>
            )}
            <div className={clsx(Styles.formicons)}>
              {isEmailValid ? (
                <FaCheckCircle
                  size={24}
                  className="text-green-500 transition-all duration-300 absolute right-2"
                />
              ) : (
                <FaEnvelope size={24} className="text-neutral-600" />
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-md flex justify-center items-center transition-all cursor-pointer"
          >
            {loading && (
              <span className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin mr-2 "></span>
            )}
            {loading ? "Sending..." : "Send Reset Link" }<FaArrowRight className="ms-1" size={18} />
          </button>

          {message && (
            <p className="mt-4 text-sm font-semibold text-gray-700">
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Forgetpassword;
