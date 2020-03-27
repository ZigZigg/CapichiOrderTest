/* eslint-disable */
importScripts("https://www.gstatic.com/firebasejs/7.12.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/7.12.0/firebase-messaging.js");

const firebaseConfig = {
    apiKey: 'AIzaSyCJff69W5s7c6rcfWFe28gjExFmm58FG30',
    authDomain: 'capitri-fdf26.firebaseapp.com',
    databaseURL: 'https://capitri-fdf26.firebaseio.com',
    projectId: 'capitri-fdf26',
    storageBucket: 'capitri-fdf26.appspot.com',
    messagingSenderId: '1034513726884',
    appId: '1:1034513726884:web:c168a66975872111035531',
  }

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function(payload) {
  const promiseChain = clients
    .matchAll({
      type: "window",
      includeUncontrolled: true
    })
    .then(windowClients => {
      for (let i = 0; i < windowClients.length; i++) {
        const windowClient = windowClients[i];
        windowClient.postMessage(payload);
      }
    })
    .then(() => {
      return registration.showNotification("my notification title");
    });
  return promiseChain;
});
self.addEventListener('notificationclick', function(event) {
  // do what you want
  // ...
});