<template>
  <div class="listview">

    <code>{{ msg }}</code>

    <main class="flex-container">
      <article v-for="p, key in posts" :span="6" :gutter="20" :key="p.id" class="atk">

        <!-- Card (PostSummary.vue) -->
        <el-card v-if="key !== '.key'"
          class="box-card"
          body-style="height:inherit;padding:0px"
          @click.native="showDialog(key)">
          <postsummary
          :title="p.name"
          :subtitle="p.author.split('@')[0] + ' @ ' + p.table + '桌'"
          :description="p.desc"
          :table="Number(p.table)"
          :postKey="key"
          :authorId="p.uid"
          :starCount="p.starCount"
          :stars="p.stars"
          :heartCount="p.heartCount"
          :hearts="p.hearts"
          :tags="p.tags"
          ></postsummary>
        </el-card>

      </article>
    </main>

    <!-- Details (PostDetails) -->
    <el-dialog
    :title="(posts[dialogPostKey] ? posts[dialogPostKey].name : null)"
    :visible.sync="dialogVisible"
    size="large">
    <postdetail :post="posts[dialogPostKey]"></postdetail>
  </el-dialog>

  </div>
</template>

<script>
import firebase from 'firebase'
import PostSummary from '@/components/home/hackingmap/postsummary'
import PostDetail from '@/components/home/hackingmap/postdetail'

export default {
  name: 'listview',
  data () {
    return {
      msg: 'Login to vote!',
      dialogVisible: false,
      dialogPostKey: null
    }
  },
  firebase: {
    posts: {
      source: firebase.database().ref('/posts/'),
      asObject: true
    }
  },
  created () {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.msg = ''
      } else {
        this.msg = 'Login to vote!'
      }
    })
  },
  mounted () {
    console.log('[ListView] mounted')
  },
  methods: {
    showDialog (key) {
      console.log('showDetail()', key)
      this.dialogPostKey = key
      this.dialogVisible = true
    }
  },
  components: {
    postsummary: PostSummary,
    postdetail: PostDetail
  }
}
</script>

<style lang="sass" scoped>
@import "../../../style_config.sass"

.listview
  background-color: $list_bg_color
  height: 100%
  position: absolute
  overflow-y: scroll

.flex-container
  padding-top: 48px
  display: flex
  flex-flow: row wrap
  justify-content: center

article
  position: relative

.box-card
  width: 13.5rem
  height: 12.5em
  text-align: left
  margin: 0.5em

</style>
