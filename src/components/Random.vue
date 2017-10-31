<template>
  <b-container>
    <h1>
        <icon name="language" scale="5"></icon>
    </h1>
    <h2><span v-html="form.originalTitle"></span> <icon name="long-arrow-right"></icon> <span v-html="form.translatedTitle"></span></h2>
    <hr />
    <b-form>
      <b-row>
        <b-col>
          <b-form-group id="originalGroup"
                         label-for="originalText">
            <b-form-textarea id="originalText"
                           v-model="form.originalText"
                             :rows="20"
                             @input="onRandomTranslate"
                             placeholder="Мәтінді енгізіңіз..."
            ></b-form-textarea>
          </b-form-group>
        </b-col>
        <b-col>
          <b-form-group id="translatedGroup"
                         label-for="translatedText">
            <b-form-textarea id="translatedText"
                           v-model="form.translatedText"
                             :rows="20"
            ></b-form-textarea>
          </b-form-group>
        </b-col>
      </b-row>
      <hr />
      <b-row class="text-center" v-if="form.shareLink">
        <b-col>
          <a :href="form.shareLink">{{form.originalTitle}}</a>
          <br />
        </b-col>
      </b-row>
    </b-form>
  </b-container>
</template>

<script>
import 'vue-awesome/icons/language'
import 'vue-awesome/icons/long-arrow-right'
import 'vue-awesome/icons/question-circle'
import Icon from 'vue-awesome/components/Icon'
import {mapping} from './../api/mapping'
import {translate} from './../api/translate'
export default {
  name: 'Random',
  components: {
    Icon
  },
  data () {
    return {
      form: {
        originalText: '',
        translatedText: '',
        originalTitle: '',
        translatedTitle: '',
        shareLink: ''
      },
      systemMapping: mapping
    }
  },
  created () {
    this.onRandomTranslate()
  },
  mounted () {
    if (this.$route.query.id) {
      this.getPage(this.$route.query.id)
    } else {
      this.getRandom().then((pageId) => {
        this.getPage(pageId)
      })
    }
  },
  methods: {
    onRandomTranslate () {
      this.form.translatedText = ''
      this.form.translatedText = translate(this.systemMapping, this.form.originalText, this.form.translatedText)
    },
    getRandom () {
      return fetch('https://kk.wikipedia.org/w/api.php?action=query&list=random&format=json&rnnamespace=0&rnlimit=1&origin=*').then((response) => {
        let result = response.json()
        return result.then((json) => {
          return json.query.random[0].id
        })
      })
    },
    getPage (pageId) {
      return fetch('https://kk.wikipedia.org/w/api.php?action=parse&format=json&origin=*&pageid=' + pageId).then((response) => {
        return response.json()
      }).then((data) => {
        this.form.originalTitle = data.parse.title
        this.form.translatedTitle = translate(this.systemMapping, data.parse.title, this.form.translatedTitle)
        let tmp = document.createElement('div')
        tmp.innerHTML = data.parse.text['*']
        let text = tmp.textContent || tmp.innerText || ''
        this.form.originalText = text
        this.form.translatedText = translate(this.systemMapping, text, this.form.translatedText)
        this.form.shareLink = 'https://kk.wikipedia.org/wiki/' + this.form.originalTitle
        this.$router.push({name: 'random', query: {id: pageId}})
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
  text-align: center;
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
</style>
