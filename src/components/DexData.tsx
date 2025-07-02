// components/DexData.tsx

import React, { useEffect, useState } from 'react';

interface DexDataProps {
  contractAddress: string;
  network: string;
}

interface DexPairData {
  priceUsd: string;
  priceChange: {
    h1: number;
    h24: number;
    h7?: number;
  };
  marketCap: number;
  volume: {
    h24: number;
  };
  chartImg: string;
}

const DexData: React.FC<DexDataProps> = ({ contractAddress, network }) => {
  const [dexData, setDexData] = useState<DexPairData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://api.dexscreener.com/latest/dex/search?q=${contractAddress}`);
        const data = await response.json();

        if (data.pairs && data.pairs.length > 0) {
          const pair = data.pairs[0];

          const result: DexPairData = {
            priceUsd: pair.priceUsd,
            priceChange: {
              h1: pair.priceChange?.h1 || 0,
              h24: pair.priceChange?.h24 || 0,
              h7: pair.priceChange?.h7 || 0,
            },
            marketCap: pair.marketCap || 0,
            volume: {
              h24: pair.volume?.h24 || 0
            },
            chartImg: pair.info?.imageUrl || ''
          };

          setDexData(result);
        } else {
          setError('DEX data not found.');
        }
      } catch (err) {
        console.error('Error fetching DEX data:', err);
        setError('Failed to fetch DEX data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [contractAddress]);

  if (loading) return <div className="text-sm text-slate-500">Loading DEX data...</div>;
  if (error) return <div className="text-sm text-red-500">{error}</div>;
  if (!dexData) return null;

  return (
    <div>
      <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">
        DEX Market Data
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm text-slate-700 dark:text-slate-200">
        <div><strong>Price:</strong> ${parseFloat(dexData.priceUsd).toFixed(6)}</div>
        <div><strong>Market Cap:</strong> ${dexData.marketCap.toLocaleString()}</div>
        <div><strong>24h Volume:</strong> ${dexData.volume.h24.toLocaleString()}</div>
        <div><strong>1h Change:</strong> {dexData.priceChange.h1.toFixed(2)}%</div>
        <div><strong>24h Change:</strong> {dexData.priceChange.h24.toFixed(2)}%</div>
        <div><strong>7d Change:</strong> {dexData.priceChange.h7?.toFixed(2) || '-'}%</div>
      </div>
      {dexData.chartImg && (
        <img src={dexData.chartImg} alt="7d chart" className="mt-4 max-w-full h-24" />
      )}
    </div>
  );
};

export default DexData;
