<template>
  <div class="listview">

    <main class="flex-container">
      <article v-for="p, key in filteredPosts" :span="6" :gutter="20" :key="p.id" class="atk">

        <!-- Card (PostSummary.vue) -->
        <el-card v-if="key !== '.key'"
          class="box-card"
          body-style="height:inherit;padding:0px"
          @click.native="showDialog(key)">
          <postsummary
          :title="p.name"
          :subtitle="(p.author || '').split('@')[0] + ' @ ' + p.table + '桌'"
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
      :title="(filteredPosts[dialogPostKey] ? filteredPosts[dialogPostKey].name : null)"
      :visible.sync="dialogVisible"
      size="full">
      <postdetail :post="filteredPosts[dialogPostKey]"></postdetail>
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
      dialogVisible: false,
      dialogPostKey: null
    }
  },
  props: ['filteredPosts'],
  created () {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        //
      } else {
        this.$message('登入後可投票歐 👉 ')
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
  overflow-y: scroll
  position: relative
  top: -52px
  width: 100%
  height: 100%

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
