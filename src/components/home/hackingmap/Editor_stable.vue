<template lang="html">
  <div class="editor">

    <!-- DEBUG START -->
    <p>uid: {{ uid }}</p>
    <!-- <p v-for="p in userPostsRef">p: {{ p }}</p> -->
    <!-- DEBUG END -->

    <el-form :model="newPost" :rules="rules" ref="newPost" label-width="100px" class="demo-newPost">
      <el-form-item label="專案名稱" prop="name">
        <el-input v-model="newPost.name"></el-input>
      </el-form-item>

      <el-form-item label="專案簡介" prop="desc">
        <el-input type="textarea" v-model="newPost.desc"></el-input>
      </el-form-item>

      <el-form-item label="所在桌號" prop="table">
        <el-select v-model="newPost.table" placeholder="請選擇目前所在桌號">
          <el-option label="尋找中" value="0"></el-option>
          <el-option v-for="i in tables" :label="i + '桌'" :value="String(i)" :key="i"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="專案狀態" prop="status">
        <el-radio-group v-model="newPost.status">
          <el-radio label="討論中"></el-radio>
          <el-radio label="Hacking"></el-radio>
          <el-radio label="歡迎參觀"></el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitPost('newPost')">立即創建</el-button>
        <el-button @click="resetForm('newPost')">重置</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import appconfig from '@/appconfig'
import { FirebaseApp } from '@/service/firebase.js'

const db = FirebaseApp.database()
const userPostsRef = db.ref('user-posts/')

export default {
  name: 'editor',
  data () {
    return {
      // uid: null,
      // uid: 'vn6xLtUQi3fjOfVBF0H6bNfcml13',
      tables: appconfig.venue.avalibleTables,
      latest: 'N/A',
      newPost: {
        name: '',
        desc: '',
        table: '',
        status: ''
      },
      rules: {
        name: [
          { required: true, message: '請輸入活動名稱', trigger: 'blur' },
          { min: 3, max: 20, message: '長度在 3 到 20 個字符', trigger: 'blur' }
        ],
        table: [
          { required: true, message: '請選擇活動區域', trigger: 'change' }
        ],
        status: [
          { required: true, message: '請選擇活動資源', trigger: 'change' }
        ],
        desc: [
          { required: true, message: '請填寫活動形式', trigger: 'blur' }
        ]
      }
    }
  },
  props: {
    uid: {
      type: String,
      required: true
    }
  },
  firebase: function () {
    return {
      userLatestPosts: {
        source: userPostsRef.child(this.uid).limitToLast(1),
        readyCallback () {
          this.latest = this.userLatestPosts[0]
          console.log('this.latest', this.latest)
          console.log('this.userLatestPosts[0]', this.userLatestPosts[0])
          this.restoreForm(this.userLatestPosts[0])
        },
        cancelCallback () {
          alert('cancelCallback ()')
        }
      }
    }
  },
  created () {
  },
  methods: {
    restoreForm (latestVer) {
      console.log('Restore form from fetched data:', latestVer)
      this.newPost.name = latestVer.name
      this.newPost.desc = latestVer.desc
      this.newPost.table = latestVer.table
      this.newPost.status = latestVer.status
    },

    submitPost () {
      let postObj = this.newPost

      // 同時寫入posts/和user-posts/（參考自官方的`blog`示例：https://github.com/firebase/quickstart-js/tree/master/database）
      this.newPostForCurrentUser(postObj).then((postResult) => {
        console.log('[Editor.vue] update() was success !')
      })
    },

    newPostForCurrentUser (postData) {
      let u = FirebaseApp.auth().currentUser
      if (!u || !u.uid || !u.email) {
        throw new Error('Invalid currentUser for newPostForCurrentUser():', u)
      } else {
        postData['uid'] = u.uid
        postData['author'] = u.email
        // postData['authorPic'] = u.picture //有時會是undefined，會被Firebase報錯，暫時放棄authorPic
        postData['starCount'] = 0
        postData['timestamp'] = new Date().toString()
        postData['version'] = 1 // TODO 自動增加

        // Get a key for a new Post.
        const newPostKey = userPostsRef.push().key
        // Write the new post's data simultaneously in the posts list and the user's post list.
        let updates = {}
        updates['/posts/' + newPostKey] = postData
        updates['/user-posts/' + u.uid + '/' + newPostKey] = postData

        console.log('updates:', updates)

        // return FirebaseApp.database().ref().update(updates)
        return db.ref().update(updates)
      }
    },

    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang="sass">
.editor
  z-index: 9999
</style>
