/* eslint-disable no-undef */
import request from './request'
import { loginApi, signOutApi } from './config'
import { getMessageErrorFormServer } from '../commons'

export const signInApi = async payload => {
  const { email, password, deviceToken } = payload
  try {
    const formData = new FormData()
    formData.append('restaurant[email]', email)
    formData.append('restaurant[password]', password)
    formData.append('device_token', deviceToken || 'device_token')
    const { data } = await request('').post(`${loginApi}`, formData)
    return {
      status: 'success',
      data: data.data,
    }
  } catch (error) {
    return {
      status: 'failed',
      message: getMessageErrorFormServer(error),
    }
  }
}

export const logOutApi = async authenToken => {
  try {
    const { data } = await request(authenToken).delete(`${signOutApi}`)
    return {
      status: 'success',
      message: data.message[0],
    }
  } catch (error) {
    return {
      status: 'failed',
      message: getMessageErrorFormServer(error),
    }
  }
}
