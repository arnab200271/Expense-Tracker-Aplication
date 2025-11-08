"use client";
import React, { useEffect, useState } from "react";
import { Disclosure, Transition } from "@headlessui/react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/Utils/supabaseClient";
import { MenuIcon, XIcon } from "lucide-react";
import { FiLogOut } from "react-icons/fi";
type Profile = {
  first_name: string;
  last_name: string;
  email: string;
  profile_image: string | null;
};

const navigation = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Transaction", href: "/transaction" },
  { name: "Budget", href: "/budget" },
  { name: "Settings", href: "/appsettings" },
  { name: "Disclaimer", href: "/desclimer" },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError("");

      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userError || !userData.user) {
        setError(userError?.message || "User not logged in");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", userData.user.email)
        .limit(2);
      console.log("Profile value", data, error);
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      setProfile(data?.[0] || null);
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    localStorage.setItem("justLoggedOut", "true");

    if (!error) window.location.href = "/";
  };

  if (
    !pathname.startsWith("/dashboard") &&
    !pathname.startsWith("/transaction") &&
    !pathname.startsWith("/budget") &&
    !pathname.startsWith("/appsettings")
  )
    return null;

  if (loading) {
    return (
      <>
        <div className="mt-4 text-center">
          <p>
            <svg
              className="mr-3 size-5 animate-spin text-white text-center"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
            Loading...
          </p>
        </div>
      </>
    );
  }
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-4 z-50 bg-gray-900 text-white p-2 rounded-md shadow-lg "
        onClick={() => setSidebarOpen(true)}
      >
        <MenuIcon className="h-6 w-6 " />
      </button>

      {/* Sidebar */}
      <Transition show={sidebarOpen} as={React.Fragment}>
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <Transition.Child
            enter="transition-opacity duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-50"
            leave="transition-opacity duration-200"
            leaveFrom="opacity-50"
            leaveTo="opacity-0"
          >
            <div
              className="fixed inset-0 bg-black opacity-50"
              onClick={() => setSidebarOpen(false)}
            />
          </Transition.Child>

          <Transition.Child
            enter="transition-transform duration-200"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition-transform duration-200"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <Disclosure
              as="nav"
              className="relative flex flex-col w-60 bg-gray-900 text-gray-100 shadow-lg"
            >
              <button
                className="absolute top-4 right-4 text-gray-200"
                onClick={() => setSidebarOpen(false)}
              >
                <XIcon className="h-6 w-6" />
              </button>

              {/* Profile Section */}
              <div className="flex flex-col items-center px-4 py-6 border-b border-gray-700">
                <img
                  src={profile?.profile_image || "default-profile.png"}
                  alt="Profile"
                  className="h-16 w-16 rounded-full border-2 border-gray-300"
                />
                <h2 className="mt-2 text-lg font-semibold">
                  {profile?.first_name} {profile?.last_name}
                </h2>
                <p>{profile?.email}</p>
                <div>
                  <span className="text-4xl mt-2">E</span>
                  <span className="text-2xl ">xpenso</span>
                </div>
              </div>

              <div className="flex-1 flex flex-col px-4 py-6 space-y-1">
                {navigation.map((item, index) => (
                  <div key={item.name}>
                    <Link
                      href={item.href}
                      className={classNames(
                        pathname === item.href
                          ? "bg-gray-800 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white",
                        "block px-4 py-3 rounded-md font-medium transition-colors duration-150"
                      )}
                    >
                      {item.name}
                    </Link>
                    {index !== navigation.length - 1 && (
                      <hr className="border-gray-700 my-1" />
                    )}
                  </div>
                ))}
              </div>

              {/* Logout */}
              <div className="px-4 py-6 border-t border-gray-700 ">
                
                <button
                  className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-400 rounded-md font-semibold transition text-center "
                  onClick={handleLogout}
                >
                   Sign Out
                </button>
              </div>
            </Disclosure>
          </Transition.Child>
        </div>
      </Transition>

      {/* Sidebar for md+ */}
      <nav className="hidden lg:flex fixed left-0 top-0 h-screen w-60 bg-gray-900 text-gray-100 flex-col shadow-lg">
        {/* Profile Section */}
        <div className="flex flex-col items-center px-4 py-6 border-b border-gray-700 relative">
          <img
            src={profile?.profile_image || "/default-profile.png"}
            alt="Profile"
            className="h-16 w-16 rounded-full border-2 border-gray-300"
          />
          <h2 className="mt-2 text-lg font-semibold">
            {profile?.first_name} {profile?.last_name}
          </h2>
          <p>{profile?.email}</p>
          <div>
            <span className="text-4xl mt-2">E</span>
            <span className="text-2xl ">xpenso</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 flex flex-col px-4 py-6 space-y-1">
          {navigation.map((item, index) => (
            <div key={item.name}>
              <Link
                href={item.href}
                className={classNames(
                  pathname === item.href
                    ? "bg-gray-800 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white",
                  "block px-4 py-3 rounded-md font-medium transition-colors duration-150"
                )}
              >
                {item.name}
              </Link>
              {index !== navigation.length - 1 && (
                <hr className="border-gray-700 my-1" />
              )}
            </div>
          ))}
        </div>

        {/* Logout */}
        <div className="px-4 py-6 border-t border-gray-700">
          <button
            className="w-full flex items-center justify-center gap-1 py-2 px-4 bg-blue-600 hover:bg-blue-400 rounded-md font-semibold transition"
            onClick={handleLogout}
          >
            <FiLogOut size={20} className="text-white" /> Sign Out
          </button>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
