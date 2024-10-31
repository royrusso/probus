// Import our custom CSS
import React from "react";
import ReactDOM from "react-dom/client";

import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "/src/styles.scss";

// Import all of Bootstrap's JS
// import * as bootstrap from 'bootstrap'

// Clear the existing HTML content
//document.body.innerHTML = '<div id="app"></div>';
//import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div className="container py-4 px-3 mx-auto">
      <h1>Hello, Bootstrap and Vite!</h1>
      <button className="btn btn-primary">Primary button</button>
    </div>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
