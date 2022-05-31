import React from 'react';
import {useSearchParams, Route, Navigate, Routes, useLocation} from 'react-router-dom'
import Container from './components/container/container';
import Navbar from './components/navbar/navbar';
import Sidebar from './components/sidebar/sidebar';
import FilmContextProvider from './context/film.context';
import AuthPage from './pages/auth/auth.page';
import MainPage from './pages/main/main.page';


export const useRoutes = (isLogin, user) => {
   
    const url = `/${user? user.login:''}`
    
    if(isLogin){
        return (
            <FilmContextProvider>
                <Navbar/>
                <Sidebar user={user}/>
                <Routes> 
                    <Route path='*' element={<Navigate to={url+"/want"} replace />}/>
                    <Route path={url+"/main"} element={<MainPage user={user}/>}/>
                    <Route path={url+"/want"} element={<Container user={user}/>}/>
                </Routes>
            </FilmContextProvider>
           
        );
    }
    return (
        <Routes>
            <Route path="/auth/*" element={<AuthPage/>}/>
            <Route path="/*" element={<Navigate to="/auth/login" replace />}/>
        </Routes>
    );
}
    
