import validator from 'validator'

export const validateEmail = value => {
  if (!validator.isEmail(value) && value !== '') {
    return '正しいフォーマットでメールアドレスを入力してください'
  }
  return ''
}
export const validateName = value => {
  if (value.length > 150 && value !== '') {
    return '顧客名は最大150文字で入力してください'
  }
  return ''
}
export const validatePhone = value => {
  if ((value.length < 10 || value.length > 15) && value !== '') {
    return '電話番号は10〜15桁の数字で入力してください'
  }
  return ''
}
export const validateAddress = value => {
  if (value.length > 300 && value !== '') {
    return '住所は最大300文字で入力してください'
  }
  return ''
}
export const validateNote = value => {
  if (value.length > 1024 && value !== '') {
    return '追記事項は最大1024文字で入力してください'
  }
  return ''
}
