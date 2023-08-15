import React from "react";
import ReactDOM from "react-dom/client";
import Homepage from "./pages/Homepage";
import AboutMe from "./pages/AboutMe";

import "./assets/index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Homepage />,
  },
  {
    path: "/about-me",
    element: <AboutMe />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />{" "}
  </React.StrictMode>
);
