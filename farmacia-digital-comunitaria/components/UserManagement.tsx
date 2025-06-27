
import React, { useState, useEffect, useMemo } from 'react';
import { User, Role, Community, Zone } from '../types';
import { XIcon, PlusIcon, TrashIcon } from './icons';

interface UserManagementProps {
  users: User[];
  currentUser: User;
  onUpdateUser: (user: User) => void;
  onAddUser: (user: Partial<User>) => void;
  onDeleteUser: (userId: string) => void;
}

const getRoleColor = (role: Role) => {
  switch (role) {
    case Role.ADMIN: return 'bg-purple-100 text-purple-800';
    case Role.ZONE_MANAGER: return 'bg-sky-100 text-sky-800';
    case Role.COMMUNITY_MANAGER: return 'bg-amber-100 text-amber-800';
    case Role.DRIVER: return 'bg-slate-100 text-slate-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const UserFormModal: React.FC<{
  user: User | null;
  isOpen: boolean;
  currentUser: User;
  onClose: () => void;
  onSave: (user: Partial<User>) => void;
}> = ({ user, isOpen, currentUser, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<User>>({});
  const isCreateMode = !user;

  const assignableRoles = useMemo(() => {
    if (!currentUser) return [];
    switch (currentUser.role) {
        case Role.ADMIN:
            return Object.values(Role);
        case Role.ZONE_MANAGER:
            return [Role.ZONE_MANAGER, Role.COMMUNITY_MANAGER, Role.DRIVER];
        case Role.COMMUNITY_MANAGER:
            return [Role.COMMUNITY_MANAGER, Role.DRIVER];
        default:
            return [];
    }
  }, [currentUser]);


  useEffect(() => {
    if (user) {
      const { password, ...userWithoutPassword } = user;
      setFormData({ ...userWithoutPassword, password: '' });
    } else {
      setFormData({ role: assignableRoles[0] || Role.DRIVER, approved: false });
    }
  }, [user, isOpen, assignableRoles]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = () => {
    if(isCreateMode && (!formData.username || !formData.password)) {
        alert("El nombre de usuario y la contraseña son obligatorios.");
        return;
    }

    let dataToSave = { ...formData };
    if (!isCreateMode && user) {
        if (!dataToSave.password || dataToSave.password.trim() === '') {
            dataToSave.password = user.password;
        }
        dataToSave = { ...user, ...dataToSave };
    }
    
    onSave(dataToSave);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-full overflow-y-auto">
        <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white z-10">
          <h3 className="text-lg font-semibold">{isCreateMode ? 'Crear Nuevo Usuario' : `Editar Usuario: ${user?.name}`}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><XIcon className="h-6 w-6" /></button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="p-6 space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-600">Nombre Completo</label>
                <input type="text" name="name" value={formData.name || ''} onChange={handleChange} className="mt-1 w-full p-2 border border-slate-300 rounded-md shadow-sm" required />
            </div>
             <div>
                <label className="block text-sm font-medium text-slate-600">Nombre de Usuario</label>
                <input type="text" name="username" value={formData.username || ''} onChange={handleChange} className="mt-1 w-full p-2 border border-slate-300 rounded-md shadow-sm" required />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-600">Email</label>
                <input type="email" name="email" value={formData.email || ''} onChange={handleChange} className="mt-1 w-full p-2 border border-slate-300 rounded-md shadow-sm" required />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-600">Rol</label>
                 <select name="role" value={formData.role || ''} onChange={handleChange} className="mt-1 w-full p-2 border border-slate-300 rounded-md shadow-sm">
                    {assignableRoles.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
            </div>
             <div>
                <label className="block text-sm font-medium text-slate-600">Contraseña</label>
                <input type="password" name="password" placeholder={isCreateMode ? "Requerido" : "Dejar en blanco para no cambiar"} value={formData.password || ''} onChange={handleChange} className="mt-1 w-full p-2 border border-slate-300 rounded-md shadow-sm" required={isCreateMode} />
            </div>
           {currentUser.role === Role.ADMIN && (
             <div className="flex items-center pt-2">
                <input type="checkbox" id="approved" name="approved" checked={formData.approved || false} onChange={handleChange} className="h-4 w-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500" />
                <label htmlFor="approved" className="ml-2 block text-sm text-slate-900">Usuario Aprobado para Iniciar Sesión</label>
            </div>
           )}
            <div className="p-4 bg-slate-50 flex justify-end space-x-2 sticky bottom-0 z-10 -m-6 mt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 transition">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition">Guardar Cambios</button>
            </div>
        </form>
      </div>
    </div>
  );
};


const UserManagement: React.FC<UserManagementProps> = ({ users, currentUser, onUpdateUser, onAddUser, onDeleteUser }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCreateClick = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  }

  const handleSave = (userData: Partial<User>) => {
    if (userData.id) {
      onUpdateUser(userData as User);
    } else {
      onAddUser(userData);
    }
    handleCloseModal();
  };

  const handleDelete = (userId: string) => {
      if(userId === currentUser.id) {
        alert('No puedes eliminar tu propio usuario.');
        return;
      }
      if (window.confirm('¿Está seguro de que desea eliminar este usuario? Esta acción es irreversible.')) {
          onDeleteUser(userId);
      }
  };

  const handleRoleChange = (userId: string, newRole: Role) => {
    const userToUpdate = users.find(u => u.id === userId);
    if(userToUpdate) {
        onUpdateUser({ ...userToUpdate, role: newRole });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-slate-800">Gestión de Usuarios</h2>
        <button onClick={handleCreateClick} className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition">
            <PlusIcon className="h-5 w-5" />
            Crear Usuario
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-500">
          <thead className="text-xs text-slate-700 uppercase bg-slate-100">
            <tr>
              <th scope="col" className="px-6 py-3">Nombre</th>
              <th scope="col" className="px-6 py-3">Email</th>
              <th scope="col" className="px-6 py-3">Rol</th>
              <th scope="col" className="px-6 py-3">Estado</th>
              <th scope="col" className="px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="bg-white border-b hover:bg-slate-50">
                <th scope="row" className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">{user.name}</th>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">
                    {currentUser.role === Role.ADMIN && user.id !== currentUser.id ? (
                        <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(user.id, e.target.value as Role)}
                            className={`w-full p-1 border border-slate-300 rounded-md text-xs font-medium ${getRoleColor(user.role)}`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {Object.values(Role).map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    ) : (
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                            {user.role}
                        </span>
                    )}
                </td>
                 <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${user.approved ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {user.approved ? 'Aprobado' : 'Pendiente'}
                    </span>
                </td>
                <td className="px-6 py-4 space-x-2 whitespace-nowrap">
                  <button onClick={() => handleEditClick(user)} className="font-medium text-teal-600 hover:underline">Editar</button>
                  {user.id !== currentUser.id && (
                    <button onClick={() => handleDelete(user.id)} className="font-medium text-red-600 hover:underline">Eliminar</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
       <UserFormModal 
        user={selectedUser}
        isOpen={isModalOpen}
        currentUser={currentUser}
        onClose={handleCloseModal}
        onSave={handleSave}
      />
    </div>
  );
};

export default UserManagement;
