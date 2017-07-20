<template>
  <div class='oauthlogin'>

    <!-- 1. 登入時顯示：歡迎咨訊、登出按鈕 -->
    <template v-if="user !== null">
      <div v-if="user.photoURL"><img :src="user.photoURL" alt="avatar" style="max-width: 50px"></div>
      <el-button @click="signOut">登出</el-button>
    </template>

    <!-- 2. 未登入時顯示：Email、密碼登入框 -->
    <template v-else>
      <div class="panel panel-default">
        <div class="panel-body">

          <div class="text-center">
            <!-- a. 第三方登入 -->
            <template v-if="enableGoogleLoginFlag">
              <el-button @click="signinWithGoogle" :size="isPhone ? 'small' : 'large'" class="btn-primary-google">
                <span class="icon-wrap"><img class="icon" src="../../assets/google-logo-bg.png"></span>
                <span class="label">Google登入</span></el-button>
            </template>

            <template v-if="enableFacebookLoginFlag">
              <el-button @click="signinWithFB" :size="isPhone ? 'small' : 'large'" class="btn-primary-facebook">
                <span class="icon-wrap"><img class="icon" src="../../assets/facebook-logo.jpg"></span>
                <span class="label">Facebook登入</span></el-button><br>
            </template>

            <!-- b. Email註冊/登入 -->
            <template v-if="enableEmailPassLoginFlag">
              <br><br><hr style="margin:0"><span style="position:relative;top:-0.6rem;background-color:white;"> 或 </span>

              <h3>以Email登入</h3>
              <button @click="showEmailPassField = true" v-show="!showEmailPassField" class="btn btn-default"> 註冊/登入 </button>
            </template>
          </div>

          <template v-if="enableEmailPassLoginFlag">
            <div v-show="showEmailPassField">
              <div class="form-group">
                <label for="email">登入信箱</label>
                <input v-model.trim="email" type="email" class="form-control" id="email">
              </div>
              <div class="form-group">
                <label for="pwd">密碼</label>
                <input v-model="pwd" type="password" class="form-control" id="pwd">
              </div>

              <!-- 顯示/隱藏「重設密碼」按鈕 -->
              <!-- <p @click="toggleShowResetBtn" class="text-right"><u>登入遇到問題？</u></p> -->
              <p @click="showResetBtn = !showResetBtn" class="text-right"><u>登入遇到問題？</u></p>

              <!-- 「登入」及「註冊」按鈕 -->
              <button @click="signInWithEmailAndPassword" type="button" class="btn btn-primary">登入</button>
              <button @click="signup" type="button" class="btn btn-default">註冊</button>
            </div>

            <!-- 「重設密碼」 -->
            <div v-show="showResetBtn" class="panel panel-default">
              <div class="panel-body">
                <div class="input-group">
                  <input v-model="email" type="text" class="form-control" placeholder="請輸入可正常收信的 email 地址">
                  <span class="input-group-btn">
                    <button @click="sendResetMail" class="btn btn-primary" type="button">取得密碼重設連結</button>
                  </span>
                </div><!-- /input-group -->
              </div>
            </div>
          </template>

        </div><!-- panel-body -->
      </div><!-- panel panel-default -->
    </template><!-- 2. 未登入時顯示：Email、密碼登入框 -->

  </div>
</template>

<script>
import firebase from 'firebase'
import { FirebaseApp } from '@/service/firebase.js'
const max480 = window.matchMedia('(max-device-width: 480px)').matches

export default {
  name: 'oauthlogin',
  data () {
    return {
      user: null,
      userRef: null,
      enableEmailPassLoginFlag: false, // REVIEW: toggle to enable email/pass login
      enableGoogleLoginFlag: false, // REVIEW: toggle to enable email/pass login
      enableFacebookLoginFlag: true, // REVIEW: toggle to enable email/pass login
      email: null,
      pwd: null,
      showEmailPassField: false,
      showResetBtn: false,
      isPhone: max480
    }
  },
  created () {
    FirebaseApp.auth().onAuthStateChanged((U) => {
      this.showResetBtn = false
      if (U) {
        this.user = {
          uid: U.uid,
          email: U.email || U.providerData[0].email,
          displayName: U.providerData[0].displayName || U.email.split('@')[0],
          photoURL: U.providerData[0].photoURL || 'http://i.imgur.com/1Us6LVp.png'
        }
        if (!this.user.uid || !this.user.email || !this.user.displayName || !this.user.photoURL) {
          console.warn('[OAuthLogin] 使用者資料異常?', this.user)
        }
        this.setUserToDatabase(this.user.uid, this.user.email, this.user.displayName, this.user.photoURL)
        console.log('[OAuthLogin] 使用者登入了: ', this.user.displayName)
      } else {
        this.user = null
        console.log('[OAuthLogin] 使用者未登入')
      }
    })
  },
  methods: {
    setUserToDatabase (uid, email, displayName, photoURL) {
      // 將使用者資料寫入 Firebase Databse
      FirebaseApp.database().ref('users/' + uid).set({
        uid: uid,
        displayName: displayName,
        email: email,
        photoURL: photoURL
      }).catch(err => console.error('[OAuthLogin] 使用者資料寫入錯誤:', err.message))
    },

    // Google 登入
    signinWithGoogle () {
      const provider = new firebase.auth.GoogleAuthProvider()
      provider.addScope('profile')
      provider.addScope('email')
      const promise = FirebaseApp.auth().signInWithPopup(provider)
      promise.then((result) => {
        console.log('Google 登入成功: ', result)
        this.$message({message: 'Google 登入成功', type: 'success'})
      }).catch((err) => {
        console.log('Google 登入錯誤: ', err.code, err.message)
        this.$message({message: 'Google 登入錯誤', type: 'warning'})
      })
    },

    // Facebook 登入
    signinWithFB () {
      const provider = new firebase.auth.FacebookAuthProvider()
      const promise = FirebaseApp.auth().signInWithPopup(provider)
      promise.then((result) => {
        console.log('Facebook 登入成功: ', result)
        this.$message({message: 'Facebook 登入成功', type: 'success'})
      }).catch((err) => {
        console.log('Facebook 登入錯誤: ', err.code, err.message)
        this.$message({message: 'Facebook 登入錯誤', type: 'warning'})
      })
    },
    // 登出
    signOut () {
      FirebaseApp.auth().signOut()
      this.email = ''
      this.pwd = ''
    },

    // XXX deprecated
    signInWithEmailAndPassword () {
      const promise = FirebaseApp.auth().signInWithEmailAndPassword(this.email, this.pwd)
      promise.catch((err) => {
        // 登入錯誤處理
        console.log('[SignInOrSignUp.vue] 登入出錯了：', err)
        switch (err.code) {
          case 'auth/wrong-password':this.$message({message: '抱歉，您提供的email或密碼不正確。，若須重設密碼請點選右下角的「登入遇到問題？」。', type: 'warning'}); break
          case 'auth/invalid-email':this.$message({message: '抱歉，您提供的email無效，請填入有效的email。', type: 'warning'}); break
          case 'auth/user-disabled':this.$message({message: '抱歉，您的帳號已被暫時停用，詳情請聯絡 lawrencechou1024「AT」gmail.com ', type: 'warning'}); break
          case 'auth/user-not-found':this.$message({message: '抱歉，資料庫中並沒有使用者紀錄，請先註冊。', type: 'warning'}); break
          default:
            this.$message.error({message: '登入發生未預期的錯誤:' + err.message})
        }
      })
    },

    // XXX deprecated
    signup () {
      const promise = FirebaseApp.auth().createUserWithEmailAndPassword(this.email, this.pwd)
      promise.catch((err) => {
        // 登入錯誤處理
        console.log('[SignInOrSignUp.vue] 註冊出錯了：', err)
        switch (err.code) {
          case 'auth/email-already-in-use': this.$message({message: '此Email帳號已註冊，若須重設密碼請點選右下角的「登入遇到問題？」。', type: 'warning'}); break
          case 'auth/invalid-email': this.$message({message: '抱歉，您提供的email無效，請填入有效的email。', type: 'warning'}); break
          case 'auth/operation-not-allowed': this.$message({message: 'Email註冊服務已終止，詳情請聯絡 lawrencechou1024「AT」gmail.com ', type: 'warning'}); break
          case 'auth/weak-password': this.$message({message: '密碼強度過低，請嘗試更複雜的密碼。', type: 'warning'}); break
          default:
            this.$message.error({message: '登入發生未預期的錯誤:' + err.message})
        }
      })
    },

    // XXX deprecated
    sendResetMail () {
      const promise = FirebaseApp.auth().sendPasswordResetEmail(this.email)
      promise.then(() => {
        alert('密碼重置連結已寄到' + this.email + '，請前往確認。')
        console.log('[SignInOrSignUp.vue] 密碼重置連結已寄到', this.email)
      }).catch((err) => {
        console.log('>> sendPasswordResetEmail()出錯了：', err)
        switch (err.code) {
          case 'auth/invalid-email': alert('無效的email'); break
          case 'auth/user-not-found': alert('此email尚未註冊'); break
          default: alert(err)
        }
      })
    }
  }
}
</script>

<style lang='css'>

.icon-wrap {
    height: 1rem;
    position: relative;
    /*border: 1px solid Green;*/
}

.icon {
    /*border: 1px solid Red;*/
    position: absolute;
    height: 100%;
}

.label {
  padding-left: 1.5rem;
}

.btn-primary-facebook:hover {
    color: #fff;
    background-color: #223567;
    border-color: #204d74;
}
.btn-primary-facebook {
    color: #fff;
    background-color: #324e97;
    border-color: #324e97;
}

.btn-primary-google:hover {
    color: #fff;
    background-color: #3a72d0;
    border-color: #3a72d0;
}

.btn-primary-google {
    color: #fff;
    background-color: #4285F4;
    border-color: #4285F4;
}

</style>
