<template lang="html">
  <div class="editor">

    <!-- <code>[dev] you are editing {{ postkey }}</code> -->

    <el-form
      :model="newPost"
      :rules="rules"
      ref="newPost"
      label-width="100px"
      v-loading="isLoading"
      element-loading-text="Loading...">

      <!-- 專案名稱 -->
      <el-form-item label="專案名稱" prop="name">
        <el-input v-model.lazy="newPost.name"></el-input>
      </el-form-item>

      <!-- 專案描述 -->
      <el-form-item label="30字簡介" prop="desc">
        <el-input type="textarea" v-model.lazy="newPost.desc" width="20rem">
        </el-input>
      </el-form-item>

      <!-- 專案頁面/共編(iframe) -->
      <el-form-item label="專案頁面(iframe)" prop="iframe">
        <el-input v-model.lazy="newPost.iframe" class="url">
        </el-input>
      </el-form-item>

      <!-- Git  -->
      <el-form-item label="Git" prop="git">
        <el-input v-model.lazy="newPost.git" placeholder="john666/my-project" class="url">
          <template slot="prepend">https://github.com/</template>
        </el-input>
      </el-form-item>

      <!-- 標籤 -->
      <el-form-item label="標籤" prop="tags">
        <el-tag :key="tag" v-for="tag in newPost.tags" :closable="true" type="gray" :close-transition="false" @close="handleDeleteTag(tag)"
        >{{tag}}</el-tag>
        <el-input class="input-new-tag"
          v-if="inputVisible"
          v-model.lazy="inputNewTag"
          ref="saveTagInput"
          size="mini"
          v-show="!newPost.tags || newPost.tags.length < 3"
          @keyup.enter.native="handleNewTagConfirm"
          @blur="handleNewTagConfirm"></el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showNewTagInput" v-show="!newPost.tags || newPost.tags.length < 3">+ New Tag</el-button>
      </el-form-item>

      <!-- 專案所在位置 -->
      <el-form-item label="位置" prop="table">
        <el-select v-model.lazy="newPost.table" placeholder="請選擇目前所在桌號">
          <el-option label="尋找中" value="0"></el-option>
          <el-option v-for="i in tables" :label="i + '桌'" :value="String(i)" :key="i"></el-option>
        </el-select>
      </el-form-item>

      <!-- 專案狀態 -->
      <el-form-item label="進度狀態" prop="status">
        <el-radio-group v-model.lazy="newPost.status">
          <el-radio label="提案"></el-radio>
          <el-radio label="徵人"></el-radio>
          <el-radio label="趕工"></el-radio>
          <el-radio label="展示"></el-radio>
          <el-radio label="放棄"></el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- 更新按鈕 -->
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
      postData: null,
      newPost: {
        name: null,
        desc: null,
        iframe: null,
        git: '',
        table: null,
        status: null,
        tags: []
      },
      rules: {
        name: [
          { required: true, message: '請輸入專案名稱', trigger: 'blur' },
          { min: 3, max: 10, message: '長度在 3 到 10 個字', trigger: 'blur' }
        ],
        table: [
          { required: true, message: '請選擇專案所在位置', trigger: 'change' }
        ],
        status: [
          { required: true, message: '請選擇專案目前狀態', trigger: 'change' }
        ],
        desc: [
          { required: true, message: '請簡單介紹專案內容(約30字)', trigger: 'blur' }
        ]
      },
      inputNewTag: '',
      inputVisible: false,
      isLoading: true,
      loadingUpdate: false
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
          this.postData = this.userLatestPosts
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

    restoreForm (postData) {
      console.log('[Editor] 載入post舊資料', postData.name)
      this.newPost.name = postData.name
      this.newPost.desc = postData.desc
      this.newPost.iframe = postData.iframe
      this.newPost.git = postData.git || ''
      this.newPost.table = postData.table
      this.newPost.status = postData.status
      this.newPost.tags = postData.tags || []
      this.isLoading = false
    },

    submitPost () {
      this.loadingUpdate = true
      let p = this.newPost
      let promise = this.updatePostForCurrentUser(this.postkey, p.name, p.desc, p.iframe, p.git, p.table, p.status, p.tags)
      promise.then(() => {
        this.loadingUpdate = false
        this.$message({message: '更新成功', type: 'success'})
        console.log('[Editor.vue] post成功更新', this.postkey)
      }).catch((err) => {
        this.loadingUpdate = false
        this.$message.error('更新發生錯誤' + err.message)
      })
    },

    updatePostForCurrentUser (postKey, name, desc, iframe, git, table, status, tags) {
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
        updates[path1 + 'iframe'] = iframe
        updates[path2 + 'iframe'] = iframe
        updates[path1 + 'git'] = git.replace('https://github.com/', '')
        updates[path2 + 'git'] = git.replace('https://github.com/', '')
        updates[path1 + 'table'] = table
        updates[path2 + 'table'] = table
        updates[path1 + 'status'] = status
        updates[path2 + 'status'] = status
        updates[path1 + 'tags'] = tags
        updates[path2 + 'tags'] = tags

        return db.ref().update(updates)
      }
    },

    resetForm (formName) {
      this.$refs[formName].resetFields()
    },

    handleDeleteTag (tag) {
      this.newPost.tags.splice(this.newPost.tags.indexOf(tag), 1)
    },

    showNewTagInput () {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    handleNewTagConfirm () {
      let inputNewTag = this.inputNewTag
      if (inputNewTag) {
        this.newPost.tags.push(inputNewTag.slice(0, 10))
      }
      this.inputVisible = false
      this.inputNewTag = ''
    }
  }
}
</script>

<style lang="sass" scoped>
.editor
  text-align: left
  .url
    width: 100%
  .input-new-tag, .button-new-tag
    width: 5rem
  .el-tag
    margin-left: 4px

</style>
