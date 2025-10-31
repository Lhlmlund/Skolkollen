import { createRouter, createWebHistory } from 'vue-router'

//  Importera sidor
import Home from '../pages/Home.vue'
import About from '../pages/About.vue'
import AddSchool from "../pages/AddSchool.vue";
import SchoolList from "../pages/SchoolList.vue";
import SchoolDetail from '../pages/SchoolDetail.vue'
import Login from "../pages/Login.vue";
import Register from "../pages/Register.vue";
import QuizView from '../pages/QuizView.vue';

// Definiera routes
const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/about', name: 'about', component: About },
  { path: '/add-school', name: 'addSchool', component: AddSchool },
  { path: '/school-list', name: 'schoolList', component: SchoolList },
  { path: '/school/:id', name: 'school-detail', component: SchoolDetail, props: true },
  { path: '/Login', name: 'login', component: Login },
  { path: '/Register', name: 'register', component: Register },
  { path: '/quiz', name: 'quiz', component: QuizView }

]

//  Exportera router
export default createRouter({
  history: createWebHistory(),
  routes
})
