import React from "react";
import pathConstants from "./pathConstants";
import MainLayout from "../components/MainLayout";
import AuthLayout from "../components/AuthLayout";

const Home = React.lazy(() => import("../pages/Home"));
const SignUp = React.lazy(() => import("../pages/SignUp"));
const Login = React.lazy(() => import("../pages/Login"));

const routes = [
    { path: pathConstants.HOME, element: <Home/> },

  ];
export const authRoutes = [
  { path: pathConstants.SIGHUP, element: <SignUp/>},
  { path: pathConstants.LOGIN, element: <Login/>}
]

export default routes;