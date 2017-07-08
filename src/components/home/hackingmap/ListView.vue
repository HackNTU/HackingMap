<template>
  <div class="listview">

    <code>{{ msg }}</code>

    <main class="flex-container">
      <article v-for="p in posts" :span="6" :gutter="20" :key="p.id">
        <el-card class="box-card" body-style="height: inherit;padding:0px">
          <postsummary
          :title="p.name"
          :subtitle="p.author.split('@')[0] + ' @ ' + p.table + '桌'"
          :description="p.desc"
          :table="Number(p.table)"
          :postKey="p['.key']"
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

  </div>
</template>

<script>
import firebase from 'firebase'
import PostSummary from '@/components/home/hackingmap/postsummary'

export default {
  name: 'listview',
  data () {
    return {
      msg: 'Login to vote!'
    }
  },
  firebase: {
    posts: firebase.database().ref('/posts/')
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

.flex-container
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
