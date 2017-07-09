<template>
  <div class="banner vertical-container">

    <a href="https://www.facebook.com/hackNTU/" target="_blank"><img src="../assets/hackntu-logo-title.png" alt="hackntu_logo"></a>
    <el-button @click="visible = true" type="text" id="loginBtn">{{ loginBtn }}</el-button>

    <el-dialog
      :visible.sync="visible"
      title="登入 HackingMap"
      :modal='false'
      :close-on-click-modal='false'>
      <signup v-on:closeDialog="visible = false"></signup>
    </el-dialog>

  </div>
</template>

<script>
import Signup from '@/components/Signup.vue'
import { FirebaseApp } from '@/service/firebase.js'

export default {
  name: 'banner',
  data () {
    return {
      visible: false,
      loginBtn: '登入'
    }
  },
  components: {
    signup: Signup
  },
  created () {
    FirebaseApp.auth().onAuthStateChanged((user) => {
      if (user) {
        this.loginBtn = user.email.split('@')[0]
      } else {
        this.loginBtn = '登入'
      }
    })
  }
}
</script>

<style lang="sass" scoped>
.banner

#loginBtn
  position: fixed
  right: 1rem

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
  height: $h*0.8
</style>
