import Vue from 'vue'
import Router from 'vue-router'

// import loginPage from '../components/loginPage'
// import detailPage from '../components/detailPage'
// import detailInfo from '../components/detailPageChildren/detail'
// import userManage from '../components/detailPageChildren/userManage'
// import productManage from '../components/detailPageChildren/productManage'
// import hotManage from '../components/detailPageChildren/hotManage'
// import messageManage from '../components/detailPageChildren/messageManage'
// import groupsManage from '../components/detailPageChildren/groupsManage'
// import activityManage from '../components/detailPageChildren/activityManage'
// import ersonnelManagement from '../components/detailPageChildren/ersonnelManagement'
// import modifyPassword from '../components/modifyPassword'
// import searchAndVoid from '../components/detailPageChildren/searchAndVoid'
// import { resolve } from 'path'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'loginPage1',
      // component: loginPage,
      component: (resolve) => require(['../components/loginPage'], resolve)
    },
    {
      path: '*',
      name: 'loginPage2',
      component: (resolve) => require(['../components/loginPage'], resolve)
    },
    {
      path: '/login',
      name: 'loginPage',
      component: (resolve) => require(['../components/loginPage'], resolve)
    },
    {
      path: '/modifyPassword',
      name: 'modifyPassword',
      // component: modifyPassword,
      component: (resolve) => require(['../components/modifyPassword'], resolve)
    },
    {
      path: '/detail',
      name: 'detailPage',
      // component: detailPage,
      component: (resolve) => require(['../components/detailPage'], resolve),
      children: [
        {
          path: '/detail',
          name: 'productManage1',
          component: (resolve) => require(['../components/detailPageChildren/productManage'], resolve)
        },
        {
          path: '/detail/hotManage',
          name: 'hotManage',
          component: (resolve) => require(['../components/detailPageChildren/hotManage'], resolve)
        },
        {
          path: '/detail/companyManage',
          name: 'companyManage',
          component: (resolve) => require(['../components/detailPageChildren/companyManage'], resolve)
        },
        {
          path: '/detail/groupsManage',
          name: 'groupsManage',
          component: (resolve) => require(['../components/detailPageChildren/groupsManage'], resolve)
        },
        {
          path: '/detail/userManage',
          name: 'userManage',
          component: (resolve) => require(['../components/detailPageChildren/userManage'], resolve)
        },
        {
          path: '/detail/downloadManage',
          name: 'downloadManage',
          component: (resolve) => require(['../components/detailPageChildren/downloadManage'], resolve)
        },
        {
          path: '/detail/applyManage',
          name: 'applyManage',
          component: (resolve) => require(['../components/detailPageChildren/applyManage'], resolve)
        },
        {
          path: '/detail/serviceManage',
          name: 'serviceManage',
          component: (resolve) => require(['../components/detailPageChildren/serviceManage'], resolve)
        },
        {
          path: '/detail/activityManage',
          name: 'activityManage',
          component: (resolve) => require(['../components/detailPageChildren/activityManage'], resolve)
        },
        {
          path: '/detail/productManage',
          name: 'productManage',
          // component: activityManage
          component: (resolve) => require(['../components/detailPageChildren/productManage'], resolve)
        },
        {
          path: '/detail/messageManage',
          name: 'messageManage',
          component: (resolve) => require(['../components/detailPageChildren/messageManage'], resolve)
        },
        // {
        //   path: '/detail/input',
        //   name: 'detailInfo',
        //   component: (resolve) => require(['../components/detailPageChildren/detail'], resolve)
        // },
        // {
        //   path: '/detail/searchAndVoid',
        //   name: 'searchAndVoid',
        //   component: (resolve) => require(['../components/detailPageChildren/searchAndVoid'], resolve)
        // },
        {
          path: '/detail/industryManage',
          name: 'industryManage',
          component: (resolve) => require(['../components/detailPageChildren/industryManage'], resolve)
        }
      ]
    }
  ]
})
