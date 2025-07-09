import { CategoryItem } from '@/lib/json/categories';

interface DynamicSelectProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: CategoryItem[];
  placeholder?: string;
  className?: string;
}

// 再利用可能なセレクトコンポーネント
export const DynamicSelect: React.FC<DynamicSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = '選択してください',
  className = 'border p-2 w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500',
}) => {
  return (
    <select value={value} onChange={onChange} className={className}>
      <option value="">{placeholder}</option>
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.name}
        </option>
      ))}
    </select>
  );
};
