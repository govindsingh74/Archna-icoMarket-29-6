import React, { useEffect, useState } from 'react';

interface DexDataProps {
  contractAddress: string;
  network: string;
}

const DexData: React.FC<DexDataProps> = ({ contractAddress, network }) => {
  const [dexData, setDexData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDexData = async () => {
      try {
        const chain = network.toLowerCase(); // example: "polygon", "bsc", "ethereum"
        const url = `https://api.dexscreener.com/latest/dex/pairs/${chain}/${contractAddress}`;
        const res = await fetch(url);
        const json = await res.json();
        if (json?.pair) {
          setDexData(json.pair);
        } else {
          setDexData(null);
        }
      } catch (err) {
        console.error('DexScreener API error:', err);
        setDexData(null);
      } finally {
        setLoading(false);
      }
    };

    if (contractAddress && network) fetchDexData();
  }, [contractAddress, network]);

  if (loading) {
    return <div className="text-slate-500 dark:text-slate-300">Loading DEX data...</div>;
  }

  if (!dexData) {
    return <div className="text-red-500 dark:text-red-400 font-medium">No DEX data available</div>;
  }

  return (
    <div className="space-y-3">
      <div className="text-xl font-bold text-slate-800 dark:text-white">DEX Market Data</div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
        <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
          <div className="text-slate-500 dark:text-slate-300">Price</div>
          <div className="font-semibold text-slate-800 dark:text-white">${Number(dexData.priceUsd).toFixed(6)}</div>
        </div>
        <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
          <div className="text-slate-500 dark:text-slate-300">24h Volume</div>
          <div className="font-semibold text-slate-800 dark:text-white">${dexData.volume.h24.toLocaleString()}</div>
        </div>
        <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
          <div className="text-slate-500 dark:text-slate-300">Liquidity (USD)</div>
          <div className="font-semibold text-slate-800 dark:text-white">${dexData.liquidity.usd.toLocaleString()}</div>
        </div>
        <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
          <div className="text-slate-500 dark:text-slate-300">FDV</div>
          <div className="font-semibold text-slate-800 dark:text-white">${dexData.fdv?.toLocaleString() || 'N/A'}</div>
        </div>
        <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
          <div className="text-slate-500 dark:text-slate-300">Pair Created</div>
          <div className="font-semibold text-slate-800 dark:text-white">{new Date(dexData.pairCreatedAt).toLocaleDateString()}</div>
        </div>
      </div>
      <a 
        href={dexData.url} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="inline-block mt-2 text-blue-600 dark:text-blue-400 underline"
      >
        View on DexScreener ↗
      </a>
    </div>
  );
};

export default DexData;
