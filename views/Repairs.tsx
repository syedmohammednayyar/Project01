
import React, { useState } from 'react';
import { ServiceTicket } from '../types';

interface ServiceTicketWithImage extends ServiceTicket {
  deviceImage?: string;
}

const Repairs: React.FC = () => {
  const [selectedDeviceImage, setSelectedDeviceImage] = useState<string | null>(null);

  const activeQueue: ServiceTicketWithImage[] = [
    { id: '#REP-001', customer: 'John Doe', device: 'iPhone 13 Pro', problem: 'Screen Replacement', tech: 'Alex M.', charges: 120, status: 'Pending', avatar: 'https://picsum.photos/seed/tech1/48/48', deviceImage: 'https://images.unsplash.com/photo-1633113089631-6456cccaadad?auto=format&fit=crop&q=80&w=100' },
    { id: '#REP-002', customer: 'Sarah Smith', device: 'Galaxy S22', problem: 'Battery Issue', tech: 'Sam W.', charges: 80, status: 'Completed', avatar: 'https://picsum.photos/seed/tech2/48/48', deviceImage: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=100' },
    { id: '#REP-003', customer: 'Emily Chen', device: 'MacBook Air M1', problem: 'Keyboard Repair', tech: 'David R.', charges: 150, status: 'In Progress', avatar: 'https://picsum.photos/seed/tech3/48/48', deviceImage: 'https://images.unsplash.com/photo-1611186871348-b1ec696e52c9?auto=format&fit=crop&q=80&w=100' },
    { id: '#REP-004', customer: 'Michael Jordan', device: 'iPad Pro 11', problem: 'Charging Port', tech: 'Alex M.', charges: 95, status: 'Pending', avatar: 'https://picsum.photos/seed/tech1/48/48', deviceImage: 'https://images.unsplash.com/photo-1544244015-0cd4b3ff8f90?auto=format&fit=crop&q=80&w=100' },
  ];

  const handleDeviceImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedDeviceImage(event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-surface rounded-2xl p-6 shadow-sm border border-secondary/20">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-icons">add_task</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-dark">New Service Entry</h2>
              <p className="text-sm text-text-secondary mt-0.5">Create a new repair ticket</p>
            </div>
          </div>

          <form className="space-y-4">
            <div className="flex flex-col items-center justify-center gap-3 mb-4">
               <div className="w-full h-32 rounded-xl bg-background border-2 border-dashed border-secondary/20 overflow-hidden relative flex items-center justify-center group">
                {selectedDeviceImage ? (
                  <img src={selectedDeviceImage} alt="Device" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center">
                    <span className="material-icons text-secondary/40 text-3xl">camera_alt</span>
                    <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mt-1">Add Device Photo</p>
                  </div>
                )}
                <input type="file" accept="image/*" onChange={handleDeviceImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest mb-1.5">Customer Name</label>
              <div className="relative">
                <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-secondary/40 text-lg">person</span>
                <input type="text" placeholder="e.g. John Doe" className="w-full pl-10 pr-4 py-2.5 bg-background border-none rounded-xl text-sm focus:ring-2 focus:ring-primary text-text-dark" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest mb-1.5">Phone</label>
                <input type="tel" placeholder="(555) 000-0000" className="w-full px-4 py-2.5 bg-background border-none rounded-xl text-sm focus:ring-2 focus:ring-primary text-text-dark" />
              </div>
              <div>
                <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest mb-1.5">Email</label>
                <input type="email" placeholder="john@email.com" className="w-full px-4 py-2.5 bg-background border-none rounded-xl text-sm focus:ring-2 focus:ring-primary text-text-dark" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest mb-1.5">Device Model</label>
              <div className="relative">
                <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-secondary/40 text-lg">smartphone</span>
                <input type="text" placeholder="e.g. iPhone 14 Pro Max" className="w-full pl-10 pr-4 py-2.5 bg-background border-none rounded-xl text-sm focus:ring-2 focus:ring-primary text-text-dark" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest mb-1.5">Problem Diagnosis</label>
              <textarea placeholder="Describe the issue..." className="w-full px-4 py-2.5 bg-background border-none rounded-xl text-sm focus:ring-2 focus:ring-primary h-24 resize-none text-text-dark"></textarea>
            </div>
            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest mb-1.5">Estimated Charges</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary font-bold">₹</span>
                <input type="number" placeholder="0.00" className="w-full pl-7 pr-4 py-2.5 bg-background border-none rounded-xl text-sm font-bold text-text-dark focus:ring-2 focus:ring-primary" />
              </div>
            </div>
            <button className="w-full py-3 bg-primary text-white rounded-xl font-bold shadow-lg hover:bg-primary/90 active:bg-primary/80 transition-all active:scale-95 flex items-center justify-center gap-2">
              <span className="material-icons text-base">save</span>
              Create Ticket
            </button>
          </form>
        </div>
      </div>

      <div className="lg:col-span-8 bg-surface rounded-2xl shadow-sm border border-secondary/20 overflow-hidden flex flex-col h-fit">
        <div className="p-6 border-b border-secondary/20 flex items-center justify-between">
          <h2 className="text-xl font-bold text-text-dark">Active Service Queue</h2>
          <div className="flex gap-2">
            <select className="text-xs bg-background border-none rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-primary text-text-secondary">
              <option>All Statuses</option>
              <option>Pending</option>
              <option>In Progress</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-background text-[10px] font-bold text-text-secondary uppercase tracking-widest border-b border-secondary/20">
              <tr>
                <th className="px-6 py-4">Customer & Device</th>
                <th className="px-6 py-4">Problem</th>
                <th className="px-6 py-4">Technician</th>
                <th className="px-6 py-4 text-right">Charges</th>
                <th className="px-6 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary/20">
              {activeQueue.map((ticket, i) => (
                <tr key={i} className="hover:bg-background transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={ticket.deviceImage} alt={ticket.device} className="w-10 h-10 rounded-lg object-cover bg-background" />
                      <div>
                        <p className="text-sm font-bold text-text-dark">{ticket.customer}</p>
                        <p className="text-[10px] text-text-secondary uppercase tracking-wider font-bold">{ticket.device}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-text-dark">{ticket.problem}</p>
                    <p className="text-[10px] text-text-secondary">Diagnosis recorded</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <img src={ticket.avatar} alt={ticket.tech} className="w-6 h-6 rounded-full" />
                      <span className="text-xs text-text-secondary font-medium">{ticket.tech}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-text-dark">₹{ticket.charges.toFixed(2)}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      ticket.status === 'Pending' ? 'bg-warning/10 text-warning border-warning/20' :
                      ticket.status === 'In Progress' ? 'bg-primary/10 text-primary border-primary/20' :
                      'bg-success/10 text-success border-success/20'
                    }`}>
                      {ticket.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-secondary/20 flex items-center justify-between text-[11px] text-text-secondary font-medium bg-background">
          <p>Showing 1 to 4 of 12 entries</p>
          <div className="flex gap-1">
            <button className="px-2 py-1 rounded bg-surface border border-secondary/20 hover:bg-secondary/10">Prev</button>
            <button className="px-2 py-1 rounded bg-primary text-white">1</button>
            <button className="px-2 py-1 rounded bg-surface border border-secondary/20 hover:bg-secondary/10">2</button>
            <button className="px-2 py-1 rounded bg-surface border border-secondary/20 hover:bg-secondary/10">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Repairs;