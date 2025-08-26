import React, { useState, useEffect } from 'react';
import api from '../services/api';

const LeadForm = ({ lead, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    company: '',
    status: 'new',
    score: '',
    lead_value: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (lead) {
      setFormData({
        ...lead,
        score: lead.score || '',
        lead_value: lead.lead_value || '',
      });
    }
  }, [lead]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const payload = {
      ...formData,
      score: formData.score ? parseInt(formData.score, 10) : null,
      lead_value: formData.lead_value ? parseFloat(formData.lead_value) : null,
    };

    try {
      if (lead) {
        await api.put(`/leads/${lead.id}`, payload);
      } else {
        await api.post('/leads', payload);
      }
      onSave();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg transform transition-all">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">{lead ? 'Edit Lead' : 'Create New Lead'}</h2>
        {error && <p className="text-red-600 bg-red-100 p-3 rounded-md text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input name="first_name" value={formData.first_name} onChange={handleChange} placeholder="John" className="mt-1 p-2 w-full border rounded-md" required/>
            </div>
            <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Doe" className="mt-1 p-2 w-full border rounded-md" required/>
            </div>
            <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="john.doe@example.com" className="mt-1 p-2 w-full border rounded-md" required/>
            </div>
            <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Company</label>
                <input name="company" value={formData.company} onChange={handleChange} placeholder="Acme Inc." className="mt-1 p-2 w-full border rounded-md"/>
            </div>
            <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700">Score (0-100)</label>
                <input name="score" type="number" value={formData.score} onChange={handleChange} placeholder="75" className="mt-1 p-2 w-full border rounded-md"/>
            </div>
            <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700">Lead Value ($)</label>
                <input name="lead_value" type="number" step="0.01" value={formData.lead_value} onChange={handleChange} placeholder="5000" className="mt-1 p-2 w-full border rounded-md"/>
            </div>
            <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select name="status" value={formData.status || 'new'} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md bg-white">
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="lost">Lost</option>
                    <option value="won">Won</option>
                </select>
            </div>
          </div>
          <div className="flex justify-end mt-8">
            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg mr-2 hover:bg-gray-300 font-semibold transition">Cancel</button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-semibold transition">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default LeadForm;


