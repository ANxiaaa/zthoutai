import Vue from 'vue'
import App from './App'
import router from './router'
import api from './http'
import i18n from './i18n'
import store from './store'
import global from '@/utils/global'

// 引入框架
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/css/font-awesome.min.css'
import '@/assets/iconfont/iconfont.css'
import { runInContext } from 'vm'

//富文本编辑
import { quillEditor } from 'vue-quill-editor' //调用编辑器
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import ImageResize from 'quill-image-resize-module' //调节图片大小
Quill.register('modules/imageResize', ImageResize)


Vue.use(ElementUI)
Vue.use(api)
Vue.use(quillEditor)
Vue.component('quillEditor', quillEditor)

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