import React from 'react';
import Header from './header.jsx'
import {BrowserRouter, Route, Link, Routes} from 'react-router-dom'
const Registration =  React.memo(({changeHandler, registrationHandler}) => {
    return (
        <div> 
            <Header/>  
            <div className="wrap">
                <form className="form form-reg" onSubmit={e=>e.preventDefault()}>                             
                    <input className="validate" name="login" onChange={changeHandler} type="text"  placeholder="  Логин"/>
                    <input className="validate" name="password" onChange={changeHandler} required="required" type="password" placeholder="  Пароль" /> 
                    <input className="validate" name="password_confirm" onChange={changeHandler} required="required" type="password" placeholder="  Повторите пароль" /> 
                    <div className="row">
                        <button className="wawes-effect wawes-light btn" onClick={registrationHandler}>Зарегистрироваться</button>
                        <Link className="btn-outline btn-reg" to="/auth/login">Есть аккаунт?</Link>
                    </div>
                </form>
            </div> 
        </div>    
    );
});

export default Registration;
