import React, { useState, memo } from "react";
import Header from "./header.jsx";
import { BrowserRouter, Route, Link, Routes } from "react-router-dom";
const Login = React.memo(({ changeHandler, loginHandler }) => {
  return (
    <div>
      <Header />
      <div className="wrap">
        <form className="form form-login " onSubmit={(e) => e.preventDefault()}>
          <input
            className="validate"
            name="login"
            type="text"
            onChange={changeHandler}
            placeholder="  Логин"
          />
          <input
            className="validate"
            name="password"
            type="password"
            required="required"
            onChange={changeHandler}
            placeholder="  Пароль"
          />
          <div className="row">
            <button
              className="wawes-effect wawes-light btn"
              onClick={loginHandler}
            >
              Войти
            </button>
            <Link className="btn-outline btn-reg" to="/auth/registration">
              Нет аккаунта?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
});

export default Login;
