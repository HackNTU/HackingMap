<template>
  <div class="banner vertical-container">

    <span class="hackntu_logo">
      <a href="https://github.com/hackntu/hackingmap" target="_blank">
        <img src="../../assets/hackntu-logo.png" alt="hackntu_logo">
      </a>
      <a class="github-button beside-logo" href="https://github.com/hackntu/hackingmap" data-icon="octicon-star" data-show-count="true" aria-label="Star hackntu/hackingmap on GitHub">Star</a>
    </span>
    <el-button @click="visible = true" type="text" id="loginBtn">{{ loginBtnText }}</el-button>

    <el-dialog
      :visible.sync="visible"
      :title="dialogTitle"
      :modal-append-to-body="true"
      :close-on-click-modal='false'>
      <oauthlogin></oauthlogin>
    </el-dialog>

  </div>
</template>

<script>
import OAuthLogin from '@/components/banner/OAuthLogin'
import { FirebaseApp } from '@/service/firebase.js'

export default {
  name: 'banner',
  data () {
    return {
      visible: false,
      loginBtnText: '登入',
      dialogTitle: '登入 HackingMap'
    }
  },
  components: {
    oauthlogin: OAuthLogin
  },
  created () {
    FirebaseApp.auth().onAuthStateChanged((user) => {
      if (user) {
        this.loginBtnText = user.providerData[0].displayName || user.email.split('@')[0]
        this.dialogTitle = '歡迎登入, ' + user.providerData[0].displayName || user.email.split('@')[0]
      } else {
        this.loginBtnText = '登入'
        this.dialogTitle = '登入 HackingMap'
      }
    })
  }
}
</script>

<style lang="sass" scoped>
.banner

#loginBtn
  position: absolute
  right: 2em

$h: 48px

.vertical-container
  height: $h
  display: -webkit-flex
  display:         flex
  -webkit-align-items: center
          align-items: center
  -webkit-justify-content: center
          justify-content: center

img
  height: $h * 0.6

// Align logo to left for mobile
.hackntu_logo
  position: fixed
  left: 1rem

// Centering logo for iPad/Laptop
@media screen and (min-width: 768px)
  .hackntu_logo
    position: relative
    margin-left: auto
    margin-right: auto
</style>
