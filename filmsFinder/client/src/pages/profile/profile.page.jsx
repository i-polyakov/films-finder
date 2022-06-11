import React, { useContext, useEffect, useState } from 'react';
import SearchUser from '../../components/searchUser/searchUser';
import UserList from '../../components/usersList/userList';
import { AuthContext } from '../../context/auth.context';

import "./profile.page.scss"
const ProfilePage = () => {
    const { user, setUser } = useContext(AuthContext);
    const [ updateUser, setUpdateUser ] = useState();

    const handleClickInitModal = async (e) => {
        var elems = document.querySelectorAll('.modal');
        var instances = M.Modal.init(elems,{ dismissible:false});

        console.log("handle modal3");       
    }
    const handleClickCloseModal=()=>{
        //console.log(updateUser)
        if(updateUser&& updateUser._id){
            console.log("CloseModal, setUpdateUser");
            setUser(updateUser)
        }}
      //  handleClickSearch
    return (
        <div class ="user-container">
            <div className="user-wrapper  center-align">
                <div className="user-info">
                    <div className="user-about">
                        <div className="user-login">
                          
                                <img  
                                    alt="avatar"  
                                    src={user.profile && user.profile.avatar? user.profile.avatar: "/imgs/avatar.png"} 
                                    width="30" 
                                    height="30"/> 
                               <h5>   {user.login}
                            </h5>
                        </div>
                        <div className="user-name">
                        
                            <h5>{user.profile? user.profile.name:""}</h5>
                        </div>
                    </div>
                    <div className="user-stat ">
                       
                        <div className="films-stat col  center-align">
                            <h6>Посмотрю</h6> 
                            {user.want? user.want.length: 0}
                        </div>
                        <div className="films-stat col  center-align">
                            <h6>Просмотрены</h6>
                            {user.watched? user.watched.length: 0}
                        </div>
                    </div>
                </div>
                <div className="user-list">
                    <button data-target="modal2" 
                        class="btn waves-effect waves-light modal-trigger user-following"  
                        onClick={handleClickInitModal} >Подписки
                    </button>
                    <button data-target="modal3" 
                        class="btn waves-effect waves-light modal-trigger user-followers"  
                        onClick={handleClickInitModal} >Подписчики
                    </button>
                    <button data-target="modal4" 
                        class="btn waves-effect waves-light modal-trigger users-search"  
                        onClick={handleClickInitModal} >Поиск
                    </button>

                    <div id="modal2" class="modal modal-fixed-footer">
                        <div class="modal-content">	
                            <h3>Подписки</h3>
                            <div className="user-following-list">
                                <UserList list={user.following} OnUserChange = {setUpdateUser}  type="following"/>
                            </div>                          
                        </div>
                        <div class="modal-footer">
                            <input  class="modal-close waves-effect btn-flat submit" onClick={handleClickCloseModal} type="submit" value="Закрыть"  />                                            
                        </div>
                    </div>
                    <div id="modal3" class="modal  modal-fixed-footer">
                        <div class="modal-content">	
                            <h3>Подписчики</h3>
                            <div className="user-followers-list">
                            <UserList list={user.followers} OnUserChange = {setUpdateUser} type="followers"/>
                            </div>                          
                        </div>
                        <div class="modal-footer">
                            <input  class="modal-close waves-effect btn-flat submit" onClick={handleClickCloseModal} type="submit" value="Закрыть"  />                                            
                        </div>
                    </div>
                    <div id="modal4" class="modal modal-fixed-footer">
                        <div class="modal-content">	
                            <h3>Поиск</h3>
                           
                                <SearchUser setUpdateUser = {setUpdateUser}/>
                           
                            {/* <div className="user-following-list">
                                <UserList list={user.following} OnUserChange = {setUpdateUser}  type="following"/>
                            </div>                           */}
                        </div>
                        <div class="modal-footer">
                            <input  class="modal-close waves-effect btn-flat submit" onClick={handleClickCloseModal} type="submit" value="Закрыть"  />                                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;
