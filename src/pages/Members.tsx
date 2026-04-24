import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import { 
  Plus, Search, Edit2, Trash2, X, CheckCircle, Clock, 
  Phone, Mail, MapPin, UserPlus, Upload, FileDown 
} from 'lucide-react';

const Members = () => {
  const [members, setMembers] = useState([]);
  const [locations, setLocations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  
  const [formData, setFormData] = useState({
    full_name: '', email: '', phone: '', address: '', gender: 'male', location_id: ''
  });

  const fetchData = async () => {
    try {
      const [memRes, locRes] = await Promise.all([
        axios.get('http://localhost:5000/api/members'),
        axios.get('http://localhost:5000/api/locations')
      ]);
      setMembers(memRes.data);
      setLocations(locRes.data);
    } catch (err) {
      console.error('Error fetching members', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // CSV Import Logic
  const handleCSVImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: async (results) => {
          const newMembers = results.data;
          try {
            for (const member of newMembers) {
              if (member.full_name && member.phone) {
                await axios.post('http://localhost:5000/api/members', {
                  full_name: member.full_name,
                  email: member.email || '',
                  phone: member.phone,
                  address: member.address || '',
                  gender: member.gender || 'male',
                  location_id: locations[0]?.id || ''
                });
              }
            }
            alert('CSV members imported successfully!');
            fetchData();
          } catch (err) {
            alert('Some members failed to import. Please check CSV format.');
          }
        }
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMember) {
        await axios.put(`http://localhost:5000/api/members/${editingMember.id}`, { ...formData, version: editingMember.version });
      } else {
        await axios.post('http://localhost:5000/api/members', formData);
      }
      setIsModalOpen(false);
      setEditingMember(null);
      setFormData({ full_name: '', email: '', phone: '', address: '', gender: 'male', location_id: '' });
      fetchData();
    } catch (err) {
      alert(err.response?.status === 409 ? err.response.data.message : 'Error saving member');
    }
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setFormData({ full_name: member.full_name, email: member.email, phone: member.phone, address: member.address, gender: member.gender, location_id: member.location_id });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete member?')) {
      await axios.delete(`http://localhost:5000/api/members/${id}`);
      fetchData();
    }
  };

  return (
    <div className="animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h2 className="text-4xl font-black text-white text-gradient">Members Repository</h2>
          <p className="text-slate-400 font-medium">Search, filter, and import your member database.</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-5 py-3 rounded-2xl font-bold cursor-pointer transition-all border border-white/5">
            <Upload size={18} />
            Import CSV
            <input type="file" accept=".csv" className="hidden" onChange={handleCSVImport} />
          </label>
          <button 
            onClick={() => { setEditingMember(null); setIsModalOpen(true); }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-xl shadow-blue-900/30"
          >
            <UserPlus size={18} />
            Register
          </button>
        </div>
      </header>

      {/* Hero Image Section */}
      <div className="h-48 rounded-4xl overflow-hidden mb-10 relative border border-white/5">
        <img 
          src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1470&auto=format&fit=crop" 
          className="w-full h-full object-cover grayscale px-2" 
          alt="Member CRM" 
        />
        <div className="absolute inset-0 bg-blue-600/20 mix-blend-multiply" />
        <div className="absolute inset-0 flex flex-col justify-center p-8 bg-gradient-to-r from-slate-950 via-slate-950/60 to-transparent">
          <p className="text-blue-400 font-black uppercase tracking-widest text-xs mb-2">Member CRM</p>
          <h3 className="text-3xl font-bold text-white">Database Management</h3>
        </div>
      </div>

      <div className="glass p-4 rounded-3xl mb-8 flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
          <input 
            type="text" 
            placeholder="Search by name or phone..."
            className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-3 pl-12 pr-4 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="glass rounded-4xl overflow-hidden border border-white/5 shadow-2xl">
        <table className="w-full text-left order-collapse">
          <thead>
            <tr className="glass-light text-slate-400 text-xs uppercase tracking-wider">
              <th className="px-6 py-5 font-bold">Profile</th>
              <th className="px-6 py-5 font-bold">Contact</th>
              <th className="px-6 py-5 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {members.filter(m => m.full_name.toLowerCase().includes(searchTerm.toLowerCase())).map((member) => (
              <tr key={member.id} className="hover:bg-white/5 transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center font-black text-blue-400 border border-blue-500/20 group-hover:scale-105 transition-transform">
                      {member.full_name[0]}
                    </div>
                    <div>
                      <p className="font-bold text-white text-lg">{member.full_name}</p>
                      <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-lg font-black text-slate-400 uppercase tracking-widest">{member.location_name || 'No Branch'}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-slate-300 font-medium">{member.phone}</span>
                    <span className="text-xs text-slate-500">{member.email}</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => handleEdit(member)} className="p-2.5 hover:bg-blue-500/20 text-blue-400 rounded-xl"><Edit2 size={18} /></button>
                    <button onClick={() => handleDelete(member.id)} className="p-2.5 hover:bg-red-500/20 text-red-400 rounded-xl"><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" onClick={() => setIsModalOpen(false)} />
          <div className="relative glass border border-white/10 w-full max-w-xl rounded-4xl p-10 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-3xl font-black text-white mb-8">{editingMember ? 'Update Profile' : 'New Registration'}</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Full Name" className="col-span-2 glass-light py-4 px-5 rounded-2xl ring-1 ring-white/10 focus:ring-blue-500 outline-none" value={formData.full_name} onChange={(e) => setFormData({...formData, full_name: e.target.value})} required/>
                <input type="email" placeholder="Email Address" className="glass-light py-4 px-5 rounded-2xl ring-1 ring-white/10 focus:ring-blue-500 outline-none" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}/>
                <input type="text" placeholder="Phone" className="glass-light py-4 px-5 rounded-2xl ring-1 ring-white/10 focus:ring-blue-500 outline-none" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required/>
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-900/40">SAVE MEMBER</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Members;
