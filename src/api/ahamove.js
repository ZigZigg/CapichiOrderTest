import Axios from 'axios'
import { categoryApi } from './config'
// import { getMessageErrorFormServer } from '../commons'
import { I18n } from '../config'
import request from './request'
import { getMessageErrorFormServer } from '../commons'

// eslint-disable-next-line import/prefer-default-export
/** Product config */
export const urlAhamove = 'https://api.ahamove.com/v1'
export const nameAhamove = 'Capichi'
export const apiKeyAhamove = '7ea358e922b9b0ce278fcbd922ddd9b3'

/** Dev config */
// export const urlAhamove = 'https://apistg.ahamove.com/v1'
// export const nameAhamove = 'Ahamove+Test+User'
// export const apiKeyAhamove = '567f7630b9aae8ad80f7a31ed31b6abc'

export const getTokenAhamove = async ({ phone = 'hanoi', address }) => {
  try {
    const url = `${urlAhamove}/partner/register_account?address=${address}&mobile=${phone}&name=${nameAhamove}&api_key=${apiKeyAhamove}`
    const result = await Axios.get(url)
    const { token } = result.data
    if (!token)
      return {
        isSuccess: false,
        message: I18n.t('errorAhamovePhone'),
      }
    return {
      isSuccess: true,
      token,
    }
  } catch (e) {
    return {
      isSuccess: false,
      message: I18n.t('errorAhamovePhone'),
    }
  }
}

export const getDistanceAhamove = async ({
  // token,
  service_id = 'HAN-BIKE',
  path,
  price = 0,
  restaurantId,
}) => {
  try {
    const formData = new FormData()
    // formData.append('ahamove_token', token)
    formData.append('service_id', service_id)
    formData.append('path', path)
    formData.append('foods_money', price)

    const result = await request('', null).post(
      `${categoryApi}/${restaurantId}/orders/estimate_fee`,
      formData
    )
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
    console.log({ e })
    return {
      isSuccess: false,
      message: getMessageErrorFormServer(e),
    }
  }
}

// export const createOfferAhamove = async ({
//   token,
//   service_id = 'HAN-BIKE',
//   path,
//   request = '[]',
//   order_time = '0',
//   idle_until = '',
// }) => {
//   try {
//     const url = `https://apistg.ahamove.com/v1/order/create?token=${token}&service_id=${service_id}&order_time=${order_time}&path=${path}&request=${request}&idle_until=${idle_until}`
//     const result = await Axios.get(url)
//     const { data } = result
//     if (!data)
//       return {
//         isSuccess: false,
//         message: 'error400',
//       }
//     return {
//       isSuccess: true,
//       data,
//     }
//   } catch (e) {
//     // console.log(e)
//     return {
//       isSuccess: false,
//       message: 'error400',
//     }
//   }
// }
