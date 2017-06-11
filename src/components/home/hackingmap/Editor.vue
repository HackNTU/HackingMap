<template lang="html">
  <div class="editor">

    <code>you are editing {{ postkey }}</code>

    <el-form
      :model="newPost"
      :rules="rules"
      ref="newPost"
      label-width="100px"
      class="demo-newPost"
      v-loading="isLoading"
      element-loading-text="Loading~~~~~">
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
        <el-button type="primary" @click="submitPost()">更新</el-button>
        <el-button @click="resetForm('newPost')">清空</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import appconfig from '@/appconfig'
import { FirebaseApp } from '@/service/firebase.js'

const db = FirebaseApp.database()
const postsRef = db.ref('posts/')

export default {
  name: 'editor',
  data () {
    return {
      tables: Object.keys(appconfig.map.table_coor),
      latest: 'N/A',
      isLoading: true,
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
          { required: true, message: '請選擇專案所在位置', trigger: 'change' }
        ],
        status: [
          { required: true, message: '請選擇專案目前狀態', trigger: 'change' }
        ],
        desc: [
          { required: true, message: '請簡單介紹專案內容', trigger: 'blur' }
        ]
      }
    }
  },
  props: {
    postkey: {
      type: String,
      required: true
    }
  },
  computed: {
    postKeyReady () {
      if (this.postKey) {
        return this.postKey
      } else {
        return null
      }
    }
  },
  firebase: function () {
    return {
      userLatestPosts: {
        source: postsRef.child(this.postkey),
        asObject: true,
        readyCallback () {
          this.latest = this.userLatestPosts
          this.restoreForm(this.userLatestPosts)
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
      console.log('[Editor] 載入post舊資料', latestVer.name)
      this.newPost.name = latestVer.name
      this.newPost.desc = latestVer.desc
      this.newPost.table = latestVer.table
      this.newPost.status = latestVer.status
      this.isLoading = false
    },

    submitPost () {
      let p = this.newPost
      this.updatePostForCurrentUser(this.postkey, p.name, p.desc, p.table, p.status).then(() => {
        console.log('[Editor.vue] post成功更新', this.postkey)
      })
    },

    updatePostForCurrentUser (postKey, name, desc, table, status) {
      let u = FirebaseApp.auth().currentUser
      if (!u.uid || !postKey) {
        throw new Error('Invalid currentUser or postkey', u, postKey)
      } else {
        let updates = {}
        const path1 = '/posts/' + postKey + '/'
        const path2 = '/user-posts/' + u.uid + '/' + postKey + '/'
        updates[path1 + 'name'] = name
        updates[path2 + 'name'] = name
        updates[path1 + 'desc'] = desc
        updates[path2 + 'desc'] = desc
        updates[path1 + 'table'] = table
        updates[path2 + 'table'] = table
        updates[path1 + 'status'] = status
        updates[path2 + 'status'] = status

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
