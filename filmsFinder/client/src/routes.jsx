import React, { Suspense } from "react";
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
import Search from "./components/search/search";
import Sidebar from "./components/sidebar/sidebar";
import FilmContextProvider from "./context/film.context";
import RecContextProvider from "./context/rec.context";
import SearchContextProvider from "./context/search.context";
import AuthPage from "./pages/auth/auth.page";
import FilmPage from "./pages/film/film.page";

export const useRoutes = (isLogin, user) => {
  const url = `/${user ? user.login : ""}`;

  const [searchResults, setSearchResults] = React.useState([]);
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
                <Route
                  path="*"
                  element={<Navigate to={url + "/want"} replace />}
                />
                <Route
                  path={url + "/main"}
                  element={<RecContainer user={user} />}
                />
                <Route path={url + "/searching/:search"} element={<Search />} />
                <Route
                  path={url + "/want"}
                  element={<Container user={user} />}
                />
                <Route
                  path={url + "/watched"}
                  element={<Container user={user} />}
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
      <Route path="/auth/*" element={<AuthPage />} />
      <Route path="/*" element={<Navigate to="/auth/login" replace />} />
    </Routes>
  );
};
