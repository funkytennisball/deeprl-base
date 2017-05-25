'use strict';

import Vue from 'vue';
import VueRouter from 'vue-router';

import App from './App.vue';
import Home from './components/Home.vue';
import CartPole from './components/environments/Cartpole.vue';

import yeti from 'bootswatch/yeti/bootstrap.min.css';

Vue.use(VueRouter);

const router = new VueRouter({
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/cartpole',
            name: 'cartpole',
            component: CartPole
        }
    ]
});

const app = new Vue({
    router,
    render: createEle => createEle(App)
}).$mount('#app');
