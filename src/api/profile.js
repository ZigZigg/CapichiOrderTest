/* eslint-disable no-undef */
import request from './request'
import { profileApi, getListUser } from './config'
import { getMessageErrorFormServer } from '../commons'

export const getProfileApi = async authenToken => {
  try {
    const { data } = await request(authenToken).get(`${profileApi}`)
    // console.log({ data })
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

export const getListUserApi = async (authenToken, keyword = '', page = 0) => {
  console.log('getListUserApi -> authenToken', authenToken)
  try {
    const { data } = await request(authenToken).get(
      `${getListUser}?keyword=${keyword}&page=${page}&all=${!page}`
    )
    // console.log({ data })
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

export const test = async () => {}
