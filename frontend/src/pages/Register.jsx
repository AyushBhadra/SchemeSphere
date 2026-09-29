import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Search } from 'lucide-react';

export default function Register() {
  const { t } = useLanguage();
  const { registerUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'citizen' });
  const [error, setError] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { user } = await registerUser(formData);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-sm">
            <Search size={28} className="stroke-[2.5]" />
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-900">
            {t('register')}
          </h2>
        </div>
        
        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label className="sr-only" htmlFor="name">
                {t('name')}
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="input"
                placeholder={t('name')}
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="sr-only" htmlFor="email-address">
                {t('email')}
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="input"
                placeholder={t('email')}
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="sr-only" htmlFor="password">
                {t('password')}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="input"
                placeholder={t('password')}
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="sr-only" htmlFor="role">
                {t('role')}
              </label>
              <select
                id="role"
                name="role"
                className="input"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="citizen">{t('citizen')}</option>
                <option value="admin">{t('admin')}</option>
              </select>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-xl bg-emerald-600 px-3 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
            >
              {t('register')}
            </button>
          </div>
        </form>

        <div className="text-center text-sm">
          <span className="text-slate-500">{t('haveAccount')} </span>
          <Link to="/login" className="font-semibold text-emerald-600 hover:text-emerald-500">
            {t('login')}
          </Link>
        </div>
      </div>
    </div>
  );
}
