'use client';

const Notify = () => {
  const handleScrape = async () => {
    console.log('リクエスト');
    const res = await fetch('/api/push/send');
    const data = await res.json();
    console.log(data);
  };

  return (
    <div>
      <button
        onClick={handleScrape}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        テスト通知
      </button>
    </div>
  );
};

export default Notify;
