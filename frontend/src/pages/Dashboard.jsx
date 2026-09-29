import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { BookmarkMinus, ExternalLink } from 'lucide-react';

export default function Dashboard() {
  const { t } = useLanguage();
  const { user, toggleBookmark } = useAuth();
  const navigate = useNavigate();
  const [savedSchemes, setSavedSchemes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role === 'admin') {
      navigate('/admin');
      return;
    }

    if (user.savedSchemes) {
      setSavedSchemes(user.savedSchemes);
    }
    setLoading(false);
  }, [user, navigate]);

  const removeScheme = async (id) => {
    try {
      await toggleBookmark(id);
      // The toggleBookmark function in AuthContext already refetches the profile
      // so user.savedSchemes will update and the useEffect will catch it
    } catch (error) {
      console.error('Failed to remove bookmark', error);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          {t('welcome')}, {user?.name}!
        </h1>
        <p className="mt-2 text-lg text-slate-600">
          Manage your saved government schemes.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-xl font-bold text-slate-900">{t('savedSchemes')}</h2>
        
        {savedSchemes.length === 0 ? (
          <div className="py-12 text-center text-slate-500">
            {t('noSaved')}
          </div>
        ) : (
          <div className="space-y-4">
            {savedSchemes.map((scheme) => (
              <div key={scheme._id} className="flex flex-col justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4 sm:flex-row sm:items-center">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{scheme.title}</h3>
                  <p className="text-sm text-slate-500">{scheme.department}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                    {scheme.status}
                  </span>
                  <a
                    href={scheme.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg bg-emerald-100 px-3 py-2 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-200"
                  >
                    Apply <ExternalLink size={16} />
                  </a>
                  <button
                    onClick={() => removeScheme(scheme._id)}
                    className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100"
                    title="Remove"
                  >
                    <BookmarkMinus size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
