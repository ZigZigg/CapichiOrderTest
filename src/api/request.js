/* eslint-disable no-nested-ternary */
/* eslint-disable import/prefer-default-export */
import axios from 'axios'
import { baseURL, TIMEOUT } from './config'
// 'R37Lph8D_ARh9aTJ5m8r'
// eslint-disable-next-line prefer-destructuring
const CancelToken = axios.CancelToken
const source = CancelToken.source()

const request = (authenToken, cancelToken) => {
  const defaultOptions = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: authenToken ? `${authenToken}` : '',
    },
    baseURL,
    timeout: TIMEOUT,
    cancelToken: cancelToken ? cancelToken.token : source.token,
  }

  return {
    get: (url, options = {}) => axios.get(url, { ...defaultOptions, ...options }),
    post: (url, data, options = {}) => {
      return axios.post(url, data, { ...defaultOptions, ...options })
    },
    put: (url, data, options = {}) => axios.put(url, data, { ...defaultOptions, ...options }),
    delete: (url, options = {}) => axios.delete(url, { ...defaultOptions, ...options }),
  }
}

// source.cancel('Operation canceled by the user.'); (handle user cancel)
export default request
