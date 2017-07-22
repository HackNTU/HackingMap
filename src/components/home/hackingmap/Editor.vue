<template lang="html">
  <div class="editor">

    <!-- <code>[dev] you are editing {{ postkey }}</code> -->

    <el-form
      :model="newPost"
      :rules="rules"
      ref="newPost"
      label-position="top"
      label-width="100px"
    >
    <el-row :gutter="20" v-loading="loadingUpdate">
        <el-col :span="12">


          <el-row :gutter="10">
            <el-col :span="12">
              <!-- 專案名 -->
              <el-form-item label="專案名" prop="name">
                <el-input v-model.lazy="newPost.name" placeholder="3至15字元" width="100%" size="small"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <!-- 桌號 -->
              <el-form-item label="桌號" prop="table">
                <el-select v-model.lazy="newPost.table" placeholder="請選擇目前所在桌號" size="small">
                  <el-option label="尋找中" value="0"></el-option>
                  <el-option v-for="i in tables" :label="i + '桌'" :value="i" :key="i" v-if="i !== '0'"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="參與企業獎意願（至多2個，調查至3pm截止，詳細流程：https://goo.gl/oWutMs）" prop="awards">
            <!-- <el-tooltip effect="dark" placement="top" :visible-arrow="true"> -->
              <!-- <div slot="content" v-html="awardsTooltip"></div> -->
              <el-checkbox-group
                v-model="newPost.awards"
                :min="0"
                :max="2">
                <el-checkbox v-for="awardOpt in awardOptions" :label="awardOpt" :key="awardOpt" :disabled="awardsDisable">{{awardOpt}}</el-checkbox>
              </el-checkbox-group>
            <!-- </el-tooltip> -->
          </el-form-item>

          <!-- 提案人 -->
          <el-row>
            <el-col :span="7">

              <el-form-item label="與會者編號" prop="host">
                <el-tooltip effect="dark" placement="top" :visible-arrow="true" content="格式：#999">
                  <el-input size="mini" v-model.lazy="newPost.host" style="width:100%" placeholder="提案人"></el-input>
                </el-tooltip>
              </el-form-item>

            </el-col>
            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="16">
              <!-- <el-tooltip effect="dark" placement="top" :visible-arrow="true" content="格式：#123, #456, #789">
                <el-input size="small" v-model="newPost.teammates_str" style="width:100%" placeholder="專案成員"></el-input>
              </el-tooltip> -->

              <!-- 專案成員 -->
              <el-form-item label="專案成員" prop="teammates">
                <el-tag :key="teammate" v-for="teammate in newPost.teammates" :closable="true" type="gray" :close-transition="false" @close="handleDeleteTeammate(teammate)"
                >{{teammate}}</el-tag>
                <el-input class="input-new-tag"
                  v-if="inputVisibleTeammate"
                  v-model.lazy="inputNewTeammate"
                  ref="saveTeammateInput"
                  size="mini"
                  v-show="!newPost.teammates || newPost.teammates.length < 15"
                  @keypress.enter.native="handleNewTeammateConfirm"
                  @blur="handleNewTeammateConfirm"></el-input
                >
                <el-button v-else
                  class="button-new-tag"
                  size="mini"
                  @click="showNewTeammateInput"
                  v-show="!newPost.teammates || newPost.teammates.length < 15"
                >+ 新增成員</el-button>
              </el-form-item>

            </el-col>
          </el-row>

          <!-- 專案聯絡方式 -->
          <el-form-item label="專案聯絡方式（公開）" prop="contact">
            <el-input v-model.lazy="newPost.contact" style="width:100%" placeholder="Discord ID, 臉書, email等，自由選填，多筆請以逗號分隔"></el-input>
          </el-form-item>

          <!-- 標籤 -->
          <el-form-item label="標籤" prop="tags">
            <el-tag
              :key="tag"
              v-for="tag in newPost.tags"
              :closable="true"
              type="gray"
              :close-transition="false"
              @close="handleDeleteTag(tag)"
            >{{tag}}</el-tag>
            <template v-if="inputVisible">
              <el-tooltip
                effect="dark"
                :value="tagListTooltip.length > 0"
                placement="right-start"
                :visible-arrow="true"
              >
                <div slot="content" v-html="tagListTooltip"></div>
                <el-input class="input-new-tag"
                  v-model.lazy="inputNewTag"
                  ref="saveTagInput"
                  size="mini"
                  v-show="!newPost.tags || newPost.tags.length < 3"
                  @keypress.enter.native="handleNewTagConfirm"
                  @blur="handleNewTagConfirm"
                >
                </el-input>
              </el-tooltip>
            </template>
            <el-button v-else
              class="button-new-tag"
              size="mini"
              @click="showNewTagInput"
              v-show="!newPost.tags || newPost.tags.length < 3"
            >+ 新增標籤</el-button>
          </el-form-item>

          <!-- 專案狀態 -->
          <el-form-item label="進度狀態" prop="status">
            <el-radio-group v-model.lazy="newPost.status">
              <el-radio label="徵人"></el-radio>
              <el-radio label="趕工"></el-radio>
              <el-radio label="完工"></el-radio>
              <el-radio label="放棄"></el-radio>
            </el-radio-group>
          </el-form-item>

          <!-- 企業獎 -->
          <el-form-item label="企業獎" prop="award" v-show="false">
            <el-radio-group v-model.lazy="newPost.award">
              <el-radio label="無"></el-radio>
              <el-radio label="中信金控"></el-radio>
              <el-radio label="北市交通局"></el-radio>
              <el-radio label="微軟"></el-radio>
              <el-radio label="HITCON"></el-radio>
              <el-radio label="經濟部"></el-radio>
              <el-radio label="農委會"></el-radio>
              <el-radio label="威盛電子"></el-radio>
            </el-radio-group>
          </el-form-item>

        </el-col>
        <el-col :span="12">

          <!-- 100字簡介 -->
          <el-form-item :label="wordCountMsg" prop="desc">
            <el-input type="textarea" v-model.lazy="newPost.desc" width="20rem"
              placeholder="請簡要介紹專案內容（100字以內，約前30字會顯示於卡片預覽）">
            </el-input>
          </el-form-item>

          <!-- GitHub  -->
          <el-form-item label="GitHub" prop="git">
            <el-input v-model.lazy="newPost.git" placeholder="john666/my-project" class="url">
              <template slot="prepend">github.com/</template>
            </el-input>
          </el-form-item>

          <!-- 專案介紹/共編URL（專案頁面顯示） -->
          <!-- <el-form-item label="專案介紹/共編URL（內嵌於專案頁面）" prop="iframe"> -->
          <el-form-item label="專案介紹 URL" prop="iframe">
            <el-input
              v-model.lazy="newPost.iframe"
              class="url"
              @change="loadIframe = false; isLoadingIframe = false"
              placeholder="請輸入可預覽之網頁網址（下方可測試）">
            </el-input>
          </el-form-item>

          <!-- iframe預覽顯示區 -->
          <el-form-item>
            <el-card class="box-card" :body-style="{ padding: '0px' }">
              <el-button
                @click="loadIframe = true; isLoadingIframe = true"
                v-if="!loadIframe"
              >測試 URL 預覽</el-button>
              <div v-if="isLoadingIframe" v-loading="true">
                &nbsp;<br>&nbsp;<br>&nbsp;<br>
              </div>
              <iframe
                v-if="loadIframe"
                :src="newPost.iframe"
                width="100%" height="100%"
                v-show="!isLoadingIframe"
                @load="isLoadingIframe = false"
              ></iframe>
            </el-card>
            <span>已知支援預覽：
              <a target="_blank" href="https://hackmd.io/new">HackMD</a>、
              <a target="_blank" href="https://www.google.com.tw/intl/zh-TW/docs/about/">Google Doc</a>、
              <a target="_blank" href="https://www.youtube.com/">YouTube</a>
            </span>
          </el-form-item>

        </el-col>
    </el-row>
    <el-row type="flex" class="row-bg" justify="end">
      <el-col :span="24">

        <!-- 更新按鈕 -->
        <div align=right>
          <el-button type="primary" @click="submitForm('newPost')">更新</el-button>
          <el-button @click="$emit('cancel')">取消</el-button>
        </div>

      </el-col>
    </el-row>
  </el-form>

  </div>
</template>

<script>
import appconfig from '@/appconfig'
import { FirebaseApp } from '@/service/firebase.js'

const db = FirebaseApp.database()
const AWARDS = ['北市交通局', 'HITCON', '經濟部', '中信Jarvis', '中信資料家', '農委會', '威盛OLAMI', '微軟']

export default {
  name: 'editor',
  data () {
    return {
      tables: Object.keys(appconfig.map.table_coor),
      awardOptions: AWARDS,
      awardsTooltip: '僅供初步線上調查，若超出20組上線將再調整。<br/>調查填寫至3pm止，3-4pm收紙本報名，6pm前<br/>公告確認錄取組別。',
      awardsDeadline: 'Sat Jul 22 2017 15:00:00 GMT+0800 (CST)',
      awardsDisable: false,
      newPost: {
        name: null,
        host: '',
        contact: '',
        desc: null,
        iframe: null,
        git: '',
        table: null,
        status: null,
        tags: [],
        teammates: [],
        awards: []
        // teammates_str: ''
      },
      rules: {
        name: [
          { required: true, message: '請輸入專案名稱', trigger: 'blur' },
          { min: 3, max: 15, message: '需介於 3 到 15 個字元', trigger: 'blur' }
        ],
        // host: [
        //   { required: true, message: '請輸入提案人之與會者編號', trigger: 'blur' },
        //   { min: 4, max: 4, message: '格式為 `#999`', trigger: 'blur' }
        // ],
        table: [
          { required: true, message: '請選擇專案所在位置', trigger: 'change' }
        ],
        status: [
          { required: true, message: '請選擇專案目前狀態', trigger: 'change' }
        ],
        award: [
          { required: true, message: '請選擇是否參與企業獎', trigger: 'change' }
        ],
        desc: [
          { required: true, message: '需介於 1 到 100 個字元', trigger: 'blur' },
          { min: 1, max: 100, message: '需介於 1 到 100 個字元', trigger: 'change' }
        ]
      },
      inputNewTag: '',
      inputNewTeammate: '#',
      inputVisible: false,
      inputVisibleTeammate: false,
      isLoading: true,
      isLoadingIframe: false,
      loadIframe: false,
      loadingUpdate: false,
      tagList: ['資訊安全', '公民參與', '開放資料', '機器學習', '社群', '社會服務', '物聯網', '資料分析', '消費者', '資料視覺化', '數位人文', '人工智慧', '虛擬實境', '教育', '金融']
    }
  },
  props: {
    postData: {
      type: Object,
      required: true
    }
  },
  computed: {
    postKey () {
      return this.postData['.key']
    },
    tagListTooltip () {
      return this.tagList
      .filter((f) => f.indexOf(this.inputNewTag) > -1)
      .toString()
      .replace(/,/g, '<br/>')
    },
    wordCountMsg () {
      return this.newPost.desc ? `專案簡介 (${this.newPost.desc.length}/100字)` : '專案簡介 (0/100字)'
    }
  },
  mounted () {
    this.restoreForm(this.postData)

    // Check `awards` field availability every 3 if it's before deadline.
    if (!this.isAfterDeadline()) {
      setInterval(() => {
        this.awardsDisable = this.isAfterDeadline()
      }, 3000)
    }
  },
  methods: {

    isAfterDeadline () {
      console.log('[Editor] isAfterDeadline: ', new Date() > new Date(this.awardsDeadline))
      return new Date() > new Date(this.awardsDeadline)
    },

    restoreForm (postData) {
      console.log('[Editor] 載入post舊資料', postData.name)
      this.newPost.name = postData.name
      this.newPost.host = postData.host || ''
      this.newPost.contact = postData.contact || ''
      // this.newPost.teammates_str = postData.teammates.toString() || ''
      this.newPost.desc = postData.desc || ''
      this.newPost.iframe = postData.iframe || ''
      this.newPost.git = postData.git || ''
      this.newPost.table = postData.table || ''
      this.newPost.status = postData.status || ''
      this.newPost.award = postData.award || ''
      this.newPost.tags = postData.tags || []
      this.newPost.teammates = postData.teammates || []
      this.newPost.awards = postData.awards || []
      this.isLoading = false
    },

    submitForm (formName) {
      // Validate fields
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitPost()
        } else {
          this.$message.error({message: '資料格式不全'})
          return false
        }
      })
    },

    submitPost () {
      this.loadingUpdate = true
      // this.newPost.teammates = this.newPost.teammates_str.split(',')
      let p = this.newPost
      let promise = this.updatePostForCurrentUser(this.postKey, p.name, p.host, p.contact, p.desc, p.iframe, p.git, p.table, p.status, p.award, p.tags, p.teammates, p.awards)
      promise.then(() => {
        this.loadingUpdate = false
        this.$message({message: '更新成功', type: 'success'})
        this.$emit('cancel')
        console.log('[Editor.vue] post成功更新', this.postkey)
      }).catch((err) => {
        this.loadingUpdate = false
        this.$message.error('更新發生錯誤' + err.message)
      })
    },

    updatePostForCurrentUser (postKey, name, host, contact, desc, iframe, git, table, status, award, tags, teammates, awards) {
      let u = FirebaseApp.auth().currentUser
      if (!u.uid || !postKey) {
        throw new Error('Invalid currentUser or postkey', u, postKey)
      } else {
        let updates = {}
        const path1 = '/posts/' + postKey + '/'
        const path2 = '/user-posts/' + u.uid + '/' + postKey + '/'
        updates[path1 + 'name'] = name
        updates[path2 + 'name'] = name
        updates[path1 + 'host'] = host
        updates[path2 + 'host'] = host
        updates[path1 + 'contact'] = contact
        updates[path2 + 'contact'] = contact
        updates[path1 + 'desc'] = desc
        updates[path2 + 'desc'] = desc
        updates[path1 + 'iframe'] = iframe
        updates[path2 + 'iframe'] = iframe
        updates[path1 + 'git'] = git.replace('https://github.com/', '')
        updates[path2 + 'git'] = git.replace('https://github.com/', '')
        updates[path1 + 'table'] = (Number(table) > 105 ? '0' : table)
        updates[path2 + 'table'] = (Number(table) > 105 ? '0' : table)
        updates[path1 + 'status'] = status
        updates[path2 + 'status'] = status
        updates[path1 + 'award'] = award
        updates[path2 + 'award'] = award
        updates[path1 + 'tags'] = tags
        updates[path2 + 'tags'] = tags
        updates[path1 + 'teammates'] = teammates
        updates[path2 + 'teammates'] = teammates
        updates[path1 + 'awards'] = awards
        updates[path2 + 'awards'] = awards
        updates[path1 + 'timestamp'] = new Date()
        updates[path2 + 'timestamp'] = new Date()

        return db.ref().update(updates)
      }
    },

    // ElmentUI tags utils
    handleDeleteTag (tag) {
      this.newPost.tags.splice(this.newPost.tags.indexOf(tag), 1)
    },
    handleDeleteTeammate (teammate) {
      this.newPost.teammates.splice(this.newPost.teammates.indexOf(teammate), 1)
    },
    showNewTagInput () {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    showNewTeammateInput () {
      this.inputVisibleTeammate = true
      this.$nextTick(_ => {
        this.inputNewTeammate = '#'
        this.$refs.saveTeammateInput.$refs.input.focus()
      })
    },
    handleNewTagConfirm () {
      let inputNewTag = this.inputNewTag
      if (inputNewTag) {
        this.newPost.tags.push(inputNewTag.slice(0, 10))
      }
      this.inputVisible = false
      this.inputNewTag = ''
    },
    handleNewTeammateConfirm () {
      let inputNewTeammate = this.inputNewTeammate
      if (inputNewTeammate) {
        this.newPost.teammates.push(inputNewTeammate.slice(0, 4))
      }
      this.inputVisibleTeammate = false
      this.inputNewTeammate = ''
    }
  }
}
</script>

<style lang="sass" scoped>
.editor
  text-align: left
  .url
    width: 100%
  .input-new-tag, .button-new-tag
    width: 5rem
  .el-tag
    margin-left: 4px
</style>
