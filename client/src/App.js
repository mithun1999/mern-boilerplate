import React from "react";
import {BrowserRouter, Switch, Route} from "react-router-dom";
import PrivateRoute from "./components/auth/helper/PrivateRoutes"
import AdminRoute from "./components/auth/helper/AdminRoutes"
import Dashboard from "./components/dashboard/Dashboard";
import Home from "./components/home/Home";
import Activate from "./components/user/Activate";
import ForgotPassword from "./components/user/ForgotPassword";
import NewPassword from "./components/user/NewPassword";
import Signin from "./components/user/Signin";
import Signup from "./components/user/Signup";
import AdminDashboard from "./components/dashboard/AdminDashboard"

export default function App(){

  return (
      <BrowserRouter>
          <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/signin" component={Signin} />
              <Route exact path="/signup" component={Signup} />
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
              <AdminRoute exact path="/admin/dashboard" component={AdminDashboard} />
              <Route exact path="/users/activate/:token" component={Activate} />
              <Route exact path="/forgotpassword" component={ForgotPassword} />
              <Route exact path="/users/newpassword/:token" component={NewPassword} />
          </Switch>
      </BrowserRouter>
  )
}