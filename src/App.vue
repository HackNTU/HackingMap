<template>
  <div id="app">

    <banner></banner>
    <router-view class="main" @loaded="loaded"></router-view>
    <sponsor v-if="config.sponsor"></sponsor>
    <loading v-if="loading" :ready="ready"></loading>

  </div>
</template>

<script>
import appconfig from '@/appconfig'
import Banner from '@/components/banner/Banner.vue'
import Sponsor from '@/components/Sponsor.vue'
import Home from '@/components/home/Home.vue'
import Loading from '@/components/Loading.vue'

export default {
  name: 'app',
  // store,
  data () {
    return {
      config: appconfig,
      loading: true,
      ready: false
    }
  },
  mounted () {},
  methods: {
    loaded () {
      console.log('loaded')
      this.ready = true
      setTimeout(() => {
        this.loading = false
      }, 1500)
    }
  },
  components: {
    banner: Banner,
    sponsor: Sponsor,
    home: Home,
    Loading
  }
}
</script>

<style lang="sass" scoped>
@import "./style_config.sass"

#app
  // TODO: 支援 Safari 和 Firefox 排版
  // position: fixed
  // height: 100vh
  // width: 100vw

  // font-family: 'Avenir', Helvetica, Arial, sans-serif
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: center
  color: #2c3e50
  display: flex
  flex-flow: column nowrap

.banner
  background-color: $nav_bg_color
  flex: 0 $nav_height

.main
  flex: 1 auto

.sponsor
  background-color: $footer_bg_color
  flex: 0 $footer_height
  z-index: 10

@media screen and (max-width: 768px)
  .sponsor
    display: none !important
</style>
<style lang="sass">
  .fa-icon
    vertical-align: text-bottom
    width: auto
    height: 1.0em
    padding: 0.1em

  // Scale icon on hover
  .fa-icon-pointer:hover
    cursor: pointer
    width: auto
    height: 1.2em
    padding: 0
</style>
