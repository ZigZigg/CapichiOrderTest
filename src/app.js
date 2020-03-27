/*!

=========================================================
* Material Dashboard React - v1.8.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from 'react'
// import ReactDOM from "react-dom";
import { createBrowserHistory } from 'history'
// import PropTypes from 'prop-types'
import { Router, Route, Switch, Redirect, BrowserRouter } from 'react-router-dom'
import { ToastProvider } from 'react-toast-notifications'

import PrivateRoute from './components/PrivateRoute'
// core components
import Admin from './layouts/Admin'
import Login from './layouts/Login'
// import RTL from './layouts/RTL'
// import * as serviceWorker from '../src1/serviceWorker';
import './assets/css/material-dashboard-react.css'
import { AUTHEN_TOKEN } from './constants/define'

const hist = createBrowserHistory()

function App() {
  const authenToken = localStorage.getItem(AUTHEN_TOKEN)
  const defaultRedirect = routeProps => {
    const { match, history } = routeProps
    if (!authenToken) {
      return <Redirect to={`${match.url}login`} />
    }
    if (history.location.pathname.slice(1) === 'login') {
      return <Redirect to={`${match.url}admin/user`} />
    }
    if (history.location.pathname === '/') {
      return !authenToken ? (
        <Redirect to={`${match.url}login`} />
      ) : (
        <Redirect to={`${match.url}admin/user`} />
      )
    }
    return history.location.pathname.slice(-1) === '/' ? (
      <Redirect
        to={`${history.location.pathname.slice(0, -1)}${history.location.search}${
          history.location.hash
        }`}
      />
    ) : (
      <Redirect to={`${match.url}admin/user`} />
    )
  }
  return (
    <div className="App">
      <header className="App-header">
        <ToastProvider>
          <div>
            <BrowserRouter>
              <div>
                <Router history={hist}>
                  <Switch>
                    <Route exact path="/login" component={Login} />
                    <PrivateRoute path="/admin" component={Admin} />
                    <Route render={defaultRedirect} />
                    {/* {authenToken ? <Redirect from="/" to="/admin/dashboard" /> : <Redirect from="/" to="/login" />} */}
                  </Switch>
                </Router>
              </div>
            </BrowserRouter>
          </div>
        </ToastProvider>
      </header>
    </div>
  )
}

export default App
