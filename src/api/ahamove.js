import Axios from 'axios'
// import { categoryApi } from './config'
// import { getMessageErrorFormServer } from '../commons'

// eslint-disable-next-line import/prefer-default-export
export const urlAhamove = 'https://apistg.ahamove.com/v1'
export const nameAhamove = 'Ahamove+Test+User'
export const apiKeyAhamove = '567f7630b9aae8ad80f7a31ed31b6abc'

export const getTokenAhamove = async ({ phone = 'hanoi', address }) => {
  try {
    const url = `${urlAhamove}/partner/register_account?address=${address}&mobile=${phone}&name=${nameAhamove}&api_key=${apiKeyAhamove}`
    const result = await Axios.get(url)
    const { token } = result.data
    if (!token)
      return {
        isSuccess: false,
        message: 'error400',
      }
    return {
      isSuccess: true,
      token,
    }
  } catch (e) {
    return {
      isSuccess: false,
      message: 'error400',
    }
  }
}

export const getDistanceAhamove = async ({
  token,
  service_id = 'HAN-BIKE',
  path,
  request = '[]',
  order_time = '0',
  idle_until = '',
}) => {
  try {
    const url = `https://apistg.ahamove.com/v1/order/estimated_fee?token=${token}&service_id=${service_id}&order_time=${order_time}&path=${path}&request=${request}&idle_until=${idle_until}`
    const result = await Axios.get(url)
    const { data } = result
    if (!data)
      return {
        isSuccess: false,
        message: 'error400',
      }
    return {
      isSuccess: true,
      data,
    }
  } catch (e) {
    // console.log(e)
    return {
      isSuccess: false,
      message: 'error400',
    }
  }
}

export const createOfferAhamove = async ({
  token,
  service_id = 'HAN-BIKE',
  path,
  request = '[]',
  order_time = '0',
  idle_until = '',
}) => {
  try {
    const url = `https://apistg.ahamove.com/v1/order/create?token=${token}&service_id=${service_id}&order_time=${order_time}&path=${path}&request=${request}&idle_until=${idle_until}`
    const result = await Axios.get(url)
    const { data } = result
    if (!data)
      return {
        isSuccess: false,
        message: 'error400',
      }
    return {
      isSuccess: true,
      data,
    }
  } catch (e) {
    // console.log(e)
    return {
      isSuccess: false,
      message: 'error400',
    }
  }
}
