import React from 'react'
import Film from '../film/film';
import "./collection.scss"
function Collection({props, user}) {
  const results = props.data;
  console.log(results);
  let films;
  if (results&& results.length>0) {
    films = results.map(film => {
     
      return <Film info={film} />;
    });
  }
  else{
    return <h2>Список пуст</h2>
  }
  return (
    <div>
      <ul>{films}</ul>
    </div>
  )
}

export default Collection