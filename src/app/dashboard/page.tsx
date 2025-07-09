import ConditionList from '@/components/ConditionList';
import Header from '@/components/Header';
import NotificationSettings from '@/components/NotificationSettings';
import Notify from '@/components/Notify';
import Scrape from '@/components/Scrape';

export default function Page() {
  return (
    <div>
      <Header />
      <ConditionList />
      <Scrape />
      <NotificationSettings />
      <Notify />
    </div>
  );
}
