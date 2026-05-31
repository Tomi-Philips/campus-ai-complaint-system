'use client';

import { useState, useEffect } from 'react';
import { userService } from '@/lib/services/user.service';
import { motion } from 'framer-motion';
import {
  Users,
  Search,
  Shield,
  UserCircle,
  MoreVertical,
  Mail,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Crown,
  GraduationCap,
  Sparkles,
  Filter,
  UserCheck,
  Clock,
  Loader2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setIsLoading(true);
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  }

  const handleRoleChange = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'student' : 'admin';
    setUpdatingId(userId);
    try {
      await userService.updateUserRole(userId, newRole);
      toast.success(`Role updated to ${newRole}`);
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update role');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === 'admin' || u.role === 'super_admin').length,
    students: users.filter(u => u.role === 'student').length,
  };

  return (
    <div className="space-y-6 md:space-y-8 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="glass" className="bg-gradient-to-r from-brand-500/10 to-accent-500/10 text-brand-400 border-brand-500/20 flex gap-2">
              <Users className="w-3 h-3 mr-1" />
              Access Management
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            User Management
          </h1>
          <p className="text-slate-400 font-medium text-sm md:text-base">
            Oversee campus accounts and manage administrative access levels
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Total Users</p>
              <p className="text-2xl font-black text-white">{stats.total}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-brand-400" />
            </div>
          </div>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Administrators</p>
              <p className="text-2xl font-black text-purple-400">{stats.admins}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Crown className="w-5 h-5 text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Students</p>
              <p className="text-2xl font-black text-emerald-400">{stats.students}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input
            placeholder="Search by name or email..."
            className="pl-11 bg-slate-900/80 border-slate-700 rounded-xl h-11 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="relative">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="appearance-none bg-slate-900/80 border border-slate-700 rounded-xl px-4 pr-10 h-11 text-sm font-semibold text-slate-300 focus:outline-none focus:border-brand-500 cursor-pointer"
          >
            <option value="all">All Roles</option>
            <option value="admin">Administrators</option>
            <option value="student">Students</option>
          </select>
          <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 p-4 bg-slate-800/30 border-b border-slate-700/50 text-[10px] font-black uppercase tracking-wider text-slate-500">
          <div className="col-span-5 md:col-span-5 px-2">User</div>
          <div className="col-span-3 md:col-span-2 px-2">Role</div>
          <div className="col-span-3 md:col-span-3 px-2 hidden sm:block">Joined</div>
          <div className="col-span-4 md:col-span-2 px-2 text-right">Actions</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-slate-700/50">
          {isLoading ? (
            <div className="space-y-2 p-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-16 bg-slate-800/30 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-slate-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-400">No users found</h3>
              <p className="text-slate-500 text-sm mt-1">
                {searchTerm ? 'Try a different search term' : 'No users match the selected filters'}
              </p>
            </div>
          ) : (
            filteredUsers.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-slate-800/30 transition-all duration-200 group"
              >
                {/* User Info */}
                <div className="col-span-5 md:col-span-5 flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-500/20 to-accent-500/20 flex items-center justify-center flex-shrink-0">
                    <UserCircle className="w-5 h-5 text-brand-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-white truncate">
                      {user.full_name || 'Unnamed User'}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Mail className="w-2.5 h-2.5 text-slate-500" />
                      <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                    </div>
                  </div>
                </div>

                {/* Role Badge */}
                <div className="col-span-3 md:col-span-2">
                  {(user.role === 'admin' || user.role === 'super_admin') ? (
                    <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 gap-1.5 py-1 px-2.5 rounded-lg flex gap-2">
                      <Shield className="w-3 h-3" />
                      <span className="text-[10px] font-bold uppercase">Admin</span>
                    </Badge>
                  ) : (
                    <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 gap-1.5 py-1 px-2.5 rounded-lg flex gap-2">
                      <GraduationCap className="w-3 h-3" />
                      <span className="text-[10px] font-bold uppercase">Student</span>
                    </Badge>
                  )}
                </div>

                {/* Join Date */}
                <div className="col-span-3 md:col-span-3 hidden sm:flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-slate-500" />
                  <span className="text-xs text-slate-400">
                    {new Date(user.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>

                {/* Actions */}
                <div className="col-span-4 md:col-span-2 flex items-center justify-end gap-2">
                  <Button
                    variant="glass"
                    size="sm"
                    onClick={() => handleRoleChange(user.id, user.role)}
                    disabled={updatingId === user.id}
                    className={`h-8 px-3 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${user.role === 'admin' || user.role === 'super_admin'
                      ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20'
                      : 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20'
                      }`}
                  >
                    {updatingId === user.id ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : user.role === 'admin' || user.role === 'super_admin' ? (
                      'Revoke Admin'
                    ) : (
                      'Make Admin'
                    )}
                  </Button>

                  <button className="p-2 rounded-lg hover:bg-slate-700 text-slate-500 hover:text-slate-300 transition-all opacity-0 group-hover:opacity-100">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Table Footer */}
        {!isLoading && filteredUsers.length > 0 && (
          <div className="border-t border-slate-700/50 p-4 bg-slate-800/20">
            <div className="flex items-center justify-between text-[10px] text-slate-500">
              <div className="flex items-center gap-2">
                <UserCheck className="w-3 h-3" />
                <span>{filteredUsers.length} users displayed</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3" />
                <span>Last sync: Just now</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}