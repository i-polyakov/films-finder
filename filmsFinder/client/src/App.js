import React from 'react';
import 'materialize-css'
import './App.scss';
import {BrowserRouter, Route, Link, Routes} from 'react-router-dom'
import { useRoutes } from './routes.jsx';
import { AuthContext } from './context/auth.context';
import { useAuth } from './hooks/auth.hook.js';
import AuthPage from './pages/auth/auth.page';
import Login from './pages/auth/login';

function App() {
  const {login, logout, session, user, isReady} = useAuth()
  const isLogin = !!session
  const routes = useRoutes(isLogin, user)
  
  return (
    <AuthContext.Provider value={{login, logout, session, user, isReady, isLogin}}>
      <BrowserRouter>
        {routes}
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
