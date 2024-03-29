import { USER_INFO, USER_LOGIN, USER_LOGOUT } from '@constants/user'
import { API_USER, API_USER_LOGIN } from '@constants/api'
import { createAction } from '@utils/redux'

/**
 * 获取用户信息
 * @param {*} payload 
 */
export const dispatchUser = payload => createAction({
  user: API_USER,
  fetchOptions: {
    showToast: false,
    autoLogin: false,
  },
  type: USER_INFO,
  payload
})

export const dispatchLogin = payload => createAction({
  url: API_USER_LOGIN,
  type: USER_LOGIN,
  payload
})

export const dispatchLogout = () => ({
  type: USER_LOGOUT,
})
