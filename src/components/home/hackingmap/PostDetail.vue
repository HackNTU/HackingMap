<template>
  <section class="post-detail">

    <!-- Left side: iframe -->
    <div id="wrap" :class="wrapBackground">
      <div v-if="isLoading" class="loading-msg link-ellipsis">
        正在載入網址：<a :href="post.iframe" target="_blank" :alt="post.iframe">{{ post.iframe || 'N/A' }} </a>
      </div>
      <div v-else class="loading-msg link-ellipsis">
        共編/作品網址：<a :href="post.iframe" target="_blank" :alt="post.iframe">{{ post.iframe || 'N/A' }} </a>
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
    <!-- starCount:0
    .key:"-KorA6VxhpXtynXN1A9D"
    status:"完工"
    author:"lawrencechou1024@gmail.com"
    table:"87"
    desc:"HackingMap 是黑客松現場的專案地圖，即時呈現各專案的進度與成果，促進參加者間的交流互動。"
    award:"無"
    teammate:Object
    heartCount:0
    hearts:Object
    host:"#999"
    iframe:"http://bit.ly/hackingmap_get_started"
    name:"HackingMap"
    tags:Array[2]
    teammates:Array[3]
    timestamp:"2017-07-16T15:20:29.112Z" -->
    <!-- Right side: info -->


    <div id="info">

      <h1>{{ post.name }}</h1>
      <!-- map icon -->
      <icon id="location" name="map-o" @click.native.stop="goMap(post.table)" v-if="post.table" class="fa-icon-pointer"></icon>
      <p>{{ post.desc }} <small>@第{{ post.table }}桌</small></p>
      <ul>
        <li class="link-ellipsis">
          <icon name="link"></icon>
          共編/作品:<a :href="post.iframe" target="_blank" :alt="post.iframe">{{ post.iframe || 'N/A'}}</a>
        </li>
        <li class="link-ellipsis">
          <icon name="github"></icon>
          GitHub:<a  v-if="post.git" :href="'https://github.com/' + post.git" target="_blank">{{ post.git }}</a>
          <span v-else>N/A</span>
        </li>
        <li>最近更新： <time> {{ new Date(post.timestamp).toLocaleString() }}</time></li>
      </ul>
    </div>

  </section>
</template>

<script>
export default {
  name: 'postdetail',
  data () {
    return {
      loadIframe: true,
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
    isOpen (isOpen) {
      if (!isOpen) {
        // kill iframe as soon as dialog close
        this.loadIframe = false
      } else {
        this.loadIframe = true
        this.isLoading = true
      }
    }
  },
  methods: {
    goMap (tableNo) {
      this.$emit('closeDialog')
      this.$router.push('/map?focus=' + tableNo)
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
  width: 100%
  align-items: stretch

  #info
    flex: 1 30%
    padding: 5px
    min-width: 100px
    overflow-wrap: break-word !important
    word-wrap: break-word !important
    & > ul
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
    flex: 1 60%
    min-width: 100px
    border: 1px solid Grey

    // for the loading message
    display: flex
    flex-direction: column
    align-items: center
    justify-content: center

    #iframe
      flex: 1 0 80%
      overflow: hidden
      width: 100%
      height: 100%
      border: none

    .loading-msg
      flex: 0 0 1.5em
      background-color: Gainsboro

  .link-ellipsis
    display: block
    white-space: nowrap
    text-overflow: ellipsis
    width: 100%
    overflow: hidden

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
