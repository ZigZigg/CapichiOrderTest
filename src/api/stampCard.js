import request from './request'
import {
  listStampcardApi,
  historyStampApi,
  historyEditedStampApi,
  detailHistoryStampApi,
} from './config'
import { getMessageErrorFormServer } from '../commons'

export const testStampcard = () => {}

export const getListStampCard = async ({ authen, page, limit = 10, cancel }) => {
  try {
    const result = await request(authen, cancel).get(
      `${listStampcardApi}?page=${page}&limit=${limit}`
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

export const getHistoryStampCard = async ({
  authen,
  page,
  limit = 10,
  filter,
  cancel,
  keyword = '',
}) => {
  console.log('getHistoryStampCard -> filter', keyword, filter, limit, page)
  try {
    const result = await request(authen, cancel).get(
      `${historyStampApi}?page=${page}&limit=${limit}&type=${filter}&keyword=${keyword}`
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

export const editHistoryStampCard = async ({ authenToken, id, money }) => {
  try {
    const formData = new FormData()
    if (money) formData.append('stamp_added_history[money]', money)
    const response = await request(authenToken).put(`${historyEditedStampApi}/${id}`, formData)
    const { data, status } = response
    if (status === 200)
      return {
        isSuccess: true,
        data: data.data ? data.data : [],
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

export const getDetailHistoryStamp = async ({ authenToken, id }) => {
  try {
    const result = await request(authenToken).get(`${detailHistoryStampApi}/${id}`)
    const { data, status } = result
    if (status === 200)
      return {
        isSuccess: true,
        data: data ? data.data : [],
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

export const getHistoryEditedStampCard = async ({ authenToken, id, page, limit = 10 }) => {
  try {
    const result = await request(authenToken).get(
      `${historyEditedStampApi}/${id}/stamp_added_h_edited_histories?limit=${limit}&page=${page}`
    )
    const { data, status } = result
    if (status === 200)
      return {
        isSuccess: true,
        data: data && Array.isArray(data.data) ? data.data : [],
        maxPage: data && data.paging && data.paging.total_page,
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
