<template>
    <div class="container searchBody">
      <!--<div @click="change">条件查询</div>-->
      <section class="searchCondition container" >
        <h1>活动管理</h1>
        <div class="container">
          <div class="userSearch">
            <div class="row">
              <div class="col-md-2 col-sm-4">活动名称</div>
              <div class="col-md-4">
                <div class="btn-group data">
                  <input class="form-control" name="name" placeholder="请输入关键字搜索" type="text" v-model="searchInfo.activityName">
                </div>
              </div>
              <div v-show="roleId === '3'">
                <div class="col-md-2 col-sm-4">活动类型</div>
                <div class="col-md-4">
                  <div class="btn-group data">
                    <select name="group" id="group" class="form-control" v-model="searchInfo.activityType">
                      <option value="">全部</option>
                      <option value="1">生活类</option>
                      <option value="2">商品采购类</option>
                      <option value="3">商会生活类</option>
                      <option value="4">学习类</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                提示: 默认查找全部，您也可以选择组合查询
              </div>
              <div class="col-md-6">
                <button class="btn btn-warning" @click="search">搜索</button>
                <button class="btn btn-primary" v-show="roleId === '3'" @click="toAdd">新增活动</button>
                <!-- <button class="btn btn-primary" v-show="roleId === '3'" @click="downloadCode">下载二维码</button> -->
                <!-- <button class="btn btn-primary" v-show="roleId === '3'" @click="toAdd">批量导入</button> -->
              </div>
            </div>
          </div>
          <div class="row">
            <table class="table table-bordered" v-show="stateControl.tableShow">
              <thead>
              <tr>
                <th></th>
                <th>活动名称</th>
                <th>审批状态</th>
                <th>开始时间</th>
                <th>结束时间</th>
                <th style="width:185px">操作</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(item, index) in tableInfos" v-bind:key="index">
                <td>{{index + 1}}</td>
                <td>
                  {{item.activityName}}
                </td>
                <td>{{item.approval===0?'待审批':(item.approval===1?'审批通过':'审批未通过')}}</td>
                <td>{{timestampToTime(item.startTime)}}</td>
                <td>{{timestampToTime(item.endTime)}}</td>
                <td style="text-align: center">
                  <button class="btn btn-primary" v-show="item.id" @click="toDetail($event, item.id)">详情</button>
                  <button class="btn btn-danger" v-show="(item.id && (roleId === '3'))" @click="toDelete(item.id)">删除</button>
                  <button class="btn btn-warning" v-show="item.approval===0" @click="toAllow(item.id)">审批</button>
                  <button class="btn btn-danger" v-show="(item.id && (roleId === '3'))" @click="downloadCode(item.id)">二维码查看</button>
                  <span v-show="!item.id">无</span>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <pagingDiv :child-msg="msg" @upup="pageChange" v-show="stateControl.paging"></pagingDiv>
      <!--添加活动信息-->
      <div class="modal fade" id="addActivity" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-hidden="true">
                &times;
              </button>
              <h4 class="modal-title">
                新增活动
              </h4>
            </div>
            <div class="modal-body">
              <form class="container" id="addActivityInfo">
                <div class="row">
                  <div class="col-md-2">
                    <span class="red">*</span>活动名称:
                  </div>
                  <div class="col-md-4">
                    <input class="form-control" type="text" v-model="activityInfo.activityName">
                  </div>
                  <div class="col-md-2"><span class="red">*</span>活动类型:</div>
                  <div class="col-md-4">
                    <select class="form-control" v-model="activityInfo.activityType">
                      <option value="1">生活类</option>
                      <option value="2">商品采购类</option>
                      <option value="3">商会活动类</option>
                      <option value="4">学习类</option>
                    </select>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2">
                    <span class="red">*</span>活动地点:
                  </div>
                  <div class="col-md-4">
                    <input class="form-control" type="text" maxlength="20" v-model="activityInfo.activiryLocation">
                  </div>
                  <div class="col-md-2"><span class="red">*</span>发起人账号:</div>
                  <div class="col-md-4">
                    <input class="form-control" type="text" maxlength="20" v-model="activityInfo.initiators">
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2"><span class="red">*</span>发起人所加积分:</div>
                  <div class="col-md-4">
                    <input class="form-control" type="number" maxlength="20" v-model="activityInfo.initiatorBonusPoints">
                  </div>
                  <div class="col-md-2">
                    <span class="red">*</span>签到所加积分:
                  </div>
                  <div class="col-md-4">
                    <input class="form-control" type="number" maxlength="20" v-model="activityInfo.signinBonusPoints">
                  </div>

                </div>
                <div class="row">
                  <div class="col-md-2"><span class="red">*</span>签退所加积分:</div>
                  <div class="col-md-4">
                    <input class="form-control" type="number" maxlength="20" v-model="activityInfo.signoffBonusPoints">
                  </div>
                  <div class="col-md-2">
                    <span class="red">*</span>评价基础积分:
                  </div>
                  <div class="col-md-4">
                    <input class="form-control" type="number" maxlength="20" v-model="activityInfo.evaluateBonusPoints">
                  </div>

                </div>
                <div class="row">
                  <div class="col-md-2">
                    <span class="red">*</span>活动时间:
                  </div>
                  <div class="col-md-10">
                    <el-date-picker
                      v-model="time"
                      type="datetimerange"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      format="yyyy 年 MM 月 dd 日 HH:mm"
                      value-format="yyyy-MM-dd HH:mm">
                    </el-date-picker>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2">
                    <span class="red">*</span>活动简介:
                  </div>
                  <div class="col-md-6">
                    <textarea class="form-control" cols="100" rows="50" v-model="activityInfo.activityContent"></textarea>
                    <!-- <input class="form-control" type="text" maxlength="100" v-model="activityInfo.activityContent"> -->
                  </div>
                </div>
                <div class="row">
                  提示: 多个发起人账号用','分割
                </div>
                <div class="row" v-show="fail" style="color: red;margin: 15px 0 0">
                  {{errorMsg}}
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-default" data-dismiss="modal">关闭
              </button>
              <button type="button" class="btn btn-primary" @click="confirmAdd">
                确认
              </button>
            </div>
          </div><!-- /.modal-content -->
        </div><!-- /.modal -->
      </div>
      <!--活动信息详情-->
      <div class="modal fade" id="detailUser" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-hidden="true">
                &times;
              </button>
              <h4 class="modal-title">
                活动详情
              </h4>
            </div>
            <div class="modal-body">
              <form class="container" id="ctivityInfo">
                <div class="row">
                  <div class="col-md-2">
                    <span class="red">*</span>活动名称:
                  </div>
                  <div class="col-md-4">
                    {{activityInfo.activityName}}
                  </div>
                  <div class="col-md-2"><span class="red">*</span>活动类型:</div>
                  <div class="col-md-4">
                    <!-- {{}} -->
                    {{activityType}}
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2">
                    <span class="red">*</span>活动地点:
                  </div>
                  <div class="col-md-4">
                    {{activityInfo.activiryLocation}}
                  </div>
                  <div class="col-md-2"><span class="red">*</span>发起人:</div>
                  <div class="col-md-4">
                    {{userManage(activityInfo.activityInitiator)}}
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2"><span class="red">*</span>发起人所加积分:</div>
                  <div class="col-md-4">
                    {{activityInfo.initiatorBonusPoints}}
                  </div>
                  <div class="col-md-2">
                    <span class="red">*</span>签到所加积分:
                  </div>
                  <div class="col-md-4">
                    {{activityInfo.signinBonusPoints}}
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2"><span class="red">*</span>签退所加积分:</div>
                  <div class="col-md-4">
                    {{activityInfo.signoffBonusPoints}}
                  </div>
                  <div class="col-md-2">
                    <span class="red">*</span>评价基础积分:
                  </div>
                  <div class="col-md-4">
                    {{activityInfo.evaluateBonusPoints}}
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2">
                    <span class="red">*</span>活动开始时间:
                  </div>
                  <div class="col-md-4">
                    {{activityInfo.startTime}}
                  </div>
                  <div class="col-md-2">
                    <span class="red">*</span>活动结束时间:
                  </div>
                  <div class="col-md-4">
                    {{activityInfo.endTime}}
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2">
                    <span class="red">*</span>活动简介:
                  </div>
                  <div class="col-md-6">
                    {{activityInfo.activityContent || '暂无'}}
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
      <!--修改活动信息-->
      <!-- <div class="modal fade" id="changeUser" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-hidden="true">
                &times;
              </button>
              <h4 class="modal-title">
                活动详情
              </h4>
            </div>
            <div class="modal-body">
              <form class="container" id="changeActivityInfo">
                <div class="row">
                  <div class="col-md-2">
                    <span class="red">*</span>活动名称:
                  </div>
                  <div class="col-md-4">
                    <input class="form-control" type="text" v-model="activityInfo.activityName">
                  </div>
                  <div class="col-md-2"><span class="red">*</span>活动类型:</div>
                  <div class="col-md-4">
                    <select class="form-control" v-model="activityInfo.activityType">
                      <option value="1">生活类</option>
                      <option value="2">商品采购类</option>
                      <option value="3">商会活动类</option>
                      <option value="4">学习类</option>
                    </select>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2">
                    <span class="red">*</span>活动地点:
                  </div>
                  <div class="col-md-4">
                    <input class="form-control" type="text" maxlength="20" v-model="activityInfo.activiryLocation">
                  </div>
                  <div class="col-md-2"><span class="red">*</span>发起人账号:</div>
                  <div class="col-md-4">
                    <input class="form-control" type="text" maxlength="20" v-model="activityInfo.initiators">
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2"><span class="red">*</span>发起人所加积分:</div>
                  <div class="col-md-4">
                    <input class="form-control" type="text" maxlength="20" v-model="activityInfo.initiatorBonusPoints">
                  </div>
                  <div class="col-md-2">
                    <span class="red">*</span>签到所加积分:
                  </div>
                  <div class="col-md-4">
                    <input class="form-control" type="text" maxlength="20" v-model="activityInfo.signinBonusPoints">
                  </div>

                </div>
                <div class="row">
                  <div class="col-md-2"><span class="red">*</span>签退所加积分:</div>
                  <div class="col-md-4">
                    <input class="form-control" type="text" maxlength="20" v-model="activityInfo.signoffBonusPoints">
                  </div>
                  <div class="col-md-2">
                    <span class="red">*</span>评价基础积分:
                  </div>
                  <div class="col-md-4">
                    <input class="form-control" type="text" maxlength="20" v-model="activityInfo.evaluateBonusPoints">
                  </div>

                </div>
                <div class="row">
                  <div class="col-md-2">
                    <span class="red">*</span>活动开始时间:
                  </div>
                  <div class="col-md-4">
                    <el-date-picker
                      v-model="activityInfo.startTime"
                      type="datetime"
                      placeholder="选择日期时间"
                      format="yyyy 年 MM 月 dd 日 HH:mm"
                      value-format="yyyy-MM-dd HH:mm">
                    </el-date-picker>
                  </div>
                  <div class="col-md-2">
                    <span class="red">*</span>活动结束时间:
                  </div>
                  <div class="col-md-4">
                    <el-date-picker
                      v-model="activityInfo.endTime"
                      type="datetime"
                      placeholder="选择日期时间"
                      format="yyyy 年 MM 月 dd 日 HH:mm"
                      value-format="yyyy-MM-dd HH:mm">
                    </el-date-picker>
                  </div>
                </div>
                <div class="row">
                  提示: 多个发起人账号用','分割
                </div>
                <div class="row" v-show="fail" style="color: red;margin: 15px 0 0">
                  {{errorMsg}}
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-default" data-dismiss="modal">关闭
              </button>
              <button type="button" class="btn btn-primary" @click="confirmChange">
                确认
              </button>
            </div>
          </div>
        </div>
      </div> -->
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
                  <div class="col-md-2">公司宣传图片:</div>
                  <div class="col-md-4 file">
                    <span class="btn btn-success fileinput-button">
                      <span>上传</span>
                      <input type="file" id="pictureUrl"  @change="fileUpload('#pictureUrl', 'img')" accept="image/*">
                    </span>{{productInfo.picture}}
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2">
                    联系人:
                  </div>
                  <div class="col-md-4">
                    <input class="form-control" type="text" v-model="productInfo.linkman">
                  </div>
                  <div class="col-md-2">手机:</div>
                  <div class="col-md-4">
                    <input class="form-control" type="text" v-model="productInfo.phone">
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2">
                    QQ:
                  </div>
                  <div class="col-md-4">
                    <input class="form-control" type="text" v-model="productInfo.qq">
                  </div>
                  <div class="col-md-2">微信:</div>
                  <div class="col-md-4">
                    <input class="form-control" type="text" v-model="productInfo.wechat">
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2">
                    主营产品:
                  </div>
                  <div class="col-md-4">
                    <input class="form-control" type="text" v-model="productInfo.mainProduct">
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
              <button type="button" class="btn btn-primary" @click="confirmChangeCompany">
                确认
              </button>
            </div>
          </div><!-- /.modal-content -->
        </div><!-- /.modal -->
      </div>
      <!--二维码管理-->
      <div class="modal fade" id="codeManage" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
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
              <div class="container">
                <div class="row">
                  <div class="col-md-6">
                    <div class="row">
                      <canvas id="canvas1" :value="signInQCode" :size="138"></canvas>
                    </div>
                    <div class="row">
                      <button class="btn btn-primary" @click="download('canvas2', '签到')">下载签到码</button>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="row">
                      <canvas id="canvas2" :value="signOutQCode" :size="138"></canvas>
                    </div>
                    <div class="row">
                      <button class="btn btn-primary" @click="download('canvas2', '签退')">下载签退码</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-default" data-dismiss="modal">关闭
              </button>
              <button type="button" class="btn btn-primary" @click="confirmChangeCompany">
                确认
              </button>
            </div>
          </div><!-- /.modal-content -->
        </div><!-- /.modal -->
      </div>
      <!--删除-->
      <div class="modal fade" id="deleteUser" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
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
      <div class="modal fade" id="allowActivity" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
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
import QRCode from 'qrcode'
// import QRCode from 'qrcode'
import {APP_CONSTANT} from '../../../static/js/app.constant'
export default {
  name: 'activityPage',
  props: {
    industry: { // 所有行业分会
      type: Array,
      required: true
    },
    groups: { // 所有商会
      type: Array,
      required: true
    },
    allPosition: { // 所有职务
      type: Array,
      required: true
    },
    position: { // 当前活动职务
      type: String
    }
  },
  components: {
    'pagingDiv': pagingDiv,
    'QRCode': QRCode
  },
  data () {
    return {
      msg: 1,
      name: '',
      errorMsg: '',
      fail: false,
      time: '',
      signInQCode: '签到',
      signOutQCode: '签退',
      roleId: localStorage.getItem('GSLBackendRoleid'),
      stateControl: {
        tableShow: true,
        paging: true
      },
      aLabel: document.createElement('a'),
      productInfo: {pictureUrl: 'no-picture.png'},
      searchInfo: {
        activityName: '',
        activityType: '',
        pageSize: '10',
        pageCount: '1'
      },
      activityInfo: {},
      tableInfos: [
        {
          nickname: '暂无',
          // id: '1',
          company: '暂无',
          coname: '暂无'
        }
      ],
      success: '<div class="alert alert-success">\n' +
      '        <a class="close" data-dismiss="alert">&times;</a>\n' +
      '        <strong>成功！</strong>修改成功。\n' +
      '      </div>'
    }
  },
  computed: {
    // 活动类型
    activityType () {
      console.log(this.activityInfo.activityType)
      if (this.activityInfo.activityType + '' === '1') {
        return '生活类'
      } else if (this.activityInfo.activityType + '' === '2') {
        return '商品采购类'
      } else if (this.activityInfo.activityType + '' === '3') {
        return '商会活动类'
      } else if (this.activityInfo.activityType + '' === '4') {
        return '学习类'
      }
    }
  },
  mounted () {
    $(document).scrollTop(0)
    document.body.appendChild(this.aLabel)
    this.search()
    this.useqrcode()
  },
  methods: {
    // 发起人
    userManage (list) {
      console.log(list)
      if (!list) {
        return ''
      }
      var str = ''
      list.forEach(function (val, index) {
        console.log(str)
        str = str + val.nickName + ','
      })
      console.log(str)
      str = str.slice(0, -1)
      console.log(str)
      return str
    },
    // 时间格式转换
    timestampToTime (timestamp) {
      var date = new Date(timestamp) // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + '-'
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
      var D = date.getDate() + ' '
      var h = date.getHours() + ':'
      var m = date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()
      return Y + M + D + h + m
    },
    downloadCode (id) {
      this.signInQCode = id + ',1'
      this.signOutQCode = id + ',2'
      $('#codeManage').modal('show')
      this.useqrcode()
    },
    useqrcode () {
      var canvas1 = document.getElementById('canvas1')
      var canvas2 = document.getElementById('canvas2')
      console.log(this.signInQCode)
      QRCode.toCanvas(canvas1, this.signInQCode, function (error) {
        if (error) console.error(error)
        console.log('success!')
      })
      QRCode.toCanvas(canvas2, this.signOutQCode, function (error) {
        if (error) console.error(error)
        console.log('success!')
      })
    },
    download (type, name) {
      var id = '#' + type
      var canvas = $(id)[0]
      var imgData = canvas.toDataURL('image/png')
      this.aLabel.href = imgData
      this.aLabel.download = name + '二维码'
      this.aLabel.click()
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
      console.log(123)
      this.searchInfo.pageCount = data
      var that = this
      this.request(
        '/user/query',
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
     *  活动查询
     * @return {null} 返回值描述 无
    */
    search () {
      console.log(123)
      $('.alert').alert('close')
      $('#loading').modal('show')
      var that = this
      console.log(localStorage.getItem('GSLUsername'))
      this.request(
        '/activity/all',
        'POST',
        JSON.stringify(this.searchInfo),
        function (res) {
          $('#loading').modal('hide')
          if (res.data.content.length === 0) {
            that.tableInfos = [{
              nickname: '暂无',
              company: '暂无',
              coname: '暂无'
            }]
          } else {
            that.tableInfos = res.data.content
          }
          that.msg = res.data.totalPages
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
    toAdd () {
      this.fail = false
      $('#addActivity').modal({backdrop: 'static', keyboard: false})
      this.activityInfo = {
        'activityName': '',
        'activityType': '1',
        'activiryLocation': '',
        'initiatorBonusPoints': '',
        'signinBonusPoints': '',
        'signoffBonusPoints': '',
        'evaluateBonusPoints': '',
        'startTime': '',
        'endTime': '',
        'initiators': '',
        'activityContent': ''
      }
    },
    toChange (e, id) {
      this.fail = false
      $('#loading').modal({backdrop: 'static', keyboard: false})
      this.request(
        '/user/selectOne',
        'POST',
        JSON.stringify({
          id: id
        }),
        function (res, that) {
          $('#loading').modal('hide')
          console.log(res)
          that.activityInfo = res.data.userDto
          $('#changeUser').modal('show')
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
        '/activity/detail',
        'POST',
        JSON.stringify({
          id: id
        }),
        function (res, that) {
          $('#loading').modal('hide')
          console.log(res)
          if (res.response === 'success') {
            that.activityInfo = res.data
            $('#detailUser').modal('show')
          }
        },
        function () {
          $('#loading').modal('hide')
        }
      )
    },
    toCompany (id) {
      this.fail = false
      $('#loading').modal('show')
      $('#changeCompany').modal('show')
      this.request(
        '/com/selectOne',
        'POST',
        JSON.stringify({
          uid: id
        }),
        function (res, that) {
          $('#loading').modal('hide')
          console.log(res)
          if (res.data.companyDto) {
            that.productInfo = res.data.companyDto
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
    toAllow (id) {
      this.id = id
      $('#allowActivity').modal('show')
    },
    /**
     * 函数描述
     *  确认添加活动
     * @return {null} 返回值描述 无
    */
    confirmAdd () {
      if (this.time.length > 1) {
        this.activityInfo.startTime = this.time[0]
        this.activityInfo.endTime = this.time[1]
      }
      $('.alert').alert('close')
      if (!this.test()) {
        return
      }
      $('#loading').modal('show')
      this.request(
        '/activity/promotional',
        'POST',
        JSON.stringify(this.activityInfo),
        function (res, that) {
          if (res.response === 'success') {
            $('#addActivity').modal('hide')
            $('.searchBody').prepend(that.success)
            that.search()
          } else {
            $('#loading').modal('hide')
            that.fail = true
            that.errorMsg = res.data.msg
          }
        },
        function (res, that) {
          $('#addActivity').modal('hide')
          $('.searchBody').prepend('<div class="alert alert-warning">\n' +
      '        <a class="close" data-dismiss="alert">\n' +
      '          &times;\n' +
      '        </a>\n' +
      '        <strong>警告！</strong>' + res.msg + '。\n' +
      '      </div>')
        }
      )
    },
    /**
     * 函数描述
     *  确认添加活动
     * @return {null} 返回值描述 无
    */
    confirmChange () {
      $('.alert').alert('close')
      if (!this.test()) {
        return
      }
      $('#loading').modal('show')
      this.request(
        '/user/update',
        'POST',
        JSON.stringify(this.activityInfo),
        function (res, that) {
          // $('#loading').modal('hide')
          if (res.code === 200) {
            $('#changeUser').modal('hide')
            $('.searchBody').prepend(that.success)
            console.log(res)
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
     *  确认修改公司信息
     * @return {null} 返回值描述 无
    */
    confirmChangeCompany () {
      $('.alert').alert('close')
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
     *  测试
     * @return {null} 返回值描述 无
    */
    test (isCompany) {
      if (isCompany) {
        console.log(this.productInfo)
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
      } else {
        if (this.activityInfo.activityName === '' ||
        this.activityInfo.activityType === '' ||
        this.activityInfo.activiryLocation === '' ||
        this.activityInfo.initiatorBonusPoints === '' ||
        this.activityInfo.signinBonusPoints === '' ||
        this.activityInfo.signoffBonusPoints === '' ||
        this.activityInfo.evaluateBonusPoints === '' ||
        this.activityInfo.startTime === '' ||
        this.activityInfo.endTime === '' ||
        this.activityInfo.initiators === '') {
          this.errorMsg = '请填写完整'
          this.fail = true
          return false
        } else {
          this.errorMsg = ''
          this.fail = false
          return true
        }
      }
    },
    toDelete (id) {
      this.id = id
      $('#deleteUser').modal('show')
    },
    /**
     * 函数描述
     *  确认删除活动
     * @return {null} 返回值描述 无
    */
    confirmDelete () {
      $('.alert').alert('close')
      $('#loading').modal('show')
      this.request(
        '/activity/remove',
        'POST',
        JSON.stringify({
          id: this.id
        }),
        function (res, that) {
          // $('#loading').modal('hide')
          if (res.response === 'error') {
            $('.searchBody').prepend('<div class="alert alert-warning">\n' +
              '        <a class="close" data-dismiss="alert">\n' +
              '          &times;\n' +
              '        </a>\n' +
              '        <strong>警告！</strong>' + res.data.msg + '。\n' +
              '      </div>')
            $('#deleteUser').modal('hide')
            $('#loading').modal('hide')
          } else if (res.response === 'success') {
            $('#deleteUser').modal('hide')
            $('.searchBody').prepend(that.success)
            console.log(res)
            that.search()
          }
        }
      )
    },
    /**
     * 函数描述
     *  检测图片格式
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
     *  检测excel格式
     * @param {string} ext 参数1的说明 上传文件的格式
     * @return {null} 返回值描述 是excel返回true 不是图片返回false
    */
    checkFileExcel (ext) {
      if (!ext.match(/.xls/i)) {
        return false
      }
      return true
    },
    fileUpload (id, type) {
      var fileExt = $(id)[0].value.substring($(id)[0].value.lastIndexOf('.'))
        .toLowerCase()
      let that = this
      let url = ''
      if (type === 'img' && !this.checkFileExt(fileExt)) {
        alert('您上传的文件不是图片,请重新上传！')
        return
      } else if (type === 'excel' && !this.checkFileExcel(fileExt)) {
        alert('您上传的文件不是xls格式,请重新上传！')
        return
      }
      if ($(id)[0].files && $(id)[0].files[0]) {
        // 限制大小
        if (type === 'img' && ($(id)[0].files[0].size / 1024) > 2048) {
          alert('上传的图片不得大于2m')
          return
        }
        if (type === 'img') {
          url = '/product/addPicture'
        } else {
          $('#loading').modal('show')
          url = '/batch/add'
        }
        var formData = new FormData()
        formData.append('uploadFile', $(id)[0].files[0])
        that.productInfo.picture = '加载中'
        $.ajax({
          url: APP_CONSTANT.API_HOST + url,
          type: 'POST',
          data: formData,
          cache: false,
          contentType: false,
          processData: false, // 序列化处理
          beforeSend: function (XMLHttpRequest) {
            XMLHttpRequest.setRequestHeader('authorization', localStorage.getItem('GSLAuthorization'))
          },
          success (res) {
            $(id).val('')
            if (res.code === 200) {
              if (type === 'img') {
                that.productInfo.picture = res.data.url
              } else {
                if (typeof res.data.list === 'object' && res.data.list.length > 0) {
                  var error = ''
                  res.data.list.forEach((item, index) => {
                    error += ('第' + item + '行,')
                  })
                  error = error.slice(0, error.length - 1)
                  error += '已添加或有误'
                  alert(error)
                  $('#loading').modal('hide')
                }
                $('.searchBody').prepend(that.success)
                setTimeout(
                  function () { that.search() },
                  1000
                )
              }
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
     *  确认审批
     * @return {null} 返回值描述 无
    */
    confirmAllow (state) {
      $('.alert').alert('close')
      $('#loading').modal('show')
      this.request(
        '/activity/approval',
        'POST',
        JSON.stringify({
          activityId: this.id,
          approval: Number(state)
        }),
        function (res, that) {
          // $('#loading').modal('hide')
          if (res.response === 'success') {
            $('#allowActivity').modal('hide')
            $('.searchBody').prepend(that.success)
            that.search()
          } else {
            $('#loading').modal('hide')
            $('.searchBody').prepend('<div class="alert alert-warning">\n' +
              '        <a class="close" data-dismiss="alert">\n' +
              '          &times;\n' +
              '        </a>\n' +
              '        <strong>警告！</strong>' + res.data.msg + '。\n' +
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
  /* line-height: 34px; */
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
  #addActivity .modal-dialog,
  #changeUser .modal-dialog,
  #detailUser .modal-dialog,
  #changeCompany .modal-dialog{
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
  /* 二维码 */
  /* #canvas{
    width: 80%!important;
    height: auto!important;
  } */
</style>
