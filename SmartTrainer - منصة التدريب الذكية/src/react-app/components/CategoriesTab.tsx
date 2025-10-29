import { useState, useEffect } from 'react';
import { Plus, BookOpen, Trash2 } from 'lucide-react';
import { Category, CreateCategory } from '@/shared/types';
import { useLanguage } from '@/react-app/contexts/LanguageContext';
import { getTranslatedCategoryName, getTranslatedCategoryDescription } from '@/react-app/utils/categoryTranslations';

export default function CategoriesTab() {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<CreateCategory>({ name: '', description: '', color: '#3730a3' });

  useEffect(() => {
    fetchCategories();
  }, []);

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
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        setFormData({ name: '', description: '', color: '#3730a3' });
        setShowForm(false);
        fetchCategories();
      }
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  const deleteCategory = async (id: number) => {
    try {
      await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const colors = [
    '#3730a3', '#dc2626', '#059669', '#d97706',
    '#7c3aed', '#0891b2', '#be185d', '#374151'
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">{t('categories.title')}</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-navy-600 hover:bg-navy-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          {t('categories.add')}
        </button>
      </div>

      {showForm && (
        <div className="bg-navy-800/50 backdrop-blur-sm rounded-xl p-6 border border-navy-700/50">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-navy-200 mb-2">
                {t('categories.name')}
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-navy-900/50 border border-navy-600 rounded-lg text-white placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-navy-500"
                placeholder={t('categories.name')}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-navy-200 mb-2">
                {t('description')}
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 bg-navy-900/50 border border-navy-600 rounded-lg text-white placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-navy-500"
                placeholder={t('categories.description')}
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-navy-200 mb-2">
                {t('color')}
              </label>
              <div className="flex gap-2 flex-wrap">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, color })}
                    className={`w-8 h-8 rounded-full transition-all ${
                      formData.color === color ? 'ring-2 ring-white scale-110' : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
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
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-navy-800/30 backdrop-blur-sm rounded-xl p-6 border border-navy-700/50 hover:border-navy-600/70 transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: category.color || '#3730a3' }}
                >
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{getTranslatedCategoryName(category.name, t)}</h3>
                  {category.description && (
                    <p className="text-navy-400 text-sm mt-1">{getTranslatedCategoryDescription(category.description, t)}</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => deleteCategory(category.id)}
                className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-all p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            <div className="text-xs text-navy-500">
              {t('progress.date')}: {new Date(category.created_at).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && !showForm && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-navy-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-navy-300 mb-2">{t('categories.empty.title')}</h3>
          <p className="text-navy-500 mb-6">{t('categories.empty.description')}</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-navy-600 hover:bg-navy-500 text-white px-6 py-3 rounded-lg transition-colors"
          >
            {t('categories.add_first')}
          </button>
        </div>
      )}
    </div>
  );
}
