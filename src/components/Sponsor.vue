<template>
  <div class="sponsor flex-container">

    <h2 class="title">Sponsors</h2>
    <span
    v-for="sponsor in records"
    :key="sponsor.id"
    v-if="sponsor['商標png'] !== undefined">
      <a :href="sponsor['URL']" target="_blank">
        <img
        class="logo"
        :src="sponsor['商標png'][0].thumbnails.small.url"
        :alt="sponsor['贊助商']">
      </a>
    </span>

  </div>
</template>

<script>
import Airtable from 'Airtable'
const db = new Airtable({ apiKey: 'keyC0ndMttA3rW78D' }).base('appTGjW5XhtMQa2t0')

export default {
  name: 'sponsor',
  data () {
    return {
      isFetching: true,
      records: []
    }
  },
  created () {
    this.syncAirtable()
  },
  methods: {

    /**
     * Sync Airtable data to `records`
     */
    syncAirtable () {
      let vm = this
      vm.isFetching = true
      vm.records = []
      db('Sponser').select({
        view: 'Grid view',
        filterByFormula: '{顯示} = TRUE()',
        sort: [{field: '順序', direction: 'asc'}]
      }).eachPage(function page (records, fetchNextPage) {
        records.forEach(function (record) {
          record.fields.id = record.id
          vm.records.push(record.fields)
        })
        fetchNextPage()
      }, function done (err) {
        vm.isFetching = false
        if (err) { console.error('[Sponser] Airtable fetch fail:', err); return }
      })
    }

  }
}
</script>

<style lang="sass" scoped>
@import "../style_config.sass"

.sponsor
.flex-container
  display: flex
  justify-content: flex-start
  align-items: center

  .title
    margin: 0 15px 0 15px

  .logo
    margin: 0 8px 0 8px
    height: $footer_height * 0.6

  .img-circle
    border-radius: 50%

</style>
