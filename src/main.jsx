import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import Routes from "./Routes/Routes.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthProvider from "./AuthProvider/AuthProvider.jsx";
import Modal from 'react-modal'

const queryClient = new QueryClient();

Modal.setAppElement('#root');

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={Routes} />
    </QueryClientProvider>
    </AuthProvider>
  </React.StrictMode>
);
