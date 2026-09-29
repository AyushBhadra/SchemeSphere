import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { BookOpen, Stethoscope, GraduationCap, Home as HomeIcon, ChevronRight } from 'lucide-react';

export default function Home() {
  const { t } = useLanguage();

  const categories = [
    { name: t('agriculture'), icon: BookOpen, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { name: t('health'), icon: Stethoscope, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: t('education'), icon: GraduationCap, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { name: t('housing'), icon: HomeIcon, color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col">
      {/* Hero Section */}
      <section className="relative flex flex-1 items-center justify-center overflow-hidden bg-slate-900 px-4 py-20 sm:px-6 lg:px-8">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/90 to-slate-900/90" />
          {/* Decorative pattern could go here */}
        </div>
        
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            {t('heroTitle')}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-xl text-slate-300">
            {t('heroSubtitle')}
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link
              to="/quiz"
              className="group flex items-center gap-2 rounded-full bg-emerald-500 px-8 py-3.5 text-base font-semibold text-white shadow-lg transition-all hover:bg-emerald-400 hover:shadow-emerald-500/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
            >
              {t('findSchemesCTA')}
              <ChevronRight className="transition-transform group-hover:translate-x-1" size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {t('categories')}
            </h2>
          </div>
          
          <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <div
                  key={category.name}
                  className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:shadow-md"
                >
                  <div className={`inline-flex rounded-lg p-3 ${category.bg} ${category.color} ring-4 ring-white`}>
                    <Icon size={24} />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-slate-900">
                    {category.name}
                  </h3>
                  <div className="absolute bottom-0 left-0 h-1 w-full translate-y-full bg-emerald-500 transition-transform group-hover:translate-y-0" />
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
