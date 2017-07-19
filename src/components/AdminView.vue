<template>
  <div id="admin">
    <div id="announcement" type="flex" justify="center" align="middle" :gutter="20">
      <el-row>
        <h2>預覽：</h2>
        <announcement></announcement>
      </el-row><br>
      <el-row>
        <h2>設定：</h2>
        <el-form :model="announcement" :rules="rules">
          <el-form-item :label="`公告標題 (${titleLength}/15字)`" prop="title">
            <el-input v-model.lazy="title['.value']" placeholder="限10字"></el-input>
          </el-form-item>
          <el-form-item :label="`公告內容 (${detailLength}/50字)`" prop="detail">
            <el-input
              type="textarea"
              :rows="5"
              placeholder="請輸入公告內容"
              v-model="detail['.value']">
            </el-input>
          </el-form-item>
          <el-form-item label="密碼">
            <el-input v-model.lazy="pwd" placeholder="密碼"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="updateAnnouncement()">更新</el-button>
      </el-row>
    </div>
  </div>
</template>

<script>
// import _ from 'lodash'

import { FirebaseApp } from '@/service/firebase.js'

import Announcement from '@/components/home/Announcement.vue'

export default {
  name: 'admin',
  mounted () {
    this.$emit('loaded')
  },
  data () {
    return {
      rules: {
        title: [
          { required: true, message: '請輸入公告標題', trigger: 'blur' },
          { min: 3, max: 15, message: '需介於 3 到 15 個字元', trigger: 'blur' }
        ],
        detail: [
          { required: false, message: '需介於 1 到 50 個字元', trigger: 'blur' },
          { min: 1, max: 50, message: '需介於 1 到 50 個字元', trigger: 'change' }
        ]
      },
      pwd: ''
    }
  },
  firebase () {
    return {
      title: {
        source: FirebaseApp.database().ref('/public/announcement/title'),
        asObject: true,
        readyCallback: () => {
          console.log('[admin] Fetched `announcement.title`!')
        }
      },
      detail: {
        source: FirebaseApp.database().ref('/public/announcement/detail'),
        asObject: true,
        readyCallback: () => {
          console.log('[admin] Fetched `announcement.detail`!')
        }
      }
    }
  },
  computed: {
    announcement () {
      return {
        title: this.title['.value'],
        detail: this.detail['.value']
      }
    },
    titleLength () {
      return this.announcement.title ? this.announcement.title.length : 0
    },
    detailLength () {
      return this.announcement.detail ? this.announcement.detail.length : 0
    }
  },
  methods: {
    updateAnnouncement () {
      const updates = {
        'title': this.announcement.title,
        'detail': this.announcement.detail,
        'pwd': this.pwd
      }

      FirebaseApp.database().ref('/public/announcement/')
        .update(updates)
        .then(() => { this.$message({ message: '成功更新', type: 'success' }) })
        .then(() => { this.$message({ message: '成功更新', type: 'success' }) })
        .catch((e) => { this.$message.error('更新失敗') })
    }
  },
  components: {
    Announcement
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="sass" scoped>
#admin
  background-color: rgba(0, 0, 0, 0)
  position: relative
  height: 100%
  width: 100%
  display: flex
  flex-direction: column
  text-align: center
#announcement
  padding: 30px
  // margin-left: auto
  // width: 300px

</style>
