import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import api from '../services/api';

const EMPTY_FORM = {
  title: '',
  titleHindi: '',
  department: '',
  category: 'Financial',
  description: '',
  benefits: '',
  applicationUrl: '',
  minAge: '',
  maxAge: '',
  gender: 'Any',
  maxAnnualIncome: '',
  requiredDocuments: '',
};

export default function AdminDashboard() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newScheme, setNewScheme] = useState({ ...EMPTY_FORM });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }

    fetchSchemes();
  }, [user, navigate]);

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

  const handleDelete = async (id) => {
    if (window.confirm(t('confirmDelete'))) {
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
      const payload = {
        title: newScheme.title,
        titleHindi: newScheme.titleHindi || undefined,
        department: newScheme.department,
        category: newScheme.category,
        description: newScheme.description || undefined,
        benefits: newScheme.benefits || undefined,
        applicationUrl: newScheme.applicationUrl || undefined,
        criteria: {
          minAge: newScheme.minAge ? Number(newScheme.minAge) : undefined,
          maxAge: newScheme.maxAge ? Number(newScheme.maxAge) : undefined,
          gender: newScheme.gender || 'Any',
          maxAnnualIncome: newScheme.maxAnnualIncome ? Number(newScheme.maxAnnualIncome) : null,
          targetOccupations: [],
          state: 'All-India',
          casteCategories: ['General', 'OBC', 'SC', 'ST'],
        },
        requiredDocuments: newScheme.requiredDocuments
          ? newScheme.requiredDocuments.split(',').map(d => d.trim()).filter(Boolean)
          : [],
      };
      const response = await api.post('/schemes', payload);
      setSchemes([...schemes, response.data]);
      setShowModal(false);
      setNewScheme({ ...EMPTY_FORM });
    } catch (error) {
      console.error('Failed to add scheme', error);
      alert('Failed to add scheme. Please verify all fields.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewScheme(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            {t('adminDashboard')}
          </h1>
          <p className="mt-2 text-slate-600">{t('manageSchemes')}</p>
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
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                  {t('schemeTitle')}
                </th>
                <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                  {t('department')}
                </th>
                <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                  {t('schemeCategory')}
                </th>
                <th scope="col" className="px-6 py-4 text-right text-sm font-semibold text-slate-900">
                  {t('actions')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {schemes.map((scheme) => (
                <tr key={scheme._id} className="transition-colors hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{scheme?.title || 'Untitled'}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {scheme?.department || '-'}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                      {scheme?.category || '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <div className="flex justify-end gap-3">
                      <button className="rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-900">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => handleDelete(scheme._id)} className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50 hover:text-red-900">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {schemes.length === 0 && (
          <div className="p-8 text-center text-slate-500">{t('noSchemes')}</div>
        )}
      </div>

      {/* Add Scheme Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">{t('addScheme')}</h2>
              <button onClick={() => setShowModal(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                <X size={22} />
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700">{t('schemeTitle')} (English) *</label>
                <input type="text" name="title" className="input mt-1" value={newScheme.title} onChange={handleChange} required />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700">{t('schemeTitle')} (Hindi)</label>
                <input type="text" name="titleHindi" className="input mt-1" value={newScheme.titleHindi} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">{t('department')} *</label>
                <input type="text" name="department" className="input mt-1" value={newScheme.department} onChange={handleChange} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">{t('schemeCategory')} *</label>
                <select name="category" className="input mt-1" value={newScheme.category} onChange={handleChange}>
                  <option value="Education">Education</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Agriculture">Agriculture</option>
                  <option value="Financial">Financial</option>
                  <option value="Housing">Housing</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700">{t('schemeBenefits')}</label>
                <textarea name="benefits" className="input mt-1 h-20" value={newScheme.benefits} onChange={handleChange}></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">{t('minAge')}</label>
                <input type="number" name="minAge" className="input mt-1" min="0" value={newScheme.minAge} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">{t('maxAge')}</label>
                <input type="number" name="maxAge" className="input mt-1" min="0" value={newScheme.maxAge} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">{t('genderEligibility')}</label>
                <select name="gender" className="input mt-1" value={newScheme.gender} onChange={handleChange}>
                  <option value="Any">{t('anyGender')}</option>
                  <option value="Male">{t('male')}</option>
                  <option value="Female">{t('female')}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">{t('maxIncome')}</label>
                <input type="number" name="maxAnnualIncome" className="input mt-1" min="0" placeholder={t('noIncomeCap')} value={newScheme.maxAnnualIncome} onChange={handleChange} />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700">{t('requiredDocs')}</label>
                <input type="text" name="requiredDocuments" className="input mt-1" placeholder="Aadhaar Card, PAN Card, Income Certificate" value={newScheme.requiredDocuments} onChange={handleChange} />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700">{t('applicationUrl')}</label>
                <input type="url" name="applicationUrl" className="input mt-1" placeholder="https://..." value={newScheme.applicationUrl} onChange={handleChange} />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-6">
              <button
                onClick={() => setShowModal(false)}
                className="rounded-xl border border-slate-200 px-5 py-2.5 font-medium text-slate-600 hover:bg-slate-50"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleAddScheme}
                className="rounded-xl bg-emerald-600 px-5 py-2.5 font-medium text-white hover:bg-emerald-700"
              >
                {t('save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
