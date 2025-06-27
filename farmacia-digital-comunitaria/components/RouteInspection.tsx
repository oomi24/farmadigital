
import React from 'react';
import { Zone, Community, Order, OrderStatus } from '../types';

interface RouteInspectionProps {
  zones: Zone[];
  communities: Community[];
  orders: Order[];
}

const RouteInspection: React.FC<RouteInspectionProps> = ({ zones, communities, orders }) => {

  const getPendingOrdersCount = (communityId: string) => {
    return orders.filter(o => o.communityId === communityId && o.status === OrderStatus.PENDING).length;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-1 text-slate-800">Inspección de Rutas</h2>
      <p className="text-slate-500 mb-6">Visualización de pedidos pendientes por comunidad.</p>
      
      <div className="relative w-full h-[600px] bg-slate-100 rounded-lg border border-slate-200 overflow-hidden">
        {/* Render Zones */}
        {zones.map(zone => (
          <div 
            key={zone.id}
            className="absolute bg-sky-100 bg-opacity-50 border-2 border-dashed border-sky-300 rounded-lg"
            style={{ 
              left: `${zone.x}%`, 
              top: `${zone.y}%`,
              width: '35%', 
              height: '40%',
            }}
          >
            <span className="absolute -top-3 -left-3 bg-sky-500 text-white text-xs font-bold px-2 py-1 rounded">{zone.name}</span>
          </div>
        ))}

        {/* Render Communities */}
        {communities.map(community => {
          const pendingCount = getPendingOrdersCount(community.id);
          const dotSize = 24 + (pendingCount * 4);
          const color = pendingCount > 0 ? 'bg-red-500' : 'bg-teal-500';
          const zIndex = pendingCount > 0 ? 20 : 10;

          return (
             <div
              key={community.id}
              className="absolute group"
              style={{
                left: `${community.x}%`,
                top: `${community.y}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: zIndex,
              }}
            >
              <div
                className={`flex items-center justify-center rounded-full shadow-lg border-2 border-white transition-all duration-300 ease-in-out ${color}`}
                style={{ width: `${dotSize}px`, height: `${dotSize}px` }}
              >
                {pendingCount > 0 && (
                    <span className="text-white font-bold text-sm">{pendingCount}</span>
                )}
              </div>
               <div className="absolute bottom-full mb-2 w-max left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {community.name}
                <br/>
                <span className="text-red-300">Pendientes: {pendingCount}</span>
              </div>
            </div>
          );
        })}
      </div>

       <div className="mt-4 flex items-center space-x-4 text-sm text-slate-600">
            <h4 className="font-semibold">Leyenda:</h4>
            <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-teal-500"></div>
                <span>Sin pedidos pendientes</span>
            </div>
            <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-red-500"></div>
                <span>Con pedidos pendientes</span>
            </div>
        </div>
    </div>
  );
};

export default RouteInspection;
