import React, { useState } from "react";
import Styles from "@/Styles/regandlog.module.css";
import {
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaMarker,
  FaHamburger,
  FaHome,
  FaBriefcaseMedical,
} from "react-icons/fa";
import { BsAirplaneFill } from "react-icons/bs";
import clsx from "clsx";
import { useForm } from "react-hook-form";
import { supabase } from "@/Utils/supabaseClient";
import Typewriteranimation from "@/Typewriteranimation/Typewriteranimation";
import { showAlert } from "@/Utils/alret";
import Verifymodal from "@/Utils/Verifymodal/Verifymodal";

type RegisterProps = {
  onLoginClick: () => void;
  darkMode: boolean;
};

type Formdata = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  profile_image: FileList;
};

const Register: React.FC<RegisterProps> = ({ onLoginClick, darkMode }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Formdata>();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setshowPassword] = useState(false);
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);

  const onSubmit = async (data: Formdata) => {
    console.log("Submisson data",data)
    console.log("Submisson data",FormData)
    try {
      setLoading(true);
      setMessage("");
      const emailRedirectTo = `${window.location.origin}/emailverifyed`;
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo,
        },
      });
        console.log("Signup response",data,authData)
      if (authError) throw authError;
      if (!authData?.user) throw new Error("User signup failed");

      const user = authData.user;
      const userId = user.id;
      let imageUrl: string | null = null;

      if (data.profile_image && data.profile_image.length > 0) {
        const imageFile = data.profile_image[0];
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${userId}-${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("Avater")
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("Avater")
          .getPublicUrl(filePath);

        imageUrl = publicUrlData.publicUrl;
      } else {
        const { data: defaultUrldata } = supabase.storage
          .from("Avater")
          .getPublicUrl("defultimg.png");
        imageUrl = defaultUrldata.publicUrl;
      }

      const { error: insertError } = await supabase.from("profiles").insert([
        {
          user_id: userId,
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          profile_image: imageUrl,
        },
      ]);

      if (insertError) throw insertError;

      setMessage("Account created successfully!,Please check your email");
      showAlert("Account created successfully!", "success");
      setVerifyModalOpen(true);
      reset();
    } catch (error: any) {
      console.error("Something went wrong:", error);
      setMessage("Error: " + error.message);
      showAlert("Error acuard", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={Styles.regmain}>
      <Verifymodal
        message="Please check your email to verify"
        onClose={() => setVerifyModalOpen(false)}
        open={verifyModalOpen}
      />
      <div className="text-center">
        <div className="mb-5 flex justify-center items-center mb-5 min-h-[3rem] md:min-h-[4rem]">
          <Typewriteranimation
            texts={[
              "Welcome To Expenso",
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
            className="text-white hover:text-violet-600 cursor-pointer"
            size={44}
          />
          <FaHamburger className="text-white" size={44} />
          <FaHome className="text-white" size={44} />
          <FaBriefcaseMedical className="text-white" size={44} />
        </div>
        <h2 className="text-3xl text-white">Nice to meet you</h2>
        <p className="mt-2 text-white">
          Before we begin, please share a few details so we can set up your
          account just right.
        </p>
        <button
          className="border border-white text-white bg-transparent rounded-lg py-3 px-4 hover:text-white cursor-pointer transition duration-300 mt-2"
          onClick={onLoginClick}
        >
          Login Here
        </button>
      </div>

      <div>
        <h2
          className={`text-3xl text-center font-semibold mb-4 ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Create Account
        </h2>

        <form
          className={clsx(Styles.regform, "space-y-4 w-full")}
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* First Name */}
          <div
            className={clsx(
              Styles.formbox,
              "position-relative rounded-md border border-slate-300 p-2"
            )}
          >
            <input
              type="text"
              placeholder="First Name"
              className={clsx(Styles.input, "w-full px-4 py-2 rounded-md text-gray-800 focus:outline-none")}
              {...register("first_name", { required: true })}
            />
            <div className={clsx(Styles.formicons)}>
              <FaMarker size={24} />
            </div>
          </div>

          {/* Last Name */}
          <div
            className={clsx(
              Styles.formbox,
              "position-relative rounded-md border border-slate-300 p-2"
            )}
          >
            <input
              type="text"
              placeholder="Last Name"
              className={clsx(Styles.input, "w-full px-4 py-2 rounded-md text-gray-800 focus:outline-none")}
              {...register("last_name", { required: true })}
            />
            <div className={clsx(Styles.formicons)}>
              <FaMarker size={24} />
            </div>
          </div>

          {/* Email */}
          <div
            className={clsx(
              Styles.formbox,
              "position-relative rounded-md border border-slate-300 p-2"
            )}
          >
            <input
              type="email"
              placeholder="Email"
              className={clsx(Styles.input, "w-full px-4 py-2 rounded-md text-gray-800 focus:outline-none")}
              {...register("email", { required: true })}
            />
            <div className={clsx(Styles.formicons)}>
              <FaEnvelope size={24} />
            </div>
          </div>

          {/* Password */}
          <div
            className={clsx(
              Styles.formbox,
              "position-relative rounded-md border border-slate-300 p-2"
            )}
          >
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              className={clsx(Styles.input, "w-full px-4 py-2 rounded-md text-gray-800 focus:outline-none")}
              {...register("password", { required: true })}
            />
            <button
              className={clsx(Styles.formicons)}
              onMouseDown={() => setshowPassword(true)}
              onMouseUp={() => setshowPassword(false)}
              onMouseLeave={() => setshowPassword(false)}
              onTouchStart={() => setshowPassword(true)}
              onTouchEnd={() => setshowPassword(false)}
            >
              {showPassword ? <FaEyeSlash size={24} /> : <FaEye size={24} />}
            </button>
          </div>

          {/* Profile Image */}
          <div
            className={clsx(
              Styles.formbox,
              "position-relative rounded-md border border-slate-300 p-2"
            )}
          >
            <input
              type="file"
              className={clsx(Styles.input, "w-full px-4 py-2 rounded-md text-gray-800 focus:outline-none")}
              {...register("profile_image")}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition cursor-pointer"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        {message && (
          <p className="text-center mt-4 text-green-500 dark:text-red-400">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Register;
