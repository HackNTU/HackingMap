<template>
  <div id="app">

    <banner></banner>
    <router-view></router-view>
    <sponsor></sponsor>

  </div>
</template>

<script>
// import store from './vuex'
import Banner from '@/components/Banner.vue'
import Sponsor from '@/components/Sponsor.vue'
import Home from '@/components/home/Home.vue'
export default {
  name: 'app',
  // store,
  components: {
    banner: Banner,
    sponsor: Sponsor,
    home: Home
  }
}
</script>

<style lang="sass" scoped>
@import "./style_config.sass"

#app
  // font-family: 'Avenir', Helvetica, Arial, sans-serif
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: center
  color: #2c3e50

.banner
  background-color: $nav_bg_color
  position: fixed
  top: 0
  right: 0
  left: 0
  height: $nav_height

.sponsor
  background-color: $footer_bg_color
  position: fixed
  right: 0
  bottom: 0
  left: 0
  height: $footer_height
</style>
