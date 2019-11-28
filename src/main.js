import Vue from 'vue'
import App from './App'
import router from './router'
import api from './http'
import i18n from './i18n'
import store from './store'
import global from '@/utils/global'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/css/font-awesome.min.css'
import '@/assets/iconfont/iconfont.css'
import { runInContext } from 'vm'

Vue.use(ElementUI)
Vue.use(api)

Vue.prototype.global = global

new Vue({
  el: '#app',
  i18n,
  router,
  store,
  methods:{
    getIconContent(){
      return new Promise((resolve, reject)=>{
        let link = document.getElementById('testCss');
        let xhr = new XMLHttpRequest();
        let data;
        xhr.open("GET", link.href)
        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4 && xhr.status === 200) {
            data = xhr.responseText
            resolve(data)
          }
        }
        xhr.send();
      })
    },
    getIconData(data){
      return new Promise((resolve, reject)=>{
        this.$api.backMenu.getIcon({
          iconCssContent: data
        }).then(res=>{
          resolve(res)
        })
      })
    },
    async runContext(){
      this.getIconContent()
      .then(res=>{
        return this.getIconData(res)
      })
      .then(res=>{
        this.$store.commit('setIconList', res.data)
      })
    }
  },
  beforeMount(){
    this.runContext()
  },
  render: h => h(App)
});