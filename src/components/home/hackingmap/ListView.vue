<template>
  <div class="listview">

    <transition-group name="el-fade-in" class="flex-container" tag="span">
      <article v-for="p, index in filteredPosts" :key="index">

        <!-- Card -->
        <el-card
          class="box-card"
          body-style="height:inherit;padding:0px"
          @click.native="showDialog(index)">
          <!-- {{index}} --><!-- TODO: https://cn.vuejs.org/v2/guide/transitions.html#列表的位移过渡  -->
          <postsummary
          :title="p.name"
          :subtitle="(p.author || '').split('@')[0] + ' @ ' + p.table + '桌'"
          :description="p.desc"
          :table="Number(p.table)"
          :postKey="p['.key']"
          :authorId="p.uid"
          :starCount="p.starCount"
          :stars="p.stars"
          :heartCount="p.heartCount"
          :hearts="p.hearts"
          :tags="p.tags"
          @tagClicked="$emit('searchTag', $event)"
          ></postsummary>
        </el-card>

      </article>
    </transition-group>

    <!-- Details (PostDetails) -->
    <el-dialog
      :title="(filteredPosts[dialogPostIndex] ? filteredPosts[dialogPostIndex].name : null)"
      :visible.sync="dialogVisible"
      size="full">
      <postdetail :post="filteredPosts[dialogPostIndex]"></postdetail>
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
      dialogPostIndex: null
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
    showDialog (index) {
      console.log('showDetail()', index)
      this.dialogPostIndex = index
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

.box-card
  width: 13.5rem
  height: 12.5em
  text-align: left
  margin: 0.5em
  cursor: pointer

</style>
