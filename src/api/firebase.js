import Firebase from 'firebase'

const firebaseApp = Firebase.initializeApp({
  apiKey: '<REPLACED>',
  authDomain: 'kazqaz-kz.firebaseapp.com',
  databaseURL: 'https://kazqaz-kz.firebaseio.com',
  projectId: 'kazqaz-kz',
  storageBucket: 'kazqaz-kz.appspot.com',
  messagingSenderId: '<REPLACED>'
})

const db = firebaseApp.database()

export {db}
