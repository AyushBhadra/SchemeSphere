import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import api from '../services/api';

export default function AdminDashboard() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newScheme, setNewScheme] = useState({ title: '', department: '', criteria: '' });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }

    const fetchSchemes = async () => {
      try {
        const response = await api.get('/schemes');
        setSchemes(response.data);
      } catch (error) {
        console.error('Failed to fetch schemes', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchemes();
  }, [user, navigate]);

  const handleDelete = async (id) => {
    if(window.confirm('Are you sure you want to delete this scheme?')) {
      try {
        await api.delete(`/schemes/${id}`);
        setSchemes(schemes.filter(s => s._id !== id));
      } catch (error) {
        console.error('Failed to delete scheme', error);
      }
    }
  };

  const handleAddScheme = async () => {
    try {
      const criteriaObj = JSON.parse(newScheme.criteria || '{}');
      const payload = {
        title: newScheme.title,
        department: newScheme.department,
        criteria: criteriaObj,
        isActive: true
      };
      const response = await api.post('/schemes', payload);
      setSchemes([...schemes, response.data]);
      setShowModal(false);
      setNewScheme({ title: '', department: '', criteria: '' });
    } catch (error) {
      console.error('Failed to add scheme', error);
      alert('Failed to add scheme. Please check your JSON criteria.');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            {t('adminDashboard')}
          </h1>
          <p className="mt-2 text-slate-600">Manage all government schemes.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
        >
          <Plus size={20} />
          {t('addScheme')}
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                Scheme Title
              </th>
              <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                Department
              </th>
              <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                Status
              </th>
              <th scope="col" className="px-6 py-4 text-right text-sm font-semibold text-slate-900">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {schemes.map((scheme) => (
              <tr key={scheme._id} className="transition-colors hover:bg-slate-50">
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="font-medium text-slate-900">{scheme.title}</div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-slate-500">
                  {scheme.department}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                    scheme.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {scheme.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  <div className="flex justify-end gap-3">
                    <button className="text-blue-600 hover:text-blue-900">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDelete(scheme._id)} className="text-red-600 hover:text-red-900">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {schemes.length === 0 && (
          <div className="p-8 text-center text-slate-500">No schemes found.</div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-bold text-slate-900">{t('addScheme')}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Title</label>
                <input 
                  type="text" 
                  className="input mt-1"
                  value={newScheme.title}
                  onChange={(e) => setNewScheme({...newScheme, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Department</label>
                <input 
                  type="text" 
                  className="input mt-1"
                  value={newScheme.department}
                  onChange={(e) => setNewScheme({...newScheme, department: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Criteria (JSON)</label>
                <textarea 
                  className="input mt-1 h-24 font-mono text-sm" 
                  placeholder='{"age_min": 18, "income_max": 500000}'
                  value={newScheme.criteria}
                  onChange={(e) => setNewScheme({...newScheme, criteria: e.target.value})}
                ></textarea>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddScheme}
                className="rounded-xl bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
