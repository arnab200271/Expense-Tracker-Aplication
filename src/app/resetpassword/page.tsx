"use client";
import Coinanimation from "@/Coinanimation/Coinanimation";
import { supabase } from "@/Utils/supabaseClient";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Styles from "@/Styles/regandlog.module.css";
import clsx from "clsx";
import { showAlert } from "@/Utils/alret";
type resetFormdata = {
  newpassword: string;
  confirmpassword: string;
};
const Resetpassword: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>();
  const [servermessage, setServermessage] = useState<string | null>(null);
  const [showPassword, setShowpassword] = useState(false);
  const [showConfirmpassword,setShowConfirmpassword] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<resetFormdata>();
  const handleReset = async (data: resetFormdata) => {
    const { newpassword, confirmpassword } = data;
    setServermessage(null);
    if (newpassword !== confirmpassword) {
      setServermessage("password do not match ");
      showAlert("password do not match","warning");
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newpassword,
      });
      if (error) throw error;
      setServermessage(" Password updated successfully!");
      showAlert("Password updated successfully!")
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error: any) {
      setServermessage(` ${error.message}`);
      showAlert("opps cant change password right now","error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
        <Coinanimation />
        <form
          onSubmit={handleSubmit(handleReset)}
          className="bg-white p-8 rounded-2xl shadow-lg w-80 md:w-96"
        >
          <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">
            Reset Password
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Enter your new password below
          </p>

          {/* New Password */}
          <div className="mb-4 ">
            <label className="block text-sm font-medium mb-1 text-gray-700">
              New Password
            </label>
            <div className="relative border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex">
              <input
                placeholder="Enter Password"
                type={showPassword ? "text" : "password"}
                {...register("newpassword", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className="w-full focus:outline-none "
              />
              <button
                className={clsx(Styles.formicons)}
                type="button"
                onMouseDown={() => setShowpassword(true)}
                onMouseUp={() => setShowpassword(false)}
                onMouseLeave={() => setShowpassword(false)}
                onTouchStart={() => setShowpassword(true)}
                onTouchEnd={() => setShowpassword(false)}
              >
                {showPassword ? (
                  <FaEyeSlash size={24} className="text-gray-600" />
                ) : (
                  <FaEye size={24} className="text-gray-600" />
                )}
              </button>
            </div>
            {errors.newpassword && (
              <p className="text-red-600 text-sm mt-1">
                {errors.newpassword.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Confirm Password
            </label>
            <div className="relative border border-gray-300 rounded-md p-3  focus:ring-2 focus:ring-indigo-500 flex">
              <input
              placeholder="Enter Confirm Password"
                type={showConfirmpassword ? "text" : "password"}
                {...register("confirmpassword", {
                  required: "Confirm your password",
                  validate: (value) =>
                    value === watch("newpassword") || "Passwords do not match",
                })}
                className="w-full focus:outline-none"
              />
               <button
                className={clsx(Styles.formicons)}
                type="button"
                onMouseDown={() => setShowConfirmpassword(true)}
                onMouseUp={() => setShowConfirmpassword(false)}
                onMouseLeave={() => setShowConfirmpassword(false)}
                onTouchStart={() => setShowConfirmpassword(true)}
                onTouchEnd={() => setShowConfirmpassword(false)}
              >
                {showConfirmpassword ? (
                  <FaEyeSlash size={24} className="text-gray-600" />
                ) : (
                  <FaEye size={24} className="text-gray-600" />
                )}
              </button>
            </div>
            {errors.confirmpassword && (
              <p className="text-red-600 text-sm mt-1">
                {errors.confirmpassword.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-md flex justify-center items-center transition-all cursor-pointer"
          >
            {loading && (
              <span className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
            )}
            {loading ? "Updating..." : "Update Password"}
          </button>

          {/* Server Message */}
          {servermessage && (
            <p className="text-center mt-4 text-sm font-semibold text-gray-700">
              {servermessage}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Resetpassword;
