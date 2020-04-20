import I18n from 'i18n-js'
// import * as RNLocalize from 'react-native-localize'
import vi from './locales/vi'
import ja from './locales/ja'
// const locales2 = RNLocalize.getLocales()

// const locales = [
//   {countryCode: 'US', languageTag: 'en-US', languageCode: 'en', isRTL: false},
//   {countryCode: 'VN', languageTag: 'vi-VN', languageCode: 'vi', isRTL: false},
// ]

export const setI18nConfig = localeSelect => {
  if (localeSelect) {
    localStorage.setItem('LOCALE', localeSelect)
  } else {
    localStorage.setItem('LOCALE', 'ja')
  }
  let locale = {}
  // let locale = RNLocalize.findBestAvailableLanguage(['en-US', 'vi-VN'])
  if (localeSelect === 'vi') {
    console.log('change language')
    locale = {
      isRTL: false,
      languageTag: 'vi-VN',
    }
  } else {
    locale = {
      isRTL: false,
      languageTag: 'ja-JP',
    }
  }

  I18n.defaultLocale = 'ja-JP'
  I18n.locale = locale.languageTag

  I18n.fallbacks = true
  I18n.translations = {
    vi,
    ja,
  }

  // if (typeof callback === 'function') callback()
}

const defaultLocale = localStorage.getItem('LOCALE')
setI18nConfig(defaultLocale)

export default I18n
