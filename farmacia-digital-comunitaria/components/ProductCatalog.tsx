
import React, { useState } from 'react';
import { Product } from '../types';

interface ProductCatalogProps {
    products: Product[];
    onAddToCart: (product: Product, quantity: number) => void;
}

const ProductCard: React.FC<{ product: Product; onAddToCart: (product: Product, quantity: number) => void; }> = ({ product, onAddToCart }) => {
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);

    const handleAddToCart = () => {
        onAddToCart(product, quantity);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000); // Reset button state after 2s
    };

    return (
        <div className="bg-white border border-slate-200 rounded-lg shadow-md flex flex-col">
            <img src={product.imageUrl} alt={product.name} className="w-full h-40 object-cover rounded-t-lg" />
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-bold text-slate-800 text-lg">{product.name}</h3>
                <p className="text-sm text-slate-500 flex-grow mt-1">{product.description}</p>
                <p className="text-xl font-semibold text-teal-600 my-3">${product.price.toFixed(2)}</p>
                <div className="flex items-center gap-2 mt-auto">
                    <input 
                        type="number" 
                        min="1" 
                        value={quantity} 
                        onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
                        className="w-16 p-2 border border-slate-300 rounded-md text-center"
                    />
                    <button 
                        onClick={handleAddToCart}
                        className={`w-full px-4 py-2 rounded-md text-white font-semibold transition-colors ${added ? 'bg-green-500' : 'bg-teal-600 hover:bg-teal-700'}`}
                    >
                        {added ? 'Añadido!' : 'Añadir'}
                    </button>
                </div>
            </div>
        </div>
    );
};


const ProductCatalog: React.FC<ProductCatalogProps> = ({ products, onAddToCart }) => {
    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 text-slate-800">Catálogo de Productos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map(product => (
                    <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
                ))}
            </div>
        </div>
    );
};

export default ProductCatalog;