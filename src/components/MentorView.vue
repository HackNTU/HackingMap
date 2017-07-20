<template>
  <div id="mentor">
    <h1>Mentor 介面</h1>
    
    <h3>Mentor ID</h3>
    <el-row type="flex" justify="center" align="middle" :gutter="20">
      <el-col :span="8" :xs="20">
        <el-input
          v-model="mentorId"
          placeholder="請輸入 Mentor ID"
          :maxlength="3"
        ></el-input>
      </el-col>
    </el-row>

    <br>

    <h3>問題集</h3>
    <p>若能提供幫助，可至專案位置回答</p>
    <hr>
    <el-row type="flex" justify="center" align="middle" :gutter="20">
      <el-col v-if="mentorQuestions" :span="8" :xs="20">
        <el-collapse accordion>
          <template v-for="question in mentorQuestions">
            <el-collapse-item 
              :title="'專案 #' + question.projectId + '　　問: ' + question.title"
              :name="question['.key']"
            >
              <div>{{question.description}}</div>
            </el-collapse-item>
          </template>
        </el-collapse>
      </el-col>
      <h4 v-else>尚未收到問題</h4>
    </el-row>
  </div>
</template>

<script>
import _ from 'lodash'

import { FirebaseApp } from '@/service/firebase.js'

export default {
  name: 'mentor',
  mounted () {
    this.$emit('loaded')
  },
  data () {
    return {
      mentorId: ''
    }
  },
  firebase () {
    return {
      questions: {
        source: FirebaseApp.database().ref('/mentor/questions'),
        readyCallback: () => {
          console.log('[mentor] Fetched `mentor.questions`!')
        }
      }
    }
  },
  computed: {
    mentorsQuestions () {
      return _.groupBy(this.questions, (gb) => gb.mentorId)
    },
    mentorQuestions () {
      return this.mentorsQuestions[this.mentorId]
    }
  },
  methods: {
    markRead (qkey) {
      const updates = {}
      updates[qkey + '/read'] = true

      this.$firebaseRefs.questions.update(updates)
        .then(() => { this.$message({ message: '標注讀取', type: 'success' }) })
        .catch((e) => { this.$message.error('更新失敗') })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="sass" scoped>
#mentor
  text-align: left

h1, h2, h3, h4, h5, p
  text-align: center


hr
  width: 97%
  align: center
  border: 0
  height: 1px
  background-color: #d4d4d4
  color: #d4d4d4

</style>
