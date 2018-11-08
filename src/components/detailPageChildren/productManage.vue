<template>
    <div class="container searchBody">
      <!--<div @click="change">条件查询</div>-->

      <section class="searchCondition container" >
        <h1>产品管理</h1>
        <div class="container">
          <div class="productSearch">
            <div class="row">
              <div class="col-md-2 col-sm-4">名称</div>
              <div class="col-md-4">
                <div class="btn-group data">
                  <input class="form-control" placeholder="请输入关键字搜索" v-model="searchInfo.name" type="text">
                </div>
              </div>
              <div class="col-md-2 col-sm-4">商品类型</div>
              <div class="col-md-4">
                <div class="btn-group data">
                  <select name="group" id="group" class="form-control" v-model="searchInfo.type">
                    <option value="">—未选择—</option>
                    <option v-for="(item, index) in types" v-bind:key="index" :value="item.type">{{item.type}}</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="row">
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
              <div class="col-md-2 col-sm-4">推荐状态</div>
              <div class="col-md-4">
                <div class="btn-group data">
                  <select name="group" id="group" class="form-control" v-model="searchInfo.display">
                    <option value="">全部</option>
                    <option value="0">未推荐</option>
                    <option value="1">已推荐</option>
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
                <button class="btn btn-primary" v-show="roleId !== '3'" @click="toAdd">新增商品</button>
              </div>
            </div>
          </div>
          <div class="row">
            <table class="table table-bordered" v-show="stateControl.tableShow">
              <thead>
              <tr>
                <th></th>
                <th>名称</th>
                <th>类型</th>
                <th>审批状态</th>
                <th style="width:190px">操作</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(item, index) in tableInfos" v-bind:key="index">
                <td>{{index + 1}}</td>
                <td>
                  {{item.name}}
                </td>
                <td>{{item.type}}</td>
                <td>{{item.state === 0 ? '待审批' : (item.state === 1 ? '审批通过' : '审批未通过')}}</td>
                <td style="text-align: center">
                  <button class="btn btn-primary" v-show="item.id" @click="toDetail($event, item.id)">详情</button>
                  <button class="btn btn-warning" v-show="(item.id && (roleId === '3' || searchInfo.uid === String(item.uid)))" @click="toChange($event, item.id)">修改</button>
                  <button class="btn btn-danger" v-show="item.id && (roleId === '3' || searchInfo.uid === String(item.uid))" @click="toDelete(item.id)">删除</button>
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
      <div class="modal fade" id="addProduct" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" @click="close" data-dismiss="modal" aria-hidden="true">
                &times;
              </button>
              <h4 class="modal-title">
                新增商品
              </h4>
            </div>
            <div class="modal-body">
              <form class="container">
                <div class="row">
                  <div class="col-md-2">
                    <span class="red">*</span>名称:
                  </div>
                  <div class="col-md-4">
                    <input class="form-control" type="text" v-model="productInfo.name">
                  </div>
                  <div class="col-md-2"><span class="red">*</span>型号:</div>
                  <div class="col-md-4">
                    <input class="form-control" type="text" v-model="productInfo.model">
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2">
                    <span class="red">*</span>商品分类:
                  </div>
                  <div class="col-md-4">
                    <select name="group" id="group" class="form-control" v-model="productInfo.type">
                    <option value="">—未选择—</option>
                    <option v-for="(item, index) in types" v-bind:key="index" :value="item.type">{{item.type}}</option>
                  </select>
                  </div>
                  <div class="col-md-2">用途:</div>
                  <div class="col-md-4">
                    <input class="form-control" type="text" v-model="productInfo.puropose">
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2">
                    生产厂商:
                  </div>
                  <div class="col-md-4">
                    <input class="form-control" type="text" v-model="productInfo.manufacturer">
                  </div>
                  <div class="col-md-2">
                    <span class="red">*</span>简介:
                  </div>
                  <div class="col-md-4">
                    <input class="form-control" type="text" v-model="productInfo.introduction">
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2"><span class="red">*</span>尺寸:</div>
                  <div class="col-md-4">
                    <input class="form-control" type="text" v-model="productInfo.volume">
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2"><span class="red">*</span>缩略图:</div>
                  <div class="col-md-10 file">
                    <el-upload
                      :action="uploadUrl"
                      list-type="picture-card"
                      name='uploadFile'
                      accept='image/*'
                      :limit='limit1'
                      :file-list='fileList1'
                      :headers="headers"
                      :on-change="handleChange1"
                      :on-remove="handleRemove1">
                      <i class="el-icon-plus"></i>
                    </el-upload>
                    <span>只可上传一张</span>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2">
                    <span class="red">*</span>展示图:
                  </div>
                  <div class="col-md-10 file">
                    <el-upload
                      :action="uploadUrl"
                      list-type="picture-card"
                      name='uploadFile'
                      accept='image/*'
                      :limit='limit2'
                      :file-list='fileList2'
                      :headers="headers"
                      :on-change="handleChange2"
                      :on-remove="handleRemove2">
                      <i class="el-icon-plus"></i>
                    </el-upload>
                    <span>最多可上传四张图片</span>
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
      <div class="modal fade" id="detailProduct" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" @click="close" data-dismiss="modal" aria-hidden="true">
                &times;
              </button>
              <h4 class="modal-title">
                商品详情
              </h4>
            </div>
            <div class="modal-body">
              <form class="container">
                <div class="row">
                  <div class="col-md-2">
                    <span class="red">*</span>名称:
                  </div>
                  <div class="col-md-4">
                    {{productInfo.name}}
                  </div>
                  <div class="col-md-2"><span class="red">*</span>型号:</div>
                  <div class="col-md-4">
                    {{productInfo.model}}
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2">
                    <span class="red">*</span>商品分类:
                  </div>
                  <div class="col-md-4">
                    {{productInfo.type}}
                  </div>
                  <div class="col-md-2">用途:</div>
                  <div class="col-md-4">
                    {{productInfo.puropose}}
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2">
                    生产厂商:
                  </div>
                  <div class="col-md-4">
                    {{productInfo.manufacturer}}
                  </div>
                  <div class="col-md-2">
                    <span class="red">*</span>简介:
                  </div>
                  <div class="col-md-4">
                    {{productInfo.introduction}}
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2"><span class="red">*</span>尺寸:</div>
                  <div class="col-md-4">
                    {{productInfo.volume}}
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2"><span class="red">*</span>缩略图:</div>
                  <div class="col-md-10 file">
                    <img class="detail" v-for="item in pictureList1" v-bind:key="item" :src="'https://cs.royalsecurity.cn/production/' + (item || 'no-picture.png')">
                    <!-- {{productInfo.pictureUrl}} -->
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2">
                    <span class="red">*</span>展示图:
                  </div>
                  <div class="col-md-10 file">
                    <img class="detail" v-for="item in pictureList2" v-bind:key="item" :src="'https://cs.royalsecurity.cn/production/' + (item || 'no-picture.png')">
                    <!-- {{productInfo.minipicUrl}} -->
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
              <!-- <button type="button" class="btn btn-primary" @click="confirmAdd">
                确认
              </button> -->
            </div>
          </div><!-- /.modal-content -->
        </div><!-- /.modal -->
      </div>
      <!--修改产品信息-->
      <div class="modal fade" id="changeProduct" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" @click="close" data-dismiss="modal" aria-hidden="true">
                &times;
              </button>
              <h4 class="modal-title">
                商品信息
              </h4>
            </div>
            <div class="modal-body">
              <form class="container">
                <div class="row">
                  <div class="col-md-2">
                    <span class="red">*</span>名称:
                  </div>
                  <div class="col-md-4">
                    <input class="form-control" type="text" v-model="productInfo.name">
                  </div>
                  <div class="col-md-2"><span class="red">*</span>型号:</div>
                  <div class="col-md-4">
                    <input class="form-control" type="text" v-model="productInfo.model">
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2">
                    <span class="red">*</span>商品分类:
                  </div>
                  <div class="col-md-4">
                    <select name="group" id="group" class="form-control" v-model="productInfo.type">
                    <option value="">—未选择—</option>
                    <option v-for="(item, index) in types" v-bind:key="index" :value="item.type">{{item.type}}</option>
                  </select>
                  </div>
                  <div class="col-md-2">用途:</div>
                  <div class="col-md-4">
                    <input class="form-control" type="text" v-model="productInfo.puropose">
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2">
                    生产厂商:
                  </div>
                  <div class="col-md-4">
                    <input class="form-control" type="text" v-model="productInfo.manufacturer">
                  </div>
                  <div class="col-md-2">
                    <span class="red">*</span>简介:
                  </div>
                  <div class="col-md-4">
                    <input class="form-control" type="text" v-model="productInfo.introduction">
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2"><span class="red">*</span>尺寸:</div>
                  <div class="col-md-4">
                    <input class="form-control" type="text" v-model="productInfo.volume">
                  </div>
                </div>
                <div class="row" v-if="roleId === '3'">

                  <div class="col-md-2 col-sm-4">推荐位置:</div>
                  <div class="col-md-4">
                    <div class="btn-group data">
                      <select name="group" id="group" class="form-control" v-model="productInfo.display">
                        <!-- <option value="">全部</option> -->
                        <option value="0">未推荐</option>
                        <option value="1">位置一</option>
                        <option value="2">位置二</option>
                        <option value="3">位置三</option>
                        <option value="4">位置四</option>
                        <option value="5">位置五</option>
                        <option value="6">位置六</option>
                      </select>
                    </div>
                  </div>

                </div>
                <div class="row">
                  <div class="col-md-2"><span class="red">*</span>缩略图:</div>
                  <div class="col-md-10 file">
                    <el-upload
                      :action="uploadUrl"
                      list-type="picture-card"
                      name='uploadFile'
                      accept='image/*'
                      :limit='limit1'
                      :file-list='fileList1'
                      :headers="headers"
                      :on-change="handleChange1"
                      :on-remove="handleRemove1">
                      <i class="el-icon-plus"></i>
                    </el-upload>
                    <span>只能上传一张图片</span>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2">
                    <span class="red">*</span>展示图:
                  </div>
                  <div class="col-md-10 file">
                    <el-upload
                      :action="uploadUrl"
                      list-type="picture-card"
                      name='uploadFile'
                      accept='image/*'
                      :limit='limit2'
                      :file-list='fileList2'
                      :headers="headers"
                      :on-change="handleChange2"
                      :on-remove="handleRemove2">
                      <i class="el-icon-plus"></i>
                    </el-upload>
                    <span>最多可上传四张图片</span>
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
      <div class="modal fade" id="deleteProduct" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
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
import {APP_CONSTANT} from '../../../static/js/app.constant'
export default {
  name: 'searchPage',
  components: {
    'pagingDiv': pagingDiv
  },
  data () {
    return {
      msg: 5,
      tipShow: false,
      fail: false,
      fileList1: [],
      pictureList1: [],
      fileList2: [],
      pictureList2: [],
      limit1: 1,
      limit2: 4,
      uploadUrl: APP_CONSTANT.API_HOST + '/product/addPicture',
      headers: {
        'authorization': localStorage.getItem('GSLAuthorization')
      },
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
        display: '',
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
      '/type/select',
      'GET',
      {},
      function (res, that) {
        console.log(res)
        that.types = res.data.productTypes
      }
    )
    this.search()
  },
  methods: {
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
    handleRemove1 (file, fileList) {
      console.log(fileList)
      var list = []
      fileList.forEach(function (v, i) {
        if (v.response) {
          list.push(v.response.data.url)
        }
      })
      this.pictureList1 = list
      console.log(list)
    },
    handleChange1 (file, fileList) {
      console.log(fileList)
      console.log(file)
      var list = []
      fileList.forEach(function (v, i) {
        if (v.response) {
          list.push(v.response.data.url)
        }
      })
      this.pictureList1 = list
      console.log(list)
    },
    handleRemove2 (file, fileList) {
      console.log(fileList)
      var list = []
      fileList.forEach(function (v, i) {
        if (v.response) {
          list.push(v.response.data.url)
        }
      })
      this.pictureList2 = list
      console.log(list)
    },
    handleChange2 (file, fileList) {
      console.log(fileList)
      console.log(file)
      var list = []
      fileList.forEach(function (v, i) {
        if (v.response) {
          list.push(v.response.data.url)
        }
      })
      this.pictureList2 = list
      console.log(list)
    },
    close () {
      this.fileList1 = []
      this.fileList2 = []
      console.log(123)
    },
    /**
     * 函数描述
     *  用户查询
     * @return {null} 返回值描述 无
    */
    search () {
      $('#loading').modal('show')
      var that = this
      this.fileList1 = []
      this.fileList2 = []
      this.request(
        '/product/select',
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
      this.pictureList1 = []
      this.pictureList2 = []
      // 清除file缓存
      $('#addProduct').modal({backdrop: 'static', keyboard: false})
      this.productInfo = {
        name: '',
        model: '',
        type: '制造业',
        purpose: '',
        introduction: '',
        pictureUrl: '',
        minipicUrl: '',
        uid: localStorage.getItem('GSLBackendUid'),
        volume: '',
        manufacture: ''
      }
    },
    toChange (e, id) {
      this.fail = false
      this.pictureList1 = []
      this.pictureList2 = []
      $('#loading').modal({backdrop: 'static', keyboard: false})
      // 清除file缓存
      // $('#pictureUrl1')[0].value = ''
      // $('#pictureUrl2')[0].value = ''
      // $('#minipicUrl1')[0].value = ''
      // $('#minipicUrl2')[0].value = ''
      this.request(
        '/product/selectOne',
        'POST',
        JSON.stringify({
          id: id
        }),
        function (res, that) {
          $('#loading').modal('hide')
          console.log(res)
          that.fileList = []
          that.productInfo = res.data.product
          if (that.productInfo.minipicUrl) {
            var list1 = that.productInfo.minipicUrl.split(',')
            console.log(list1)
            list1.forEach(function (v, i) {
              that.fileList1.push({
                name: v,
                response: {
                  data: {
                    url: v
                  }
                },
                url: 'https://cs.royalsecurity.cn/production/' + v
              })
            })
          }
          if (that.productInfo.pictureUrl) {
            var list2 = that.productInfo.pictureUrl.split(',')
            list2.forEach(function (v, i) {
              that.fileList2.push({
                name: v,
                response: {
                  data: {
                    url: v
                  }
                },
                url: 'https://cs.royalsecurity.cn/production/' + v
              })
            })
          }
          $('#changeProduct').modal('show')
        },
        function () {
          $('#loading').modal('hide')
        }
      )
    },
    toDetail (e, id) {
      this.fail = false
      console.log(id)
      this.pictureList1 = []
      this.pictureList2 = []
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
          if (that.productInfo.minipicUrl) {
            that.pictureList1 = [that.productInfo.minipicUrl]
          }
          if (that.productInfo.pictureUrl) {
            var list = that.productInfo.pictureUrl.split(',')
            list.forEach(function (v, i) {
              that.pictureList2.push(v)
            })
          }
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
      // 缩略图
      var list1 = ''
      if (this.pictureList1.length > 0) {
        this.pictureList1.forEach(function (v, i) {
          list1 = list1 + v + ','
        })
        list1 = list1.slice(0, list1.length - 1)
      } else {
        list1 = this.productInfo.minipicUrl
      }
      // 展示图
      var list2 = ''
      if (this.pictureList2.length > 0) {
        this.pictureList2.forEach(function (v, i) {
          list2 = list2 + v + ','
        })
        list2 = list2.slice(0, list2.length - 1)
      } else {
        list2 = this.productInfo.pictureUrl
      }
      this.productInfo.minipicUrl = list1
      this.productInfo.pictureUrl = list2
      // console.log(this.productInfo)
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
      // 缩略图
      var list1 = ''
      if (this.pictureList1.length > 0) {
        this.pictureList1.forEach(function (v, i) {
          list1 = list1 + v + ','
        })
        list1 = list1.slice(0, list1.length - 1)
      } else {
        list1 = this.productInfo.minipicUrl
      }
      // 展示图
      var list2 = ''
      if (this.pictureList2.length > 0) {
        this.pictureList2.forEach(function (v, i) {
          list2 = list2 + v + ','
        })
        list2 = list2.slice(0, list2.length - 1)
      } else {
        list2 = this.productInfo.pictureUrl
      }
      this.productInfo.minipicUrl = list1
      this.productInfo.pictureUrl = list2
      console.log(this.productInfo)
      if (!this.test()) {
        return
      }
      $('#loading').modal('show')
      this.request(
        '/product/update',
        'POST',
        JSON.stringify(this.productInfo),
        function (res, that) {
          // $('#loading').modal('hide')
          if (res.code === 200) {
            $('#changeProduct').modal('hide')
            $('.searchBody').prepend(that.success)
            $(document).scrollTop(0)
            that.productInfo = {}
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
      if (this.productInfo.name === '' ||
      this.productInfo.model === '' ||
      this.productInfo.introduction === '' ||
      this.productInfo.volume === '' ||
      this.productInfo.pictureUrl === '' ||
      this.productInfo.minipicUrl === '') {
        this.errorMsg = '请填写完整'
        this.fail = true
        return false
      } else {
        this.errorMsg = ''
        this.fail = false
        return true
      }
    },
    fileUpload (id, type) {
      id = '#' + id
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
        if (type === 'pictureUrl') {
          that.productInfo.pictureUrl = '加载中'
        } else {
          that.productInfo.minipicUrl = '加载中'
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
              if (type === 'pictureUrl') {
                that.productInfo.pictureUrl = res.data.url
              } else {
                that.productInfo.minipicUrl = res.data.url
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
</style>
