import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./App.css";
import Home from "./Home";
import Login from "./Login";
import ForgotPassword from "./ForgotPassword";
import Registration from "./Registration";
import Journal from "./Journal";
import Suggestions from "./Suggestions";
import Healthcare from "./Healthcare";

import reportWebVitals from "./reportWebVitals";

// Routing to access each page.
const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "Forgot Password",
    element: <ForgotPassword />,
  },
  {
    path: "Registration",
    element: <Registration />,
  },
  {
    path: "Home",
    element: <Home />,
  },
  {
    path: "Journal",
    element: <Journal />,
  },
  {
    path: "Suggestions",
    element: <Suggestions />,
  },
  {
    path: "Healthcare",
    element: <Healthcare />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
