<template>
  <div>
    <audio ref="audio" :src="audioSrc" :autoplay="autoplay" controls>
      您的瀏覽器不支援 audio 標籤功能。
    </audio>
    <br>
    <!-- <button @click="play()">play</button> -->
    <!-- <button @click="pause()">pause</button> -->
    <button @click="toggleAutoplay()">toggle autoplay</button>
    <p v-show="autoplay">autoplay enabled</p>
  </div>
</template>
<script>
 /* eslint-disable */ 
export default {
  name: 'x-audio',
  props: {
    audioSrc: String,
  },
  data() {
    return {
      autoplay: false,
    }
  },
  computed: {
    audio() {
      // audio doc: https://www.w3schools.com/TAGs/ref_av_dom.asp
      return this.$refs.audio
    },
  },
  methods: {
    play() {
      this.audio.play()
    },
    pause() {
      this.audio.pause()
    },
    toggleAutoplay() {
      this.autoplay = !this.autoplay
    },
  }
}
</script>
<style>
</style>
