<template>
  <div class="home">

    <hackingmap></hackingmap>
    <schedule></schedule>

  </div>
</template>

<script>
import HackingMap from '@/components/home/HackingMap.vue'
import Schedule from '@/components/home/Schedule.vue'
export default {
  name: 'home',
  data () {
    return {

    }
  },
  components: {
    hackingmap: HackingMap,
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
  flex: 7 0px

.schedule
  flex: 3 0px

// Hide Chat in tablet/modile
@media screen and (max-width: 768px)
  .schedule
    display: none

</style>
