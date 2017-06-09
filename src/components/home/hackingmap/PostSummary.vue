<template>
  <div class="postsummary">

    <i @click="toggleStar" style="float: right;" :class="{'el-icon-star-off': !isStaredByMe, 'el-icon-star-on': isStaredByMe }"></i>
    <span style="float:right">{{ starCount }}</span>
    <h3>{{ title }}</h3>
    <h5>{{ subtitle }}</h5>
    <p>{{ description }}</p>

    <el-tag v-for="t in Object.keys(tags)" key="t.id" type="primary">{{ t }}</el-tag>

  </div>
</template>

<script>
import { VueFireDB, FirebaseApp } from '@/service/firebase'
export default {
  name: 'postsummary',
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
    subtitle: {
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
h3, h5, i, span
  margin: 0.1rem

p
  margin: 0.5rem 0 0.5rem 0

.el-tag
  margin: 0 0.3rem 0 0
</style>
