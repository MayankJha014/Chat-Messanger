/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import Login from "./component/auth/login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Chat from "./component/chat/chat";
import Navbar from "./component/navbar";
import { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { getUser } from "./redux/action/auth";

import io from "socket.io-client";
import ThemeProvider from "./theme/theme_provider";

const socket = io("https://nodejs-production-d4ec.up.railway.app", {
  path: "/socket",
  reconnection: true,
  transports: ["websocket", "polling"],
  reconnectionAttempts: 5,
});
const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUser()).then((state) => {
      socket.emit("setup", state.payload.data);
    });
  }, []);
  return (
    <div className="h-screen w-full flex transition-colors duration-500">
      <Toaster />

      <BrowserRouter>
        <ThemeProvider>
          <Routes>
            <Route path="/" exact element={<Login socket={socket} />} />
            <Route
              element={
                <Navbar>
                  <Routes>
                    <Route path="/" exact element={<Chat socket={socket} />} />
                  </Routes>
                </Navbar>
              }
              path="/home/*"
            />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
};

export default App;
