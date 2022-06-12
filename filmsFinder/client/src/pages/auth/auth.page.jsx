import React, { useState, useContext } from "react";
import { Outlet, Route, Link, Routes } from "react-router-dom";
import Login from "./login.jsx";
import Registration from "./registration.jsx";
import "./auth.page.scss";
import axios from "axios";
import { AuthContext } from "../../context/auth.context.jsx";
//axios.defaults.withCredentials = true

const AuthPage = () => {
  const [form, setForm] = useState({
    login: "",
    password: "",
  });

  const { login } = useContext(AuthContext);
  const changeHandler = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
    //console.log(form);
  };
  const registrationHandler = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8080/api/auth/registration",
        { ...form },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true
          
        }
      );
      //console.log(response.data);
      loginHandler()
     // login(response.data.data.session, response.data.data.user);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
  const loginHandler = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8080/api/auth/login",
        { ...form },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true
        }
      );
      console.log(response);
      login(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="container">
      <div className="wrapper">
        <Routes>
          <React.Fragment>
            <Route
              path=""
              element={
                <Login
                  loginHandler={loginHandler}
                  changeHandler={changeHandler}
                />
              }
            />
            <Route
              path="/auth/registration"
              element={
                <Registration
                  registrationHandler={registrationHandler}
                  changeHandler={changeHandler}
                />
              }
            />
          </React.Fragment>
        </Routes>
      </div>
    </div>
  );
};

export default AuthPage;
