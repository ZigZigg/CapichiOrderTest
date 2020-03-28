import validator from 'validator'

export const validatePassword = value => {
  if (value.length < 8 || value.length > 25) {
    return 'Mật khẩu ít nhất phải từ 8 ký tự và không vượt quá 25 ký tự.'
  }
  return ''
}

export const validateEmail = value => {
  if (!validator.isEmail(value) && value !== '') {
    return 'Định dạng Email không hợp lệ.'
  }
  return ''
}
