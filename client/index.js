'use strict';

import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';

Vue.use(VueRouter);

const router = new VueRouter({
    routes: [
        {
            path: '/',
            name: 'app',
            component: App
        },
    ]
});

const app = new Vue({
    router,
    render: createEle => createEle(App)
}).$mount('#app');
