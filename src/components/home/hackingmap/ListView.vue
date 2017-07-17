<template>
  <div class="listview">

    <transition-group name="el-fade-in" class="flex-container" tag="span">
      <article v-for="p, index in filteredPosts" :key="p['.key']">

        <!-- Card -->
        <el-card
          class="box-card"
          body-style="height:inherit;padding:0px"
          @click.native="showDialog(p['.key'])">
          <!-- {{key}} --><!-- TODO: https://cn.vuejs.org/v2/guide/transitions.html#列表的位移过渡  -->
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
      :visible.sync="dialogVisible"
      custom-class="larger-dialog"
      size="large">
      <postdetail
        :post="getPost(dialogPostKey)"
        :isOpen="dialogVisible"
        @closeDialog="hideDialog()"
      ></postdetail>
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
  methods: {
    showDialog (key) {
      this.dialogPostKey = key
      this.dialogVisible = true
    },
    hideDialog () {
      this.dialogVisible = false
    },
    getPost (key) {
      for (let index in this.filteredPosts) {
        let obj = this.filteredPosts[index]
        if (obj['.key'] === key) {
          return obj
        }
      }
      return null
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

.flex-container
  display: flex
  flex-flow: row wrap
  justify-content: center

.box-card
  width: 236px // 13.5rem
  height: 120px // 12.5em
  text-align: left
  margin: 0.5em
  cursor: pointer

</style>

<!-- 90vh dialog for PostDetail -->
<style lang="sass">
  .larger-dialog
    height: 94vh
    width: 95%
    top: 3vh !important
    margin-bottom: 0
    .el-dialog__headerbtn
      position: relative
      z-index: 3000
    .el-dialog__body
      // background-color: orange
      position: absolute
      padding: 1vw
      // top: 38px
      top: 0px
      left: 0
      right: 0
      bottom: 0
</style>
