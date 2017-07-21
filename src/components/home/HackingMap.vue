<template>
  <div class="hackingmap">


    <div id="toolbar">
      <el-row type="flex" justify="center" align="middle">

        <!-- 搜尋框 -->
        <el-col :lg="8" :md="8" :sm="8" :xs="16">
          <el-input placeholder="搜尋" v-model.lazy.trim="query" :disabled="$route.path === '/full_map'">
            <el-select v-model="scope" slot="prepend" placeholder="請選擇" size="large">
              <el-option label="全部" value="all"></el-option>
              <el-option label="專案名" value="name"></el-option>
              <el-option label="簡介" value="desc"></el-option>
              <el-option label="Tag" value="tags"></el-option>
              <el-option label="參與者" value="teammates"></el-option>
            </el-select>
            <!-- <el-button slot="append" icon="search"></el-button> -->
          </el-input>
        </el-col>

        <!-- 地圖/列表切換 -->
        <el-col :lg="8" :md="8" :sm="8" :xs="8">
          <!-- 電腦、平板：分頁標籤 -->
          <el-radio-group @change.native="$router.push($event.target.value)" class="regular-toolbar" v-model="path">
            <el-radio-button label="/projects">列表</el-radio-button>
            <el-radio-button label="/map">地圖</el-radio-button>
            <!-- <el-radio-button label="場地"></el-radio-button> -->
          </el-radio-group>
          <!-- 手機：下拉選單 -->
          <el-select @change="$router.push($event)" class="phone-toolbar" v-model="path">
            <el-option key="projects" label="列表" value="/projects"></el-option>
            <el-option key="map" label="地圖" value="/map"></el-option>
            <!-- <el-option key="full_map" label="場地" value="場地"></el-option> -->
          </el-select>
        </el-col>

        <!-- 排序方法 -->
        <el-col :lg="8" :md="8" :sm="8" :xs="0" id="sort-radio">
          <span v-show="$route.path !== '/map'">
            排序：
            <el-radio-group v-model="sortKey">
              <el-radio label="timestamp">更新</el-radio>
              <el-radio label="hearts">創意<icon name="heart"></icon></el-radio>
              <el-radio label="stars">技術<icon name="star"></icon></el-radio>
            </el-radio-group>
          </span>
        </el-col>
      </el-row>
    </div>

    <keep-alive>
      <router-view
        id="router-view"
        v-bind:filteredPosts="filteredSortedPosts"
        @searchTag="scope='tags'; query=$event">
      </router-view>
    </keep-alive>

    <template v-if="user !== null">
      <el-button icon="edit" id="editBtn" @click="showDialog = true" type="info" :plain="true">編輯專案</el-button>
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
      <el-button icon="edit" id="editBtn" :disabled="true">新增專案</el-button>
    </template>

    <!-- 使用教學 -->
    <el-dialog
      title="HackingMap 功能導覽"
      :visible.sync="showIntro"
      size="large">
      <span><intro></intro></span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="showIntro = false">關 閉</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { FirebaseApp } from '@/service/firebase.js'
import MyPosts from '@/components/home/hackingmap/MyPosts.vue'
import Intro from '@/components/Intro.vue'
import appconfig from '../../appconfig'
export default {
  name: 'hackingmap',
  data () {
    return {
      user: null,
      showDialog: false,
      showIntro: false,
      query: '',
      scope: 'all',
      sortKey: 'timestamp',
      path: this.$route.path
    }
  },
  firebase () {
    const that = this
    return {
      posts: {
        source: FirebaseApp.database().ref('/posts/'),
        readyCallback: () => {
          console.log('[HackingMap] Fetched `posts`!')

          // 若無登入則跳出使用教學
          if (this.user === null && appconfig.general.tutorial_for_non_login) {
            this.showIntro = true
          }
          that.$emit('loaded')
        }
      }
    }
  },
  computed: {
    myPostTitle () {
      return (this.user.providerData[0].displayName || this.user.email.split('@')[0]) + '的專案'
    },
    filteredSortedPosts () {
      let key = this.sortKey
      return this.filteredPosts.sort((a, b) => {
        if (key === 'timestamp') {
          return (a.timestamp === b.timestamp ? a.name > b.name : (a.timestamp > b.timestamp ? -1 : 1))
        } else {
          let lenA = (a[key] === undefined ? 0 : (Object.keys(a[key]).length))
          let lenB = (b[key] === undefined ? 0 : (Object.keys(b[key]).length))
          return lenA === lenB ? (a.name > b.name) : (lenA > lenB ? -1 : 1)
        }
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
              return post.tags.reduce((a, b) => '$$' + a + b, '') // concate all tags
                .toLowerCase().includes(this.query.toLowerCase())
            }
          })
        case 'teammates':
          return this.posts.filter(post => {
            if (post.teammates) {
              return post.teammates.reduce((a, b) => '$$' + a + b, post.host) // concate host and all teammates
                .toLowerCase().includes(this.query.toLowerCase())
            }
          })
        case 'name':
          return this.posts.filter(post => {
            return post.name.toLowerCase().includes(this.query.toLowerCase())
          })
        case 'desc':
          return this.posts.filter(post => {
            return (post.desc || '').toLowerCase().includes(this.query.toLowerCase())
          })
        case 'all':
          return this.posts.filter(post => {
            let everything = post.name + '$$' + post.desc
            everything += (post.tags || []).reduce((a, b) => a + b + '$$', '')
            everything += (post.teammates || []).reduce((a, b) => a + b + '$$', post.host)
            return everything.toLowerCase().includes(this.query.toLowerCase())
          })
        default:
          return this.posts
      }
    }
  },
  watch: {
    $route: function (to, from) {
      console.log('[HackingMap] go to:', to.fullPath)
      this.path = to.fullPath
      const query = to.query.query
      if (query) {
        console.log(`[watch $route] set query: query`)
        this.query = query
      } else {
        // console.log('[watch $route] no query')
      }
    },
    scope (value) {
      this.query = (value === 'teammates' ? '#' : '')
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
  },
  components: {
    myposts: MyPosts,
    intro: Intro
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
    .regular-toolbar, #editBtn, #sort-radio
      display: none

</style>
<style>
.el-select .el-input {
  width: 90px;
}
</style>
