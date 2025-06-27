
import React, { useState } from 'react';
import { Order, OrderStatus, Role, User, Product, Community } from '../types';
import { XIcon } from './icons';
import InvoiceModal from './InvoiceModal';

interface OrderManagementProps {
  orders: Order[];
  products: Product[];
  communities: Community[];
  currentUser: User;
  onUpdateOrder: (orderId: string, newStatus: OrderStatus, dispatchDate?: string, carrierName?: string) => void;
}

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.PENDING: return 'bg-yellow-100 text-yellow-800';
    case OrderStatus.CONFIRMED: return 'bg-blue-100 text-blue-800';
    case OrderStatus.READY_FOR_PICKUP: return 'bg-indigo-100 text-indigo-800';
    case OrderStatus.DELIVERED: return 'bg-green-100 text-green-800';
    case OrderStatus.CANCELLED: return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const OrderModal: React.FC<{
  order: Order | null;
  products: Product[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (orderId: string, newStatus: OrderStatus, dispatchDate?: string, carrierName?: string) => void;
  canEdit: boolean;
}> = ({ order, products, isOpen, onClose, onSave, canEdit }) => {
  const [status, setStatus] = useState<OrderStatus>(order?.status || OrderStatus.PENDING);
  const [dispatchDate, setDispatchDate] = useState(order?.dispatchDate || '');
  const [carrierName, setCarrierName] = useState(order?.carrierName || '');

  React.useEffect(() => {
    if (order) {
      setStatus(order.status);
      setDispatchDate(order.dispatchDate || new Date().toISOString().split('T')[0]);
      setCarrierName(order.carrierName || '');
    }
  }, [order]);

  if (!isOpen || !order) return null;

  const handleSave = () => {
    onSave(order.id, status, dispatchDate, carrierName);
  };
  
  const getProductDetails = (productId: string) => products.find(p => p.id === productId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-full overflow-y-auto">
        <div className="p-6 border-b sticky top-0 bg-white z-10">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-slate-800">Detalles del Pedido: {order.id}</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <XIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <h4 className="font-semibold text-slate-700 mb-2">Información General</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <p><strong className="text-slate-500">Cliente:</strong> {order.userFullName}</p>
              <p><strong className="text-slate-500">Teléfono:</strong> {order.phone || 'N/A'}</p>
              <p><strong className="text-slate-500">Fecha Pedido:</strong> {order.orderDate}</p>
              <p><strong className="text-slate-500">Estado Actual:</strong> <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>{order.status}</span></p>
              <p><strong className="text-slate-500">Fecha Despacho:</strong> {order.dispatchDate || 'No asignada'}</p>
              <p><strong className="text-slate-500">Transportista:</strong> {order.carrierName || 'No asignado'}</p>
            </div>
            {order.comments && <p className="mt-4"><strong className="text-slate-500">Comentarios:</strong> <span className="text-slate-600 italic">{order.comments}</span></p>}
          </div>
          
          <div>
            <h4 className="font-semibold text-slate-700 mb-2">Productos</h4>
            <ul className="divide-y divide-slate-200">
              {order.products.map(item => {
                const product = getProductDetails(item.productId);
                return (
                  <li key={item.productId} className="py-3 flex justify-between items-center">
                    <div>
                      <p className="font-medium text-slate-800">{product?.name || 'Producto desconocido'}</p>
                      <p className="text-sm text-slate-500">Cantidad: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-slate-800">${((product?.price || 0) * item.quantity).toFixed(2)}</p>
                  </li>
                );
              })}
            </ul>
          </div>

          {canEdit && (
            <div className="pt-6 border-t border-slate-200 space-y-4">
              <h4 className="font-semibold text-slate-700">Actualizar Pedido</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-slate-600 mb-1">Estado del Pedido</label>
                  <select id="status" value={status} onChange={e => setStatus(e.target.value as OrderStatus)} className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500">
                    {Object.values(OrderStatus).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="dispatchDate" className="block text-sm font-medium text-slate-600 mb-1">Fecha de Despacho</label>
                  <input type="date" id="dispatchDate" value={dispatchDate} onChange={e => setDispatchDate(e.target.value)} className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500" />
                </div>
                 <div>
                  <label htmlFor="carrierName" className="block text-sm font-medium text-slate-600 mb-1">Transportista</label>
                  <input type="text" id="carrierName" placeholder="Nombre del transportista" value={carrierName} onChange={e => setCarrierName(e.target.value)} className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500" />
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="p-6 bg-slate-50 rounded-b-lg flex justify-end space-x-3 sticky bottom-0 z-10">
          <button onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 transition">Cerrar</button>
          {canEdit && <button onClick={handleSave} className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition">Guardar Cambios</button>}
        </div>
      </div>
    </div>
  );
};

const OrderManagement: React.FC<OrderManagementProps> = ({ orders, products, communities, currentUser, onUpdateOrder }) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);

  const handleManageClick = (order: Order) => {
    setSelectedOrder(order);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
  };
  
  const handleCloseInvoice = () => {
    setInvoiceOrder(null);
  };

  const handleSaveChanges = (orderId: string, newStatus: OrderStatus, dispatchDate?: string, carrierName?: string) => {
    onUpdateOrder(orderId, newStatus, dispatchDate, carrierName);
    handleCloseModal();
  };

  const canEdit = currentUser.role === Role.COMMUNITY_MANAGER;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-slate-800">Gestión de Pedidos</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-500">
          <thead className="text-xs text-slate-700 uppercase bg-slate-100">
            <tr>
              <th scope="col" className="px-6 py-3">ID Pedido</th>
              <th scope="col" className="px-6 py-3">Cliente</th>
              <th scope="col" className="px-6 py-3">Fecha</th>
              <th scope="col" className="px-6 py-3">Estado</th>
              <th scope="col" className="px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className="bg-white border-b hover:bg-slate-50">
                <th scope="row" className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">{order.id}</th>
                <td className="px-6 py-4">{order.userFullName}</td>
                <td className="px-6 py-4">{order.orderDate}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 space-x-4">
                  <button onClick={() => handleManageClick(order)} className="font-medium text-teal-600 hover:underline">
                    {canEdit ? 'Gestionar' : 'Ver'}
                  </button>
                   <button onClick={() => setInvoiceOrder(order)} className="font-medium text-blue-600 hover:underline">
                    Factura
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
       <OrderModal 
        order={selectedOrder} 
        products={products}
        isOpen={!!selectedOrder}
        onClose={handleCloseModal}
        onSave={handleSaveChanges}
        canEdit={canEdit}
      />
      <InvoiceModal
        isOpen={!!invoiceOrder}
        onClose={handleCloseInvoice}
        order={invoiceOrder}
        products={products}
        community={communities.find(c => c.id === invoiceOrder?.communityId)}
      />
    </div>
  );
};

export default OrderManagement;
