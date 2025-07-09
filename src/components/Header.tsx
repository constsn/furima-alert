import { Bell } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="px-4 py-3">
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">フリマ通知</h1>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
