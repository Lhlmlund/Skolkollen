import { createRouter, createWebHistory } from 'vue-router'

// Sidor (RELATIVA sökvägar från src/router/)
import Home from '../pages/Home.vue'
import About from '../pages/About.vue'
import SchoolList from '../pages/SchoolList.vue'
import SelectedSchools from '../pages/SelectedSchools.vue'
import Login from '../pages/Login.vue'
import QuizView from '../pages/QuizView.vue'
import ResultsView from '../pages/ResultsView.vue'


const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/about', name: 'about', component: About },
  { path: '/school-list', name: 'school-list', component: SchoolList },
  { path: '/selected-schools', name: 'selected-schools', component: SelectedSchools },
  { path: '/login', name: 'login', component: Login },

  // Quiz + Resultat
  { path: '/quiz', name: 'quiz', component: QuizView },
  { path: '/results', name: 'results', component: ResultsView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
