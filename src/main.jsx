// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { storedData } from "./utils/localStorageHelper.js";

// Call this to populate any initial mock data if needed
storedData();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App /> {/* App already contains <BrowserRouter> */}
  </StrictMode>
);
