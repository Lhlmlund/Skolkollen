import { createRouter, createWebHistory } from 'vue-router'

//  Importera sidor
import Home from '../pages/Home.vue'
import About from '../pages/About.vue'
import SchoolList from '../pages/SchoolList.vue'
import SelectedSchools from '../pages/SelectedSchools.vue'
import SchoolDetail from '../pages/SchoolDetail.vue'
import Login from '../pages/Login.vue'
import Register from '../pages/Register.vue'
import Profile from '../pages/Profile.vue'

// Definiera routes
const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/about', name: 'about', component: About },
  { path: '/selected-schools', name: 'selectedSchools', component: SelectedSchools },
  { path: '/school-list', name: 'schoolList', component: SchoolList },
  { path: '/school/:id', name: 'school-detail', component: SchoolDetail, props: true },
  { path: '/login', name: 'login', component: Login },
  { path: '/register', name: 'register', component: Register },
  { path: '/profile', name: 'profile', component: Profile },
  { path: '/quiz', name: 'Quiz', component: () => import('../pages/QuizView.vue') },
  { path: '/results', name: 'quiz-result', component: () => import('../pages/QuizResult.vue') }

]

//  Exportera router
export default createRouter({
  history: createWebHistory(),
  routes
})
