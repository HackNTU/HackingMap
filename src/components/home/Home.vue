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
  display: flex
  flex-flow: row nowrap
  height: 100%

.hackingmap
  flex: 7 0px

.chat
  flex: 3 0px

// Hide Chat in tablet/modile
@media screen and (max-width: 768px)
  .chat
    display: none

</style>
