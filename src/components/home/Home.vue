<template>
  <div class="home">

    <hackingmap></hackingmap>
    <chat></chat>

  </div>
</template>

<script>
import HackingMap from '@/components/home/HackingMap.vue'
import Chat from '@/components/home/Chat.vue'
export default {
  name: 'home',
  data () {
    return {

    }
  },
  components: {
    hackingmap: HackingMap,
    chat: Chat
  }
}
</script>
s
<style lang="sass" scoped>
@import "../../style_config.sass"

.home
  position: fixed
  top: $nav_height
  right: 0
  bottom: $footer_height
  left: 0
  display: flex

.hackingmap
  width: 70vw

.chat
  width: 30vw
</style>
