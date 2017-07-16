<template>
  <div class="postsummary">

    <!-- map icon -->
    <icon id="location" name="map-o" @click.native.stop="goMap(table)" v-if="table" class="fa-icon-pointer"></icon>

    <!-- star icon -->
    <span style="float:right">
      <icon @click.native.stop="toggleStar" :name="(isStaredByMe ? 'star' : 'star-o')" class="fa-icon-pointer"></icon>
      {{ starCount }}
    </span>

    <!-- heart icon -->
    <span style="float:right">
      <icon @click.native.stop="toggleHeart" :name="(isLovedByMe ? 'heart' : 'heart-o')" class="fa-icon-pointer"></icon>
      {{ heartCount }}
    </span>

    <h3 id="title">{{ title }}</h3>
    <!-- <h5>{{ subtitle }}</h5> -->
    <p class="description">{{ description }}</p>

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
        alert('Please login first') // TODO: 導向登入視窗
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
        alert('Please login first') // TODO: 導向登入視窗
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
    margin: 3px 0 4px 0

  // multiline ellipsis, only supports webkit.
  .description
    // border: 1px solid yellow
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

#title
  display: inline-block
  width: 59%
  white-space: nowrap
  line-height: 1.2em
  text-overflow: ellipsis
  overflow: hidden
  font-size: 16px

.tags
  position: relative
  white-space: nowrap
  overflow-x: scroll
  padding-bottom: 30px // hide scrollbar
  .button-new-tag
    display: inline-block

</style>
