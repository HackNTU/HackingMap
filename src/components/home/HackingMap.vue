<template>
  <div class="hackingmap">

    <el-button-group id="tabs">
      <router-link to="/project/map" tag="el-button">地圖</router-link>
      <router-link to="/project/all" tag="el-button">列表</router-link>
    </el-button-group>

    <router-view id="rv"></router-view>

    <template v-if="currentUser !== null">
      <el-button icon="edit" id="plusBtn" @click="showDialog = true" type="info" :plain="true"></el-button>
      <el-dialog
        :visible.sync="showDialog"
        :modal='false'
        :close-on-click-modal='false'>
        <!-- <editor :uid='currentUser.uid'></editor> -->
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
      msg: 'HackingMap.vue',
      currentUser: null,
      showDialog: false
    }
  },
  created () {
    FirebaseApp.auth().onAuthStateChanged((user) => {
      if (user) {
        this.currentUser = user
      } else {
        this.currentUser = null
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
  background-color: $hackingmap_bg_color
  position: relative
  height: 100%
  width: 100%
  z-index: 10

#plusBtn
  position: absolute
  bottom: 1rem
  right: 1rem

#rv
  // border: 1px solid green
  bottom: 0px

#tabs
  margin: 0.5em
</style>
