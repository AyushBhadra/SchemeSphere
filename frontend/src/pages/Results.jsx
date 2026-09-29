import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Bookmark, BookmarkCheck, ExternalLink, Percent, FileText, CheckCircle2, ArrowLeft, Info } from 'lucide-react';
import SchemeDetailsModal from '../components/SchemeDetailsModal';

export default function Results() {
  const { t, language } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, toggleBookmark } = useAuth();
  const [savedSchemes, setSavedSchemes] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [selectedScheme, setSelectedScheme] = useState(null);

  // Safely extract schemes from navigation state
  const rawSchemes = location.state?.schemes;
  const formData = location.state?.formData;

  // Normalize: backend returns array of { scheme, matchPercentage, ... }
  const schemes = React.useMemo(() => {
    if (!rawSchemes) return [];
    const arr = Array.isArray(rawSchemes) ? rawSchemes : (rawSchemes?.matches || rawSchemes?.schemes || []);
    return arr;
  }, [rawSchemes]);

  useEffect(() => {
    // Pre-populate saved bookmarks from user profile
    if (user?.savedSchemes) {
      setSavedSchemes(new Set(user.savedSchemes.map(s => s?._id || s)));
    }
    setLoading(false);
  }, [user]);

  const toggleSave = async (schemeId) => {
    if (!user) {
      alert(t('loginToSave'));
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

  // Helper to get scheme data — backend wraps in { scheme: {...}, matchPercentage }
  const getSchemeData = (item) => item?.scheme || item;
  const getMatchPct = (item) => item?.matchPercentage ?? 100;

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600"></div>
          <p className="text-lg font-medium text-slate-600">{t('analyzing')}</p>
        </div>
      </div>
    );
  }

  // If no schemes or no formData, show a friendly fallback
  if (!formData || schemes.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-12 shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
            <FileText size={28} className="text-slate-400" />
          </div>
          <h2 className="mt-6 text-2xl font-bold text-slate-900">{t('noResults')}</h2>
          <p className="mt-3 text-slate-500">
            {!formData
              ? 'Please complete the eligibility questionnaire first.'
              : 'Try adjusting your profile details for better matches.'}
          </p>
          <Link
            to="/quiz"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
          >
            <ArrowLeft size={18} />
            {t('retakeQuiz')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 text-center flex flex-col items-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t('resultsTitle')}</h1>
        <p className="mt-4 text-lg text-slate-600">
          {t('resultsSubtitle').replace('{count}', String(schemes.length))}
        </p>
        <button
          onClick={() => window.print()}
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 print:hidden"
        >
          <FileText size={16} />
          {t('printChecklist')}
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {schemes.map((item, index) => {
          const scheme = getSchemeData(item);
          const matchPct = getMatchPct(item);
          const schemeId = scheme?._id || index;
          const title = (language === 'hi' && scheme?.titleHindi) ? scheme.titleHindi : (scheme?.title || 'Untitled');
          const benefitsText = (language === 'hi' && scheme?.benefitsHindi) ? scheme.benefitsHindi : (scheme?.benefits || '');
          const docs = scheme?.requiredDocuments || scheme?.documents || [];
          const applyUrl = scheme?.applicationUrl || scheme?.link || '#';

          return (
            <div
              key={schemeId}
              className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-card"
            >
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                      {scheme?.department || 'Government'}
                    </span>
                    <h3 className="mt-3 text-xl font-bold text-slate-900">{title}</h3>
                  </div>
                  <div className="flex shrink-0 flex-col items-center rounded-lg bg-emerald-50 px-3 py-2 text-emerald-700">
                    <span className="flex items-center text-lg font-bold">
                      {matchPct}
                      <Percent size={14} className="ml-0.5" />
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider">{t('matchScore')}</span>
                  </div>
                </div>

                <div className="mt-6 flex-1 space-y-4 text-sm">
                  {benefitsText && (
                    <div>
                      <div className="flex items-center gap-2 font-semibold text-slate-900">
                        <CheckCircle2 size={16} className="text-emerald-500" />
                        {t('benefits')}
                      </div>
                      <p className="mt-1 text-slate-600">{benefitsText}</p>
                    </div>
                  )}
                  {docs.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 font-semibold text-slate-900">
                        <FileText size={16} className="text-emerald-500" />
                        {t('documents')}
                      </div>
                      <ul className="mt-1 list-inside list-disc text-slate-600">
                        {docs.map((doc, i) => (
                          <li key={i}>{doc}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Eligibility Criteria Breakdown */}
                  <details className="group/details border-t border-slate-100 pt-4 cursor-pointer">
                    <summary className="font-semibold text-slate-800 outline-none list-none flex items-center justify-between">
                      {t('eligibilityBreakdown')}
                      <span className="text-slate-400 group-open/details:rotate-180 transition-transform">▼</span>
                    </summary>
                    <div className="mt-3 space-y-2 pl-2 border-l-2 border-slate-200">
                      {item.failedChecks ? (
                        <>
                          <div className="text-sm">
                            <span className={item.failedChecks.includes('age') || item.failedChecks.includes('minAge') || item.failedChecks.includes('maxAge') ? "text-red-500 font-medium" : "text-emerald-600 font-medium"}>
                              • {t('ageCriteriaMet')}: {item.failedChecks.includes('age') || item.failedChecks.includes('minAge') || item.failedChecks.includes('maxAge') ? t('criteriaNotMet') : t('criteriaMet')}
                            </span>
                          </div>
                          <div className="text-sm">
                            <span className={item.failedChecks.includes('state') ? "text-red-500 font-medium" : "text-emerald-600 font-medium"}>
                              • {t('stateMatched')}: {item.failedChecks.includes('state') ? t('criteriaNotMet') : t('criteriaMet')}
                            </span>
                          </div>
                          <div className="text-sm">
                            <span className={item.failedChecks.includes('annualIncome') ? "text-red-500 font-medium" : "text-emerald-600 font-medium"}>
                              • {t('incomeWithinRange')}: {item.failedChecks.includes('annualIncome') ? t('criteriaNotMet') : t('criteriaMet')}
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="text-sm text-emerald-600 font-medium">• {t('criteriaMet')} (100%)</div>
                      )}
                    </div>
                  </details>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 p-6 print:hidden">
                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedScheme(scheme)}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
                  >
                    <Info size={16} />
                    {t('viewDetails')}
                  </button>
                  <a
                    href={applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
                  >
                    {t('applyNow')}
                    <ExternalLink size={16} />
                  </a>
                </div>
                <button
                  onClick={() => toggleSave(schemeId)}
                  className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors ${
                    savedSchemes.has(schemeId)
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {savedSchemes.has(schemeId) ? (
                    <>
                      <BookmarkCheck size={18} className="fill-emerald-200" />
                      {t('saved')}
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
          );
        })}
      </div>

      {/* Details Modal */}
      <SchemeDetailsModal 
        scheme={selectedScheme} 
        isOpen={!!selectedScheme} 
        onClose={() => setSelectedScheme(null)} 
      />
    </div>
  );
}
