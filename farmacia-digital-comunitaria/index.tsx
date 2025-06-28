import React, { useState, useEffect } from 'react';
import { Product, Community, User, Role, InventoryItem } from '../types';
import { XIcon } from './icons';

interface InventoryFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (communityId: string, productId: string, stock: number) => void;
    products: Product[];
    communities: Community[];
    currentUser: User;
    inventory: InventoryItem[];
}

export const InventoryFormModal: React.FC<InventoryFormModalProps> = ({ isOpen, onClose, onSave, products, communities, currentUser, inventory }) => {
    const [productId, setProductId] = useState<string>('');
    const [communityId, setCommunityId] = useState<string>('');
    const [stock, setStock] = useState<string>('0'); // Use string for controlled input

    // Effect to initialize or update form when selections change or modal opens
    useEffect(() => {
        if (isOpen) {
            let currentCommunityId = communityId;
            let currentProductId = productId;

            // Initialize community ID on first open or if it's not set
            if (!currentCommunityId) {
                currentCommunityId = currentUser.role === Role.COMMUNITY_MANAGER
                    ? currentUser.communityId || ''
                    : communities.length > 0 ? communities[0].id : '';
                setCommunityId(currentCommunityId);
            }
            
            // Initialize product ID on first open or if it's not set
            if (!currentProductId) {
                 currentProductId = products.length > 0 ? products[0].id : '';
                 setProductId(currentProductId);
            }
            
            if (currentCommunityId && currentProductId) {
                 const existingItem = inventory.find(
                    i => i.communityId === currentCommunityId && i.productId === currentProductId
                );
                // Update stock based on selection, default to 0 for new items
                setStock(existingItem ? String(existingItem.stock) : '0');
            }
        } else {
            // Reset form state when modal closes to avoid stale data
            setProductId('');
            setCommunityId('');
            setStock('0');
        }
    }, [isOpen, productId, communityId, currentUser, communities, products, inventory]);


    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const stockNumber = parseInt(stock, 10);

        if (!productId || !communityId) {
            alert('Por favor seleccione un producto y una comunidad.');
            return;
        }
        // Handle case where input is empty or not a valid number
        if (isNaN(stockNumber) || stockNumber < 0) {
            alert('La cantidad en stock debe ser un número válido y no negativo.');
            return;
        }

        onSave(communityId, productId, stockNumber);
        onClose();
    };
    
    const handleStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Allow only digits (or an empty string)
        if (/^\d*$/.test(value)) {
            setStock(value);
        }
    };

    const canSelectCommunity = currentUser.role === Role.ADMIN || currentUser.role === Role.ZONE_MANAGER;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white z-10">
                    <h3 className="text-lg font-semibold">Actualizar Inventario</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><XIcon className="h-6 w-6" /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {canSelectCommunity ? (
                        <div>
                            <label htmlFor="community" className="block text-sm font-medium text-slate-600">Comunidad</label>
                            <select id="community" value={communityId} onChange={e => setCommunityId(e.target.value)} className="mt-1 w-full p-2 border border-slate-300 rounded-md shadow-sm">
                                {communities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                    ) : (
                        <div>
                            <p className="text-sm font-medium text-slate-600">Comunidad</p>
                            <p className="mt-1 p-2 bg-slate-100 rounded-md text-slate-800">{communities.find(c => c.id === currentUser.communityId)?.name || 'Mi Comunidad'}</p>
                        </div>
                    )}
                    <div>
                        <label htmlFor="product" className="block text-sm font-medium text-slate-600">Producto</label>
                        <select id="product" value={productId} onChange={e => setProductId(e.target.value)} className="mt-1 w-full p-2 border border-slate-300 rounded-md shadow-sm">
                            <option value="" disabled>Seleccione un producto</option>
                            {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="stock" className="block text-sm font-medium text-slate-600">Cantidad en Stock</label>
                        <input
                            type="text" // Using text allows for more controlled input (e.g., empty string)
                            inputMode="numeric" // Provides a numeric keyboard on mobile devices
                            id="stock"
                            value={stock}
                            onChange={handleStockChange}
                            className="mt-1 w-full p-2 border border-slate-300 rounded-md shadow-sm"
                            required
                        />
                    </div>
                    <div className="p-4 bg-slate-50 flex justify-end space-x-2 -m-6 mt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 transition">Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
