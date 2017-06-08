<template>
  <div class="profile">

    <code>WARNING: {{ warningState }}</code>

    <div v-if="isLoginState"><!-- 已登入 -->
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span style="line-height: 36px">歡迎登入</span>
          <el-button @click="signOut" style="float: right" type="primary">登出</el-button>
        </div>
        <h5>User: {{ userState.displayName }}</h5>
        <h5>Email: {{ userState.email }}</h5>
        <h5>UID: {{ userState.uid }}</h5>
        <img :src="userState.photoURL" alt="userState.displayName"><br>
      </el-card>

      <!-- A form for current user to register a new project -->
      <el-card class="box-card">
        <newprojectform></newprojectform>
      </el-card>
    </div><!-- 已登入 -->

    <div v-else><!-- 未登入 -->
      <h5>未登入</h5>
      <el-input v-model="login.email"></el-input>
      <el-input v-model="login.pwd"></el-input>
      <el-button @click="signinWithGoogle" type="primary">以Google登入</el-button>
      <el-button @click="signinWithEmail(login.email, login.pwd)" type="primary">以Email登入</el-button>
      <el-button @click="signupWithEmail" type="primary">以Email註冊</el-button>
    </div><!-- 未登入 -->

  </div>

</template>
<script>
import Firebase from 'firebase'
import NewProjectForm from '@/components/user/NewProjectForm'
import { firebaseAuth, VueFireDB } from '@/service/firebase'
import { mapState } from 'vuex'

let postsRef = VueFireDB.ref('posts/')

export default {
  name: 'profile',
  data () {
    return {
      login: {
        email: 'example@mail.com',
        pwd: 'foobar'
      }
    }
  },
  computed: {
    // Vuex 的資料
    ...mapState({
      userState: state => state.user,
      isLoginState: state => state.isLogin,
      warningState: state => state.warning
    }),
    // Deprecated
    currentUser () {
      return Firebase.auth().currentUser
    }
  },
  methods: {
    signOut: firebaseAuth.signOut,
    signinWithGoogle: firebaseAuth.signinWithGoogle,
    signinWithEmail: firebaseAuth.signinWithEmail,
    signupWithEmail: firebaseAuth.signupWithEmail
  },
  firebase: {
    projects: postsRef
  },
  components: {
    newprojectform: NewProjectForm
  }
}
</script>
<style lang="sass" scoped>
@import "../../style_config.sass"

.profile
  border: 1px dashed red

// Card
.text
  font-size: 14px

.item
  padding: 18px 0

.clearfix:before,
.clearfix:after
    display: table
    content: ""
.clearfix:after
    clear: both

.box-card
  width: 480px
</style>
