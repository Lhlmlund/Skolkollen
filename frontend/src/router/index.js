import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import About from '../pages/About.vue'
import AddSchool from "../pages/AddSchool.vue";

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/about', name: 'about', component: About },
  { path: '/add-school', name: 'addSchool', component: AddSchool },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})