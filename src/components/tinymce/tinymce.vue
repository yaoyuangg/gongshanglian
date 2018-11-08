<template>
  <editor :id='id'
  v-model='tinymceHtml'
  :init='init'></editor>
</template>

<script>
import {APP_CONSTANT} from '../../../static/js/app.constant'
import $ from 'jquery'
import tinymce from 'tinymce/tinymce'
import Editor from '@tinymce/tinymce-vue'
import 'tinymce/themes/modern/theme'
import 'tinymce/plugins/paste'
import 'tinymce/plugins/image'
import 'tinymce/plugins/link'
import 'tinymce/plugins/code'
import 'tinymce/plugins/table'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/contextmenu'
import 'tinymce/plugins/wordcount'
import 'tinymce/plugins/colorpicker'
import 'tinymce/plugins/textcolor'
// import func from './vue-temp/vue-editor-bridge';

// var EDITOR = null
// var tinymceEditor = null
export default {
  props: {
    id: {
      type: String
    },
    value: {
      default: '',
      type: String
    },
    config: {
      type: Object,
      default: () => {
        return {
          theme: 'modern',
          height: 300
        }
      }
    },
    isInput: {
      type: Boolean,
      required: true
    },
    setting: {}
  },
  components: {Editor},
  watch: {
    tinymceHtml: function (n, o) {
      // console.log(this.tinymceHtml)
      this.$emit('tinymceHtml', this.tinymceHtml)
    },
    value: function (n, o) {
      // console.log(n)
      this.tinymceHtml = n
    }
  },
  data: function () {
    return {
      tinymceHtml: this.value,
      init: {
        language_url: './static/tinymce/zh_CN.js',
        language: 'zh_CN',
        skin_url: './static/tinymce/skins/lightgray',
        height: 300,
        plugins: 'link lists image code table colorpicker textcolor wordcount contextmenu',
        toolbar:
          'bold italic underline strikethrough | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote | undo redo | link unlink image code | removeformat',
        branding: false,
        // image_advtab: true, // 开启图片上传的高级选项功能
        table_default_styles: {
          width: '100%',
          borderCollapse: 'collapse'
        },
        image_title: false, // 是否开启图片标题设置的选择，这里设置否
        automatic_uploads: true, // 开启点击图片上传时，自动进行远程上传操作
        images_upload_handler: (blobInfo, success, failure) => { // 图片异步上传处理函数
          console.log(blobInfo.blob())
          var formData = new FormData()
          // return 123
          console.log(this)
          formData.append('uploadFile', blobInfo.blob(), blobInfo.filename())
          // that.productInfo.picture = '加载中'
          $.ajax({
            url: APP_CONSTANT.API_HOST + '/product/addPicture',
            type: 'POST',
            data: formData,
            cache: false,
            contentType: false,
            processData: false, // 序列化处理
            beforeSend: function (XMLHttpRequest) {
              XMLHttpRequest.setRequestHeader('authorization', localStorage.getItem('GSLAuthorization'))
            },
            success (res) {
              if (res.code === 200) {
                success('https://cs.royalsecurity.cn/test/' + res.data.url)
                // console.log(that.productInfo)
              }
            },
            error (res) {
            }
          })
        }
      }
    }
  },
  methods: {
  },
  mounted: function () {
    // console.log(this.value)
    tinymce.init({})
  },
  beforeDestroy: function () {
    // 销毁tinymce
    this.$emit('on-destroy')
    window.tinymce.remove('#tinymce')
    // tinymce.get(this.id).destroy()
  }
}
</script>
