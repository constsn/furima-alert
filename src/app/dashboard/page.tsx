import { auth } from '@/auth';
import ConditionList from '@/components/ConditionList';
import Header from '@/components/Header';
import NotificationSettings from '@/components/NotificationSettings';

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
      <NotificationSettings />
    </div>
  );
}
