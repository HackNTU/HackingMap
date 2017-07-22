<template>
  <section id="expo">

    <el-input
      v-model="table"
      autofocus
      :maxlength=3
      placeholder="請輸入桌號"
      icon="circle-close"
      :on-icon-click="clear"
      size="large"
      type="number"
      pattern="[0-9]*"
      inputmode="numeric"
    >
    </el-input>

    <h1 v-if="matchedPosts.length === 0">
      <span>{{ (table === '' ? '請輸入桌號' : '找不到專案') }}</span>
    </h1>
    <template v-for="post in matchedPosts">
      <!-- Card -->
      <el-card
        class="box-card"
        body-style="height:inherit;padding:0px"
        >
        <!-- @click.native="$router.push(`/projects?id=${p['.key']}`)"> -->
        <!-- @click.native="showDialog(p['.key'])"> -->
        <!-- {{key}} --><!-- TODO: https://cn.vuejs.org/v2/guide/transitions.html#列表的位移过渡  -->
        <postsummary
          :title="post.name"
          :subtitle="(post.author || '').split('@')[0] + ' @ ' + post.table + '桌'"
          :description="`(${post.table}桌) ${post.desc}`"
          :table="Number(post.table)"
          :postKey="post['.key']"
          :authorId="post.uid"
          :starCount="post.starCount"
          :stars="post.stars"
          :heartCount="post.heartCount"
          :hearts="post.hearts"
          :tags="post.tags"
          :host="post.host"
        ></postsummary>
      </el-card>
    </template>

  </section>
</template>

<script>
import { FirebaseApp } from '@/service/firebase.js'
import PostSummary from '@/components/home/hackingmap/postsummary'
export default {
  name: 'expo',
  data () {
    return {
      table: ''
    }
  },
  firebase: {
    posts: {
      source: FirebaseApp.database().ref('/posts/'),
      readyCallback: function () {
        console.log('[Expo] Loaded')
        this.$emit('loaded')
      }
    }
  },
  computed: {
    matchedPosts () {
      return this.posts.filter((post) => {
        return post.table === this.table
      })
    }
  },
  methods: {
    clear () {
      console.log('clear()')
      this.table = null
    }
  },
  watch: {
    $route () {
      if (this.$route.query['table']) {
        this.table = this.$route.query.table
      }
    }
  },
  components: {
    postsummary: PostSummary
  }
}
</script>

<style lang="sass" scoped>
  #expo
    padding: 10px

  .box-card
    // width: 236px // 13.5rem
    height: 120px // 12.5em
    text-align: left
    margin: 0.5em
    cursor: pointer

</style>
