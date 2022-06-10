import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { NavLink, useLocation, useParams } from 'react-router-dom';
import { AuthContext } from '../../context/auth.context';
import Container from '../container/container';
import "./user.scss";
const User = () => {
    const {user,setUser} = useContext(AuthContext)

    const [userInfo, setUserInfo] = useState();
    const [isF, setIsFollowing] = useState(false);
    const params = useParams();
    //const { pathname } = useLocation();
    const getUserInfo = async() => {
        try {
            const response = await axios.get(
                `http://127.0.0.1:8080/api/users/${params.login}`,{    
                headers: {
                    "Content-Type": "application/json"
                }}
              );
              //console.log(response.data);
              setUserInfo( response.data)
              if(user.following&&response.data)
                setIsFollowing(user.following.find(item =>item === response.data._id)) 
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        console.log("getUserInfo");
        getUserInfo()
    }, [user]);
    
    const handleClick = async (elemLogin, isF, e) => {
        console.log("update");
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
                setUser(response.data)
              }
              
            }
            else{
              const response = await axios.put(
                `http://127.0.0.1:8080/api/users/follow/${elemLogin}`,{    
                 user: user
                });          
                if(user._id === response.data._id){
                    setUser(response.data)   
                }
                 
            }  
                
          } catch (error) {
            console.log(error);
          }
      }

    if(userInfo){
        console.log(isF);
        return (
            <div class ="user-container">
            <div className="user-wrapper  center-align">
                <div className="user-info">
                    <div className="user-about">
                        <div className="user-login">                     
                            <img  
                                alt="avatar"  
                                src={userInfo.profile && userInfo.profile.avatar? userInfo.profile.avatar: "/imgs/avatar.png"} 
                                width="30" 
                                height="30"/> 
                            <h5>   {userInfo.login} </h5>
                            <div className='follow-button'> 
                                <button
                                    class={isF? 'btn user-follow' : 'btn user-follow active-btn'} 
                                    onClick={(e)=>handleClick(userInfo.login,isF, e)}>{isF?"Подписан":"Подписаться"}
                                </button>
                            </div>
                        </div>
                        <div className="user-name">
                        
                            <h5>{userInfo.profile? userInfo.profile.name:""}</h5>
                        </div>
                    </div>
                    <div className="user-stat">
                    
                        <div className="films-stat col  center-align">
                            <h6>Посмотрю</h6> 
                            {userInfo.want? userInfo.want.length: 0}
                        </div>
                        <div className="films-stat col  center-align">
                            <h6>Просмотрены</h6>
                            {userInfo.watched? userInfo.watched.length: 0}
                        </div>
                    </div>
                </div>
                <div className="user-menu">
                    <div className="user-menu-item">
                        <NavLink
                        to={"/" + userInfo.login + "/want"}
                        className="valign-wrapper"
                        >
                        <img src="/icons/watch.svg" width="20" height="20" />
                        <h6>Посмотрю</h6>
                        </NavLink>
                    </div>
                    <div className="user-menu-item">
                        <NavLink
                        to={"/" + userInfo.login + "/watched"}
                        className="valign-wrapper"
                        >
                        <img
                            className="valign-wrapper"
                            src="/icons/viewed.svg"
                            width="20"
                            height="20"
                        />
                        <h6> Просмотрены</h6>
                    </NavLink>
                    </div>
                </div>
                <hr/>
                <Container/>
            </div>
        </div>
    );
}
}

export default User;
