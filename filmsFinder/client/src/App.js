import React, { useEffect } from "react";
import M from 'materialize-css/dist/js/materialize.min.js';
import "./App.scss";
import { BrowserRouter } from "react-router-dom";
import { useRoutes } from "./routes.jsx";
import { AuthContext } from "./context/auth.context";
import { useAuth } from "./hooks/auth.hook.js";


function App() {
  const { login, logout, session, user, isReady } = useAuth();
  const isLogin = !!session;
  const routes = useRoutes(isLogin, user);
  useEffect(() => {
    //initialize materialize
    M.AutoInit();})
  return (
    <AuthContext.Provider
      value={{ login, logout, session, user, isReady, isLogin }}
    >
      <BrowserRouter>{routes}</BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
