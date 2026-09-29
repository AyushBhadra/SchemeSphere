import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Bookmark, BookmarkCheck, ExternalLink, Percent, FileText, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

export default function Results() {
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, toggleBookmark } = useAuth();
  const [schemes, setSchemes] = useState(location.state?.schemes || []);
  const [loading, setLoading] = useState(!location.state?.schemes);
  const [savedSchemes, setSavedSchemes] = useState(new Set());

  const formData = location.state?.formData;

  useEffect(() => {
    if (!formData) {
      navigate('/quiz');
      return;
    }

    if (user?.savedSchemes) {
      setSavedSchemes(new Set(user.savedSchemes.map(s => s._id || s)));
    }

    if (!location.state?.schemes) {
       navigate('/quiz');
    } else {
       setLoading(false);
    }
  }, [formData, navigate, user, location.state]);

  const toggleSave = async (schemeId) => {
    if (!user) {
      alert('Please login to save schemes');
      navigate('/login');
      return;
    }

    try {
      await toggleBookmark(schemeId);
      setSavedSchemes((prev) => {
        const next = new Set(prev);
        if (next.has(schemeId)) {
          next.delete(schemeId);
        } else {
          next.add(schemeId);
        }
        return next;
      });
    } catch (error) {
      console.error('Failed to bookmark', error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600"></div>
          <p className="text-lg font-medium text-slate-600">Analyzing your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t('resultsTitle')}</h1>
        <p className="mt-4 text-lg text-slate-600">
          Based on your profile, we found {schemes.length} schemes that you are eligible for.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {schemes.map((scheme) => (
          <div
            key={scheme._id}
            className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-card"
          >
            <div className="flex flex-1 flex-col p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                    {scheme.department}
                  </span>
                  <h3 className="mt-3 text-xl font-bold text-slate-900">{scheme.title}</h3>
                </div>
                <div className="flex flex-col items-center rounded-lg bg-emerald-50 px-3 py-2 text-emerald-700">
                  <span className="flex items-center text-lg font-bold">
                    {scheme.matchPercentage}
                    <Percent size={14} className="ml-0.5" />
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider">{t('matchScore')}</span>
                </div>
              </div>

              <div className="mt-6 flex-1 space-y-4 text-sm">
                <div>
                  <div className="flex items-center gap-2 font-semibold text-slate-900">
                    <CheckCircle2 size={16} className="text-emerald-500" />
                    {t('benefits')}
                  </div>
                  <p className="mt-1 text-slate-600">{scheme.benefits}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 font-semibold text-slate-900">
                    <FileText size={16} className="text-emerald-500" />
                    {t('documents')}
                  </div>
                  <ul className="mt-1 list-inside list-disc text-slate-600">
                    {scheme.documents.map((doc, i) => (
                      <li key={i}>{doc}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 p-6">
              <a
                href={scheme.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
              >
                {t('applyNow')}
                <ExternalLink size={16} />
              </a>
              <button
                onClick={() => toggleSave(scheme._id)}
                className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors ${
                  savedSchemes.has(scheme._id)
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {savedSchemes.has(scheme._id) ? (
                  <>
                    <BookmarkCheck size={18} className="fill-emerald-200" />
                    Saved
                  </>
                ) : (
                  <>
                    <Bookmark size={18} />
                    {t('bookmark')}
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
