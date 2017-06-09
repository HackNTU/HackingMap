<template>
  <div class="mapview">

    <!-- 縮放（TODO: 改成scroll放大） -->
    <div class="block">
      <el-slider v-model="scale" :max="3" :step="0.1" :format-tooltip="formatTooltip"></el-slider>
    </div>

    <!-- 圖例 -->
    <div class="legand">
      <svg height="1.5em" width="5em"><circle cx="1em" cy="0.7em" :r="7" class="statue_proposal"/><text x="2em" y="1em">提案</text></svg>
      <svg height="1.5em" width="5em"><circle cx="1em" cy="0.7em" :r="7" class="statue_recruit"/><text x="2em" y="1em">徵人</text></svg>
      <svg height="1.5em" width="5em"><circle cx="1em" cy="0.7em" :r="7" class="statue_hacking"/><text x="2em" y="1em">趕工</text></svg>
      <svg height="1.5em" width="5em"><circle cx="1em" cy="0.7em" :r="7" class="statue_demo"/><text x="2em" y="1em">展示</text></svg>
      <svg height="1.5em" width="5em"><circle cx="1em" cy="0.7em" :r="7" class="statue_giveup"/><text x="2em" y="1em">放棄</text></svg>
    </div>

    <!-- SVG容器 -->
    <svg id="canvas" xmlns="http://www.w3.org/2000/svg" version="1.1" :width="map.map_width * scale" :height="map.map_height * scale">
      <!-- 地圖 -->
      <image xlink:href="../../../assets/flora_expo_park.png" x="0" y="0" :width="map.map_width * scale" :height="map.map_height * scale" />

      <template v-for="table in map.table_coor">

        <!-- 有專案的桌子 -->
        <template v-if="posts[table.index]">
          <el-tooltip placement="top" effect="light">
            <!-- 專案說明方塊 -->
            <div slot="content">
              <postsummary
                :title="posts[table.index].name"
                :subtitle="posts[table.index].author.split('@')[0]"
                :description="posts[table.index].desc + ' ('+posts[table.index].table+'桌)'"
                :postKey="posts[table.index]['.key']"
                :authorId="posts[table.index].uid"
                :starCount="posts[table.index].starCount"
                :stars="posts[table.index].stars"
                style="font-family: 'Helvetica Neue',Helvetica,'PingFang SC','Hiragino Sans GB','Microsoft YaHei','微软雅黑',Arial,sans-serif"
                ></postsummary>
                
            </div>
            <circle :cx="table.x * scale" :cy="table.y * scale" r="7" class="occupied-table statue_proposal"/>
          </el-tooltip>
        </template>

        <!-- 沒專案的桌子 -->
        <template v-else>
          <circle :cx="table.x * scale" :cy="table.y * scale" r="7" class="status_avalible"/>
        </template>
      </template>

    </svg>

  </div>
</template>

<script>
import appconfig from '../../../appconfig'
import { VueFireDB } from '@/service/firebase'
import PostSummary from '@/components/home/hackingmap/postsummary'

export default {
  name: 'mapview',
  data () {
    return {
      msg: 'MapView.vue',
      scale: 1.0,
      map: appconfig.venue.map
    }
  },
  firebase: {
    postsData: VueFireDB.ref('posts')
  },
  computed: {
    posts () {
      let posts = {}
      this.postsData.forEach((data) => {
        if (data['table']) {
          posts[data['table']] = data
        }
      })
      return posts
    }
  },
  methods: {
    formatTooltip: (val) => String(parseInt(val * 100)) + ' %'
  },
  components: {
    postsummary: PostSummary
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="sass" scoped>
@import "../../../style_config.sass"

.mapview
  // background-color: $map_bg_color
  height: 100%
  position: relative
  overflow-y: scroll
  overflow-x: scroll
  right: -17px

#canvas
  background-color: $map_bg_color

.table
  fill: none
  stroke: grey

.map
  fill: none
  stroke: black

circle
  stroke: DarkSlateGrey
  stroke-width: 2

.statue_proposal
  fill: $statue_proposal

.statue_recruit
  fill: $statue_recruit

.statue_hacking
  fill: $statue_hacking

.statue_demo
  fill: $statue_demo

.statue_giveup
  fill: $statue_giveup

.status_avalible
  fill: white

.legand
  border: 1px LightGrey solid
  background-color: rgba(256, 256, 256, 0.8)
  width: 5em
  position: absolute
  top: 30px
  right: 30px
  padding: 0.5em

</style>
