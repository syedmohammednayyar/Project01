
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './views/Dashboard';
import Sales from './views/Sales';
import Repairs from './views/Repairs';
import Expenses from './views/Expenses';
import Payments from './views/Payments';
import Accessories from './views/Accessories';
import Inventory from './views/Inventory';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Login from './views/Login';
import { User } from './types';
import POS from './views/POS';

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('mobmastery-user');
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

  const handleLogin = (loggedInUser: User) => {
    localStorage.setItem('mobmastery-user', JSON.stringify(loggedInUser));
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('mobmastery-user');
    setUser(null);
  };

  return (
    <Router>
      {!user ? (
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      ) : (
        <div className="flex h-screen overflow-hidden text-text-dark">
          <Sidebar 
            isOpen={isSidebarOpen} 
            setIsOpen={setIsSidebarOpen} 
            user={user}
            onLogout={handleLogout}
          />
          
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <Header 
              onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} 
              user={user}
            />
            
            <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-background">
              <div className="max-w-7xl mx-auto">
                <Routes>
                  <Route path="/dashboard" element={<Dashboard user={user} />} />
                  <Route path="/sales" element={<Sales />} />
                  <Route path="/pos" element={<POS />} />
                  <Route path="/inventory" element={<Inventory user={user} />} />
                  <Route path="/repairs" element={<Repairs />} />
                  <Route path="/expenses" element={<Expenses />} />
                  <Route path="/payments" element={<Payments />} />
                  <Route path="/accessories" element={<Accessories />} />
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/login" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </div>
            </main>
          </div>
        </div>
      )}
    </Router>
  );
};

export default App;