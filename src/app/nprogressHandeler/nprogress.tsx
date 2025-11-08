"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function ProgressBarHandler() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 1400);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      {loading && (
        <div className="fixed top-0 left-0 w-full h-[5px]  bg-red-600  shadow-[0_0_10px_rgba(147,51,234,0.6)] animate-[progress_1.2s_ease-in-out_forwards] z-[9999] rounded-b-md" />
      )}

      <style jsx>{`
        @keyframes progress {
          0% {
            width: 0%;
            opacity: 0.3;
          }
          30% {
            width: 40%;
            opacity: 0.8;
          }
          60% {
            width: 70%;
            opacity: 0.9;
          }
          90% {
            width: 90%;
            opacity: 1;
          }
          100% {
            width: 100%;
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}
