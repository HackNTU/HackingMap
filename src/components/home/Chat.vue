<template>
  <div class="chat">

    <h1>{{ msg }}</h1>

    <el-button @click="visible = true" type="text">按钮</el-button>
    <!-- <el-dialog v-model="visible" title="Hello world">
      <p>欢迎使用 Element</p>
    </el-dialog> -->

  </div>
</template>

<script>
export default {
  name: 'chat',
  data () {
    return {
      msg: 'Chat.vue',
      visible: false
    }
  }
}
</script>

<style lang="sass" scoped>
@import "../../style_config.sass"

.chat
  background-color: $chat_bg_color
</style>
