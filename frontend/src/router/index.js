import { createRouter, createWebHistory } from 'vue-router'

// ✅ Importera sidor
import Home from '../pages/Home.vue'
import About from '../pages/About.vue'
import AddSchool from '../pages/AddSchool.vue'
import SchoolList from '../pages/SchoolList.vue'
import Login from '../pages/Login.vue'
import QuizView from '../pages/QuizView.vue' // ✅ rätt sökväg

// ✅ Definiera routes
const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/about', name: 'about', component: About },
  { path: '/add-school', name: 'addSchool', component: AddSchool },
  { path: '/school-list', name: 'schoolList', component: SchoolList },
  { path: '/login', name: 'login', component: Login },
  { path: '/quiz', name: 'quiz', component: QuizView } // ✅ endast denna för quiz
]

// ✅ Exportera router
export default createRouter({
  history: createWebHistory(),
  routes
})
