<template lang='html'>
  <div class='signup'>

    <h1 class="page-header">研討會註冊</h1>

    <!-- 1. 登入時顯示：歡迎咨訊、登出按鈕 -->
    <template v-if="user !== null">
      <div class="panel panel-default">
        <div class="panel-heading">登入成功</div>
        <div class="panel-body">
          <h5>哈囉, {{user.email}}</h5>
          <el-button @click="logout" type="button" class="btn btn-primary">登出</el-button>
        </div>
      </div>
    </template>

    <!-- 2. 未登入時顯示：Email、密碼登入框 -->
    <template v-if="user === null">
      <div class="panel panel-default">
        <div class="panel-body">
          <div class="form-group">
            <label for="email">Email address:</label>
            <input v-model.trim="email" type="email" class="form-control" id="email">
          </div>
          <div class="form-group">
            <label for="pwd">Password:</label>
            <input v-model="pwd" type="password" class="form-control" id="pwd">
          </div>

          <!-- 登入錯誤提示 -->
          <div class="panel panel-danger" v-show="showWarning">
            <div class="panel-heading">登入發生問題</div>
            <div class="panel-body">
              <p v-html="warningMsg">
                <code>DEFAULT MESSAGE, NEVER SHOWN.</code>
                發生未預期的錯誤，懇請通知 b02611002「AT」ntu.edu.tw 幫助我們馬上修正，或直接以備用表單註冊：https://airtable.com/shr7OtxNhNOQ4a6ms
              </p>
            </div>
          </div>

          <!-- 顯示/隱藏「重設密碼」按鈕 -->
          <p @click="showResetBtn = !showResetBtn" class="text-right"><u>登入遇到問題？</u></p>

          <!-- 「登入」及「註冊」按鈕 -->
          <el-button @click="login" type="button" class="btn btn-primary">登入</el-button>
          <el-button @click="signup" type="button" class="btn btn-default">註冊</el-button>
        </div>
      </div>
    </template>

    <!-- 「重設密碼」 -->
    <div v-show="showResetBtn" class="panel panel-default">
      <div class="panel-body">
        <div class="input-group">
          <input v-model="email" type="text" class="form-control" placeholder="請輸入可正常收信的 email 地址">
          <span class="input-group-btn">
            <el-button @click="sendResetMail" class="btn btn-primary" type="button">取得密碼重設連結</el-button>
          </span>
        </div><!-- /input-group -->
      </div>
    </div>

  </div>
</template>

<script>
import { FirebaseApp } from '@/service/firebase.js'

export default {
  name: 'signup',
  data () {
    return {
      email: 'lawrencechou1024@gmail.com',
      pwd: 'asdfghjkl',
      user: null,
      showWarning: false,
      showResetBtn: false,
      warningMsg: '發生未預期的錯誤，懇請通知 b02611002「AT」ntu.edu.tw 幫助我們馬上修正，或直接以備用表單註冊：https://airtable.com/shr7OtxNhNOQ4a6ms'
    }
  },
  // 元件渲染完成後：
  created () {
    console.log('[Signup.vue] created()')
    // 登入狀態切換時要做的事
    FirebaseApp.auth().onAuthStateChanged((user) => {
      this.showWarning = false
      this.showResetBtn = false
      if (user) {
        console.log('[Signup.vue] 使用者登入了: ', user.email, user.uid)
        this.setUser(user.uid, user.email, user.displayName, user.photoURL)
        this.user = user
      } else {
        console.log('[Signup.vue] 使用者登出了')
        this.user = null
      }
    })
  },
  methods: {
    setUser (uid, email, displayName, photoURL) {
      if (!displayName) {
        // email 註冊者沒有使用者名稱，取email帳號
        displayName = email.split('@')[0]
      }
      // 將使用者資料寫入 Firebase Databse
      FirebaseApp.database().ref('users/' + uid).set({
        username: displayName,
        email: email,
        profile_picture: photoURL
      })
    },
    login () {
      const promise = FirebaseApp.auth().signInWithEmailAndPassword(this.email, this.pwd)
      this.showWarning = false
      promise.catch((err) => {
        // 登入錯誤處理
        console.log('[Signup.vue] 登入出錯了：', err)
        this.showWarning = true
        switch (err.code) {
          case 'auth/wrong-password':this.warningMsg = '抱歉，您提供的email或密碼不正確。，若須重設密碼請點選右下角的「登入遇到問題？」。'; break
          case 'auth/invalid-email':this.warningMsg = '抱歉，您提供的email無效，請填入有效的email。'; break
          case 'auth/user-disabled':this.warningMsg = '抱歉，您的帳號已被暫時停用，詳情請聯絡 lawrencechou1024「AT」gmail.com '; break
          case 'auth/user-not-found':this.warningMsg = '抱歉，資料庫中並沒有使用者紀錄，請先註冊。'; break
          default:
            this.warningMsg = err + '登入發生未預期的錯誤，懇請協助通知 b02611002「AT」ntu.edu.tw 幫助我們馬上修正，或直接以備用表單註冊：https://airtable.com/shr7OtxNhNOQ4a6ms'
            console.log(err + '登入發生未預期的錯誤，懇請協助通知 b02611002「AT」ntu.edu.tw 幫助我們馬上修正，或直接以備用表單註冊：https://airtable.com/shr7OtxNhNOQ4a6ms')
        }
      })
    },
    signup () {
      const promise = FirebaseApp.auth().createUserWithEmailAndPassword(this.email, this.pwd)
      this.showWarning = false
      promise.catch((err) => {
        // 登入錯誤處理
        console.log('[Signup.vue] 註冊出錯了：', err)
        this.showWarning = true
        switch (err.code) {
          case 'auth/email-already-in-use': this.warningMsg = '此Email帳號已註冊，若須重設密碼請點選右下角的「登入遇到問題？」。'; break
          case 'auth/invalid-email': this.warningMsg = '抱歉，您提供的email無效，請填入有效的email。'; break
          case 'auth/operation-not-allowed': this.warningMsg = 'Email註冊服務已終止，詳情請聯絡 lawrencechou1024「AT」gmail.com '; break
          case 'auth/weak-password': this.warningMsg = '密碼強度過低，請嘗試更複雜的密碼。'; break
          default:
            this.warningMsg = err + '註冊發生未預期的錯誤，懇請協助通知 b02611002「AT」ntu.edu.tw 幫助我們馬上修正，或直接以備用表單註冊：https://airtable.com/shr7OtxNhNOQ4a6ms'
            console.log(err + '註冊發生未預期的錯誤，懇請協助通知 b02611002「AT」ntu.edu.tw 幫助我們馬上修正，或直接以備用表單註冊：https://airtable.com/shr7OtxNhNOQ4a6ms')
        }
      })
    },
    logout () {
      FirebaseApp.auth().signOut()
      this.email = ''
      this.pwd = ''
    },
    sendResetMail () {
      const promise = FirebaseApp.auth().sendPasswordResetEmail(this.email)
      promise.then(() => {
        alert('密碼重置連結已寄到' + this.email + '，請前往確認。')
        console.log('[Signup.vue] 密碼重置連結已寄到', this.email)
      }).catch((err) => {
        console.log('>> sendPasswordResetEmail()出錯了：', err)
        switch (err.code) {
          case 'auth/invalid-email': alert('無效的email'); break
          case 'auth/user-not-found': alert('此email尚未註冊'); break
          default: alert(err)
        }
      })
    }
  },
  components: {
  }
}
</script>

<style lang='css'>
</style>
