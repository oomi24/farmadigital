
import { Role, OrderStatus, User, Product, Order, InventoryItem, Community, Zone } from './types';

export const ZONES: Zone[] = [
  { id: 'zona-norte', name: 'Zona Norte', x: 10, y: 10 },
  { id: 'zona-sur', name: 'Zona Sur', x: 60, y: 50 },
];

export const COMMUNITIES: Community[] = [
  { id: 'com-a', name: 'Comunidad A', zoneId: 'zona-norte', x: 20, y: 30 },
  { id: 'com-b', name: 'Comunidad B', zoneId: 'zona-norte', x: 45, y: 20 },
  { id: 'com-c', name: 'Comunidad C', zoneId: 'zona-sur', x: 75, y: 70 },
];

export const USERS: User[] = [
  // El usuario 'admin' ha sido degradado a Encargado Comunal.
  { id: 'admin-01', name: 'Antiguo Admin', email: 'admin@farmacia.com', username: 'admin', password: 'Apamate.25', role: Role.COMMUNITY_MANAGER, communityId: 'com-a', zoneId: 'zona-norte', approved: true },
  { id: 'zmanager-norte', name: 'Gerente Zona Norte', email: 'gnorte@farmacia.com', username: 'gnorte', password: 'Apamate.25', role: Role.ZONE_MANAGER, zoneId: 'zona-norte', approved: true },
  { id: 'zmanager-sur', name: 'Gerente Zona Sur', email: 'gsur@farmacia.com', username: 'gsur', password: 'Apamate.25', role: Role.ZONE_MANAGER, zoneId: 'zona-sur', approved: true },
  // El usuario 'roble' es ahora el único Administrador con acceso total.
  { id: 'cmanager-a', name: 'Roble (Admin General)', email: 'ca@farmacia.com', username: 'roble', password: 'Apamate.25', role: Role.ADMIN, approved: true },
  { id: 'cmanager-b', name: 'Encargado Comunidad B', email: 'cb@farmacia.com', username: 'cb', password: 'Apamate.25', role: Role.COMMUNITY_MANAGER, communityId: 'com-b', zoneId: 'zona-norte', approved: true },
  { id: 'cmanager-c', name: 'Encargado Comunidad C', email: 'cc@farmacia.com', username: 'cc', password: 'Apamate.25', role: Role.COMMUNITY_MANAGER, communityId: 'com-c', zoneId: 'zona-sur', approved: false },
  { id: 'driver-a', name: 'Chofer Alpha', email: 'da@farmacia.com', username: 'da', password: 'Apamate.25', role: Role.DRIVER, communityId: 'com-a', zoneId: 'zona-norte', approved: true },
];

export const PRODUCTS: Product[] = [
  { id: 'prod-001', name: 'Paracetamol 500mg', description: 'Caja de 20 comprimidos', category: 'Analgésicos', price: 1.50, imageUrl: 'https://picsum.photos/seed/paracetamol/200/200' },
  { id: 'prod-002', name: 'Ibuprofeno 400mg', description: 'Caja de 24 comprimidos', category: 'Antiinflamatorios', price: 2.20, imageUrl: 'https://picsum.photos/seed/ibuprofeno/200/200' },
  { id: 'prod-003', name: 'Amoxicilina 500mg', description: 'Caja de 12 cápsulas', category: 'Antibióticos', price: 4.80, imageUrl: 'https://picsum.photos/seed/amoxicilina/200/200' },
  { id: 'prod-004', name: 'Mascarillas Quirúrgicas', description: 'Caja de 50 unidades', category: 'Protección', price: 5.00, imageUrl: 'https://picsum.photos/seed/mascarillas/200/200' },
  { id: 'prod-005', name: 'Alcohol en Gel 250ml', description: 'Botella de 250ml', category: 'Higiene', price: 3.10, imageUrl: 'https://picsum.photos/seed/alcoholgel/200/200' },
  { id: 'prod-006', name: 'Vitamina C 1000mg', description: 'Tubo con 20 tabletas efervescentes', category: 'Vitaminas', price: 6.50, imageUrl: 'https://picsum.photos/seed/vitaminaC/200/200' },
];

export const INVENTORY: InventoryItem[] = [
  { communityId: 'com-a', productId: 'prod-001', stock: 100 },
  { communityId: 'com-a', productId: 'prod-002', stock: 80 },
  { communityId: 'com-a', productId: 'prod-004', stock: 200 },
  { communityId: 'com-b', productId: 'prod-001', stock: 120 },
  { communityId: 'com-b', productId: 'prod-003', stock: 50 },
  { communityId: 'com-b', productId: 'prod-005', stock: 150 },
  { communityId: 'com-c', productId: 'prod-002', stock: 90 },
  { communityId: 'com-c', productId: 'prod-005', stock: 110 },
  { communityId: 'com-c', productId: 'prod-006', stock: 70 },
  { communityId: 'com-a', productId: 'prod-006', stock: 20 },
];

export const ORDERS: Order[] = [
  { id: 'ord-001', userFullName: 'Juan Pérez', communityId: 'com-a', products: [{ productId: 'prod-001', quantity: 2 }, { productId: 'prod-004', quantity: 1 }], status: OrderStatus.PENDING, orderDate: '2024-07-20', comments: 'Dejar en conserjería.', phone: '123456789' },
  { id: 'ord-002', userFullName: 'Maria Gonzalez', communityId: 'com-a', products: [{ productId: 'prod-002', quantity: 1 }], status: OrderStatus.CONFIRMED, orderDate: '2024-07-21', dispatchDate: '2024-07-23', comments: '', carrierName: 'Servientrega' },
  { id: 'ord-003', userFullName: 'Carlos Silva', communityId: 'com-b', products: [{ productId: 'prod-005', quantity: 3 }], status: OrderStatus.READY_FOR_PICKUP, orderDate: '2024-07-19', dispatchDate: '2024-07-21', comments: 'Pasaré por la tarde.', phone: '987654321' },
  { id: 'ord-004', userFullName: 'Ana Torres', communityId: 'com-c', products: [{ productId: 'prod-006', quantity: 1 }], status: OrderStatus.DELIVERED, orderDate: '2024-07-18', dispatchDate: '2024-07-20', comments: '', carrierName: 'DHL' },
  { id: 'ord-005', userFullName: 'Luis Rojas', communityId: 'com-a', products: [{ productId: 'prod-001', quantity: 1 }], status: OrderStatus.PENDING, orderDate: '2024-07-22', comments: 'Urgente.' },
  { id: 'ord-006', userFullName: 'Sofia Castro', communityId: 'com-c', products: [{ productId: 'prod-002', quantity: 2 }, { productId: 'prod-005', quantity: 1 }], status: OrderStatus.PENDING, orderDate: '2024-07-22', dispatchDate: '2024-07-25', comments: '', phone: '555555555' },
];
