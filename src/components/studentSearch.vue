<template>
  <div class="search">
    <div class="searchInfo">
      <div class="row">
        <div class="col-xs-4">学号</div>
        <div class="col-xs-8">
          <input type="text" class="form-control" v-model="sendInfo.stuid" placeholder="请输入学号">
        </div>
      </div>
      <div class="row">
        <div class="col-xs-4">身份证</div>
        <div class="col-xs-8">
          <input type="text" class="form-control" v-model="sendInfo.iden" placeholder="请输入身份证后六位">
        </div>
      </div>
      <div class="row control">
        <button class="btn btn-success" @click="submit"> 查询 </button>
        <button class="btn btn-success" @click="downloadClick"> 发票开具 </button>
      </div>
      <div class="tip">
        {{tip}}
      </div>
    </div>
    <div class="container">
      <div class="row">
        <div class="container student" v-for="(item, key, index) in tableInfos.sfxx" v-bind:key="index">
          <div class="row">
            <div class="col-xs-4">姓名</div>
            <div class="col-xs-8">
              {{tableInfos.xm}}
            </div>
          </div>
          <div class="row">
            <div class="col-xs-4">学号</div>
            <div class="col-xs-8">
              {{tableInfos.stuid}}
            </div>
          </div>
          <div class="row">
            <div class="col-xs-4">收费项目</div>
            <div class="col-xs-8">
              {{item.sfxm}}
            </div>
          </div>
          <div class="row">
            <div class="col-xs-4">收费日期</div>
            <div class="col-xs-8">
              {{item.sfrq}}
            </div>
          </div>
          <div class="row">
            <div class="col-xs-4">收费金额</div>
            <div class="col-xs-8">
              {{item.sfje}}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import $ from 'jquery'
import {APP_CONSTANT} from '../../static/js/app.constant'
export default {
  name: 'modifyPassword',
  data () {
    return {
      isSearch: false,
      loadFlag: false,
      tip: '',
      total: 0,
      sendInfo: {
        stuid: null,
        iden: null
      },
      sendInfos: {},
      tableInfos: [
        {xm: '123'}
      ]
    }
  },
  methods: {
    submit: async function () {
      this.isSearch = true
      $(document).scrollTop(0)
      this.sendInfos = this.sendInfo
      var that = this
      $.ajax({
        url: APP_CONSTANT.API_HOST + '/kpagent/fpcx',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(this.sendInfos),
        success: function (result) {
          if (result.errcode === '00') {
            that.tableInfos = result.data
            // that.scroll()
          } else {
            that.tableInfos = []
          }
        }
      })
    },
    scroll: function () {
      var that = this
      $(window).scroll(function () {
        if (that.loadFlag) {
          return
        }
        console.log('scroll')
        var totalheight = parseFloat($(window).height()) + parseFloat($(window).scrollTop())
        if (totalheight >= $(document).height()) {
          $('#loadmore').show()
          that.loadFlag = true
          that.loadMore()
        }
      })
    },
    loadMore: function () {
      console.log('加载更多')
      this.sendInfos.pageNum += 1
      if (this.sendInfos.pageNum > this.total) {
        this.sendInfos.pageNum = this.total
      }
      var that = this
      $.ajax({
        url: APP_CONSTANT.API_HOST + '/kpserver/drzcm',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(this.sendInfos),
        success: function (result) {
          that.loadFlag = false
          if (result.errcode === '00') {
            that.tableInfos = result.data
          } else {
            that.tableInfos = []
          }
        },
        error: function (result) {
          console.log(result)
        }
      })
    },
    // 下载事件点击
    downloadClick: function () {
      $('.alert').alert('close')
      var that = this
      var xhr = new XMLHttpRequest()
      xhr.open('POST', APP_CONSTANT.API_HOST + '/kpagent/fpxz', true) // 也可以使用POST方式，根据接口
      xhr.responseType = 'blob' // 返回类型blob
      xhr.setRequestHeader('Content-type', 'application/json')
      // 定义请求完成的处理函数，请求前也可以增加加载框/禁用下载按钮逻辑
      xhr.onload = function () {
        console.log(this)
        // 请求完成
        if (this.status === 200) {
          // 返回200
          var blob = this.response
          // return
          that.downloadFile('test.pdf', blob)
        } else {
          if (this.status === 301) {
            $('.tip').prepend('<div class="alert alert-warning">\n' +
              '        <a class="close" data-dismiss="alert">\n' +
              '          &times;\n' +
              '        </a>\n' +
              '        <strong>警告！</strong>未查询到信息。\n' +
              '      </div>')
          } else if (this.status === 302 || this.status === 500) {
            $('.tip').prepend('<div class="alert alert-warning">\n' +
              '        <a class="close" data-dismiss="alert">\n' +
              '          &times;\n' +
              '        </a>\n' +
              '        <strong>警告！</strong>服务器繁忙，请稍后。\n' +
              '      </div>')
          } else if (this.status === 303) {
            $('.tip').prepend('<div class="alert alert-warning">\n' +
              '        <a class="close" data-dismiss="alert">\n' +
              '          &times;\n' +
              '        </a>\n' +
              '        <strong>警告！</strong>请正确填写。\n' +
              '      </div>')
          } else if (this.status === 304) {
            $('.tip').prepend('<div class="alert alert-warning">\n' +
              '        <a class="close" data-dismiss="alert">\n' +
              '          &times;\n' +
              '        </a>\n' +
              '        <strong>警告！</strong>非工作时间，暂不提供服务!\n' +
              '      </div>')
          }
        }
      }
      // 发送ajax请求
      xhr.send(JSON.stringify(that.sendInfo))
    },
    // 下载文件
    downloadFile: function (fileName1, content) {
      var blob = new Blob([content], {
        type: 'application/pdf'
      })
      var fileName = fileName1 || '123.pdf'
      downFile(blob, fileName)
      // 下载格式
      function downFile (blob, fileName) {
        if (window.navigator.msSaveOrOpenBlob) {
          navigator.msSaveBlob(blob)
        } else {
          var link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          // link.download = fileName
          // link.target = '_blank'
          link.download = ''
          link.click()

          window.URL.revokeObjectURL(link.href)
        }
      }
    }
  }
}
</script>

<style scoped>
  .row{
    margin: 30px 0;
  }
  .row>button{
    margin: 0 10px;
    flex-grow: 1;
  }
  .row>div{
    line-height: 34px;
  }
  .student{
    border: 1px;
  }
  .registration>input,.infomation>input{
    margin-top: 0!important;
  }
  .control{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }
  .searchInfo{
    position: absolute;
    top: 0;
    width: 100%;
    margin: 0 auto;
    left: 0;
    background: linear-gradient(to right, #0095CB , #02C5CB); /* 标准的语法 */
    z-index: 100;
  }
  .searchInfo div{
    color: #fff;
  }
  .search{
    padding-top: 205px;
    /*background: linear-gradient(to right, #0095CB , #02C5CB);*/
  }
  .student{
    border: 1px dashed #2c3e50;
    margin-bottom: 10px;
  }
  .key>i{
    float: right;
    position: absolute;
    width: 21px;
    right: 18px;
    height: 21px;
    margin-top: 18px;
    background: url(../assets/pass.png) no-repeat;
  }

  /* reset */
  html, body, span, applet, object, iframe, h1, h2, h3, h4, h5, h6, p, blockquote, pre, a, abbr, acronym, address, big, cite, code, del, dfn, em, img, ins, kbd, q, s, samp, small, strike, strong, sub, sup, tt, var, b, u, i, dl, dt, dd, ol, nav ul, nav li, fieldset, form, label, legend, table, caption, tbody, tfoot, thead, tr, th, td, article, aside, canvas, details, embed, figure, figcaption, footer, header, hgroup, menu, nav, output, ruby, section, summary, time, mark, audio, video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
  }

  article, aside, details, figcaption, figure, footer, header, hgroup, menu, nav, section {
    display: block;
  }

  ol, ul {
    list-style: none;
    margin: 0px;
    padding: 0px;
  }

  blockquote, q {
    quotes: none;
  }

  blockquote:before, blockquote:after, q:before, q:after {
    content: '';
    content: none;
  }

  table {
    border-collapse: collapse;
    border-spacing: 0;
  }

  /* start editing from here */
  a {
    text-decoration: none;
  }
  /* vertical align top */
  nav.vertical ul li {
    display: block;
  }

  /* vertical menu */
  nav.horizontal ul li {
    display: inline-block;
  }

  /* horizontal menu */
  img {
    max-width: 100%;
  }

  /*end reset*/
  /****-----start-body----****/
  .wrap {
    margin: 0 auto;
    width: 80%;
  }

  body a, form li, input[type="submit"], input[type="text"], .sixth-login input[type="submit"], .third-login input[type="submit"] {
    transition: 0.1s all;
    -webkit-transition: 0.1s all;
    -moz-transition: 0.1s all;
    -o-transition: 0.1s all;
  }

  /*--close--*/
  .closed {
    background: url('../assets/close.png') no-repeat 0px 0px;
    cursor: pointer;
    width: 20px;
    height: 20px;
    position: absolute;
    left: 20px;
    top: 20px;
    -webkit-transition: color 0.2s ease-in-out;
    -moz-transition: color 0.2s ease-in-out;
    -o-transition: color 0.2s ease-in-out;
    transition: color 0.2s ease-in-out;
  }

  /*--/close--*/
  h1 {
    font-family: 'Exo 2', sans-serif;
    text-align: center;
    padding-top: 4em;
    font-weight: 400;
    color: #2B2B36;
    font-size: 2em;
  }

  .login-form {
    background: #2b2b36;
    position: relative;
    width: 30%;
    margin: 9% auto 0 auto;
    text-align: center;
    border-radius: 15px;
    -webkit-border-radius: 15px;
    -moz-border-radius: 15px;
    -o-border-radius: 15px;
  }

  .head img {
    width: 100%;
  }

  .avtar img {
    margin: 2em 0 0;
  }

  .head-info {
    padding: 5px 0;
    text-align: center;
    font-weight: 600;
    font-size: 2em;
    color: #fff;
    background: #23232e;
    height: 50px;
    border-top-left-radius: 10px;
    -webkit-border-top-left-radius: 10px;
    -moz-border-top-left-radius: 10px;
    -o-border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    -webkit-border-top-right-radius: 10px;
    -moz-border-top-right-radius: 10px;
    -o-border-top-right-radius: 10 p
  }
  .confirmPWD{
    margin-bottom: 2em;
  }
  input[type="submit"] {
    font-size: 30px;
    color: #fff;
    outline: none;
    border: none;
    background: #3ea751;
    width: 100%;
    padding: 18px 0;
    border-bottom-left-radius: 15px;
    -webkit-border-bottom-left-radius: 15px;
    -moz-border-bottom-left-radius: 15px;
    -o-border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
    -webkit-border-bottom-right-radius: 15px;
    -moz-border-bottom-right-radius: 15px;
    -o-border-bottom-right-radius: 15px;
    cursor: pointer;
  }

  input[type="submit"]:hover {
    background: #ff2775;
    border-bottom-left-radius: 15px;
    -webkit-border-bottom-left-radius: 15px;
    -moz-border-bottom-left-radius: 15px;
    -o-border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
    -webkit-border-bottom-right-radius: 15px;
    -moz-border-bottom-right-radius: 15px;
    -o-border-bottom-right-radius: 15px;
    transition: 1s all;
    -webkit-transition: 1s all;
    -moz-transition: 1s all;
    -o-transition: 1s all;
  }

  label.lbl-1 {
    background: #6756ea;
    width: 20px;
    height: 20px;
    display: block;
    float: right;
    border-radius: 50%;
    margin: 16px 10px 0px 0px;
  }

  label.lbl-2 {
    background: #ea569a;
    width: 20px;
    height: 20px;
    display: block;
    float: right;
    border-radius: 50%;
    margin: 16px 10px 0px 0px;
  }

  label.lbl-3 {
    background: #f1c85f;
    width: 20px;
    height: 20px;
    display: block;
    float: right;
    border-radius: 50%;
    margin: 16px 10px 0px 0px;
  }

  /*--copyrights--*/
  .copy-rights {
    text-align: center;
    margin-top: 8em;
  }

  .copy-rights p {
    color: #FFF;
    font-size: 1em;
    line-height: 1.8em;
  }

  .copy-rights p a {
    color: #ff2a75;
    -webkit-transition: all 0.3s ease-out;
    -moz-transition: all 0.3s ease-out;
    -ms-transition: all 0.3s ease-out;
    -o-transition: all 0.3s ease-out;
    transition: all 0.3s ease-out;
    text-decoration: none;
  }

  .copy-rights p a:hover {
    color: #3faa53;
    text-decoration: none;
    transition: 0.1s all;
    -webkit-transition: 0.1s all;
    -moz-transition: 0.1s all;
    -o-transition: 0.1s all;
  }

  /*--/copyrights--*/
  /*--start-responsive-design--*/
  @media (max-width: 1440px) {

    body {
      min-height: 811px;
    }
  }

  @media (max-width: 1366px) {

    .copy-rights {
      margin-top: 3em;
    }

    body {
      min-height: 768px;
    }
  }

  @media (max-width: 1280px) {

    body {
      min-height: 711px;
    }

    .copy-rights {
      margin-top: 0.5em;
    }
  }

  @media (max-width: 1024px) {
    .login-form {
      width: 37%;
    }

    .copy-rights {
      margin-top: 3em;
    }

    h1 {
      padding-top: 2em;
    }

    body {
      min-height: 675px;
    }
  }

  @media (max-width: 768px) {
    .login-form {
      width: 50%;
      margin: 12% auto 0 auto;
    }

    body {
      min-height: 929px;
    }
  }

  @media (max-width: 640px) {
    .login-form {
      width: 60%;
      margin: 20% auto 0 auto;
    }
  }

  @media (max-width: 480px) {
    .login-form {
      width: 80%;
    }
  }

  @media (max-width: 320px) {
    h1 {
      padding-top: 1em;
      font-size: 1.5em;
    }

    .login-form {
      width: 90%;
      margin: 10% auto 0 auto;
    }

    input[type="text"] {
      width: 62%;
      padding: 1.2em 2em .5em 2.5em;
      font-size: 17px;
      margin-top: .5em;
    }

    input[type="password"] {
      width: 62%;
      padding: 1.2em 2em .5em 2.5em;
      font-size: 17px;
      margin-top: .5em;
      margin-bottom: 2em;
      background: url(../assets/key.png) no-repeat 8px 23px;
    }

    .avtar img {
      margin: 1.1em 0 0;
    }

    .head-info {
      height: 35px;
    }

    label.lbl-1 {
      margin: 8px 10px 0px 0px;
    }

    label.lbl-2 {
      margin: 8px 10px 0px 0px;
    }

    label.lbl-3 {
      margin: 8px 10px 0px 0px;
    }

    .close {
      left: 16px;
      top: 13px;
    }

    .copy-rights {
      margin-top: 2em;
    }

    body {
      min-height: 504px;
    }

    input[type="submit"] {
      font-size: 28px;
      padding: 10px 0;
    }
  }

  /*--end-responsive-design--*/
</style>
