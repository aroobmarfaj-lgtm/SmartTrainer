import { ReactNode, useEffect } from 'react';
import { Target, BookOpen, FileQuestion, BarChart3, Sparkles, Languages } from 'lucide-react';
import { useLanguage } from '@/react-app/contexts/LanguageContext';

interface LayoutProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Layout({ children, activeTab, onTabChange }: LayoutProps) {
  const { language, setLanguage, t } = useLanguage();
  const isRTL = language === 'ar';

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700&family=Inter:wght@300;400;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    // Update document direction and lang
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    
    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, [language, isRTL]);

  const tabs = [
    { id: 'categories', label: t('nav.categories'), icon: BookOpen },
    { id: 'exams', label: t('nav.exams'), icon: Target },
    { id: 'questions', label: t('nav.questions'), icon: FileQuestion },
    { id: 'smart', label: t('nav.smart_questions'), icon: Sparkles },
    { id: 'progress', label: t('nav.progress'), icon: BarChart3 },
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 ${
      isRTL ? 'font-arabic' : 'font-inter'
    }`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="backdrop-blur-sm bg-navy-900/20 min-h-screen">
        {/* Header */}
        <header className="bg-navy-900/90 backdrop-blur-md border-b border-navy-700/50 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-navy-400 to-navy-600 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                {t('app.title')}
              </h1>
              
              <div className="flex items-center gap-4">
                <div className="text-navy-300 text-sm hidden md:block">
                  {t('app.description')}
                </div>
                
                {/* Language Switcher */}
                <div className="flex items-center gap-2 bg-navy-800/50 rounded-lg p-1">
                  <button
                    onClick={() => setLanguage('ar')}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-1 ${
                      language === 'ar'
                        ? 'bg-navy-600 text-white shadow-md'
                        : 'text-navy-300 hover:text-white hover:bg-navy-700'
                    }`}
                  >
                    <Languages className="w-4 h-4" />
                    العربية
                  </button>
                  <button
                    onClick={() => setLanguage('en')}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-1 ${
                      language === 'en'
                        ? 'bg-navy-600 text-white shadow-md'
                        : 'text-navy-300 hover:text-white hover:bg-navy-700'
                    }`}
                  >
                    <Languages className="w-4 h-4" />
                    EN
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation */}
        <nav className="bg-navy-800/50 backdrop-blur-sm border-b border-navy-700/30">
          <div className="max-w-7xl mx-auto px-4">
            <div className={`flex overflow-x-auto ${isRTL ? 'space-x-reverse space-x-8' : 'space-x-8'}`}>
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`px-6 py-4 font-medium text-sm transition-all duration-200 border-b-2 flex items-center gap-2 whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'text-navy-200 border-navy-400 bg-navy-700/30'
                        : 'text-navy-400 border-transparent hover:text-navy-300 hover:border-navy-500'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
