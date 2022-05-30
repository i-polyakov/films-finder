import React from 'react';
import Header from './header.jsx'
import {BrowserRouter, Route, Link, Routes} from 'react-router-dom'
const Login = () => {
    return (     
        <div>
            <Header/>  
            <div className="wrap">
                <form className="form form-login">                             
                    <input className="validate" name="login" type="text" placeholder="  Логин"/>
                    <input className="validate" name="password" required="required" type="password" placeholder="  Пароль" /> 
                    <div className="row">
                        <button className="wawes-effect wawes-light btn">Войти</button>
                        <Link className="btn-outline btn-reg" to="/registration">Нет аккаунта?</Link>
                    </div>
                </form>
            </div>      
        </div>  
       
    );
}

export default Login;
