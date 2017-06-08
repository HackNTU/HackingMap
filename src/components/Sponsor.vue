<template>
  <div class="sponsor">

    <div class="flex-container">
      <h2>Sponsors</h2>
      <span v-for="s in sponsors" class="logo">
        <a :href="s.link" target="_blank"><img class="img-circle" :src="s.img" :alt="s.name"></a>
      </span>
    </div>

  </div>
</template>

<script>
import { VueFireDB } from '@/service/firebase'
let sponsorRef = VueFireDB.ref('sponsors')

export default {
  name: 'sponsor',
  data () {
    return {
      msg: 'Sponsor.vue'
    }
  },
  firebase: {
    sponsors: sponsorRef
  }
}
</script>

<style lang="sass" scoped>
@import "../style_config.sass"

.flex-container
  // border: 1px blue solid
  height: $footer_height - 1
  margin-top: auto
  margin-bottom: auto
  display: flex

.logo
  // border: 1px red solid
  // margin: 0.5em 0.1em

.img-circle
  // border: 1px solid lightGrey
  border-radius: 50%
  height: $footer_height*0.8
</style>
