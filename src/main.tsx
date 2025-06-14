import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app";
import "./global.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {BrowserRouter} from 'react-router-dom';
import { initializeAudioContext } from './utils/audioUtils';
initializeAudioContext();

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <App />
    </BrowserRouter>
  </React.StrictMode>
);
