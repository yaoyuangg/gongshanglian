<template>
    <div class="container searchBody">
      <!--<div @click="change">条件查询</div>-->

      <section class="searchCondition container" >
        <h1>消息管理</h1>
        <div class="container">
          <div class="productSearch">
            <div class="row">
              <div class="col-md-2 col-sm-4">标题</div>
              <div class="col-md-4">
                <div class="btn-group data">
                  <input class="form-control" placeholder="请输入关键字搜索" v-model="searchInfo.headline" type="text">
                </div>
              </div>
              <div class="col-md-2 col-sm-4">审批状态</div>
              <div class="col-md-4">
                <div class="btn-group data">
                  <select class="form-control" name="approval" id="approval" v-model="searchInfo.state">
                    <option value="">全部</option>
                    <option value="0">未审批</option>
                    <option value="1">审批通过</option>
                    <option value="2">审批未通过</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-8">
                提示: 默认查找全部，您也可以选择组合查询
              </div>
              <div class="col-md-4">
                <button class="btn btn-warning" @click="search">搜索</button>
                <button class="btn btn-primary" @click="toAdd">新增消息</button>
              </div>
            </div>
          </div>
          <div class="row">
            <table class="table table-bordered" v-show="stateControl.tableShow">
              <thead>
              <tr>
                <th></th>
                <th>标题</th>
                <th>创建时间</th>
                <th>审批状态</th>
                <th style="width:190px">操作</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(item, index) in tableInfos" v-bind:key="index">
                <td>{{index + 1}}</td>
                <td>
                  {{item.headline || '暂无'}}
                </td>
                <td>{{item.createtime || '暂无'}}</td>
                <td>{{item.state === 0 ? '待审批' : (item.state === 1 ? '审批通过' : '审批未通过')}}</td>
                <td style="text-align: center">
                  <button class="btn btn-primary" v-show="item.id" @click="toDetail($event, item.id)">详情</button>
                  <button class="btn btn-warning" v-show="(item.id && (roleId === '3'))" @click="toChange($event, item.id)">修改</button>
                  <button class="btn btn-danger" v-show="(item.id && (roleId === '3'))" @click="toDelete(item.id)">删除</button>
                  <button class="btn btn-danger" v-show="item.id && item.state === 0 && (roleId === '3')" @click="toAllow(item.id)">审批</button>
                  <span v-show="!item.id">无</span>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <pagingDiv :child-msg="msg" @upup="pageChange" v-show="stateControl.paging"></pagingDiv>
      <div class="tip" v-show="tipShow">
        正在加载中,请稍后...
      </div>
      <!--添加产品信息-->
      <div class="modal fade" id="addMessage" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" @click="close" data-dismiss="modal" aria-hidden="true">
                &times;
              </button>
              <h4 class="modal-title">
                新增消息
              </h4>
            </div>
            <div class="modal-body">
              <form class="container">
                <div class="row">
                  <div class="col-md-2">
                    <span class="red">*</span>标题:
                  </div>
                  <div class="col-md-6">
                    <input class="form-control" type="text" v-model="productInfo.headline">
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2">
                    <span class="red">*</span>发布方:
                  </div>
                  <div class="col-md-6">
                    <input class="form-control" type="text" v-model="productInfo.writer">
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2"><span class="red">*</span>内容:</div>
                  <div class="col-md-10">
                    <editor
                    class="editor"
                    :value="content"
                    :isInput="isInput"
                    :id="editorId1"
                    @tinymceHtml="tinymceHtml">
                    </editor>
                  </div>
                </div>
                <div class="row" v-show="fail" style="color: red;margin: 15px 0 0">
                  {{errorMsg}}
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-default" @click="close" data-dismiss="modal">关闭
              </button>
              <button type="button" class="btn btn-primary" @click="confirmAdd">
                确认
              </button>
            </div>
          </div><!-- /.modal-content -->
        </div><!-- /.modal -->
      </div>
      <!--产品信息详情-->
      <div class="modal fade" id="detailMessage" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-hidden="true">
                &times;
              </button>
              <h4 class="modal-title">
                消息详情
              </h4>
            </div>
            <div class="modal-body">
              <form class="container">
                <div class="row">
                  <div class="col-md-2">
                    标题:
                  </div>
                  <div class="col-md-6">
                    {{productInfo.headline}}
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2">
                    <span class="red">*</span>发布方:
                  </div>
                  <div class="col-md-6">
                    {{productInfo.writer}}
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2"><span class="red">*</span>内容:</div>
                  <div id="info-content" class="col-md-6">
                  </div>
                </div>
                <div class="row" v-show="fail" style="color: red;margin: 15px 0 0">
                  {{errorMsg}}
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-default" data-dismiss="modal">关闭
              </button>
              <!-- <button type="button" class="btn btn-primary" @click="confirmAdd">
                确认
              </button> -->
            </div>
          </div><!-- /.modal-content -->
        </div><!-- /.modal -->
      </div>
      <!--修改产品信息-->
      <div class="modal fade" id="changeMessage" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close"  @click="close" data-dismiss="modal" aria-hidden="true">
                &times;
              </button>
              <h4 class="modal-title">
                消息详情
              </h4>
            </div>
            <div class="modal-body">
              <form class="container">
                <div class="row">
                  <div class="col-md-2">
                    <span class="red">*</span>标题:
                  </div>
                  <div class="col-md-6">
                    <input class="form-control" type="text" v-model="productInfo.headline">
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2">
                    <span class="red">*</span>发布方:
                  </div>
                  <div class="col-md-6">
                    <input class="form-control" type="text" v-model="productInfo.writer">
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2"><span class="red">*</span>轮播位置:</div>
                  <div class="col-md-6">
                    <select name="position" class="form-control" v-model="productInfo.type">
                      <option value="0">无</option>
                      <option value="1">位置1</option>
                      <option value="2">位置2</option>
                      <option value="3">位置3</option>
                    </select>
                  </div>
                </div>
                <div class="row" v-show="isShowPicture">
                  <div class="col-md-2"><span class="red">*</span>轮播图:</div>
                  <div class="col-md-10 file">
                    <span class="btn btn-success fileinput-button">
                      <span>上传</span>
                      <input type="file" id="picture"  @change="fileUpload()" accept="image/*">
                    </span>{{productInfo.picture}}
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2"><span class="red">*</span>热点轮播位置:</div>
                  <div class="col-md-6">
                    <select name="position" class="form-control" v-model="productInfo.hotplace">
                      <option value="0">无</option>
                      <option value="1">位置1</option>
                      <option value="2">位置2</option>
                      <option value="3">位置3</option>
                    </select>
                  </div>
                </div>
                <div class="row" v-show="isShowPicture1">
                  <div class="col-md-2"><span class="red">*</span>热点轮播图:</div>
                  <div class="col-md-10 file">
                    <span class="btn btn-success fileinput-button">
                      <span>上传</span>
                      <input type="file" id="picture1"  @change="fileUpload(1)" accept="image/*">
                    </span>{{productInfo.hotpic}}
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2"><span class="red">*</span>内容:</div>
                  <div class="col-md-10">
                    <editor
                    class="editor"
                    :value="content"
                    :isInput="isInput"
                    :id="editorId2"
                    @tinymceHtml="tinymceHtml">
                    </editor>
                  </div>
                </div>
                <div class="row" v-show="fail" style="color: red;margin: 15px 0 0">
                  {{errorMsg}}
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-default" @click="close" data-dismiss="modal">关闭
              </button>
              <button type="button" class="btn btn-primary" @click="confirmChange">
                确认
              </button>
            </div>
          </div><!-- /.modal-content -->
        </div><!-- /.modal -->
      </div>
      <!--删除-->
      <div class="modal fade" id="deleteMessage" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-hidden="true">
                &times;
              </button>
              <h4 class="modal-title" id="myModalLabel">
                操作确认
              </h4>
            </div>
            <div class="modal-body">
              是否确认删除？
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-default" data-dismiss="modal">关闭
              </button>
              <button type="button" class="btn btn-primary" @click="confirmDelete">
                确认
              </button>
            </div>
          </div><!-- /.modal-content -->
        </div><!-- /.modal -->
      </div>
      <!--审批-->
      <div class="modal fade" id="allowMessage" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
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
      msg: 5,
      tipShow: false,
      content: '', // 富文本内容
      isInput: false, // 富文本内容
      fail: false,
      errorMsg: '',
      picName: '',
      minPicName: '',
      editorId1: 'tinymce1',
      editorId2: 'tinymce2',
      roleId: localStorage.getItem('GSLBackendRoleid'),
      stateControl: {
        tableShow: true,
        paging: true
      },
      searchInfo: {
        headline: '',
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
    isShowPicture () {
      if (String(this.productInfo.type) !== '0') {
        return true
      } else {
        return false
      }
    },
    isShowPicture1 () {
      if (String(this.productInfo.hotplace) !== '0') {
        return true
      } else {
        return false
      }
    }
  },
  mounted () {
    $(document).scrollTop(0)
    this.search()
    var a = '<p>在洗擦<img src="https://cs.royalsecurity.cn/production/1540265581197.jpg" alt="" width="305" height="229" />从秩序</p>↵<p>&nbsp; &nbsp; 撒大声地<img src="https://cs.royalsecurity.cn/production/1540265597009.jpg" alt="" width="500" height="417" />打得过</p>'
    var b = a.replace(/<.+?>/g, '')
    console.log(b)
  },
  methods: {
    tinymceHtml (data) {
      console.log(data)
      this.productInfo.content = data
    },
    close () {
      this.content = ''
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
          // console.log(res)
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
        '/message/select',
        'POST',
        JSON.stringify(this.searchInfo),
        function (res) {
          $('#loading').modal('hide')
          if (res.data.PageInfo.length === 0) {
            that.tableInfos = [{
              name: '暂无',
              type: '暂无',
              state: '暂无'
            }]
          } else {
            that.tableInfos = res.data.PageInfo
          }
          that.msg = res.data.totalNum
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
      $('#addMessage').modal({backdrop: 'static', keyboard: false})
      this.content = ''
      this.productInfo = {
        headline: '',
        content: '',
        type: '0',
        hotplace: '0'
      }
    },
    toChange (e, id) {
      this.fail = false
      $('#loading').modal({backdrop: 'static', keyboard: false})
      this.request(
        '/message/selectOne',
        'POST',
        JSON.stringify({
          id: id
        }),
        function (res, that) {
          $('#loading').modal('hide')
          console.log(res)
          that.productInfo = res.data.message
          that.content = that.productInfo.content
          console.log(that.content)
          $('#changeMessage').modal('show')
        },
        function () {
          $('#loading').modal('hide')
        }
      )
    },
    toDetail (e, id) {
      this.fail = false
      $('#info-content').empty()
      $('#loading').modal('show')
      this.request(
        '/message/selectOne',
        'POST',
        JSON.stringify({
          id: id
        }),
        function (res, that) {
          $('#loading').modal('hide')
          console.log(res)
          that.productInfo = res.data.message
          $('#info-content').append(that.productInfo.content)
          $('#detailMessage').modal('show')
        },
        function () {
          $('#loading').modal('hide')
        }
      )
    },
    toDelete (id) {
      this.id = id
      $('#deleteMessage').modal('show')
    },
    toAllow (id) {
      this.id = id
      $('#allowMessage').modal('show')
    },
    /**
     * 函数描述
     *  确认添加用户
     * @return {null} 返回值描述 无
    */
    confirmAdd () {
      $('.alert').alert('close')
      // this.productInfo.content = this.content
      this.splitImg(this.productInfo.content)
      this.productInfo.content = this.productInfo.content.replace(/\/test\//g, '/production/')
      console.log(this.productInfo)
      // return
      if (!this.test()) {
        return
      }
      $('#loading').modal('show')
      this.request(
        '/message/add',
        'POST',
        JSON.stringify(this.productInfo),
        function (res, that) {
          if (res.code === 200) {
            $('#addMessage').modal('hide')
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
        '/message/update',
        'POST',
        JSON.stringify(this.productInfo),
        function (res, that) {
          // $('#loading').modal('hide')
          if (res.code === 200) {
            $('#changeMessage').modal('hide')
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
     *  测试
     * @return {null} 返回值描述 无
    */
    test () {
      console.log(this.productInfo)
      if (this.productInfo.headline === '' ||
      this.productInfo.content === '' ||
      this.productInfo.writer === '' ||
      (String(this.productInfo.type) !== '0' && this.productInfo.picture === '') ||
      (String(this.productInfo.hotplace) !== 'null' && this.productInfo.hotpic === '') ||
      this.productInfo.picture === '加载中' || this.productInfo.hotpic === '加载中') {
        this.errorMsg = '请填写完整'
        this.fail = true
        return false
      } else {
        this.errorMsg = ''
        this.fail = false
        return true
      }
    },
    fileUpload (data) {
      var id = '#picture'
      if (data) {
        id = '#picture1'
      }
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
        if (data) {
          that.productInfo.hotpic = '加载中'
        } else {
          that.productInfo.picture = '加载中'
        }
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
              if (data) {
                that.productInfo.hotpic = res.data.url
              } else {
                that.productInfo.picture = res.data.url
              }
            }
          },
          error (res) {

          }
        })
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
    /**
     * 函数描述
     *  确认删除用户
     * @return {null} 返回值描述 无
    */
    confirmDelete () {
      $('.alert').alert('close')
      $('#loading').modal('show')
      this.request(
        '/message/delete',
        'POST',
        JSON.stringify({
          id: this.id
        }),
        function (res, that) {
          $('#deleteMessage').modal('hide')
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
        '/message/updateState',
        'POST',
        JSON.stringify({
          id: this.id,
          state: state
        }),
        function (res, that) {
          if (res.code === 200) {
            $('#allowMessage').modal('hide')
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
    },
    splitImg (str) {
      let a = str
      a = a.split('" alt')
      let b = ''
      a.forEach(function (item, index) {
        if (item.split('test/').length > 1) {
          b = b + item.split('test/')[1] + ','
        }
      })
      b = b.slice(0, b.length - 1)
      this.productInfo.picture = b
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
  textarea{
    height: 125px;
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
  #addMessage .modal-dialog,
  #changeMessage .modal-dialog,
  #detailMessage .modal-dialog{
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
      -ms-filter: 'alpha(opacity=0)';
      font-size: 200px;
  }
</style>
