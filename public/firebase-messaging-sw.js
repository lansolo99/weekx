// START initialize_firebase_in_sw
// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/5.5.6/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/5.5.6/firebase-messaging.js')
// Initialize the Firebase app in the service worker by passing in the messagingSenderId.
firebase.initializeApp({
  //   'messagingSenderId': process.env.VUE_APP_MESSAGING_ID // 4. Get Firebase Configuration
  // 'messagingSenderId': '545270095530'
  apiKey: process.env.VUE_APP_API_KEY,
  authDomain: process.env.VUE_APP_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_DATABASE_URL,
  projectId: process.env.VUE_APP_PROJECT_ID,
  storageBucket: process.env.VUE_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_MESSAGING_ID
})

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging()
// END initialize_firebase_in_sw

// If you would like to customize notifications that are received in the
// background (Web app is closed or not in browser focus) then you should
// implement this optional method.
// [START background_handler]
messaging.setBackgroundMessageHandler(function (payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload)
  // Customize notification here
  var notificationTitle = 'Background Message Title'
  var notificationOptions = {
    body: 'Background Message body.',
    icon: '/firebase-logo.png'
  }

  return self.registration.showNotification(notificationTitle,
    notificationOptions)
})
