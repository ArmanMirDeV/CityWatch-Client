import { StrictMode } from "react";
import React from "react";

import { createRoot } from "react-dom/client";
import "./index.css";
import router from "./Routes/Router";
import { RouterProvider } from "react-router";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
