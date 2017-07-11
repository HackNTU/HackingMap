<template>
  <div class="hackingmap">


    <div id="toolbar">
      <el-row>

        <!-- 搜尋框 -->
        <el-col :span="8">
          <el-input placeholder="搜尋專案" v-model.lazy.trim="query">
            <el-select v-model="scope" slot="prepend" placeholder="請選擇" size="large">
              <el-option label="Tag" value="tags"></el-option>
              <el-option label="標題" value="name"></el-option>
              <el-option label="簡介" value="desc"></el-option>
            </el-select>
            <!-- <el-button slot="append" icon="search"></el-button> -->
          </el-input>
        </el-col>

        <!-- 地圖/列表切換 -->
        <el-col :span="8">
          <el-button-group>
            <router-link to="/map" tag="el-button">地圖</router-link>
            <router-link to="/projects" tag="el-button">列表</router-link>
          </el-button-group>
        </el-col>

        <!-- 排序方法 -->
        <el-col :span="8">
          <el-radio-group v-model="sortKey">
            <el-radio label="timestamp">最近更新</el-radio>
            <el-radio label="heartCount"><icon name="heart"></icon>數量</el-radio>
            <el-radio label="starCount"><icon name="star"></icon>數量</el-radio>
          </el-radio-group>
        </el-col>
      </el-row>
    </div>

    <router-view v-bind:filteredPosts="filteredSortedPosts"></router-view>

    <template v-if="user !== null">
      <el-button icon="edit" id="editBtn" @click="showDialog = true" type="info" :plain="true"></el-button>
      <el-dialog
        :title="myPostTitle"
        :visible.sync="showDialog"
        :modal='true'
        :close-on-click-modal='false'>
        <myposts></myposts>
      </el-dialog>
    </template>
    <template v-else>
      <el-button icon="edit" id="editBtn" :disabled="true"></el-button>
    </template>

  </div>
</template>

<script>
import { FirebaseApp } from '@/service/firebase.js'
import MyPosts from '@/components/home/hackingmap/MyPosts.vue'

export default {
  name: 'hackingmap',
  data () {
    return {
      user: null,
      showDialog: false,
      searchScope: [''],
      query: '',
      scope: 'tags',
      sortKey: 'timestamp'
    }
  },
  firebase: {
    posts: {
      source: FirebaseApp.database().ref('/posts/'),
      readyCallback: () => {
        console.log('[HackingMap] Fetched `posts`!')
      }
    }
  },
  computed: {
    myPostTitle () {
      return (this.user.providerData[0].displayName || this.user.email.split('@')[0]) + '的專案'
    },
    filteredSortedPosts () {
      let key = this.sortKey || 'heartCount'
      return this.filteredPosts.sort((a, b) => {
        return (a[key] === b[key] ? 0 : (a[key] > b[key] ? -1 : 1))
      })
    },
    filteredPosts () {
      if (!this.query) {
        return this.posts
      }
      switch (this.scope) {
        case 'tags':
          return this.posts.filter(post => {
            if (post.tags) {
              let wasFound = false
              post.tags.forEach((tag) => {
                if (tag.toLowerCase().includes(this.query.toLowerCase())) {
                  wasFound = true
                }
              })
              return wasFound
            }
          })
        case 'name':
          return this.posts.filter(post => {
            if (post.name) {
              return post.name.toLowerCase().includes(this.query.toLowerCase())
            }
          })
        case 'desc':
          return this.posts.filter(post => {
            if (post.desc) {
              return post.desc.toLowerCase().includes(this.query.toLowerCase())
            }
          })
        default:
          return this.posts
      }
    }
  },
  created () {
    FirebaseApp.auth().onAuthStateChanged((user) => {
      if (user) {
        this.user = user
      } else {
        this.user = null
      }
    })
  },
  components: {
    myposts: MyPosts
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="sass" scoped>
@import "../../style_config.sass"
.hackingmap
  background-color: rgba(0, 0, 0, 0)
  position: relative
  height: 100%
  width: 100%

  #editBtn
    position: absolute
    bottom: 1rem
    right: 1rem

  #toolbar
    margin: 0.5em
    position: relative
    z-index: 100
</style>
<style>
.el-select .el-input {
  width: 80px;
}
</style>
