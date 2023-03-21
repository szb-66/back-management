import { createRouter, createWebHashHistory } from "vue-router"

const routes = [
  // 设置打开网址默认进入的页面
  { path: "/", redirect: "/home", },
  // 配置路由,path:路由映射路径；
  //component：跳转的组件，使用import可以进行代码分割
  { 
    path: '/Home', 
    name: 'Home',
    component: () => import('../view/Home.vue') 
  },
  { 
    path: '/OldPublishArticle', 
    name: 'OldPublishArticle',
    component: () => import('../view/OldPublishArticle.vue') 
  },
  { 
    path: '/PublishArticle', 
    name: 'PublishArticle',
    component: () => import('../view/PublishArticle.vue') 
  },
  { 
    path: '/ArticleManagement', 
    name: 'ArticleManagement',
    component: () => import('../view/ArticleManagement.vue') 
  },
  { 
    path: '/ProjectExperience', 
    name: 'ProjectExperience',
    component: () => import('../view/ProjectExperience.vue') 
  },
  { 
    path: '/WorkExperience', 
    name: 'WorkExperience',
    component: () => import('../view/WorkExperience.vue') 
  },
]

const router = createRouter({
  //内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  //使用这个模式在访问地址会带一个#号
  history: createWebHashHistory(),
  routes, // `routes: routes` 的缩写
})
// 暴露路由
export default router