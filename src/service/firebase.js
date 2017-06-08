// import store from '@/vuex'
import Firebase from 'firebase'
import appconfig from '@/appconfig'

// 初始化 Firebase
export const FirebaseApp = Firebase.initializeApp(appconfig.firebase_config)

// 以 VueFire 操作 database
export let VueFireDB = FirebaseApp.database()

// 棄用 vuex
// 監控登入狀態的變化，隨時更新 Vuex 中的數據
// Firebase.auth().onAuthStateChanged(firebaseUser => {
//   if (firebaseUser) {
//     console.log('[firebase.js] 使用者登入了: ', firebaseUser.email, firebaseUser.uid)
//
//     // TODO: 改到Signup.vue處理了！
//     // 將使用者資料更新入 Firebase Databse
//     // Firebase.database().ref('users/' + firebaseUser.uid).set({
//     //   username: firebaseUser.displayName,
//     //   email: firebaseUser.email,
//     //   profile_picture: firebaseUser.photoURL
//     // })
//
//     // TODO: startDatabaseQueries()
//
//     // 將使用者資料寫入 Vuex
//     store.commit('setUser', firebaseUser)
//   } else {
//     console.log('[firebase.js] 使用者登出了', firebaseUser)
//     store.commit('clearUser', firebaseUser)
//   }
// })
