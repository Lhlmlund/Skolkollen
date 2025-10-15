<template>
  <main class="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
    <section class="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
      <h2 class="text-3xl font-bold text-center text-blue-700 mb-8">Logga in</h2>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
            E-post
          </label>
          <input
              type="email"
              id="email"
              v-model="email"
              required
              placeholder="din@epost.se"
              class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
            Lösenord
          </label>
          <input
              type="password"
              id="password"
              v-model="password"
              required
              placeholder="••••••••"
              class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none"
          />
        </div>

        <button
            type="submit"
            class="w-full bg-blue-600 text-white font-medium py-2.5 rounded-xl shadow hover:bg-blue-700 transition"
        >
          Logga in
        </button>
      </form>

      <p class="text-center text-sm text-gray-600 mt-6">
        Har du inget konto?
        <router-link to="/register" class="text-blue-600 hover:underline font-medium">
          Registrera dig här
        </router-link>
      </p>
    </section>
  </main>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    handleLogin() {

      console.log('Login with', this.email, this.password)
    }
  }
}
</script>
