<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div class="login">
    <div class="row">
      <router-link to="/detail"><button class="btn btn-warning">返回</button></router-link>
    </div>
    <div class="login-form">
      <div class="closed"></div>
      <div class="head-info">
        <label class="lbl-1"> </label>
        <label class="lbl-2"> </label>
        <label class="lbl-3"> </label>
      </div>
      <div class="clear"></div>
      <div class="avtar">
        <img src="../assets/avtar.png"/>
      </div>
      <form>
        <div v-show="login">
          <input type="Password" class="userName" v-model="sendInfo.oldpwd" value="Password" placeholder="请输入旧密码">
          <div class="key">
            <input type="password" class="confirmPWD" value="Password" v-model="sendInfo.newpwd" placeholder="请输入新密码">
            <i></i>
            <p class="error">{{error}}</p>
          </div>
        </div>
      </form>
      <div class="signin">
        <input type="submit" v-on:click="submit" value="确定">
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
      error: '',
      sendInfo: {
        newpwd: '',
        oldpwd: ''
      },
      login: true
    }
  },
  methods: {
    submit: async function () {
      var that = this
      $('alert').alert('close')
      await $.ajax({
        url: APP_CONSTANT.API_HOST_CLIENT + '/xgmm',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(this.sendInfo),
        success: function (result) {
          console.log(result)
          $(document).scrollTop(0)
          if (result.errcode === '00') {
            // $('#myModal').modal('show')
            $('.login').prepend('<div id="myAlert" class="alert alert-success">\n' +
              '      <a class="close" data-dismiss="alert">&times;</a>\n' +
              '      <strong>成功！</strong>修改成功。\n 5s后返回主页' +
              '    </div>')
            setTimeout(function () {
              that.$router.push({path: '/detail'})
            }, 5000)
          } else {
            console.log($('.login'))
            if (result.errcode === '03') {
              that.$router.push({path: '/login'})
            }
            $('.login').prepend('<div class="alert alert-warning">\n' +
              '        <a class="close" data-dismiss="alert">\n' +
              '          &times;\n' +
              '        </a>\n' +
              '        <strong>警告！</strong>' + result.errmsg + '\n' +
              '      </div>')
          }
        },
        error: function (result) {
          $('.login').prepend('<div class="alert alert-warning">\n' +
            '        <a class="close" data-dismiss="alert">\n' +
            '          &times;\n' +
            '        </a>\n' +
            '        <strong>警告！</strong>修改失败\n' +
            '      </div>')
        }
      })
    }
  }
}
</script>

<style scoped>
  .row button{
    float: right;
    margin-right: 10%;
    margin-top: 10px;
  }
  .login {
    width: 100%;
    height: 100%;
    position: absolute;
    background: url('../../static/img/bg1.jpg') no-repeat 0px 0px;
    font-family: 'Open Sans', sans-serif;
    background-size: cover;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    min-height: 1050px;
  }
  .registration>input,.infomation>input{
    margin-top: 0!important;
  }
  .error {
    color: #F1C85F;
    margin: 1em 0;
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

  .txt-rt {
    text-align: right;
  }

  /* text align right */
  .txt-lt {
    text-align: left;
  }

  /* text align left */
  .txt-center {
    text-align: center;
  }

  /* text align center */
  .float-rt {
    float: right;
  }

  /* float right */
  .float-lt {
    float: left;
  }

  /* float left */
  .clear {
    clear: both;
  }

  /* clear float */
  .pos-relative {
    position: relative;
  }

  /* Position Relative */
  .pos-absolute {
    position: absolute;
  }

  /* Position Absolute */
  .vertical-base {
    vertical-align: baseline;
  }

  /* vertical align baseline */
  .vertical-top {
    vertical-align: top;
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

  input[type="text"] {
    width: 70%;
    padding: 1em 2em 1em 3em;
    color: #9199aa;
    font-size: 18px;
    outline: none;
    background: url(../assets/adm.png) no-repeat 10px 15px;
    border: none;
    font-weight: 100;
    border-bottom: 1px solid #484856;
    margin-top: 2em;
  }

  input[type="password"] {
    width: 70%;
    padding: 1em 2em 1em 3em;
    color: #dd3e3e;
    font-size: 18px;
    outline: none;
    background: url(../assets/key.png) no-repeat 10px 23px;
    border: none;
    font-weight: 100;
    border-bottom: 1px solid #484856;
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
