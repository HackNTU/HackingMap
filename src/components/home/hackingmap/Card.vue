<template>
  <div class="card">

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span><b>{{ title }}</b></span>
        <i @click="toggleStar" style="float: right;" :class="{'el-icon-star-off': !isStaredByMe, 'el-icon-star-on': isStaredByMe }"></i>
        <span style="float:right">{{ starCount }}</span>
      </div>
      <div>{{ description }}</div>
      <!-- <code>{{ stars }}</code> -->
      <!-- <code>{{ isStaredByMe }}</code> -->
      <el-tag v-for="t in Object.keys(tags)" key="t.id" type="primary">{{ t }}</el-tag>
    </el-card>

  </div>
</template>

<script>
import { VueFireDB, FirebaseApp } from '@/service/firebase'
export default {
  name: 'card',
  data () {
    return {
      isLoved: false,
      currentUser: null
    }
  },
  created () {
    FirebaseApp.auth().onAuthStateChanged((user) => {
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
    description: {
      type: String,
      default: 'No description'
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
    starCount: {
      type: Number
    },
    tags: {
      type: Object,
      default () {
        return {
          'tag': true,
          'not': true,
          'found': true
        }
      }
    }
  },
  computed: {
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
    }
  },
  methods: {
    toggleStar () {
      // 檢查登入
      if (!this.currentUser) {
        alert('Please login first') // TODO: 導向登入視窗
        return
      }
      let globalPostRef = VueFireDB.ref('/posts/' + this.postKey)
      let userPostRef = VueFireDB.ref('/user-posts/' + this.authorId + '/' + this.postKey)
      let uid = this.currentUser.uid
      this.togglePostStarForCurrentUser(globalPostRef, uid)
      this.togglePostStarForCurrentUser(userPostRef, uid)
    },
    togglePostStarForCurrentUser (postRef, uid) {
      postRef.transaction(function (post) {
        if (post) {
          if (post.stars && post.stars[uid]) {
            post.starCount--
            post.stars[uid] = null
          } else {
            post.starCount++
            if (!post.stars) {
              post.stars = {}
            }
            post.stars[uid] = true
          }
        }
        return post
      }, function (error, committed, snapshot) {
        if (error) {
          console.log('[Card.vue] Transaction failed abnormally!', error)
        } else if (!committed) {
          console.log('[Card.vue] Aborted the transaction.')
        } else {
          console.log('[Card.vue] Star toggled for' + snapshot.val().name)
        }
        // console.log(snapshot.val())  // stars更新以後的post
      })
    }
  }
}
</script>

<style lang="sass" scoped>
.text
  font-size: 14px

.item
  padding: 18px 0

.clearfix:before,
.clearfix:after
  display: table
  content: ""

.clearfix:after
  clear: bot

.box-card
  // width: 16rem
  text-align: left
  margin: 0.5em
</style>
