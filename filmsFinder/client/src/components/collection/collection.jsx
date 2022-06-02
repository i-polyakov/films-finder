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
    return (
      <div class="col s12 m6">
        <div class="card horizontal">
          <div class="card-stacked">
            <div class="card-content">
              <span class="card-title">Список пуст</span>
            </div>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div>
      <ul>{films}</ul>
    </div>
  )
}

export default Collection