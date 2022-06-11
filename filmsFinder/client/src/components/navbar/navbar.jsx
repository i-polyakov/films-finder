import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/auth.context";
import "./navbar.scss";

const Navbar = () => {
  const { islogin, logout, user } = useContext(AuthContext);
  console.log(
    `${user.login}/searching/${
      document.getElementById("search")
        ? document.getElementById("search").value
        : ""
    }`
  );
  

  const [searchTerm, setSearchTerm] = React.useState("");

  const handleChange = (event) => {
    setSearchTerm(document.getElementById("search").value);
  };

  return (
    <div className="navbar-fixed">
      <nav>
        <div className="nav-wrapper navbar">
          <Link href={`${user.login}/about`} onClick = {e=>{e.preventDefault()}} className="left valign-wrapper">
            <img
              className="logo"
              src="/icons/logo.svg"
              alt="Films finder"
              width="50"
              height="50"
            ></img><div className="logo-text">Films finder</div>
          </Link>
          <div className="input-field right header__search">
            <form
              action="searching"
              method="GET"
              onSubmit={(e) => e.preventDefault}
            >
              <input
                id="search"
                type="search"
                value={searchTerm}
                name="search"
                onChange={handleChange}
                autoComplete="off"
                placeholder=" Поиск..."
              />
              <Link
                className="right button"
                to={`${user.login}/searching/${
                  document.getElementById("search")
                    ? document.getElementById("search").value
                    : ""
                }`}
                onClick={handleChange}
              >
                <img src="/icons/search.svg" width="20" height="20" />
              </Link>
            </form>
          </div>

          <ul className="right hide-on-med-and-down">
            <li>
              <a href="/" onClick={logout}>
                Выйти
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
