<template>
  <div class="postsummary">

    <!-- map icon -->
    <!-- <el-tooltip content="右鍵複製網址分享自己的專案！" :open-delay="500" placement="top"> -->
      <a :href="`#/map?focus=${table}`" @click.stop="">
        <icon id="location" name="map-o" @click.native.stop="goMap(table)" v-if="table"></icon>
      </a>
    <!-- </el-tooltip> -->

    <!-- star icon -->
    <span class="reaction">
      <span class="raIcon">
        <icon @click.native.stop="toggleStar" :name="(isStaredByMe ? 'star' : 'star-o')" class="icon fa-icon-pointer"></icon>
      </span>
      <span class="raCount">{{ starCount }}</span>
    </span>

    <!-- heart icon -->
    <span class="reaction">
      <span class="raIcon">
        <icon @click.native.stop="toggleHeart" :name="(isLovedByMe ? 'heart' : 'heart-o')" class="fa-icon-pointer"></icon>
      </span>
      <span class="raCount">{{ heartCount }}</span>
    </span>

    <h3 id="title" @click="$router.push(`/projects?id=${p['.key']}`)">{{ title }}</h3>
    <!-- <h5>{{ subtitle }}</h5> -->
    <p class="description" @click="$router.push(`/projects?id=${p['.key']}`)">
      <strong>{{ host }}</strong>
      {{ description }}</p>

    <div class="tags" style="width:100%;">
      <el-button
        v-for="tag in tags"
        :key="tags.indexOf(tag)"
        class="button-new-tag"
        size="small"
        @click.stop="$emit('tagClicked', tag)">
        {{ tag }}
      </el-button>
    </div>

  </div>
</template>

<script>
import firebase from 'firebase'

export default {
  name: 'postsummary',
  data () {
    return {
      currentUser: null
    }
  },
  created () {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.currentUser = user
      } else {
        this.currentUser = null
      }
    })
  },
  props: {
    title: {
      type: String,
      default: 'No title'
    },
    subtitle: {
      type: String,
      default: 'No subtitle'
    },
    description: {
      type: String,
      default: 'No description'
    },
    table: {
      type: Number,
      required: false
    },
    postKey: {
      type: String
    },
    authorId: {
      type: String
    },
    stars: {
      type: Object,
      default: null
    },
    hearts: {
      type: Object,
      default: null
    },
    // Deprecated
    // starCount: {
    //   type: Number
    // },
    // Deprecated
    // heartCount: {
    //   type: Number
    // },
    tags: {
      type: Array
    },
    host: {
      type: String
    }
  },
  computed: {
    starCount () {
      return (this.stars ? Object.keys(this.stars).length : '0')
    },

    heartCount () {
      return (this.hearts ? Object.keys(this.hearts).length : '0')
    },

    isStaredByMe () {
      // 檢查登入
      if (this.currentUser) {
        let uid = this.currentUser.uid
        // 排除stars為null的狀況
        if (this.stars) {
          return Object.keys(this.stars).includes(uid)
        }
      }
      return false
    },

    isLovedByMe () {
      // 檢查登入
      if (this.currentUser) {
        let uid = this.currentUser.uid
        // 排除stars為null的狀況
        if (this.hearts) {
          return Object.keys(this.hearts).includes(uid)
        }
      }
      return false
    }
  },
  methods: {
    goMap (tableNo) {
      this.$router.push('/map?focus=' + tableNo)
    },

    toggleStar () {
      // 檢查登入
      if (!this.currentUser) {
        alert('請先登入') // TODO: 導向登入視窗
        return
      }
      let globalPostRef = firebase.database().ref('/posts/' + this.postKey)
      let userPostRef = firebase.database().ref('/user-posts/' + this.authorId + '/' + this.postKey)
      let uid = this.currentUser.uid
      this.togglePostStarForCurrentUser(globalPostRef, uid)
      this.togglePostStarForCurrentUser(userPostRef, uid)
    },

    toggleHeart () {
      // 檢查登入
      if (!this.currentUser) {
        alert('請先登入') // TODO: 導向登入視窗
        return
      }
      let globalPostRef = firebase.database().ref('/posts/' + this.postKey)
      let userPostRef = firebase.database().ref('/user-posts/' + this.authorId + '/' + this.postKey)
      let uid = this.currentUser.uid
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
  }
}
</script>

<style lang="sass" scoped>
.postsummary
  // border: 1px solid red
  padding: 6px // 1rem
  margin: 0
  height: 100%

  h3, h5, i, span
    margin: 0.1rem

  p
    // margin: 0.5rem 0 0.5rem 0

  // multiline ellipsis, only supports webkit.
  .description
    // border: 1px solid yellow
    margin: 3px 0 4px 0
    height: 50px
    font-size: 12px
    overflow : hidden
    text-overflow: ellipsis
    display: -webkit-box
    -webkit-line-clamp: 3
    -webkit-box-orient: vertical

#location
  display: inline-block
  vertical-align: baseline
  width: 15px
  float: left
  margin-right: 2px

#title
  display: inline-block
  width: 116px
  white-space: nowrap
  line-height: 1.2em
  text-overflow: ellipsis
  overflow: hidden
  font-size: 14px

.reaction
  float: right
  width: 40px
  height: 20px
  margin-left: 0px !important
  margin-right: 2px !important
  > *
    position: relative
    display: inline-block
    float: left
    vertical-align: middle
  .raIcon
    margin: 0px
    width: 20px
    height: 16px
    .fa-icon
      // height: 16px
  .raCount
    font-size: 12px
    width: 16px
    height: 16px
    line-height: 16px
    text-align: center
    vertical-align: bottom
    margin-left: 1px
    margin-right: 0px

.tags
  position: relative
  white-space: nowrap
  overflow-x: scroll
  // padding-bottom: 1000px // hide scrollbar // invalid in Safari
  // margin-bottom: -1000px // hide scrollbar
  // overflow-y: hidden     // hide scrollbar // invalid in FireFox
  .button-new-tag
    display: inline-block

</style>
