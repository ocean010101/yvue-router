
import Vue from 'vue'
class yVueRouter {
    constructor(options) { // 接收使用new VueRouter(options) 传递进来的构造参数options
        this.$options = options;
        this.routeMap = {};
        //利用Vue响应式 路由响应式
        this.app = new Vue({
            data: {
                current: '/'
            }
        });
    }
    //init 需要
    init() {
        this.bindEvents(); // 监听url变化
        this.createRouterMap(this.$options); //解析路由配置
        this.initComponent();//创建全局组件router-link router-view
    }
    bindEvents() {
        //当加载url 或hash 改变 监听变化， onHashChange 是回调函数， 不使用bind绑定this， this就会指向windows
        window.addEventListener("load", this.onHashChange.bind(this));
        window.addEventListener("hashchange", this.onHashChange.bind(this));
    }

    onHashChange() {
        this.app.current = window.location.hash.slice(1) || '/';
    }
    createRouterMap(options) {
        options.routes.forEach(item => {
            this.routeMap[item.path] = item.component;//path 与component 一一对应 
        });
    }

    initComponent() {
        //使用Vue.component 全局注册组件
        // <router-link :to="/about">about</router-link> // 将来运行在client， 是打包的方式没有编译器，所以如果写成模板无法编译
        Vue.component('router-link', {
            props: { to: String },
            render(h) { //返回虚拟DOM
                //生成a标签
                //h(tag, data, children) 
                return h('a', { attrs: { href: '#' + this.to } }, [this.$slots.default])
            }
        })
        // <router-view></router-view>
        Vue.component('router-view', {
            render: (h) => { //返回虚拟DOM
                //生成a标签
                //h(tag, data, children) 
                const com = this.routeMap[this.app.current]
                return h(com)
            }
        })
    }
}
//实现插件
yVueRouter.install = function (Vue) {

    //全局注册混入， 影响注册之后创建的每一个Vue实例
    //Vue.mixin(mixin) ;将mixin 对象与Vue自身的options属性合并在一起
    Vue.mixin({
        //在执行new Vue() 时，与Vue 中的名字为beforeCreate 的生命周期钩子一起执行
        beforeCreate() {
            //this是Vue实例
            if (this.$options.router) { // 只有根组件的选项中可以拿到router==> 如果当前实例是根组件
                //仅在根组件执行一次， 后面的子组件中都可以使用$router
                Vue.prototype.$router = this.$options.router;
                this.$options.router.init(); //初始化
            }
        }
    });
}

export default yVueRouter