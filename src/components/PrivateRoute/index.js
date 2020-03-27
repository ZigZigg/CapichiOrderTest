import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'
import { AUTHEN_TOKEN } from '../../constants/define'

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      localStorage.getItem(AUTHEN_TOKEN) ? <Component {...props} /> : <Redirect to="/login" />
    }
  />
)

PrivateRoute.propTypes = {
  component: PropTypes.any,
}

export default PrivateRoute
