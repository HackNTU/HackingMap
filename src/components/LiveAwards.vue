<template>
  <div id="liveAwards">
    <h1>企業獎即時分流</h1>
    <p>各企業獎報名數量限制為 20 專案，若超額將由各企業參考 HackingMap 專案介紹決定。</p>
    <p>因各企業獎的名額有限，可參考即時組數調整報名方向，提高獲獎機會</p>

    <template v-for="(award, index) in awards">
      <el-row type="flex" justify="center" align="middle" :gutter="20">
        <el-col :span="12" :xs="20">
          <div id="counter">
            <h3> {{award}}：{{awardsLength[index]}} </h3>
            <el-progress
              :percentage="awardsLength[index] / 20 * 100"
              :show-text="false"
              :stroke-width="8"
              :status="awardsLength[index] >= 20 ? 'exception' : ''"
            ></el-progress>
          </div>
        </el-col>
      </el-row>
    </template>

  </div>
</template>

<script>
import _ from 'lodash'

import { FirebaseApp } from '@/service/firebase.js'

export default {
  name: 'liveAwards',
  mounted () {
    this.$emit('loaded')
  },
  data () {
    return {
      label: '企業獎即時分流',
      awards: ['北市交通局', 'HITCON', '經濟部', '中信Jarvis', '中信資料家', '農委會', '威盛OLAMI', '微軟']
    }
  },
  firebase () {
    const that = this
    return {
      posts: {
        source: FirebaseApp.database().ref('/posts/'),
        readyCallback: () => {
          console.log('[HackingMap] Fetched `posts`!')
          that.$emit('loaded')
        }
      }
    }
  },
  computed: {
    postAwards () {
      return _.compact(_.flatten(this.posts.map(m => m.awards)))
    },
    awardsLength () {
      const awardsLength = _.groupBy(this.postAwards)
      return this.awards.map(m => awardsLength[m] ? awardsLength[m].length : 0)
    }
  },
  methods: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="sass" scoped>
#liveAwards

#counter
  text-align: left


</style>
