'use client';

const Scrape = () => {
  const handleScrape = async () => {
    console.log('リクエスト');
    const res = await fetch('/api/scrape');
    const data = await res.json();
    console.log(data);
  };

  return (
    <div>
      <button
        onClick={handleScrape}
        className=" bg-gray-950 text-white px-4 py-2 rounded"
      >
        📝 スクレイピングテスト
      </button>
    </div>
  );
};

export default Scrape;
