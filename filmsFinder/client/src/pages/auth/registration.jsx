import React from 'react';
import Header from './header.jsx'
import {BrowserRouter, Route, Link, Routes} from 'react-router-dom'
const Registration = () => {
    return (
        <div>
            <Header/>  
            <div className="wrap">
                <form className="form form-reg">                             
                    <input className="validate" name="login" type="text" placeholder="  Логин"/>
                    <input className="validate" name="password" required="required" type="password" placeholder="  Пароль" /> 
                    <input className="validate" name="password_confirm" required="required" type="password" placeholder="  Повторите пароль" /> 
                    <div className="row">
                        <button className="wawes-effect wawes-light btn">Зарегистрироваться</button>
                        <Link className="btn-outline btn-reg" to="/login">Есть аккаунт?</Link>
                    </div>
                </form>
            </div> 
        </div>    
    );
}

export default Registration;
