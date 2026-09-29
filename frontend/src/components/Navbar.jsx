import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Globe, User, LogOut, LayoutDashboard, Search, Menu, X } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function Navbar() {
  const { t, language, toggleLanguage } = useLanguage();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(false);

  const navLinks = [
    { name: t('home'), path: '/' },
    { name: t('quiz'), path: '/quiz' },
  ];

  if (user) {
    if (user.role === 'admin') {
      navLinks.push({ name: t('adminDashboard'), path: '/admin' });
    } else {
      navLinks.push({ name: t('dashboard'), path: '/dashboard' });
    }
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-white shadow-sm">
                <Search size={20} className="stroke-[2.5]" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                {t('appName')}
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:gap-8">
            <div className="flex gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-sm font-medium text-slate-600 transition-colors hover:text-emerald-600"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
              >
                <Globe size={16} />
                <span>{language === 'en' ? 'हिंदी' : 'English'}</span>
              </button>

              {user ? (
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    <User size={18} />
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-red-600"
                  >
                    <LogOut size={16} />
                    {t('logout')}
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                >
                  {t('login')}
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-slate-900"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <div className="space-y-1 px-4 pb-3 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="block rounded-md px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-emerald-600"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <button
              onClick={toggleLanguage}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-emerald-600"
            >
              <Globe size={18} />
              <span>{language === 'en' ? 'हिंदी' : 'English'}</span>
            </button>
            {user ? (
              <button
                onClick={() => { handleLogout(); setIsOpen(false); }}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-slate-700 hover:bg-red-50 hover:text-red-600"
              >
                <LogOut size={18} />
                {t('logout')}
              </button>
            ) : (
              <Link
                to="/login"
                className="block rounded-md bg-emerald-50 px-3 py-2 text-base font-medium text-emerald-700"
                onClick={() => setIsOpen(false)}
              >
                {t('login')}
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
