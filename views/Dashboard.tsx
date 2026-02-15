
import React, { useState, useEffect, useMemo } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import KpiCard from '../components/KpiCard';
import { KpiData, User } from '../types';

// --- Base Mock Data ---
const recentSalesData = [
    { id: '#JOB2024001', customer: 'Rajesh Kumar', amount: 35000, store: 'Main Branch', salesman: 'Ahmed Hassan', time: '2:15 PM', status: 'Completed' },
    { id: '#JOB2024002', customer: 'Priya Sharma', amount: 8500, store: 'Branch 2', salesman: 'Neha Singh', time: '2:45 PM', status: 'Completed' },
    { id: '#JOB2024003', customer: 'Arjun Patel', amount: 42000, store: 'Main Branch', salesman: 'Vikram Reddy', time: '3:20 PM', status: 'Completed' },
    { id: '#JOB2024004', customer: 'Meera Chopra', amount: 12000, store: 'Branch 3', salesman: 'Suresh Kumar', time: '3:50 PM', status: 'Pending' },
    { id: '#JOB2024005', customer: 'Suresh Iyer', amount: 11500, store: 'Branch 2', salesman: 'Neha Singh', time: '4:10 PM', status: 'Completed' },
];
  
const inventoryAlertsData = [
    { product: 'iPhone 15 Pro (Black)', stock: 2, min: 5, store: 'Main Branch', status: 'Critical' },
    { product: 'Samsung Galaxy A14 (Blue)', stock: 4, min: 8, store: 'Branch 2', status: 'Low' },
    { product: 'Tempered Glass (Universal)', stock: 15, min: 20, store: 'Main Branch', status: 'Monitor' },
    { product: 'USB-C Cable', stock: 3, min: 5, store: 'Branch 3', status: 'Low' },
];

const storeMap: { [key: string]: string } = {
  main: 'Main Branch',
  b2: 'Branch 2',
  b3: 'Branch 3',
};

const Dashboard: React.FC<{ user: User }> = ({ user }) => {
  const [storeFilter, setStoreFilter] = useState('all');
  const [dateRange, setDateRange] = useState('week');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [refreshKey, setRefreshKey] = useState(0);

  const textColor = '#626C7C'; // text-secondary
  const gridColor = '#5E5240'; // secondary

  // --- Auto-refresh logic ---
  useEffect(() => {
    const intervalId = setInterval(() => {
      setRefreshKey(prev => prev + 1); // Trigger re-render and recalculation
      setLastUpdated(new Date());
    }, 30000); 
    return () => clearInterval(intervalId);
  }, []);

  // --- Filtered Data ---
  const filteredSales = useMemo(() => {
    if (storeFilter === 'all') return recentSalesData;
    return recentSalesData.filter(sale => sale.store === storeMap[storeFilter]);
  }, [storeFilter]);
  
  const filteredInventoryAlerts = useMemo(() => {
    if (storeFilter === 'all') return inventoryAlertsData;
    return inventoryAlertsData.filter(item => item.store === storeMap[storeFilter]);
  }, [storeFilter]);

  // --- Dynamically Calculated KPIs ---
  const dynamicKpis: KpiData[] = useMemo(() => {
    // This useMemo depends on refreshKey to simulate real-time data changes
    const totalSales = filteredSales.reduce((sum, sale) => sum + sale.amount, 0);
    const simulatedFluctuation = Math.floor(totalSales * (0.98 + Math.random() * 0.04));
    
    return [
      { label: "Today's Sales", value: `₹${simulatedFluctuation.toLocaleString()}`, trend: '+12%', trendLabel: 'vs yesterday', icon: 'payments', color: '#208091', bgLight: 'rgba(32, 128, 145, 0.1)' },
      { label: 'New Orders', value: filteredSales.length.toString(), trend: '+5', trendLabel: 'orders today', icon: 'shopping_cart', color: '#20C08D', bgLight: 'rgba(32, 192, 141, 0.1)' },
      { label: 'Pending Services', value: '8', trend: '3', trendLabel: 'urgent tickets', icon: 'build', color: '#FF9900', bgLight: 'rgba(255, 153, 0, 0.1)' },
      { label: 'Low Stock Items', value: filteredInventoryAlerts.filter(item => item.status !== 'Monitor').length.toString(), trend: '-1', trendLabel: 'from yesterday', icon: 'warning', color: '#E6545E', bgLight: 'rgba(230, 84, 94, 0.1)' },
    ];
  }, [storeFilter, filteredSales, filteredInventoryAlerts, refreshKey]);


  // --- Static Chart Data (Global Overview) ---
  const salesTrendData = [
    { name: 'Mon', sales: 2400 }, { name: 'Tue', sales: 1398 }, { name: 'Wed', sales: 9800 },
    { name: 'Thu', sales: 3908 }, { name: 'Fri', sales: 4800 }, { name: 'Sat', sales: 3800 }, { name: 'Sun', sales: 4300 },
  ];
  const storeComparisonData = [
    { name: 'Main Branch', sales: 4000 }, { name: 'Branch 2', sales: 3000 }, { name: 'Branch 3', sales: 2000 },
  ];
  const topProductsData = [
    { name: 'iPhone 15 Pro', sold: 120 }, { name: 'S24 Ultra Case', sold: 98 }, { name: 'Fast Charger', sold: 86 },
    { name: 'AirPods Pro 2', sold: 75 }, { name: 'Screen Guard', sold: 60 },
  ];
  const revenueBreakdownData = [
    { name: 'New Sales', value: 60 }, { name: 'Repair Services', value: 15 },
    { name: 'Buyback', value: 15 }, { name: 'Accessories', value: 10 },
  ];
  const COLORS = ['#208091', '#20C08D', '#FF9900', '#E6815F'];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Critical': return 'text-error bg-error/10 border border-error/20';
      case 'Low': return 'text-warning bg-warning/10 border border-warning/20';
      default: return 'text-text-secondary bg-secondary/10';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-text-dark uppercase tracking-tight">{user.role} Dashboard</h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm text-text-secondary font-medium">Global operations overview for Quality Mobiles.</p>
            <div className="flex items-center gap-1 text-xs text-text-secondary/80">
              <span className="material-icons text-sm animate-pulse">sync</span>
              <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <select value={storeFilter} onChange={e => setStoreFilter(e.target.value)} className="bg-surface border border-secondary/20 text-xs font-bold rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary">
            <option value="all">All Stores</option>
            <option value="main">Main Branch</option>
            <option value="b2">Branch 2</option>
            <option value="b3">Branch 3</option>
          </select>
          <div className="p-1 bg-background rounded-lg flex gap-1 border border-secondary/20">
             <button onClick={() => setDateRange('day')} className={`px-3 py-1 rounded text-xs font-bold ${dateRange === 'day' ? 'bg-surface shadow-sm text-text-dark' : 'text-text-secondary'}`}>Today</button>
             <button onClick={() => setDateRange('week')} className={`px-3 py-1 rounded text-xs font-bold ${dateRange === 'week' ? 'bg-surface shadow-sm text-text-dark' : 'text-text-secondary'}`}>This Week</button>
             <button onClick={() => setDateRange('month')} className={`px-3 py-1 rounded text-xs font-bold ${dateRange === 'month' ? 'bg-surface shadow-sm text-text-dark' : 'text-text-secondary'}`}>This Month</button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {dynamicKpis.map((kpi, i) => <KpiCard key={i} data={kpi} />)}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface p-6 rounded-2xl shadow-sm border border-secondary/20 h-80 flex flex-col">
          <h3 className="text-sm font-bold text-text-dark mb-4">Sales Trend (All Stores)</h3>
          <ResponsiveContainer><LineChart data={salesTrendData}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} strokeOpacity={0.2} /><XAxis dataKey="name" tick={{ fontSize: 10, fill: textColor }} /><YAxis tick={{ fontSize: 10, fill: textColor }} /><Tooltip /><Line type="monotone" dataKey="sales" stroke="#208091" strokeWidth={2} /></LineChart></ResponsiveContainer>
        </div>
        <div className="bg-surface p-6 rounded-2xl shadow-sm border border-secondary/20 h-80 flex flex-col">
          <h3 className="text-sm font-bold text-text-dark mb-4">Store Comparison (All Stores)</h3>
          <ResponsiveContainer><BarChart data={storeComparisonData} layout="vertical"><CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={gridColor} strokeOpacity={0.2} /><XAxis type="number" hide /><YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: textColor }} width={60} /><Tooltip /><Bar dataKey="sales" fill="#20C08D" radius={[0, 4, 4, 0]} /></BarChart></ResponsiveContainer>
        </div>
        <div className="bg-surface p-6 rounded-2xl shadow-sm border border-secondary/20 h-80 flex flex-col">
          <h3 className="text-sm font-bold text-text-dark mb-4">Top 5 Products (All Stores)</h3>
          <ResponsiveContainer><BarChart data={topProductsData} layout="vertical"><CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={gridColor} strokeOpacity={0.2} /><XAxis type="number" hide /><YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: textColor }} width={80} /><Tooltip /><Bar dataKey="sold" fill="#E6815F" radius={[0, 4, 4, 0]} /></BarChart></ResponsiveContainer>
        </div>
        <div className="bg-surface p-6 rounded-2xl shadow-sm border border-secondary/20 h-80 flex flex-col">
           <h3 className="text-sm font-bold text-text-dark mb-4">Revenue Breakdown (All Stores)</h3>
           <ResponsiveContainer><PieChart><Pie data={revenueBreakdownData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value"><Tooltip />{revenueBreakdownData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}</Pie><Legend iconSize={10} wrapperStyle={{fontSize: "12px"}} /></PieChart></ResponsiveContainer>
        </div>
      </div>

      {/* Recent Sales Table */}
      <div className="bg-surface rounded-2xl shadow-sm border border-secondary/20 overflow-hidden">
        <h3 className="text-sm font-bold text-text-dark p-6">Recent Sales</h3>
        <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-background text-[10px] font-bold text-text-secondary uppercase tracking-widest"><tr><th className="px-6 py-3">Job #</th><th className="px-6 py-3">Customer</th><th className="px-6 py-3">Amount</th><th className="px-6 py-3">Store</th><th className="px-6 py-3">Salesman</th><th className="px-6 py-3">Time</th><th className="px-6 py-3">Status</th></tr></thead><tbody className="divide-y divide-secondary/20">{recentSalesData.map(sale => (<tr key={sale.id} className="hover:bg-background"><td className="px-6 py-4 font-bold text-primary">{sale.id}</td><td className="px-6 py-4">{sale.customer}</td><td className="px-6 py-4 font-bold">₹{sale.amount.toLocaleString()}</td><td className="px-6 py-4">{sale.store}</td><td className="px-6 py-4">{sale.salesman}</td><td className="px-6 py-4">{sale.time}</td><td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-[10px] font-bold ${sale.status==='Completed'?'bg-success/10 text-success':'bg-warning/10 text-warning'}`}>{sale.status}</span></td></tr>))}</tbody></table></div>
      </div>

      {/* Inventory Alerts Table */}
      <div className="bg-surface rounded-2xl shadow-sm border border-secondary/20 overflow-hidden">
        <h3 className="text-sm font-bold text-text-dark p-6">Inventory Alerts</h3>
        <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-background text-[10px] font-bold text-text-secondary uppercase tracking-widest"><tr><th className="px-6 py-3">Product</th><th className="px-6 py-3">Current Stock</th><th className="px-6 py-3">Min Level</th><th className="px-6 py-3">Store</th><th className="px-6 py-3">Status</th><th className="px-6 py-3">Action</th></tr></thead><tbody className="divide-y divide-secondary/20">{inventoryAlertsData.map(item => (<tr key={item.product} className="hover:bg-background"><td className="px-6 py-4 font-bold">{item.product}</td><td className="px-6 py-4">{item.stock}</td><td className="px-6 py-4">{item.min}</td><td className="px-6 py-4">{item.store}</td><td className="px-6 py-4"><span className={`px-2 py-1 text-[10px] font-bold rounded-lg ${getStatusColor(item.status)}`}>{item.status}</span></td><td className="px-6 py-4"><button className="px-3 py-1 bg-primary text-white rounded text-xs font-bold hover:bg-primary/90 active:bg-primary/80 disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-primary">Reorder</button></td></tr>))}</tbody></table></div>
      </div>
    </div>
  );
};

export default Dashboard;