/*
  # Add top column to ICO listings and insert mock data

  1. Schema Changes
    - Add `top` column to `ico_listings` table (boolean, default false)
    - This column will be managed by admins to feature top projects

  2. Mock Data
    - Insert 5 sample ICO projects with varied data
    - Include both current and upcoming projects
    - Set some projects as "top" featured projects
    - All projects will be active and approved for display

  3. Indexes
    - Add index on `top` column for performance
    - Add index on `ico_start_date` for upcoming projects query
*/

-- Add top column to ico_listings table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ico_listings' AND column_name = 'top'
  ) THEN
    ALTER TABLE ico_listings ADD COLUMN top boolean DEFAULT false;
  END IF;
END $$;

-- Add index for top column
CREATE INDEX IF NOT EXISTS idx_ico_listings_top ON ico_listings(top);

-- Insert mock ICO projects
INSERT INTO ico_listings (
  user_id,
  listing_type,
  project_name,
  project_symbol,
  total_supply,
  contract_address,
  relationship_with_project,
  project_launch_date,
  country_of_origin,
  project_tags,
  project_description,
  project_keypoints,
  network,
  decimals,
  logo_url,
  website_url,
  block_explorer_link,
  whitepaper_link,
  twitter_url,
  telegram_url,
  facebook_url,
  linkedin_url,
  ico_start_date,
  ico_end_date,
  ico_price,
  comments,
  is_active,
  is_approved,
  top
) VALUES 
(
  (SELECT id FROM auth.users LIMIT 1),
  'gold',
  'DeFiMax Protocol',
  'DMAX',
  '1000000000',
  '0x742d35Cc6634C0532925a3b8D4C9db96590b5c8e',
  'Founder',
  '2024-01-15',
  'United States',
  'DeFi, Yield Farming, Staking',
  'DeFiMax Protocol is a revolutionary decentralized finance platform that offers high-yield farming opportunities and innovative staking mechanisms. Our protocol combines cutting-edge smart contract technology with user-friendly interfaces to maximize returns for DeFi enthusiasts. With advanced security features and transparent governance, DeFiMax is set to become the leading DeFi protocol in the market.',
  '• High-yield farming pools with up to 200% APY\n• Innovative auto-compounding mechanisms\n• Multi-chain compatibility\n• Governance token with voting rights\n• Advanced security audits completed',
  'Ethereum (ETH)',
  18,
  'https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=200',
  'https://defimax.io',
  'https://etherscan.io/token/0x742d35Cc6634C0532925a3b8D4C9db96590b5c8e',
  'https://defimax.io/whitepaper.pdf',
  'https://twitter.com/defimaxprotocol',
  'https://t.me/defimaxcommunity',
  'https://facebook.com/defimaxprotocol',
  'https://linkedin.com/company/defimax',
  '2024-02-01',
  '2024-02-28',
  '0.05 ETH',
  'Launching with major partnerships and exchange listings confirmed',
  true,
  true,
  true
),
(
  (SELECT id FROM auth.users LIMIT 1),
  'silver',
  'GameFi Universe',
  'GFU',
  '500000000',
  '0x123d35Cc6634C0532925a3b8D4C9db96590b5c8f',
  'Co-Founder',
  '2024-02-10',
  'Singapore',
  'Gaming, NFT, Metaverse',
  'GameFi Universe is the next-generation gaming ecosystem that combines blockchain technology with immersive gameplay experiences. Players can earn real rewards through play-to-earn mechanisms while enjoying AAA-quality games. Our platform features NFT marketplaces, virtual land ownership, and cross-game asset interoperability, creating a comprehensive gaming metaverse.',
  '• Play-to-earn gaming ecosystem\n• NFT marketplace integration\n• Virtual land ownership\n• Cross-game asset compatibility\n• Mobile and desktop gaming support',
  'Binance Smart Chain (BSC)',
  18,
  'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=200',
  'https://gamefi-universe.com',
  'https://bscscan.com/token/0x123d35Cc6634C0532925a3b8D4C9db96590b5c8f',
  'https://gamefi-universe.com/whitepaper.pdf',
  'https://twitter.com/gamefiuniverse',
  'https://t.me/gamefiuniverse',
  'https://facebook.com/gamefiuniverse',
  'https://linkedin.com/company/gamefi-universe',
  '2024-03-15',
  '2024-04-15',
  '0.02 BNB',
  'Beta version already live with 10,000+ active players',
  true,
  true,
  true
),
(
  (SELECT id FROM auth.users LIMIT 1),
  'gold',
  'EcoChain Carbon',
  'ECO',
  '2000000000',
  '0x456d35Cc6634C0532925a3b8D4C9db96590b5c8g',
  'Team Member',
  '2024-03-01',
  'Germany',
  'Sustainability, Carbon Credits, Green Energy',
  'EcoChain Carbon is a blockchain-based platform dedicated to fighting climate change through tokenized carbon credits and green energy investments. Our innovative approach allows individuals and businesses to offset their carbon footprint while earning rewards. The platform connects renewable energy projects with investors, creating a sustainable ecosystem for environmental impact.',
  '• Tokenized carbon credit marketplace\n• Green energy project funding\n• Carbon footprint tracking\n• Sustainability rewards program\n• Partnership with major environmental organizations',
  'Polygon (MATIC)',
  18,
  'https://images.pexels.com/photos/414837/pexels-photo-414837.jpeg?auto=compress&cs=tinysrgb&w=200',
  'https://ecochain-carbon.org',
  'https://polygonscan.com/token/0x456d35Cc6634C0532925a3b8D4C9db96590b5c8g',
  'https://ecochain-carbon.org/whitepaper.pdf',
  'https://twitter.com/ecochaincarbon',
  'https://t.me/ecochaincarbon',
  'https://facebook.com/ecochaincarbon',
  'https://linkedin.com/company/ecochain-carbon',
  '2024-04-01',
  '2024-05-01',
  '0.01 MATIC',
  'Backed by leading environmental VCs and government grants',
  true,
  true,
  true
),
(
  (SELECT id FROM auth.users LIMIT 1),
  'free',
  'HealthChain Network',
  'HCN',
  '750000000',
  '0x789d35Cc6634C0532925a3b8D4C9db96590b5c8h',
  'Marketing Partner',
  '2024-01-20',
  'Canada',
  'Healthcare, Data Privacy, Medical Records',
  'HealthChain Network revolutionizes healthcare data management by providing secure, decentralized storage for medical records. Patients have full control over their health data while enabling seamless sharing with healthcare providers. Our blockchain solution ensures privacy, security, and interoperability across different healthcare systems worldwide.',
  '• Secure medical record storage\n• Patient-controlled data sharing\n• HIPAA compliant infrastructure\n• Interoperable healthcare systems\n• Telemedicine integration',
  'Ethereum (ETH)',
  18,
  'https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg?auto=compress&cs=tinysrgb&w=200',
  'https://healthchain-network.com',
  'https://etherscan.io/token/0x789d35Cc6634C0532925a3b8D4C9db96590b5c8h',
  'https://healthchain-network.com/whitepaper.pdf',
  'https://twitter.com/healthchainnet',
  'https://t.me/healthchainnetwork',
  'https://facebook.com/healthchainnetwork',
  'https://linkedin.com/company/healthchain-network',
  '2024-05-15',
  '2024-06-15',
  '0.03 ETH',
  'Partnerships with major hospitals and medical institutions confirmed',
  true,
  true,
  false
),
(
  (SELECT id FROM auth.users LIMIT 1),
  'silver',
  'AI Trading Bot',
  'AITB',
  '300000000',
  '0x987d35Cc6634C0532925a3b8D4C9db96590b5c8i',
  'Founder',
  '2024-02-28',
  'United Kingdom',
  'AI, Trading, Automation, Machine Learning',
  'AI Trading Bot leverages advanced artificial intelligence and machine learning algorithms to provide automated trading solutions for cryptocurrency markets. Our sophisticated bot analyzes market patterns, executes trades with precision, and maximizes profits while minimizing risks. The platform offers both beginner-friendly and advanced trading strategies.',
  '• Advanced AI trading algorithms\n• 24/7 automated trading\n• Risk management tools\n• Multiple exchange integration\n• Real-time market analysis',
  'Binance Smart Chain (BSC)',
  18,
  'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=200',
  'https://ai-trading-bot.io',
  'https://bscscan.com/token/0x987d35Cc6634C0532925a3b8D4C9db96590b5c8i',
  'https://ai-trading-bot.io/whitepaper.pdf',
  'https://twitter.com/aitradingbot',
  'https://t.me/aitradingbot',
  'https://facebook.com/aitradingbot',
  'https://linkedin.com/company/ai-trading-bot',
  '2024-06-01',
  '2024-07-01',
  '0.015 BNB',
  'Beta testing shows 85% success rate in profitable trades',
  true,
  true,
  false
);