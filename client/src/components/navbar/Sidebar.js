import React, { Fragment } from 'react'
import { elastic as Menu } from "react-burger-menu";
import {useHistory } from "react-router-dom";
import { useDispatch } from "react-redux"
import { setAuthUser } from "../../actions/userAction";
import { isAuthenticated, signout } from "../auth/helper";
import './Sidebar.css'

export default (props)=> {
  const history = useHistory();
  const dispatch = useDispatch()

    return (
        <Fragment>
        <h2 className="nav-title">Boilerplate App</h2>
        <Menu disableAutoFocus right>
  
        <a className="menu-item" href="/">
          Home
        </a>

        {!isAuthenticated()&&(
          <a className="menu-item" href="/signin">
            SignIn
          </a>
        )}

        {!isAuthenticated()&&(
          <a className="menu-item" href="/signup">
            SignUp
          </a>
        )}

        {isAuthenticated() && isAuthenticated().user.role == 0 && (
          <a className="menu-item" href="/dashboard">
            Dashboard
          </a>
        )}

        {isAuthenticated() && isAuthenticated().user.role == 1 && (
          <a className="menu-item" href="/admin/dashboard">
            Dashboard
          </a>
        )}


        {isAuthenticated()&&(
          <a className="menu-item" 
          onClick={
            ()=>{signout(
              ()=>{
                dispatch(setAuthUser(false))
                history.push("/signin");
              })}
              }>
            Signout
          </a>
        )}

      </Menu>
      </Fragment>
    )
}
