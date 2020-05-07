import Axios from 'axios'
import { API_GOOGLE_KEY } from '../constants/define'
import { autoAddressApi } from './config'
import request from './request'

export const testapiGoogle = () => {}

const url = 'https://maps.googleapis.com/maps/api/place'

// export const getAutoCompleteAddress = async value => {
//   try {
//     const result = await Axios.get(`${url}/autocomplete/json?input=${value}&key=${API_GOOGLE_KEY}`)

//     return {
//       isSuccess: true,
//       data: result.data,
//       keyword: value,
//     }
//   } catch (error) {
//     return { isSuccess: false }
//   }
// }

export const getAutoCompleteAddress = async keyword => {
  try {
    const result = await request('', null).get(`${autoAddressApi}?keyword=${keyword}`)
    console.log({ result })
    return {
      isSuccess: true,
      data: result.data,
    }
  } catch (error) {
    console.log(error.response)
    return { isSuccess: false }
  }
}

export const getLocationInfo = async item => {
  try {
    const response = await Axios.get(
      `${url}/details/json?placeid=${item.place_id}&fields=name,formatted_address,address_component,geometry&key=${API_GOOGLE_KEY}`,
      { timeout: 30000 }
    )
    console.log('testapiGoogle -> response', response)
    return {
      isSuccess: true,
      data: response.data.result || {},
    }
  } catch (e) {
    return {
      isSuccess: false,
      //   message: getMessageErrorFormServer(e),
    }
  }
}
