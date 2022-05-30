import React, {useState } from 'react';
import {BrowserRouter, Route, Link, Routes} from 'react-router-dom'
import Login  from './login.jsx'
import Registration  from './registration.jsx'
import Header from './header.jsx'
import  './auth.page.scss'
import axios from 'axios';

const Auth = () => {
    const [form,setForm] = useState({
        login:"",
        password:""
    })
    const  changeHandler = (event)=>{
        setForm({...form,[event.target.name]: event.target.value})
        console.log(form)
    }
    const registrationHandler = async () =>{
        try {
            const response = await axios.post("http://127.0.0.1:8080/api/auth/registration",{...form},{
                headers:{
                 'Content-Type':'application/json'
                }
           })
           console.log(response)
        } catch (error) {
            console.log(error)
        }
    }
    const loginHandler = async () =>{
        try {
            const response = await axios.post("http://127.0.0.1:8080/api/auth/login",{...form},{
                headers:{
                 'Content-Type':'application/json'
                }
           })
           console.log(response)
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className="container">
            <div className="wrapper">
                <Routes>   
                    <React.Fragment>              
                        <Route path="/login"  element={<Login loginHandler={loginHandler} changeHandler={changeHandler}/>} />   
                        <Route path="/registration" element={<Registration registrationHandler={registrationHandler} changeHandler={changeHandler}/>} />                                 
                    </React.Fragment>
                </Routes>
            </div>	
        </div>	
    );
}

export default Auth;
