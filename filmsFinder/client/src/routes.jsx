import React from 'react';
import {useSearchParams, Route, Navigate, Routes} from 'react-router-dom'
import AuthPage from './pages/auth/auth.page';
import MainPage from './pages/main/main.page';


export const useRoutes = (isLogin, user) => {
    if(isLogin){
        return (
            <Routes>
                <Route path={"/"+user.login+"/*"} element={<MainPage user={user}/>}/>
                <Route path="*" element={<Navigate to={"/"+user.login+"/main"} replace />}/>
            </Routes>
        );
    }
    return (
        <Routes>
            <Route path="/auth/*" element={<AuthPage/>}/>
            <Route path="/*" element={<Navigate to="/auth/login" replace />}/>
        </Routes>
    );
}
    
