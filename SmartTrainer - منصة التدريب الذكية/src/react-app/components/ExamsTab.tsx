import { useState, useEffect } from 'react';
import { Plus, Target, Clock, Play, BarChart3 } from 'lucide-react';
import { Exam, Category, CreateExam } from '@/shared/types';
import { useLanguage } from '@/react-app/contexts/LanguageContext';
import { getTranslatedCategoryName } from '@/react-app/utils/categoryTranslations';

export default function ExamsTab() {
  const { t } = useLanguage();
  const [exams, setExams] = useState<(Exam & { category_name?: string })[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<CreateExam>({ 
    title: '', 
    description: '', 
    duration_minutes: 30,
    total_questions: 10
  });

  useEffect(() => {
    fetchExams();
    fetchCategories();
  }, []);

  const fetchExams = async () => {
    try {
      const response = await fetch('/api/exams');
      const data = await response.json();
      setExams(data);
    } catch (error) {
      console.error('Error fetching exams:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        setFormData({ title: '', description: '', duration_minutes: 30, total_questions: 10 });
        setShowForm(false);
        fetchExams();
      }
    } catch (error) {
      console.error('Error creating exam:', error);
    }
  };

  const startExam = (examId: number) => {
    // This would navigate to exam page - for now just show alert
    alert(`${t('exams.start')} ${examId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">{t('exams.title')}</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-navy-600 hover:bg-navy-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          {t('exams.add')}
        </button>
      </div>

      {showForm && (
        <div className="bg-navy-800/50 backdrop-blur-sm rounded-xl p-6 border border-navy-700/50">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-navy-200 mb-2">
                {t('exams.title_field')}
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 bg-navy-900/50 border border-navy-600 rounded-lg text-white placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-navy-500"
                placeholder={t('exams.title_field')}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-navy-200 mb-2">
                {t('questions.category')}
              </label>
              <select
                value={formData.category_id || ''}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value ? Number(e.target.value) : undefined })}
                className="w-full px-3 py-2 bg-navy-900/50 border border-navy-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-navy-500"
              >
                <option value="">{t('all_categories')}</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {getTranslatedCategoryName(category.name, t)}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-navy-200 mb-2">
                {t('description')}
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 bg-navy-900/50 border border-navy-600 rounded-lg text-white placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-navy-500"
                placeholder={t('exam_description_placeholder')}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-navy-200 mb-2">
                  {t('duration_minutes')}
                </label>
                <input
                  type="number"
                  value={formData.duration_minutes}
                  onChange={(e) => setFormData({ ...formData, duration_minutes: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-navy-900/50 border border-navy-600 rounded-lg text-white placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-navy-500"
                  min="1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-200 mb-2">
                  {t('question_count')}
                </label>
                <input
                  type="number"
                  value={formData.total_questions}
                  onChange={(e) => setFormData({ ...formData, total_questions: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-navy-900/50 border border-navy-600 rounded-lg text-white placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-navy-500"
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-navy-600 hover:bg-navy-500 text-white px-4 py-2 rounded-lg transition-colors"
              >
                {t('save')}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-navy-700 hover:bg-navy-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                {t('cancel')}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams.map((exam) => (
          <div
            key={exam.id}
            className="bg-navy-800/30 backdrop-blur-sm rounded-xl p-6 border border-navy-700/50 hover:border-navy-600/70 transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-navy-500 to-navy-700 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{exam.title}</h3>
                  {exam.category_name && (
                    <p className="text-navy-400 text-sm">{getTranslatedCategoryName(exam.category_name, t)}</p>
                  )}
                </div>
              </div>
            </div>
            
            {exam.description && (
              <p className="text-navy-300 text-sm mb-4 line-clamp-2">
                {exam.description}
              </p>
            )}

            <div className="flex items-center gap-4 mb-4 text-sm text-navy-400">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {exam.duration_minutes} {t('minute')}
              </div>
              <div className="flex items-center gap-1">
                <BarChart3 className="w-4 h-4" />
                {exam.total_questions} {t('question_singular')}
              </div>
            </div>
            
            <button
              onClick={() => startExam(exam.id)}
              className="w-full bg-gradient-to-r from-navy-600 to-navy-500 hover:from-navy-500 hover:to-navy-400 text-white px-4 py-2 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" />
              {t('start_exam')}
            </button>
          </div>
        ))}
      </div>

      {exams.length === 0 && !showForm && (
        <div className="text-center py-12">
          <Target className="w-16 h-16 text-navy-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-navy-300 mb-2">{t('no_exams')}</h3>
          <p className="text-navy-500 mb-6">{t('no_exams_description')}</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-navy-600 hover:bg-navy-500 text-white px-6 py-3 rounded-lg transition-colors"
          >
            {t('create_first_exam')}
          </button>
        </div>
      )}
    </div>
  );
}
