
export enum Role {
  ADMIN = 'Administrador',
  ZONE_MANAGER = 'Encargado de Zona',
  COMMUNITY_MANAGER = 'Encargado Comunal',
  DRIVER = 'Chofer',
}

export enum OrderStatus {
  PENDING = 'Pendiente',
  CONFIRMED = 'Confirmado',
  READY_FOR_PICKUP = 'Listo para Retiro',
  DELIVERED = 'Entregado',
  CANCELLED = 'Cancelado',
}

export interface Zone {
  id: string;
  name: string;
  x: number;
  y: number;
}

export interface Community {
  id: string;
  name: string;
  zoneId: string;
  x: number;
  y: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  password: string;
  role: Role;
  approved: boolean;
  communityId?: string;
  zoneId?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  imageUrl: string;
}

export interface InventoryItem {
  productId: string;
  stock: number;
  communityId: string;
}

export interface OrderProduct {
  productId: string;
  quantity: number;
}

export interface Order {
  id: string;
  userFullName: string;
  communityId: string;
  products: OrderProduct[];
  status: OrderStatus;
  orderDate: string;
  dispatchDate?: string;
  comments: string;
  carrierName?: string;
  phone?: string;
}