import validator from 'validator'

export const validateEmail = value => {
  if (!validator.isEmail(value) && value !== '') {
    return '正しいフォーマットでメールアドレスを入力してください'
  }
  return ''
}
export const validateName = value => {
  if (value.length > 150 && value !== '') {
    return 'Customer name is limit at 150 characters'
  }
  return ''
}
export const validatePhone = value => {
  if (value.length < 10 && value.length > 15 && value !== '') {
    return 'Phone number is limit at 10-15 characters'
  }
  return ''
}
export const validateAddress = value => {
  if (value.length > 300 && value !== '') {
    return 'Address is limit at 300 characters'
  }
  return ''
}
export const validateNote = value => {
  if (value.length > 1024 && value !== '') {
    return 'Note is limit at 1024 characters'
  }
  return ''
}
