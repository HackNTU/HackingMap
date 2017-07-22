<template>
  <section class="post-detail">

    <!-- Left side: iframe -->
    <div id="wrap" :class="wrapBackground">
      <div v-if="isLoading" class="loading-msg link-ellipsis">
        正在載入網址：<a :href="post.iframe" target="_blank" :alt="post.iframe">{{ post.iframe || 'N/A' }} </a>
      </div>
      <div v-else class="loading-msg link-ellipsis">
        共編/作品網址：<a :href="post.iframe" target="_blank" :alt="post.iframe">{{ post.iframe || '未填寫' }} </a>
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

      <div id="header">
        <!-- 專案名 -->
        <h1>{{ post.name }}</h1>
        <!-- 愛心 -->
        <h3>
          <icon @click.native.stop="toggleHeart" :name="(isLovedByMe ? 'heart' : 'heart-o')" class="fa-icon-pointer"></icon>
          <span>{{ heartCount }}</span>
        </h3>
        <!-- 星星 -->
        <h3>
          <icon @click.native.stop="toggleStar" :name="(isStaredByMe ? 'star' : 'star-o')" class="fa-icon-pointer"></icon>
          <span>{{ starCount }}</span>
        </h3>
        <!-- 地圖 -->
        <h3>
          <icon id="location" name="map-o" @click.native.stop="goMap(post.table)" class="fa-icon-pointer"></icon>
          <span>{{ post.table ? post.table + '桌' : '未選桌號' }}</span>
        </h3>
      </div>

      <div id="content">

        <!-- 專案簡介、標籤 -->
        <div id="desc-block">
          <el-tag v-for="tag in post.tags" type="gray" color="white" :key="tag">{{ tag }}</el-tag>
          <p>{{ post.desc }}</p>
        </div>

        <span id="gutter"></span>

        <!-- 列表：共編、GitHub、更新時間... -->
        <ul id="ul-block" class="link-ellipsis">
          <li>專案狀態：{{ post.status }}</li>
          <li>
            <!-- <icon name="link"></icon> -->
            專案介紹 URL: <a :href="post.iframe" target="_blank" :alt="post.iframe">{{ post.iframe || '未填寫'}}</a>
          </li>
          <li>
            <!-- <icon name="github"></icon> -->
            GitHub: <a  v-if="post.git" :href="'https://github.com/' + post.git" target="_blank">{{ post.git }}</a>
            <span v-else>未填寫</span>
          </li>
          <li>聯絡方式：{{ post.contact || '無' }}</li>
          <li>企業獎調查：{{ (post.awards ? `1.${post.awards[0]}  2.${post.awards[1] || '無'}` : '無') }}</li>
          <li>最近更新：<time>{{ new Date(post.timestamp).toLocaleString() }}</time></li>
          <!-- <li v-if="post.award !== '無'">參加企業獎：{{ post.award }}</li> -->
        </ul>

      </div>
    </div>

  </section>
</template>

<script>
import firebase from 'firebase'
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
    postKey () {
      return this.post['.key'] || null
    },
    src () {
      return (this.loadIframe ? this.post.iframe || this.default_iframe : null)
    },
    wrapBackground () {
      if (this.isLoading) {
        return 'loading-bg'
      } else {
        return (this.post.iframe ? 'load-fail-bg' : 'no-iframe-bg')
      }
    },
    starCount () {
      return (this.post.stars ? Object.keys(this.post.stars).length : '0')
    },
    heartCount () {
      return (this.post.hearts ? Object.keys(this.post.hearts).length : '0')
    },
    isStaredByMe () {
      // 檢查登入
      if (firebase.auth().currentUser) {
        let uid = firebase.auth().currentUser.uid
        // 排除stars為null的狀況
        if (this.post.stars) {
          return Object.keys(this.post.stars).includes(uid)
        }
      }
      return false
    },
    isLovedByMe () {
      // 檢查登入
      if (firebase.auth().currentUser) {
        let uid = firebase.auth().currentUser.uid
        // 排除stars為null的狀況
        if (this.post.hearts) {
          return Object.keys(this.post.hearts).includes(uid)
        }
      }
      return false
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
    },

    toggleStar () {
      // 檢查登入
      if (!firebase.auth().currentUser) {
        alert('請先登入') // TODO: 導向登入視窗
        return
      }
      let globalPostRef = firebase.database().ref('/posts/' + this.postKey)
      let userPostRef = firebase.database().ref('/user-posts/' + this.authorId + '/' + this.postKey)
      let uid = firebase.auth().currentUser.uid
      this.togglePostStarForCurrentUser(globalPostRef, uid)
      this.togglePostStarForCurrentUser(userPostRef, uid)
    },

    toggleHeart () {
      // 檢查登入
      if (!firebase.auth().currentUser) {
        alert('請先登入') // TODO: 導向登入視窗
        return
      }
      let globalPostRef = firebase.database().ref('/posts/' + this.postKey)
      let userPostRef = firebase.database().ref('/user-posts/' + this.authorId + '/' + this.postKey)
      let uid = firebase.auth().currentUser.uid
      this.togglePostHeartForCurrentUser(globalPostRef, uid)
      this.togglePostHeartForCurrentUser(userPostRef, uid)
    },

    togglePostStarForCurrentUser (postRef, uid) {
      postRef.child('stars').child(uid).transaction(function (val) {
        if (val) {
          val = null
        } else {
          val = true
        }
        return val
      }, function (error, committed, snapshot) {
        if (error) {
          console.log('[Card.vue] Transaction failed abnormally!', error)
        } else if (!committed) {
          console.log('[Card.vue] Aborted the transaction.')
        } else {
          console.log('[Card.vue] Star toggled for ' + snapshot.val())
        }
        // console.log(snapshot.val())  // stars更新以後的post
      })
    },

    togglePostHeartForCurrentUser (postRef, uid) {
      postRef.child('hearts').child(uid).transaction(function (val) {
        if (val) {
          val = null
        } else {
          val = true
        }
        return val
      }, function (error, committed, snapshot) {
        if (error) {
          console.log('[Card.vue] Heart transaction failed abnormally!', error)
        } else if (!committed) {
          console.log('[Card.vue] Aborted the heart transaction.')
        } else {
          console.log('[Card.vue] Heart toggled for ' + snapshot.val())
        }
        // console.log(snapshot.val())  // hearts更新以後的post
      })
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
    #ul-block
      list-style-type: none
      padding: 0
      // centering <ul> as block, align <li> to left inside
      display: inline-block !important
      margin-left: auto
      margin-right: auto
      text-align: left
    #header
      h1, h3
        display: inline
      padding-top: 10px
      padding-bottom: 10px
    .el-tag
      margin: 2px

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
    max-width: 100%
    overflow: hidden

// 直立iPad、手機改為上下排列
@media screen and (max-device-width : 768px)
  .post-detail
    flex-flow: column nowrap
    #info
      padding-top: 2em
      flex: 0 0px
      order: 1
      #content
        display: flex
        #desc-block
          flex: 60
          text-align: left
          p
            margin: 1px
        #gutter
          flex: 0 0 20px
        #ul-block
          flex: 40
    #wrap
      flex: 100 0px
      order: 2

// 手機隱藏iframe
@media screen and (max-device-width : 480px)
  .post-detail
    flex-flow: column nowrap
    #info
      padding-top: 2em
      flex: 1 0px
      order: 1
      #content
        flex-flow: column nowrap
        display: flex
        #desc-block
          flex: 60
          text-align: left
          p
            margin: 1px
        #gutter
          flex: 0 0 20px
        #ul-block
          flex: 40
    #wrap
      display: none

</style>
