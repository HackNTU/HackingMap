<template>
  <div id="app">
    <!-- <img id="logo" src="./assets/logo.png"> -->
    <h1>{{ msg }}</h1>
    <x-audio ref="xAudio" :audio-src="audioSrc"></x-audio>
    <select v-model="locale">
      <option v-for="option in select.locale" v-bind:value="option">
        {{ option }}
      </option>
    </select>
    <select v-model="gender">
      <option v-for="option in select.gender" v-bind:value="option">
        {{ option }}
      </option>
    </select>
    <!-- <a :href="audioSrc" download>Download</a> -->
    <a :href="audioSrc" target="_blank" download="audio">Download</a>
    <p></p>
    <textarea v-model="text" style="width:500px;height:100px;"></textarea>
  </div>
</template>
<script>
 /* eslint-disable */
import xAudio from '@/components/x-audio.vue'
import _ from 'lodash'
import Airtable from 'airtable'
var base = new Airtable({
    apiKey: 'keyTOhP8DLjUFtOFz',
  })
  .base('appcs0kkOF4h36C7J');
export default {
  name: 'speaker',
  created() {
    this.getRequest()
    let requestTimer = setInterval(() => {
      if (this.playList.length === 0)
        this.getRequest()
    }, 10000)
    let playTimer = setInterval(() => {
      this.checkPlay()
    }, 1000)
    console.log(this.$refs.xAudio)
  },
  data() {
    return {
      msg: 'HackNTU Minor Hackathon Broadcast System',
      translatorUrl: 'http://www.bing.com/translator/api/language/Speak?',
      locale: 'zh-CN',
      gender: 'Male',
      media: 'audio/mp3',
      text: '測試',
      select: {
        locale: ['zh-CN', "zh-HK", "zh-TW", "en-US", "en-AU", "en-CA", "en-GB", "en-IN"],
        gender: ['Male', 'Female'],
      },
      request: [],
      playList: [],
      playing: false,
      checkTime: '',
    }
  },
  computed: {
    audioSrc() {
      return this.translatorUrl + 'locale=' + this.locale + '&' + 'gender=' + this.gender + '&' + 'media=' + this.media + '&' + 'text=' + this.text;
    },
    allowed() {
      return _.filter(this.request, (record) => {
        return record['已審核'] && !record['已播放']
      });
    },
  },
  watch: {
    playList() {
      if (this.playList.length > 0) {
        // this.playing = true
        let play = this.playList.shift()
        console.log(play)
        this.text = play['廣播內容']
        this.played(play.id)
        this.$nextTick(() => {
          this.$refs.xAudio.play()
        })
      }
    }
  },
  methods: {
    played(rid) {
      base('廣播').update(rid, {
        "已播放": true
      }, function(err, record) {
        if (err) {
          console.error(err);
          return;
        }
        console.log('已播放', record.get('標題'), record.get('廣播內容'), record.get('已播放'));
      });
    },
    checkPlay() {
      console.log('checkPlay()')
      let now = new Date()
      let play = _.filter(this.allowed, (record) => {
        let playTime = new Date(record['播放時間'])
        this.checkTime = now.toLocaleTimeString() + ' | ' + playTime.toLocaleTimeString()
        let sameDate = now.toLocaleDateString() === playTime.toLocaleDateString()
        let sameTime = now.toLocaleTimeString() === playTime.toLocaleTimeString()
        return sameTime && sameTime;
      })
      this.playList = this.playList.concat(play)
    },
    getRequest() {
      console.log('getRequest()')
      let request = []
      base('廣播').select({
        // Selecting the first 100 records in Main View:
        maxRecords: 10,
        view: "Main View",
      }).eachPage(function page(records, fetchNextPage) {
        // This function (`page`) will get called for each page of records.
        request = request.concat(_.map(records, (record) => _.set(record.fields, 'id', record.id)));
        // To fetch the next page of records, call `fetchNextPage`.
        // If there are more records, `page` will get called again.
        // If there are no more records, `done` will get called.
        fetchNextPage();
      }, (err) => { // function done(err)
        if (err) {
          console.error(err);
          return;
        }
        // console.log(request)
        this.request = request
      });
    },
  },
  components: {
    'x-audio': xAudio,
  },
}
</script>
<style scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
#logo {
  max-height: 100px;
}
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
input {
  display: inline;
}
x-audio {
  display: inline;
}
</style>
