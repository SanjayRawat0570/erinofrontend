import React from 'react';
import { useAuth } from '../context/AuthContext';
import LeadsGrid from '../components/LeadsGrid.jsx';

const DashboardPage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white shadow-md">
        <div className="max-w-screen-xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Leads Dashboard</h1>
          <div className="flex items-center">
            <span className="mr-4 text-gray-700">Welcome, <span className="font-semibold">{user?.email}</span></span>
            <button onClick={logout} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-semibold transition-transform transform hover:scale-105">Logout</button>
          </div>
        </div>
      </header>
      <main>
        <div className="max-w-screen-xl mx-auto py-8 sm:px-6 lg:px-8">
          <LeadsGrid />
        </div>
      </main>
    </div>
  );
};
export default DashboardPage;