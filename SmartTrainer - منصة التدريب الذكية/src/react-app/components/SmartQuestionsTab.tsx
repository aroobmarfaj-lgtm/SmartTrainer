import { useState, useEffect, useRef } from 'react';
import { Upload, FileText, Loader2, Sparkles, BookOpen } from 'lucide-react';
import { useLanguage } from '@/react-app/contexts/LanguageContext';
import { getTranslatedCategoryName } from '@/react-app/utils/categoryTranslations';

interface Category {
  id: number;
  name: string;
  color?: string;
}

interface GeneratedQuestion {
  question: string;
  options: string[];
  correct_answer: number;
  difficulty: string;
  explanation?: string;
}

export default function SmartQuestionsTab() {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [textContent, setTextContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestion[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [numQuestions, setNumQuestions] = useState(5);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setTextContent(''); // Clear text content when file is selected
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
      setTextContent('');
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const generateQuestions = async () => {
    if (!selectedFile && !textContent.trim()) {
      alert(t('file_upload_error'));
      return;
    }

    setIsGenerating(true);
    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append('file', selectedFile);
      } else {
        formData.append('text', textContent);
      }
      formData.append('num_questions', numQuestions.toString());
      formData.append('language', language);
      if (selectedCategory) {
        formData.append('category_id', selectedCategory.toString());
      }

      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to generate questions');
      }

      const data = await response.json();
      setGeneratedQuestions(data.questions);
    } catch (error) {
      console.error('Error generating questions:', error);
      alert(t('generation_error'));
    } finally {
      setIsGenerating(false);
    }
  };

  const saveQuestions = async () => {
    if (generatedQuestions.length === 0) return;

    try {
      const promises = generatedQuestions.map(question =>
        fetch('/api/questions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...question,
            category_id: selectedCategory,
          }),
        })
      );

      await Promise.all(promises);
      alert(t('save_success'));
      setGeneratedQuestions([]);
      setSelectedFile(null);
      setTextContent('');
    } catch (error) {
      console.error('Error saving questions:', error);
      alert(t('save_error'));
    }
  };

  return (
    <div className={`space-y-8 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {t('smart.title')}
          </h1>
        </div>
        <p className="text-gray-600 text-lg">{t('smart.description')}</p>
      </div>

      {/* Upload Section */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* File Upload */}
        <div className="space-y-6">
          <div
            className="border-2 border-dashed border-indigo-300 rounded-2xl p-8 text-center hover:border-indigo-400 transition-colors cursor-pointer bg-gradient-to-br from-indigo-50 to-purple-50"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept=".pdf,.txt,.docx,.doc"
              className="hidden"
            />
            <Upload className="w-12 h-12 text-indigo-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {t('smart.upload_file')}
            </h3>
            <p className="text-gray-600 mb-4">{t('smart.file_types')}</p>
            {selectedFile && (
              <div className="bg-white rounded-lg p-4 shadow-md">
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-indigo-600" />
                  <span className="font-medium text-gray-800">{selectedFile.name}</span>
                </div>
              </div>
            )}
          </div>

          {/* Text Input */}
          <div className="space-y-4">
            <label className="block text-lg font-semibold text-gray-800">
              {t('smart.enter_text')}
            </label>
            <textarea
              value={textContent}
              onChange={(e) => {
                setTextContent(e.target.value);
                if (e.target.value.trim()) {
                  setSelectedFile(null);
                }
              }}
              className="w-full h-40 p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 resize-none"
              placeholder={t('type_or_paste_text')}
            />
          </div>
        </div>

        {/* Settings */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-indigo-600" />
              {t('generation_settings')}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('smart.select_category')}
                </label>
                <select
                  value={selectedCategory || ''}
                  onChange={(e) => setSelectedCategory(e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                >
                  <option value="">{t('select_category_optional')}</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {getTranslatedCategoryName(category.name, t)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('smart.num_questions')}
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(parseInt(e.target.value) || 5)}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                />
              </div>

              <button
                onClick={generateQuestions}
                disabled={isGenerating || (!selectedFile && !textContent.trim())}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
              >
                {isGenerating ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {t('smart.generating')}
                  </div>
                ) : (
                  t('smart.generate')
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Generated Questions */}
      {generatedQuestions.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">
              {t('generated_questions')}
            </h2>
            <button
              onClick={saveQuestions}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2 px-6 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg"
            >
              {t('save_all_questions')}
            </button>
          </div>

          <div className="space-y-4">
            {generatedQuestions.map((question, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                <div className="mb-4">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex-1">
                      {index + 1}. {question.question}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      question.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                      question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {t(`difficulty.${question.difficulty}`)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {question.options.map((option, optionIndex) => (
                    <div
                      key={optionIndex}
                      className={`p-3 rounded-lg border-2 ${
                        optionIndex === question.correct_answer
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <span className="font-medium">
                        {String.fromCharCode(65 + optionIndex)}. {option}
                      </span>
                      {optionIndex === question.correct_answer && (
                        <span className="text-green-600 text-sm font-medium ml-2">
                          {t('correct_answer_indicator')}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {question.explanation && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800">
                      <strong>{t('questions.explanation')}: </strong>
                      {question.explanation}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
