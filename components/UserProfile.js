import React from 'react';

export default function UserProfile({user}) {
  return <div className='box-conter'>
    <img src={user.photoURL} className='card-img-center'></img>
    <p>@{user.username}</p>
    <h1>{user.displayName}</h1>
  </div>;
}
