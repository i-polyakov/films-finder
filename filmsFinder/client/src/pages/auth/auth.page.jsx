import React from 'react';
import {BrowserRouter, Route, Link, Routes} from 'react-router-dom'
import Login  from './login.jsx'
import Registration  from './registration.jsx'
import Header from './header.jsx'
import  './auth.page.scss'
const Auth = () => {
    return (
        <div className="container">
            <div className="wrapper">
                <Routes>   
                  
                    <React.Fragment>              
                        <Route path="/login"  element={<Login/>} />   
                        <Route path="/registration" element={<Registration/>} />                                 
                    </React.Fragment>
                </Routes>
            </div>	
        </div>	
    );
}

export default Auth;
