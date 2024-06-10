import React from "react";
import { ToastContainer,toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

const ToastConfig: React.FC = () => {
  return (
    <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
      />

  );
};

export default ToastConfig;
