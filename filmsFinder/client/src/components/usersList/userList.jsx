import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/auth.context';

const UserList = ({ type}) => {

  const [list, setList] = useState();
  const {user} = useContext(AuthContext)

  const setUsersList = async() => {
    try {
      if(type === "following"){
        const response = await axios.get(
          `http://127.0.0.1:8080/api/users/${user.login}/following`,{    
          headers: {
              "Content-Type": "application/json"
          }}
        );
        setList(response.data)

      }
      else if(type === "followers"){
        const response = await axios.get(
          `http://127.0.0.1:8080/api/users/${user.login}/followers`,{    
          headers: {
              "Content-Type": "application/json"
          }}
        );
        setList(response.data)

      }
    } catch (error) {
      console.log(error);
    }
  }      
  useEffect(()=>{
    setUsersList();
  }, [user]);
  console.log(list);
    let listItems;
  if (list && list.length > 0) {
      
      listItems = list.map((elem) => {
        //console.log(elem);
        return <li className="s12 col user "><NavLink to="" className="link">{elem.login}</NavLink></li>;
      });
    }
    return (
        <ul className="s12 row">
            {listItems}
        </ul>
    );
}

export default UserList;
