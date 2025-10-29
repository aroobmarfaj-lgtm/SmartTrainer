import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

type TranslationKeys = {
  // Navigation
  'nav.categories': string;
  'nav.exams': string;
  'nav.questions': string;
  'nav.progress': string;
  'nav.smart_questions': string;
  
  // General
  'app.title': string;
  'app.description': string;
  'add': string;
  'edit': string;
  'delete': string;
  'save': string;
  'cancel': string;
  'loading': string;
  'success': string;
  'error': string;
  'name': string;
  'description': string;
  'color': string;
  'actions': string;
  
  // Categories
  'categories.title': string;
  'categories.add': string;
  'categories.name': string;
  'categories.description': string;
  'categories.empty.title': string;
  'categories.empty.description': string;
  'categories.add_first': string;
  
  // Questions
  'questions.title': string;
  'questions.add': string;
  'questions.question': string;
  'questions.options': string;
  'questions.correct_answer': string;
  'questions.difficulty': string;
  'questions.explanation': string;
  'questions.category': string;
  'questions.easy': string;
  'questions.medium': string;
  'questions.hard': string;
  
  // Smart Questions
  'smart.title': string;
  'smart.description': string;
  'smart.upload_file': string;
  'smart.enter_text': string;
  'smart.generate': string;
  'smart.num_questions': string;
  'smart.generating': string;
  'smart.select_category': string;
  'smart.file_types': string;
  
  // Exams
  'exams.title': string;
  'exams.add': string;
  'exams.title_field': string;
  'exams.duration': string;
  'exams.total_questions': string;
  'exams.start': string;
  'exams.submit': string;
  'exams.time_remaining': string;
  
  // Progress
  'progress.title': string;
  'progress.total_attempts': string;
  'progress.average_score': string;
  'progress.recent_attempts': string;
  'progress.category_performance': string;
  'progress.score': string;
  'progress.date': string;
  'progress.attempts': string;
  
  // Category translations for seed data
  'category.math': string;
  'category.science': string;
  'category.arabic': string;
  'category.history': string;
  'category.geography': string;
  'category.math.desc': string;
  'category.science.desc': string;
  'category.arabic.desc': string;
  'category.history.desc': string;
  'category.geography.desc': string;
  
  // Additional translations
  'all_categories': string;
  'no_category': string;
  'option': string;
  'add_option': string;
  'difficulty.easy': string;
  'difficulty.medium': string;
  'difficulty.hard': string;
  'explanation_label': string;
  'explanation_placeholder': string;
  'question_placeholder': string;
  'option_placeholder': string;
  'exam_description_placeholder': string;
  'duration_minutes': string;
  'question_count': string;
  'minute': string;
  'question_singular': string;
  'start_exam': string;
  'no_exams': string;
  'no_exams_description': string;
  'create_first_exam': string;
  'no_questions': string;
  'no_questions_description': string;
  'add_first_question': string;
  'no_progress_data': string;
  'no_progress_description': string;
  'your_training_progress': string;
  'overview_stats': string;
  'best_score': string;
  'recent_attempts_title': string;
  'attempts': string;
  'category_performance': string;
  'attempt': string;
  'correct_answer_format': string;
  'generation_settings': string;
  'select_category_optional': string;
  'generated_questions': string;
  'save_all_questions': string;
  'correct_answer_indicator': string;
  'file_upload_error': string;
  'text_required_error': string;
  'generation_error': string;
  'save_success': string;
  'save_error': string;
  'min_two_options': string;
  'type_or_paste_text': string;
};

const translations: Record<Language, TranslationKeys> = {
  ar: {
    // Navigation
    'nav.categories': 'الفئات',
    'nav.exams': 'الاختبارات',
    'nav.questions': 'الأسئلة',
    'nav.progress': 'التقدم',
    'nav.smart_questions': 'الأسئلة الذكية',
    
    // General
    'app.title': 'منصة التدريب الذكية',
    'app.description': 'منصة تدريب متقدمة مع اختبارات تجريبية وتوليد أسئلة ذكية',
    'add': 'إضافة',
    'edit': 'تعديل',
    'delete': 'حذف',
    'save': 'حفظ',
    'cancel': 'إلغاء',
    'loading': 'جاري التحميل...',
    'success': 'تم بنجاح',
    'error': 'حدث خطأ',
    'name': 'الاسم',
    'description': 'الوصف',
    'color': 'اللون',
    'actions': 'الإجراءات',
    
    // Categories
    'categories.title': 'فئات التدريب',
    'categories.add': 'إضافة فئة جديدة',
    'categories.name': 'اسم الفئة',
    'categories.description': 'وصف الفئة (اختياري)',
    'categories.empty.title': 'لا توجد فئات',
    'categories.empty.description': 'ابدأ بإضافة فئات التدريب لتنظيم الاختبارات',
    'categories.add_first': 'إضافة أول فئة',
    
    // Questions
    'questions.title': 'بنك الأسئلة',
    'questions.add': 'إضافة سؤال',
    'questions.question': 'السؤال',
    'questions.options': 'الخيارات',
    'questions.correct_answer': 'الإجابة الصحيحة',
    'questions.difficulty': 'مستوى الصعوبة',
    'questions.explanation': 'التفسير',
    'questions.category': 'الفئة',
    'questions.easy': 'سهل',
    'questions.medium': 'متوسط',
    'questions.hard': 'صعب',
    
    // Smart Questions
    'smart.title': 'توليد الأسئلة الذكية',
    'smart.description': 'ارفق ملف أو أدخل نص لتوليد أسئلة تلقائياً',
    'smart.upload_file': 'رفع ملف',
    'smart.enter_text': 'أو أدخل النص هنا',
    'smart.generate': 'توليد الأسئلة',
    'smart.num_questions': 'عدد الأسئلة',
    'smart.generating': 'جاري توليد الأسئلة...',
    'smart.select_category': 'اختر الفئة',
    'smart.file_types': 'أنواع الملفات المدعومة: PDF, TXT, DOCX',
    
    // Exams
    'exams.title': 'الاختبارات التجريبية',
    'exams.add': 'إنشاء اختبار',
    'exams.title_field': 'عنوان الاختبار',
    'exams.duration': 'المدة (بالدقائق)',
    'exams.total_questions': 'عدد الأسئلة',
    'exams.start': 'بدء الاختبار',
    'exams.submit': 'تسليم الاختبار',
    'exams.time_remaining': 'الوقت المتبقي',
    
    // Progress
    'progress.title': 'تقرير التقدم',
    'progress.total_attempts': 'إجمالي المحاولات',
    'progress.average_score': 'متوسط النتيجة',
    'progress.recent_attempts': 'المحاولات الأخيرة',
    'progress.category_performance': 'أداء الفئات',
    'progress.score': 'النتيجة',
    'progress.date': 'التاريخ',
    'progress.attempts': 'المحاولات',
    
    // Category translations for seed data
    'category.math': 'الرياضيات',
    'category.science': 'العلوم',
    'category.arabic': 'اللغة العربية',
    'category.history': 'التاريخ',
    'category.geography': 'الجغرافيا',
    'category.math.desc': 'أسئلة في الجبر والهندسة والحساب',
    'category.science.desc': 'أسئلة في الفيزياء والكيمياء والأحياء',
    'category.arabic.desc': 'أسئلة في النحو والصرف والأدب',
    'category.history.desc': 'أسئلة في التاريخ الإسلامي والعربي',
    'category.geography.desc': 'أسئلة في جغرافية العالم والوطن العربي',
    
    // Additional translations
    'all_categories': 'جميع الفئات',
    'no_category': 'بدون فئة',
    'option': 'الخيار',
    'add_option': 'إضافة خيار',
    'difficulty.easy': 'سهل',
    'difficulty.medium': 'متوسط',
    'difficulty.hard': 'صعب',
    'explanation_label': 'التفسير (اختياري)',
    'explanation_placeholder': 'تفسير الإجابة الصحيحة',
    'question_placeholder': 'اكتب السؤال هنا',
    'option_placeholder': 'الخيار',
    'exam_description_placeholder': 'وصف الاختبار (اختياري)',
    'duration_minutes': 'المدة (دقيقة)',
    'question_count': 'عدد الأسئلة',
    'minute': 'دقيقة',
    'question_singular': 'سؤال',
    'start_exam': 'بدء الاختبار',
    'no_exams': 'لا توجد اختبارات',
    'no_exams_description': 'ابدأ بإنشاء اختبارات تجريبية لتقييم مهاراتك',
    'create_first_exam': 'إنشاء أول اختبار',
    'no_questions': 'لا توجد أسئلة',
    'no_questions_description': 'ابدأ بإضافة أسئلة لبناء بنك الأسئلة',
    'add_first_question': 'إضافة أول سؤال',
    'no_progress_data': 'لا توجد بيانات تقدم',
    'no_progress_description': 'ابدأ بحل بعض الاختبارات لرؤية تقدمك',
    'your_training_progress': 'تقدمك في التدريب',
    'overview_stats': 'إحصائيات عامة',
    'best_score': 'أفضل نتيجة',
    'recent_attempts_title': 'المحاولات الأخيرة',
    'attempts': 'المحاولات',
    'category_performance': 'الأداء حسب الفئة',
    'attempt': 'محاولة',
    'correct_answer_format': 'الإجابة الصحيحة',
    'generation_settings': 'إعدادات التوليد',
    'select_category_optional': 'اختر فئة (اختياري)',
    'generated_questions': 'الأسئلة المولدة',
    'save_all_questions': 'حفظ جميع الأسئلة',
    'correct_answer_indicator': '(الإجابة الصحيحة)',
    'file_upload_error': 'يرجى رفع ملف أو إدخال نص',
    'text_required_error': 'يرجى إدخال نص أو رفع ملف',
    'generation_error': 'حدث خطأ في توليد الأسئلة',
    'save_success': 'تم حفظ الأسئلة بنجاح',
    'save_error': 'حدث خطأ في حفظ الأسئلة',
    'min_two_options': 'يجب إدخال خيارين على الأقل',
    'type_or_paste_text': 'اكتب أو الصق النص هنا...',
  },
  en: {
    // Navigation
    'nav.categories': 'Categories',
    'nav.exams': 'Exams',
    'nav.questions': 'Questions',
    'nav.progress': 'Progress',
    'nav.smart_questions': 'Smart Questions',
    
    // General
    'app.title': 'Smart Training Platform',
    'app.description': 'Advanced training platform with practice exams and smart question generation',
    'add': 'Add',
    'edit': 'Edit',
    'delete': 'Delete',
    'save': 'Save',
    'cancel': 'Cancel',
    'loading': 'Loading...',
    'success': 'Success',
    'error': 'Error occurred',
    'name': 'Name',
    'description': 'Description',
    'color': 'Color',
    'actions': 'Actions',
    
    // Categories
    'categories.title': 'Training Categories',
    'categories.add': 'Add New Category',
    'categories.name': 'Category Name',
    'categories.description': 'Category Description (optional)',
    'categories.empty.title': 'No Categories',
    'categories.empty.description': 'Start by adding training categories to organize your exams',
    'categories.add_first': 'Add First Category',
    
    // Questions
    'questions.title': 'Question Bank',
    'questions.add': 'Add Question',
    'questions.question': 'Question',
    'questions.options': 'Options',
    'questions.correct_answer': 'Correct Answer',
    'questions.difficulty': 'Difficulty Level',
    'questions.explanation': 'Explanation',
    'questions.category': 'Category',
    'questions.easy': 'Easy',
    'questions.medium': 'Medium',
    'questions.hard': 'Hard',
    
    // Smart Questions
    'smart.title': 'Smart Question Generation',
    'smart.description': 'Upload a file or enter text to automatically generate questions',
    'smart.upload_file': 'Upload File',
    'smart.enter_text': 'Or enter text here',
    'smart.generate': 'Generate Questions',
    'smart.num_questions': 'Number of Questions',
    'smart.generating': 'Generating questions...',
    'smart.select_category': 'Select Category',
    'smart.file_types': 'Supported file types: PDF, TXT, DOCX',
    
    // Exams
    'exams.title': 'Practice Exams',
    'exams.add': 'Create Exam',
    'exams.title_field': 'Exam Title',
    'exams.duration': 'Duration (minutes)',
    'exams.total_questions': 'Number of Questions',
    'exams.start': 'Start Exam',
    'exams.submit': 'Submit Exam',
    'exams.time_remaining': 'Time Remaining',
    
    // Progress
    'progress.title': 'Progress Report',
    'progress.total_attempts': 'Total Attempts',
    'progress.average_score': 'Average Score',
    'progress.recent_attempts': 'Recent Attempts',
    'progress.category_performance': 'Category Performance',
    'progress.score': 'Score',
    'progress.date': 'Date',
    'progress.attempts': 'Attempts',
    
    // Category translations for seed data
    'category.math': 'Mathematics',
    'category.science': 'Science',
    'category.arabic': 'Arabic Language',
    'category.history': 'History',
    'category.geography': 'Geography',
    'category.math.desc': 'Questions in algebra, geometry, and arithmetic',
    'category.science.desc': 'Questions in physics, chemistry, and biology',
    'category.arabic.desc': 'Questions in grammar, morphology, and literature',
    'category.history.desc': 'Questions in Islamic and Arab history',
    'category.geography.desc': 'Questions in world and Arab geography',
    
    // Additional translations
    'all_categories': 'All Categories',
    'no_category': 'No Category',
    'option': 'Option',
    'add_option': 'Add Option',
    'difficulty.easy': 'Easy',
    'difficulty.medium': 'Medium',
    'difficulty.hard': 'Hard',
    'explanation_label': 'Explanation (optional)',
    'explanation_placeholder': 'Explanation of the correct answer',
    'question_placeholder': 'Write the question here',
    'option_placeholder': 'Option',
    'exam_description_placeholder': 'Exam description (optional)',
    'duration_minutes': 'Duration (minutes)',
    'question_count': 'Number of Questions',
    'minute': 'minute',
    'question_singular': 'question',
    'start_exam': 'Start Exam',
    'no_exams': 'No Exams',
    'no_exams_description': 'Start by creating practice exams to assess your skills',
    'create_first_exam': 'Create First Exam',
    'no_questions': 'No Questions',
    'no_questions_description': 'Start by adding questions to build your question bank',
    'add_first_question': 'Add First Question',
    'no_progress_data': 'No Progress Data',
    'no_progress_description': 'Start by taking some exams to see your progress',
    'your_training_progress': 'Your Training Progress',
    'overview_stats': 'Overview Statistics',
    'best_score': 'Best Score',
    'recent_attempts_title': 'Recent Attempts',
    'attempts': 'Attempts',
    'category_performance': 'Category Performance',
    'attempt': 'attempt',
    'correct_answer_format': 'Correct Answer',
    'generation_settings': 'Generation Settings',
    'select_category_optional': 'Select category (optional)',
    'generated_questions': 'Generated Questions',
    'save_all_questions': 'Save All Questions',
    'correct_answer_indicator': '(Correct Answer)',
    'file_upload_error': 'Please upload a file or enter text',
    'text_required_error': 'Please enter text or upload a file',
    'generation_error': 'Error generating questions',
    'save_success': 'Questions saved successfully',
    'save_error': 'Error saving questions',
    'min_two_options': 'At least two options are required',
    'type_or_paste_text': 'Type or paste text here...',
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('ar');

  const t = (key: string): string => {
    return translations[language][key as keyof TranslationKeys] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
