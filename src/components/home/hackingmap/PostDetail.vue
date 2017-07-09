<template>
  <section class="post-detail">

    <p>status: {{ post.status }}</p>
    <p>author: {{ post.author }}</p>
    <p>table: {{ post.table }}</p>
    <p>heartCount: {{ post.heartCount }}</p>
    <p>desc: {{ post.desc }}</p>
    <p>iframe: {{ post.iframe }}</p>
    <p>git: {{ post.git }}</p>
    <p>name: {{ post.name }}</p>
    <p>starCount: {{ post.starCount }}</p>
    <p>stars: {{ post.stars }}</p>
    <p>tags: {{ post.tags }}</p>
    <p>teammate: {{ post.teammate }}</p>
    <p>timestamp: {{ post.timestamp }}</p>
    <p>uid: {{ post.uid }}</p>
    <p>version: {{ post.version }}</p>
    <iframe :src="post.iframe"></iframe>

  </section>
</template>

<script>
export default {
  name: 'postdetail',
  data () {
    return {
      iframe: 'https://bit.ly/hackingmap_starter'
    }
  },
  props: {
    post: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="sass" scoped>
.post-detail
  text-align: left
</style>
