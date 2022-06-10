import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../context/auth.context";
import "./sidebar.scss";

const Sidebar = ({user}) => {
  return (
    <div className="wrapp">
      <div className="side_bar">
        <ul>
          <li>
            <NavLink
              to={"/" + user.login + "/main"}
              className="valign-wrapper"
            >
              <img src="/icons/home-page.svg" width="20" height="20" />
              Главная
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/" + user.login + "/want"}
              className="valign-wrapper"
            >
              <img src="/icons/watch.svg" width="20" height="20" />
              Посмотрю
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/" + user.login + "/watched"}
              className="valign-wrapper"
            >
              <img
                className="valign-wrapper"
                src="/icons/viewed.svg"
                width="20"
                height="20"
              />
              Просмотрены
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/" + user.login + "/profile"}
              className="valign-wrapper"
            >
              <img src="/icons/profile.svg" width="20" height="20" />
              Профиль
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/" + user.login + "/about"}
              className="valign-wrapper"
            >
              <img src="/icons/About.svg" width="20" height="20" />О сервисе
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
