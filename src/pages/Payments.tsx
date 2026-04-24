import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  DollarSign, CreditCard, Banknote, Globe, CheckCircle2, 
  Search, ArrowUpRight, ArrowDownRight, MoreHorizontal 
} from 'lucide-react';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [members, setMembers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    member_id: '', plan_id: '', amount: '', payment_method: 'cash'
  });

  const fetchData = async () => {
    try {
      const [payRes, memRes, planRes] = await Promise.all([
        axios.get('http://localhost:5000/api/payments'),
        axios.get('http://localhost:5000/api/members'),
        axios.get('http://localhost:5000/api/plans')
      ]);
      setPayments(payRes.data);
      setMembers(memRes.data);
      setPlans(planRes.data);
    } catch (err) {
      console.error('Error fetching payment data', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePlanChange = (planId) => {
    const selectedPlan = plans.find(p => p.id == planId);
    if (selectedPlan) {
      setFormData({ ...formData, plan_id: planId, amount: selectedPlan.price });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/payments', formData);
      setIsModalOpen(false);
      setFormData({ member_id: '', plan_id: '', amount: '', payment_method: 'cash' });
      fetchData();
    } catch (err) {
      alert('Error processing payment');
    }
  };

  return (
    <div className="animate-in fade-in duration-700 bg-mesh min-h-screen">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h2 className="text-4xl font-black text-white text-gradient tracking-tight">Financial Engine</h2>
          <p className="text-slate-400 font-medium">Monitor your gym cash flow and active subscriptions.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black transition-all shadow-xl shadow-emerald-900/30 active:scale-95"
        >
          <DollarSign size={20} />
          RECORD PAYMENT
        </button>
      </header>

      {/* Top Banner with Image */}
      <div className="h-44 rounded-4xl overflow-hidden mb-12 relative border border-white/5">
        <img 
          src="gym_training_session_1777016313736.png" 
          className="w-full h-full object-cover" 
          alt="Financials" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-emerald-950/40 to-transparent flex items-center p-10">
           <div className="glass p-4 rounded-2xl border border-emerald-500/20 backdrop-blur-xl">
             <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Revenue</p>
             <h3 className="text-3xl font-black text-white">${payments.reduce((acc, p) => acc + parseFloat(p.amount), 0).toFixed(2)}</h3>
           </div>
        </div>
      </div>

      {/* Payment History Table */}
      <div className="glass rounded-4xl overflow-hidden shadow-2xl border border-white/5">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="glass-light text-slate-400 text-[10px] uppercase tracking-[0.2em]">
              <th className="px-8 py-6 font-black">Transaction</th>
              <th className="px-8 py-6 font-black">Member</th>
              <th className="px-8 py-6 font-black">Amount</th>
              <th className="px-8 py-6 font-black">Method</th>
              <th className="px-8 py-6 font-black text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {payments.map((payment) => (
              <tr key={payment.id} className="hover:bg-white/5 transition-all group">
                <td className="px-8 py-6">
                  <div>
                    <p className="text-white font-bold text-sm">#{payment.id.toString().padStart(5, '0')}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{payment.plan_name}</p>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-slate-800 flex items-center justify-center font-black text-xs text-blue-400 border border-white/10">
                      {payment.member_name[0]}
                    </div>
                    <span className="font-bold text-slate-200">{payment.member_name}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-1.5">
                    <div className="h-6 w-6 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                       <ArrowUpRight size={14} className="text-emerald-400" />
                    </div>
                    <span className="text-white font-black text-lg">${payment.amount}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-xl w-fit border border-white/5 group-hover:border-white/10 transition-colors">
                    {payment.payment_method === 'cash' && <Banknote size={14} className="text-slate-400" />}
                    {payment.payment_method === 'card' && <CreditCard size={14} className="text-slate-400" />}
                    {payment.payment_method === 'online' && <Globe size={14} className="text-slate-400" />}
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{payment.payment_method}</span>
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black bg-emerald-500/10 text-emerald-400 uppercase">
                    <CheckCircle2 size={12} />
                    Success
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-2xl" onClick={() => setIsModalOpen(false)} />
          <div className="relative glass border border-white/10 w-full max-w-lg rounded-4xl p-10 shadow-3xl">
            <h3 className="text-3xl font-black text-white mb-8 tracking-tight">Record Transaction</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <select className="w-full glass-light py-4 px-6 rounded-2xl text-white outline-none ring-1 ring-white/10 focus:ring-blue-500" value={formData.member_id} onChange={(e) => setFormData({...formData, member_id: e.target.value})} required>
                <option value="">Select Member</option>
                {members.map(m => <option key={m.id} value={m.id}>{m.full_name}</option>)}
              </select>
              <div className="grid grid-cols-2 gap-4">
                <select className="glass-light py-4 px-6 rounded-2xl text-white outline-none ring-1 ring-white/10 focus:ring-blue-500" value={formData.plan_id} onChange={(e) => handlePlanChange(e.target.value)} required>
                  <option value="">Plan</option>
                  {plans.map(p => <option key={p.id} value={p.id}>{p.plan_name}</option>)}
                </select>
                <input type="number" placeholder="Amount" className="glass-light py-4 px-6 rounded-2xl text-white outline-none ring-1 ring-white/10 focus:ring-blue-500" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} required/>
              </div>
              <div className="flex gap-2">
                {['cash', 'card', 'online'].map(m => (
                  <button key={m} type="button" onClick={() => setFormData({...formData, payment_method: m})} className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border transition-all ${formData.payment_method === m ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/30' : 'glass-light border-white/10 text-slate-500'}`}>{m}</button>
                ))}
              </div>
              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-5 rounded-2xl shadow-xl shadow-emerald-900/40 mt-4">CONFIRM TRANSACTION</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;
