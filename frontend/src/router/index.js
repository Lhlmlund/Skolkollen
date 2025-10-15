import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import About from '../pages/About.vue'
import AddSchool from "../pages/AddSchool.vue";
import SchoolList from "../pages/SchoolList.vue";
import login from "../pages/login.vue";

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/about', name: 'about', component: About },
  { path: '/add-school', name: 'addSchool', component: AddSchool },
  { path: '/school-list', name: 'schoolList', component: SchoolList },
  { path: '/login', name: 'login', component: login }

]

export default createRouter({
  history: createWebHistory(),
  routes,
})