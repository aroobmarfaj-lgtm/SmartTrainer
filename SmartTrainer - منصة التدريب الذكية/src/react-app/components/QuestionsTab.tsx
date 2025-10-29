import { useState, useEffect } from 'react';
import { Plus, FileQuestion, Trash2, Check, X } from 'lucide-react';
import { Question, Category, CreateQuestion } from '@/shared/types';
import { useLanguage } from '@/react-app/contexts/LanguageContext';
import { getTranslatedCategoryName } from '@/react-app/utils/categoryTranslations';

export default function QuestionsTab() {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  const [questions, setQuestions] = useState<Question[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<CreateQuestion>({ 
    question: '', 
    options: ['', ''],
    correct_answer: 0,
    difficulty: 'medium'
  });

  useEffect(() => {
    fetchQuestions();
    fetchCategories();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch('/api/questions');
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error('Error fetching questions:', error);
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
    // Filter out empty options
    const filteredOptions = formData.options.filter(opt => opt.trim() !== '');
    if (filteredOptions.length < 2) {
      alert(t('min_two_options'));
      return;
    }

    try {
      const response = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          options: filteredOptions,
          correct_answer: Math.min(formData.correct_answer, filteredOptions.length - 1)
        }),
      });
      
      if (response.ok) {
        setFormData({ question: '', options: ['', ''], correct_answer: 0, difficulty: 'medium' });
        setShowForm(false);
        fetchQuestions();
      }
    } catch (error) {
      console.error('Error creating question:', error);
    }
  };

  const deleteQuestion = async (id: number) => {
    try {
      await fetch(`/api/questions/${id}`, { method: 'DELETE' });
      fetchQuestions();
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  const addOption = () => {
    setFormData({
      ...formData,
      options: [...formData.options, '']
    });
  };

  const removeOption = (index: number) => {
    if (formData.options.length > 2) {
      const newOptions = formData.options.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        options: newOptions,
        correct_answer: formData.correct_answer >= newOptions.length ? 0 : formData.correct_answer
      });
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({
      ...formData,
      options: newOptions
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'hard': return 'text-red-400';
      default: return 'text-navy-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">{t('questions.title')}</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-navy-600 hover:bg-navy-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          {t('questions.add')}
        </button>
      </div>

      {showForm && (
        <div className="bg-navy-800/50 backdrop-blur-sm rounded-xl p-6 border border-navy-700/50">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-navy-200 mb-2">
                {t('questions.question')}
              </label>
              <textarea
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                className="w-full px-3 py-2 bg-navy-900/50 border border-navy-600 rounded-lg text-white placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-navy-500"
                placeholder={t('question_placeholder')}
                rows={3}
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
                <option value="">{t('no_category')}</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {getTranslatedCategoryName(category.name, t)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-navy-200 mb-2">
                {t('questions.options')}
              </label>
              <div className="space-y-2">
                {formData.options.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correct_answer"
                      checked={formData.correct_answer === index}
                      onChange={() => setFormData({ ...formData, correct_answer: index })}
                      className="text-navy-500"
                    />
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      className="flex-1 px-3 py-2 bg-navy-900/50 border border-navy-600 rounded-lg text-white placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-navy-500"
                      placeholder={`${t('option_placeholder')} ${index + 1}`}
                      required
                    />
                    {formData.options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(index)}
                        className="text-red-400 hover:text-red-300 p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addOption}
                  className="text-navy-400 hover:text-navy-300 text-sm flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  {t('add_option')}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-navy-200 mb-2">
                {t('questions.difficulty')}
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as 'easy' | 'medium' | 'hard' })}
                className="w-full px-3 py-2 bg-navy-900/50 border border-navy-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-navy-500"
              >
                <option value="easy">{t('difficulty.easy')}</option>
                <option value="medium">{t('difficulty.medium')}</option>
                <option value="hard">{t('difficulty.hard')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-navy-200 mb-2">
                {t('explanation_label')}
              </label>
              <textarea
                value={formData.explanation}
                onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                className="w-full px-3 py-2 bg-navy-900/50 border border-navy-600 rounded-lg text-white placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-navy-500"
                placeholder={t('explanation_placeholder')}
                rows={2}
              />
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

      <div className="space-y-4">
        {questions.map((question) => (
          <div
            key={question.id}
            className="bg-navy-800/30 backdrop-blur-sm rounded-xl p-6 border border-navy-700/50 hover:border-navy-600/70 transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-10 h-10 bg-navy-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileQuestion className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-2">{question.question}</h3>
                  <div className="space-y-1 mb-3">
                    {question.options.map((option, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        {index === question.correct_answer ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-navy-500"></div>
                        )}
                        <span className={index === question.correct_answer ? 'text-green-300' : 'text-navy-300'}>
                          {option}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <span className={`font-medium ${getDifficultyColor(question.difficulty)}`}>
                      {t(`difficulty.${question.difficulty}`)}
                    </span>
                    <span className="text-navy-500">
                      {new Date(question.created_at).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => deleteQuestion(question.id)}
                className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-all p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            {question.explanation && (
              <div className="mt-3 p-3 bg-navy-900/30 rounded-lg">
                <p className="text-navy-300 text-sm">
                  <strong>{t('questions.explanation')}:</strong> {question.explanation}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {questions.length === 0 && !showForm && (
        <div className="text-center py-12">
          <FileQuestion className="w-16 h-16 text-navy-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-navy-300 mb-2">{t('no_questions')}</h3>
          <p className="text-navy-500 mb-6">{t('no_questions_description')}</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-navy-600 hover:bg-navy-500 text-white px-6 py-3 rounded-lg transition-colors"
          >
            {t('add_first_question')}
          </button>
        </div>
      )}
    </div>
  );
}
