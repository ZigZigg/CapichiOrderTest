import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { messaging } from '../../../setup/init-fcm'
import { DEVICE_TOKEN } from '../../../constants/define'

export default class Touch extends Component {
  async componentDidMount() {
    messaging
      .requestPermission()
      .then(async () => {
        const token = await messaging.getToken()
        localStorage.setItem(DEVICE_TOKEN, token)
      })
      .catch(() => {
        // console.log('Unable to get permission to notify.', err)
      })
    // messaging.onMessage(payload => console.log('Message received. ', payload))
    navigator.serviceWorker.addEventListener('message', message => {
      const { addToast } = this.props
      const content = (
        <div>
          {message.data.firebaseMessaging.payload.notification.title}
          <br />
          {message.data.firebaseMessaging.payload.notification.body}
        </div>
      )

      addToast(content, {
        appearance: 'success',
        autoDismiss: true,
      })
    })
  }

  render() {
    return null
  }
}

Touch.propTypes = {
  addToast: PropTypes.func,
}
