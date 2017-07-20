<template>
  <div id="askMentor">
    <h1>我要向 Mentor 提問</h1>
    <p>註：Mentor 須在場並登入才會查看</p>
    <p>若能提供幫助，將至專案位置回答。</p>
    <br>
    <el-form
      :model="question"
      ref="question"
      label-position="top"
      label-width="100px"
    >
      <el-row type="flex" justify="center" align="middle" :gutter="20">
        <el-col :span="8" :xs="20">
          <el-form-item label="代表專案 編號" prop="projectId">
            <el-input
              v-model.lazy="question.projectId"
              placeholder="專案編號（提案人編號）"
              :maxlength="3"
            ></el-input>
          </el-form-item>
          <el-form-item label="目標 Mentor 編號" prop="mentorId">
            <el-input
              v-model.lazy="question.mentorId"
              placeholder="請查看 Mentor 列表的編號"
              :maxlength="3"
            ></el-input>
          </el-form-item>
          <el-form-item label="問題 主旨" prop="title">
            <el-input
              v-model.lazy="question.title"
              placeholder="3至10字元"
              :maxlength="10"
            ></el-input>
          </el-form-item>
          <el-form-item label="問題 簡介" prop="description">
            <el-input
              type="textarea"
              v-model.lazy="question.description"
              placeholder="請簡短說明問題內容（100字以內）"
              :autosize="{ minRows: 2, maxRows: 10}"
              :maxlength="100"
            >
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="askQuestion()">提交</el-button>
            <el-button @click="resetQuestion()">清除</el-button>
            <p>登入才可以提交</p>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  
  </div>
</template>

<script>
// import _ from 'lodash'

import { FirebaseApp } from '@/service/firebase.js'

export default {
  name: 'askMentor',
  mounted () {
    this.$emit('loaded')
  },
  data () {
    return {
      question: {
        title: '',
        mentorId: '',
        projectId: '',
        description: ''
      }
    }
  },
  firebase () {
    const that = this
    return {
      questions: {
        source: FirebaseApp.database().ref('/mentor/questions'),
        asObject: true,
        readyCallback: () => {
          console.log('[askMentor] Fetched `mentor.questions`!')
        },
        cancelCallback: function (e) {
          console.log('[askMentor] Fetched `mentor.questions` cancel!', e)
          that.$message.error('讀取資料失敗')
        }
      }
    }
  },
  computed: {
  },
  methods: {
    askQuestion () {
      this.$firebaseRefs.questions.push(this.question)
        .then(() => {
          this.resetQuestion()
          this.$message({message: '新增成功', type: 'success'})
        })
        .catch((e) => { this.$message.error('新增失敗') })
    },
    resetQuestion () {
      this.question = {
        title: '',
        mentorId: '',
        projectId: '',
        description: ''
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="sass" scoped>
#askMentor


</style>
