<template>
  <div class="schedule" v-loading="isFetching" ref="scroll-area">

    <div class="steps">
      <el-steps
        v-if="records.length !== 0"
        :space="100"
        direction="vertical"
        :active="currentEventIndex"
        process-status="finish"
        finish-status="wait">
        <template v-for="(record, index) in records">
          <el-step :ref="'step' + index + 'ref'">
            <a :class="(record['連結'] ? 'step_title_link' : '')" slot="title" :href="record['連結']" target="_blank">
              {{ record['大標題'] }}
            </a>
            <div slot="icon" class="schedule-fa-icon">
              <icon :name="record['fa-icon'] || default_icon"></icon>
            </div>
            <div slot="description">
              {{ formatDates(record['開始時間'], record['結束時間']) }}<br>
              <span v-html="clipSubtitle(record['副標題'])"></span>
            </div>
          </el-step>
        </template>
      </el-steps>
    </div>

  </div>
</template>

<script>
import appconfig from '../../appconfig'
import Airtable from 'Airtable'
const db = new Airtable({ apiKey: 'keyC0ndMttA3rW78D' }).base('appTGjW5XhtMQa2t0')
export default {
  name: 'schedule',
  data () {
    return {
      msg: '行程表',
      currentEventIndex: null,
      records: [],
      active: null,
      isFetching: true,
      default_icon: 'circle-o',
      num: 10
    }
  },
  created () {
    this.syncAirtable()
    setInterval(this.syncAirtable, 10 * 60 * 1000) // sync every 10 mins
    setInterval(this.checkCurrentEventIndex, 10 * 1000) // check every 10 seconds
  },
  updated () {
    let component = this.$refs[`step${this.currentEventIndex}ref`][0]
    if (component) {
      let px = this.$refs[`step${this.currentEventIndex}ref`][0].$el.offsetTop - 16
      this.$refs['scroll-area'].scrollTop = px
      // console.log('[Schedule] scrollTo(): ', px) // NOTE: dev
    }
  },
  methods: {

    /**
     * Sync Airtable data to `records`
     */
    syncAirtable () {
      let vm = this
      vm.isFetching = true
      vm.records = []
      db('Schedule').select({
        view: 'Grid view',
        filterByFormula: '{顯示} = TRUE()',
        sort: [{field: '開始時間', direction: 'asc'}]
      }).eachPage(function page (records, fetchNextPage) {
        records.forEach(function (record) {
          record.fields.id = record.id
          vm.records.push(record.fields)
        })
        fetchNextPage()
      }, function done (err) {
        vm.isFetching = false
        vm.checkCurrentEventIndex()
        console.log('[Schedule] Sync Airtable every 10 mins')
        if (err) { console.error(err); return }
      })
    },

    /**
     * Check for the current event index.
     */
    checkCurrentEventIndex () {
      // console.log('checkCurrentEventIndex()')
      for (let index = 0; index < this.records.length; index++) {
        let i = this.records[index]           // the (i)th event
        let j = this.records[index + 1] || {} // the (i+1)th event (or nothing)
        let iStarted = new Date(i['開始時間']) < new Date()
        let iEnded = (i['結束時間'] ? new Date(i['結束時間']) < new Date() : false)
        let jStarted = new Date(j['開始時間']) < new Date()
        let jEnded = (j['結束時間'] ? new Date(j['結束時間']) < new Date() : false)
        // console.log(index, iStarted, iEnded, jStarted, jEnded)
        if (iStarted && !jStarted) {
          if (!iEnded && !jEnded) {
            this.updateCurrentEventIndex(index)
          } else if (iEnded && !jEnded) {
            this.updateCurrentEventIndex(index + 1)
          }
        }
      }
    },

    /**
     * Update current event index and sent notification
     */
    updateCurrentEventIndex (index) {
      if (this.currentEventIndex !== index) {
        this.$message({
          message: `接下來，${this.records[index]['大標題']}`,
          type: 'success'
        })
        this.currentEventIndex = index
      }
    },

    /**
     * Parse `HHMM - HHMM` format for events during hackathon, and
     * `MMDDHHMM - HHMM` for events before/after the hackathon.
     */
    formatDates (date1, date2) {
      let d1 = new Date(date1)
      let MM1 = d1.getMonth() + 1
      let DD1 = d1.getDate()
      let HH1 = ('0' + d1.getHours()).slice(-2)
      let MIN1 = ('0' + d1.getMinutes()).slice(-2)
      let d2 = new Date(date2)
      let HH2 = ('0' + d2.getHours()).slice(-2)
      let MIN2 = ('0' + d2.getMinutes()).slice(-2)
      let isDuringHackathon = appconfig.event_info.start_date < d1 && d1 < appconfig.event_info.end_date
      if (isDuringHackathon) {
        return (date2 ? `${HH1}:${MIN1} ~ ${HH2}:${MIN2}` : `${HH1}:${MIN1}`)
      } else {
        return (date2 ? `${MM1}/${DD1} ${HH1}:${MIN1} ~ ${HH2}:${MIN2}` : `${MM1}/${DD1} ${HH1}:${MIN1}`)
      }
    },

    /**
     * Ellipsis and concatenation of link for text
     */
    clipSubtitle (text) {
      if (text) {
        let row1 = text.slice(0, 13)
        let row2 = text.slice(13, 25)
        return row1 + (row2 ? `</br>${row2}...` : '')
      }
    }
  }
}
</script>

<style lang="sass" scoped>
@import "../../style_config.sass"
.schedule
  // background-color: $chat_bg_color
  text-align: left
  padding: 2em
  overflow-y: scroll
  .step_title_link
    color: inherit
    text-decoration: none
    font-weight: bold
</style>
<style lang="sass">
.el-step__main
.schedule-fa-icon
  vertical-align: top
</style>
