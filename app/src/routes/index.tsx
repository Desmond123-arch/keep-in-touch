import React from "react";
import pathConstants from "./pathConstants";
import PrivateRoute from "../components/PrivateRoute";

const Home = React.lazy(() => import("../pages/Home"));
const SignUp = React.lazy(() => import("../pages/SignUp"));
const Login = React.lazy(() => import("../pages/Login"));
const Search = React.lazy(() => import("../pages/SearchPage"))
const Profile = React.lazy(() => import("../pages/Profile"))

const routes = [
    { path: pathConstants.HOME, element: 
      <PrivateRoute>
        <Home/>
      </PrivateRoute>
    },
    { path: pathConstants.SEARCH, element: 
      <PrivateRoute>
        <Search/>
      </PrivateRoute>
    },
    { path: pathConstants.PROFILE, element: 
      <PrivateRoute>
        <Profile/>
      </PrivateRoute>
    }

  ];
export const authRoutes = [
  { path: pathConstants.SIGHUP, element: <SignUp/>},
  { path: pathConstants.LOGIN, element: <Login/>}
]

export default routes;