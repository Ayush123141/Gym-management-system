import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, User, ShieldCheck, MapPin, Phone, Award } from 'lucide-react';

const Trainers = () => {
  const [trainers, setTrainers] = useState([]);
  const [locations, setLocations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', specialization: '', phone: '', location_id: '' });

  const fetchData = async () => {
    try {
      const [trainRes, locRes] = await Promise.all([
        axios.get('http://localhost:5000/api/trainers'),
        axios.get('http://localhost:5000/api/locations')
      ]);
      setTrainers(trainRes.data);
      setLocations(locRes.data);
    } catch (err) {
      console.error('Error fetching trainer data', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/trainers', formData);
      setIsModalOpen(false);
      setFormData({ name: '', specialization: '', phone: '', location_id: '' });
      fetchData();
    } catch (err) {
      alert('Error adding trainer');
    }
  };

  return (
    <div className="animate-in fade-in duration-700 bg-mesh min-h-screen">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h2 className="text-4xl font-black text-white text-gradient">Elite Instructors</h2>
          <p className="text-slate-400 font-medium">Manage your professional training staff.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-black transition-all shadow-xl shadow-blue-900/30"
        >
          <Plus size={20} />
          RECRUIT TRAINER
        </button>
      </header>

      {/* Hero Image */}
      <div className="h-64 rounded-4xl overflow-hidden mb-12 relative border border-white/5">
        <img src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover" alt="Trainers" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 flex flex-col justify-end p-10">
           <h3 className="text-3xl font-black text-white">The Force Behind the Gym</h3>
           <p className="text-slate-400">Manage specialized coaching staff across all branches.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {trainers.map((trainer) => (
          <div key={trainer.id} className="glass rounded-4xl p-6 border border-white/5 group hover:border-blue-500/40 transition-all flex flex-col items-center text-center">
            <div className="h-24 w-24 rounded-3xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center mb-6 overflow-hidden relative group-hover:scale-105 transition-transform">
               <ShieldCheck size={48} className="text-blue-400 absolute opacity-10" />
               <span className="text-3xl font-black text-blue-400 relative z-10">{trainer.name[0]}</span>
            </div>
            
            <h4 className="text-xl font-bold text-white mb-1">{trainer.name}</h4>
            <p className="text-blue-400 text-xs font-black uppercase tracking-widest mb-6">{trainer.specialization}</p>
            
            <div className="w-full space-y-3 pt-6 border-t border-white/5 text-left">
               <div className="flex items-center gap-2 text-slate-400 text-sm">
                 <Phone size={14} className="text-slate-600" />
                 {trainer.phone}
               </div>
               <div className="flex items-center gap-2 text-slate-400 text-sm">
                 <MapPin size={14} className="text-slate-600" />
                 {trainer.location_name || 'All Branches'}
               </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-2xl" onClick={() => setIsModalOpen(false)} />
          <div className="relative glass border border-white/10 w-full max-w-lg rounded-4xl p-10 shadow-3xl">
            <h3 className="text-3xl font-black text-white mb-8">Add Trainer</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <input type="text" placeholder="Trainer Name" className="w-full glass-light py-4 px-6 rounded-2xl text-white outline-none ring-1 ring-white/10 focus:ring-blue-500" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required/>
              <input type="text" placeholder="Specialization (e.g. Yoga, HIIT)" className="w-full glass-light py-4 px-6 rounded-2xl text-white outline-none ring-1 ring-white/10 focus:ring-blue-500" value={formData.specialization} onChange={(e) => setFormData({...formData, specialization: e.target.value})} required/>
              <input type="text" placeholder="Phone Number" className="w-full glass-light py-4 px-6 rounded-2xl text-white outline-none ring-1 ring-white/10 focus:ring-blue-500" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required/>
              <select className="w-full glass-light py-4 px-6 rounded-2xl text-white outline-none ring-1 ring-white/10 focus:ring-blue-500" value={formData.location_id} onChange={(e) => setFormData({...formData, location_id: e.target.value})} required>
                <option value="">Select Primary Branch</option>
                {locations.map(loc => <option key={loc.id} value={loc.id}>{loc.name}</option>)}
              </select>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-900/40">HIRE INSTRUCTOR</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Trainers;
