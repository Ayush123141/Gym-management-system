import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, MapPin, Phone, Building, Navigation } from 'lucide-react';

const Locations = () => {
  const [locations, setLocations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', address: '', contact_number: '' });

  const fetchLocations = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/locations');
      setLocations(res.data);
    } catch (err) {
      console.error('Error fetching locations', err);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/locations', formData);
      setIsModalOpen(false);
      setFormData({ name: '', address: '', contact_number: '' });
      fetchLocations();
    } catch (err) {
      alert('Error creating location');
    }
  };

  return (
    <div className="animate-in fade-in duration-700 bg-mesh min-h-screen">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h2 className="text-4xl font-black text-white text-gradient">Gym Network</h2>
          <p className="text-slate-400 font-medium">Manage your branches across different regions.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-black transition-all shadow-xl shadow-blue-900/30"
        >
          <Plus size={20} />
          EXPAND NETWORK
        </button>
      </header>

      {/* Hero Header */}
      <div className="h-64 rounded-4xl overflow-hidden mb-12 relative border border-white/5">
        <img src="gym_location_card_1777016602957.png" className="w-full h-full object-cover" alt="Locations" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/20 to-transparent flex items-center p-12">
           <div className="max-w-md">
             <h3 className="text-3xl font-black text-white mb-2">Global Footprint</h3>
             <p className="text-slate-300">Seamlessly scale your fitness brand across multiple locations with centralized member tracking.</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {locations.map((loc) => (
          <div key={loc.id} className="glass rounded-4xl p-8 border border-white/5 flex flex-col md:flex-row gap-8 items-center group hover:border-blue-500/30 transition-all">
            <div className="h-32 w-32 md:h-40 md:w-40 rounded-3xl bg-slate-800 border border-white/5 flex items-center justify-center shrink-0">
               <Building size={48} className="text-slate-600 group-hover:text-blue-400 transition-colors" />
            </div>
            <div className="flex-1">
               <div className="inline-block px-3 py-1 rounded-lg bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Central Hub</div>
               <h4 className="text-3xl font-black text-white mb-2">{loc.name}</h4>
               
               <div className="space-y-4 pt-6 border-t border-white/5">
                  <div className="flex items-start gap-3 text-slate-400">
                    <MapPin size={20} className="text-blue-400 shrink-0 mt-1" />
                    <span className="text-sm font-medium">{loc.address}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400 font-bold">
                    <Phone size={20} className="text-blue-400" />
                    <span className="text-sm">{loc.contact_number || 'N/A'}</span>
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
            <h3 className="text-3xl font-black text-white mb-8">Add Branch</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <input type="text" placeholder="Branch Name" className="w-full glass-light py-4 px-6 rounded-2xl text-white outline-none ring-1 ring-white/10 focus:ring-blue-500" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required/>
              <input type="text" placeholder="Address" className="w-full glass-light py-4 px-6 rounded-2xl text-white outline-none ring-1 ring-white/10 focus:ring-blue-500" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} required/>
              <input type="text" placeholder="Contact Phone" className="w-full glass-light py-4 px-6 rounded-2xl text-white outline-none ring-1 ring-white/10 focus:ring-blue-500" value={formData.contact_number} onChange={(e) => setFormData({...formData, contact_number: e.target.value})} />
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-900/40">LAUNCH LOCATION</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Locations;
