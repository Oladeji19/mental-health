import "./App.css";
import sunset from "./assets/sunset-icon.png";
import sea from "./assets/sea-icon.png";
import NavBar from "./NavBar";
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
import Mindfulness from "./Mindfulness";
import { useState } from "react";
import reportWebVitals from "./reportWebVitals";

export const context= React.createContext();
function App() {


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

const [username_, setUsername_] = useState("");


  return (
    
    <context.Provider value={[username_, setUsername_]}>
    <RouterProvider router={router} />
    </context.Provider>
      
   
  );
}

export default App;

