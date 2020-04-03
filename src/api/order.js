import _ from 'lodash'
import request from './request'
import { categoryApi } from './config'
import { getMessageErrorFormServer } from '../commons'

export const testOrder = () => {}

export const confirmOrder = async ({ name, email, address, phone, note, restaurantId, items }) => {
  try {
    const formData = new FormData()
    _.map(items, (value, key) => {
      formData.append(`order[order_items_attributes][${key}][food_item_id]`, value.id)
      formData.append(`order[order_items_attributes][${key}][quantity]`, value.count)
    })
    formData.append('order[name]', name)
    formData.append('order[phone]', phone)
    formData.append('order[address]', address)
    formData.append('order[email]', email)
    formData.append('order[note]', note)
    const result = await request('', null).post(`${categoryApi}/${restaurantId}/orders`, formData)
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
