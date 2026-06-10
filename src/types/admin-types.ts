export type AdminStats = {
  todaySales: number
  todayOrders: number
  pendingOrders: number
  totalProducts: number
  totalUsers: number
}

export type RevenuePoint = {
  date: string
  revenue: number
  orders: number
}

export type AdminOrderItem = {
  id: number
  customer: string
  total: number
  status: 'delivered' | 'received' | 'processing'
  date: string
}

export type Period = '7d' | '30d' | '90d'

export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string }

export type AdminProduct = {
  id: number
  name: string
  description: string | null
  price: number
  categoryId: number
  categoryName: string
}

export type CategoryOption = {
  id: number
  name: string
}
