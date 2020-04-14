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
import { Router, Route, Switch, BrowserRouter, Redirect } from 'react-router-dom'
import { ToastProvider } from 'react-toast-notifications'

import Category from './views/Category'
import Restaurant from './views/Restaurant'
import Order from './views/Order'
// core components
// import RTL from './layouts/RTL'
// import * as serviceWorker from '../src1/serviceWorker';
import './assets/css/material-dashboard-react.css'
import * as firebase from 'firebase/app'
import 'firebase/analytics'
// import { AUTHEN_TOKEN } from './constants/define'

const hist = createBrowserHistory()
const firebaseConfig = {
  apiKey: 'AIzaSyBYnN-Ij2vKyDgk_G3rWxEn3qo4SCTgdaU',
  authDomain: 'orderanalystic.firebaseapp.com',
  databaseURL: 'https://orderanalystic.firebaseio.com',
  projectId: 'orderanalystic',
  storageBucket: 'orderanalystic.appspot.com',
  messagingSenderId: '135663922911',
  appId: '1:135663922911:web:f612d87f66572e43c0c36a',
  measurementId: 'G-9KDFJ9BPEQ',
}

firebase.initializeApp(firebaseConfig)
firebase.analytics()

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <ToastProvider>
          <div>
            <BrowserRouter>
              <div>
                <Router history={hist}>
                  <Switch>
                    <Route path="/category" component={Category} />
                    <Route exact path="/restaurant/:id" component={Restaurant} />
                    <Route path="/orderDetail" component={Order} />
                    {/* {authenToken ? <Redirect from="/" to="/admin/dashboard" /> : <Redirect from="/" to="/login" />} */}
                    <Redirect from="/" to="/category" />
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
