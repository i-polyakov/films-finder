import React from 'react'
import Header from '../auth/header';
import "./about.page.scss";
const  AboutPage = () => {
  return (

   <div className="about__container">
     
     <Header/>
     
     <p><h5>Наша миссия — помочь вам с выбором фильма для просмотра.</h5></p>
      <p><h5>Рекомендательная система подберет именно те фильмы, которые будут интересны именно вам.</h5></p>
      <br></br>
      <p><h5>Подписывайтесь на других пользователей.</h5></p>
      <br></br>
      <p><h5>Делитесь мнением о фильмах.</h5></p>
      <br></br>
      <p><h5>Составляете списки фильмов.</h5></p>
   </div>
  
  )
}
export default  AboutPage