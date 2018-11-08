<template>
  <div class="detailPages">
    <div class="container">
      <h1>导入excel表</h1>
      <div class="row uploadForm">
        <div class="row">
          <label for="file" class="btn btn-info">选择excel文件</label> {{name}}
        </div>
        <input id="file" class="form-control" @change="fileUpload" type="file" style="display: none"/>
        <div id="upload">
          <button id="upload1" type="button" @click="submit1()" class="btn btn-success">确认开票</button>
        </div>
      </div>

      <div class="result" v-show="resultShow">
        <div>结果:</div>
        <div>失败：  {{result.fail}} 张</div>
        <div>成功：  {{result.success}} 张</div>
        <div>总计：  {{result.total}} 张</div>
      </div>
    </div>
    <div class="tip" v-show="tipShow">
      正在加载中...
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import 'jquery.pagination/dist/jquery.pagination.css'
import 'jquery.pagination/dist/jquery.pagination'
import {APP_CONSTANT} from '../../../static/js/app.constant'
export default {
  name: 'detail',
  data () {
    return {
      tableInfos: [],
      name: null,
      result: {
        fail: 0,
        success: 0,
        total: 0
      },
      resultShow: false,
      tipShow: false
    }
  },
  mounted () {
  },
  methods: {
    fileUpload () {
      console.log('change')

      console.log($('#file')[0].value)
      if ($('#file')[0].files[0]) {
        this.name = $('#file')[0].files[0].name
      }
    },
    submit1 (data) { // 普通开票
      $('.alert').alert('close')
      if ($('#file')[0].files[0]) {
        var application = ($('#file')[0].files[0].name).split('.')
        console.log(application[application.length - 1])
        if (application[application.length - 1] !== 'xls' && application[application.length - 1] !== 'xlsx') {
          $('.detailPages').prepend('<div class="alert alert-warning">\n' +
            '        <a class="close" data-dismiss="alert">\n' +
            '          &times;\n' +
            '        </a>\n' +
            '        <strong>警告！</strong>请上传excel格式文件。\n' +
            '      </div>')
        } else {
          var formData = new FormData()
          var that = this
          formData.append('excel', $('#file')[0].files[0])
          $.ajax({
            url: APP_CONSTANT.API_HOST_CLIENT + '/invoicing/inv/input',
            type: 'POST',
            cache: false,
            data: formData,
            processData: false,
            contentType: false,
            success: function (res) {
              if (res.code === 200) {
                $('.detailPages').prepend('<div id="myAlert" class="alert alert-success">\n' +
                  '      <a class="close" data-dismiss="alert">&times;</a>\n' +
                  '      <strong>成功！</strong>开票成功。\n' +
                  '    </div>')
                // that.resultShow = true
                that.result = res.msg
              } else {
                that.resultShow = false
                if (res.code === '03') {
                  that.$router.push({path: '/login'})
                }
                $('.detailPages').prepend('<div class="alert alert-warning">\n' +
                  '        <a class="close" data-dismiss="alert">\n' +
                  '          &times;\n' +
                  '        </a>\n' +
                  '        <strong>警告！</strong>' + res.msg + '\n' +
                  '      </div>')
              }
            }
          })
        }
      } else {
        $('.detailPages').prepend('<div class="alert alert-warning">\n' +
          '        <a class="close" data-dismiss="alert">\n' +
          '          &times;\n' +
          '        </a>\n' +
          '        <strong>警告！</strong>请上传xls格式文件。\n' +
          '      </div>')
      }
    }
  }
}
</script>

<style scoped>
  .row{
    margin-bottom: 15px;
  }
  .detailPages {
    padding-top: 30px;
    margin-bottom: 60px;
  }
  .detailPages>h1{
    margin-top: 0;
  }
  .result{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    margin-bottom: 15px;
  }
  .result>div:nth-child(1){
    flex-basis: 100%;
    text-align: left;
  }
  .uploadForm{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    margin: 15px;
  }
  button.btn{
    padding: 0 12px;
    height: 36px;
    line-height: 36px;
  }
  table{
    margin: 0 auto 20px;
    width: 800px;
    border: 1px solid #000;
    border-collapse: collapse;
  }
  td{
    text-align: left;
    padding: 5px 10px;
  }
  th{
    text-align: center;
  }
  .tip{
    position: absolute;
    top: 170px;
    left: 50%;
    width: 200px;
    color: #fff;
    background-color: rgba(50,50,50,0.5);
    padding: 10px;
    transform: translate(-50%,0%);
  }
  .container{
    background: #fff;
    border-radius: 10px;
  }
</style>
