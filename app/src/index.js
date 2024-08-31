import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ForgotPassword from "./ForgotPassword";
import Registration from "./Registration";
import "./App.css";
import Home from "./Home";
import NavBar from "./NavBar";
import Login from "./Login";
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
    path: "Main",
    element: <NavBar />,
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
