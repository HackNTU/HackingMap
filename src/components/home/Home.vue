<template>
  <div class="home">

    <hackingmap @loaded="$emit('loaded')"></hackingmap>

    <span class="right">
      <announcement></announcement>
      <schedule></schedule>
    </span>

  </div>
</template>

<script>
import HackingMap from '@/components/home/HackingMap.vue'
import Announcement from '@/components/home/Announcement.vue'
import Schedule from '@/components/home/Schedule.vue'
export default {
  name: 'home',
  data () {
    return {

    }
  },
  components: {
    hackingmap: HackingMap,
    announcement: Announcement,
    schedule: Schedule
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
  flex: 80 0px

.right
  flex: 20 0px
  display: flex
  flex-flow: column nowrap
  height: 100%

// Hide Chat in tablet/modile
@media screen and (max-width: 768px)
  .right
    display: none

</style>
