import React, { Suspense, useEffect } from "react";
import {
  useSearchParams,
  Route,
  Navigate,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Container from "./components/container/container";
import Navbar from "./components/navbar/navbar";
import RecContainer from "./components/recContainer/recContainer";
import SearchFilm from "./components/searchFilm/searchFilm";
import Sidebar from "./components/sidebar/sidebar";
import User from "./components/user/user";
import FilmContextProvider from "./context/film.context";
import RecContextProvider from "./context/rec.context";
import SearchContextProvider from "./context/search.context";
import AboutPage from "./pages/about/about.page";
import AuthPage from "./pages/auth/auth.page";
import FilmPage from "./pages/film/film.page";
import ProfilePage from "./pages/profile/profile.page";

export const useRoutes = (isLogin, user, setUser) => {
 
  //const url = `/${user ? user.login : ""}`;
 const [url, setUrl] = React.useState("/");
  useEffect(() => {
    if(user&&user._id){
      //console.log(user); 
      setUrl(`/${user ? user.login : "/"}`)
    }
  });
 
  //let navigate = useNavigate();

  //navigate(event.target.action);

  if (isLogin) {
    return (
      <FilmContextProvider>
        <RecContextProvider>
          <SearchContextProvider>
            <Navbar />
            <Sidebar user={user} />
            <Suspense
              fallback={
                <div class="progress">
                  <div class="indeterminate"></div>
                </div>
              }
            >
              <Routes>
                <Route path="/*" element={<Navigate to={"/"+user.login+"/want"} replace />} />
                <Route
                  path={url + "/main"}
                  element={<RecContainer user={user} />}
                />
                <Route path={url + "/searching/:search"} element={<SearchFilm />} />
                <Route
                  path={url + "/want"}
                  element={<Container user={user} />}
                />
                <Route
                  path={url + "/watched"}
                  element={<Container user={user} />}
                />
                <Route
                  path={url + "/profile"}
                  element={<ProfilePage  />}
                />
                <Route
                  path={url + "/about"}
                  element={<AboutPage/>}
                />
                 <Route
                  path={"/:login/want"}
                  element={<User/>}
                />
                 <Route
                  path={"/:login/watched"}
                  element={<User/>}
                />
             
                 <Route
                  path={"/film/:id"}
                  element={<FilmPage user={user} />}
                />    
              </Routes>
            </Suspense>
          </SearchContextProvider>
        </RecContextProvider>
      </FilmContextProvider>
    );
  }
  return (
    <Routes>
      <Route path="/*" element={<AuthPage />} />
      {/* <Route path="/*" element={<Navigate to="/auth/login" replace />} /> */}
    </Routes>
  );
};
