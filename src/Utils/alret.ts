import { toast } from "react-hot-toast";
export type AlertType = "success" | "error" | "info" | "warning";
export const showAlert = (message: string, type: AlertType = "info") => {
  const options = {
    position: "top-center" as const,
    duration: 3000,
    style: {
      borderRadius: "10px",
      background: "#333",
      color: "#fff",
      padding: "12px 18px",
      fontSize: "15px",
    },
  };

  switch (type) {
    case "success":
      toast.success(message, options);
      break;
    case "error":
      toast.error(message, options);
      break;
    case "warning":
      toast(message, { ...options, icon: "⚠️" });
      break;
    default:
      toast(message, { ...options, icon: "ℹ️" });
  }
};