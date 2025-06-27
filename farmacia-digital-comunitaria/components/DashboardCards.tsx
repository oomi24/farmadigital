
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Order, InventoryItem, Community, Product, Role, User } from '../types';
import { MapIcon } from './icons';

interface DashboardCardsProps {
  orders: Order[];
  inventory: InventoryItem[];
  communities: Community[];
  products: Product[];
  currentUser: User;
  setView: (view: string) => void;
}

const Card: React.FC<{ title: string; value?: string | number; children?: React.ReactNode, onClick?: () => void, isAction?: boolean }> = ({ title, value, children, onClick, isAction }) => (
  <div 
    className={`bg-white p-6 rounded-lg shadow-md ${isAction ? 'cursor-pointer hover:shadow-xl hover:bg-slate-50 transition-all' : ''}`}
    onClick={onClick}
  >
    <div className="flex items-center space-x-4">
      {children && <div className="text-teal-500">{children}</div>}
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        {value !== undefined && <p className="text-3xl font-bold text-slate-800">{value}</p>}
      </div>
    </div>
  </div>
);

const OrdersByCommunityChart: React.FC<{ orders: Order[], communities: Community[] }> = ({ orders, communities }) => {
    const data = communities.map(community => ({
        name: community.name.replace('Comunidad ', ''),
        Pedidos: orders.filter(order => order.communityId === community.id).length,
    }));

    return (
        <div className="bg-white p-6 rounded-lg shadow-md h-96">
            <h3 className="text-lg font-semibold mb-4 text-slate-700">Pedidos por Comunidad</h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Pedidos" fill="#14b8a6" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

const ProductDemandChart: React.FC<{ orders: Order[], products: Product[] }> = ({ orders, products }) => {
    const productCounts = orders.flatMap(o => o.products).reduce((acc, curr) => {
        acc[curr.productId] = (acc[curr.productId] || 0) + curr.quantity;
        return acc;
    }, {} as { [key: string]: number });

    const data = Object.entries(productCounts)
        .map(([productId, count]) => ({
            name: products.find(p => p.id === productId)?.name || 'Desconocido',
            Cantidad: count,
        }))
        .sort((a, b) => b.Cantidad - a.Cantidad)
        .slice(0, 5);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md h-96">
            <h3 className="text-lg font-semibold mb-4 text-slate-700">Top 5 Productos Solicitados</h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Cantidad" fill="#0d9488" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};


const DashboardCards: React.FC<DashboardCardsProps> = ({ orders, inventory, communities, products, currentUser, setView }) => {
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'Pendiente').length;
  const totalStock = inventory.reduce((acc, item) => acc + item.stock, 0);

  const canInspectRoutes = [Role.ADMIN, Role.ZONE_MANAGER].includes(currentUser.role);
  const totalCommunities = currentUser.role === Role.ADMIN 
    ? communities.length 
    : currentUser.role === Role.ZONE_MANAGER 
    ? communities.filter(c => c.zoneId === currentUser.zoneId).length 
    : 1;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="Total Pedidos" value={totalOrders} />
        <Card title="Pedidos Pendientes" value={pendingOrders} />
        <Card title="Comunidades" value={totalCommunities} />
        {canInspectRoutes ? (
            <Card title="Inspección de Rutas" onClick={() => setView('route-inspection')} isAction>
                <MapIcon className="h-8 w-8" />
            </Card>
        ) : (
            <Card title="Items en Inventario" value={totalStock} />
        )}
      </div>
      {(currentUser.role === Role.ADMIN || currentUser.role === Role.ZONE_MANAGER) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
           <OrdersByCommunityChart orders={orders} communities={communities} />
           <ProductDemandChart orders={orders} products={products} />
        </div>
      )}
    </div>
  );
};

export default DashboardCards;
