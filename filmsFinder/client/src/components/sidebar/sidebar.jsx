import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/auth.context';
import './sidebar.scss'

const Sidebar = (user) => {
    return (
        <div className="wrapp">
			<div className="side_bar">
				<ul>
				    <li><Link to={"main"}><img src="/icons/home-page.svg" width="20" height="20"/>Главная</Link></li>
				    <li><Link to={"want"}><img src="/icons/watch.svg" width="20" height="20"/>Посмотрю</Link></li>
				    <li><Link to={"/"+user.login+"/wanted"}><img src="/icons/viewed.svg" width="20" height="20"/>Просмотрены</Link></li>
                    <li><Link to={"/"+user.login+"/profile"}><img src="/icons/profile.svg" width="20" height="20"/>Профиль</Link></li>				  
				    <li><Link to={"/"+user.login+"/about"}><img src="/icons/About.svg" width="20" height="20"/>О сервисе</Link></li> 
				</ul>
			</div>
        </div>
    );
}

export default Sidebar;
