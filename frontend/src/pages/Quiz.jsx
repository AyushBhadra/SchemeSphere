import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

export default function Quiz() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    income: '',
    occupation: '',
    state: '',
    category: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/filter/match', formData);
      navigate('/results', { state: { schemes: response.data, formData } });
    } catch (error) {
      console.error('Failed to fetch matched schemes', error);
      alert('Failed to find matched schemes. Please try again.');
    }
  };

  const totalSteps = 6;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t('quizTitle')}</h1>
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full bg-emerald-500 transition-all duration-300 ease-in-out"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
        <p className="mt-2 text-sm font-medium text-slate-500">
          Step {step} of {totalSteps}
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <form onSubmit={step === totalSteps ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }}>
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
              <label className="block text-lg font-medium text-slate-900">
                {t('quizAge')}
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                required
                className="input text-lg"
                placeholder="e.g. 25"
                min="0"
                max="120"
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
              <label className="block text-lg font-medium text-slate-900">
                {t('quizGender')}
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                required
                className="input text-lg"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
              <label className="block text-lg font-medium text-slate-900">
                {t('quizIncome')}
              </label>
              <input
                type="number"
                name="income"
                value={formData.income}
                onChange={handleInputChange}
                required
                className="input text-lg"
                placeholder="e.g. 500000"
                min="0"
              />
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
              <label className="block text-lg font-medium text-slate-900">
                {t('quizOccupation')}
              </label>
              <select
                name="occupation"
                value={formData.occupation}
                onChange={handleInputChange}
                required
                className="input text-lg"
              >
                <option value="">Select Occupation</option>
                <option value="student">Student</option>
                <option value="farmer">Farmer</option>
                <option value="business">Business</option>
                <option value="salaried">Salaried</option>
                <option value="unemployed">Unemployed</option>
              </select>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
              <label className="block text-lg font-medium text-slate-900">
                {t('quizState')}
              </label>
              <select
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                required
                className="input text-lg"
              >
                <option value="">Select State</option>
                <option value="maharashtra">Maharashtra</option>
                <option value="delhi">Delhi</option>
                <option value="karnataka">Karnataka</option>
                <option value="gujarat">Gujarat</option>
                <option value="up">Uttar Pradesh</option>
                <option value="other">Other</option>
              </select>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
              <label className="block text-lg font-medium text-slate-900">
                {t('quizCategory')}
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="input text-lg"
              >
                <option value="">Select Category</option>
                <option value="general">General</option>
                <option value="obc">OBC</option>
                <option value="sc">SC</option>
                <option value="st">ST</option>
                <option value="ebc">EBC</option>
              </select>
            </div>
          )}

          <div className="mt-8 flex justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center gap-2 rounded-xl border border-slate-200 px-6 py-3 font-medium text-slate-600 transition-colors hover:bg-slate-50"
              >
                <ChevronLeft size={20} />
                {t('back')}
              </button>
            ) : (
              <div></div>
            )}
            
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-8 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
            >
              {step === totalSteps ? (
                <>
                  {t('submit')}
                  <CheckCircle2 size={20} />
                </>
              ) : (
                <>
                  {t('next')}
                  <ChevronRight size={20} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
