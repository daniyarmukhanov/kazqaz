<template>
  <b-container>
    <h1>
        <icon name="language" scale="5"></icon>
    </h1>
    <h2>Қазақ кирил әліпбиі <icon name="long-arrow-right"></icon> Qazaq latyn a'lipbi'i <a @click="showModal"><icon name="question-circle" scale="1.2"></icon></a></h2>
    <hr />
    <b-form @submit="onSubmit" @reset="onReset">
      <b-row>
        <b-col>
          <b-form-group id="originalGroup"
                         label-for="originalText">
            <b-form-textarea id="originalText"
                           v-model="form.originalText"
                             :rows="20"
                             @input="onSystemTranslate"
                             placeholder="Мәтінді енгізіңіз..."
            ></b-form-textarea>
          </b-form-group>
          <b-button block variant="outline-success">
            Аудару / Ay'dary'
          </b-button>
        </b-col>
        <b-col>
          <b-form-group id="translatedGroup"
                         label-for="translatedText">
            <b-form-textarea id="translatedText"
                           v-model="form.translatedText"
                             :rows="20"
            ></b-form-textarea>
          </b-form-group>
          <b-button block variant="outline-danger" @click="onReset">
            Тазу / Tazy'
          </b-button>
        </b-col>
      </b-row>
      <hr />
      <b-row class="text-center">
        <b-col>
          <b-button variant="link" @click="showInput">
            Өз нұсқаңызды ұсыныңыз / O'z nusqan'yzdy usynyn'yz
          </b-button>
        </b-col>
      </b-row>
    </b-form>
    <b-modal ref="modalCurrent" hide-footer title="Qazaq latyn a'lipbi'i">
      <b-row>
        <b-col>
          <table class="table table-bordered">
            <tr v-for="(key, letter, index) in systemMapping" :key="key" v-if="key && index % 2 == 0">
              <th>
                {{letter}}
              </th>
              <td>
                {{key}}
              </td>
            </tr>
          </table>
        </b-col>
        <b-col>
          <table class="table table-bordered">
            <tr v-for="(key, letter, index) in systemMapping" :key="key" v-if="key && index % 2 == 1">
              <th>
                {{letter}}
              </th>
              <td>
                {{key}}
              </td>
            </tr>
          </table>
        </b-col>
      </b-row>
      <b-btn class="mt-3" variant="outline-primary" block @click="hideModal">Жабу / Jaby'</b-btn>
    </b-modal>
    <b-modal ref="modalInput" hide-footer title="Qazaq latyn a'lipbi'i" size="lg">
      <b-alert show>
        Алфавиттің бұл нұсқасын пайдаланушы ұсынып, бекітілгеннен өзгеше
        <hr />
        Alfavi'tin' bul nusqasyn pai'dalany's'y usynyp, bekitilgenen o'zges'e
      </b-alert>
      <b-row v-if="form.shareLink">
        <b-col>
          <b-input type="text" v-model="form.shareLink"></b-input>
          <hr />
        </b-col>
      </b-row>
      <b-row>
        <b-col style="max-height: 600px; overflow-y: scroll;">
          <b-row>
            <b-col>
              <table class="table table-bordered table-small">
                <tr v-for="(key, letter, index) in userMapping" :key="index" v-if="index % 2 == 0" :class="checkMapping(letter) ? '' : 'table-warning'">
                  <th>
                    {{letter}}
                  </th>
                  <td>
                    <b-input type="text" :value="key" v-model="userMapping[letter]" @input="onUserTranslate" required></b-input>
                  </td>
                </tr>
              </table>
            </b-col>
            <b-col>
              <table class="table table-bordered table-small">
                <tr v-for="(key, letter, index) in userMapping" :key="index" v-if="index % 2 == 1" :class="checkMapping(letter) ? '' : 'table-warning'">
                  <th>
                    {{letter}}
                  </th>
                  <td>
                    <b-input type="text" :value="key" v-model="userMapping[letter]" @input="onUserTranslate" required></b-input>
                  </td>
                </tr>
              </table>
            </b-col>
          </b-row>
        </b-col>
        <b-col cols="6">
          <b-form-group id="originalGroup"
                        label-for="originalText">
            <b-form-textarea id="originalText"
                             v-model="form.originalUser"
                             :rows="9"
                             @input="onUserTranslate"
                             placeholder="Мәтінді енгізіңіз..."
            ></b-form-textarea>
          </b-form-group>
          <b-form-group id="translatedGroup"
                        label-for="translatedText">
            <b-form-textarea id="translatedText"
                             v-model="form.translatedUser"
                             :rows="9"
            ></b-form-textarea>
          </b-form-group>
          <b-btn class="mt-3" variant="outline-success" block @click="share">Бөлісіңіз / Bo'lisin'iz</b-btn>
          <b-btn class="mt-3" variant="outline-primary" block @click="hideInput">Жабу / Jaby'</b-btn>
        </b-col>
      </b-row>
    </b-modal>
  </b-container>
</template>

<script>
import 'vue-awesome/icons/language'
import 'vue-awesome/icons/long-arrow-right'
import 'vue-awesome/icons/question-circle'
import Icon from 'vue-awesome/components/Icon'
import {db} from './../api/firebase'
export default {
  name: 'Translator',
  components: {
    Icon
  },
  data () {
    return {
      form: {
        originalText: 'Абай Құнанбаев (1845—1904) — ақын, жазушы, қоғам қайраткері, қазіргі қазақ жазба әдебиетінің негізін салушы, либералды білімді исламға таяна отырып, орыс және еуропа мәдениетімен жақындасу арқылы қазақ мәдениетін жаңартуды көздеген реформатор',
        translatedText: '',
        originalUser: 'Абай Құнанбаев (1845—1904) — ақын, жазушы, қоғам қайраткері, қазіргі қазақ жазба әдебиетінің негізін салушы, либералды білімді исламға таяна отырып, орыс және еуропа мәдениетімен жақындасу арқылы қазақ мәдениетін жаңартуды көздеген реформатор',
        translatedUser: '',
        shareLink: null
      },
      systemMapping: {
        'А': 'A',
        'а': 'a',
        'Ә': 'A\'',
        'ә': 'a\'',
        'Б': 'B',
        'б': 'b',
        'Д': 'D',
        'д': 'd',
        'Е': 'E',
        'е': 'e',
        'Ф': 'F',
        'ф': 'f',
        'Г': 'G',
        'г': 'g',
        'Ғ': 'G\'',
        'ғ': 'g\'',
        'Х': 'H',
        'х': 'h',
        'Һ': 'H',
        'һ': 'h',
        'І': 'I',
        'і': 'i',
        'И': 'I\'',
        'и': 'i\'',
        'Й': 'I\'',
        'й': 'i\'',
        'Ж': 'J',
        'ж': 'j',
        'К': 'K',
        'к': 'k',
        'Л': 'L',
        'л': 'l',
        'М': 'M',
        'м': 'm',
        'Н': 'N',
        'н': 'n',
        'Ң': 'N\'',
        'ң': 'n\'',
        'О': 'O',
        'о': 'o',
        'Ө': 'O\'',
        'ө': 'o\'',
        'П': 'P',
        'п': 'p',
        'Қ': 'Q',
        'қ': 'q',
        'Р': 'R',
        'р': 'r',
        'С': 'S',
        'с': 's',
        'Ш': 'S\'',
        'ш': 's\'',
        'Ч': 'C\'',
        'ч': 'c\'',
        'Т': 'T',
        'т': 't',
        'Ұ': 'U',
        'ұ': 'u',
        'Ү': 'U\'',
        'ү': 'u\'',
        'В': 'V',
        'в': 'v',
        'Ы': 'Y',
        'ы': 'y',
        'У': 'Y\'',
        'у': 'y\'',
        'З': 'Z',
        'з': 'z',
        'Ь': '',
        'ь': '',
        'Я': 'I\'a',
        'я': 'i\'a'
      },
      userMapping: {}
    }
  },
  created () {
    this.onSystemTranslate()
  },
  mounted () {
    if (this.$route.query.keyboard || this.$route.query.text) {
      if (this.$route.query.text) {
        this.form.originalUser = this.$route.query.text
      }
      db.ref('mappings').child(this.$route.query.keyboard)
        .once('value')
        .then((snapshot) => {
          this.userMapping = JSON.parse(snapshot.val())
          this.showInput()
        })
    } else {
      this.userMapping = JSON.parse(JSON.stringify(this.systemMapping))
    }
  },
  methods: {
    onReset (evt) {
      this.form.originalText = ''
      this.form.translatedText = ''
    },
    onSubmit (evt) {
      evt.preventDefault()
      this.onSystemTranslate()
    },
    onSystemTranslate () {
      let current = ''
      let mapping = this.systemMapping
      this.form.translatedText = ''
      for (let i = 0; i < this.form.originalText.length; i++) {
        // Если символ найден в массиве то меняем его
        if (mapping[this.form.originalText[i]] !== undefined) {
          if (current !== mapping[this.form.originalText[i]]) {
            this.form.translatedText += mapping[this.form.originalText[i]]
            current = mapping[this.form.originalText[i]]
          }
        } else {
          this.form.translatedText += this.form.originalText[i]
          current = this.form.originalText[i]
        }
      }
    },
    onUserTranslate () {
      let current = ''
      let mapping = this.userMapping
      this.form.translatedUser = ''
      for (let i = 0; i < this.form.originalUser.length; i++) {
        // Если символ найден в массиве то меняем его
        if (mapping[this.form.originalUser[i]] !== undefined) {
          if (current !== mapping[this.form.originalUser[i]]) {
            this.form.translatedUser += mapping[this.form.originalUser[i]]
            current = mapping[this.form.originalUser[i]]
          }
        } else {
          this.form.translatedUser += this.form.originalUser[i]
          current = this.form.originalUser[i]
        }
      }
    },
    checkMapping (letter) {
      return this.systemMapping[letter] === this.userMapping[letter]
    },
    showModal () {
      this.$refs.modalCurrent.show()
    },
    hideModal () {
      this.$refs.modalCurrent.hide()
    },
    showInput () {
      this.onUserTranslate()
      this.$refs.modalInput.show()
    },
    hideInput () {
      this.$refs.modalInput.hide()
    },
    share () {
      let key = this.$firebaseRefs.mappings.push(JSON.stringify(this.userMapping)).key
      let query = { keyboard: key }
      if (this.form.originalText !== this.form.originalUser) {
        query.text = this.form.originalUser
      }
      this.$router.push({name: 'home', query})
      this.form.shareLink = window.location.href
    }
  },
  firebase: {
    mappings: db.ref('mappings')
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
