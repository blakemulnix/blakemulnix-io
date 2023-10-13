import React from "react";
import ReactDOM from "react-dom/client";
import "./utils/ViewHeight";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import AboutMe from "./pages/AboutMe/AboutMe";
import ErrorPage from "./pages/AboutMe/Error";

const router = createBrowserRouter([
  {
    path: "/error.html",
    element: <ErrorPage />,
  },
  {
    path: "/index.html",
    element: <Navigate to="/" />,
  },
  {
    path: "/",
    element: <AboutMe />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />{" "}
  </React.StrictMode>
);
