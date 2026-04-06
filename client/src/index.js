import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './context/AuthContext';

// Apply saved theme before first render to avoid flash
const _savedTheme = localStorage.getItem("snip-theme") || "system";
if (_savedTheme === "dark") {
  document.documentElement.classList.add("dark");
} else if (_savedTheme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches) {
  document.documentElement.classList.add("dark");
}

// Apply saved accent color
const _savedAccent = localStorage.getItem("snip-accent");
if (_savedAccent) {
  document.documentElement.style.setProperty("--primary", _savedAccent);
  document.documentElement.style.setProperty("--ring", _savedAccent);
}

// Apply saved density
const _savedDensity = localStorage.getItem("snip-density") || "comfortable";
document.documentElement.setAttribute("data-density", _savedDensity);

// Apply saved font size
const _savedFontSize = Number(localStorage.getItem("snip_fontSize")) || 14;
document.documentElement.style.fontSize = `${_savedFontSize}px`;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
