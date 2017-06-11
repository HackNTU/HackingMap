<template lang='html'>
  <div class='signup'>

    <!-- 登入時顯示 -->
    <template v-if="user !== null">
      <p>哈囉, {{ user.displayName }}</p>
      <el-button @click="logout">登出</el-button>
    </template>

    <!-- 未登入時顯示 -->
    <template v-if="user === null">
      <el-form label-width="80px" :model="signInForm" ref="signInForm" label-position="right">

        <el-form-item label="Email" prop="email">
          <el-input v-model.trim="signInForm.email" :disabled="showResetBtn"></el-input>
        </el-form-item>

        <el-form-item label="密碼" prop="password">
          <el-input type="password" v-model="signInForm.password" :disabled="showResetBtn"></el-input>
          <!-- 顯示/隱藏「重設密碼」按鈕 -->
          <span @click="showResetBtn = !showResetBtn" style="float:right"><u>忘記密碼？</u></span>
          <el-input v-if="showResetBtn" :value.once="signInForm.email" placeholder="接收驗證信的email信箱">
            <el-button slot="append" @click="sendResetMail(signInForm.email)" :loading="loadingSendResetMail">取得驗證信</el-button>
          </el-input>
        </el-form-item>

        <el-form-item v-show="!showResetBtn">
          <el-button @click="submitForm('signInForm')" :loading="loadingSignIn">登入</el-button>
          <el-button @click="signup" :loading="loadingSignup">註冊</el-button>
        </el-form-item>

      </el-form>
    </template>

  </div>
</template>

<script>
import { FirebaseApp } from '@/service/firebase.js'

export default {
  name: 'signup',
  data () {
    return {
      user: null,
      signInForm: {
        email: 'lawrencechou1024@gmail.com',
        password: 'asdfghjkl'
      },
      showResetBtn: false,
      loadingSendResetMail: false,
      loadingSignup: false,
      loadingSignIn: false
    }
  },
  created () {
    // 登入狀態切換時要做的事
    FirebaseApp.auth().onAuthStateChanged((user) => {
      this.showResetBtn = false
      if (user) {
        if (!user.displayName) {
          // email 註冊者沒有使用者名稱，取email帳號
          user.displayName = user.email.split('@')[0]
        }
        this.setUserToDatabase(user.uid, user.email, user.displayName, user.photoURL)
        this.user = user
        console.log('[Signup.vue] 使用者登入了: ', user.email)
        // 彈出提示訊息並關掉登入小視窗
        this.$message({message: '歡迎登入 ' + user.displayName, type: 'success'})
        this.$emit('closeDialog')
      } else {
        this.user = null
        console.log('[Signup.vue] 使用者未登入')
      }
    })
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.signIn(this.signInForm.email, this.signInForm.password)
          console.log('submitted')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    setUserToDatabase (uid, email, displayName, photoURL) {
      // 將使用者資料寫入 Firebase Databse
      FirebaseApp.database().ref('users/' + uid).set({
        uid: uid,
        displayName: displayName,
        email: email,
        photoURL: photoURL
      })
    },
    signIn (email, password) {
      this.loadingSignIn = true
      const promise = FirebaseApp.auth().signInWithEmailAndPassword(email, password)
      promise.then(() => {
        this.loadingSignIn = false
      }).catch((err) => {
        // 登入的錯誤處理
        this.loadingSignIn = false
        console.log('[Signup.vue] 登入出錯了：', err)
        this.$message.error('[Signup.vue] 註冊出錯了：', err.message)
        switch (err.code) {
          case 'auth/wrong-password': this.$message({message: '抱歉，您提供的email或密碼不正確。若須重設密碼請點選右下角的「忘記密碼」。', type: 'warning'}); break
          case 'auth/invalid-email': this.$message({message: '抱歉，您提供的email無效，請填入有效的email。', type: 'warning'}); break
          case 'auth/user-disabled': this.$message({message: '抱歉，您的帳號已被暫時停用，詳情請聯絡 lawrencechou1024「AT」gmail.com ', type: 'warning'}); break
          case 'auth/user-not-found': this.$message({message: '抱歉，資料庫中並沒有使用者紀錄，請先註冊。', type: 'warning'}); break
          default:
            this.$message.error({message: '登入發生未預期的錯誤' + err})
        }
      })
    },
    signup () {
      this.loadingSignup = true
      const promise = FirebaseApp.auth().createUserWithEmailAndPassword(this.signInForm.email, this.signInForm.password)
      promise.then(() => {
        this.loadingSignup = false
      }).catch((err) => {
        // 註冊的錯誤處理
        this.loadingSignup = false
        console.error('[Signup.vue] 註冊出錯了：', err)
        this.$message.error('註冊出錯了： ', err.message)
        switch (err.code) {
          case 'auth/email-already-in-use': this.$message({message: '此Email帳號已註冊，若須重設密碼請點選右下角的「忘記密碼」。', type: 'warning'}); break
          case 'auth/invalid-email': this.$message({message: '抱歉，您提供的email無效，請填入有效的email。', type: 'warning'}); break
          case 'auth/operation-not-allowed': this.$message({message: 'Email註冊服務已終止，詳情請聯絡 lawrencechou1024「AT」gmail.com ', type: 'warning'}); break
          case 'auth/weak-password': this.$message({message: '密碼強度過低，請嘗試更複雜的密碼。', type: 'warning'}); break
          default:
            this.$message.error({message: '登入發生未預期的錯誤' + err.message})
        }
      })
    },
    logout () {
      FirebaseApp.auth().signOut()
      this.signInForm.email = ''
      this.signInForm.password = ''
    },
    sendResetMail (email) {
      this.loadingSendResetMail = true
      const promise = FirebaseApp.auth().sendPasswordResetEmail(email)
      promise.then(() => {
        this.loadingSendResetMail = false
        this.$message('密碼重置連結已寄往' + this.signInForm.email + '，請前往確認。')
      }).catch((err) => {
        this.loadingSendResetMail = false
        console.error('[Signup.vue] 重設密碼出錯了：', err)
        switch (err.code) {
          case 'auth/invalid-email': this.$message.error('無效的email'); break
          case 'auth/user-not-found': this.$message.error('此email尚未註冊'); break
          default: this.$message.error('重設密碼請求失敗： ' + err.message)
        }
      })
    }
  }
}
</script>

<style lang='css'>
</style>
