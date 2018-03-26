import Vue from "vue";
import VueRouter from "vue-router";

// 引入组件
import home from "./home.vue";
import about from "./about.vue";
import index from "@/components/index.vue";
// 要告诉 vue 使用 vueRouter

Vue.use(VueRouter);
var router =  new VueRouter({
     mode: 'history',
     routes:[
        {
            path:"/home",
            component: home
        },
        {
            path: "/about",
            component: about
        },
        // 重定向
        {
            path: '/', 
            redirect: 'home'
        }
    ] 
})
export default router;