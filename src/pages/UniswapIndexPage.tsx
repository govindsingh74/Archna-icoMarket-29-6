import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const UniswapIndexPage: React.FC = () => {
  const [tokens, setTokens] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState<'volumeUSD' | 'reserveUSD'>('volumeUSD');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const apiKey = import.meta.env.VITE_GRAPH_API_KEY;

  const fetchUniswapData = async () => {
    const query = {
      query: `
        {
          pairs(first: 1000, orderBy: ${sortKey}, orderDirection: desc) {
            id
            token0 { symbol name id }
            token1 { symbol name id }
            reserveUSD
            volumeUSD
            token0Price
          }
        }
      `
    };

    try {
      const response = await fetch(`https://gateway.thegraph.com/api/${apiKey}/subgraphs/id/A3Np3RQbaBA6oKJgiwDJeo5T3zrYfGHPWFYayMwtNDum`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(query)
      });

      const json = await response.json();
      if (!json?.data?.pairs) throw new Error("No data received");

      const formatted = json.data.pairs.map((pair: any) => ({
        pairId: pair.id,
        tokenSymbol: pair.token1.symbol,
        tokenName: pair.token1.name,
        tokenAddress: pair.token1.id,
        baseSymbol: pair.token0.symbol,
        baseName: pair.token0.name,
        baseAddress: pair.token0.id,
        priceBase: (1 / Number(pair.token0Price)).toString(),
        volumeUsd: pair.volumeUSD,
        marketCapUsd: pair.reserveUSD,
      }));

      const filtered = formatted.filter((pair:any) => Number(pair.volumeUsd) >= 100000);
      setTokens(filtered);
    } catch (err) {
      console.error("Error fetching Uniswap data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    setCurrentPage(1);
    fetchUniswapData();
  }, [sortKey]);

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
                Uniswap Index
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                Live cryptocurrency pair and market data by Uniswap. 
                Track real-time token performance and market trends.
              </p>
            </div>
          </div>
        </section>

        <div className="flex flex-wrap justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-slate-800 dark:text-white">Top 1000 Pairs</h2>
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
            <button
              onClick={() => setSortKey('volumeUSD')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
            >
              Sort by Market Cap
            </button>
            <button
              onClick={() => setSortKey('reserveUSD')}
              className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm"
            >
              Sort by Volume
            </button>
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
                    <th className="p-3 text-left">Base Pair</th>
                    <th className="p-3 text-left">Token</th>
                    <th className="p-3 text-right">Price (pair)</th>
                    <th className="p-3 text-right">24h Volume</th>
                    <th className="p-3 text-right">Market Cap</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTokens.map((pair, i) => (
                    <tr key={pair.pairId} className="border-t border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800">
                        <td className="p-3">{i + 1}</td>
                        <td className="p-3 font-medium text-slate-900 dark:text-white">{ pair.baseName }<span className="text-slate-500">({pair.baseSymbol})</span></td>
                        <td className="p-3 font-medium text-slate-900 dark:text-white">
                            {pair.tokenName} <span className="text-slate-500">({pair.tokenSymbol})</span>
                        </td>
                        <td className="p-3 text-right">
                            {parseFloat(pair.priceBase).toFixed(6)} {pair.tokenSymbol}
                        </td>
                        <td className="p-3 text-right">${Number(pair.marketCapUsd).toLocaleString()}</td>
                        <td className="p-3 text-right">${Number(pair.volumeUsd).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
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

export default UniswapIndexPage;
