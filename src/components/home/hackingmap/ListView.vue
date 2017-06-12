<template>
  <div class="listview">

    <code> {{ msg }}</code>
    <el-row>
      <el-col v-for="p in posts" :span="6" :gutter="20" :key="p.id">
        <!-- <div class="grid-content bg-purple"> {{p}} </div> -->
        <el-card class="box-card">
          <postsummary
          :title="p.name"
          :subtitle="p.author.split('@')[0]"
          :description="p.desc + ' ('+p.table+'桌)'"
          :postKey="p['.key']"
          :authorId="p.uid"
          :starCount="p.starCount"
          :stars="p.stars"
          :tags="p.tags"
          ></postsummary>
        </el-card>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import { FirebaseApp, VueFireDB } from '@/service/firebase'
import PostSummary from '@/components/home/hackingmap/postsummary'

export default {
  name: 'listview',
  data () {
    return {
      msg: 'Login to vote!'
    }
  },
  created () {
    FirebaseApp.auth().onAuthStateChanged((user) => {
      if (user) {
        this.msg = ''
      } else {
        this.msg = 'Login to vote!'
      }
    })
  },
  firebase: {
    posts: VueFireDB.ref('/posts/')
  },
  components: {
    postsummary: PostSummary
  }
}
</script>

<style lang="sass" scoped>
@import "../../../style_config.sass"

.listview
  background-color: $list_bg_color
  height: 100%
  position: relative
  overflow-y: scroll
  right: -17px

.box-card
  // width: 16rem
  text-align: left
  margin: 0.5em
</style>
