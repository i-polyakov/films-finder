import React, { useEffect } from 'react';

const UserList = ({user}) => {

  const   someUser= ['someUser','someUser','someUser','someUser','someUser']
    useEffect(() => {
        
       
    }, [user]);
    let u
    //if (user.following && user.following > 0) {
        u = someUser.map((elem) => {
         
          return <li className="col s12 user">some user</li>;
        });
     // }
    return (
        <ul className="s12 row">
            {u}
        </ul>
    );
}

export default UserList;
