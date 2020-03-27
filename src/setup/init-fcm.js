/* eslint-disable import/prefer-default-export */
import * as firebase from 'firebase/app'
import 'firebase/messaging'

const firebaseConfig = {
  apiKey: 'AIzaSyCJff69W5s7c6rcfWFe28gjExFmm58FG30',
  authDomain: 'capitri-fdf26.firebaseapp.com',
  databaseURL: 'https://capitri-fdf26.firebaseio.com',
  projectId: 'capitri-fdf26',
  storageBucket: 'capitri-fdf26.appspot.com',
  messagingSenderId: '1034513726884',
  appId: '1:1034513726884:web:c168a66975872111035531',
}

const initializedFirebaseApp = firebase.initializeApp(firebaseConfig)

// eslint-disable-next-line import/no-mutable-exports
let messaging = null

if (firebase.messaging.isSupported()) {
  messaging = initializedFirebaseApp.messaging()
  messaging.usePublicVapidKey(
    // Project Settings => Cloud Messaging => Web Push certificates
    'BOvpT3xUlr3ujVKfVyHthJ7dMYmiKFr0KFdZ4ZIWjpF2k5Fsw90hC7pRI-GdNPlO_Y-soJYBG1Zcs27j9Pid20g'
  )
}
export { messaging }
