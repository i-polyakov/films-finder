import React, { useContext, useEffect, useState } from "react";
import { matchRoutes, useLocation, useParams } from "react-router-dom";

import { SearchContext } from "../../context/search.context";
import Collection from "../collection/collection";
import "../recContainer/recContainer.scss";

const Search = () => {
  const params = useParams();
  console.log(params.search);
  const { pathname } = useLocation();
  const { films, isload, run } = useContext(SearchContext);

  useEffect(() => {
    run(params.search);
  }, [params.search]);

  return (
    <div className="film-container">
      <div class="col s12 m6">
        <div class="card horizontal">
          <div class="card-stacked">
            <div class="card-content">
              <span class="card-title">Результат поиска</span>
              {!isload ? (
                <Collection props={films} isSearch = {true} />
              ) : (
                <div class="progress">
                  <div class="indeterminate"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
