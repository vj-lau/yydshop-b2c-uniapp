import Vue from 'vue'
import App from './App'

import store from '@/store';

import core from 'core'

if (process.env.NODE_ENV === 'production') {
	Vue.config.productionTip = false
} else {
	Vue.config.productionTip = true
}

App.mpType = 'app'

Vue.use(core)

const app = new Vue({
	...App,
	store: store
})
app.$mount()
