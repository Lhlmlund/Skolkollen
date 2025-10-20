import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import About from '../pages/About.vue'
import AddSchool from "../pages/AddSchool.vue";
import SchoolList from "../pages/SchoolList.vue";
import Login from "../pages/Login.vue";
import Register from "../pages/Register.vue";

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/about', name: 'about', component: About },
  { path: '/add-school', name: 'addSchool', component: AddSchool },
  { path: '/school-list', name: 'schoolList', component: SchoolList },
  { path: '/Login', name: 'login', component: Login },
  { path: '/Register', name: 'register', component: Register }

]

export default createRouter({
  history: createWebHistory(),
  routes,
})