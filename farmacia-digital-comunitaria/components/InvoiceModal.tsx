
import React from 'react';
import { Order, Product, Community } from '../types';
import { XIcon, WhatsappIcon } from './icons';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  products: Product[];
  community: Community | undefined;
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({ isOpen, onClose, order, products, community }) => {
  if (!isOpen || !order) return null;

  const getProductDetails = (productId: string) => products.find(p => p.id === productId);

  const total = order.products.reduce((sum, item) => {
    const product = getProductDetails(item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  const handleSendWhatsApp = () => {
    if (!order.phone) {
        alert('Este pedido no tiene un número de teléfono asociado.');
        return;
    }
    
    const productLines = order.products.map(item => {
        const product = getProductDetails(item.productId);
        if (!product) return '';
        return `- ${product.name} (x${item.quantity}): $${(product.price * item.quantity).toFixed(2)}`;
    }).join('\n');

    const message = `
*Factura de Pedido*
---------------------------
*Pedido N°:* ${order.id}
*Cliente:* ${order.userFullName}
*Fecha:* ${order.orderDate}
*Comunidad:* ${community?.name || 'N/A'}
---------------------------
*Productos:*
${productLines}
---------------------------
*Total a Pagar: $${total.toFixed(2)}*

Gracias por su compra,
*Farmacia Digital Comunitaria*
    `;
    
    const encodedMessage = encodeURIComponent(message.trim());
    window.open(`https://api.whatsapp.com/send?phone=${order.phone}&text=${encodedMessage}`, '_blank');
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-full overflow-y-auto">
        <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white z-10">
          <h3 className="text-lg font-semibold text-slate-800">Factura del Pedido</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><XIcon className="h-6 w-6" /></button>
        </div>
        <div className="p-6 space-y-4 text-sm">
          <div className="text-center">
             <h4 className="font-bold text-xl text-slate-800">Farmacia Digital Comunitaria</h4>
             <p className="text-slate-500">{community?.name || ''}</p>
          </div>
          <div className="border-t border-b border-slate-200 py-3 space-y-1">
             <p><strong className="text-slate-500 w-24 inline-block">Factura N°:</strong> {order.id}</p>
             <p><strong className="text-slate-500 w-24 inline-block">Cliente:</strong> {order.userFullName}</p>
             <p><strong className="text-slate-500 w-24 inline-block">Fecha:</strong> {order.orderDate}</p>
          </div>
          <div>
            <h5 className="font-semibold text-slate-700 mb-2">Detalles:</h5>
            <ul className="space-y-2">
              {order.products.map(item => {
                  const product = getProductDetails(item.productId);
                  if(!product) return null;
                  return (
                    <li key={item.productId} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-slate-800">{product.name}</p>
                        <p className="text-slate-500">
                          {item.quantity} x ${product.price.toFixed(2)}
                        </p>
                      </div>
                      <p className="font-medium text-slate-800">${(item.quantity * product.price).toFixed(2)}</p>
                    </li>
                  );
              })}
            </ul>
          </div>
          <div className="border-t border-slate-200 pt-3 flex justify-end">
            <div className="text-right">
              <p className="text-slate-500">Subtotal: <span className="font-medium text-slate-800">${total.toFixed(2)}</span></p>
              <p className="font-bold text-lg text-slate-800 mt-1">Total: <span className="text-teal-600">${total.toFixed(2)}</span></p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-slate-50 flex justify-between items-center sticky bottom-0 z-10">
          <button
            onClick={handleSendWhatsApp}
            disabled={!order.phone}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            <WhatsappIcon className="h-5 w-5" />
            Enviar por WhatsApp
          </button>
          <button onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 transition">Cerrar</button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
