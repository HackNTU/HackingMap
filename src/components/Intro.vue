<template lang="html">
  <section class="intro">
    <div class="wrap">
      <div class="loading-bg scroll-wrapper">
        <iframe
          id="intro-iframe"
          :src="url"
          @load="isLoaded = true"
          v-show="isLoaded"
          width="100%"
          height="100%">
        </iframe>
      </div>
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
    height: 45vh
  .loading-bg
    background:url(../assets/loading.gif) center center no-repeat
  .warp, #intro-iframe

  .scroll-wrapper
    border: 1px dashed Grey
    position: fixed
    right: 0
    bottom: 4.5em
    left: 0
    top: 4.5em
    -webkit-overflow-scrolling: touch
    overflow-y: scroll

  .scroll-wrapper iframe
    border: 1px solid LightGrey
    height: 100%
    width: 100%

</style>
