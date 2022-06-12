import React, { useEffect } from "react";
import M from 'materialize-css/dist/js/materialize.min.js';
import "./App.scss";
import { BrowserRouter } from "react-router-dom";
import { useRoutes } from "./routes.jsx";
import { AuthContext } from "./context/auth.context";
import { useAuth } from "./hooks/auth.hook.js";


function App() {
  const { login, logout, setUser, user, isReady } = useAuth();
  const isLogin = !!user;
  const routes = useRoutes(isLogin, user);
  useEffect(() => {
    //initialize materialize
    M.AutoInit();})
  
  return (
    <AuthContext.Provider
      value={{ login, logout,setUser, user, isReady, isLogin }}
    >
      <BrowserRouter>{routes}</BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
