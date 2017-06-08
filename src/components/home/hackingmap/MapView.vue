<template>
  <div class="mapview">

    <div class="block">
      <el-slider v-model="scale" :format-tooltip="formatTooltip"></el-slider>
    </div>

    <h1>{{ map.canvas }}</h1>
    <svg id="canvas" xmlns="http://www.w3.org/2000/svg" version="1.1" :width="map.map_width * scale" :height="map.map_height * scale">

      <!-- 地圖 -->
      <template>

        <!-- 場地輪廓 -->
        <template v-for="vertex in map.border">
          <path class="map" :d="
            'M ' + vertex.x1*scale + ' ' + (map.map_height - vertex.y1)*scale +
            ' L ' + vertex.x2*scale + ' ' + (map.map_height - vertex.y2)*scale"/>
        </template>

        <!-- 桌子 -->
        <template v-for="rect in map.rectangles">
          <p>{{rect.x}}</p>
          <rect class="table" :x="rect.x * scale" :y="(map.map_height - rect.y - rect.h) * scale" :width="rect.w * scale" :height="rect.h * scale"></rect>
        </template>
      </template>

    </svg>

  </div>
</template>

<script>
import map from '../../../appconfig_map'

export default {
  name: 'mapview',
  data () {
    return {
      msg: 'MapView.vue',
      scale: 5,
      map: map
    }
  },
  methods: {
    formatTooltip: (val) => String(val) + ' %'
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="sass" scoped>
@import "../../../style_config.sass"

.mapview
  // background-color: $map_bg_color

#canvas
  background-color: $map_bg_color

.table
  fill: none
  stroke: grey

.map
  fill: none
  stroke: black
</style>
