<template>
    <div class="container searchBody">
      <!--<div @click="change">条件查询</div>-->
      <!-- <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog> -->
      <section class="searchCondition container" >
        <h1>会员企业管理</h1>
        <div class="container">
          <div class="productSearch">
            <div class="row">
              <div class="col-md-2 col-sm-4">名称</div>
              <div class="col-md-4">
                <div class="btn-group data">
                  <input class="form-control" placeholder="请输入关键字搜索" v-model="searchInfo.name" type="text">
                </div>
              </div>
              <div class="col-md-2 col-sm-4">税号</div>
              <div class="col-md-4">
                <div class="btn-group data">
                  <input class="form-control" placeholder="请输入关键字搜索" v-model="searchInfo.taxId" type="text">
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-2 col-sm-4">展示:</div>
              <div class="col-md-4">
                <div class="btn-group data">
                  <select class="form-control" v-model="searchInfo.display">
                    <option value="0">全部</option>
                    <option value="1">只展示优秀企业</option>
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
                <!-- <button class="btn btn-primary" v-show="roleId === '3'" @click="toAdd">新增公司</button> -->
              </div>
            </div>
          </div>
          <div class="row">
            <table class="table table-bordered" v-show="stateControl.tableShow">
              <thead>
                <tr>
                  <th></th>
                  <th>名称</th>
                  <th>税号</th>
                  <th>地址</th>
                  <th style="width:185px">操作</th>
                </tr>
              </thead>
              <tbody>
              <tr v-for="(item, index) in tableInfos" v-bind:key="index">
                <td>{{index + 1}}</td>
                <td>
                  {{item.name}}
                </td>
                <td>{{item.taxId || '无'}}</td>
                <td>{{item.address || '无'}}</td>
                <td style="text-align: center">
                  <button class="btn btn-primary" v-show="item.id" @click="toDetail($event, item.id)">详情</button>
                  <button class="btn btn-warning" v-show="(item.id && (roleId === '3' || searchInfo.uid === String(item.uid)))" @click="toCompany($event, item.id)">修改</button>
                  <button class="btn btn-danger" v-show="(item.id && (roleId === '3' || searchInfo.uid === String(item.uid)))" @click="toShow($event, item.id)">优秀企业展示</button>
                  <!-- <button class="btn btn-danger" v-show="item.id && (roleId === '3' || searchInfo.uid === String(item.uid))" @click="toDelete(item.id)">删除</button> -->
                  <!-- <button class="btn btn-danger" v-show="item.id && item.state === 0 && (roleId === '3')" @click="toAllow(item.id)">审批</button> -->
                  <span v-show="!item.id">无</span>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <pagingDiv :child-msg="msg" @upup="pageChange" v-show="stateControl.paging"></pagingDiv>
      <!--公司信息详情-->
      <div class="modal fade" id="detailProduct" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-hidden="true">
                &times;
              </button>
              <h4 class="modal-title">
                公司详情
              </h4>
            </div>
            <div class="modal-body">
              <form class="container">
                <div class="row">
                  <div class="col-md-2">
                    公司名称:
                  </div>
                  <div class="col-md-4">
                    {{productInfo.name || '无'}}
                  </div>
                  <div class="col-md-2">税号:</div>
                  <div class="col-md-4">
                    {{productInfo.taxId || '无'}}
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2">
                    地址:
                  </div>
                  <div class="col-md-4">
                    {{productInfo.address || '无'}}
                  </div>
                  <div class="col-md-2">开户银行:</div>
                  <div class="col-md-4">
                    {{productInfo.bank || '无'}}
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2">
                    银行账号:
                  </div>
                  <div class="col-md-4">
                    {{productInfo.bankAcct || '无'}}
                  </div>
                  <div class="col-md-2">
                    所得税征收方式:
                  </div>
                  <div class="col-md-4">
                    {{productInfo.incomeTaxColl || '无'}}
                    <!-- <input class="form-control" type="text" v-model="productInfo.incomeTaxColl"> -->
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2">
                    增值税征收方式:
                  </div>
                  <div class="col-md-4">
                    {{productInfo.vatColl || '无'}}
                    <!-- <input class="form-control" type="text" v-model="productInfo.vatColl"> -->
                  </div>
                  <div class="col-md-2">
                    公司性质:
                  </div>
                  <div class="col-md-4">
                    {{productInfo.nature || '无'}}
                    <!-- <input class="form-control" type="text" v-model="productInfo.vatColl"> -->
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2">
                    开票方式:
                  </div>
                  <div class="col-md-4">
                    {{productInfo.invoice || '无'}}
                  </div>
                  <div class="col-md-2">法人姓名:</div>
                  <div class="col-md-4">
                    {{productInfo.legal || '无'}}
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2">
                    法人证件号码:
                  </div>
                  <div class="col-md-4">
                    {{productInfo.legalIdnNumber || '无'}}
                  </div>
                  <div class="col-md-2">公司简介:</div>
                  <div class="col-md-4">
                    {{productInfo.coSynopsis || '无'}}
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2">
                    网址:
                  </div>
                  <div class="col-md-4">
                    {{productInfo.webAddress || '无'}}
                  </div>
                  <div class="col-md-2">
                    主营产品:
                  </div>
                  <div class="col-md-4">
                    {{productInfo.mainProduct || '无'}}
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2">
                    联系人:
                  </div>
                  <div class="col-md-4">
                    {{productInfo.linkman || '无'}}
                  </div>
                  <div class="col-md-2">手机:</div>
                  <div class="col-md-4">
                    {{productInfo.phone || '无'}}
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2">
                    QQ:
                  </div>
                  <div class="col-md-4">
                    {{productInfo.qq || '无'}}
                  </div>
                  <div class="col-md-2">微信:</div>
                  <div class="col-md-4">
                    {{productInfo.wechat || '无'}}
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2">公司宣传图片:</div>
                  <div class="col-md-10 file">
                    <img class="detail" v-for="item in pictureList" v-bind:key="item" :src="'https://cs.royalsecurity.cn/production/' + (item || 'no-picture.png')">
                    <!-- {{productInfo.minipicUrl}} -->
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
      <!--公司信息管理-->
      <div class="modal fade" id="changeCompany" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-hidden="true">
                &times;
              </button>
              <h4 class="modal-title">
                公司信息
              </h4>
            </div>
            <div class="modal-body">
              <form class="container">
                <div class="row">
                  <div class="col-md-2">
                    <span class="red">*</span>公司名称:
                  </div>
                  <div class="col-md-4">
                    <input class="form-control" type="text" v-model="productInfo.name">
                  </div>
                  <div class="col-md-2"><span class="red">*</span>税号:</div>
                  <div class="col-md-4">
                    <input class="form-control" type="text" v-model="productInfo.taxId">
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2">
                    地址:
                  </div>
                  <div class="col-md-4">
                    <input class="form-control" type="text" v-model="productInfo.address">
                  </div>
                  <div class="col-md-2">开户银行:</div>
                  <div class="col-md-4">
                    <input class="form-control" type="text" v-model="productInfo.bank">
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2">
                    银行账号:
                  </div>
                  <div class="col-md-4">
                    <input class="form-control" type="text" v-model="productInfo.bankAcct">
                  </div>
                  <div class="col-md-2">
                    所得税征收方式:
                  </div>
                  <div class="col-md-4">
                    <select class="form-control" v-model="productInfo.incomeTaxColl">
                      <option value="null">请选择</option>
                      <option value="查账征收">查账征收</option>
                    </select>
                    <!-- <input class="form-control" type="text" v-model="productInfo.incomeTaxColl"> -->
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2">
                    增值税征收方式:
                  </div>
                  <div class="col-md-4">
                    <select class="form-control" v-model="productInfo.vatColl">
                      <option value="null">请选择</option>
                      <option value="一般纳税人">一般纳税人</option>
                      <option value="小规模纳税人">小规模纳税人</option>
                    </select>
                    <!-- <input class="form-control" type="text" v-model="productInfo.vatColl"> -->
                  </div>
                  <div class="col-md-2">
                    公司性质:
                  </div>
                  <div class="col-md-4">
                    <select class="form-control" v-model="productInfo.nature">
                      <option value="null">请选择</option>
                      <option value="国有企业">国有企业</option>
                      <option value="有限责任公司">有限责任公司</option>
                    </select>
                    <!-- <input class="form-control" type="text" v-model="productInfo.vatColl"> -->
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2">
                    开票方式:
                  </div>
                  <div class="col-md-4">
                    <select class="form-control" v-model="productInfo.invoice">
                      <option value="null">请选择</option>
                      <option value="增值税普通发票">增值税普通发票</option>
                      <option value="增值税专用发票">增值税专用发票</option>
                      <option value="增值税电子发票">增值税电子发票</option>
                    </select>
                  </div>
                  <div class="col-md-2">法人姓名:</div>
                  <div class="col-md-4">
                    <input class="form-control" type="text" v-model="productInfo.legal">
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2">
                    法人证件号码:
                  </div>
                  <div class="col-md-4">
                    <input class="form-control" type="text" v-model="productInfo.legalIdnNumber">
                  </div>
                  <div class="col-md-2">公司简介:</div>
                  <div class="col-md-4">
                    <input class="form-control" type="text" v-model="productInfo.coSynopsis">
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2">
                    网址:
                  </div>
                  <div class="col-md-4">
                    <input class="form-control" type="text" v-model="productInfo.webAddress">
                  </div>
                  <div class="col-md-2">
                    联系人:
                  </div>
                  <div class="col-md-4">
                    <input class="form-control" type="text" v-model="productInfo.linkman">
                  </div>
                </div>
                <div class="row">

                  <div class="col-md-2">手机:</div>
                  <div class="col-md-4">
                    <input class="form-control" type="text" v-model="productInfo.phone">
                  </div>
                  <div class="col-md-2">
                    QQ:
                  </div>
                  <div class="col-md-4">
                    <input class="form-control" type="text" v-model="productInfo.qq">
                  </div>
                </div>
                <div class="row">

                  <div class="col-md-2">微信:</div>
                  <div class="col-md-4">
                    <input class="form-control" type="text" v-model="productInfo.wechat">
                  </div>
                  <div class="col-md-2">
                    主营产品:
                  </div>
                  <div class="col-md-4">
                    <input class="form-control" type="text" v-model="productInfo.mainProduct">
                  </div>
                </div>
                <div class="row">

                  <div class="col-md-2">公司宣传图片:</div>
                  <div class="col-md-10 file">
                    <el-upload
                      :action="uploadUrl"
                      list-type="picture-card"
                      name='uploadFile'
                      accept='image/*'
                      :limit='limit'
                      :file-list='fileList'
                      :headers="headers"
                      :on-change="handleChange"
                      :on-remove="handleRemove">
                      <i class="el-icon-plus"></i>
                    </el-upload>
                    <!-- <el-dialog :visible.sync="dialogVisible">
                      <img width="100%" :src="dialogImageUrl" alt="">
                    </el-dialog> -->
                    <span>最多可上传四张图片</span>
                    <!-- <span class="btn btn-success fileinput-button">
                      <span>最多可上传四张图片</span>
                      <input type="file" id="pictureUrl"  @change="fileUpload('pictureUrl1', 'pictureUrl')" accept="image/*">
                    </span> -->
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
              <button type="button" class="btn btn-primary" @click="confirmChangeCompany">
                确认
              </button>
            </div>
          </div><!-- /.modal-content -->
        </div><!-- /.modal -->
      </div>
      <!--优秀企业管理-->
      <div class="modal fade" id="changeShow" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-hidden="true">
                &times;
              </button>
              <h4 class="modal-title">
                展示信息
              </h4>
            </div>
            <div class="modal-body">
              <form class="container">
                <div class="row">
                  <div class="col-md-2">
                    <span class="red">*</span>推荐位置:
                  </div>
                  <div class="col-md-6">
                    <select class="form-control" v-model="showInfo.id">
                      <option value="null">无</option>
                      <option value="1">推荐位一</option>
                      <option value="2">推荐位二</option>
                    </select>
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
              <button type="button" class="btn btn-primary" @click="confirmChangeShow">
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
      fileList: [],
      pictureList: [],
      limit: 4,
      uploadUrl: APP_CONSTANT.API_HOST + '/product/addPicture',
      fail: false,
      errorMsg: '',
      roleId: localStorage.getItem('GSLBackendRoleid'),
      stateControl: {
        tableShow: true,
        paging: true
      },
      showInfo: {
        id: 'null',
        cid: ''
      },
      searchInfo: { // 查询信息
        name: '',
        taxId: '',
        display: '0',
        pageSize: '10',
        pageCount: '1'
      },
      headers: {
        'authorization': localStorage.getItem('GSLAuthorization')
      },
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
    handleRemove (file, fileList) {
      console.log(fileList)
      var list = []
      fileList.forEach(function (v, i) {
        if (v.response) {
          list.push(v.response.data.url)
        }
      })
      this.pictureList = list
      console.log(list)
    },
    handleChange (file, fileList) {
      console.log(fileList)
      console.log(file)
      var list = []
      fileList.forEach(function (v, i) {
        if (v.response) {
          list.push(v.response.data.url)
        }
      })
      this.pictureList = list
      console.log(list)
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
        '/com/select',
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
      that.fileList = []
      this.request(
        '/com/select',
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
    close () {
      this.fileList = []
      console.log(123)
    },
    toAdd () {
      this.fail = false
      $('#addProduct').modal({backdrop: 'static', keyboard: false})
      this.productInfo = {
        'name': '',
        'nature': null,
        'vatColl': null,
        'incomeTaxColl': null,
        'taxId': '',
        'bank': null,
        'bankAcct': null,
        'address': null
      }
    },
    toCompany (e, id) {
      this.fail = false
      $('#loading').modal('show')
      $('#changeCompany').modal({backdrop: 'static', keyboard: false})
      this.request(
        '/com/selectOneBy',
        'POST',
        JSON.stringify({
          id: id
        }),
        function (res, that) {
          $('#loading').modal('hide')
          console.log(res)
          that.fileList = []
          if (res.data.companyDto) {
            that.productInfo = res.data.companyDto
            if (that.productInfo.picture) {
              var list = that.productInfo.picture.split(',')
              list.forEach(function (v, i) {
                that.fileList.push({
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
            console.log(that.productInfo.picture)
            console.log(that.fileList)
          } else {
            that.productInfo = {
              uid: id,
              name: '',
              nature: '有限责任公司',
              vatColl: '小规模纳税人',
              incomeTaxColl: '查账征收',
              taxId: '',
              bank: '',
              bankAcct: '',
              address: '',
              invoice: '增值税普通发票',
              legal: '',
              legalIdnNumber: '',
              coSynopsis: '',
              webAddress: '',
              picture: '',
              mainProduct: '',
              linkman: '',
              qq: '',
              wechat: '',
              phone: ''
            }
          }
          $('#changeCompany').modal('show')
        },
        function () {
          $('#loading').modal('hide')
        }
      )
    },
    /**
     * 函数描述
     *  前往优秀企业展示
     * @return {null} 返回值描述 无
    */
    toShow (e, id) {
      this.fail = false
      // $('#loading').modal('show')
      $('#changeShow').modal('show')
      this.showInfo.cid = id
      $('#loading').modal('show')
      this.request(
        '/com/selectOneBy',
        'POST',
        JSON.stringify({
          id: id
        }),
        function (res, that) {
          $('#loading').modal('hide')
          console.log(res)
          that.showInfo.id = res.data.companyDto.displayId
          $('#changeShow').modal('show')
        },
        function () {
          $('#loading').modal('hide')
        }
      )
    },
    toDetail (e, id) {
      this.fail = false
      this.productInfo.picture = ''
      this.pictureList = []
      $('#loading').modal('show')
      this.request(
        '/com/selectOneBy',
        'POST',
        JSON.stringify({
          id: id
        }),
        function (res, that) {
          $('#loading').modal('hide')
          console.log(res)
          that.productInfo = res.data.companyDto
          if (that.productInfo.picture) {
            var list = that.productInfo.picture.split(',')
            list.forEach(function (v, i) {
              that.pictureList.push(v)
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
      if (!this.test()) {
        return
      }
      $('#loading').modal('show')
      this.request(
        '/com/add',
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
     *  确认修改公司信息
     * @return {null} 返回值描述 无
    */
    confirmChangeCompany () {
      $('.alert').alert('close')
      var list = ''
      if (this.pictureList.length > 0) {
        this.pictureList.forEach(function (v, i) {
          list = list + v + ','
        })
        list = list.slice(0, list.length - 1)
      } else {
        list = this.productInfo.picture
      }
      console.log(this.pictureList)
      console.log(list)
      this.productInfo.picture = list
      if (!this.test(true)) {
        return
      }
      $('#loading').modal('show')
      this.request(
        '/com/updateOrAdd',
        'POST',
        JSON.stringify(this.productInfo),
        function (res, that) {
          // $('#loading').modal('hide')
          if (res.code === 200) {
            $('#changeCompany').modal('hide')
            $('.searchBody').prepend(that.success)
            that.search()
          } else {
            $('#loading').modal('hide')
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
     *  确认修改优秀企业展示
     * @return {null} 返回值描述 无
    */
    confirmChangeShow () {
      $('.alert').alert('close')
      $('#loading').modal('show')
      this.request(
        '/com/updateDis',
        'POST',
        JSON.stringify(this.showInfo),
        function (res, that) {
          // $('#loading').modal('hide')
          if (res.code === 200) {
            $('#changeShow').modal('hide')
            $('.searchBody').prepend(that.success)
            that.search()
          } else {
            $('#loading').modal('hide')
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
      this.productInfo.taxId === '') {
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
        that.productInfo.picture = '加载中'
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
              that.productInfo.picture = res.data.url
              // console.log(that.productInfo)
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
  #detailProduct .modal-dialog,
  #changeCompany .modal-dialog,
  #changeShow .modal-dialog{
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
  img.detail{
    width: 146px;
    height: 146px;
    border-radius: 5px;
    margin-right: 15px;
  }
</style>
