import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { Users, CreditCard, Activity, TrendingUp, Clock, ChevronRight } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeMemberships: 0,
    totalRevenue: 0,
    monthlyRevenue: [],
    recentMembers: [],
    expiringSoon: []
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/dashboard/stats');
        setStats(res.data);
      } catch (err) {
        console.error('Error fetching dashboard stats', err);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: 'Total Members', value: stats.totalMembers, icon: Users, color: 'blue', gradient: 'from-blue-600/20 to-blue-400/5' },
    { label: 'Active Plans', value: stats.activeMemberships, icon: Activity, color: 'emerald', gradient: 'from-emerald-600/20 to-emerald-400/5' },
    { label: 'Revenue (Overall)', value: `$${stats.totalRevenue}`, icon: CreditCard, color: 'purple', gradient: 'from-purple-600/20 to-purple-400/5' },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 bg-mesh min-h-screen">
      {/* Hero Section */}
      <div className="relative h-64 rounded-4xl overflow-hidden mb-10 shadow-2xl border border-white/5">
        <img 
          src="gym_dashboard_hero_1777016279187.png" 
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-1000" 
          alt="Gym Hero" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-8">
          <h2 className="text-4xl font-extrabold text-white mb-2 text-gradient">GymForce Analytics</h2>
          <p className="text-slate-300 font-medium max-w-lg">Track your peak performance and business growth with our real-time management engine.</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className={`glass p-8 rounded-4xl hover:border-slate-600 transition-all cursor-pointer group relative overflow-hidden`}>
              <div className={`absolute -right-4 -top-4 w-32 h-32 bg-gradient-to-br ${stat.gradient} blur-3xl opacity-50`} />
              <div className={`h-14 w-14 rounded-2xl bg-${stat.color}-500/10 flex items-center justify-center mb-6 border border-${stat.color}-500/20`}>
                <Icon className={`text-${stat.color}-400 group-hover:scale-110 transition-transform`} size={28} />
              </div>
              <p className="text-slate-400 text-sm font-semibold tracking-wide uppercase mb-2">{stat.label}</p>
              <h3 className="text-4xl font-black text-white">{stat.value}</h3>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 glass rounded-4xl p-8 border border-white/5">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
              <TrendingUp className="text-blue-400" size={28} />
              Revenue Growth
            </h3>
            <div className="flex bg-slate-800/50 p-1 rounded-xl">
              <button className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg shadow-lg">MONTHLY</button>
              <button className="px-4 py-1.5 text-slate-400 text-xs font-bold rounded-lg">YEARLY</button>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.monthlyRevenue}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', backdropFilter: 'blur(10px)' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="total" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRev)" strokeWidth={4} dot={{ r: 4, fill: '#3b82f6' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Alerts */}
        <div className="flex flex-col gap-6">
          <div className="glass rounded-4xl p-8 border border-white/5 flex-1 ring-1 ring-red-500/20">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Activity className="text-red-400" size={24} />
              Priority Alerts
            </h3>
            <div className="space-y-4">
              {stats.expiringSoon && stats.expiringSoon.length > 0 ? stats.expiringSoon.map((alert, i) => (
                <div key={i} className="glass-light p-4 rounded-2xl border border-red-500/10 hover:border-red-500/30 transition-all group">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-white">{alert.full_name}</h4>
                    <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-lg font-black uppercase">Expiring</span>
                  </div>
                  <p className="text-slate-400 text-xs flex items-center gap-1">
                    <Clock size={12} /> Ends {new Date(alert.end_date).toLocaleDateString()}
                  </p>
                </div>
              )) : (
                <div className="text-center py-10 opacity-50">
                  <p className="text-slate-400 text-sm">All clear! No urgent alerts.</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Recent Members Mini list */}
          <div className="glass rounded-4xl p-8 border border-white/5 h-64">
             <h3 className="text-xl font-bold text-white mb-6">Recent Joins</h3>
             <div className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
               {stats.recentMembers.map((m, i) => (
                 <div key={i} className="flex items-center justify-between group">
                   <div className="flex items-center gap-3">
                     <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-blue-400 text-sm border border-white/5 group-hover:border-blue-400/50 transition-all">
                       {m.full_name[0]}
                     </div>
                     <p className="font-semibold text-sm text-slate-200">{m.full_name}</p>
                   </div>
                   <ChevronRight size={14} className="text-slate-600 group-hover:text-blue-400 transition-colors" />
                 </div>
               ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
