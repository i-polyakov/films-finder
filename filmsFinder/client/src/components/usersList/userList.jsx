import axios from 'axios';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/auth.context';

const UserList = ({ type, OnUserChange, updateUser, value}) => {
  const [localUser, setlocalUser] = useState();
  //const [isFollowing, setIsFollowing] = useState(false);
  const [list, setList] = useState();
  const [listItems, setListItems] = useState();
  const {user, setUser} = useContext(AuthContext)

  const setUsersList = async() => {
    try {
      console.log(type);
      if(type === "following"){
        const response = await axios.get(
          `http://127.0.0.1:8080/api/users/${user.login}/following`,{    
          headers: {
              "Content-Type": "application/json"
          }}
        );
        setList( response.data)

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
      else if(type === "search"){
        const response = await axios.post(
          "http://127.0.0.1:8080/api/users",{ login: value },{headers: {
            "Content-Type": "application/json"
        }}
           
        );
        setList(response.data)
      }
      //console.log("test1");
    } catch (error) {
      console.log(error);
    }
  }   
  // useEffect(()=>{
  //   console.log(user);
  //   setUsersList();
  //   console.log("test2");
  // }, []);
  useEffect(()=>{
    //console.log("setlist +"+ type);
    setUsersList();
    //console.log("setlocalUser");
    setlocalUser(user)
    //console.log("test2");
  }, [user,value]);
  const isFollowing = (elem)=>{
    //console.log(localUser);
    if (localUser&&localUser.following) {
      return localUser.following.find(item =>item === elem)
    }
    return user.following.find(item =>item === elem)
  }

  const handleClick = async (elemId, elemLogin, isF, e) => {
    //console.log("update");
      try {
        if (isF) {
          const response = await axios.delete(
            `http://127.0.0.1:8080/api/users/follow/${elemLogin}`,{    
              headers: {
                  "Content-Type": "application/json"
              },
              data:{user: user}
          });
          if(user._id === response.data._id){
            //setList(response.data.following)
            setlocalUser(response.data)
            OnUserChange(response.data)
          }
          
        }
        else{
          const response = await axios.put(
            `http://127.0.0.1:8080/api/users/follow/${elemLogin}`,{    
             user: user
            });          
            if(user._id === response.data._id){
              //setList(response.data.following)
              setlocalUser(response.data)
              OnUserChange(response.data)             
            }
             
        }  
            
      } catch (error) {
        console.log(error);
      }
  }
useEffect(() => {
  setlocalUser({})
  
}, []);
 useEffect(() => {
   //setUser(localUser)
  //console.log(list);
  if (list && list.length > 0) {
     
      setListItems( list.map((elem) => {
        let isF = isFollowing(elem._id)
        //console.log(elem);
        return <tr class= "">
            <td className="user">
              <Link to={`/${elem.login}/want`} onClick={()=>{localUser._id?setUser(localUser):""}} elem={elem} className=" link">
               <div className="avatar"> 
                <img  
                    alt="avatar"  
                    src={elem.profile && elem.profile.avatar? elem.profile.avatar: "/imgs/avatar.png"} 
                    width="30" 
                    height="30"/> 
                {elem.login}
                </div>
              </Link>
            </td>
            <td className='follow-button'> 
             { elem.login!=user.login?<button
                class={isF? 'btn user-follow' : 'btn user-follow active-btn'} 
                onClick={(e)=>handleClick(elem._id,elem.login,isF, e)}>{isF?"Подписан":"Подписаться"}
              </button>:""}
            </td>
          </tr>;
      })
      )
    }
 }, [list,localUser]);
    return ( 
      <table class='centered info'>                    
      <tbody>
        {listItems?listItems:"Не найдено!"}
      </tbody>
  </table>
       
    );
}

export default UserList;
