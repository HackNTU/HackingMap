<template>
  <div class="banner vertical-container">

    <span class="hackntu_logo">
      <a href="https://github.com/hackntu/hackingmap" target="_blank">
        <img src="../../assets/hackntu-logo.png" alt="hackntu_logo">
      </a>
      <a class="github-button beside-logo" href="https://github.com/hackntu/hackingmap" data-icon="octicon-star" data-show-count="true" aria-label="Star hackntu/hackingmap on GitHub">Star</a>
    </span>

    <span id="buttons-right">
      <el-button @click="visible = true" type="text">{{ loginBtnText }}</el-button>&nbsp;&nbsp;

      <el-dropdown trigger="click">
        <span class="el-dropdown-link">
          活動<i class="el-icon-caret-bottom el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <span v-for="item in dropdownItems">
            <el-dropdown-item v-if="item.disabled" disabled>{{ item.text }} (敬請期待)</el-dropdown-item>
            <a v-else :href="item.link" class="dropdown-a" target="_blank">
              <el-dropdown-item>{{ item.text }}</el-dropdown-item>
            </a>
          </span>
        </el-dropdown-menu>
      </el-dropdown>
    </span>

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
      dialogTitle: '登入 HackingMap',
      dropdownItems: {
        1: {
          text: '加入Discord',
          link: 'https://discord.gg/9Zf8sYR'
        },
        2: {
          text: 'Memtor List',
          link: 'https://airtable.com/shr95DPYrCMQWe1l0'
        },
        3: {
          text: 'Memtor 駐點',
          link: 'https://airtable.com/shrrVlkKjBnYOGXkY',
          disabled: true
        },
        4: {
          text: '闖關遊戲介紹',
          link: '#',
          disabled: true
        },
        5: {
          text: 'HackNTU官網',
          link: 'https://hackntu.tumblr.com/tagged/intro'
        }
        // 6: {
        //   text: '廣播系統（內部）',
        //   link: '#/speak'
        // }
      }
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

#buttons-right
  position: absolute
  right: 1em

.dropdown-a
  color: dimGrey
  text-decoration: none

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
