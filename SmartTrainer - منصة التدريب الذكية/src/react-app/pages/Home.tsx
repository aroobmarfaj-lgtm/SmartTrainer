import { useState } from 'react';
import Layout from '@/react-app/components/Layout';
import CategoriesTab from '@/react-app/components/CategoriesTab';
import ExamsTab from '@/react-app/components/ExamsTab';
import QuestionsTab from '@/react-app/components/QuestionsTab';
import ProgressTab from '@/react-app/components/ProgressTab';
import SmartQuestionsTab from '@/react-app/components/SmartQuestionsTab';

export default function Home() {
  const [activeTab, setActiveTab] = useState('categories');

  const renderContent = () => {
    switch (activeTab) {
      case 'categories':
        return <CategoriesTab />;
      case 'exams':
        return <ExamsTab />;
      case 'questions':
        return <QuestionsTab />;
      case 'smart':
        return <SmartQuestionsTab />;
      case 'progress':
        return <ProgressTab />;
      default:
        return null;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </Layout>
  );
}
