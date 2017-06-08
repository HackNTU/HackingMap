<template>
  <div class="counter">

    <h1>{{ msg }}</h1>
    <p>reverseMsg: {{ reverseMsg }}</p>
    <div>{{ count }}</div>
    <button @click="increment">++</button>
    <button @click="decrement">--</button>
    <button @click="add(10)">+=10</button>

  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'counter',
  data () {
    return {
      msg: 'counter.vue'
    }
  },
  computed: {
    reverseMsg (state) {
      return this.msg.split('').reverse().join('')
    },
    ...mapState({
      count: state => state.count
    })
  },
  methods: {
    increment () {
      this.$store.commit('increment')
    },
    decrement () {
      this.$store.commit('decrement')
    },
    add (n) {
      this.$store.commit({
        type: 'add',
        amount: n
      })
    },
    incrementAsync () {
      this.$store.dispatch('incrementAsync')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="sass" scoped>
.counter
  background-color: Yellow
</style>
