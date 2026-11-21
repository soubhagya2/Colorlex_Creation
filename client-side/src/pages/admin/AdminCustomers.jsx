import React, { useState, useEffect } from 'react';
import { Search, Mail, Phone } from 'lucide-react';
import { apiFetch } from '../../services/api';

export default function AdminCustomers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/auth/users');
      if (res.success) setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleToggle = async (userId, currentRole) => {
    const newRole = currentRole === 'staff' ? 'customer' : 'staff';
    if (!window.confirm(`Change user role to ${newRole}?`)) return;

    try {
      await apiFetch(`/auth/users/${userId}/role`, {
        method: 'PUT',
        body: JSON.stringify({ role: newRole })
      });
      fetchUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Customer & Staff Directory</h1>
          <p className="text-slate-400 text-sm mt-0.5">View registered print clients, manage account roles and permissions</p>
        </div>
      </div>

      <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
        <div className="relative w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or email address..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>
        <span className="text-xs text-slate-400 font-semibold">{filteredUsers.length} Users Listed</span>
      </div>

      <div className="bg-slate-950/70 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/80 border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <th className="p-4">User</th>
              <th className="p-4">Contact Info</th>
              <th className="p-4">Role</th>
              <th className="p-4">Joined Date</th>
              <th className="p-4 text-right">Role Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-sm">
            {loading ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-slate-400">Loading user roster...</td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-slate-400">No users found.</td>
              </tr>
            ) : (
              filteredUsers.map((u) => (
                <tr key={u._id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center font-bold text-xs text-white">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-white block">{u.name}</span>
                        <span className="text-xs text-slate-500">ID: {u._id.substring(18)}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-xs text-slate-300">
                    <div className="flex items-center space-x-1.5"><Mail className="w-3.5 h-3.5 text-slate-500" /><span>{u.email}</span></div>
                    {u.phone && <div className="flex items-center space-x-1.5 text-slate-400 mt-1"><Phone className="w-3.5 h-3.5 text-slate-500" /><span>{u.phone}</span></div>}
                  </td>
                  <td className="p-4">
                    <span className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-full ${
                      u.role === 'super_admin'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : u.role === 'staff'
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {u.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-slate-400">
                    {new Date(u.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="p-4 text-right">
                    {u.role !== 'super_admin' && (
                      <button
                        onClick={() => handleRoleToggle(u._id, u.role)}
                        className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-purple-400 border border-slate-800 transition-colors"
                      >
                        Set as {u.role === 'staff' ? 'Customer' : 'Staff'}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
