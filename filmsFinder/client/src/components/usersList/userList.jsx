import axios from 'axios';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/auth.context';

const UserList = ({ type, OnUserChange }) => {
  //const [isFollowing, setIsFollowing] = useState(false);
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
    console.log("setuserlist");
    setUsersList();
  }, [user]);
  const isFollowing = (elem)=>{
    return user.following.find(item =>item === elem)
  }

  const handleClick =  async (elemId, elemLogin, e) => {
    
      try {
        if (isFollowing(elemId)) {
          const response = await axios.delete(
            `http://127.0.0.1:8080/api/users/follow/${elemLogin}`,{    
              headers: {
                  "Content-Type": "application/json"
              },
              data:{user: user}
          });
          if(user._id === response.data._id)
            OnUserChange(response.data)
        }
        else{
          const response = await axios.put(
            `http://127.0.0.1:8080/api/users/follow/${elemLogin}`,{    
             user: user
            });          
            if(user._id === response.data._id)
              OnUserChange(response.data)
        }
        
      } catch (error) {
        console.log(error);
      }
  }
 
  let listItems;
  if (list && list.length > 0) {     
      listItems = list.map((elem) => {
        return <tr class= "">
            <td className="user">
              <NavLink to="" className=" link">
               <div className="avatar"> 
                <img  
                    alt="avatar"  
                    src={elem.profile && elem.profile.avatar? elem.profile.avatar: "/imgs/avatar.png"} 
                    width="30" 
                    height="30"/> 
                {elem.login}
                </div>
              </NavLink>
            </td>
            <td className='follow-button'> 
              <button
                class={isFollowing(elem._id)? 'btn user-follow active-btn' : 'btn user-follow'} 
                onClick={(e)=>handleClick(elem._id,elem.login, e)}>{isFollowing(elem._id)?"Подписан":"Подписаться"}
              </button>
            </td>
          </tr>;
      });
    }
    return ( 
      <table class='centered info'>                    
      <tbody>
        {listItems}
      </tbody>
  </table>
       
    );
}

export default UserList;
