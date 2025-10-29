import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Target, Clock, Award, Calendar } from 'lucide-react';
import { useLanguage } from '@/react-app/contexts/LanguageContext';
import { getTranslatedCategoryName } from '@/react-app/utils/categoryTranslations';

interface ProgressData {
  total_attempts: number;
  average_score: number;
  recent_attempts: Array<{
    id: number;
    score: number;
    correct_answers: number;
    total_questions: number;
    time_taken_minutes: number;
    completed_at: string;
    exam_title: string;
    category_name?: string;
  }>;
  category_stats: Array<{
    name: string;
    avg_score: number;
    attempts: number;
  }>;
}

export default function ProgressTab() {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const response = await fetch('/api/progress');
      const data = await response.json();
      setProgressData(data);
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-400"></div>
      </div>
    );
  }

  if (!progressData || progressData.total_attempts === 0) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="w-16 h-16 text-navy-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-navy-300 mb-2">{t('no_progress_data')}</h3>
        <p className="text-navy-500 mb-6">{t('no_progress_description')}</p>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-400/20';
    if (score >= 60) return 'bg-yellow-400/20';
    return 'bg-red-400/20';
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">{t('your_training_progress')}</h2>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-navy-800/30 backdrop-blur-sm rounded-xl p-6 border border-navy-700/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold text-white">{t('progress.total_attempts')}</h3>
          </div>
          <p className="text-2xl font-bold text-blue-400">{progressData.total_attempts}</p>
        </div>

        <div className="bg-navy-800/30 backdrop-blur-sm rounded-xl p-6 border border-navy-700/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold text-white">{t('progress.average_score')}</h3>
          </div>
          <p className={`text-2xl font-bold ${getScoreColor(progressData.average_score)}`}>
            {progressData.average_score.toFixed(1)}%
          </p>
        </div>

        <div className="bg-navy-800/30 backdrop-blur-sm rounded-xl p-6 border border-navy-700/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold text-white">{t('best_score')}</h3>
          </div>
          <p className="text-2xl font-bold text-purple-400">
            {Math.max(...progressData.recent_attempts.map(a => a.score)).toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Category Performance */}
      {progressData.category_stats.length > 0 && (
        <div className="bg-navy-800/30 backdrop-blur-sm rounded-xl p-6 border border-navy-700/50">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            {t('category_performance')}
          </h3>
          <div className="space-y-3">
            {progressData.category_stats
              .filter(stat => stat.attempts > 0)
              .map((stat, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-navy-900/30 rounded-lg">
                <div>
                  <h4 className="font-medium text-white">{getTranslatedCategoryName(stat.name, t)}</h4>
                  <p className="text-sm text-navy-400">{stat.attempts} {t('attempt')}</p>
                </div>
                <div className={`px-3 py-1 rounded-full ${getScoreBg(stat.avg_score)}`}>
                  <span className={`font-semibold ${getScoreColor(stat.avg_score)}`}>
                    {stat.avg_score.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Attempts */}
      <div className="bg-navy-800/30 backdrop-blur-sm rounded-xl p-6 border border-navy-700/50">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          {t('recent_attempts_title')}
        </h3>
        <div className="space-y-3">
          {progressData.recent_attempts.slice(0, 10).map((attempt) => (
            <div key={attempt.id} className="flex items-center justify-between p-4 bg-navy-900/30 rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium text-white">{attempt.exam_title}</h4>
                <div className="flex items-center gap-4 mt-1 text-sm text-navy-400">
                  {attempt.category_name && (
                    <span>{getTranslatedCategoryName(attempt.category_name, t)}</span>
                  )}
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {attempt.time_taken_minutes} {t('minute')}
                  </span>
                  <span>
                    {new Date(attempt.completed_at).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}
                  </span>
                </div>
              </div>
              <div className="text-left">
                <div className={`text-lg font-bold ${getScoreColor(attempt.score)}`}>
                  {attempt.score.toFixed(1)}%
                </div>
                <div className="text-sm text-navy-400">
                  {attempt.correct_answers}/{attempt.total_questions}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
