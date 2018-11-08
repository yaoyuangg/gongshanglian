<template>
    <div class="container searchBody">
      <!--<div @click="change">条件查询</div>-->
      <section class="searchCondition container" >
        <h1>会员管理</h1>
        <div class="container">
          <div class="userSearch">
            <div class="row">
              <div class="col-md-2 col-sm-4">名称</div>
              <div class="col-md-4">
                <div class="btn-group data">
                  <input class="form-control" name="name" placeholder="请输入关键字搜索" type="text" v-model="searchInfo.nickname">
                </div>
              </div>
              <div v-show="roleId === '3'">
                <div class="col-md-2 col-sm-4">所属商会</div>
                <div class="col-md-4">
                  <div class="btn-group data">
                    <select name="group" id="group" class="form-control" v-model="searchInfo.coid">
                      <option value="">—未选择—</option>
                      <option v-for="(item, index) in groups" v-bind:key="index" :value="item.id">{{item.busName}}</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-2 col-sm-4">出生日期</div>
              <div class="col-md-4">
                <div class="btn-group data">
                  <el-date-picker
                    v-model="searchInfo.birthtime"
                    type="date"
                    placeholder="选择日期"
                    format="yyyy 年 MM 月 dd 日"
                    value-format="yyyy-MM-dd">
                  </el-date-picker>
                </div>
              </div>
              <div v-show="roleId === '3'">
                <div class="col-md-2 col-sm-4">会费缴纳时间</div>
                <div class="col-md-4">
                  <div class="btn-group data">
                    <el-date-picker
                      v-model="searchInfo.costtime"
                      type="date"
                      placeholder="选择日期"
                      format="yyyy 年 MM 月 dd 日"
                      value-format="yyyy-MM-dd">
                    </el-date-picker>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-2 col-sm-4">原籍地址</div>
              <div class="col-md-4">
                <div class="btn-group data">
                  <input class="form-control" name="name" placeholder="请输入关键字搜索" type="text" v-model="searchInfo.address">
                </div>
              </div>
              <div v-show="roleId === '3'">
                <div class="col-md-2 col-sm-4">身份</div>
                <div class="col-md-4">
                  <div class="btn-group data">
                    <select name="position" class="form-control"  v-model="searchInfo.position">
                      <option value="">全部</option>
                      <option v-for="item in allPosition" :key="item" :value="item">{{item}}</option>
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
                <button class="btn btn-primary" v-show="roleId === '3'" @click="toAdd">新增用户</button>
                <span class="btn btn-success fileinput-button">
                  <span>批量导入</span>
                  <input type="file" id="excel"  @change="fileUpload('#excel', 'excel')" accept="xls/*">
                </span>
                <!-- <button class="btn btn-primary" v-show="roleId === '3'" @click="toAdd">批量导入</button> -->
              </div>
            </div>
          </div>
          <div class="row">
            <table class="table table-bordered" v-show="stateControl.tableShow">
              <thead>
              <tr>
                <th></th>
                <th>名称</th>
                <th>信誉积分</th>
                <th>活动积分</th>
                <th>所属公司</th>
                <th style="width:185px">操作</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(item, index) in tableInfos" v-bind:key="index">
                <td>{{index + 1}}</td>
                <td>
                  {{item.nickname}}
                </td>
                <td>{{item.integral}}</td>
                <td>{{item.actIntegral}}</td>
                <td>{{item.company || '暂无'}}</td>
                <td style="text-align: center">
                  <button class="btn btn-primary" v-show="item.id" @click="toDetail($event, item.id)">详情</button>
                  <button class="btn btn-warning" v-show="(item.id && (roleId === '3'))" @click="toChange($event, item.id)">修改</button>
                  <button class="btn btn-danger" v-show="(item.id && (roleId === '3'))" @click="toDelete(item.id)">删除</button>
                  <button class="btn btn-danger" v-show="(item.id && (roleId === '3'))" @click="toCompany(item.id)">公司管理</button>
                  <span v-show="!item.id">无</span>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <pagingDiv :child-msg="msg" @upup="pageChange" v-show="stateControl.paging"></pagingDiv>
      <!--添加用户信息-->
      <div class="modal fade" id="addUser" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-hidden="true">
                &times;
              </button>
              <h4 class="modal-title">
                新增用户
              </h4>
            </div>
            <div class="modal-body">
              <form class="container" id="addUserInfo">
                <div class="row">
                  <div class="col-md-2">
                    <span class="red">*</span>账号:
                  </div>
                  <div class="col-md-4">
                    <input class="form-control" type="number" v-model="userInfo.username">
                  </div>
                  <div class="col-md-2"><span class="red">*</span>密码:</div>
                  <div class="col-md-4">
                    <input class="form-control" type="text" v-model="userInfo.userpwd">
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2">
                    <span class="red">*</span>用户名:
                  </div>
                  <div class="col-md-4">
                    <input class="form-control" type="text" maxlength="20" v-model="userInfo.nickname">
                  </div>
                  <div class="col-md-2">性别:</div>
                  <div class="col-md-4">
                    <select class="form-control" v-model="userInfo.sex" name="sex">
                      <option value="0">女</option>
                      <option value="1">男</option>
                    </select>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2">
                    出生日期:
                  </div>
                  <div class="col-md-4">
                    <el-date-picker
                      v-model="userInfo.birthtime"
                      type="date"
                      placeholder="选择日期"
                      format="yyyy 年 MM 月 dd 日"
                      value-format="yyyy-MM-dd">
                    </el-date-picker>
                  </div>
                  <div class="col-md-2">
                    原籍地址:
                  </div>
                  <div class="col-md-4">
                    <input class="form-control" type="text" v-model="userInfo.address">
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2">
                    会费缴纳时间:
                  </div>
                  <div class="col-md-4">
                    <el-date-picker
                      v-model="userInfo.costtime"
                      type="date"
                      placeholder="选择日期"
                      format="yyyy 年 MM 月 dd 日"
                      value-format="yyyy-MM-dd">
                    </el-date-picker>
                  </div>
                  <div class="col-md-2">
                    会费金额:
                  </div>
                  <div class="col-md-4">
                    <input class="form-control" type="text" v-model="userInfo.costSum">
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2">入会推荐人:</div>
                  <div class="col-md-4">
                    <input class="form-control" type="text" v-model="userInfo.referrer">
                  </div>
                  <div class="col-md-2">
                    行业分会:
                  </div>
                  <div class="col-md-4">
                    <select name="group" class="form-control" v-model="userInfo.sonCoid">
                      <option v-for="(item, index) in industry" v-bind:key="index" :value="item.id">{{item.industryName}}</option>
                    </select>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2"><span class="red">*</span>所属商会:</div>
                  <div class="col-md-4">
                    <select name="group" class="form-control" v-model="userInfo.coname">
                      <option v-for="(item, index) in groups" v-bind:key="index" :value="item.busName">{{item.busName}}</option>
                    </select>
                  </div>
                  <div class="col-md-2">
                    <span class="red">*</span>权限:
                  </div>
                  <div class="col-md-4">
                    <select class="form-control" name="role" v-model="userInfo.roleId">
                      <option value="1">普通权限</option>
                      <option value="2">领导权限</option>
                      <option value="3">管理员权限</option>
                    </select>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2"><span class="red">*</span>身份:</div>
                  <div class="col-md-4">
                    <select name="position" class="form-control"  v-model="userInfo.position">
                      <option v-for="item in allPosition" :key="item" :value="item">{{item}}</option>
                    </select>
                    <!-- <input class="form-control" type="text" v-model="userInfo.positon"> -->
                  </div>
                  <div class="col-md-2"><span class="red">*</span>手机:</div>
                  <div class="col-md-4">
                    <input class="form-control" type="text" maxlength="11" v-model="userInfo.phone">
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2">
                    座机:
                  </div>
                  <div class="col-md-4">
                    <input class="form-control" type="text" v-model="userInfo.tel">
                  </div>
                  <div class="col-md-2">QQ:</div>
                  <div class="col-md-4">
                    <input class="form-control" type="text" v-model="userInfo.qq">
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2">
                    微信:
                  </div>
                  <div class="col-md-4">
                    <input class="form-control" type="text" v-model="userInfo.wechat">
                  </div>
                  <div class="col-md-2">特殊身份:</div>
                  <div class="col-md-4">
                    <select class="form-control" name="role" v-model="userInfo.identity">
                      <option value="无">无</option>
                      <option value="友好人士">友好人士</option>
                      <option value="顾问">顾问</option>
                    </select>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2">个人简历:</div>
                  <div class="col-md-6">
                    <textarea class="form-control" name="resume" id="resume"
                      v-model="userInfo.resume"></textarea>
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
              <button type="button" class="btn btn-primary" @click="confirmAdd">
                确认
              </button>
            </div>
          </div><!-- /.modal-content -->
        </div><!-- /.modal -->
      </div>
      <!--用户信息详情-->
      <div class="modal fade" id="detailUser" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
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
                    信誉积分:
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
                  <div v-if="position === '会长' || position === '秘书长'">
                    <div class="col-md-2">
                      特殊身份:
                    </div>
                    <div class="col-md-4">
                      {{userInfo.identity || '无'}}
                    </div>
                  </div>
                  <div class="col-md-2">
                    活动积分:
                  </div>
                  <div class="col-md-4">
                    {{userInfo.actIntegral || '0'}}
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2">
                    个人简历:
                  </div>
                  <div class="col-md-6">
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
      <!--修改用户信息-->
      <div class="modal fade" id="changeUser" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
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
              <form class="container" id="changeUserInfo">
                <div class="row">
                  <div class="col-md-2">
                    <span class="red">*</span>账号:
                  </div>
                  <div class="col-md-4">
                    <input class="form-control" type="number" v-model="userInfo.username">
                  </div>
                  <div class="col-md-2"><span class="red">*</span>密码:</div>
                  <div class="col-md-4">
                    <input class="form-control" type="text" v-model="userInfo.userpwd">
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2">
                    <span class="red">*</span>用户名:
                  </div>
                  <div class="col-md-4">
                    <input class="form-control" type="text" maxlength="20" v-model="userInfo.nickname">
                  </div>
                  <div class="col-md-2">性别:</div>
                  <div class="col-md-4">
                    <select class="form-control" v-model="userInfo.sex" name="sex">
                      <option value="0">女</option>
                      <option value="1">男</option>
                    </select>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2">
                    出生日期:
                  </div>
                  <div class="col-md-4">
                    <el-date-picker
                      v-model="userInfo.birthtime"
                      type="date"
                      placeholder="选择日期"
                      format="yyyy 年 MM 月 dd 日"
                      value-format="yyyy-MM-dd">
                    </el-date-picker>
                  </div>
                  <div class="col-md-2">
                    原籍地址:
                  </div>
                  <div class="col-md-4">
                    <input class="form-control" type="text" v-model="userInfo.address">
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2">
                    会费缴纳时间:
                  </div>
                  <div class="col-md-4">
                    <el-date-picker
                      v-model="userInfo.costtime"
                      type="date"
                      placeholder="选择日期"
                      format="yyyy 年 MM 月 dd 日"
                      value-format="yyyy-MM-dd">
                    </el-date-picker>
                  </div>
                  <div class="col-md-2">
                    会费金额:
                  </div>
                  <div class="col-md-4">
                    <input class="form-control" type="text" v-model="userInfo.costSum">
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2">入会推荐人:</div>
                  <div class="col-md-4">
                    <input class="form-control" type="text" v-model="userInfo.referrer">
                  </div>
                  <div class="col-md-2">
                    行业分会:
                  </div>
                  <div class="col-md-4">
                    <select name="group" class="form-control" v-model="userInfo.sonCoid">
                      <option v-for="(item, index) in industry" v-bind:key="index" :value="item.id">{{item.industryName}}</option>
                    </select>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2"><span class="red">*</span>所属商会:</div>
                  <div class="col-md-4">
                    <select name="group" class="form-control" v-model="userInfo.coname">
                      <option v-for="(item, index) in groups" v-bind:key="index" :value="item.busName">{{item.busName}}</option>
                    </select>
                  </div>
                  <div class="col-md-2">
                    <span class="red">*</span>权限:
                  </div>
                  <div class="col-md-4">
                    <select class="form-control" name="role" v-model="userInfo.roleId">
                      <option value="1">普通权限</option>
                      <option value="2">领导权限</option>
                      <option value="3">管理员权限</option>
                    </select>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2"><span class="red">*</span>身份:</div>
                  <div class="col-md-4">
                    <select name="position" class="form-control"  v-model="userInfo.position">
                      <option v-for="item in allPosition" :key="item" :value="item">{{item}}</option>
                    </select>
                    <!-- <input class="form-control" type="text" v-model="userInfo.positon"> -->
                  </div>
                  <div class="col-md-2"><span class="red">*</span>手机:</div>
                  <div class="col-md-4">
                    <input class="form-control" type="text" maxlength="11" v-model="userInfo.phone">
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2">
                    座机:
                  </div>
                  <div class="col-md-4">
                    <input class="form-control" type="text" v-model="userInfo.tel">
                  </div>
                  <div class="col-md-2">QQ:</div>
                  <div class="col-md-4">
                    <input class="form-control" type="text" v-model="userInfo.qq">
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2">
                    微信:
                  </div>
                  <div class="col-md-4">
                    <input class="form-control" type="text" v-model="userInfo.wechat">
                  </div>
                  <div class="col-md-2">特殊身份:</div>
                  <div class="col-md-4">
                    <select class="form-control" name="role" v-model="userInfo.identity">
                      <option value="无">无</option>
                      <option value="友好人士">友好人士</option>
                      <option value="顾问">顾问</option>
                    </select>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2">个人简历:</div>
                  <div class="col-md-6">
                    <textarea class="form-control" name="resume" id="resume"
                      v-model="userInfo.resume"></textarea>
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
              <button type="button" class="btn btn-primary" @click="confirmChange">
                确认
              </button>
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
    </div>

</template>

<script>
import $ from 'jquery'
import pagingDiv from '../pagingComponent/paging'
import editor from '../tinymce/tinymce'
import {APP_CONSTANT} from '../../../static/js/app.constant'
export default {
  name: 'searchPage',
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
    position: { // 当前用户职务
      type: String
    }
  },
  components: {
    'pagingDiv': pagingDiv,
    'editor': editor
  },
  data () {
    return {
      content: '',
      editorSetting: {
        height: 400
      },
      headers: {
        'authorization': localStorage.getItem('GSLAuthorization')
      },
      fileList: [], // 初始图片列表
      pictureList: [], // 提交图片列表
      limit: 4, // 上传数量限制
      uploadUrl: APP_CONSTANT.API_HOST + '/product/addPicture', // 上传图片地址
      msg: null,
      name: '',
      errorMsg: '',
      fail: false,
      roleId: localStorage.getItem('GSLBackendRoleid'),
      stateControl: {
        tableShow: true,
        paging: true
      },
      productInfo: {pictureUrl: 'no-picture.png'},
      searchInfo: {
        nickname: '',
        coid: '',
        position: '',
        address: '',
        birthtime: '', // 出生日期
        costtime: '', // 会费缴纳时间
        uid: localStorage.getItem('GSLBackendUid'),
        pageSize: '10',
        pageCount: '1'
      },
      userInfo: {},
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
  },
  mounted () {
    $(document).scrollTop(0)
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
          // console.log(res)
          that.tableInfos = res.data.PageInfo
          that.msg = res.data.totalNum
        }
      )
    },
    tinymceHtml (data) {
      console.log(data)
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
    close () {
      this.fileList = []
    },
    /**
     * 函数描述
     *  用户查询
     * @return {null} 返回值描述 无
    */
    search () {
      $('.alert').alert('close')
      $('#loading').modal('show')
      var that = this
      this.fileList = []
      console.log(localStorage.getItem('GSLUsername'))
      this.request(
        '/user/query',
        'POST',
        JSON.stringify(this.searchInfo),
        function (res) {
          $('#loading').modal('hide')
          if (res.data.PageInfo && res.data.PageInfo.length === 0) {
            that.tableInfos = [{
              nickname: '暂无',
              company: '暂无',
              coname: '暂无'
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
      this.isInput = true
      console.log(this.isInput)
      this.fail = false
      $('#addUser').modal({backdrop: 'static', keyboard: false})
      this.userInfo = {
        'username': '',
        'sonCoid': '4',
        'userPwd': '',
        'nickname': '',
        'sex': '1',
        'position': '会员',
        'roleId': '1',
        'coname': '其他',
        'company': '',
        'qq': '',
        'wechat': '',
        'phone': '',
        'tel': '',
        'identity': '无',
        'userpwd': '',
        'birthtime': '',
        'costtime': '',
        'address': ''
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
          that.userInfo = res.data.userDto
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
        '/user/selectOne',
        'POST',
        JSON.stringify({
          id: id
        }),
        function (res, that) {
          $('#loading').modal('hide')
          console.log(res)
          that.userInfo = res.data.userDto
          $('#detailUser').modal('show')
        },
        function () {
          $('#loading').modal('hide')
        }
      )
    },
    toCompany (id) {
      this.fail = false
      $('#loading').modal('show')
      $('#changeCompany').modal({backdrop: 'static', keyboard: false})
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
        '/user/add',
        'POST',
        JSON.stringify(this.userInfo),
        function (res, that) {
          if (res.code === 200) {
            $('#addUser').modal('hide')
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
          $('#addUser').modal('hide')
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
     *  确认添加用户
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
        JSON.stringify(this.userInfo),
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
      var list = ''
      if (this.pictureList.length > 0) {
        this.pictureList.forEach(function (v, i) {
          list = list + v + ','
        })
        list = list.slice(0, list.length - 1)
      } else {
        list = this.productInfo.picture
      }
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
        if (this.userInfo.username === '' ||
        this.userInfo.userpwd === '' ||
        this.userInfo.nickname === '' ||
        this.userInfo.phone === '') {
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
     *  确认删除用户
     * @return {null} 返回值描述 无
    */
    confirmDelete () {
      $('.alert').alert('close')
      $('#loading').modal('show')
      this.request(
        '/user/delete',
        'POST',
        JSON.stringify({
          id: this.id
        }),
        function (res, that) {
          // $('#loading').modal('hide')
          $('#deleteUser').modal('hide')
          $('.searchBody').prepend(that.success)
          console.log(res)
          that.search()
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
  #addUser .modal-dialog,
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
</style>
