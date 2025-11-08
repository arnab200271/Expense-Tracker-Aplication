"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/Utils/supabaseClient";
import { showAlert } from "@/Utils/alret";
import { Camera } from "lucide-react";
import CurencyChanger from "@/changecurrency/page";

type FormData = {
  first_name?: string;
  last_name?: string;
  email?: string;
  profile_image?: FileList;
};

const Profileupdate: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string>(
    "https://wunlovpmqxzpjvdwvzyr.supabase.co/storage/v1/object/public/Avater/defaultimg.png"
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormData>();
  const selectedImage = watch("profile_image");
  useEffect(() => {
    if (selectedImage && selectedImage.length > 0) {
      const file = selectedImage[0];
      const imageURL = URL.createObjectURL(file);
      setProfileImageUrl(imageURL);
    }
  }, [selectedImage]);
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    fetchUser();
  }, []);
  useEffect(() => {
    const fetchUserProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;
      setUserId(user.id);

      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error.message);
      } else if (profileData) {
        reset({
          first_name: profileData.first_name || "",
          last_name: profileData.last_name || "",
          email: profileData.email || "",
        });
        setProfileImageUrl(
          profileData.profile_image ||
            "https://wunlovpmqxzpjvdwvzyr.supabase.co/storage/v1/object/public/Avater/defaultimg.png"
        );
      }
    };

    fetchUserProfile();
  }, [reset]);

  //  Handle form submit
  const onSubmit = async (data: FormData) => {
    try {
      if (!userId) {
        showAlert("User not logged in!", "error");
        return;
      }

      setLoading(true);
      let imageUrl: string | null = null;

      //  Upload new image if selected
      if (data.profile_image && data.profile_image.length > 0) {
        const imageFile = data.profile_image[0];
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${userId}-${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("Avater")
          .upload(filePath, imageFile, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("Avater")
          .getPublicUrl(filePath);

        imageUrl = publicUrlData.publicUrl;
      }

      //  Prepare update fields dynamically
      const updateFields: any = {};
      if (data.first_name) updateFields.first_name = data.first_name;
      if (data.last_name) updateFields.last_name = data.last_name;
      if (data.email) updateFields.email = data.email;
      if (imageUrl) updateFields.profile_image = imageUrl;

      if (Object.keys(updateFields).length === 0) {
        showAlert("No changes detected!", "info");
        return;
      }

      //  Update profile
      const { error: updateError } = await supabase
        .from("profiles")
        .update(updateFields)
        .eq("user_id", userId);

      if (updateError) throw updateError;

      showAlert("Profile updated successfully!", "success");
      reset();
    } catch (error: any) {
      console.error("Update Error:", error.message);
      showAlert("Error: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c142c] flex items-center justify-center p-4">
      <div className="bg-[#111d3a] w-full max-w-md text-white p-8 rounded-2xl shadow-2xl">
        <h2 className="text-2xl font-bold text-center mb-6 text-white">
          Update Profile
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="flex justify-center mb-4">
            <div className="relative group">
              <img
            src={profileImageUrl}
            alt=""
            className="w-28 h-28 rounded-full object-cover border-2 border-gray-600"
          />
          <label
            htmlFor="profile_image"
            className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition"
          >
            <Camera size={28} />
          </label>
          <input
            id="profile_image"
            type="file"
            accept="image/*"
            {...register("profile_image")}
            className="hidden"
          />
            </div>
          </div>
          {/*  First Name */}
          <div>
            <label className="text-sm font-medium text-gray-300">
              First Name
            </label>
            <input
              type="text"
              {...register("first_name", { minLength: 2 })}
              className="w-full p-2 mt-1 rounded-lg bg-[#1a2b4b] text-white border border-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your first name"
            />
            {errors.first_name && (
              <p className="text-red-500 text-sm mt-1">
                Minimum 2 characters required
              </p>
            )}
          </div>

          {/*  Last Name */}
          <div>
            <label className="text-sm font-medium text-gray-300">
              Last Name
            </label>
            <input
              type="text"
              {...register("last_name", { minLength: 2 })}
              className="w-full p-2 mt-1 rounded-lg bg-[#1a2b4b] text-white border border-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your last name"
            />
            {errors.last_name && (
              <p className="text-red-500 text-sm mt-1">
                Minimum 2 characters required
              </p>
            )}
          </div>

          {/*  Email */}
          <div>
            <label className="text-sm font-medium text-gray-300">Email</label>
            <input
              type="email"
              {...register("email", {
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              })}
              className="w-full p-2 mt-1 rounded-lg bg-[#1a2b4b] text-white border border-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                Please enter a valid email address
              </p>
            )}
          </div>
        {/*  Submit Button */}
          <button
            disabled={loading}
            type="submit"
            className={`w-full py-2 rounded-lg font-semibold transition ${
              loading
                ? "bg-blue-800 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Updating…" : "Update Profile"}
          </button>
        </form>
        <CurencyChanger/>
      </div>
    </div>
  );
};

export default Profileupdate;
