<template lang="html">
  <section class="intro">
    <div class="wrap loading-bg">
      <iframe
        :src="url"
        @load="isLoaded = true"
        v-show="isLoaded"
        width="100%"
        height="100%">
      </iframe>
    </div>
  </section>
</template>

<script>
export default {
  name: 'intro',
  data () {
    return {
      url: 'https://hackmd.io/s/H1_0-tkBZ',
      isLoaded: false
    }
  }
}
</script>

<style lang="sass">
  .wrap
    height: 50vh
  .loading-bg
    background:url(../assets/loading.gif) center center no-repeat
</style>
