import React, { useState } from "react";
import themeContext from "./theme_context";

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(false);

  const updateTheme = () => {
    setTheme(!theme);
  };

  return (
    <themeContext.Provider value={{ theme, updateTheme }}>
      {children}
    </themeContext.Provider>
  );
};

export default ThemeProvider;
