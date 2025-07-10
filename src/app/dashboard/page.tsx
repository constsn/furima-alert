import { auth } from '@/auth';
import ConditionList from '@/components/ConditionList';
import Header from '@/components/Header';
import NotificationSettings from '@/components/NotificationSettings';
import Notify from '@/components/Notify';
import Scrape from '@/components/Scrape';

export default async function Page() {
  const session = await auth();

  if (!session || !session.user?.id) {
    return <p>認証エラー</p>;
  }

  console.log(session);

  return (
    <div>
      <Header />
      <ConditionList userId={session.user.id} />
      <Scrape />
      <NotificationSettings />
      <Notify />
    </div>
  );
}
