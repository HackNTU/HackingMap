<template>
  <section class="fullmapview">

    <!-- SVG容器 -->
    <svg ref="svg" id="svg-map" class=".svg-pan-zoom_viewport" :viewBox="'0 0 '+map.map_width+' '+map.map_height">

      <!-- 地圖 -->
      <image xlink:href="../../../assets/full_map.jpg" :x="0" :y="0" :width="map.map_width" :height="map.map_height"/>

    </svg>

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
import SvgPanZoom from 'svg-pan-zoom'
export default {
  name: 'fullmapview',
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
      }
    }
  },
  mounted () {
    console.log('[FullMapView] mounted')
    this.panZoomObj = SvgPanZoom(this.$refs.svg, this.svgPanZoomOpt)
  }
}
</script>

<style lang="sass" scoped>
  @import "../../../style_config.sass"

  .fullmapview
    position: relative
    top: -52px
    width: 100%
    height: 100%

    #svg-map
      width: 100%
      height: 100%
      background-color: $map_bg_color

    #zoomBtnContainer
      // background-color: green
      position: absolute
      bottom: 1rem
      left: 1rem
      li
        list-style-type: none
        margin-top: 0.5rem
</style>
