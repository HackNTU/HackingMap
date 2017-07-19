<template>
  <section class="announcement">

    <!-- display announcement if any exist -->
    <div v-if="announcements[0] || !enableHistory">

      <transition name="el-zoom-in-center" mode="out-in">

        <!-- show the latest announcement -->
        <el-card class="box-card" v-if="!showHistory" key="single" :body-style="{ padding: '0px' }">
          <div style="padding: 14px;">
            <!-- <p>{{ announcements[displayIndex].title}}</p> -->
            <p id="title">{{ title['.value'] }}</p>
            <hr>
            <!-- <span>{{ announcements[displayIndex].detail}}</span> -->
            <span id="detail">{{ detail['.value'] }}</span>
            <div class="bottom">
              <!-- <time class="time">{{ HHMM(announcements[displayIndex].timestamp) }}更新</time> -->
              <div class="spacer"></div>
              <el-button v-if="enableHistory" type="text" class="show-history" @click="showHistory = true">所有公告</el-button>
            </div>
          </div>
        </el-card>

        <!-- show all announcements -->
        <el-card v-else="showHistory" key="list">
          <el-button
            type="text"
            class="button"
            v-for="(announcement, index) in announcements"
            :key="index"
            @click="clickIndex=index;showHistory=false;">
            {{ announcement.title }}
          </el-button>
        </el-card>

      </transition>
    </div>

  </section>
</template>

<script>
import { FirebaseApp } from '@/service/firebase.js'

export default {
  name: 'announcement',
  data () {
    return {
      enableHistory: false,
      announcements: [],
      showHistory: false,
      clickIndex: null
    }
  },
  firebase: {
    title: {
      source: FirebaseApp.database().ref('/public/announcement/title'),
      asObject: true
    },
    detail: {
      source: FirebaseApp.database().ref('/public/announcement/detail'),
      asObject: true
    }
  },
  computed: {
    displayIndex () {
      return (this.clickIndex === null ? (this.announcements.length - 1) : this.clickIndex)
    }
  },
  methods: {
    HHMM (date) {
      let d = new Date(date)
      let HH = d.getHours()
      let MM = d.getMinutes()
      return `${HH}:${MM}`
    }
  }
}
</script>

<style lang="sass" scoped>
  .announcement
    margin: 1em 1em 0 1em
    background-color: rgba(0, 0, 0, 0)

    li
      list-style-type: none
      border: 1px solid pink
      margin: 0

    .bottom
      margin-top: 13px
      line-height: 12px
      display: flex

      .time
        flex: 1
        font-size: 13px
        color: #999

      .spacer
        flex: 1

      .show-history
        flex: 1
        padding: 0
        float: right

    #title
      font-size: 18px
    #detail
      font-size: 16px

    hr
      width: 97%
      align: center
      border: 0
      height: 1px
      background-color: #d4d4d4
      color: #d4d4d4
</style>
