<template>
  <section class="mapview">

    <!-- SVG容器 -->
    <svg ref="svg" id="svg-map" class=".svg-pan-zoom_viewport" :viewBox="'0 0 '+map.map_width+' '+map.map_height">

      <!-- 地圖 -->
      <image xlink:href="../../../assets/flora_expo_park.png" :x="0" :y="0" :width="map.map_width" :height="map.map_height"/>
      <!-- <image xlink:href="../../../assets/hacking_area.png" :x="0" :y="0" :width="map.map_width" :height="map.map_height"/> -->

      <template v-for="post in filteredPosts">
        <!-- popper -->
        <el-tooltip
          :value="getFocusStatus(post.table)"
          placement="top"
          effect="light"
          popper-class="mypopper">

          <!-- 專案卡片 -->
          <div slot="content">
            <postsummary
            :title="post.name"
            :subtitle="(post.author || '').split('@')[0]"
            :description="post.desc + ' ('+post.table+'桌)'"
            :postKey="post['.key']"
            :authorId="post.uid"
            :starCount="post.starCount"
            :heartCount="post.heartCount"
            :stars="post.stars"
            :hearts="post.hearts"
            :tags="post.tags"
            ></postsummary>
          </div>

          <!-- 桌子圖點 -->
          <circle ref="circle"
            :v-popover="post.table"
            @click="onClick(post.table)"
            :cx="(post.table ? getX(post.table) : null)"
            :cy="(post.table ? getY(post.table) : null)"
            :class="getColor(post.status)"
            r="3"/>
        </el-tooltip>
      </template>
    </svg>

    <!-- 圖例 -->
    <div class="legand">
      <svg v-for="symble in ['提案', '徵人', '趕工', '展示', '放棄']" height="1.5em" width="5em">
        <circle :class="getColor(symble)" cx="1em" cy="0.7em" :r="7"/>
        <text x="2em" y="1em">{{ symble }}</text>
      </svg>
    </div>

    <!-- 放大、縮小按鈕 -->
    <div id="zoomBtnContainer">
      <li><el-button id="zoomInBtn" @click="panZoomObj.zoomIn()">
        <icon name="plus"></icon>
      </el-button></li>
      <li><el-button id="zoomOutBtn" @click="panZoomObj.zoomOut()">
        <icon name="minus"></icon>
      </el-button></li>
      <li><el-button id="zoomResetBtn" @click="panZoomObj.resetZoom();panZoomObj.resetPan()">
        <icon name="arrows-alt"></icon>
      </el-button></li>
    </div>

  </section>
</template>

<script>
import appconfig from '../../../appconfig'
// import firebase from 'firebase'
import SvgPanZoom from 'svg-pan-zoom'
import PostSummary from '@/components/home/hackingmap/postsummary'

export default {
  name: 'mapview',
  data () {
    return {
      map: appconfig.map,
      panZoomObj: null,
      svgPanZoomOpt: {
        viewportSelector: '.svg-pan-zoom_viewport',
        panEnabled: true,
        controlIconsEnabled: false,
        dblClickZoomEnabled: true,
        mouseWheelZoomEnabled: true,
        preventMouseEventsDefault: true,
        zoomScaleSensitivity: 0.4,
        minZoom: 0.9,
        maxZoom: 5,
        fit: true
      },
      clicked: null
    }
  },
  props: ['filteredPosts'],
  mounted () {
    // case 2: 從/projects切換過來，再次造訪/map時，在mounted()時加SvgPanZoom
    console.log('[MapView] mounted')
    this.setSvgPanZoom()
  },
  computed: {
    focus () {
      return this.$route.query.focus
    }
  },
  updated () {
    // case 1：初次造訪 /map 在 updated() 時才能加SvgPanZoom
    console.log('[MapView] updated')
    this.setSvgPanZoom()
  },
  methods: {
    setSvgPanZoom () {
      let domReady = (this.$refs.svg && this.$refs.circle)
      if (domReady) {
        // 為#svg元素加上縮放功能
        this.panZoomObj = SvgPanZoom(this.$refs.svg, this.svgPanZoomOpt)
        console.log('[MapView] setSvgPanZoom() TRUE')
      } else {
        console.log('[MapView] setSvgPanZoom() FALSE')
      }
    },
    getX (table) {
      let x = this.map.table_coor[Number(table)].x
      return x || 10
    },
    getY (table) {
      let y = this.map.table_coor[Number(table)].y
      return y || 10
    },
    getFocusStatus (table) {
      let isFocus = (Number(table) === Number(this.focus)) || (Number(table) === Number(this.clicked))
      if (isFocus) {
        console.log('[MapView] getFocusStatus(' + table + ') -> TRUE')
      }
      return isFocus
    },
    onClick (tableNo) {
      alert(tableNo)
      this.clicked = tableNo
    },
    getColor (status) {
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

// TODO: popper-class 無效 -> 移至 index.html
// .mypopper, el-tooltip__popper
//   border: 10px green solid !important
//   background-color: red !important
//   color: yellow !important

.mapview
  position: relative
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
    stroke-width: 1

  #zoomBtnContainer
    // background-color: green
    position: absolute
    bottom: 1rem
    left: 1rem
    li
      list-style-type: none
      margin-top: 0.5rem

</style>
