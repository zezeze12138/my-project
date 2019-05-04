import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import AsiderBar from '@/components/HomePage/Main/asiderbar'
import Main from '@/components/HomePage/Main/main'
import Main1 from '@/components/HomePage/Main/main1'
import ScrapyEdit from '@/components/HomePage/Page/ScrapyEdit'
import User from '@/components/HomePage/Page/User'
import Index from '@/components/index'
import Header from '@/components/HomePage/Main/header'
import CrawlerManagement from '@/components/HomePage/Page/CrawlerManagement'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/index',
      name: 'Index',
      component: Index
    },{
      path: '/crawlerManagement',
      name: 'CrawlerManagement',
      component: CrawlerManagement
    },{
      path: '/admin',
      name: 'AsiderBar',
      component: AsiderBar
    }, {
      path: '/scrapyEdit',
      name: 'ScrapyEdit',
      component: ScrapyEdit
    },{
      path:'/main',
      name:'Main',
      component:Main,
      children:[
        {path:'/main/scrapyEdit',name:'ScrapyEdit',component:ScrapyEdit},
        {path:'/main/user',name:'User',component:User},
        {path:'/main/crawlerManagement',name:'CrawlerManagement',component:CrawlerManagement}
        ]
    },{
      path:'/main1',
      name:'Main1',
      component:Main1,
      children:[
        {path:'/main1/scrapyEdit',name:'ScrapyEdit',component:ScrapyEdit},
        {path:'/main1/user',name:'User',component:User}
      ]
    }
  ]
})
