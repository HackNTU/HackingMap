<template lang="html">
  <div class="myposts">
    <h3 v-if="user !== null">{{ user.email.split('@')[0] }}的 project</h3>
    <p v-else>錯誤：請先登入！</p>

    <!-- 限制使用者最多能發 1 篇 post -->
    <span v-if="myPosts.length < 1">
      <el-input
      v-model.trim="newPostTitle"
      placeholder="新增一個Project!"
      >
      <el-button @click="newPostForCurrentUser" slot="append">建立</el-button>
      </el-input>
    </span>

    <div>
      <div v-for="p in myPosts">

        <h3>
          {{ p.name }}
          <i class="el-icon-edit" @click="toggleEditor(p['.key'])"></i>
          <i class="el-icon-delete" @click="removePostForCurrentUser(p)"></i>
        </h3>

        <!-- Editor -->
        <span v-if="editingPost == p['.key']">
          <editor :postkey="editingPost"></editor>
        </span>

      </div>
    </div>


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
      msg: 'MyPosts.vue',
      user: FirebaseApp.auth().currentUser,
      newPostTitle: '',
      editingPost: null
    }
  },
  firebase: function () {
    // console.log('[MyPsots] firebase()', this.user)
    return {
      myPosts: {
        source: userPostsRef.child(this.user.uid),
        readyCallback (_) {
          console.log('[MyPsots] 載入使用者的posts', _)
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
          starCount: 0,
          timestamp: new Date().toString(),
          version: 1,
          desc: '超酷project',
          table: 0,
          status: 'Hacking'
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
  },
  beforeCreate () {
    console.log('[MyPosts] beforeCreate ()', this.user, this.userPosts)
  },
  created () {
    console.log('[MyPosts] created ()', this.user, this.userPosts)
  },
  beforeMount () {
    console.log('[MyPosts] beforeMount ()', this.user, this.userPosts)
  },
  mounted () {
    console.log('[MyPosts] mounted ()', this.user, this.userPosts)
  }
}
</script>

<style lang="css">
</style>
