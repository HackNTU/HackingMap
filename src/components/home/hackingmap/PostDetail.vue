<template>
  <section class="post-detail">

    <!-- Left side: iframe -->
    <div id="wrap" :class="wrapBackground">
      <div v-if="isLoading" class="loading-msg">
        正在載入 <a :href="post.iframe" target="_blank">{{ post.iframe || '預設iframe' }} </a>
      </div>
      <iframe
        id="iframe"
        v-if="loadIframe"
        @load="isLoading = false"
        :src="src"
        frameborder="1">
        <p>{{ msg }}</p>
      </iframe>
    </div>

    <!-- Right side: info -->
    <div id="info">
      <h1>{{ post.name }}</h1>
      <p>{{ post.desc }} <small>@第{{ post.table }}桌</small></p>
      <ul>
        <li>
          <icon name="link"></icon>共編/作品:
          <a :href="post.iframe" target="_blank">{{ post.iframe || 'N/A'}}</a>
        </li>
        <li>
          <icon name="github"></icon>GitHub:
          <a  v-if="post.git" :href="'https://github.com/' + post.git" target="_blank">{{ post.git }}</a>
          <span v-else>N/A</span>
        </li>
      </ul>
    </div>

  </section>
</template>

<script>
export default {
  name: 'postdetail',
  data () {
    return {
      loadIframe: false,
      isLoading: true,
      // default_iframe: 'https://bit.ly/hackingmap_get_started',
      default_iframe: '',
      msg: '抱歉，你的瀏覽器不支援iframe'
    }
  },
  computed: {
    src () {
      return (this.loadIframe ? this.post.iframe || this.default_iframe : null)
    },
    wrapBackground () {
      if (this.isLoading) {
        return 'loading-bg'
      } else {
        return (this.post.iframe ? 'load-fail-bg' : 'no-iframe-bg')
      }
    }
  },
  watch: {
    isOpen (yes) {
      if (yes) {
        this.loadIframe = true
        this.isLoading = true
      } else {
        // kill iframe as soon as dialog close
        this.loadIframe = false
      }
    }
  },
  methods: {
    sayHi (msg) {
      console.log('Hi, ' + msg + '. Loaded ' + this.src)
    }
  },
  props: {
    post: {
      type: Object,
      required: true
    },
    isOpen: {
      type: Boolean
    }
  }
}
</script>

<style lang="sass" scoped>
.post-detail
  display: flex
  height: 100%
  align-items: stretch

  #info
    flex: 20 0px
    list-style-type: none

  .loading-bg
    background:url(../../../assets/loading.gif) center center no-repeat

  // 1. By background image
  // .load-fail-bg
  //   background:url(../../../assets/facebook-logo.jpg) center center no-repeat

  // 2: By psudo element
  .load-fail-bg
    position: relative
    &:after
      content: "載入失敗，也許此網址不支援iframe內嵌?"
      position: absolute
      margin-right: auto
      margin-left: auto
      z-index: -1

  .no-iframe-bg
    position: relative
    &:after
      content: "尚未設置專案網址"
      position: absolute
      margin-right: auto
      margin-left: auto
      z-index: -1

  #wrap
    flex: 80 0px
    // border: 1px solid Grey

    // for the loading message
    display: flex
    flex-direction: column
    align-items: center
    justify-content: center

    #iframe
      flex: 100
      width: 100%
      height: 100%
      // background-color: WhiteSmoke

    .loading-msg
      display: block
      background-color: Yellow
      // background-color: #20A0FF

// 直立iPad、手機改為上下排列
@media screen and (max-device-width : 768px)
  .post-detail
    flex-flow: column nowrap
    #info
      flex: 0 0px
      order: 1
    #wrap
      flex: 100 0px
      order: 2

</style>
