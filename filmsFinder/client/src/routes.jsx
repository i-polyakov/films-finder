import React, { Suspense } from 'react';
import {useSearchParams, Route, Navigate, Routes, useLocation} from 'react-router-dom'
import Container from './components/container/container';
import Navbar from './components/navbar/navbar';
import RecContainer from './components/recContainer/recContainer';
import Sidebar from './components/sidebar/sidebar';
import FilmContextProvider from './context/film.context';
import RecContextProvider from './context/rec.context';
import AuthPage from './pages/auth/auth.page';



export const useRoutes = (isLogin, user) => {
   
    const url = `/${user? user.login:''}`
    
    if(isLogin){
        return (
            <FilmContextProvider>
                <RecContextProvider>
                    <Navbar/>
                    <Sidebar user={user}/>
                    <Suspense fallback={ <div class="progress"><div class="indeterminate"></div></div>}>
                        <Routes> 
                            <Route path='*' element={<Navigate to={url+"/want"} replace />}/>
                            <Route path={url+"/main"} element={<RecContainer user={user}/>}/>
                            <Route path={url+"/want"} element={<Container user={user}/>}/>
                            <Route path={url+"/watched"} element={<Container user={user}/>}/>
                        </Routes>
                    </Suspense>
                </RecContextProvider>
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
    
