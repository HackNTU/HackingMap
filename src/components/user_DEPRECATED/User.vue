<template>
  <div class="user">

    <h3>User.vue</h3>
    <router-view id="rv"></router-view>

  </div>
</template>
<script>
export default {
  name: 'user'
}
</script>
<style lang="sass" scoped>
@import "../../style_config.sass"

.user
  border: 1px dashed green
  position: fixed
  top: $nav_height
  right: 0
  bottom: $footer_height
  left: 0
  overflow-y: scroll
</style>
