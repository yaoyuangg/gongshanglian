<template>
    <section class="detailPage">
      <div id="wrapper">
        <nav class="navbar navbar-default top-navbar" role="navigation">
          <div class="navbar-header">
            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".sidebar-collapse">
              <span class="sr-only">Toggle navigation</span>
              <span class="icon-bar">222</span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand" href="index.html">
              <!--<img :src="company.logo" alt="" style="width: 33px;float: left">-->
              <!--<strong style="margin-left: 10px">{{company.companyname}}</strong>-->
            </a>
          </div>
          <ul class="nav navbar-top-links navbar-right">
            <!-- /.dropdown -->
            <li> {{eTime}}</li>
            <li class="dropdown">
              <a class="dropdown-toggle" data-toggle="dropdown" href="#" aria-expanded="false">
                <span>个人配置</span>
                <i class="fa fa-user fa-fw"></i> <i class="fa fa-caret-down"></i>
              </a>
              <ul class="dropdown-menu dropdown-user">
                <li><a @click="user"><i class="fa fa-user fa-fw"></i> 个人信息</a>
                <li><a @click="toChange"><i class="fa fa-user fa-fw"></i> 公司信息</a>
                <!-- <li><a @click="toConfig"><i class="fa fa-user fa-fw"></i> 参数设置</a>
                </li>
                <li><a @click="toCode"><i class="fa fa-user fa-fw"></i> 商品编码</a>
                </li>
                <li><a @click="toAuthority"><i class="fa fa-user fa-fw"></i> 权限管理</a>
                </li>
                <li><a @click="toRecord"><i class="fa fa-gear fa-fw"></i> 日志查询</a>
                </li> -->

                <!-- <li class="divider"></li> -->
                <li><a @click="loginOut"><i class="fa fa-sign-out fa-fw"></i> 退出</a>
                </li>
              </ul>
              <!-- /.dropdown-user -->
            </li>
            <!-- /.dropdown -->
          </ul>
        </nav>
        <!--/. NAV TOP  -->
        <nav class="navbar-default navbar-side" role="navigation">
          <div class="user-info">
            <div class="image">
              <img src="../../static/img/avtar.png" style="width: 55px;margin: 6px 0">
            </div>
            <div class="info-container">
              <div class="name">{{'匿名'}}</div>
              <div class="company">{{ '未知'}}</div>
            </div>
          </div>
          <div class="sidebar-collapse">
            <ul class="nav" id="main-menu">
              <li v-on:click="menuClick($event)" v-if="roleId === '3'" class="test first-list">
                <a><i class="fa fa-sitemap"></i> 成员信息管理<span
                  class="fa arrow"></span></a>
                <ul class="first-list nav nav-second-level collapse">
                  <!--<li v-on:click="secondMenuClick($event)" class="invoiceFill">-->
                    <!--<router-link to="/detail/invoiceFill"><i class="fa fa-desktop"></i> 发票填开</router-link>-->
                  <!--</li>-->
                  <li v-if="(roleId === '2' || roleId === '3')" v-on:click="menuClick($event)" class="userManage">
                    <router-link to="/detail/userManage"><i class="fa fa-desktop"></i>会员管理</router-link>
                  </li>
                  <li v-if="(roleId === '2' || roleId === '3')" v-on:click="menuClick($event)" class="companyManage">
                    <router-link to="/detail/companyManage"><i class="fa fa-desktop"></i>会员企业管理</router-link>
                  </li>
                </ul>
              </li>

              <li v-on:click="menuClick($event)" class="productManage">
                <router-link to="/detail/productManage"><i class="fa fa-desktop"></i>产品管理</router-link>
              </li>
              <li v-on:click="menuClick($event)" class="messageManage">
                <router-link to="/detail/messageManage"><i class="fa fa-desktop"></i>消息管理</router-link>
              </li>
              <li
               v-on:click="menuClick($event)"
                class="groupsManage" v-if="roleId === '3'">
                <router-link to="/detail/groupsManage"><i class="fa fa-desktop"></i>下级商会管理</router-link>
              </li>
              <li
               v-on:click="menuClick($event)"
                class="downloadManage" v-if="roleId === '3'">
                <router-link to="/detail/downloadManage"><i class="fa fa-desktop"></i>信息下载管理</router-link>
              </li>
              <li
               v-on:click="menuClick($event)"
                class="industryManage"
                v-if="roleId === '3'">
                <router-link to="/detail/industryManage"><i class="fa fa-desktop"></i>行业分会管理</router-link>
              </li>
              <li
               v-on:click="menuClick($event)"
                class="activityManage"
                v-if="roleId === '3'">
                <router-link to="/detail/activityManage"><i class="fa fa-desktop"></i>活动管理</router-link>
              </li>
              <li
               v-on:click="menuClick($event)"
                class="serviceManage"
                v-if="roleId === '3'">
                <router-link to="/detail/serviceManage"><i class="fa fa-desktop"></i>会员服务管理</router-link>
              </li>
              <li
               v-on:click="menuClick($event)"
                class="applyManage"
                v-if="roleId === '3'">
                <router-link to="/detail/applyManage"><i class="fa fa-desktop"></i>入会申请管理</router-link>
              </li>
              <li
               v-on:click="menuClick($event)"
                class="hotManage"
                 v-if="roleId === '3'"
              >
                <router-link to="/detail/hotManage"><i class="fa fa-desktop"></i>商会介绍管理</router-link>
              </li>
            </ul>
          </div>
        </nav>
        <!-- /. NAV SIDE  -->
        <div id="page-wrapper">
          <router-view
          :industry='industry'
          :groups='groups'
          :allPosition='allPosition'
          :position='position'
          :downloadUrl='downloadUrl'
          @updateIndustry='updateIndustry'
          @updateGroups='updateGroups'>
          </router-view>
        </div>
        <!-- /. PAGE WRAPPER  -->
      </div>
      <!-- 成功提示（Modal） -->
      <div class="modal fade" id="success" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-hidden="true">
                &times;
              </button>
              <h4 class="modal-title">
                成功
              </h4>
            </div>
            <div class="modal-body">
              操作成功
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-default" data-dismiss="modal">关闭
              </button>
            </div>
          </div><!-- /.modal-content -->
        </div><!-- /.modal -->
      </div>
      <!--商品编码-->
      <div class="modal fade" id="code" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-hidden="true">
                &times;
              </button>
              <h4 class="modal-title" id="productCode">
                商品编码
              </h4>
            </div>
            <div class="modal-body">
              是否确认退出登入？
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-default" data-dismiss="modal">关闭
              </button>
              <button type="button" class="btn btn-primary" @click="loginOutSure">
                确认退出
              </button>
            </div>
          </div><!-- /.modal-content -->
        </div><!-- /.modal -->
      </div>
      <!--加载中-->
      <div class="modal fade" id="loading" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" data-backdrop='static'>
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h4 class="modal-title" id="myModalLabel">提示</h4>
            </div>
            <div class="modal-body">
              请稍候。。。
            </div>
          </div>
        </div>
      </div>
      <!--权限管理-->
      <div class="modal fade" id="authority" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-hidden="true">
                &times;
              </button>
              <h4 class="modal-title" id="myModalLabel">
                权限设置
              </h4>
            </div>
            <div class="modal-body">
              是否确认退出登入？
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-default" data-dismiss="modal">关闭
              </button>
              <button type="button" class="btn btn-primary" @click="loginOutSure">
                确认退出
              </button>
            </div>
          </div><!-- /.modal-content -->
        </div><!-- /.modal -->
      </div>
      <!--登出-->
      <div class="modal fade" id="loginOut" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-hidden="true">
                &times;
              </button>
              <h4 class="modal-title" id="myModalLabel">
                商品编码
              </h4>
            </div>
            <div class="modal-body">
              是否确认退出登入？
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-default" data-dismiss="modal">关闭
              </button>
              <button type="button" class="btn btn-primary" @click="loginOutSure">
                确认退出
              </button>
            </div>
          </div><!-- /.modal-content -->
        </div><!-- /.modal -->
      </div>
      <!--参数设置-->
      <div class="modal fade" id="config" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-hidden="true">
                &times;
              </button>
              <h4 class="modal-title">
                参数设置
              </h4>
            </div>
            <div class="modal-body">
              <div class="container">
                <div class="row right">
                  <button class="btn btn-primary">添加开户行</button>
                  <button class="btn btn-warning">删除开户行</button>
                </div>
                <div class="row">
                  <div class="col-md-2">
                    开票类型:
                  </div>
                  <div class="col-md-4">
                    <input type="text" class="form-control">
                  </div>
                  <div class="col-md-2">销货单位识别号:</div>
                  <div class="col-md-4">
                    <input type="text" class="form-control">
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2">
                    销货单位名称:
                  </div>
                  <div class="col-md-4">
                    <input type="text" class="form-control">
                  </div>
                  <div class="col-md-2">销货单位地址电话:</div>
                  <div class="col-md-4">
                    <input type="text" class="form-control">
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2">
                    销货单位银行账号:
                  </div>
                  <div class="col-md-4">
                    <input type="text" class="form-control">
                  </div>
                  <div class="col-md-2">含税税率标识:</div>
                  <div class="col-md-4">
                    <input type="text" class="form-control">
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2">
                    发票行性质:
                  </div>
                  <div class="col-md-4">
                    <input type="text" class="form-control">
                  </div>
                  <div class="col-md-2">
                    税率:
                  </div>
                  <div class="col-md-4">
                    <input type="text" class="form-control">
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2">
                    含税标志:
                  </div>
                  <div class="col-md-4">
                    <input type="text" class="form-control">
                  </div>
                  <div class="col-md-2">
                    优惠政策标识:
                  </div>
                  <div class="col-md-4">
                    <input type="text" class="form-control">
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2">
                    0税率标识:
                  </div>
                  <div class="col-md-4">
                    <input type="text" class="form-control">
                  </div>
                  <div class="col-md-2">
                    综合税率:
                  </div>
                  <div class="col-md-4">
                    <input type="text" class="form-control">
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2">
                    收款人:
                  </div>
                  <div class="col-md-4">
                    <input type="text" class="form-control">
                  </div>
                  <div class="col-md-2">
                    复核人:
                  </div>
                  <div class="col-md-4">
                    <input type="text" class="form-control">
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2">
                    开票人:
                  </div>
                  <div class="col-md-4">
                    <input type="text" class="form-control">
                  </div>
                  <div class="col-md-2">
                    原发票代码:
                  </div>
                  <div class="col-md-4">
                    <input type="text" class="form-control">
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2">
                    原发票号码:
                  </div>
                  <div class="col-md-4">
                    <input type="text" class="form-control">
                  </div>
                  <div class="col-md-2">
                    清单标志:
                  </div>
                  <div class="col-md-4">
                    <input type="text" class="form-control">
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2">
                    税控盘口令:
                  </div>
                  <div class="col-md-4">
                    <input type="text" class="form-control">
                  </div>
                  <div class="col-md-2">
                    数字证书密码:
                  </div>
                  <div class="col-md-4">
                    <input type="text" class="form-control">
                  </div>
                </div>
              </div>
              <div class="row" v-show="fail" style="color: red;margin: 15px 0 0">
                {{errorMsg}}
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-default" data-dismiss="modal">关闭
              </button>
              <button type="button" class="btn btn-primary" @click="submit">
                确定
              </button>
            </div>
          </div><!-- /.modal-content -->
        </div><!-- /.modal -->
      </div>
      <!--用户信息详情-->
      <div class="modal fade" id="myDetailUser" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-hidden="true">
                &times;
              </button>
              <h4 class="modal-title">
                用户详情
              </h4>
            </div>
            <div class="modal-body">
              <form class="container" id="companyInfo">
                <div class="row">
                  <div class="col-md-2">
                    用户名:
                  </div>
                  <div class="col-md-4">
                    {{userInfo.nickname}}
                  </div>
                  <div class="col-md-2"><span class="red">*</span>性别:</div>
                  <div class="col-md-4">
                    {{userInfo.sex === 0 ? '女' : (userInfo.sex === 1 ? '男' : '保密')}}
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2">
                    经营产品:
                  </div>
                  <div class="col-md-4">
                    {{userInfo.productList || '无'}}
                  </div>
                  <div class="col-md-2">
                    出生日期:
                  </div>
                  <div class="col-md-4">
                    {{userInfo.birthtime || '无'}}
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2">
                    职务:
                  </div>
                  <div class="col-md-4">
                    {{userInfo.position || '无'}}
                  </div>
                  <div class="col-md-2">所属商会:</div>
                  <div class="col-md-4">
                    {{userInfo.coname || '无'}}
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2">
                    会费缴纳时间:
                  </div>
                  <div class="col-md-4">
                    {{userInfo.costtime || '无'}}
                  </div>
                  <div class="col-md-2">会费金额:</div>
                  <div class="col-md-4">
                    {{userInfo.costSum || '无'}}
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2">
                    入会推荐人:
                  </div>
                  <div class="col-md-4">
                    {{userInfo.referrer || '无'}}
                  </div>
                  <div class="col-md-2">
                    行业分会:
                  </div>
                  <div class="col-md-4">
                    {{handleIndustry(userInfo.sonCoid) || '无'}}
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2">
                    积分:
                  </div>
                  <div class="col-md-4">
                    {{userInfo.integral || '无'}}
                  </div>
                  <div class="col-md-2">手机:</div>
                  <div class="col-md-4">
                    {{userInfo.phone || '无'}}
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2">
                    座机:
                  </div>
                  <div class="col-md-4">
                    {{userInfo.tel || '无'}}
                  </div>
                  <div class="col-md-2">QQ:</div>
                  <div class="col-md-4">
                    {{userInfo.qq || '无'}}
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2">
                    微信:
                  </div>
                  <div class="col-md-4">
                    {{userInfo.wechat || '无'}}
                  </div>
                  <div class="col-md-2">
                    原籍地址:
                  </div>
                  <div class="col-md-4">
                    {{userInfo.address || '无'}}
                  </div>
                </div>
                <div class="row">
                  <div  v-if="position === '会长' || position === '秘书长'">
                    <div class="col-md-2">
                      特殊身份:
                    </div>
                    <div class="col-md-4">
                      {{userInfo.identity || '无'}}
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2">
                    个人简历:
                  </div>
                  <div class="col-md-4">
                    {{userInfo.resume || '无'}}
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
      <!--公司信息详情-->
      <div class="modal fade" id="myDetailProduct" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
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
                  <div class="col-md-6 file">
                    <img :src="'https://cs.royalsecurity.cn/production/' + productInfo.picture">
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
    </section>
</template>
<script>
import $ from 'jquery'
import pagingDiv from './pagingComponent/paging'
import {APP_CONSTANT} from '../../static/js/app.constant'
export default {
  name: 'detailPage',
  components: {
    'pagingDiv': pagingDiv
  },
  data () {
    return {
      industry: [], // 行业分会
      eTime: 2099,
      msg: 1,
      downloadUrl: '', // 下载地址
      tableInfos: [],
      fail: false,
      roleId: localStorage.getItem('GSLBackendRoleid'),
      userInfo: {
        nickname: localStorage.getItem('GSLNickname'),
        company: localStorage.getItem('GSLConame')
      },
      company: '',
      productInfo: {
        picture: 'no-picture.png'
      },
      allPosition: [
        '会员',
        '会长',
        '副会长',
        '理事长',
        '执行会长',
        '常务副会长',
        '常务理事',
        '理事',
        '监事长',
        '监事',
        '秘书长',
        '副秘书长',
        '秘书',
        '名誉会长',
        '名誉监事长'
      ],
      position: localStorage.getItem('GSLBackendPosition'),
      groups: [{
        name: '123',
        value: '11'
      }], // 商会信息
      stateControl: {
        paging: true
      },
      widthResult: [],
      errorMsg: '导入错误'
    }
  },
  mounted () {
    var that = this
    if (this.userInfo.nickname === 'null') {
      this.userInfo.nickname = '匿名'
    }
    this.position = localStorage.getItem('GSLBackendPosition')
    if (location.hash) {
      var hash = location.hash
      if (hash.split('#').length > 1) {
        var url = hash.split('#')[1].split('/')
        let newHash
        if (url.length > 2) {
          newHash = url[2]
          $('.first-list>li').removeClass('active-menu')
          $('#main-menu>li').removeClass('active-menu')
          // $('.first-list>li.userManage').addClass('active-menu')
          if ($('.first-list>li.' + newHash).parent().parent().hasClass('first-list')) {
            $('.first-list>li.' + newHash).parent().parent().addClass('active-menu')
            $('.first-list>li.' + newHash).addClass('active-menu')
          } else {
            $('#main-menu>li.' + newHash).addClass('active-menu')
          }
        }
      }
    } else {
      // this.$router.push({path: '/login'})
    }
    setInterval(function () {
      var time = new Date() // 程序计时的月从0开始取值后+1
      var m = time.getMonth() + 1
      var t = time.getFullYear() + '-' + m + '-' +
        time.getDate() + ' ' + time.getHours() + ':' +
        time.getMinutes() + ':' + time.getSeconds()
      that.eTime = t
    }, 1000)
    this.request(
      '/user/selectOne',
      'POST',
      JSON.stringify({
        id: localStorage.getItem('GSLBackendUid')
      }),
      function sCallback (res, that) {
        if (res.code === 200) {
          localStorage.setItem('GSLBackendCoId', res.data.userDto.coid)
          localStorage.setItem('GSLBackendPosition', res.data.userDto.position)
          that.userInfo = res.data.userDto
        }
        console.log(res)
      },
      function (res, that) {
        console.log(res)
        if (res.status === 401 || res.status === 500) {
          $('#loading').modal('hide')
          that.$router.push({path: '/login'})
        }
      }
    )
    // 查询商会信息
    this.request(
      '/business/select',
      'GET',
      {},
      function (res, that) {
        console.log(res)
        that.groups = res.data.businesses
      }
    )
    // 查询行业分会信息
    this.request(
      '/industry/select',
      'GET',
      {},
      function (res, that) {
        console.log(res)
        that.industry = res.data.businesses
      }
    )
    // 查询信息下载信息
    this.request(
      '/activity/exportactivity',
      'POST',
      {},
      function (res, that) {
        console.log(res)
        if (res.response === 'success') {
          that.downloadUrl = res.data.url
        }
      }
    )
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
     *  一级菜单点击
     * @return {Object} 返回值描述
    */
    menuClick: function () {
      event.stopPropagation()
      if ($(event.currentTarget).hasClass('first-list')) {
        if ($(event.currentTarget).children('.first-list').hasClass('in')) {
          $(event.currentTarget).children('.first-list').removeClass('in')
          $(event.currentTarget).removeClass('active')
        } else {
          $(event.currentTarget).addClass('active')
          $(event.currentTarget).children('.first-list').addClass('in')
        }
      } else {
        $('.first-list>li.active-menu').removeClass('active-menu')
        $('#main-menu>li.active-menu').removeClass('active-menu')
        if ($(event.currentTarget).parent().parent().hasClass('first-list')) {
          $(event.currentTarget).parent().parent().addClass('active-menu')
        }
        $(event.currentTarget).addClass('active-menu')
      }
      console.log(event.currentTarget)
    },
    /**
     * 函数描述
     *  更新行业分区
     * @param {object} data 参数1的说明 成功的回调函数
     * @return {Object} 返回值描述
    */
    updateIndustry (data) {
      this.industry = data
    },
    /**
     * 函数描述
     *  更新下级商会
     * @param {object} data 参数1的说明 成功的回调函数
     * @return {Object} 返回值描述
    */
    updateGroups (data) {
      this.groups = data
    },
    /**
     * 函数描述
     *  测试
     * @return {null} 返回值描述 无
    */
    test () {
      if (this.userInfo.username === '' ||
      this.userInfo.userpwd === '' ||
      this.userInfo.nickname === '' ||
      this.userInfo.name === '' ||
      this.userInfo.taxId === '' ||
      this.userInfo.phone === '') {
        this.errorMsg = '请填写完整'
        this.fail = true
        return false
      } else {
        this.errorMsg = ''
        this.fail = false
        return true
      }
    },
    toChange (e, id) {
      this.fail = false
      this.productInfo.picture = 'no-picture.png'
      $('#loading').modal('show')
      this.request(
        '/com/selectOne',
        'POST',
        JSON.stringify({
          uid: localStorage.getItem('GSLBackendUid')
        }),
        function (res, that) {
          $('#loading').modal('hide')
          console.log(res)
          if (res.data.companyDto) {
            that.productInfo = res.data.companyDto
          } else {
            that.productInfo = {
              picture: 'no-picture.png'
            }
          }
          console.log(that.productInfo)
          $('#myDetailProduct').modal('show')
        },
        function () {
          $('#loading').modal('hide')
        }
      )
    },
    confirmChangeCompany () {
      $('.alert').alert('close')
      console.log(this.test())
      if (this.productInfo.name === '' ||
      this.productInfo.taxId === '') {
        this.errorMsg = '请填写完整'
        this.fail = true
        return
      } else {
        this.errorMsg = ''
        this.fail = false
        // return true
      }
      // console.log()
      $('#loading').modal('show')
      this.request(
        '/com/update',
        'POST',
        JSON.stringify(this.productInfo),
        function (res, that) {
          $('#loading').modal('hide')
          if (res.code === 200) {
            $('#changeCompany').modal('hide')
            alert(res.msg)
            // $('.searchBody').prepend(that.success)
            $(document).scrollTop(0)
            // that.search()
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
     *  行业分会id处理
     * @return {string} 返回值描述 行业分会字段
    */
    handleIndustry (id) {
      let result
      this.industry.forEach(function (v, k) {
        if (v.id === id) {
          result = v.industryName
        }
      })
      return result
    },
    user: function () {
      this.fail = false
      $('#loading').modal('show')
      this.request(
        '/user/selectOne',
        'POST',
        JSON.stringify({
          id: localStorage.getItem('GSLBackendUid')
        }),
        function (res, that) {
          $('#loading').modal('hide')
          console.log(res)
          that.userInfo = res.data.userDto
          $('#myDetailUser').modal('show')
        },
        function () {
          $('#loading').modal('hide')
        }
      )
      // $('#userInfo').modal('show')
    },
    confirmUserChange () {
      $('.alert').alert('close')
      console.log(this.test())
      if (!this.test()) {
        return
      }
      $('#loading').modal('show')
      this.request(
        '/user/update',
        'POST',
        JSON.stringify(this.userInfo),
        function (res, that) {
          $('#loading').modal('hide')
          if (res.code === 200) {
            $('#userInfo').modal('hide')
            alert(res.data.msg)
            // $('.searchBody').prepend(that.success)
            // console.log(res)
            // that.search()
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
    typeConfirm: function () {
      var that = this
      var result = this.widthResult1
      result.top = Number(result.top)
      result.left = Number(result.left)
      $.ajax({
        url: APP_CONSTANT.API_HOST_CLIENT + '/invoicing/inv/margins',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(result),
        success: function (res) {
          if (res.code === 200) {
            $('#print').modal('hide')
            $('#success').modal('show')
          } else {
            that.fail = true
            that.errorMsg = res.errmsg
          }
        },
        error: function () {
          that.fail = true
          that.errorMsg = '修改失败'
        }
      })
    },
    secondMenuClick: function () {
      event.stopPropagation()
      $('.first-list>li.active-menu').removeClass('active-menu')
      $('#main-menu>li.active-menu').removeClass('active-menu')
      $(event.currentTarget).addClass('active-menu')
    },
    loginOut: function () {
      $('#loginOut').modal('show')
    },
    loginOutSure: function () {
      $('#loginOut').modal('hide')
      // var that = this
      this.$router.push({path: '/login'})
      // return
      // this.$router.push({path: '/login'})
    },
    toConfig: function () {
      this.fail = false
      $('#config').modal('show')
    },
    toRecord: function () {
      $('#record').modal('show')
    },
    toAuthority: function () {
      $('#authority').modal('show')
    },
    finishActivation: function () {
      var that = this
      that.fail = false
      $.ajax({
        url: APP_CONSTANT.API_HOST_CLIENT + '/activate',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(this.jhm),
        success: function (res) {
          if (res.errcode === '00') {
            $('#activation').modal('hide')
            $('#success').modal('show')
          } else {
            if (res.errcode === '03') {
              that.$router.push({path: '/login'})
            }
          }
        },
        error: function (res) {
          that.fail = true
        }
      })
    },
    registration: function () {
      this.fail = false
      $('#registration').modal('show')
    },
    toCode: function () {
      $('#code').modal('show')
    },
    typeChange: function () {
      console.log(this.printType)
      this.widthResult1.top = this.widthResult[this.widthResult1.fplxdm].top
      this.widthResult1.left = this.widthResult[this.widthResult1.fplxdm].left
    },
    finishRegistration: function () {
      var that = this
      that.fail = false
      $.ajax({
        url: APP_CONSTANT.API_HOST_CLIENT + '/drzcm',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({zcm: this.zcm}),
        success: function (res) {
          if (res.errcode === '00') {
            $('#registration').modal('hide')
            $('#success').modal('show')
          } else {
            if (res.errcode === '03') {
              that.$router.push({path: '/login'})
            }
            that.errorMsg = res.errmsg
            that.fail = true
          }
        },
        error: function (res) {
          that.errorMsg = res.errmsg
          that.fail = true
        }
      })
    },
    fileUpload () {
      console.log('change')
      console.log($('#txtFile').val())
      if ($('#txtFile')[0].files[0]) {
        if ($('#txtFile')[0].files[0].name.indexOf('.txt') !== -1) {
          this.name = $('#txtFile')[0].files[0].name
        } else {
          this.fail = true
          this.name = null
        }
      } else {
        this.fail = true
        this.name = null
      }
    },
    submit () {
      $('alert').alert('close')
      this.fail = false
      var that = this
      if ($('#txtFile')[0].files[0]) {
        var application = ($('#txtFile')[0].files[0].name).split('.')
        if (application[application.length - 1] !== 'txt') {
          this.fail = true
        } else {
          var formData = new FormData()
          formData.append('uploadFile', $('#txtFile')[0].files[0])
          $.ajax({
            url: APP_CONSTANT.API_HOST_CLIENT + '/activate',
            type: 'POST',
            cache: false,
            data: formData,
            processData: false,
            contentType: false,
            success: function (res) {
              if (res.errcode === '00') {
                $('#activation').modal('hide')
                $('#success').modal('show')
              } else {
                if (res.errcode === '03') {
                  that.$router.push({path: '/login'})
                }
                that.errorMsg = res.errmsg
                that.fail = true
              }
            }
          })
        }
      } else {
        that.fail = true
      }
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
        '/user/update',
        'POST',
        JSON.stringify(this.userInfo),
        function (res, that) {
          // $('#loading').modal('hide')
          $('#changeUser').modal('hide')
          if (res.code === 200) {
            $('.searchBody').prepend(that.success)
            console.log(res)
            // that.search()
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
    }
  }
}
console.log('初始化')
</script>

<style scoped>
  @import '/css/font-awesome.css';
  .right{
    text-align: right;
  }
  #userInfo>.modal-dialog, #changeCompany>.modal-dialog{
    width: 80%
  }
  /*----------------------------------------------
      COMMON  STYLES
  ------------------------------------------------*/
  .row div{
    line-height: 34px;
  }
  .user-info{
    background: url("../../static/img/user-img-background.jpg") no-repeat;
    height: 140px;
    color: #fff;
  }
  .row{
    margin-bottom: 15px;
  }
  select{
    width: 100%;
  }
  body {
    font-family: 'Open Sans', sans-serif;
    background: #323232;
    padding: 0!important;
  }
  a{
    cursor: pointer;
  }
  #config>.modal-dialog, #record>.modal-dialog{
    width: 90%;
  }
  #wrapper {
    width: 100%;
    background: rgb(233, 233, 233);
    font-family: 'Open Sans', sans-serif;
    overflow: hidden;
  }
  #page-wrapper {
    padding: 15px 15px;
    min-height: 700px;
    background: rgb(233, 233, 233);
    margin-bottom: 55px!important;
  }
  h1{
    margin-top: 0!important;
  }
  .header .container-fluid{
    padding:0;
  }
  .text-center {
    text-align:center;
  }
  .no-boder {
    border:1px solid #f3f3f3;
  }

  h1, .h1, h2, .h2, h3, .h3 {
    margin-top: 7px;
    margin-bottom: -5px;
  }
  h2 {
    color: #000;
  }
  h4 {
    padding-top:10px;
  }
  p {
    font-size:16px;
    line-height:25px;
    padding-top:20px;
  }
  .navbar-side {
    z-index: 0;
  }

  .navbar-side .nav > li > a > i{
    color: #747474;
    padding: 8px;
    width: 30px;
    text-align: center;
  }
  .top-navbar{
    position: fixed;
    width: 100%;
    z-index: 300;
    -webkit-box-shadow: 0 3px 3px rgba(0, 0, 0, 0.05);
    -moz-box-shadow: 0 3px 3px rgba(0, 0, 0, 0.05);
    box-shadow: 0 3px 3px rgba(0, 0, 0, 0.05);
  }
  .navbar-side {
    z-index: 1;
    position: fixed;
    width: 260px;
    top: 60px;
  }
  #page-wrapper {
    position: relative;
    top: 60px;
    box-shadow: 0 0 10px #757575;
    -moz-box-shadow: 0 0 10px #757575;
    -webkit-box-shadow: 0 0 10px #757575;
  }
  .top-navbar .nav > li > a:hover, .top-navbar .nav > li > a:focus {
    text-decoration: none;
    background-color: #2497BA;
    color: #fff;
  }
  .nav .open > a, .nav .open > a:hover, .nav .open > a:focus {
    background-color: #075CB3;
    border-color: #075CB3;
  }
  .dropdown-menu>li>a {
    display: block;
    padding: 3px 20px;
    clear: both;
    font-weight: 400;
    line-height: 1.42857143;
    color: #333;
    white-space: nowrap;
    font-size: 13px;
  }
  .dropdown-menu>li>a i {
    color: #1F1F1F;
  }
  .text-muted {
    color: #FB5651;
  }
  .badge {
    display: inline-block;
    min-width: 10px;
    padding: 4px 7px;
    font-size: 11px;
    font-weight: 700;
    color: #fff;
    text-align: center;
    white-space: nowrap;
    vertical-align: baseline;
    background-color: #F09B22;
    border-radius: 10px;
  }
  .closed{
    -ms-transform: rotate(180deg); /* IE 9 */
    -webkit-transform: rotate(180deg); /* Chrome, Safari, Opera */
    transform: rotate(180deg);
  }
  .closed i{color:#F09B22;
  }
  /*----------------------------------------------
     DASHBOARD STYLES
  ------------------------------------------------*/
  .page-header {
    padding-bottom: 9px;
    margin: 0;
    border-bottom: 1px solid transparent;
    text-align: left;background-color: rgb(237, 237, 237);padding: 32px 22px 32px 15px;color: #323232;}
  .panel-left{
    width: 100px;
    height: 100px;background: #0866C6;/* border: 2px solid #4590DA; */
    /* border-radius: 100%; */
    overflow: hidden;

    margin: 12px;}
  .panel-left .fa-5x {
    font-size: 3em;color: rgb(240, 155, 34);
    padding: 29px 0;
    margin-bottom:30px;}
  .panel-right{
    height: 124px;
    background: transparent;
    margin-bottom: 0;color: #AFAFAF;

    float: left;text-align: left;padding-left: 20px;font-size: 16px;text-shadow: none;font-weight: normal;text-align: center;}
  .panel-right h3{
    font-size: 40px;
    padding: 18px 10px 13px 0;color: #5D5D5D;}
  .panel-right strong{
    font-weight:normal;
    color: #737373;
  }
  .panel-back {
    background-color:#fff;

  }
  .panel-default {
    border-color: #ECECEC;
  }
  .panel-default > .panel-heading {color: #555;
    border-color: #FFF;
    font-weight:bold;background: #FFFFFF;
    font-size: 16px;
    text-shadow: none;}
  .panel-heading {
    /* padding: 15px 15px 0px; */
    border-bottom: 1px solid transparent;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
  }
  .jumbotron{
    padding:20px;
  }
  .jumbotron p {
    margin-bottom: 15px;
    font-size: 15px;
    font-weight: 200;
  }
  .jumbotron, .well{
    background:#fff;
  }
  .noti-box {
    min-height: 100px;
    padding: 20px;
  }

  .noti-box .icon-box {
    display: block;
    float: left;
    margin: 0 15px 10px 0;
    width: 70px;
    height: 70px;
    line-height: 75px;
    text-align: center;
    font-size: 40px;
  }
  .text-box p{
    margin: 0 0 3px;
  }
  .green {
    /* background-color: #1CC09F; */
    color: #fff;
  }
  .blue {background-color: #FFFFFF;color: #002A4C;}
  .red {
    color: #FB6E51;
  }
  .brown {
    background-color: #F5B252;
    color:#fff;
  }
  .back-footer-red {
    background-color: #F0433D;
    color:#fff;
    border-top: 0px solid #fff;
  }

  .icon-box-right {
    display: block;
    float: right;
    margin: 0 15px 10px 0;
    width: 70px;
    height: 70px;
    line-height: 75px;
    text-align: center;
    font-size: 40px;
  }

  .main-temp-back {
    background: #8702A8;
    color: #FFFFFF;
    font-size: 16px;
    font-weight: 300;
    text-align: center;
  }
  .main-temp-back .text-temp {
    font-size: 40px;
  }
  .back-dash {
    padding:20px;
    font-size:20px;
    font-weight:500;
    -webkit-border-radius: 0px;
    -moz-border-radius: 0px;
    border-radius: 0px;
    background-color:#2EA7EB;
    color:#fff;
  }
  .back-dash p {
    padding-top:16px;
    font-size:13px;
    color:#fff;
    line-height:25px;
    text-align:justify;
  }

  .color-bottom-txt {
    color: #000;
    font-size: 16px;
    line-height: 30px;
  }
  /*CHAT PANEL*/
  /*Charts*/

  .main-chart {
    background: #fff;
  }

  .easypiechart-panel {
    text-align: center;
    padding: 1px 0;
    margin-bottom: 20px;
  }

  .placeholder h2 {
    margin-bottom: 0px;
  }

  .easypiechart .percent {
    display: block;
    position: absolute;
    font-size: 26px;
    top: 38px;
    width: 120px;
  }

  #easypiechart-blue .percent { color: #30a5ff;}
  #easypiechart-teal .percent { color: #1ebfae;}
  #easypiechart-orange .percent { color: #ffb53e;}
  #easypiechart-red .percent { color: #ef4040;}

  .chat-panel .panel-body {
    height: 450px;
    overflow-y: scroll;
  }
  .chat-box {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .chat-box li {
    margin-bottom: 15px;
    padding-bottom: 5px;
    border-bottom: 1px dotted #808080;
  }
  .chat-box li.left .chat-body {
    margin-left: 90px;
  }
  .chat-box li .chat-body p {
    margin: 0;
    color: #8d8888;
  }
  .chat-img>img {
    margin-left:20px;
  }
  footer p{
    font-size: 14px;
  }
  /*----------------------------------------------
      MENU STYLES
  ------------------------------------------------*/
  div#sideNav:hover {
    color: #F09B22;
  }
  .user-image {
    margin: 25px auto;
    -webkit-border-radius: 10px;
    -moz-border-radius: 10px;
    border-radius: 10px;
    max-height:170px;
    max-width:170px;
  }
  .top-navbar{
    margin:0px;
  }
  .top-navbar .navbar-brand {
    color: #fff;
    width: 260px;
    text-align: left;
    height: 60px;
    font-size: 18px;
    font-weight: 700;
    /* text-transform: uppercase; */
    line-height: 30px;background: #f44336;
  }
  .navbar-brand b{
    color: #4BD28C;
  }
  .top-navbar .nav > li {
    position: relative;
    display: inline-block;
    margin: 0px;
    padding: 0px;
  }
  .top-navbar .nav > li > a {
    position: relative;
    display: block;
    padding: 20px;color: #FFFFFF;
    margin: 0px;}
  .top-navbar .nav > li > a:hover, .top-navbar .nav > li > a:focus {
    text-decoration: none;
    /* color: #319DB5 !important; */
    background: transparent;
  }
  .top-navbar .dropdown-menu{
    min-width: 230px;
    border-radius: 0 0 4px 4px;
    border: 0;}
  .top-navbar .dropdown-menu > li > a:hover, .top-navbar .dropdown-menu > li > a:focus{
    color: #225081;
    background:none;
  }
  .dropdown-tasks{
    width: 255px;
  }
  .dropdown-tasks .progress {
    height: 8px;
    margin-bottom: 8px;
    overflow: hidden;
    background-color: #f5f5f5;
    border-radius: 0px;
  }
  .dropdown-tasks > li > a {
    padding: 0px 15px;
  }
  .dropdown-tasks p {
    font-size: 13px;
    line-height: 21px;
    padding-top: 4px;
  }
  .active-menu, .active-menu i ,.active-menu>a{
    /*background-color: #F44336 !important;*/
    color: #F44336 !important;
  }
  .active-menu > a > i{color: #f44336 !important;}
  .arrow {
    float: right;
    margin-top: 8px;
  }

  .fa.arrow:before {
    content: "\f104";
  }

  .active > a > .fa.arrow:before {
    content: "\f107";
  }

  .nav-second-level li,
  .nav-third-level li {
    border-bottom: none !important;
  }

  .nav-second-level li a {
    padding-left: 37px;
  }

  .nav-third-level li a {
    padding-left: 55px;
  }
  .sidebar-collapse , .sidebar-collapse .nav{
    background:none;
  }
  .sidebar-collapse .nav {
    padding:0;
  }
  .sidebar-collapse .nav > li > a {
    color: #747474;
    background:transparent;
    text-shadow:none;
  }
  .sidebar-collapse > .nav > li > a {
    padding: 12px 10px;
  }
  .sidebar-collapse > .nav > li {
    border-bottom: 1px solid rgba(107, 108, 109, 0.19);
  }
  ul.nav.nav-second-level.collapse.in {background: #ccc;}
  .sidebar-collapse .nav > li > a:hover,
  .sidebar-collapse .nav > li > a:focus {

    outline:0;
  }

  .navbar-side {
    border:none;
    background: #fff;
    color: #747474;
    height: 100%;
  }
  .top-navbar {
    background: #fff;
    border-bottom:none;
  }
  .top-navbar .nav > li > a > i {
    margin-right: 2px;
  }
  .top-navbar{
    background: #F44336;
    color: #fff;
  }
  /* .top-navbar .navbar-brand:hover { */
    /* color: #F44336;background-color: #FFB53E; */
  /* } */
  .dropdown-user li {
    margin: 8px 0;
  }
  .navbar-default {
    border:0px solid black;

  }
  .navbar-header {
    background: transparent;
  }
  .navbar-default .navbar-toggle:hover, .navbar-default .navbar-toggle:focus {
    background-color: #283643;
  }
  .navbar-default .navbar-toggle {
    border-color: #fff;
  }

  .navbar-default .navbar-toggle .icon-bar {
    background-color: #FFF;
  }
  .nav > li > a > i {
    margin-right:10px;
    color: #000;
  }
  .dropdown-menu>li>a>strong {
    color: #0866C6;
    padding: 5px 0;
    display: inline-block;
    font-weight: 500;
  }
  #sideNav{
    float: left;
    left: 0;
    z-index: 3;
    color: #868686;
    cursor:pointer;
    border-radius: 0;
    width: 14px;
    font-size: 48px;
    line-height: 0;
    margin: 7px 0 0 20px;
  }
  ul.dropdown-menu.dropdown-messages li a div {
    padding: 2px 0;
  }
  /*----------------------------------------------
      UI ELEMENTS STYLES
  ------------------------------------------------*/
  .btn-circle {
    width: 50px;
    height: 50px;
    padding: 6px 0;
    -webkit-border-radius: 25px;
    -moz-border-radius: 25px;
    border-radius: 25px;
    text-align: center;
    font-size: 12px;
    line-height: 1.428571429;
  }

  /*----------------------------------------------
      MEDIA QUERIES
  ------------------------------------------------*/

  @media(min-width:768px) {
    #page-wrapper{
      margin: 0 0 0 260px;
      padding: 0;
      min-height: 950px;
    }
    .navbar-side {
      width: 260px;
      z-index: 1;
    }

    .navbar {
      border-radius: 0px;
    }

  }
  @media(max-width:768px) {
    #sideNav{
      display:none;
    }
    #page-wrapper {
      position: relative;
      top: 93px;
    }
  }
  @media(max-width:480px) {
    nav{
      display: none;
    }
    #page-wrapper {
      position: relative;
      top: 60px;
    }
    .page-header small {
      display: block;
      padding-top: 14px;
      font-size: 19px;
    }
    #sideNav{
      display:none;
    }
    .panel-left {
      width: 85px;
      height: 85px;
      border-radius: 100%;
      overflow: hidden;
      margin: 14px;
    }
  }
  #addProduct .modal-dialog,
  #changeProduct .modal-dialog,
  #myDetailProduct .modal-dialog,
  #myDetailUser .modal-dialog{
    width: 90%;
  }
  .navbar-side{
    overflow: scroll;
    padding-bottom: 50px;
  }
</style>
