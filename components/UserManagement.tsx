import React, { useState, useMemo } from 'react';
import type { User } from '../types';
import { Role } from '../types';
import Modal from './Modal';
import Badge from './Badge';
import { PlusIcon, EditIcon, TrashIcon, EyeIcon, EyeSlashIcon } from '../constants';

interface UserManagementProps {
  users: User[];
  onAddUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  onUpdateUser: (user: User) => void;
  onDeleteUser: (id: string) => void;
}

interface UserFormProps {
  onSubmit: (user: Omit<User, 'id' | 'createdAt'> | User) => void;
  onClose: () => void;
  initialData?: User | null;
}

const UserForm: React.FC<UserFormProps> = ({ onSubmit, onClose, initialData }) => {
  const [formData, setFormData] = useState({
    username: initialData?.username || '',
    password: initialData?.password || '',
    role: initialData?.role || Role.Staff,
    isActive: initialData?.isActive ?? true,
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [id]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [id]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate username and password
    if (formData.username.length < 3) {
      alert('Username must be at least 3 characters long');
      return;
    }
    if (formData.password.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    const userData = {
      ...formData,
      role: formData.role as Role,
    };

    if (initialData) {
      onSubmit({ ...initialData, ...userData });
    } else {
      onSubmit(userData);
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-slate-700">
            Username *
          </label>
          <input
            type="text"
            id="username"
            value={formData.username}
            onChange={handleChange}
            required
            minLength={3}
            className="mt-1 block w-full input-field"
            placeholder="Enter username"
          />
          <p className="text-xs text-slate-500 mt-1">Minimum 3 characters</p>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-700">
            Password *
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              className="mt-1 block w-full input-field pr-10"
              placeholder="Enter password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-1">Minimum 6 characters</p>
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-slate-700">
            Role *
          </label>
          <select
            id="role"
            value={formData.role}
            onChange={handleChange}
            required
            className="mt-1 block w-full input-field"
          >
            {Object.values(Role).map(roleValue => (
              <option key={roleValue} value={roleValue}>
                {roleValue}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center pt-6">
          <input
            type="checkbox"
            id="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="isActive" className="ml-2 text-sm font-medium text-slate-700">
            Active Account
          </label>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {initialData ? 'Update User' : 'Add User'}
        </button>
      </div>

      <style>{`
        .input-field {
          padding: 0.5rem 0.75rem;
          background-color: white;
          border: 1px solid #cbd5e1;
          border-radius: 0.375rem;
          box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
          outline: none;
          color: #1e293b;
        }
        .input-field:focus {
          ring: 1px solid #3b82f6;
          border-color: #3b82f6;
        }
      `}</style>
    </form>
  );
};

export const UserManagement: React.FC<UserManagementProps> = ({
  users,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | Role>('all');

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = filterRole === 'all' || user.role === filterRole;
      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, filterRole]);

  const handleOpenModal = (user?: User) => {
    setEditingUser(user || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleSubmit = (userData: Omit<User, 'id' | 'createdAt'> | User) => {
    if ('id' in userData) {
      onUpdateUser(userData);
    } else {
      onAddUser(userData);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string, username: string) => {
    if (window.confirm(`Are you sure you want to delete user "${username}"? This action cannot be undone.`)) {
      onDeleteUser(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">User Management</h2>
          <p className="text-slate-600 text-sm mt-1">Manage admin and staff login credentials</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add New User
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value as 'all' | Role)}
            className="w-full md:w-48 px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Roles</option>
            {Object.values(Role).map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {filteredUsers.map(user => (
          <div key={user.id} className="bg-white rounded-lg shadow-md p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-slate-800">{user.username}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <Badge text={user.role} color={user.role === Role.Admin ? 'red' : 'blue'} />
                  <Badge
                    text={user.isActive ? 'Active' : 'Inactive'}
                    color={user.isActive ? 'green' : 'gray'}
                  />
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleOpenModal(user)}
                  className="text-slate-500 hover:text-blue-600"
                >
                  <EditIcon />
                </button>
                <button
                  onClick={() => handleDelete(user.id, user.username)}
                  className="text-slate-500 hover:text-red-600"
                >
                  <TrashIcon />
                </button>
              </div>
            </div>
            <div className="text-sm text-slate-600 border-t pt-2">
              <p><span className="font-semibold">Created:</span> {new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-500">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50">
            <tr>
              <th className="px-6 py-3">Username</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Created</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id} className="bg-white border-b hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900">{user.username}</td>
                <td className="px-6 py-4">
                  <Badge text={user.role} color={user.role === Role.Admin ? 'red' : 'blue'} />
                </td>
                <td className="px-6 py-4">
                  <Badge
                    text={user.isActive ? 'Active' : 'Inactive'}
                    color={user.isActive ? 'green' : 'gray'}
                  />
                </td>
                <td className="px-6 py-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => handleOpenModal(user)}
                      className="text-slate-500 hover:text-blue-600"
                    >
                      <EditIcon />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id, user.username)}
                      className="text-slate-500 hover:text-red-600"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <p className="text-slate-500">No users found</p>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingUser ? 'Edit User' : 'Add New User'}
      >
        <UserForm
          onSubmit={handleSubmit}
          onClose={handleCloseModal}
          initialData={editingUser}
        />
      </Modal>
    </div>
  );
};
