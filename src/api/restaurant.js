import request from './request'
import { categoryApi } from './config'
import { getMessageErrorFormServer } from '../commons'

export const test = () => {}

export const getListMenuByRestaurant = async ({ page = 1, limit = 10, restaurantId }) => {
  try {
    const result = await request('', null).get(
      `${categoryApi}/${restaurantId}/food_items?page=${page}&limit=${limit}`
    )
    const { data, status } = result
    if (status === 200)
      return {
        isSuccess: true,
        data: data && Array.isArray(data.data) ? data.data : [],
        paging: data && data.paging,
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

export const getRestaurantDetail = async ({ restaurantId }) => {
  try {
    const result = await request('', null).get(`${categoryApi}/${restaurantId}`)
    const { data, status } = result
    if (status === 200)
      return {
        isSuccess: true,
        data: data.data,
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
