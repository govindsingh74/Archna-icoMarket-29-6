import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowDownUp, Wallet, ExternalLink, Info, Shield, Zap, Copy, CheckCircle, AlertCircle } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Add global type for window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

// Contract ABI for the ICO
export const ICO_ABI = [
  {
    inputs: [],
    name: "buyTokens",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  }
];

const BuyTDEXPage: React.FC = () => {
  const [inputAmount, setInputAmount] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');

  const ICO_ADDRESS = "0xceae41Fa85BA89A9cc591d1C566aA53775047A8d";
  const TOKEN_ADDRESS = "0x12bEB562542cbFe1b266dF7A5e6c70ea5Bc6aFB5";
  const CONVERSION_RATE = 18;

  const calculatedTDEX = Number(inputAmount) * CONVERSION_RATE;

  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setIsConnected(true);
          setWalletAddress(accounts[0]);
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      setError('Please install MetaMask to continue');
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setIsConnected(true);
      setWalletAddress(accounts[0]);
      setError('');
    } catch (error) {
      setError('Failed to connect wallet');
    }
  };

  const buyTDEX = async () => {
    if (!inputAmount || Number(inputAmount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!isConnected) {
      setError('Please connect your wallet first');
      return;
    }

    setIsLoading(true);
    setError('');
    setTxHash('');

    try {
      // Dynamic import of ethers
      const { ethers } = await import('ethers');
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(ICO_ADDRESS, ICO_ABI, signer);

      const valueInWei = ethers.parseEther(inputAmount.toString());

      const tx = await contract.buyTokens({ value: valueInWei });
      setTxHash(tx.hash);
      
      await tx.wait();
      setInputAmount('');
      setError('');
    } catch (err: any) {
      console.error('Transaction failed:', err);
      setError(err.message || 'Transaction failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <Header />
      
      <main className="pt-16">
        {/* Header Section */}
        <section className="py-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 mb-6">
              <button 
                onClick={() => window.history.back()}
                className="p-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Buy TDEX Tokens</h1>
            </div>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl">
              Purchase TDEX tokens directly through our ICO contract. Get 18 TDEX for every 1 POL (MATIC) you invest.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              {/* Swap Interface */}
              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Swap Interface</h2>
                    {isConnected && (
                      <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                        <CheckCircle className="w-4 h-4" />
                        <span>Connected: {formatAddress(walletAddress)}</span>
                      </div>
                    )}
                  </div>

                  {/* From Token */}
                  <div className="space-y-4">
                    <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-slate-600 dark:text-slate-400">From</span>
                        <span className="text-sm text-slate-600 dark:text-slate-400">Balance: --</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <input
                          type="number"
                          placeholder="0.0"
                          value={inputAmount}
                          onChange={(e) => setInputAmount(e.target.value)}
                          className="flex-1 text-2xl font-semibold bg-transparent text-slate-800 dark:text-white placeholder-slate-400 outline-none"
                        />
                        <div className="flex items-center gap-2 bg-white dark:bg-slate-600 rounded-lg px-3 py-2">
                          <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-white">P</span>
                          </div>
                          <span className="font-semibold text-slate-800 dark:text-white">POL</span>
                        </div>
                      </div>
                    </div>

                    {/* Swap Arrow */}
                    <div className="flex justify-center">
                      <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-full">
                        <ArrowDownUp className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                      </div>
                    </div>

                    {/* To Token */}
                    <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-slate-600 dark:text-slate-400">To</span>
                        <span className="text-sm text-slate-600 dark:text-slate-400">You will receive</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex-1 text-2xl font-semibold text-slate-800 dark:text-white">
                          {calculatedTDEX.toLocaleString() || '0.0'}
                        </div>
                        <div className="flex items-center gap-2 bg-white dark:bg-slate-600 rounded-lg px-3 py-2">
                          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-white">T</span>
                          </div>
                          <span className="font-semibold text-slate-800 dark:text-white">TDEX</span>
                        </div>
                      </div>
                    </div>

                    {/* Conversion Rate */}
                    <div className="bg-blue-50 dark:bg-blue-500/10 rounded-lg p-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">Exchange Rate</span>
                        <span className="font-semibold text-slate-800 dark:text-white">1 POL = 18 TDEX</span>
                      </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                      <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                          <AlertCircle className="w-4 h-4" />
                          <span className="text-sm">{error}</span>
                        </div>
                      </div>
                    )}

                    {/* Success Message */}
                    {txHash && (
                      <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm">Transaction successful!</span>
                        </div>
                        <a
                          href={`https://polygonscan.com/tx/${txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 mt-1"
                        >
                          View on PolygonScan <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}

                    {/* Action Button */}
                    {!isConnected ? (
                      <button
                        onClick={connectWallet}
                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        <Wallet className="w-5 h-5" />
                        Connect Wallet
                      </button>
                    ) : (
                      <button
                        onClick={buyTDEX}
                        disabled={isLoading || !inputAmount || Number(inputAmount) <= 0}
                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        {isLoading ? 'Processing...' : 'Buy TDEX'}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Token Information */}
              <div className="space-y-6">
                {/* Contract Addresses */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Contract Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-slate-600 dark:text-slate-400 mb-1 block">ICO Contract Address</label>
                      <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-700 rounded-lg p-3">
                        <code className="flex-1 text-sm font-mono text-slate-800 dark:text-white break-all">
                          {ICO_ADDRESS}
                        </code>
                        <button
                          onClick={() => copyToClipboard(ICO_ADDRESS, 'ico')}
                          className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                        >
                          {copied === 'ico' ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm text-slate-600 dark:text-slate-400 mb-1 block">Token Contract Address</label>
                      <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-700 rounded-lg p-3">
                        <code className="flex-1 text-sm font-mono text-slate-800 dark:text-white break-all">
                          {TOKEN_ADDRESS}
                        </code>
                        <button
                          onClick={() => copyToClipboard(TOKEN_ADDRESS, 'token')}
                          className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                        >
                          {copied === 'token' ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Token Details */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Token Details</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                        <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Symbol</div>
                        <div className="text-lg font-bold text-slate-800 dark:text-white">TDEX</div>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                        <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Network</div>
                        <div className="text-lg font-bold text-slate-800 dark:text-white">Polygon</div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-500/10 dark:to-purple-500/10 rounded-lg p-4">
                      <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Conversion Rate</div>
                      <div className="text-2xl font-bold text-slate-800 dark:text-white">1 POL = 18 TDEX</div>
                    </div>
                  </div>
                </div>

                {/* Security Features */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Security & Features</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-green-500" />
                      <span className="text-slate-600 dark:text-slate-300">Audited smart contract</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Zap className="w-5 h-5 text-blue-500" />
                      <span className="text-slate-600 dark:text-slate-300">Instant token delivery</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Info className="w-5 h-5 text-purple-500" />
                      <span className="text-slate-600 dark:text-slate-300">No minimum purchase required</span>
                    </div>
                  </div>
                </div>

                {/* Important Notice */}
                <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-amber-800 dark:text-amber-400 mb-2">Important Notice</h3>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    Make sure you're connected to the Polygon network in your wallet. 
                    Tokens will be automatically sent to your wallet after successful transaction confirmation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BuyTDEXPage;