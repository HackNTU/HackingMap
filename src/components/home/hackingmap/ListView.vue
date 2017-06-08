<template>
  <div class="listview">

    <code> {{ msg }}</code>
    <el-row>
      <el-col v-for="p in posts" :span="6" :gutter="20" :key="p.id">
        <!-- <div class="grid-content bg-purple"> {{p}} </div> -->
        <card
          :title="p.name + ' by ' + p.author.split('@')[0]"
          :description="p.desc + ' ('+p.table+'桌)'"
          :postKey="p['.key']"
          :authorId="p.uid"
          :starCount="p.starCount"
          :stars="p.stars"
          ></card>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import { FirebaseApp, VueFireDB } from '@/service/firebase'
import Card from '@/components/home/hackingmap/card'

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
    card: Card
  }
}
</script>

<style lang="sass" scoped>
@import "../../../style_config.sass"

.listview
  background-color: $list_bg_color
  height: 100%
  overflow-y: scroll
</style>
