<template>
  <div class="hackingmap">

    <el-button-group id="tabs">
      <router-link to="/map" tag="el-button">地圖</router-link>
      <router-link to="/projects" tag="el-button">列表</router-link>
    </el-button-group>

    <router-view v-bind:filteredPosts="posts"></router-view>

    <template v-if="user !== null">
      <el-button icon="edit" id="plusBtn" @click="showDialog = true" type="info" :plain="true"></el-button>
      <el-dialog
        :title="myPostTitle"
        :visible.sync="showDialog"
        :modal='true'
        :close-on-click-modal='false'>
        <!-- <editor :uid='user.uid'></editor> -->
        <myposts></myposts>
      </el-dialog>
    </template>
    <template v-else>
      <el-button icon="edit" id="plusBtn" :disabled="true"></el-button>
    </template>

  </div>
</template>

<script>
import { FirebaseApp } from '@/service/firebase.js'
// import Editor from '@/components/home/hackingmap/Editor.vue'
import MyPosts from '@/components/home/hackingmap/MyPosts.vue'
export default {
  name: 'hackingmap',
  data () {
    return {
      user: null,
      showDialog: false
    }
  },
  firebase: {
    posts: {
      source: FirebaseApp.database().ref('/posts/'),
      asObject: true,
      readyCallback: () => {
        console.log('[HackingMap] Fetched `posts`!')
      }
    }
  },
  computed: {
    myPostTitle () {
      return (this.user.providerData[0].displayName || this.user.email.split('@')[0]) + '的專案'
    }
  },
  created () {
    FirebaseApp.auth().onAuthStateChanged((user) => {
      if (user) {
        this.user = user
      } else {
        this.user = null
      }
    })
  },
  components: {
    // editor: Editor
    myposts: MyPosts
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="sass" scoped>
@import "../../style_config.sass"

.hackingmap
  background-color: rgba(0, 0, 0, 0)
  position: relative
  height: 100%
  width: 100%

#plusBtn
  position: absolute
  bottom: 1rem
  right: 1rem

#tabs
  margin: 0.5em
  position: relative
  z-index: 100
</style>
