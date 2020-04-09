import request from './request'
import { categoryApi } from './config'
import { getMessageErrorFormServer } from '../commons'

export const testCategory = () => {}

export const getListCategory = async ({
  page = 1,
  limit = 10,
  keyword = '',
  provinceId = '',
  seed = null,
}) => {
  try {
    let url = `${categoryApi}?page=${page}&limit=${limit}&keyword=${keyword}&province_id=${provinceId}`
    if (seed) {
      url += `&seed=${seed}`
    }
    const result = await request('', null).get(url)
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
