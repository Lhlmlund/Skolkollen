import { createRouter, createWebHistory } from 'vue-router'
import QuizView from '../pages/QuizView.vue'
import ResultsView from '../pages/ResultsView.vue'

// Original-sidor
import Home from '../pages/Home.vue'
import About from '../pages/About.vue'
import SchoolList from '../pages/SchoolList.vue'
import SchoolDetail from '../pages/SchoolDetail.vue'
import SelectedSchools from '../pages/SelectedSchools.vue'
import Login from '../pages/Login.vue'
import Register from '../pages/Register.vue'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/about', name: 'about', component: About },

  { path: '/school-list', name: 'schoolList', component: SchoolList },
  { path: '/schools/:id', name: 'schoolDetail', component: SchoolDetail, props: true },
  { path: '/selected-schools', name: 'selectedSchools', component: SelectedSchools },

  { path: '/login', name: 'login', component: Login },
  { path: '/register', name: 'register', component: Register },

  // Neutral fallback
  { path: '/:pathMatch(.*)*', redirect: '/' },
  { path: '/quiz', name: 'quiz', component: QuizView },
  { path: '/results', name: 'results', component: ResultsView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
