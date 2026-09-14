const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

export const api = {
  getCategories: () => fetchAPI<any[]>('/api/categories'),
  getCategory: (slug: string) => fetchAPI<any>(`/api/categories/${slug}`),
  getProducts: (params?: Record<string, string>) => {
    const q = params ? '?' + new URLSearchParams(params).toString() : '';
    return fetchAPI<{ products: any[]; total: number; page: number; pages: number }>(`/api/products${q}`);
  },
  getProduct: (id: number) => fetchAPI<any>(`/api/products/${id}`),
  getProductBySlug: (slug: string) => fetchAPI<any>(`/api/products/slug/${slug}`),
  getWeeklyDiscounts: () => fetchAPI<any[]>('/api/discounts/weekly'),
  getFaq: () => fetchAPI<any[]>('/api/faq'),
  getSettings: () => fetchAPI<any>('/api/settings'),
  login: (phone: string, password: string) =>
    fetchAPI<{ token: string; user: any }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ phone, password }),
    }),
  register: (name: string, phone: string, password: string) =>
    fetchAPI<{ token: string; user: any }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, phone, password }),
    }),
  getProfile: () => fetchAPI<any>('/api/users/profile'),
  createOrder: (data: any) =>
    fetchAPI<any>('/api/orders', { method: 'POST', body: JSON.stringify(data) }),
  getOrders: () => fetchAPI<any[]>('/api/orders'),
  sendSupportMessage: (text: string) =>
    fetchAPI<any>('/api/support/messages', { method: 'POST', body: JSON.stringify({ text }) }),
  getSupportMessages: () => fetchAPI<any[]>('/api/support/messages'),
};

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
}

export function getImageUrl(path: string | undefined, fallback = '/images/placeholders/product.jpg'): string {
  if (!path) return fallback;
  return path;
}
