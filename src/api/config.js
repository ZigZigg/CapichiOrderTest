/*
 * api domain constants
 */
/** Server Product */
// export const baseURL = 'https://capichiapp.com/api/v328/'
// export const baseImageUrl = 'https://capichiapp.com/'
// /** Server Dev */
export const baseURL = 'http://18.140.42.129/'

export const TIMEOUT = 30000

/** ************** API USER  ************** */
export const loginApi = 'restaurants/sign_in'
export const signOutApi = 'restaurants/sign_out'

/** ============== API COUPON ============= */
export const listCouponApi = 'restaurants/coupons'
export const historyCouponApi = 'restaurants/coupons_history'

/** ============== API STAMPCARD ============= */
export const listStampcardApi = 'restaurants/stamps'
export const historyStampApi = 'restaurants/stamps_history'
export const detailHistoryStampApi = 'restaurants/stamp_added_histories'
export const historyEditedStampApi = 'restaurants/stamp_added_histories/'

/** ============== API PROFILE ============= */
export const profileApi = 'restaurants/profile'
export const getListUser = 'restaurants/search_users'
