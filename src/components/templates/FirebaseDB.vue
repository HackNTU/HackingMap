<template>
  <div class="firebasedb">

    <pre>anObject: {{ anObject }}</pre>
    <ul>
      anArray:<li v-for="item in anArray">{{ item.text }}</li>
    </ul>

  </div>
</template>

<script>
import { db } from '@/service/firebase'
export default {
  name: 'firebasedb',
  data () {
    return {
      item: ''
    }
  },
  firebase () {
    return {
      // simple syntax, bind as an array by default
      anArray: db.ref('dummy/'),
      // can also bind to a query
      // anArray: db.ref('url/to/my/collection').limitToLast(25)
      // full syntax
      anObject: {
        source: db.ref('/'),
        // optionally bind as an object
        asObject: true,
        // optionally provide the cancelCallback
        cancelCallback: function (e) {
          console.log('cancelCallback():', e)
        },
        // this is called once the data has been retrieved from firebase
        readyCallback: function (r) {
          console.log('readyCallback()', r)
        }
      }
    }
  },
  created () {
    // console.log('push')
    // this.$firebaseRefs.anArray.push({
    //   text: Date(Date.now())
    // })
    var adaNameRef = db.ref('dummy/ada/name')
    adaNameRef.child('first').set('Ada')
    adaNameRef.child('last').set('Lovelace')
    adaNameRef.set({ first: 'Ada', last: 'Lovelace' })
      .then(function () {
        console.log('Synchronization succeeded')
      })
      .catch(function (error) {
        console.log('Synchronization failed', error)
      })
    // Same as the previous example, except we will also log a message
    // when the data has finished synchronizing.
  }
}
</script>

<style lang="sass" scoped>
</style>
