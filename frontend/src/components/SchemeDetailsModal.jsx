import React, { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { X, ExternalLink, CheckCircle2, Info, Users, MapPin, Briefcase, IndianRupee } from 'lucide-react';

export default function SchemeDetailsModal({ scheme, isOpen, onClose }) {
  const { t, language } = useLanguage();

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEsc);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !scheme) return null;

  const title = language === 'hi' && scheme.titleHindi ? scheme.titleHindi : scheme.title;
  const description = language === 'hi' && scheme.descriptionHindi ? scheme.descriptionHindi : scheme.description;
  const benefits = language === 'hi' && scheme.benefitsHindi ? scheme.benefitsHindi : scheme.benefits;
  const docs = scheme.requiredDocuments || scheme.documents || [];
  const applyUrl = scheme.applicationUrl || scheme.link || '#';

  const formatIncome = (income) => {
    if (!income || income === 0) return t('noIncomeCap');
    return `₹${income.toLocaleString('en-IN')}`;
  };

  const formatArray = (arr) => {
    if (!arr || arr.length === 0) return 'All / Any';
    if (arr.includes('All') || arr.includes('Any')) return 'All / Any';
    return arr.join(', ');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
        
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between border-b border-slate-100 p-6">
          <div className="pr-6">
            <span className="mb-2 inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
              {scheme.category || 'Government Scheme'}
            </span>
            <h2 className="text-2xl font-bold text-slate-900 leading-tight">
              {title}
            </h2>
            <p className="mt-1 font-medium text-slate-500">{scheme.department}</p>
          </div>
          <button 
            onClick={onClose}
            className="rounded-full bg-slate-100 p-2 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid gap-8 md:grid-cols-3">
            
            {/* Left Column: Description & Benefits */}
            <div className="md:col-span-2 space-y-6">
              <section>
                <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-900">
                  <Info size={18} className="text-emerald-500" />
                  {t('overview')}
                </h3>
                <p className="text-slate-600 leading-relaxed">{description}</p>
              </section>
              
              <section>
                <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-900">
                  <CheckCircle2 size={18} className="text-emerald-500" />
                  {t('benefits')}
                </h3>
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
                  <p className="font-medium text-emerald-900 leading-relaxed">{benefits}</p>
                </div>
              </section>

              {docs.length > 0 && (
                <section>
                  <h3 className="mb-3 text-lg font-bold text-slate-900">{t('documents')}</h3>
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {docs.map((doc, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100">
                          <CheckCircle2 size={12} className="text-slate-500" />
                        </div>
                        {doc}
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>

            {/* Right Column: Criteria Summary */}
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-5 h-max">
              <h3 className="mb-4 text-lg font-bold text-slate-900">{t('eligibilityCriteria')}</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Users size={16} className="mt-0.5 text-slate-400" />
                  <div>
                    <p className="text-xs font-semibold uppercase text-slate-500">{t('ageLimit')}</p>
                    <p className="text-sm font-medium text-slate-800">
                      {scheme.criteria?.minAge} - {scheme.criteria?.maxAge} Years
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-4 w-4 items-center justify-center text-slate-400">⚧</div>
                  <div>
                    <p className="text-xs font-semibold uppercase text-slate-500">{t('gender')}</p>
                    <p className="text-sm font-medium text-slate-800">
                      {scheme.criteria?.gender === 'Any' ? t('anyGender') : (language === 'hi' && scheme.criteria?.gender === 'Male' ? 'पुरुष' : (language === 'hi' && scheme.criteria?.gender === 'Female' ? 'महिला' : scheme.criteria?.gender))}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <IndianRupee size={16} className="mt-0.5 text-slate-400" />
                  <div>
                    <p className="text-xs font-semibold uppercase text-slate-500">{t('incomeLimit')}</p>
                    <p className="text-sm font-medium text-slate-800">
                      {formatIncome(scheme.criteria?.maxAnnualIncome)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin size={16} className="mt-0.5 text-slate-400" />
                  <div>
                    <p className="text-xs font-semibold uppercase text-slate-500">{t('applicableStates')}</p>
                    <p className="text-sm font-medium text-slate-800">
                      {scheme.criteria?.state === 'All-India' ? t('cat_All') + ' India' : scheme.criteria?.state}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Briefcase size={16} className="mt-0.5 text-slate-400" />
                  <div>
                    <p className="text-xs font-semibold uppercase text-slate-500">{t('targetOccupations')}</p>
                    <p className="text-sm font-medium text-slate-800">
                      {formatArray(scheme.criteria?.targetOccupations)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex shrink-0 flex-col-reverse justify-end gap-3 border-t border-slate-100 p-6 sm:flex-row sm:items-center">
          <button
            onClick={onClose}
            className="rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100"
          >
            {t('close')}
          </button>
          <a
            href={applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
          >
            {t('applyOnOfficialPortal')}
            <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}
