
import React from 'react';
import { InventoryItem, Product, Community } from '../types';

interface InventoryManagementProps {
  inventory: InventoryItem[];
  products: Product[];
  communities: Community[];
  title: string;
}

const InventoryManagement: React.FC<InventoryManagementProps> = ({ inventory, products, communities, title }) => {
  const getProduct = (productId: string) => products.find(p => p.id === productId);
  const getCommunity = (communityId: string) => communities.find(c => c.id === communityId);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-slate-800">{title}</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-500">
          <thead className="text-xs text-slate-700 uppercase bg-slate-100">
            <tr>
              <th scope="col" className="px-6 py-3">Producto</th>
              <th scope="col" className="px-6 py-3">Categoría</th>
              <th scope="col" className="px-6 py-3">Stock</th>
              <th scope="col" className="px-6 py-3">Comunidad</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map(item => {
              const product = getProduct(item.productId);
              const community = getCommunity(item.communityId);
              if (!product) return null;
              
              const stockColor = item.stock < 50 ? 'text-red-500 font-bold' : item.stock < 100 ? 'text-yellow-500' : 'text-green-500';

              return (
                <tr key={`${item.communityId}-${item.productId}`} className="bg-white border-b hover:bg-slate-50">
                  <th scope="row" className="px-6 py-4 font-medium text-slate-900 flex items-center gap-3">
                     <img src={product.imageUrl} alt={product.name} className="w-10 h-10 rounded-full object-cover"/>
                     {product.name}
                  </th>
                  <td className="px-6 py-4">{product.category}</td>
                  <td className={`px-6 py-4 ${stockColor}`}>{item.stock}</td>
                  <td className="px-6 py-4">{community?.name || item.communityId}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryManagement;
