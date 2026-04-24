import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Check, Trash2, X, DollarSign, Clock } from 'lucide-react';

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ plan_name: '', duration_months: '', price: '', description: '' });

  const fetchPlans = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/plans');
      setPlans(res.data);
    } catch (err) {
      console.error('Error fetching plans', err);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/plans', formData);
      setIsModalOpen(false);
      setFormData({ plan_name: '', duration_months: '', price: '', description: '' });
      fetchPlans();
    } catch (err) {
      alert('Error creating plan');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete plan?')) {
      await axios.delete(`http://localhost:5000/api/plans/${id}`);
      fetchPlans();
    }
  };

  return (
    <div className="animate-in fade-in duration-700 bg-mesh min-h-screen">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h2 className="text-4xl font-black text-white text-gradient">Membership Models</h2>
          <p className="text-slate-400 font-medium">Design and manage your gym packages.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-black transition-all shadow-xl shadow-blue-900/30"
        >
          <Plus size={20} />
          CREATE PLAN
        </button>
      </header>

      {/* Hero Header */}
      <div className="h-64 rounded-4xl overflow-hidden mb-12 relative border border-white/5">
        <img src="https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=1469&auto=format&fit=crop" className="w-full h-full object-cover" alt="Plans" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950 via-blue-950/40 to-transparent flex items-center p-12">
           <div className="max-w-md">
             <h3 className="text-3xl font-black text-white mb-2">Tiered Access</h3>
             <p className="text-slate-300">Set up flexible durations and competitive pricing to scale your membership base.</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div key={plan.id} className="glass rounded-4xl p-8 border border-white/5 relative group hover:border-blue-500/30 transition-all">
            <div className="flex justify-between items-start mb-6">
              <div className="h-14 w-14 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                <Check className="text-blue-400" size={28} />
              </div>
              <button onClick={() => handleDelete(plan.id)} className="p-2 hover:bg-red-500/10 text-red-400 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                <Trash2 size={20} />
              </button>
            </div>
            
            <h4 className="text-2xl font-bold text-white mb-2">{plan.plan_name}</h4>
            <p className="text-slate-400 text-sm mb-6 line-clamp-2">{plan.description || 'Access to all gym facilities and basic features.'}</p>
            
            <div className="flex items-end gap-3 pt-6 border-t border-white/5">
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Price</p>
                <div className="flex items-center gap-1">
                   <DollarSign size={20} className="text-emerald-400" />
                   <span className="text-3xl font-black text-white">{plan.price}</span>
                </div>
              </div>
              <div className="ml-auto text-right">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Duration</p>
                <div className="flex items-center gap-1 justify-end">
                   <Clock size={16} className="text-blue-400" />
                   <span className="text-lg font-bold text-white">{plan.duration_months}m</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-2xl" onClick={() => setIsModalOpen(false)} />
          <div className="relative glass border border-white/10 w-full max-w-lg rounded-4xl p-10 shadow-3xl">
            <h3 className="text-3xl font-black text-white mb-8">New Plan</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <input type="text" placeholder="Plan Name" className="w-full glass-light py-4 px-6 rounded-2xl text-white outline-none ring-1 ring-white/10 focus:ring-blue-500" value={formData.plan_name} onChange={(e) => setFormData({...formData, plan_name: e.target.value})} required/>
              <div className="grid grid-cols-2 gap-4">
                <input type="number" placeholder="Months" className="glass-light py-4 px-6 rounded-2xl text-white outline-none ring-1 ring-white/10 focus:ring-blue-500" value={formData.duration_months} onChange={(e) => setFormData({...formData, duration_months: e.target.value})} required/>
                <input type="number" placeholder="Price ($)" className="glass-light py-4 px-6 rounded-2xl text-white outline-none ring-1 ring-white/10 focus:ring-blue-500" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required/>
              </div>
              <textarea placeholder="Description" className="w-full glass-light py-4 px-6 rounded-2xl text-white outline-none ring-1 ring-white/10 focus:ring-blue-500 min-h-[100px]" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-900/40">SAVE PLAN</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Plans;
