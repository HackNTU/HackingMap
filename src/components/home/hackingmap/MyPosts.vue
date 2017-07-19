<template lang="html">
  <div class="myposts">
    <template v-if="user !== null">

      <div v-if="isFetching" v-loading="true"></div>
      <div v-else-if="myPosts.length === 0"><!-- 限制使用者最多能發 1 篇 post -->
        <el-input v-model.trim="newPostTitle" placeholder="新增一個Project!" @keyup.enter="newPostForCurrentUser"></el-input>
        <el-button @click="newPostForCurrentUser">建立</el-button>
      </div>
      <div v-else>
        <editor :postData="myPosts[0]" @cancel="$emit('close')"></editor>
      </div>

    </template>
    <p v-else>錯誤：請先登入！</p>
  </div>
</template>

<script>
import Editor from '@/components/home/hackingmap/Editor.vue'
import { FirebaseApp, VueFireDB } from '@/service/firebase.js'
let dbRef = VueFireDB.ref('/')
let userPostsRef = VueFireDB.ref('user-posts')

export default {
  name: 'myposts',
  data () {
    return {
      user: FirebaseApp.auth().currentUser,
      newPostTitle: '',
      editingPost: null,
      isFetching: true
    }
  },
  firebase: function () {
    // console.log('[MyPsots] firebase()', this.user)
    return {
      myPosts: {
        source: userPostsRef.child(this.user.uid),
        readyCallback (_) {
          this.isFetching = false
        }
      }
    }
  },
  methods: {

    toggleEditor (postKey) {
      if (postKey === this.editingPost) {
        this.editingPost = null
      } else {
        this.editingPost = postKey
      }
    },

    newPostForCurrentUser () {
      let u = FirebaseApp.auth().currentUser
      if (this.newPostTitle && u) {
        let postData = {
          name: this.newPostTitle,
          uid: u.uid,
          author: u.email,
          host: '',
          contact: '',
          starCount: 0,
          heartCount: 0,
          timestamp: new Date(),
          version: 1,
          desc: '超酷project',
          iframe: 'http://bit.ly/hackingmap_get_started',
          git: '',
          table: 0,
          status: '趕工',
          award: '無',
          teammates: [''],
          tags: ['標籤1', '標籤2']
        }
        let newPostKey = userPostsRef.push().key
        let updates = {}
        updates['/posts/' + newPostKey] = postData
        updates['/user-posts/' + u.uid + '/' + newPostKey] = postData
        dbRef.update(updates).then(() => {
          console.log('[MyPosts] 完成新增操作:', updates)
          this.newPostTitle = ''
          this.toggleEditor(newPostKey)
        }).catch((err) => {
          console.error('[MyPosts] 新增操作失敗！', err.message)
        })
      }
    },

    removePostForCurrentUser (post) {
      let u = FirebaseApp.auth().currentUser
      if (u) {
        let updates = {}
        updates['/posts/' + post['.key']] = null
        updates['/user-posts/' + u.uid + '/' + post['.key']] = null
        dbRef.update(updates).then(() => {
          console.log('[MyPosts.vue] 完成移除操作:', updates)
        })
      } else {
        console.error('請先登入！', u)
      }
    }
  },
  components: {
    editor: Editor
  }
}
</script>

<style lang="sass">
.myposts
  .el-input
    width: 10rem
</style>
