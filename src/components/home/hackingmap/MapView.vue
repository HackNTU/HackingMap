<template>
  <section class="mapview">

    <!-- SVG -->
    <svg ref="svg" id="svg-map" class=".svg-pan-zoom_viewport" :viewBox="'0 0 '+map.map_width+' '+map.map_height">
      <rect x="0" y="0" fill="none" stroke="#EB7B2D" stroke-width="2" :width="map.map_width" :height="map.map_height" />

      <!-- 地圖 -->
      <image xlink:href="../../../assets/flora_expo_park.png"
      :x="0" :y="0" :width="map.map_width" :height="map.map_height"/>

      <!-- 桌子 -->
      <template v-for="table in map.table_coor">
        <template v-if="posts[table.no]">
          <el-tooltip placement="top" effect="light">
            <div slot="content">
              <postsummary
              :title="posts[table.no].name"
              :subtitle="posts[table.no].author.split('@')[0]"
              :description="posts[table.no].desc + ' ('+posts[table.no].table+'桌)'"
              :postKey="posts[table.no]['.key']"
              :authorId="posts[table.no].uid"
              :starCount="posts[table.no].starCount"
              :stars="posts[table.no].stars"
              :tags="posts[table.no].tags"
              style="font-family: 'Helvetica Neue',Helvetica,'PingFang SC','Hiragino Sans GB','Microsoft YaHei','微软雅黑',Arial,sans-serif"
              ></postsummary>
            </div>
            <circle :cx="table.x" :cy="table.y" r="7" :class="getStatusColor(posts[table.no].status)"/>
          </el-tooltip>
        </template>
        <template v-else>
          <!-- 沒專案的桌子就不顯示圓點 -->
          <!-- <circle :cx="table.x * scale" :cy="table.y * scale" r="7" class="status_avalible"/> -->
        </template>
      </template>

    </svg>

    <!-- 圖例 -->
    <div class="legand">
      <svg v-for="symble in ['提案', '徵人', '趕工', '展示', '放棄']" height="1.5em" width="5em">
        <circle :class="getStatusColor(symble)" cx="1em" cy="0.7em" :r="7"/>
        <text x="2em" y="1em">{{ symble }}</text>
      </svg>
    </div>

  </section>
</template>

<script>
import appconfig from '../../../appconfig'
import { VueFireDB } from '@/service/firebase'
import SvgPanZoom from 'svg-pan-zoom'
import PostSummary from '@/components/home/hackingmap/postsummary'

export default {
  name: 'mapview',
  data () {
    return {
      map: appconfig.map,
      panZoomMap: null,
      svgPanZoomOpt: {
        viewportSelector: '.svg-pan-zoom_viewport',
        panEnabled: true,
        controlIconsEnabled: true,
        dblClickZoomEnabled: true,
        mouseWheelZoomEnabled: true,
        preventMouseEventsDefault: true,
        zoomScaleSensitivity: 0.4,
        minZoom: 0.9,
        maxZoom: 5,
        fit: true
      },
      isFetching: true,
      isMounted: false
    }
  },
  firebase () {
    return {
      postsData: { source: VueFireDB.ref('posts'),
        asObject: false,
        cancelCallback: null,
        readyCallback: function () {
          this.posts = this.format(this.postsData)
          this.isFetching = false
          console.log('fetched!')
        }
      }
    }
  },
  mounted () {
    console.log('mounted!')
    this.isMounted = true
  },
  computed: {
    posts () { return (this.postsData ? this.format(this.postsData) : ({})) },
    fetchedAndMounted () { return ((!this.isFetching) && this.isMounted) }
  },
  updated () {
    console.log('updated')
    this.draw()
  },
  methods: {
    draw () {
      console.log('draw()')
      let element = this.$refs.svg
      this.panZoomMap = SvgPanZoom(element, this.svgPanZoomOpt)
    },
    format () {
      if (this.postsData) {
        // console.log('formatting ', this.postsData)
        let posts = {}
        this.postsData
          .filter(data => data['table'] !== 0)
          .forEach((data) => { posts[data['table']] = data })
        return posts
      }
    },
    getStatusColor (status) {
      switch (status) {
        case '提案':
          return 'statue_proposal'
        case '徵人':
          return 'statue_recruit'
        case '趕工':
          return 'statue_hacking'
        case '展示':
          return 'statue_demo'
        case '放棄':
          return 'statue_giveup'
        default:
          return 'status_avalible'
      }
    }
  },
  components: {
    postsummary: PostSummary
  }
}
</script>

<style lang="sass" scoped>
@import "../../../style_config.sass"
.mapview
  position: relative
  z-index: -100
  top: -52px
  width: 100%
  height: 100%
  #svg-map
    width: 100%
    height: 100%
    background-color: $map_bg_color
  .legand
    border: 1px LightGrey solid
    background-color: rgba(256, 256, 256, 0.8)
    width: 5em
    position: absolute
    top: 30px
    right: 30px
    padding: 0.5em
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
  circle
    stroke: DarkSlateGrey
    stroke-width: 2

</style>
