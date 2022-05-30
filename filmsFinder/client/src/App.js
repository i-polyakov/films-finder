import React from 'react';
import 'materialize-css'
import './App.scss';
import {BrowserRouter, Route, Link, Routes} from 'react-router-dom'
import Navbar from './components/navbar/navbar.jsx';
import Auth from './pages/auth/auth.page';

function App() {
  return (
    <BrowserRouter>
     {/* <Navbar/> */}
     <Auth/>
     </BrowserRouter>
  );
}

export default App;
