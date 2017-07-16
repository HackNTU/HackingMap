<template>
  <div class="hackingmap">


    <div id="toolbar">
      <el-row type="flex" justify="center" align="middle">

        <!-- 搜尋框 -->
        <el-col :lg="8" :md="8" :sm="8" :xs="12">
          <el-input placeholder="篩選" v-model.lazy.trim="query" :disabled="$route.path === '/full_map'">
            <el-select v-model="scope" slot="prepend" placeholder="請選擇" size="large">
              <el-option label="Tag" value="tags"></el-option>
              <el-option label="標題" value="name"></el-option>
              <el-option label="簡介" value="desc"></el-option>
            </el-select>
            <!-- <el-button slot="append" icon="search"></el-button> -->
          </el-input>
        </el-col>

        <!-- 地圖/列表切換 -->
        <el-col :lg="8" :md="8" :sm="8" :xs="8">
          <!-- 電腦、平板：分頁標籤 -->
          <el-radio-group @change="goTo($event)" class="regular-toolbar" v-model="foo">
            <el-radio-button label="專案"></el-radio-button>
            <el-radio-button label="HackingMap"></el-radio-button>
            <el-radio-button label="場地"></el-radio-button>
          </el-radio-group>
          <!-- 手機：下拉選單 -->
          <el-select @change="goTo($event)" class="phone-toolbar" v-model="bar">
            <el-option key="projects" label="專案" value="專案"></el-option>
            <el-option key="map" label="HackingMap" value="HackingMap"></el-option>
            <el-option key="full_map" label="場地" value="場地"></el-option>
          </el-select>
        </el-col>

        <!-- 排序方法 -->
        <el-col :lg="8" :md="8" :sm="8" :xs="4">
          <el-radio-group v-model="sortKey" :disabled="$route.path === '/full_map'">
            <el-radio label="timestamp">最近更新</el-radio>
            <el-radio label="heartCount">最多<icon name="heart"></icon></el-radio>
            <el-radio label="starCount">最多<icon name="star"></icon></el-radio>
          </el-radio-group>
        </el-col>
      </el-row>
    </div>

    <keep-alive>
      <router-view
        id="router-view"
        v-bind:filteredPosts="filteredSortedPosts"
        @searchTag="scope='tags';query=$event">
      </router-view>
    </keep-alive>

    <template v-if="user !== null">
      <el-button icon="edit" id="editBtn" @click="showDialog = true" type="info" :plain="true"></el-button>
      <el-dialog
        title="專案編輯"
        :visible.sync="showDialog"
        :modal='true'
        size="large"
        :close-on-click-modal='false'>
        <myposts @close="showDialog = false"></myposts>
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
      query: '',
      scope: 'tags',
      sortKey: 'timestamp',
      foo: 'HackingMap',
      bar: 'HackingMap'
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
  methods: {
    goTo (tabName) {
      switch (tabName) {
        case '專案':
          this.$router.push('/projects')
          break
        case 'HackingMap':
          this.$router.push('/map')
          break
        case '場地':
          this.$router.push('/full_map')
          break
      }
    }
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
  display: flex
  flex-direction: column

  #editBtn
    position: absolute
    bottom: 1rem
    right: 1rem

  #toolbar
    background-color: $toolbar_bg_color
    padding: 0.5em
    z-index: 100
    flex: 0

  #router-view
    flex: 100
    overflow-y: scroll

  // Laptop & horizontal iPad
  @media screen and (min-width: 730px)
    .phone-toolbar
      display: none

  // vertical iPad
  // hide Schedule.vue & Sponser.vue

  // Smaller then vertical iPad
  @media screen and (max-width: 730px)
    .regular-toolbar
      display: none

</style>
<style>
.el-select .el-input {
  width: 80px;
}
</style>
