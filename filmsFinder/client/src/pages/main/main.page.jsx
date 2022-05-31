import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from '../../components/navbar/navbar.jsx';
import Sidebar from '../../components/sidebar/sidebar.jsx';
import Want from '../../components/want/want.jsx';

const MainPage = (user) => {
    return (
        <div>
            <Navbar/>
            <Sidebar user={user}/>
            <Routes>   
                <React.Fragment>                    
                    <Route path="/want" element={<Want />} />                                                  
                </React.Fragment>
            </Routes>              
            
        </div>
    );
}

export default MainPage;
