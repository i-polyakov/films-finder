import React, { useContext, useEffect, useState } from "react";
import { matchRoutes, useLocation, useParams } from "react-router-dom";

import { SearchContext } from "../../context/search.context";
import Collection from "../collection/collection";
import "../recContainer/recContainer.scss";
import UserList from "../usersList/userList";

const SearchUser = ({setUpdateUser}) => {

  const [value, setValue] = useState(null)
  const handleClickSubmit = (e)=>{
    e.preventDefault()
    //console.log(document.getElementById("searchsUser").value);
    setValue(document.getElementById("searchsUser").value)
  }
  console.log(value);
  return (
  <div className="input-field search">
    <form  onSubmit={handleClickSubmit}>
      <input id ="searchsUser" type="text" placeholder="Пользователь..."/>
      <button type="submit" ><img src="/icons/search.svg" width="20" height="20" /></button>
    </form>
    <div className="user-following-list">
     { value?<UserList OnUserChange = {setUpdateUser} value={value}  type="search"/>:""}
    </div>
  </div>
  );
};

export default SearchUser;
