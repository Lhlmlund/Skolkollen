const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

function authHeaders() {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
}

export async function getSchools() {
  const res = await fetch(`${BASE}/api/schools`)
  if (!res.ok) {
    throw new Error('Failed to fetch schools')
  }
  return res.json()
}

export async function getSchoolsWithPrograms() {
  const res = await fetch(`${BASE}/api/schools-with-programs`)
  if (!res.ok) {
    throw new Error('Failed to fetch schools with programs')
  }
  return res.json()
}

export async function getOpenHouses() {
  const res = await fetch(`${BASE}/api/openhouses`)
  if (!res.ok) {
    throw new Error('Failed to fetch open houses')
  }
  return res.json()
}

export async function login(email, password) {
    const res = await fetch(`${BASE}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
        body: JSON.stringify({
          email: email,
          password: password
    }),
    });

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error || 'Login failed');
    }

    if (data.token) {
      localStorage.setItem('token', data.token);
      console.log('Login success:');
      return data;
    } else {
      console.warn('No token received from server');
    }
}

export async function register(name, email, password, age, school, city){
    const res = await fetch(`${BASE}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
        age: age,
        school: school,
        city: city,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Registration failed');
    }

    const data = await res.json();
    console.log('Registration success:');
    return data;
}

export async function updateUser(payload){
        const res = await fetch(`${BASE}/api/auth/update`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                name: payload.name,
                email: payload.email,
                password: payload.password,
                age: payload.age,
                school: payload.school,
                city: payload.city,
            }),
        });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Update failed');
    }

    const data = await res.json();
    console.log('Update success:');
    return data;
}

export async function getSchoolById(id) {
  const response = await fetch(`${BASE}/api/schools/${id}`)
  if (!response.ok) {
    const text = await response.text()
    console.error('❌ API error:', text)
    throw new Error('Kunde inte hämta skolinformation.')
  }
  return await response.json()

}

  export async function getMe() {
    const res = await fetch(`${BASE}/api/auth/me`, {
        method: "GET",
        headers: { ...authHeaders() },
    })
    const data = await res.json().catch(() => null)
    if (!res.ok) throw new Error(data?.error || 'Failed to fetch current user')
    return data
  }

