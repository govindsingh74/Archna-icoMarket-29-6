import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface PumpFunToken {
  tokenName: string;
  tokenSymbol: string;
  tokenAddress: string;
  creator: string;
  marketCapUsd: number;
  volumeUsd: number;
  price: number;
}

const PumpFunIndexPage: React.FC = () => {
  const [tokens, setTokens] = useState<PumpFunToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  const fetchPumpFunData = async () => {
    try {
      const response = await fetch('https://pump.fun/api/tokens');
      const tokens = await response.json();

      const formatted = tokens
        .filter((t: { volume: number }) => t.volume > 1000)
        .map((token: {
          name: string;
          symbol: string;
          address: string;
          creator: string;
          marketCap: number;
          volume: number;
          price: number;
        }) => ({
          tokenName: token.name,
          tokenSymbol: token.symbol,
          tokenAddress: token.address,
          creator: token.creator,
          marketCapUsd: token.marketCap,
          volumeUsd: token.volume,
          price: token.price,
        }));

      setTokens(formatted);
    } catch (err) {
      console.error("Error fetching Pump.fun data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    setCurrentPage(1);
    fetchPumpFunData();
  }, []);

  const totalPages = Math.ceil(tokens.length / itemsPerPage);
  const paginatedTokens = tokens.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    } else if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      <Header />
      <main className="pt-16 pb-10 px-4 max-w-7xl mx-auto">
        <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-800 dark:via-blue-900 dark:to-slate-900 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 dark:text-white mb-4">
                Pump.fun Token Index
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                Live bonding curve token data from the Pump.fun ecosystem. Track trending tokens and market dynamics in real-time.
              </p>
            </div>
          </div>
        </section>

        <div className="flex flex-wrap justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-slate-800 dark:text-white">Trending Tokens</h2>
          <div className="flex gap-2 items-center">
            <label className="text-slate-700 dark:text-slate-200 text-sm">Show:</label>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="rounded border px-2 py-1 dark:bg-slate-800 dark:text-white"
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={75}>75</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>

        {loading ? (
          <p className="text-center text-slate-500 dark:text-slate-300">Loading...</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-slate-700 dark:text-slate-300">
                <thead className="bg-slate-200 dark:bg-slate-700">
                  <tr>
                    <th className="p-3 text-left">#</th>
                    <th className="p-3 text-left">Token</th>
                    <th className="p-3 text-left">Creator</th>
                    <th className="p-3 text-right">Price</th>
                    <th className="p-3 text-right">24h Volume</th>
                    <th className="p-3 text-right">Market Cap</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTokens.map((pair, i) => (
                    <tr key={pair.tokenAddress} className="border-t border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800">
                      <td className="p-3">{(currentPage - 1) * itemsPerPage + i + 1}</td>
                      <td className="p-3 font-medium text-slate-900 dark:text-white">
                        <a href={`https://pump.fun/${pair.tokenAddress}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                          {pair.tokenName} ({pair.tokenSymbol})
                        </a>
                      </td>
                      <td className="p-3">{pair.creator}</td>
                      <td className="p-3 text-right">${Number(pair.price).toFixed(6)}</td>
                      <td className="p-3 text-right">${Number(pair.volumeUsd).toLocaleString()}</td>
                      <td className="p-3 text-right">${Number(pair.marketCapUsd).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center mt-6 text-sm text-slate-600 dark:text-slate-300">
              <button
                onClick={() => handlePageChange('prev')}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded bg-slate-200 dark:bg-slate-700 disabled:opacity-50"
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange('next')}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded bg-slate-200 dark:bg-slate-700 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default PumpFunIndexPage;
