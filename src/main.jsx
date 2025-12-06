import { StrictMode } from "react";
import React from "react";

import { createRoot } from "react-dom/client";
import "./index.css";
import router from "./Routes/Router";
import { RouterProvider } from "react-router";
import AuthProvider from "./Authentication/Context/AuthProvider";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      {" "}
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
