
import React, { useState } from 'react';
import { OrderProduct, Product } from '../types';
import { TrashIcon } from './icons';

interface CartViewProps {
    cart: OrderProduct[];
    products: Product[];
    onUpdateCartQuantity: (productId: string, quantity: number) => void;
    onRemoveFromCart: (productId: string) => void;
    onCreateOrder: (details: { userFullName: string, comments: string, phone: string }) => void;
    onGoBack: () => void;
}

const CartView: React.FC<CartViewProps> = ({ cart, products, onUpdateCartQuantity, onRemoveFromCart, onCreateOrder, onGoBack }) => {
    const [userFullName, setUserFullName] = useState('');
    const [comments, setComments] = useState('');
    const [phone, setPhone] = useState('');
    
    const getProductDetails = (productId: string) => products.find(p => p.id === productId);

    const total = cart.reduce((sum, item) => {
        const product = getProductDetails(item.productId);
        return sum + (product ? product.price * item.quantity : 0);
    }, 0);

    const handleCreateOrder = (e: React.FormEvent) => {
        e.preventDefault();
        if (!userFullName.trim()) {
            alert('Por favor, ingrese el nombre del solicitante.');
            return;
        }
        onCreateOrder({ userFullName, comments, phone });
    };

    if (cart.length === 0) {
        return (
            <div className="text-center p-10 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Tu carrito está vacío</h2>
                <p className="text-slate-500 mb-6">Añade productos desde el catálogo para crear un nuevo pedido.</p>
                <button onClick={onGoBack} className="px-6 py-2 bg-teal-600 text-white font-semibold rounded-md hover:bg-teal-700 transition">
                    Volver al Catálogo
                </button>
            </div>
        );
    }
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-slate-800">Carrito de Compras</h2>
                <div className="space-y-4">
                    {cart.map(item => {
                        const product = getProductDetails(item.productId);
                        if (!product) return null;
                        return (
                            <div key={item.productId} className="flex items-center justify-between border-b pb-4">
                                <div className="flex items-center gap-4">
                                    <img src={product.imageUrl} alt={product.name} className="w-16 h-16 rounded-md object-cover"/>
                                    <div>
                                        <h3 className="font-semibold text-slate-800">{product.name}</h3>
                                        <p className="text-sm text-slate-500">${product.price.toFixed(2)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <input 
                                        type="number" 
                                        min="1" 
                                        value={item.quantity} 
                                        onChange={(e) => onUpdateCartQuantity(item.productId, parseInt(e.target.value, 10))}
                                        className="w-16 p-2 border border-slate-300 rounded-md text-center"
                                    />
                                    <p className="font-bold w-20 text-right">${(product.price * item.quantity).toFixed(2)}</p>
                                    <button onClick={() => onRemoveFromCart(item.productId)} className="text-red-500 hover:text-red-700">
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className="lg:col-span-1">
                 <form onSubmit={handleCreateOrder} className="bg-white p-6 rounded-lg shadow-lg space-y-4 sticky top-8">
                     <h3 className="text-xl font-bold text-slate-800">Resumen del Pedido</h3>
                     <div className="flex justify-between font-bold text-lg">
                         <span>Total:</span>
                         <span>${total.toFixed(2)}</span>
                     </div>
                     <hr/>
                    <div>
                        <label htmlFor="userFullName" className="block text-sm font-medium text-slate-700">Nombre del Solicitante</label>
                        <input type="text" id="userFullName" value={userFullName} onChange={(e) => setUserFullName(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm" />
                    </div>
                     <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-slate-700">Teléfono (WhatsApp)</label>
                        <input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Ej: 584121234567" className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm" />
                    </div>
                     <div>
                        <label htmlFor="comments" className="block text-sm font-medium text-slate-700">Comentarios Adicionales</label>
                        <textarea id="comments" value={comments} onChange={(e) => setComments(e.target.value)} rows={3} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm"></textarea>
                    </div>
                    <button type="submit" className="w-full px-6 py-3 bg-teal-600 text-white font-bold rounded-md hover:bg-teal-700 transition">
                        Realizar Pedido
                    </button>
                    <button type="button" onClick={onGoBack} className="w-full text-center mt-2 text-teal-600 font-semibold hover:underline">
                        o seguir comprando
                    </button>
                 </form>
            </div>
        </div>
    );
};

export default CartView;
