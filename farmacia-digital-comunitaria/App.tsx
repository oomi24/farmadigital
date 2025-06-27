
import React, { useState, useMemo } from 'react';
import { Role, User, Order, InventoryItem, OrderStatus, Product, Community, Zone, OrderProduct } from './types';
import { USERS, ORDERS, INVENTORY, PRODUCTS, COMMUNITIES, ZONES } from './constants';
import { ChartBarIcon, ClipboardListIcon, CubeIcon, UsersIcon, LogoutIcon, PlusIcon, ShoppingCartIcon, MapIcon } from './components/icons';
import OrderManagement from './components/OrderManagement';
import InventoryManagement from './components/InventoryManagement';
import UserManagement from './components/UserManagement';
import DashboardCards from './components/DashboardCards';
import ProductCatalog from './components/ProductCatalog';
import CartView from './components/CartView';
import RouteInspection from './components/RouteInspection';

// --- Login Screen Component ---
const LoginScreen: React.FC<{ onLogin: (username: string, password: string) => { user?: User; error?: string } }> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const result = onLogin(username, password);
    if (result.error) {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 space-y-6">
        <div className="text-center">
            <h1 className="text-3xl font-bold text-teal-600">Farmacia Digital</h1>
            <p className="text-slate-500 mt-2">Bienvenido/a. Ingrese sus credenciales.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-slate-700">Usuario</label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              placeholder="roble"
            />
          </div>
          <div>
            <label htmlFor="password"className="block text-sm font-medium text-slate-700">Contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              Ingresar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


// --- Main App Component ---
export const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [view, setView] = useState<string>('dashboard');
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    
    // State for mock data to allow updates
    const [orders, setOrders] = useState<Order[]>(ORDERS);
    const [inventory, setInventory] = useState<InventoryItem[]>(INVENTORY);
    const [users, setUsers] = useState<User[]>(USERS);
    const [cart, setCart] = useState<OrderProduct[]>([]);

    const handleLogin = (username: string, password: string): { user?: User, error?: string } => {
        const userByName = users.find(u => u.username.toLowerCase() === username.toLowerCase());
        
        if (!userByName) {
            return { error: 'El nombre de usuario no existe.' };
        }
        
        if (userByName.password !== password) {
            return { error: 'La contraseña es incorrecta.' };
        }

        if (!userByName.approved) {
            return { error: 'Este usuario está pendiente de aprobación por un administrador.' };
        }
        
        setCurrentUser(userByName);
        setView('dashboard');
        return { user: userByName };
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setCart([]);
    };

    const handleUpdateOrder = (orderId: string, newStatus: OrderStatus, dispatchDate?: string, carrierName?: string) => {
        setOrders(prevOrders =>
            prevOrders.map(o => 
                o.id === orderId ? { ...o, status: newStatus, dispatchDate: dispatchDate || o.dispatchDate, carrierName: carrierName || o.carrierName } : o
            )
        );
    };
    
    const handleUpdateUser = (updatedUser: User) => {
      setUsers(prevUsers => 
        prevUsers.map(u => (u.id === updatedUser.id ? updatedUser : u))
      );
    };
    
    const handleAddUser = (newUserFields: Partial<User>) => {
        if(!currentUser) return;

        const newUser: User = {
            id: `user-${Date.now()}`,
            name: newUserFields.name || 'Nuevo Usuario',
            email: newUserFields.email || '',
            username: newUserFields.username || '',
            password: newUserFields.password || 'Apamate.25',
            role: newUserFields.role || Role.COMMUNITY_MANAGER,
            approved: newUserFields.approved || false,
            communityId: newUserFields.role !== Role.ADMIN ? currentUser.communityId : undefined,
            zoneId: newUserFields.role !== Role.ADMIN ? currentUser.zoneId : undefined,
        };
        setUsers(prev => [...prev, newUser]);
    };

    const handleDeleteUser = (userId: string) => {
        setUsers(prev => prev.filter(u => u.id !== userId));
    };

    // --- Cart Handlers ---
    const handleAddToCart = (product: Product, quantity: number) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.productId === product.id);
            if (existingItem) {
                return prevCart.map(item => item.productId === product.id ? { ...item, quantity: item.quantity + quantity } : item);
            }
            return [...prevCart, { productId: product.id, quantity }];
        });
    };

    const handleUpdateCartQuantity = (productId: string, quantity: number) => {
        if(quantity <= 0) {
            handleRemoveFromCart(productId);
            return;
        }
        setCart(prevCart => prevCart.map(item => item.productId === productId ? { ...item, quantity } : item));
    };

    const handleRemoveFromCart = (productId: string) => {
        setCart(prevCart => prevCart.filter(item => item.productId !== productId));
    };

    const handleCreateOrder = (details: { userFullName: string, comments: string, phone: string }) => {
        if (!currentUser || currentUser.role !== Role.COMMUNITY_MANAGER) return;
        const newOrder: Order = {
            id: `ord-${Date.now()}`,
            userFullName: details.userFullName,
            communityId: currentUser.communityId!,
            products: cart,
            status: OrderStatus.PENDING,
            orderDate: new Date().toISOString().split('T')[0],
            comments: details.comments,
            phone: details.phone,
        };
        setOrders(prev => [newOrder, ...prev]);
        setCart([]);
        setView('orders');
    };

    const navigationLinks = useMemo(() => {
        if (!currentUser) return [];
        const base = [
            { name: 'Dashboard', icon: ChartBarIcon, view: 'dashboard' },
            { name: 'Pedidos', icon: ClipboardListIcon, view: 'orders' },
            { name: 'Inventario', icon: CubeIcon, view: 'inventory' },
        ];
        
        if ([Role.ADMIN, Role.ZONE_MANAGER].includes(currentUser.role)) {
            base.push({ name: 'Inspección de Rutas', icon: MapIcon, view: 'route-inspection' });
        }

        if (currentUser.role === Role.COMMUNITY_MANAGER) {
            base.splice(1, 0, { name: 'Nuevo Pedido', icon: PlusIcon, view: 'catalog'});
        }
        
        const canManageUsers = [Role.ADMIN, Role.ZONE_MANAGER, Role.COMMUNITY_MANAGER].includes(currentUser.role);
        if (canManageUsers) {
            base.push({ name: 'Usuarios', icon: UsersIcon, view: 'users' });
        }

        return base;
    }, [currentUser]);

    const filteredData = useMemo(() => {
        if (!currentUser) return { filteredOrders: [], filteredInventory: [], filteredCommunities: [], filteredUsers: [] };

        let filteredOrders: Order[] = [];
        let filteredInventory: InventoryItem[] = [];
        let filteredCommunities: Community[] = [];

        switch (currentUser.role) {
            case Role.ADMIN:
                filteredOrders = orders;
                filteredInventory = inventory;
                filteredCommunities = COMMUNITIES;
                break;
            case Role.ZONE_MANAGER:
                const zoneCommunities = COMMUNITIES.filter(c => c.zoneId === currentUser.zoneId);
                const communityIdsInZone = zoneCommunities.map(c => c.id);
                filteredOrders = orders.filter(o => communityIdsInZone.includes(o.communityId));
                filteredInventory = inventory.filter(i => communityIdsInZone.includes(i.communityId));
                filteredCommunities = zoneCommunities;
                break;
            case Role.COMMUNITY_MANAGER:
                filteredOrders = orders.filter(o => o.communityId === currentUser.communityId);
                filteredInventory = inventory.filter(i => i.communityId === currentUser.communityId);
                filteredCommunities = COMMUNITIES.filter(c => c.id === currentUser.communityId);
                break;
            default:
                break;
        }
        return { filteredOrders, filteredInventory, filteredCommunities };
    }, [currentUser, orders, inventory]);

    const filteredUsers = useMemo(() => {
        if (!currentUser) return [];
        switch (currentUser.role) {
            case Role.ADMIN:
                return users;
            case Role.ZONE_MANAGER:
                const communityIdsInZone = COMMUNITIES
                    .filter(c => c.zoneId === currentUser.zoneId)
                    .map(c => c.id);
                return users.filter(u => (u.zoneId === currentUser.zoneId) || (u.communityId && communityIdsInZone.includes(u.communityId)));
            case Role.COMMUNITY_MANAGER:
                 return users.filter(u => u.communityId === currentUser.communityId);
            case Role.DRIVER:
                const manager = users.find(u => u.communityId === currentUser.communityId && u.role === Role.COMMUNITY_MANAGER);
                return manager ? [currentUser, manager] : [currentUser];
            default:
                return [];
        }
    }, [currentUser, users]);
    
    if (!currentUser) {
        return <LoginScreen onLogin={handleLogin} />;
    }

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-slate-800 text-slate-100">
            <div className="p-4 border-b border-slate-700">
                <h2 className="text-xl font-bold text-white">Farmacia Digital</h2>
                <div className="mt-4">
                    <p className="font-semibold">{currentUser.name}</p>
                    <p className="text-sm text-teal-300">{currentUser.role}</p>
                </div>
            </div>
            <nav className="flex-1 p-4 space-y-2">
                {navigationLinks.map(link => (
                    <button
                        key={link.name}
                        onClick={() => { setView(link.view); setSidebarOpen(false); }}
                        className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            view === link.view ? 'bg-teal-600 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                        }`}
                    >
                        <link.icon className="h-5 w-5 mr-3" />
                        {link.name}
                    </button>
                ))}
            </nav>
            <div className="p-4 border-t border-slate-700">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                >
                    <LogoutIcon className="h-5 w-5 mr-3" />
                    Cerrar Sesión
                </button>
            </div>
        </div>
    );
    
    const renderContent = () => {
        switch (view) {
            case 'dashboard':
                return <DashboardCards orders={filteredData.filteredOrders} inventory={filteredData.filteredInventory} communities={filteredData.filteredCommunities} products={PRODUCTS} currentUser={currentUser} setView={setView} />;
            case 'orders':
                return <OrderManagement orders={filteredData.filteredOrders} products={PRODUCTS} communities={COMMUNITIES} currentUser={currentUser} onUpdateOrder={handleUpdateOrder} />;
            case 'inventory':
                 const title = currentUser.role === Role.COMMUNITY_MANAGER ? `Inventario de ${filteredData.filteredCommunities[0]?.name}` : `Inventario General`;
                return <InventoryManagement inventory={filteredData.filteredInventory} products={PRODUCTS} communities={COMMUNITIES} title={title} />;
            case 'users':
                return <UserManagement users={filteredUsers} currentUser={currentUser} onUpdateUser={handleUpdateUser} onAddUser={handleAddUser} onDeleteUser={handleDeleteUser} />;
            case 'catalog':
                return <ProductCatalog products={PRODUCTS} onAddToCart={handleAddToCart} />;
            case 'cart':
                return <CartView cart={cart} products={PRODUCTS} onUpdateCartQuantity={handleUpdateCartQuantity} onRemoveFromCart={handleRemoveFromCart} onCreateOrder={handleCreateOrder} onGoBack={() => setView('catalog')} />;
            case 'route-inspection':
                return <RouteInspection zones={ZONES} communities={filteredData.filteredCommunities} orders={filteredData.filteredOrders} />
            default:
                return <div>Seleccione una vista</div>;
        }
    };
    
    const canShowCart = currentUser.role === Role.COMMUNITY_MANAGER;
    const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="flex h-screen bg-slate-100">
             {/* Mobile Sidebar */}
            <div className={`fixed inset-0 z-40 transition-opacity duration-300 lg:hidden ${isSidebarOpen ? 'bg-black bg-opacity-50' : 'pointer-events-none opacity-0'}`} onClick={() => setSidebarOpen(false)}></div>
            <div className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 lg:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <SidebarContent />
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden lg:flex lg:flex-shrink-0">
                <div className="w-64">
                    <SidebarContent />
                </div>
            </div>

            <div className="flex flex-col flex-1 min-w-0">
                 {/* Header */}
                 <header className="flex-shrink-0 bg-white shadow-sm">
                    <div className="px-4 h-16 flex items-center justify-between">
                         <button onClick={() => setSidebarOpen(true)} className="text-slate-500 lg:hidden">
                            <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                        </button>
                        <h1 className="text-lg font-semibold text-slate-800">{navigationLinks.find(l => l.view === view)?.name}</h1>
                        
                        {canShowCart ? (
                           <button onClick={() => setView('cart')} className="relative text-slate-600 hover:text-teal-600">
                               <ShoppingCartIcon className="h-7 w-7" />
                               {cartItemCount > 0 && (
                                   <span className="absolute -top-1 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                                       {cartItemCount}
                                   </span>
                               )}
                           </button>
                        ) : <div className="w-7 h-7"></div>}
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};
