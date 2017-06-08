<template lang="html">
  <div class="newprojectform">

    <el-form :model="newProject" :rules="rules" ref="newProject" label-width="100px" class="demo-newProject">
      <el-form-item label="專案名稱" prop="name">
        <el-input v-model="newProject.name"></el-input>
      </el-form-item>

      <el-form-item label="專案簡介" prop="desc">
        <el-input type="textarea" v-model="newProject.desc"></el-input>
      </el-form-item>

      <el-form-item label="所在桌號" prop="table">
        <el-select v-model="newProject.table" placeholder="請選擇目前所在桌號">
          <el-option label="尋找中" value="0"></el-option>
          <el-option v-for="i in tables" :label="i + '桌'" :value="String(i)" :key="i"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="專案狀態" prop="status">
        <el-radio-group v-model="newProject.status">
          <el-radio label="討論中"></el-radio>
          <el-radio label="Hacking"></el-radio>
          <el-radio label="歡迎參觀"></el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm('newProject')">立即創建</el-button>
        <el-button @click="resetForm('newProject')">重置</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import appconfig from '@/appconfig'
import { VueFireDB, firebaseDB } from '@/service/firebase'
const postsRef = VueFireDB.ref('posts')

export default {
  name: 'newprojectform',
  firebase: {
    projects: postsRef
  },
  data () {
    return {
      tables: appconfig.venue.avalibleTables,
      newProject: {
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
  methods: {
    newPostForCurrentUser: firebaseDB.newPostForCurrentUser,
    submitForm () {
      // project 上傳時間
      let postObj = this.newProject
      postObj['timestamp'] = new Date().toString()

      // 同時寫入posts/和user-posts/（根據目前登入的user），詳見firebase.js
      this.newPostForCurrentUser(postObj).then((postResult) => {
        console.log('[submitForm] 資料已送出...')
        let postPromise = postResult[0]
        let newPostKey = postResult[1]
        postPromise.then(() => {
          console.log('[submitForm] 資料已寫入資料庫', newPostKey)
        }).catch((e) => { console.log('[newProjectForm]', e) })
      }).catch((e) => { console.log('[newProjectForm]', e) })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  },
  mounted () {

  }
}
</script>

<style lang="css">
</style>
