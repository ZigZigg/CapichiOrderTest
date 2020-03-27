import request from './request'
import { listCouponApi, historyCouponApi } from './config'
import { getMessageErrorFormServer } from '../commons'

export const testCoupon = () => {}

export const getListCoupon = async ({ authen, page, limit = 10, cancel }) => {
  try {
    const result = await request(authen, cancel).get(`${listCouponApi}?page=${page}&limit=${limit}`)
    const { data, status } = result
    if (status === 200)
      return {
        isSuccess: true,
        data: data && Array.isArray(data.data) ? data.data : [],
        maxCount: data && data.paging && data.paging.total,
      }
    return {
      isSuccess: false,
      message: 'a',
    }
  } catch (e) {
    return {
      isSuccess: false,
      message: getMessageErrorFormServer(e),
    }
  }
}

export const getHistoryCoupon = async ({ authen, page, limit = 10, cancel }) => {
  try {
    const result = await request(authen, cancel).get(
      `${historyCouponApi}?page=${page}&limit=${limit}`
    )
    const { data, status } = result
    if (status === 200)
      return {
        isSuccess: true,
        data: data && Array.isArray(data.data) ? data.data : [],
        maxCount: data && data.paging && data.paging.total,
      }
    return {
      isSuccess: false,
      message: 'a',
    }
  } catch (e) {
    return {
      isSuccess: false,
      message: getMessageErrorFormServer(e),
    }
  }
}
