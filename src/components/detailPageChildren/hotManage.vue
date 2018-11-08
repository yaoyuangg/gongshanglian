<template>
    <div class="container searchBody">
      <!--<div @click="change">条件查询</div>-->

      <section class="searchCondition container" >
        <h1>商会介绍管理</h1>
        <div class="container">
          <div class="row">
            <div class="col-md-2">商会介绍:</div>
            <div class="col-md-10 file">
              <!-- <span class="btn btn-success fileinput-button">
                <span>上传</span>
                <input type="file" id="pictureUrl2"  @change="fileUpload" accept="image/*">
              </span>{{productInfo.pictureUrl}} -->
              <editor
              class="editor"
              :value="content"
              :isInput="isInput"
              :id="editorId3"
              @tinymceHtml="tinymceHtml">
              </editor>
            </div>
          </div>
          <div class="row">
            <button class="btn btn-primary" @click="confirmChange">修改</button>
          </div>
        </div>
      </section>

      <!-- <pagingDiv :child-msg="msg" @upup="pageChange" v-show="stateControl.paging"></pagingDiv> -->
      <div class="tip" v-show="tipShow">
        正在加载中,请稍后...
      </div>
      <!--审批-->
      <div class="modal fade" id="allowProduct" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-hidden="true">
                &times;
              </button>
              <h4 class="modal-title" id="myModalLabel">
                审批确认
              </h4>
            </div>
            <div class="modal-body">
              是否通过？
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-default" data-dismiss="modal" @click="confirmAllow('2')">不通过
              </button>
              <button type="button" class="btn btn-primary" @click="confirmAllow('1')">
                通过
              </button>
            </div>
          </div><!-- /.modal-content -->
        </div><!-- /.modal -->
      </div>
    </div>
</template>

<script>
import $ from 'jquery'
import pagingDiv from '../pagingComponent/paging'
import editor from '../tinymce/tinymce'
import {APP_CONSTANT} from '../../../static/js/app.constant'
export default {
  name: 'searchPage',
  components: {
    'pagingDiv': pagingDiv,
    'editor': editor
  },
  data () {
    return {
      editorId3: 'editorId3',
      content: '', // 富文本内容
      isInput: false, // 富文本内容
      tipShow: false,
      fail: false,
      showImg: 'no-picture.png',
      errorMsg: '',
      picName: '',
      minPicName: '',
      roleId: localStorage.getItem('GSLBackendRoleid'),
      stateControl: {
        tableShow: true,
        paging: true
      },
      searchInfo: {
        name: '',
        type: '',
        state: '',
        uid: localStorage.getItem('GSLBackendUid'),
        pageSize: '10',
        pageCount: '1'
      },
      groups: [],
      types: [{
        name: '123',
        value: '11'
      }],
      productInfo: {},
      tableInfos: [{
        // id: '1',
        name: '暂无',
        type: '暂无',
        state: '暂无'
      }],
      success: '<div class="alert alert-success">\n' +
      '        <a class="close" data-dismiss="alert">&times;</a>\n' +
      '        <strong>成功！</strong>修改成功。\n' +
      '      </div>',
      error: '<div class="alert alert-warning">\n' +
      '        <a class="close" data-dismiss="alert">\n' +
      '          &times;\n' +
      '        </a>\n' +
      '        <strong>警告！</strong>请填写完整。\n' +
      '      </div>'
    }
  },
  computed: {
  },
  mounted () {
    $(document).scrollTop(0)
    // 查询产品类型信息
    this.request(
      '/chamber/all',
      'GET',
      {},
      function (res, that) {
        console.log(res)
        that.content = res.data.synopsis
        // that.types = res.data.productTypes
      }
    )
  },
  methods: {
    tinymceHtml (data) {
      console.log(data)
      this.content = data
    },
    /**
     * 函数描述
     *  接口请求
     * @param {string} url 参数1的说明 请求地址
     * @param {string} methods 参数2的说明 请求方法 (POST, GET, PUT)
     * @param {string} data 参数3的说明 请求参数
     * @param {object} sCallback 参数4的说明 成功的回调函数
     * @return {Object} 返回值描述
    */
    request (url, methods, data, sCallback, eCallback) {
      let that = this
      $.ajax({
        url: APP_CONSTANT.API_HOST + url,
        type: methods,
        data: data,
        contentType: 'application/json',
        dataType: 'json',
        processData: false, // 序列化处理
        beforeSend: function (XMLHttpRequest) {
          XMLHttpRequest.setRequestHeader('authorization', localStorage.getItem('GSLAuthorization'))
        },
        success (res) {
          sCallback(res, that)
        },
        error (res) {
          if (eCallback) {
            eCallback(res, that)
          }
        }
      })
    },
    /**
     * 函数描述
     *  分页跳转
     * @param {string} data 参数1的说明 当前页数
     * @return {null} 返回值描述 无
    */
    pageChange (data) {
      if (!this.stateControl.paging || Number(this.searchInfo.pageCount) === data) {
        return
      }
      this.searchInfo.pageCount = String(data)
      var that = this
      this.request(
        '/product/select',
        'POST',
        JSON.stringify(this.searchInfo),
        function (res) {
          $('#loading').modal('hide')
          console.log(res)
          that.tableInfos = res.data.PageInfo
          that.msg = res.data.totalNum
        }
      )
    },
    /**
     * 函数描述
     *  用户查询
     * @return {null} 返回值描述 无
    */
    search () {
      $('#loading').modal('show')
      var that = this
      this.request(
        '/adv/select',
        'GET',
        {},
        function (res) {
          $('#loading').modal('hide')
          if (res.code === 200) {
            that.productInfo = res.data.advertising
            setTimeout(function () {
              that.showImg = res.data.advertising.pictureUrl
            }, 1000)

            // that.showImg = '2.jpg'
          } else if (res.code === 401) {
            that.$router.push({path: 'login'})
          }
        },
        function (res) {
          $('.searchBody').prepend('<div class="alert alert-warning">\n' +
      '        <a class="close" data-dismiss="alert">\n' +
      '          &times;\n' +
      '        </a>\n' +
      '        <strong>警告！</strong>' + res.msg + '。\n' +
      '      </div>')
        }
      )
    },
    toAdd () {
      this.fail = false
      // 清除file缓存
      $('#pictureUrl1')[0].value = ''
      $('#pictureUrl2')[0].value = ''
      $('#minipicUrl1')[0].value = ''
      $('#minipicUrl2')[0].value = ''
      $('#addProduct').modal({backdrop: 'static', keyboard: false})
      this.productInfo = {
        name: '',
        model: '',
        type: '制造业',
        purpose: '',
        introdction: '',
        pictureUrl: '',
        minipicUrl: '',
        uid: localStorage.getItem('GSLBackendUid'),
        volume: '',
        manufacture: ''
      }
    },
    toChange (e, id) {
      this.fail = false
      $('#loading').modal({backdrop: 'static', keyboard: false})
      this.request(
        '/adv/select',
        'GET',
        {},
        function (res, that) {
          $('#loading').modal('hide')
          if (res.code === 200) {
            that.productInfo = res.data.advertising
            $('#changeHot').modal('show')
          } else if (res.code === 401) {
            that.$router.push({path: 'login'})
          }
        },
        function () {
          $('#loading').modal('hide')
        }
      )
    },
    toDetail (e, id) {
      this.fail = false
      console.log(id)
      $('#loading').modal('show')
      this.request(
        '/product/selectOne',
        'POST',
        JSON.stringify({
          id: id
        }),
        function (res, that) {
          $('#loading').modal('hide')
          console.log(res)
          that.productInfo = res.data.product
          $('#detailProduct').modal('show')
        },
        function () {
          $('#loading').modal('hide')
        }
      )
    },
    toDelete (id) {
      this.id = id
      $('#deleteProduct').modal('show')
    },
    toAllow (id) {
      this.id = id
      $('#allowProduct').modal('show')
    },
    /**
     * 函数描述
     *  确认添加用户
     * @return {null} 返回值描述 无
    */
    confirmAdd () {
      $('.alert').alert('close')
      if (!this.test()) {
        return
      }
      $('#loading').modal('show')
      this.request(
        '/product/add',
        'POST',
        JSON.stringify(this.productInfo),
        function (res, that) {
          // $('#loading').modal('hide')
          if (res.code === 200) {
            $('#addProduct').modal('hide')
            $('.searchBody').prepend(that.success)
            $(document).scrollTop(0)
            that.search()
          } else {
            that.fail = true
            that.errorMsg = res.msg
          }
        },
        function (res, that) {
          that.fail = true
          that.errorMsg = res.msg
        }
      )
    },
    /**
     * 函数描述
     *  确认添加用户
     * @return {null} 返回值描述 无
    */
    confirmChange () {
      $('.alert').alert('close')
      console.log(this.test())
      if (!this.test()) {
        return
      }
      $('#loading').modal('show')
      this.request(
        '/chamber/update',
        'POST',
        JSON.stringify({
          synopsis: this.content
        }),
        function (res, that) {
          $('#loading').modal('hide')
          if (res.response === 'success') {
            // setTimeout(function () {
            // $('#changeHot').modal('hide')
            $('.searchBody').prepend(that.success)
            $(document).scrollTop(0)
            // that.search()
            // }, 10000)
          } else {
            that.fail = true
            that.errorMsg = res.msg
          }
        },
        function (res, that) {
          that.fail = true
          that.errorMsg = res.msg
        }
      )
    },
    /**
     * 函数描述
     *  测试
     * @return {null} 返回值描述 无
    */
    test () {
      if (this.content === '') {
        this.errorMsg = '请填写完整'
        this.fail = true
        return false
      } else {
        this.errorMsg = ''
        this.fail = false
        return true
      }
    },
    /**
     * 函数描述
     *  分页跳转
     * @param {string} ext 参数1的说明 上传文件的格式
     * @return {null} 返回值描述 是图片返回true 不是图片返回false
    */
    checkFileExt (ext) {
      if (!ext.match(/.jpg|.gif|.png|.bmp/i)) {
        return false
      }
      return true
    },
    fileUpload (id, type) {
      id = '#pictureUrl'
      console.log($(id)[0].value)
      var fileExt = $(id)[0].value.substring($(id)[0].value.lastIndexOf('.'))
        .toLowerCase()
      var that = this
      if (!this.checkFileExt(fileExt)) {
        alert('您上传的文件不是图片,请重新上传！')
        return
      }
      console.log($(id))
      if ($(id)[0].files && $(id)[0].files[0]) {
        console.log($(id)[0].files[0].size / 1024)
        if (($(id)[0].files[0].size / 1024) > 2048) {
          alert('上传的图片不得大于2m')
          return
        }
        var formData = new FormData()
        formData.append('uploadFile', $(id)[0].files[0])
        that.productInfo.pictureUrl = '加载中'
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
            console.log(res)
            if (res.code === 200) {
              that.productInfo.pictureUrl = res.data.url
            }
          },
          error (res) {

          }
        })
      }
    },
    /**
     * 函数描述
     *  确认删除用户
     * @return {null} 返回值描述 无
    */
    confirmDelete () {
      $('.alert').alert('close')
      $('#loading').modal('show')
      this.request(
        '/product/delete',
        'POST',
        JSON.stringify({
          id: this.id
        }),
        function (res, that) {
          $('#deleteProduct').modal('hide')
          if (res.code === 200) {
            $('.searchBody').prepend(that.success)
            console.log(res)
            that.search()
          } else {
            $('#loading').modal('hide')
            $('.searchBody').prepend('<div class="alert alert-warning">\n' +
      '        <a class="close" data-dismiss="alert">\n' +
      '          &times;\n' +
      '        </a>\n' +
      '        <strong>警告！</strong>' + res.code + '。\n' +
      '      </div>')
          }
        }
      )
    },
    /**
     * 函数描述
     *  确认审批
     * @return {null} 返回值描述 无
    */
    confirmAllow (state) {
      $('.alert').alert('close')
      $('#loading').modal('show')
      this.request(
        '/product/updateState',
        'POST',
        JSON.stringify({
          id: this.id,
          state: state
        }),
        function (res, that) {
          // $('#loading').modal('hide')
          if (res.code === 200) {
            $('#allowProduct').modal('hide')
            $('.searchBody').prepend(that.success)
            that.search()
          } else {
            $('#loading').modal('hide')
            $('.searchBody').prepend('<div class="alert alert-warning">\n' +
              '        <a class="close" data-dismiss="alert">\n' +
              '          &times;\n' +
              '        </a>\n' +
              '        <strong>警告！</strong>' + res.code + '。\n' +
              '      </div>')
          }
        }
      )
    }
  },
  watch: {
  }
}
// console.log(App)
</script>

<style scoped>
/* ==========================================================================
   通用样式
 ============================================================================ */
  a{
    cursor: pointer;
  }
  td{
    line-height: 50px!important;
  }
  .red{
    color: red
  }
  img{
    width: 150px
  }
  @media (min-width: 1500px){
    .container {
      width: 1170px;
    }
  }
  @media (min-width: 1200px){
    .container {
      width: 1080px;
    }
  }
  .searchBody{
    padding-top: 50px;
  }
  .container {
    width: 95%;
  }
input{
  line-height: 28px;
}
.data>input{
  display: inline-block;
}
section{
  padding: 15px;
  background-color: #fff;
  border-radius: 15px;
}
.btn-group{
  width: 100%;
}
.row{
  line-height: 34px;
  margin: 0 20px;
  border-bottom: 1px dashed rgb(204 204 204);
  padding: 8px 0;
}
.data>div:nth-child(1):after,.data>div:nth-child(2):after{
  content: '-';
  display: inline-block;
  position: absolute;
  right: 3px;
  top: 0;
}
table{
  margin: 15px auto 20px;
  width: 100%;
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
  top: 0;
  left: 50%;
  padding-top: 250px;
  color: #fff;
  background-color: rgba(50,50,50,0.5);
  width: 100%;
  height: 100%;
  transform: translate(-50%,0%);
}

.condition-items{
  height: 438px;
  /*overflow: hidden;*/
  /*transition: all 1s ease;*/
}
@media (max-width: 992px) {
  .condition-items{
    height: 900px;
  }
}
.condition-items.limit{
  height: 160px;
}
.condition-items.cHide{
  height: 8px;
  overflow: hidden;
}
.conditions{
  margin-bottom: -20px;
}
/*向下箭头*/
.conditionHide,.conditionShow{
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select:none;
  -ms-user-select:none;
  color: #1588F5;
}
.conditionHide:hover,.conditionShow:hover {
  cursor: pointer;
}
.conditionHide:after,.conditionShow:after{
  content: '';
  width: 10px;
  border: 10px solid transparent;
  border-bottom-color: #999;
  display: block;
  position: absolute;
  top: 2px;
  left: 10%;
}
.conditionShow:after{
  border-bottom-color: transparent;
  border-top-color: #999;
  top: 11px;
}
/*多级下拉*/
.dropdown-submenu {
  position: relative;
}
.dropdown-submenu > .dropdown-menu {
  top: 0;
  left: 100%;
  margin-top: -6px;
  margin-left: -1px;
  -webkit-border-radius: 0 6px 6px 6px;
  -moz-border-radius: 0 6px 6px;
  border-radius: 0 6px 6px 6px;
}
.dropdown-submenu:hover > .dropdown-menu {
  display: block;
}
.dropdown-submenu > a:after {
  display: block;
  content: " ";
  float: right;
  width: 0;
  height: 0;
  border-color: transparent;
  border-style: solid;
  border-width: 5px 0 5px 5px;
  border-left-color: #ccc;
  margin-top: 5px;
  margin-right: -10px;
}
.dropdown-submenu:hover > a:after {
  border-left-color: #fff;
}
.dropdown-submenu.pull-left {
  float: none;
}
.dropdown-submenu.pull-left > .dropdown-menu {
  left: -100%;
  margin-left: 10px;
  -webkit-border-radius: 6px 0 6px 6px;
  -moz-border-radius: 6px 0 6px 6px;
  border-radius: 6px 0 6px 6px;
}
.dropdown>a{
  border: 1px solid #aaa;
  color: #000;
  padding: 6px 17px;
}
.dropdown a {
  cursor: pointer;
}
.btn .caret {
  margin-left: 10px;
}
.btn-group>div{
  padding-left: 0;
}
  /*必需*/
  .must:before{
    content: '*';
    color: #F0433D;
    margin-right: 5px;
  }
  /* ==========================================================================
   模态框
 ============================================================================ */
  #addProduct .modal-dialog,
  #changeProduct .modal-dialog,
  #detailProduct .modal-dialog{
    width: 90%;
  }
  .file{
    text-align: left
  }
  .fileinput-button {
      position: relative;
      display: inline-block;
      overflow: hidden;
      cursor: pointer;
  }
  .fileinput-button input{
      position:absolute;
      right: 0px;
      top: 0px;
      opacity: 0;
      /* -ms-filter: 'alpha(opacity=0)'; */
      font-size: 200px;
  }
  #changeHot>.modal-dialog {
    width: 80%;
  }
</style>
