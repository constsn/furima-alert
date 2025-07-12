import { auth } from '@/auth';
import ConditionList from '@/components/conditions/ConditionList';
import Header from '@/components/layout/Header';
import NotificationSettings from '@/components/push/NotificationSettings';

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
