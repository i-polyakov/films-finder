import React from 'react';
import './navbar.scss'

const Navbar = () => {
    return (
        <div className="navbar-fixed">
            <nav>
                <div className="nav-wrapper navbar">
                    <a href="#!" className="left">	
                        <img className='logo' src="/icons/logo.svg"  alt=" " width="50" height="50"></img>
                    </a>
                    <div className="input-field right header__search">
                        <form  action="searching" method="GET" >						
                            <input id="search" type="search" name="search" placeholder=" Поиск..."/>
                            <button className='right' type="submit">	
                                <img src="/icons/search.svg" width="20" height="20"/>
                            </button>
                        </form>
				    </div>
                
                    <ul className="right hide-on-med-and-down">
                        <li><a href="sass.html">Sass</a></li>
                        <li><a href="badges.html">Components</a></li>
                    </ul>
                </div>
            </nav>
        </div>
    );
}

export default Navbar;
