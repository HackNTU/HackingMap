<template>
  <div id="admin">
    <el-row id="announcement" type="flex" justify="center" align="middle" :gutter="20">
      <el-col :span="8">
        <el-form :model="announcement" :rules="rules">
          <el-form-item :label="`公告標題 (${titleLength}/15字)`" prop="title">
            <el-input v-model.lazy="announcement.title" placeholder="限10字"></el-input>
          </el-form-item> 
          <el-form-item :label="`公告內容 (${detailLength}/50字)`" prop="detail">
            <el-input
              type="textarea"
              :rows="5"
              placeholder="請輸入公告內容"
              v-model="announcement.detail">
            </el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="updateAnnouncement()">更新</el-button>
        <el-button type="success" @click="newAnnouncement()">新增</el-button>
      </el-col>
      <el-col :span="8">
        <announcement></announcement>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import _ from 'lodash'

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
      }
    }
  },
  firebase () {
    return {
      announcements: {
        source: FirebaseApp.database().ref('/public/announcements/'),
        readyCallback: () => {
          console.log('[admin] Fetched `announcements`!')
        }
      }
    }
  },
  computed: {
    titleLength () {
      return this.announcement.title ? this.announcement.title.length : 0
    },
    detailLength () {
      return this.announcement.detail ? this.announcement.detail.length : 0
    },
    announcement () {
      return _.head(
        _.reverse(
          _.sortBy(
            _.filter(this.announcements, 'title')
            , ['timestamp']
          )
        )
      )
    }
  },
  watch: {

  },
  created () {
    FirebaseApp.auth().onAuthStateChanged((user) => {
      if (user) {
        this.user = user
      } else {
        this.user = null
      }
    })
  },
  methods: {
    newAnnouncement () {
      const timestamp = new Date().getTime()
      this.$firebaseRefs.announcements.push({timestamp})
    },
    updateAnnouncement () {
      const announcement = this.announcement
      const key = announcement['.key']
      const updates = {
        [`${key}/title`]: announcement.title,
        [`${key}/detail`]: announcement.detail
      }

      this.$firebaseRefs.announcements.update(updates)
    },
    deleteItem: function (item) {
      this.$firebaseRefs.items.child(item['.key']).remove()
    },
    updateItem: function (item) {
      // create a copy of the item
      item = {...item}
      // remove the .key attribute
      delete item['.key']
      this.$firebaseRefs.items.child(item['.key']).set(item)
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
