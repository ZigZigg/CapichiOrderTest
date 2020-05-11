import { autoAddressApi, geometryApi } from './config'
import request from './request'

export const testapiGoogle = () => {}

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
    return {
      isSuccess: true,
      data: result.data,
    }
  } catch (error) {
    return { isSuccess: false }
  }
}

export const getLocationInfo = async payload => {
  const { apiKey, placeId } = payload
  try {
    let urlLocation = `${geometryApi}?place_id=${placeId}`
    if (apiKey) {
      urlLocation += `&api_key=${apiKey}`
    }
    const result = await request('', null).get(urlLocation)

    return {
      isSuccess: true,
      data: result.data,
    }
  } catch (error) {
    return { isSuccess: false }
  }
}

// export const getLocationInfo = async item => {
//   try {
//     const response = await Axios.get(
//       `${url}/details/json?placeid=${item.place_id}&fields=name,formatted_address,address_component,geometry&key=${API_GOOGLE_KEY}`,
//       { timeout: 30000 }
//     )
//     console.log('testapiGoogle -> response', response)
//     return {
//       isSuccess: true,
//       data: response.data.result || {},
//     }
//   } catch (e) {
//     return {
//       isSuccess: false,
//       //   message: getMessageErrorFormServer(e),
//     }
//   }
// }
