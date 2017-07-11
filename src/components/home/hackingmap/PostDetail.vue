<template>
  <section class="post-detail" id="wrap">

    <p class="mb05">{{ post.desc }}</p>
    <p class="mb05">
      <span><icon name="link"></icon>
        共編/作品:
        <a :href="post.iframe" target="_blank">{{ post.iframe || 'N/A'}}</a>
      </span>
      &nbsp;&nbsp;&nbsp;
      <span><icon name="github"></icon>
        GitHub:
        <a  v-if="post.git" :href="'https://github.com/' + post.git" target="_blank">{{ post.git }}</a>
        <span v-else>N/A</span>
      </span>
    </p>
    <iframe :src="post.iframe || default_iframe" id="iframe" frameborder="0"></iframe>

  </section>
</template>

<script>
export default {
  name: 'postdetail',
  data () {
    return {
      default_iframe: 'https://bit.ly/hackingmap_get_started'
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

.mb05
  margin-top: 0
  margin-bottom: 0.5em

svg
  position: relative
  top: 0.2em

#wrap
  position: fixed
  left: 0
  width: 100%
  top: 8%
  height: 92%

#iframe
  outline: 1px solid Grey
  width: 100%
  height: 100%
</style>
