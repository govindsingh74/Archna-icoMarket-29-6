import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Wallet, 
  ExternalLink, 
  Info, 
  Shield, 
  Zap, 
  Copy, 
  CheckCircle, 
  AlertCircle,
  Gift,
  Calendar,
  Users,
  Clock
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ethers } from 'ethers';

// Add global type for window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

// Contract ABI for the Airdrop
export const AIRDROP_ABI = [
  {
    inputs: [],
    name: "claimAirdrop",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address"
      }
    ],
    name: "getClaimDetails",
    outputs: [
      {
        internalType: "uint256",
        name: "claimCount",
        type: "uint256"
      },
      {
        internalType: "uint256[]",
        name: "amounts",
        type: "uint256[]"
      },
      {
        internalType: "uint256[]",
        name: "timestamps",
        type: "uint256[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  }
];


interface AirdropDetail {
  id: string;
  airdrop_name: string;
  airdrop_symbol: string;
  airdrop_description: string;
  logo_url: string;
  contract_address: string;
  token_address: string;
  airdrop_amount: string;
  launch_date: string;
  end_date: string;
  launch_price: string;
  network: string;
  website_url?: string;
  twitter_url?: string;
  telegram_url?: string;
  whitepaper_link?: string;
  requirements?: string;
}

interface ClaimHistory {
  id: string;
  wallet_address: string;
  amount_claimed: string;
  transaction_hash: string;
  claimed_at: string;
}

const AirdropDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [airdrop, setAirdrop] = useState<AirdropDetail | null>(null);
  const [claimHistory, setClaimHistory] = useState<ClaimHistory[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchAirdropDetails(id);
      fetchClaimHistory(id);
    }
  }, [id]);

  useEffect(() => {
    checkWalletConnection();
  }, []);

  const fetchAirdropDetails = async (airdropId: string) => {
    try {
      const { data, error } = await supabase
        .from('airdrops')
        .select('*')
        .eq('id', airdropId)
        .eq('is_active', true)
        .eq('is_approved', true)
        .single();

      if (error) throw error;
      
      setAirdrop(data);
    } catch (error) {
      console.error('Error fetching airdrop details:', error);
      setError('Airdrop not found or unavailable');
    } finally {
      setPageLoading(false);
    }
  };

  const fetchClaimHistory = async (airdropId: string) => {
    try {
      const { data, error } = await supabase
        .from('airdrop_claims')
        .select('*')
        .eq('airdrop_id', airdropId)
        .order('claimed_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      
      setClaimHistory(data || []);
    } catch (error) {
      console.error('Error fetching claim history:', error);
    }
  };

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

  const claimAirdrop = async () => {
    if (!isConnected || !airdrop) {
        setError('Please connect your wallet first');
        return;
    }

    setIsLoading(true);
    setError('');
    setTxHash('');

    try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(airdrop.contract_address, AIRDROP_ABI, signer);

        // STEP 1: Get user claimCount
        const claimDetails = await contract.getClaimDetails(walletAddress);
        const claimCount = Number(claimDetails[0]);

        // STEP 2: Calculate fee using the same logic as in contract
        const BASE_FEE = ethers.parseEther("0.24");
        let fee: bigint;

        switch (claimCount) {
        case 0:
            fee = BASE_FEE;
            break;
        case 1:
            fee = BASE_FEE * 120n / 100n; // +20%
            break;
        case 2:
            fee = BASE_FEE * 14160n / 10000n; // +18%
            break;
        case 3:
            fee = BASE_FEE * 16708n / 10000n;
            break;
        case 4:
            fee = BASE_FEE * 19715n / 10000n;
            break;
        default:
            setError('You have already claimed the maximum 5 times.');
            setIsLoading(false);
            return;
        }

        // STEP 3: Send claim tx with fee
        const tx = await contract.claimAirdrop({ value: fee });
        setTxHash(tx.hash);
        await tx.wait();

        // STEP 4: Log to Supabase
        await supabase.from('airdrop_claims').insert({
        airdrop_id: airdrop.id,
        wallet_address: walletAddress,
        amount_claimed: airdrop.airdrop_amount,
        transaction_hash: tx.hash
        });

        fetchClaimHistory(airdrop.id);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Header />
        <div className="pt-16 min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!airdrop) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Header />
        <div className="pt-16 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
              Airdrop not found
            </h1>
            <button
              onClick={() => navigate('/airdrop-index')}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Back to Airdrops
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <Header />
      
      <main className="pt-16">
        {/* Header Section */}
        <section className="py-8 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-slate-800 dark:to-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 mb-6">
              <button 
                onClick={() => navigate('/airdrop-index')}
                className="p-2 text-slate-600 dark:text-slate-300 hover:text-green-600 dark:hover:text-green-400 transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-4">
                <img
                  src={airdrop.logo_url}
                  alt={airdrop.airdrop_name}
                  className="w-12 h-12 rounded-full"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=100';
                  }}
                />
                <div>
                  <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
                    {airdrop.airdrop_name} Airdrop
                  </h1>
                  <p className="text-slate-600 dark:text-slate-300">{airdrop.airdrop_symbol}</p>
                </div>
              </div>
            </div>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl">
              Claim your free {airdrop.airdrop_symbol} tokens. Connect your wallet and claim {airdrop.airdrop_amount} tokens.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              {/* Claim Interface */}
              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                      <Gift className="w-6 h-6 text-green-600" />
                      Claim Airdrop
                    </h2>
                    {isConnected && (
                      <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                        <CheckCircle className="w-4 h-4" />
                        <span>Connected: {formatAddress(walletAddress)}</span>
                      </div>
                    )}
                  </div>

                  {/* Airdrop Info */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-500/10 dark:to-emerald-500/10 rounded-xl p-6 mb-6">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
                        You will receive
                      </h3>
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        {airdrop.airdrop_amount} {airdrop.airdrop_symbol}
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        Launch Price: {airdrop.launch_price}
                      </p>
                    </div>
                  </div>

                  {/* Requirements */}
                  {airdrop.requirements && (
                    <div className="bg-blue-50 dark:bg-blue-500/10 rounded-lg p-4 mb-6">
                      <h4 className="font-semibold text-slate-800 dark:text-white mb-2">Requirements:</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300">{airdrop.requirements}</p>
                    </div>
                  )}

                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg p-3 mb-6">
                      <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm">{error}</span>
                      </div>
                    </div>
                  )}

                  {/* Success Message */}
                  {txHash && (
                    <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-lg p-3 mb-6">
                      <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm">Airdrop claimed successfully!</span>
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
                      className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <Wallet className="w-5 h-5" />
                      Connect Wallet
                    </button>
                  ) : (
                    <button
                      onClick={claimAirdrop}
                      disabled={isLoading}
                      className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                    >
                      <Gift className="w-5 h-5" />
                      <span>{isLoading ? 'Processing...' : 'Claim Airdrop'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Airdrop Information */}
              <div className="space-y-6">
                {/* Contract Addresses */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Contract Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-slate-600 dark:text-slate-400 mb-1 block">Airdrop Contract Address</label>
                      <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-700 rounded-lg p-3">
                        <code className="flex-1 text-sm font-mono text-slate-800 dark:text-white break-all">
                          {airdrop.contract_address}
                        </code>
                        <button
                          onClick={() => copyToClipboard(airdrop.contract_address, 'airdrop')}
                          className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                        >
                          {copied === 'airdrop' ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm text-slate-600 dark:text-slate-400 mb-1 block">Token Contract Address</label>
                      <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-700 rounded-lg p-3">
                        <code className="flex-1 text-sm font-mono text-slate-800 dark:text-white break-all">
                          {airdrop.token_address}
                        </code>
                        <button
                          onClick={() => copyToClipboard(airdrop.token_address, 'token')}
                          className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                        >
                          {copied === 'token' ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Airdrop Details */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Airdrop Details</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                        <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Symbol</div>
                        <div className="text-lg font-bold text-slate-800 dark:text-white">{airdrop.airdrop_symbol}</div>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                        <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Network</div>
                        <div className="text-lg font-bold text-slate-800 dark:text-white">{airdrop.network}</div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-500/10 dark:to-emerald-500/10 rounded-lg p-4">
                      <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Airdrop Period</div>
                      <div className="text-lg font-bold text-slate-800 dark:text-white">
                        {new Date(airdrop.launch_date).toLocaleDateString()} - {new Date(airdrop.end_date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Security Features */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Security & Features</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-green-500" />
                      <span className="text-slate-600 dark:text-slate-300">Verified smart contract</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Zap className="w-5 h-5 text-blue-500" />
                      <span className="text-slate-600 dark:text-slate-300">Instant token delivery</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Info className="w-5 h-5 text-purple-500" />
                      <span className="text-slate-600 dark:text-slate-300">One claim per wallet</span>
                    </div>
                  </div>
                </div>

                {/* Important Notice */}
                <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-amber-800 dark:text-amber-400 mb-2">Important Notice</h3>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    Make sure you're connected to the {airdrop.network} network in your wallet. 
                    Tokens will be automatically sent to your wallet after successful claim.
                  </p>
                </div>
              </div>
            </div>

            {/* Claim History */}
            <div className="mt-12">
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Recent Claims
                </h3>
                
                {claimHistory.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50 dark:bg-slate-700">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Wallet Address
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Transaction
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-600">
                        {claimHistory.map((claim) => (
                          <tr key={claim.id} className="hover:bg-slate-50 dark:hover:bg-slate-700">
                            <td className="px-4 py-3 text-sm font-mono text-slate-800 dark:text-white">
                              {formatAddress(claim.wallet_address)}
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                              {claim.amount_claimed} {airdrop.airdrop_symbol}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <a
                                href={`https://polygonscan.com/tx/${claim.transaction_hash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                              >
                                {formatAddress(claim.transaction_hash)}
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                              {formatDate(claim.claimed_at)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600 dark:text-slate-300">No claims yet. Be the first to claim!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AirdropDetailPage;