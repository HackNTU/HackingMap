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
          <el-step :title="record['大標題']" :ref="'step' + index + 'ref'">
            <span slot="description">
              {{ formatDates(record['開始時間'], record['結束時間']) }}<br>
              <span v-html="formatSubtitle(record['副標題'], record['相關連結'])"></span>
            </span>
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
      num: 10
    }
  },
  created () {
    this.syncAirtable()
    setInterval(this.syncAirtable, 10 * 60 * 1000) // sync every 10 mins
    setInterval(this.updateCurrentEventIndex, 10 * 1000) // check every 10 seconds
  },
  updated () {
    this.scrollTo(this.currentEventIndex || 3)
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
        vm.updateCurrentEventIndex()
        console.log('[Schedule] Sync Airtable every 10 mins')
        if (err) { console.error(err); return }
      })
    },

    /**
     * Check for the current event index.
     */
    updateCurrentEventIndex () {
      // console.log('updateCurrentEventIndex()')
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
            this.currentEventIndex = index
          } else if (iEnded && !jEnded) {
            this.currentEventIndex = index + 1
          }
        }
      }
    },

    /**
     * Scroll to current active Step component.
     */
    scrollTo (stepIndex) {
      let px = this.$refs[`step${stepIndex}ref`][0].$el.offsetTop - 16
      this.$refs['scroll-area'].scrollTop = px
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
     * Truncate and
     */
    formatSubtitle (text, link) {
      if (text) {
        let html = text.slice(0, 15)
        html += '</br>'
        html += text.slice(15, 25)
        html += '...'
        if (link) {
          html += `<a href="${link}" target="_blank">more</a>`
        }
        return html
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

</style>
<style lang="sass">
.el-step__main

</style>
