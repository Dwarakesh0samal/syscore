import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' }
})

// Attach JWT to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('syscore_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 globally
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('syscore_token')
      localStorage.removeItem('syscore_user')
      if (window.location.pathname !== '/') {
        window.location.href = '/'
      }
    }
    return Promise.reject(err)
  }
)

export default api

// Typed API calls
export const authAPI = {
  register: (data: RegisterPayload) =>
    api.post('/auth/register', data),
  login: (data: LoginPayload) =>
    api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
}

export const waitlistAPI = {
  join: (email: string, source = 'hero') =>
    api.post('/waitlist/join', { email, source }),
  count: () => api.get('/waitlist/count'),
}

export const userAPI = {
  updateProfile: (data: ProfilePayload) =>
    api.patch('/user/profile', data),
  uploadAvatar: (file: File) => {
    const form = new FormData()
    form.append('avatar', file)
    return api.post('/user/avatar', form, {
      headers: { 'Content-Type': 'multipart/form-data'}
    })
  }
}

export const keysAPI = {
  list: () => api.get('/keys/'),
  generate: () => api.post('/keys/generate'),
  revoke: (id: string) => api.delete(`/keys/${id}`)
}

export const billingAPI = {
  createCheckout: (price_id: string, billing_cycle: string) =>
    api.post('/billing/create-checkout-session', { price_id, billing_cycle }),
  status: () => api.get('/billing/status'),
  portal: () =>
    api.post('/billing/create-portal-session'),
  cancel: () => api.post('/billing/cancel'),
}

export const componentsAPI = {
  list: (params?: {
    category?: string
    tier?: string
    search?: string
  }) => api.get('/components/', { params }),

  get: (slug: string) =>
    api.get(`/components/${slug}`),

  trackCopy: (slug: string) =>
    api.post(`/components/${slug}/copy`),
}

// Types
export interface RegisterPayload {
  email: string
  username: string
  password: string
  display_name?: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface ProfilePayload {
  display_name?: string
  username?: string
  bio?: string
}

export interface User {
  id: string
  email: string
  username: string
  display_name: string
  bio: string | null
  plan: 'free' | 'pro'
  avatar_url: string | null
  created_at: string
}

export interface ApiKey {
  id: string
  key_prefix: string
  label: string | null
  created_at: string
  last_used: string | null
}

export interface Component {
  id: string
  name: string
  slug: string
  category: string
  tier: 'free' | 'pro'
  description: string | null
  code_html: string
  preview_label: string
  tags: string
  copy_count: number
  created_at: string
}
