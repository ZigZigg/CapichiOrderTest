import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import classnames from 'classnames'
import CircularProgress from '@material-ui/core/CircularProgress'
import _ from 'lodash'
import styles from '../assets/jss/material-dashboard-react/layouts/loginStyle'
import bgImage from '../assets/img/cover.png'
import { signInApi } from '../api'
import '../assets/css/Login/styles.css'
import { validateEmail, validatePassword } from '../commons'
import logo from '../assets/img/logo.png'
import { messaging } from '../setup/init-fcm'
import { DEVICE_TOKEN, AUTHEN_TOKEN } from '../constants/define'

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      errorPassword: undefined,
      errorEmail: undefined,
      errorText: null,
      isLoading: false,
    }
    // this.onChangeFormData = _.debounce(this.onChangeFormData, 200)
  }

  componentDidMount() {
    const { history } = this.props
    const authenToken = localStorage.getItem(AUTHEN_TOKEN)
    if (authenToken) {
      history.push('/admin/user')
    }
    messaging
      .requestPermission()
      .then(async () => {
        const token = await messaging.getToken()
        localStorage.setItem(DEVICE_TOKEN, token)
      })
      .catch(() => {
        // console.log('Unable to get permission to notify.', err)
      })
  }

  /**
   * handle change form data
   */
  onChangeFormData = event => {
    const { value, name } = event.target
    this.setState({
      errorText: null,
    })
    if (name === 'email' && !_.isUndefined(value)) {
      this.setState({ email: value, errorEmail: validateEmail(value) })
    }
    if (name === 'password' && !_.isUndefined(value)) {
      this.setState({
        password: value,
        errorPassword: validatePassword(value),
      })
    }
  }

  /**
   * Handle press key
   */
  handlePressKey = ev => {
    if (ev.key === 'Enter') {
      ev.preventDefault()
      this.onSubmitForm()
    }
  }

  /**
   * Handle submit form data
   */
  onSubmitForm = async () => {
    try {
      const { email, password } = this.state
      const { history } = this.props
      if (email === '' || password === '') {
        this.setState({
          errorText: 'Hãy điền đầy đủ thông tin cho tất cả các mục.',
        })
        return
      }

      if (validateEmail(email) !== '') {
        return
      }

      if (validatePassword(password) !== '') {
        return
      }
      const deviceToken = localStorage.getItem(DEVICE_TOKEN)
      const payload = {
        email,
        password,
        deviceToken,
      }
      this.setState({
        isLoading: true,
      })

      const data = await signInApi(payload)
      if (data.status === 'success') {
        localStorage.setItem(AUTHEN_TOKEN, data.data.authentication_token)
        history.push('/admin/user')
      } else {
        this.setState({
          errorText: data.message,
        })
      }

      this.setState({
        isLoading: false,
      })
    } catch (e) {
      // console.warn(e)
    }
  }

  render() {
    const { classes } = this.props
    const { email, password, errorEmail, errorPassword, errorText, isLoading } = this.state
    // console.log({errorEmail, errorPassword});
    const formClasses = classnames('form-view', classes.formView)
    return (
      <div className={classes.wrapper} style={{ backgroundImage: `url(${bgImage})` }}>
        <form onSubmit={this.onSubmitForm} className={formClasses}>
          <div className={classes.viewOverlay}>
            <img style={{ width: '80px' }} alt="logo" src={logo} />
            <span className="login-label">Xin chào</span>
          </div>

          <TextField
            error={!!errorEmail}
            helperText={errorEmail}
            className={classes.input}
            value={email}
            style={{ marginTop: '150px' }}
            id="outlined-search"
            label="Email"
            type="search"
            variant="outlined"
            name="email"
            onChange={this.onChangeFormData}
            onKeyPress={this.handlePressKey}
          />
          <TextField
            onKeyPress={this.handlePressKey}
            error={!!errorPassword}
            helperText={errorPassword}
            className={classes.input}
            value={password}
            id="outlined-search"
            label="Mật khẩu"
            type="password"
            name="password"
            variant="outlined"
            onChange={this.onChangeFormData}
          />
          {errorText && <p className={classes.errorText}>{errorText}</p>}

          <Button
            variant="contained"
            color="primary"
            className="btn-login"
            onClick={this.onSubmitForm}
            style={{ backgroundColor: '#F7941D' }}
          >
            {isLoading ? <CircularProgress size={30} color="inherit" /> : `Đăng nhập`}
          </Button>
        </form>
      </div>
    )
  }
}

Login.propTypes = {
  history: PropTypes.any,
  classes: PropTypes.any,
}

export default withStyles(styles)(Login)
