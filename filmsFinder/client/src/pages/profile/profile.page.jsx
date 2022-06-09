import React, { useContext, useEffect, useState } from 'react';
import UserList from '../../components/usersList/userList';
import { AuthContext } from '../../context/auth.context';

import "./profile.page.scss"
const ProfilePage = () => {
    const { user, setUser } = useContext(AuthContext);
    const [ updateUser, setUpdateUser ] = useState({});

    const handleClickFollowing = async (e) => {
        var elems = document.querySelectorAll('.modal');
        const options = {
            onCloseStart: function(modal, trigger){
                console.log("onCloseStart");
                //console.log(updateUser&& updateUser._id);
                if(updateUser&& updateUser._id){
                    console.log("onCloseStart, updateUser");
                    setUser(updateUser)
                }},
            onCloseEnd: function(modal, trigger){
                console.log("onCloseEnd");
            }
        }
        var instances = M.Modal.init(elems,options);
        console.log("handle modal2");       
    }
    const handleClickFollowers = async (e) => {
        var elems = document.querySelectorAll('.modal');
        const options = {
            onCloseStart: function(modal, trigger){
                console.log("onCloseStart");
                //console.log(updateUser&& updateUser._id);
                if(updateUser&& updateUser._id){
                    console.log("onCloseStart, updateUser");
                    setUser(updateUser)
                }},
            onCloseEnd: function(modal, trigger){
                console.log("onCloseEnd");
            }
        }
        var instances = M.Modal.init(elems,options);
        console.log("handle modal3");       
    }
    useEffect(() => { 
        console.log("updateUser");
        console.log(user.following);
        if (updateUser) {
            console.log(updateUser.following);
        }
        
    }, [user,updateUser]);
    // const updateUser = (newUser) =>{
    //     setUser(newUser)
    // }
   //console.log(user);
    return (
        <div class ="user-container">
            <div className="user-wrapper  center-align">
                <div className="user-info">
                    <div className="user-about">
                        <div className="user-login">
                            <h5>{user.login}</h5>
                        </div>
                        <div className="user-name">
                            <h5>{user.profile? user.profile.name:""}</h5>
                        </div>
                    </div>
                    <div className="user-stat row">
                       
                        <div className="films-stat col s6 center-align">
                            <h6>Посмотрю</h6> 
                            {user.want? user.want.length: 0}
                        </div>
                        <div className="films-stat col s6 center-align">
                            <h6>Просмотрены</h6>
                            {user.watched? user.watched.length: 0}
                        </div>
                    </div>
                </div>
                <div className="user-list">
                    <button data-target="modal2" 
                        class="btn waves-effect waves-light modal-trigger user-following"  
                        onClick={handleClickFollowing} >Подписки
                    </button>
                    <button data-target="modal3" 
                        class="btn waves-effect waves-light modal-trigger user-following"  
                        onClick={handleClickFollowers} >Подписчики
                    </button>

                    <div id="modal2" class="modal">
                        <div class="modal-content">	
                            <h3>Подписки</h3>
                            <div className="user-following-list">
                                <UserList list={user.following} OnUserChange = {setUpdateUser} type="following"/>
                            </div>                          
                        </div>
                        <div class="modal-footer">
                            <input  class="modal-close waves-effect btn-flat submit" type="submit" value="Закрыть"  />                                            
                        </div>
                    </div>
                    <div id="modal3" class="modal">
                        <div class="modal-content">	
                            <h3>Подписчики</h3>
                            <div className="user-followers-list">
                            <UserList list={user.followers} OnUserChange = {setUpdateUser} type="followers"/>
                            </div>                          
                        </div>
                        <div class="modal-footer">
                            <input  class="modal-close waves-effect btn-flat submit" type="submit" value="Закрыть"  />                                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;
