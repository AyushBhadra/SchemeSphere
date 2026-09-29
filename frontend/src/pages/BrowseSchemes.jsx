import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Search, Filter, ExternalLink, Bookmark, BookmarkCheck, ChevronDown, Info } from 'lucide-react';
import api from '../services/api';
import SchemeDetailsModal from '../components/SchemeDetailsModal';

const CATEGORIES = ['All', 'Agriculture', 'Healthcare', 'Education', 'Financial', 'Housing', 'Social Security', 'Women & Child', 'Employment', 'Skill Development'];
const STATES = ['All States', 'All-India', 'Maharashtra', 'Uttar Pradesh', 'Madhya Pradesh', 'Karnataka', 'Bihar', 'Rajasthan', 'Delhi', 'Gujarat', 'Tamil Nadu', 'West Bengal'];

export default function BrowseSchemes() {
  const { t, language } = useLanguage();
  const { user, toggleBookmark } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedSet, setSavedSet] = useState(new Set());
  const [selectedScheme, setSelectedScheme] = useState(null);

  const searchQuery = searchParams.get('search') || '';
  const categoryFilter = searchParams.get('category') || 'All';
  const stateFilter = searchParams.get('state') || 'All States';

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const response = await api.get('/schemes');
        setSchemes(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Failed to fetch schemes', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSchemes();
  }, []);

  useEffect(() => {
    if (user?.savedSchemes) {
      setSavedSet(new Set(user.savedSchemes.map(s => s?._id || s)));
    }
  }, [user]);

  const handleToggleSave = async (id) => {
    if (!user) return;
    try {
      await toggleBookmark(id);
      setSavedSet(prev => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
      });
    } catch (err) { console.error(err); }
  };

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== 'All' && value !== 'All States') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    setSearchParams(params);
  };

  const filteredSchemes = useMemo(() => {
    return schemes.filter(s => {
      const matchCategory = categoryFilter === 'All' || s.category === categoryFilter;
      const matchState = stateFilter === 'All States' || (s.criteria?.state === stateFilter) || (s.criteria?.state === 'All-India');
      const q = searchQuery.toLowerCase();
      const matchSearch = !q || s.title?.toLowerCase().includes(q) || s.titleHindi?.includes(searchQuery) || s.department?.toLowerCase().includes(q);
      return matchCategory && matchState && matchSearch;
    });
  }, [schemes, categoryFilter, stateFilter, searchQuery]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t('browseTitle')}</h1>
        <p className="mt-2 text-lg text-slate-600">{t('browseSubtitle').replace('{count}', String(schemes.length))}</p>
      </div>

      {/* Search & Filters Bar */}
      <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => updateFilter('search', e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="input pl-10"
            />
          </div>
          <select
            value={stateFilter}
            onChange={(e) => updateFilter('state', e.target.value)}
            className="input sm:w-52"
          >
            {STATES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Category Tabs */}
        <div className="mt-4 flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => updateFilter('category', cat)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                (categoryFilter === cat || (cat === 'All' && !categoryFilter))
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t(`cat_${cat.replace(/ & /g, '_').replace(/ /g, '_')}`) || cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <p className="mb-6 text-sm font-medium text-slate-500">
        {t('showingResults').replace('{count}', String(filteredSchemes.length))}
      </p>

      {/* Scheme Grid */}
      {filteredSchemes.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center">
          <p className="text-lg text-slate-500">{t('noSchemesFound')}</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSchemes.map(scheme => {
            const title = (language === 'hi' && scheme?.titleHindi) ? scheme.titleHindi : scheme?.title;
            const benefits = (language === 'hi' && scheme?.benefitsHindi) ? scheme.benefitsHindi : scheme?.benefits;
            return (
              <div key={scheme._id} className="flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md">
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-2">
                    <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                      {scheme?.category}
                    </span>
                    {scheme?.criteria?.state && scheme.criteria.state !== 'All-India' && (
                      <span className="inline-flex rounded-full bg-blue-100 px-2.5 py-0.5 text-[11px] font-semibold text-blue-700">
                        {scheme.criteria.state}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-3 text-base font-bold leading-snug text-slate-900">{title}</h3>
                  <p className="mt-1 text-xs text-slate-500">{scheme?.department}</p>
                  {benefits && (
                    <p className="mt-3 line-clamp-3 text-sm text-slate-600">{benefits}</p>
                  )}
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-5 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedScheme(scheme)}
                      className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900"
                    >
                      <Info size={14} /> {t('viewDetails')}
                    </button>
                    <a
                      href={scheme?.applicationUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
                    >
                      {t('applyNow')} <ExternalLink size={14} />
                    </a>
                  </div>
                  {user && (
                    <button
                      onClick={() => handleToggleSave(scheme._id)}
                      className="text-slate-400 transition-colors hover:text-emerald-600"
                    >
                      {savedSet.has(scheme._id) ? <BookmarkCheck size={18} className="fill-emerald-200 text-emerald-600" /> : <Bookmark size={18} />}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Details Modal */}
      <SchemeDetailsModal 
        scheme={selectedScheme} 
        isOpen={!!selectedScheme} 
        onClose={() => setSelectedScheme(null)} 
      />
    </div>
  );
}
