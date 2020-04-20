import validator from 'validator'

export const validateEmail = value => {
  if (!validator.isEmail(value) && value !== '') {
    return 'validateEmail'
  }
  return ''
}
export const validateName = value => {
  if (value.length > 150 && value !== '') {
    return 'validateName'
  }
  return ''
}
export const validatePhone = value => {
  if ((value.length < 10 || value.length > 15) && value !== '') {
    return 'validatePhone'
  }
  return ''
}
export const validateAddress = value => {
  if (value.length > 300 && value !== '') {
    return 'validateAddress'
  }
  return ''
}
export const validateNote = value => {
  if (value.length > 1024 && value !== '') {
    return 'validateNote'
  }
  return ''
}
