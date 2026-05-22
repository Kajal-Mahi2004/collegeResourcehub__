import React, { useState, useEffect } from "react";
import "./Theme.css";
import Navbar from "../components/Navbar";

function Theme() {
  const [theme, setTheme] = useState("light");
  const [fontSize, setFontSize] = useState("medium");
  const [colorScheme, setColorScheme] = useState("blue");

  useEffect(() => {
    // Load saved preferences
    const savedTheme = localStorage.getItem("theme") || "light";
    const savedFontSize = localStorage.getItem("fontSize") || "medium";
    const savedColorScheme = localStorage.getItem("colorScheme") || "blue";

    setTheme(savedTheme);
    setFontSize(savedFontSize);
    setColorScheme(savedColorScheme);

    applyTheme(savedTheme, savedColorScheme);
    applyFontSize(savedFontSize);
  }, []);

  const applyTheme = (selectedTheme, scheme) => {
    document.body.className = `theme-${selectedTheme} color-${scheme}`;
  };

  const applyFontSize = (size) => {
    const sizes = {
      small: "12px",
      medium: "16px",
      large: "18px",
      xlarge: "20px"
    };
    document.body.style.fontSize = sizes[size];
  };

  const handleThemeChange = (e) => {
    const newTheme = e.target.value;
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme, colorScheme);
  };

  const handleFontSizeChange = (e) => {
    const newSize = e.target.value;
    setFontSize(newSize);
    localStorage.setItem("fontSize", newSize);
    applyFontSize(newSize);
  };

  const handleColorSchemeChange = (e) => {
    const newScheme = e.target.value;
    setColorScheme(newScheme);
    localStorage.setItem("colorScheme", newScheme);
    applyTheme(theme, newScheme);
  };

  return (
    <>
      <Navbar />
      <div className="theme-container">
        <h1>🎨 Theme & Settings</h1>

        <div className="settings-section">
          <div className="setting-card">
            <h2>🌓 Theme</h2>
            <p>Choose your preferred theme</p>
            <div className="theme-options">
              <label>
                <input
                  type="radio"
                  value="light"
                  checked={theme === "light"}
                  onChange={handleThemeChange}
                />
                <span>☀️ Light Mode</span>
              </label>
              <label>
                <input
                  type="radio"
                  value="dark"
                  checked={theme === "dark"}
                  onChange={handleThemeChange}
                />
                <span>🌙 Dark Mode</span>
              </label>
              <label>
                <input
                  type="radio"
                  value="auto"
                  checked={theme === "auto"}
                  onChange={handleThemeChange}
                />
                <span>⚙️ Auto (System)</span>
              </label>
            </div>
          </div>

          <div className="setting-card">
            <h2>🔤 Font Size</h2>
            <p>Adjust text size for better readability</p>
            <div className="font-options">
              <label>
                <input
                  type="radio"
                  value="small"
                  checked={fontSize === "small"}
                  onChange={handleFontSizeChange}
                />
                <span>Small</span>
              </label>
              <label>
                <input
                  type="radio"
                  value="medium"
                  checked={fontSize === "medium"}
                  onChange={handleFontSizeChange}
                />
                <span>Medium</span>
              </label>
              <label>
                <input
                  type="radio"
                  value="large"
                  checked={fontSize === "large"}
                  onChange={handleFontSizeChange}
                />
                <span>Large</span>
              </label>
              <label>
                <input
                  type="radio"
                  value="xlarge"
                  checked={fontSize === "xlarge"}
                  onChange={handleFontSizeChange}
                />
                <span>Extra Large</span>
              </label>
            </div>
          </div>

          <div className="setting-card">
            <h2>🎯 Color Scheme</h2>
            <p>Choose your preferred color accent</p>
            <div className="color-options">
              <label>
                <input
                  type="radio"
                  value="blue"
                  checked={colorScheme === "blue"}
                  onChange={handleColorSchemeChange}
                />
                <span style={{ color: "#007bff" }}>● Blue</span>
              </label>
              <label>
                <input
                  type="radio"
                  value="green"
                  checked={colorScheme === "green"}
                  onChange={handleColorSchemeChange}
                />
                <span style={{ color: "#28a745" }}>● Green</span>
              </label>
              <label>
                <input
                  type="radio"
                  value="purple"
                  checked={colorScheme === "purple"}
                  onChange={handleColorSchemeChange}
                />
                <span style={{ color: "#6f42c1" }}>● Purple</span>
              </label>
              <label>
                <input
                  type="radio"
                  value="red"
                  checked={colorScheme === "red"}
                  onChange={handleColorSchemeChange}
                />
                <span style={{ color: "#dc3545" }}>● Red</span>
              </label>
              <label>
                <input
                  type="radio"
                  value="orange"
                  checked={colorScheme === "orange"}
                  onChange={handleColorSchemeChange}
                />
                <span style={{ color: "#fd7e14" }}>● Orange</span>
              </label>
            </div>
          </div>
        </div>

        <div className="preview-section">
          <h2>📋 Preview</h2>
          <div className="preview-box">
            <h3>This is a sample heading</h3>
            <p>
              This is a sample paragraph to show you how your selected theme, font
              size, and color scheme will look across the application. Make adjustments
              as needed to find the perfect combination for your preferences.
            </p>
            <button className="preview-btn">Sample Button</button>
          </div>
        </div>

        <div className="info-section">
          <h2>ℹ️ Information</h2>
          <ul>
            <li>
              <strong>Light Mode:</strong> Best for use during daytime with good lighting
            </li>
            <li>
              <strong>Dark Mode:</strong> Reduces eye strain in low-light environments
            </li>
            <li>
              <strong>Auto Mode:</strong> Automatically switches based on your system settings
            </li>
            <li>
              <strong>Font Size:</strong> Larger sizes improve readability and accessibility
            </li>
            <li>
              <strong>Color Scheme:</strong> Changes the primary accent color throughout the app
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default Theme;
