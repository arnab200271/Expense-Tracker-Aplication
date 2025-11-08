"use client";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export const showSuccess = (message: string) => {
  MySwal.fire({
    icon: "success",
    title: "Success!",
    text: message,
    timer: 2000,
    showConfirmButton: true,
  });
};

export const showError = (message: string) => {
  MySwal.fire({
    icon: "error",
    title: "Error!",
    text: message,
    confirmButtonColor: "#ef4444",
  });
};

export const showWarning = (message: string) => {
  MySwal.fire({
    icon: "warning",
    title: "Warning!",
    text: message,
    confirmButtonColor: "#f59e0b",
  });
};

export const showConfirm = async (message: string) => {
  const result = await MySwal.fire({
    title: "Are you sure?",
    text: message,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#3b82f6",
  });
  return result.isConfirmed;
};
