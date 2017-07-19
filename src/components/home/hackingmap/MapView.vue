<template>
  <section class="mapview">

    <!-- SVG容器 -->
    <svg ref="svg" id="svg-map" class=".svg-pan-zoom_viewport" :viewBox="'0 0 '+map.map_width+' '+map.map_height">
    <g class="svg-pan-zoom_viewport">
      <!-- 地圖 -->
      <image xlink:href="../../../assets/hacking_area_scaled.png" :x="0" :y="0" :width="map.map_width" :height="map.map_height"/>
      </image>
      <!-- <image xlink:href="../../../assets/hacking_area.png" :x="0" :y="0" :width="map.map_width" :height="map.map_height"/> -->
      
      <g id="noSeatZone">
        <text
          x="-177"
          y="359"
        >
          未選座位的專案
        </text>
        <rect
          fill="none"
          stroke="red"
          x="-180"
          y="370"
          :width="3 * 30 + 30"
          :height="Math.round(tablePosts[0].length / 3) * 30 + 60"
          rx="1.5"
        />
      </g>

      <template v-for="(post, index) in tablePosts[0]">
          <!-- popper -->
        <el-tooltip
          placement="top"
          effect="light"
          popper-class="mypopper"
        >
          <!-- 專案卡片 -->
          <div slot="content">
            <postsummary
              :title="post.name"
              :subtitle="(post.author || '').split('@')[0]"
              :description="post.desc + ' (' + post.table + '桌)'"
              :authorId="post.uid"
              :starCount="post.starCount"
              :heartCount="post.heartCount"
              :stars="post.stars"
              :hearts="post.hearts"
              :tags="post.tags"
            ></postsummary>
          </div>

          <!-- 無座位專案圖點 -->
          <circle
            @click="onClick(0)"
            :cx="(getX(0) + getNoSeatXY('dx', index))"
            :cy="(getY(0) + getNoSeatXY('dy', index))"
            class="tableCircle noSeat"
            :class="{blinkTable: post.status == blinkStatus}"
          >
          </circle>
        </el-tooltip>
      </template>

      <template v-for="(post, index) in tablePosts" v-if="index > 0">
        <text
          :dx="(index ? getX(index) : null)"
          :dy="(index ? getY(index) : null) + 4"
          class="tableText"
        >
        {{post.length}}
        </text>

        <!-- popper -->
        <el-tooltip
          :value="index === focus"
          placement="top"
          effect="light"
          popper-class="mypopper"
        >
          <!-- 專案卡片 -->
          <div slot="content">
            <template v-for="(postummary, index) in post">
              <postsummary
                :title="postummary.name"
                :subtitle="(postummary.author || '').split('@')[0]"
                :description="postummary.desc + ' (' + postummary.table + '桌)'"
                :postKey="postummary['.key']"
                :authorId="postummary.uid"
                :starCount="postummary.starCount"
                :heartCount="postummary.heartCount"
                :stars="postummary.stars"
                :hearts="postummary.hearts"
                :tags="postummary.tags"
              ></postsummary>
              <hr v-if="(index + 1) != post.length ">
            </template>
          </div>

          <!-- 桌子圖點 -->
          <circle 
            @click="onClick(index)"
            :cx="(index ? getX(index) : null)"
            :cy="(index ? getY(index) : null)"
            class="tableCircle"
            :class="{
              blinkTable: getTableStatus(post).indexOf(blinkStatus) > -1,
              [getStatus(blinkStatus)]: true
            }"
            @mouseenter="setFocus(index)"
            @touchstart="setFocus(index)"
          >
          </circle>
        </el-tooltip>

      </template>
    </g>
    </svg>

    <!-- 圖例 -->
    <div class="legand">
      <svg height="2em" width="5em">
        <text x="0.4em" y="1em">點擊篩選</text>
      </svg>
      <svg class="cursor-pointer" v-for="symble in ['徵人', '趕工', '展示', '放棄']" height="1.5em" width="5em"
        @mouseenter="setBlinkStatus(true, symble)"
        @touchstart="setBlinkStatus(true, symble)"
      >
        <circle :class="getColor(symble)" cx="1em" cy="0.7em"/>
        <text x="2em" y="1em">{{ symble }}</text>
      </svg>
      <svg class="cursor-pointer" height="1.5em" width="5em"
        @mousemove="setBlinkStatus(false, '全部')"
        @touchstart="setBlinkStatus(false, '全部')"
      >
        <circle class="tableCircle" cx="1em" cy="0.7em"/>
        <text x="2em" y="1em">全部</text>
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
import _ from 'lodash'

import appconfig from '../../../appconfig'
// import firebase from 'firebase'
import SvgPanZoom from 'svg-pan-zoom'
import PostSummary from '@/components/home/hackingmap/postsummary'

export default {
  name: 'mapview',
  created () {

  },
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
      clicked: null,
      blinkStatus: '',
      focus: ''
    }
  },
  props: ['filteredPosts'],
  watch: {
    filteredPosts: function (val, oldVal) {
      // console.log('[filteredPosts] Updated!', 'new: %s, old: %s', val, oldVal)
      this.$nextTick(() => {
        this.setSvgPanZoom()
      })
    },
    $route: function (to, from) { // no use
      // console.log('to:', to, 'from:', from)
      this.focus = to.query.focus
      if (focus) {
        if (this.tablePosts[focus]) {
          console.log(`[watch $route] set table[${focus}] focus`)
          this.tablePosts[focus].focus = true
          console.log(this.tablePosts[focus])
        } else {
          console.log('[watch $route] no table')
        }
      } else {
        console.log('[watch $route] no focus')
      }
    }
  },
  mounted () {
    // case 2: 從/projects切換過來，再次造訪/map時，在mounted()時加SvgPanZoom
    console.log('[MapView] mounted')
    this.setSvgPanZoom()
  },
  computed: {
    tablePosts () {
      return _.groupBy(this.filteredPosts, (gb) => gb.table)
    }
  },
  updated () {
    // case 1：初次造訪 /map 在 updated() 時才能加SvgPanZoom
    console.log('[MapView] updated')
    // this.setSvgPanZoom()
  },
  methods: {
    setFocus (index) {
      console.log(`setFocus(${index})`)
      this.focus = index
    },
    setSvgPanZoom () {
      // 為#svg元素加上縮放功能
      this.panZoomObj = SvgPanZoom(this.$refs.svg, this.svgPanZoomOpt)
      console.log('[MapView] setSvgPanZoom() TRUE')
    },
    getX (table) {
      let x = this.map.table_coor[Number(table)].x
      return x || 10
    },
    getY (table) {
      let y = this.map.table_coor[Number(table)].y
      return y || 10
    },
    getNoSeatXY (xy, index) {
      const gutter = 30
      const cols = 3
      switch (xy) {
        case 'dx':
          return (index % cols) * gutter
        case 'dy':
          return Math.floor(index / cols) * gutter
        default:
          return 0
      }
    },
    onClick (tableNo) {
      // alert('桌號 ' + tableNo)
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
    },
    getStatus (status) { // never used
      switch (status) {
        case '徵人':
          return 'recruit'
        case '趕工':
          return 'hacking'
        case '展示':
          return 'demo'
        case '放棄':
          return 'giveup'
        default:
          return 'avalible'
      }
    },
    getTableStatus (table) {
      return table.map((m) => m.status)
    },
    setBlinkStatus (set, status) {
      console.log(`setBlinkStatus(${set}, ${status})`)
      if (set) {
        this.blinkStatus = status
      } else {
        this.blinkStatus = ''
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
  // overflow: hidden
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
    circle
      r: 7  
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

.tableCircle
  r: 10
  fill: white
  fill-opacity: 0
  stroke-linecap: round 
  stroke-width: 1
  stroke-opacity: 0.8
  transition: r 0.2s ease-out;
  &.blinkTable
    r: 15
    // stroke-dasharray: 5,2
    fill-opacity: 0.3
    &.recruit
      fill: $statue_recruit
    &.hacking
      fill: $statue_hacking
    &.demo
      fill: $statue_demo
    &.giveup
      fill: $statue_giveup

  &.noSeat
    stroke: #663399
    stroke-width: 1.5
    r: 8

.tableText
  text-anchor: middle
  font-size: 12px
  fill: #888

.cursor-point
  cursor: pointer;


hr
  width: 97%
  align: center
  border: 0
  height: 1px 
  background-color: #d4d4d4
  color: #d4d4d4

</style>
