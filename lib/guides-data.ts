export interface Guide {
  slug: string;
  title: string;
  description: string;
  icon: string;
  category: 'basics' | 'hardware' | 'software' | 'recovery';
  steps: { title: string; content: string; tip?: string; }[];
}

export const guides: Guide[] = [
  {
    slug: 'seed-phrases',
    title: 'What is a Seed Phrase?',
    description: 'Learn what a seed phrase is and why it\'s the most important thing to protect when using cryptocurrency.',
    icon: 'key',
    category: 'basics',
    steps: [
      {
        title: 'What is a Seed Phrase?',
        content: 'A seed phrase (also called a recovery phrase or backup phrase) is a list of 12 or 24 words that acts like a master key to your cryptocurrency. Think of it like the ultimate password that can unlock all of your crypto, no matter what happens to your phone, computer, or hardware wallet.',
        tip: 'Your seed phrase is MORE important than any device. The device can break, but the seed phrase can recreate everything.'
      },
      {
        title: 'Why Does It Matter?',
        content: 'Your seed phrase is the ONLY way to recover your cryptocurrency if something goes wrong. If you lose your phone, your hardware wallet breaks, or you forget your password, the seed phrase is your backup plan. Without it, your crypto is gone forever. Banks can reset your password - crypto cannot.',
        tip: 'Cryptocurrency has no customer service hotline. Your seed phrase is your only lifeline.'
      },
      {
        title: 'What Does It Look Like?',
        content: 'A seed phrase is exactly 12 or 24 common English words, like: "apple", "mountain", "happy", "bridge", etc. They must be written down in the exact order they were given to you. These words come from a standardized list of 2,048 possible words. The order matters - "apple mountain" is different from "mountain apple".',
        tip: 'Never take a photo or type your seed phrase on any device connected to the internet. Always write it on paper.'
      },
      {
        title: 'How to Store It Safely',
        content: 'Write your seed phrase on paper (or metal for fire/water protection) and keep it somewhere very safe - like a fireproof safe or safety deposit box. Make two copies and store them in different physical locations. Never store it digitally (no photos, no cloud storage, no password managers, no email). Treat it like you would $1 million in cash.',
        tip: 'Consider giving one copy to a trusted family member in a sealed envelope, stored in their safe.'
      },
      {
        title: 'What NEVER to Do',
        content: 'NEVER share your seed phrase with anyone - not even "customer support" or "tech help". No legitimate service will ever ask for it. NEVER type it into a website or app unless you are restoring a wallet on a device you completely trust. NEVER take a screenshot or photo of it. NEVER store it in email, cloud storage, or password managers. Scammers will try to trick you - be paranoid.',
        tip: 'If someone asks for your seed phrase, it\'s 100% a scam. No exceptions, ever.'
      },
      {
        title: 'How to Use It for Recovery',
        content: 'If you need to recover your wallet (lost phone, broken device, etc.), you will download the wallet app or connect a new hardware wallet, and select "Restore from seed phrase" or "Import wallet". You\'ll then carefully type in all 12 or 24 words in the exact order. Double-check each word. Once entered correctly, all your cryptocurrency will reappear.',
        tip: 'Take your time when entering your seed phrase. One wrong word means it won\'t work.'
      }
    ]
  },
  {
    slug: 'ledger-nano',
    title: 'Using a Ledger Nano',
    description: 'Step-by-step guide to using a Ledger Nano S or Ledger Nano X hardware wallet to access and send cryptocurrency.',
    icon: 'shield',
    category: 'hardware',
    steps: [
      {
        title: 'Unlock Your Ledger Device',
        content: 'Connect your Ledger Nano to your computer using the USB cable provided. Press both buttons on the top of the device at the same time to turn it on (or it may turn on automatically). You\'ll see "Welcome" on the screen. Use the left and right buttons to navigate, and press both buttons together to select. Enter your PIN code using the buttons to go up/down through numbers, and both buttons to confirm each digit.',
        tip: 'If you enter the wrong PIN 3 times, the device will reset. Be careful!'
      },
      {
        title: 'Install Ledger Live',
        content: 'On your computer, go to ledger.com/start and download the Ledger Live app for your operating system (Windows, Mac, or Linux). Install the app and open it. Click "Get started" and follow the prompts. When asked, select "Initialize as a new device" if this is your first time, or "Restore from recovery phrase" if you\'re recovering an existing wallet.',
        tip: 'Only download Ledger Live from the official Ledger website - never from a third party.'
      },
      {
        title: 'Connect and Set Up',
        content: 'In Ledger Live, click "Add account" in the left sidebar. Select the cryptocurrency you want to access (like Bitcoin or Ethereum). Ledger Live will ask you to open the corresponding app on your Ledger device. On the device, use the right button to scroll through apps until you find the one you need (like "Bitcoin" or "Ethereum"), then press both buttons to open it. The screen will say "Application is ready".',
        tip: 'If you don\'t see the app you need on your device, you can install it through Ledger Live under "Manager".'
      },
      {
        title: 'Navigate Your Accounts',
        content: 'Once connected, Ledger Live will show your cryptocurrency balances, transaction history, and buttons to Send or Receive. You can view multiple accounts (Bitcoin, Ethereum, etc.) by clicking on them in the left sidebar. The Ledger device itself must be connected and unlocked to see current balances or make transactions.',
        tip: 'Your cryptocurrency is stored on the blockchain, not on the Ledger. The Ledger just holds the keys to access it.'
      },
      {
        title: 'Approve a Transaction',
        content: 'When you want to send cryptocurrency, you\'ll create the transaction in Ledger Live (enter recipient address and amount), then click "Continue". The Ledger device will display the transaction details on its screen. Carefully review the recipient address and amount shown on the device\'s screen - NOT on your computer. If everything looks correct, press the right button to approve, then both buttons to confirm.',
        tip: 'Always verify the recipient address on the Ledger screen. If your computer is hacked, the screen can lie - the Ledger cannot.'
      },
      {
        title: 'Safely Disconnect',
        content: 'After you\'re done, you can close Ledger Live and disconnect the USB cable. Your Ledger will turn off automatically. Store your Ledger in a safe place. Your crypto is safe even when the device is disconnected - the blockchain holds your funds, the Ledger just holds the keys.',
        tip: 'Keep your Ledger and your seed phrase in separate locations for maximum security.'
      }
    ]
  },
  {
    slug: 'trezor',
    title: 'Using a Trezor',
    description: 'Complete guide to using a Trezor Model T or Trezor One hardware wallet to manage your cryptocurrency safely.',
    icon: 'lock',
    category: 'hardware',
    steps: [
      {
        title: 'Connect Your Trezor',
        content: 'Plug your Trezor into your computer using the USB cable. The Trezor will turn on automatically. If this is your first time, you\'ll see setup instructions on the screen. If the device is already set up, you\'ll see a prompt to enter your PIN or passphrase. The Trezor Model T has a touchscreen, while the Model One uses buttons on the device and a number pad on your computer screen.',
        tip: 'Make sure you\'re using the cable that came with your Trezor. Some cables are charging-only and won\'t work for data.'
      },
      {
        title: 'Install Trezor Suite',
        content: 'On your computer, go to trezor.io/start and download the Trezor Suite desktop app (or use the web version at suite.trezor.io). Install and open the app. Click "Connect Trezor" and follow the on-screen prompts. The app will detect your device and guide you through any necessary firmware updates. Always install updates when prompted - they contain important security fixes.',
        tip: 'Only download Trezor Suite from the official Trezor website. Fake versions exist and will steal your crypto.'
      },
      {
        title: 'Enter Your PIN',
        content: 'When prompted, enter your PIN using the unique number pad system. For Model One: Your computer shows a blank 9-square grid, but the Trezor screen shows where each number is located. Click the positions on your computer that correspond to your PIN digits. For Model T: Simply enter your PIN directly on the touchscreen. This system prevents keyloggers from stealing your PIN.',
        tip: 'The number positions change every time you enter your PIN for security. Look at the device, not the computer screen.'
      },
      {
        title: 'Access Your Accounts',
        content: 'Once unlocked, Trezor Suite will display your cryptocurrency portfolio. Click "Accounts" in the left menu to see all your different cryptocurrencies (Bitcoin, Ethereum, etc.). You can add new accounts by clicking the "+" button. Each coin type will show your balance, recent transactions, and options to Send or Receive. The interface is similar to online banking, but you control everything.',
        tip: 'You can rename your accounts in Trezor Suite to help organize them (like "Savings" or "Trading").'
      },
      {
        title: 'Send Cryptocurrency',
        content: 'To send crypto, select the account you want to send from, then click "Send". Enter the recipient\'s address (you can paste it or scan a QR code), enter the amount to send, and adjust the fee if needed (higher fee = faster transaction). Click "Send" in the app. Your Trezor will then show the transaction details on its screen. Carefully verify the address and amount on the Trezor screen, then confirm by pressing the button (Model One) or tapping the screen (Model T).',
        tip: 'For large amounts, send a small test transaction first to make sure the address is correct.'
      },
      {
        title: 'Disconnect Safely',
        content: 'When you\'re finished, close Trezor Suite and unplug your Trezor. The device will power off. Your cryptocurrency remains safe on the blockchain - the Trezor just holds the keys to access it. Store your Trezor in a secure location, and keep your seed phrase backup in a completely separate place (never together).',
        tip: 'Even if your Trezor is destroyed, you can buy a new one and restore everything with your seed phrase.'
      }
    ]
  },
  {
    slug: 'metamask',
    title: 'Using MetaMask',
    description: 'Learn how to use MetaMask wallet on browser and mobile to send, receive, and manage Ethereum and other cryptocurrencies.',
    icon: 'mobile',
    category: 'software',
    steps: [
      {
        title: 'Install MetaMask',
        content: 'For browser: Go to metamask.io and click "Download". Choose your browser (Chrome, Firefox, Brave, or Edge) and add the extension. Look for the fox icon in your browser\'s extension area. For mobile: Download the MetaMask app from the Apple App Store or Google Play Store. ONLY download from official sources - there are many fake MetaMask apps that will steal your crypto.',
        tip: 'Bookmark the real MetaMask website. Scammers create fake sites with similar URLs.'
      },
      {
        title: 'Create or Import Wallet',
        content: 'Open MetaMask and click "Get Started". Choose "Create a new wallet" if this is your first time, or "Import an existing wallet" if you have a seed phrase from before. If creating new: Create a strong password (this password only unlocks MetaMask on this device, not your crypto). You\'ll then see your 12-word seed phrase - write it down on paper and store it safely. This is your backup for everything. If importing: Enter your 12 or 24-word seed phrase carefully in order.',
        tip: 'Your password is for the app. Your seed phrase is for your crypto. The seed phrase is more important.'
      },
      {
        title: 'Understand the Interface',
        content: 'MetaMask opens to your main account showing your ETH balance and tokens. At the top, you\'ll see the network you\'re on (usually "Ethereum Mainnet"). Your account address is at the top center (looks like 0x1234...). Click "Assets" to see all your tokens and NFTs. Click "Activity" to see transaction history. The three dots in the top right have additional settings.',
        tip: 'Click your account address to copy it to your clipboard - you\'ll need this to receive crypto.'
      },
      {
        title: 'Send Cryptocurrency',
        content: 'Click "Send" on the main screen. Paste or type the recipient\'s Ethereum address (starts with 0x). Select which asset you want to send (ETH or a token). Enter the amount. MetaMask will show you the estimated gas fee (this is the transaction cost, paid in ETH). Review everything carefully - crypto transactions cannot be undone. Click "Confirm" to send. You\'ll see a confirmation message and can track the transaction in the Activity tab.',
        tip: 'Always send a small test amount first, especially for large transactions. Once sent, you cannot undo it.'
      },
      {
        title: 'Switch Networks',
        content: 'MetaMask can work with many different blockchain networks, not just Ethereum. Click the network dropdown at the top (says "Ethereum Mainnet" by default). You can switch to networks like Polygon, Arbitrum, Optimism, or BNB Chain. To add a new network, click "Add network" and either choose from popular ones or enter custom details. Different networks have different tokens and lower fees.',
        tip: 'Make sure you\'re on the correct network before sending crypto. Sending ETH on the wrong network can lose your funds.'
      },
      {
        title: 'Manage Tokens',
        content: 'MetaMask automatically detects many popular tokens, but not all. To add a token manually: Click "Import tokens" at the bottom of the Assets tab. Enter the token contract address (you can find this on CoinGecko or the token\'s website). The token symbol and decimals should auto-fill. Click "Add" and it will appear in your assets list. You can also hide tokens you don\'t use by clicking the three dots next to them.',
        tip: 'Be cautious adding tokens from unknown sources. Scammers send fake tokens to try to trick you.'
      }
    ]
  },
  {
    slug: 'phantom',
    title: 'Using Phantom Wallet',
    description: 'A beginner-friendly guide to using Phantom wallet for Solana cryptocurrency, NFTs, and tokens.',
    icon: 'mobile',
    category: 'software',
    steps: [
      {
        title: 'Install Phantom',
        content: 'For browser: Go to phantom.app and click "Download". Select your browser (Chrome, Firefox, Brave, or Edge) and install the extension. Look for the purple ghost icon. For mobile: Download the Phantom app from the Apple App Store or Google Play Store. Make absolutely sure you\'re downloading the real Phantom app - check the developer name and reviews. Scam versions exist.',
        tip: 'The official website is phantom.app (not .com or .io). Bookmark it to avoid phishing sites.'
      },
      {
        title: 'Create or Import Wallet',
        content: 'Open Phantom and select "Create New Wallet" or "I already have a wallet". If creating new: You\'ll be shown a 12-word recovery phrase. Write this down on paper in the exact order shown. You\'ll need to verify you wrote it down by selecting the words in order. Create a password for the app (this is separate from your recovery phrase). If importing: Enter your 12 or 24-word recovery phrase from an existing Solana wallet.',
        tip: 'Your recovery phrase is the master key. Keep it offline and never share it with anyone, ever.'
      },
      {
        title: 'Understand Your Wallet',
        content: 'Phantom shows your main Solana (SOL) balance at the top. Below that, you\'ll see any tokens and NFTs you own. Your wallet address is shown at the top (starts with letters/numbers like "7xKX..."). Click it to copy your address for receiving funds. The tabs at the bottom let you navigate between Tokens, NFTs, and Activity (transaction history). The settings icon in the top right lets you adjust preferences.',
        tip: 'SOL is needed for transaction fees on Solana, just like ETH on Ethereum. Keep some SOL in your wallet.'
      },
      {
        title: 'Send SOL or Tokens',
        content: 'Click "Send" on the main screen or next to a specific token. Paste the recipient\'s Solana address or scan their QR code. Enter the amount you want to send. Phantom will show you the small network fee (usually fractions of a cent on Solana). Review the recipient address and amount carefully. Click "Send" to confirm. Transactions on Solana are usually confirmed in seconds.',
        tip: 'For large amounts, always send a tiny test transaction first to verify the address is correct.'
      },
      {
        title: 'Receive Cryptocurrency',
        content: 'To receive SOL or tokens, click "Receive" or "Deposit" on the main screen. You\'ll see your wallet address and a QR code. You can share this address with someone who wants to send you crypto, or use it to withdraw from an exchange. For mobile users, the QR code is convenient - the sender can just scan it. Your address is the same for all Solana tokens (unlike Ethereum where addresses can vary).',
        tip: 'You can receive unlimited times to the same address. It doesn\'t change or expire.'
      },
      {
        title: 'View and Manage NFTs',
        content: 'Click the "NFTs" tab at the bottom to see your Solana NFT collection. Click on any NFT to view details, see its history, or send it to another wallet. Phantom displays NFT images and metadata beautifully. You can also "burn" (permanently delete) NFTs you don\'t want, which recovers a small amount of SOL. Be very careful - burning is permanent.',
        tip: 'Be cautious of unsolicited NFTs appearing in your wallet. Scammers send spam NFTs - don\'t click links in them.'
      }
    ]
  },
  {
    slug: 'sending-crypto',
    title: 'How to Send Crypto',
    description: 'Universal guide to safely sending cryptocurrency from any wallet. Learn the critical steps to avoid costly mistakes.',
    icon: 'exchange',
    category: 'basics',
    steps: [
      {
        title: 'Get the Correct Address',
        content: 'Ask the recipient for their wallet address for the specific cryptocurrency you\'re sending. Bitcoin addresses look different from Ethereum addresses which look different from Solana addresses. The recipient should send you the address via text or email - you\'ll copy and paste it (never type it manually). Double-check you\'re getting an address for the right cryptocurrency. Sending Bitcoin to an Ethereum address will result in lost funds.',
        tip: 'Ask the recipient to send the address twice, separately, so you can verify they match. This catches typos.'
      },
      {
        title: 'Verify the Address',
        content: 'Cryptocurrency addresses are long strings of letters and numbers. When you paste the address into your wallet, check the first 4-6 characters AND the last 4-6 characters match what the recipient sent. Some malware changes clipboard contents to a hacker\'s address. If possible, have the recipient send a QR code - scanning it is safer than copy/paste. Take your time with this step - sending to the wrong address means permanent loss.',
        tip: 'Never trust the middle of the address - only verify the beginning and end, which is what humans can realistically check.'
      },
      {
        title: 'Understand Network Fees',
        content: 'Every cryptocurrency transaction requires a small fee paid to the network (also called gas fee or miner fee). This fee is NOT going to the wallet company - it goes to people running the network. Fees vary: Bitcoin and Ethereum can be expensive during busy times ($1-50+), while Solana is usually under $0.01. Your wallet will show the estimated fee before you confirm. You typically need a bit of the native cryptocurrency (like ETH or SOL) in your wallet to pay fees.',
        tip: 'If sending all your funds, you need to leave a little for the fee. Use the "Max" button if your wallet has one.'
      },
      {
        title: 'Send a Test Transaction',
        content: 'For any significant amount (what "significant" means to you), ALWAYS send a small test amount first. Send $5 or $10 worth and make sure the recipient receives it successfully. Once confirmed, send the rest. Yes, you pay fees twice, but it\'s insurance against losing everything. This is standard practice among experienced crypto users. It only takes a few extra minutes.',
        tip: 'Think of the test transaction fee as insurance. It\'s a small price to pay to avoid losing thousands.'
      },
      {
        title: 'Review and Confirm',
        content: 'Before clicking the final "Send" or "Confirm" button, take a breath and review everything one more time: Is the address correct (check first and last characters)? Is the amount correct? Is the cryptocurrency type correct? Are you on the right network? Once you click confirm, the transaction is broadcast to the blockchain and cannot be reversed, cancelled, or refunded. There is no customer service to call.',
        tip: 'If you feel rushed or pressured to send quickly, STOP. Scammers use urgency to make you skip safety checks.'
      },
      {
        title: 'Wait for Confirmation',
        content: 'After sending, the transaction needs to be confirmed by the blockchain network. This takes different amounts of time: Solana (seconds), Ethereum (15 seconds to a few minutes), Bitcoin (10-60 minutes). Your wallet will show the transaction as "Pending" and then "Confirmed". You can usually click on the transaction to see its status on a blockchain explorer. Don\'t panic if it takes a while - busy networks are slower.',
        tip: 'You can share the transaction ID (hash) with the recipient so they can track it too. This proves you sent it.'
      }
    ]
  },
  {
    slug: 'emergency-recovery',
    title: 'Emergency Recovery Guide',
    description: 'Step-by-step instructions to recover access to cryptocurrency when a device is lost, stolen, or broken. Use this in a crisis.',
    icon: 'life-ring',
    category: 'recovery',
    steps: [
      {
        title: 'Stay Calm and Assess the Situation',
        content: 'Take a deep breath. If you have your seed phrase (recovery phrase), your cryptocurrency is NOT lost - it can be fully recovered. The device is just a tool to access your crypto, not the crypto itself. Your funds exist on the blockchain and are safe. Find your seed phrase backup (the 12 or 24 words you wrote down when first setting up the wallet). If you have this, everything can be restored. If you don\'t have it, unfortunately, the crypto cannot be recovered.',
        tip: 'This is why keeping your seed phrase safe is the #1 rule of crypto. The device can break, but the seed phrase is forever.'
      },
      {
        title: 'Gather What You Need',
        content: 'Find your seed phrase written on paper (or metal backup). Make sure you have all 12 or 24 words in the correct order. Identify what type of wallet you had: Was it a hardware wallet (Ledger, Trezor)? A mobile app (MetaMask, Phantom)? A browser extension? You\'ll need to get the same type of wallet software, or compatible software, to restore. Get a new device or use your computer if you lost a mobile device.',
        tip: 'You can restore most wallets using different wallet software - the seed phrase is universal within each blockchain.'
      },
      {
        title: 'Get New Wallet Software',
        content: 'Download the wallet app or browser extension that matches your original wallet. For hardware wallets: Order a new device (Ledger, Trezor, etc.) - you can even use a different brand if needed. For software wallets: Download MetaMask, Phantom, Exodus, or whatever you were using before. ONLY download from official sources (metamask.io, phantom.app, ledger.com, trezor.io). Use the links from the official websites, not Google ads or random search results.',
        tip: 'Scammers create fake wallet recovery sites. Triple-check you\'re on the real website before entering your seed phrase.'
      },
      {
        title: 'Select "Restore" or "Import Wallet"',
        content: 'Open the new wallet software. You\'ll see options like "Create new wallet" or "Import/Restore wallet" - choose the import/restore option. The wallet will ask for your recovery phrase. Carefully enter each word in the exact order from your backup. Most wallets have auto-complete to help you - the words come from a standard list of 2,048 possible words. Double-check every word before confirming.',
        tip: 'Take your time. One wrong word and it won\'t work. If a word seems wrong, check your handwriting carefully.'
      },
      {
        title: 'Verify Your Funds Appear',
        content: 'After entering your seed phrase correctly, the wallet should sync with the blockchain and display your cryptocurrency balances and transaction history. This might take a few minutes. If you see your funds, success! Your wallet is restored. If you don\'t see anything, you might need to: add additional accounts (some wallets use multiple accounts), switch to the correct network (Ethereum vs. Polygon, etc.), or wait longer for syncing.',
        tip: 'Your transaction history should match what you remember. If balances look wrong, check the network/account settings.'
      },
      {
        title: 'Secure Your New Setup',
        content: 'Now that you\'re back in, take steps to prevent this emergency from happening again: Make a new backup of your seed phrase if the old one is hard to read or damaged. Store it in multiple safe locations (home safe, safety deposit box, trusted family member). Set up a strong password/PIN for the wallet app. Consider upgrading to a hardware wallet for better security. Write down what happened and what you learned, so you remember for next time.',
        tip: 'This is a good time to review your security setup. Did you have enough backups? Were they accessible enough?'
      }
    ]
  },
  {
    slug: 'private-keys',
    title: 'Private Keys vs Seed Phrases',
    description: 'Understand the difference between private keys and seed phrases, and when you need each one. Essential knowledge for crypto safety.',
    icon: 'question-circle',
    category: 'basics',
    steps: [
      {
        title: 'What is a Private Key?',
        content: 'A private key is a long string of letters and numbers (usually 64 characters) that proves you own a specific cryptocurrency address. Think of it like the key to a specific safe deposit box. It looks like: "E9873D79C6D87DC0FB6A5778633389F4453213303DA61F20BD67FC233AA33262". Every cryptocurrency wallet address has one unique private key. If someone has your private key, they can access that address and take all the crypto in it.',
        tip: 'Private keys are the lowest-level form of access. They control individual addresses, not your whole wallet.'
      },
      {
        title: 'What is a Seed Phrase?',
        content: 'A seed phrase (also called recovery phrase or mnemonic) is a list of 12 or 24 simple words like "army canyon elephant dolphin". It\'s a human-readable way to represent a master key that can generate unlimited private keys and addresses. Instead of remembering dozens of 64-character private keys, you remember 12 words. The seed phrase is actually "above" private keys - it creates them. Modern wallets use seed phrases because they\'re easier for humans to write down and remember.',
        tip: 'Seed phrase = master key. Private key = individual key. The seed phrase is more powerful and more important.'
      },
      {
        title: 'How They Relate to Each Other',
        content: 'A seed phrase generates multiple private keys using a mathematical process. From one seed phrase, your wallet creates your first Bitcoin private key, your first Ethereum private key, and so on. If you want more addresses, the seed phrase generates more private keys. This means one seed phrase backup protects unlimited cryptocurrency addresses and accounts. Private keys are derived from the seed phrase - you rarely see or use private keys directly in modern wallets.',
        tip: 'Think of the seed phrase as a tree seed, and private keys as the branches. One seed grows many branches.'
      },
      {
        title: 'When You Need Your Seed Phrase',
        content: 'You need your seed phrase in these situations: Restoring a wallet on a new device (lost phone, broken hardware wallet), setting up the same wallet on multiple devices, recovering access after forgetting your password, or migrating to a different wallet app. Entering your seed phrase gives complete access to all your crypto. You should only enter it into wallet software you completely trust, on a device you know is safe.',
        tip: 'You should rarely need your seed phrase after the initial backup. If you\'re entering it often, something is wrong.'
      },
      {
        title: 'When You Need a Private Key',
        content: 'In modern wallets, you rarely need to touch private keys directly. Advanced users might need them for: Importing a single address into a different wallet, using certain DeFi protocols, or debugging technical issues. Most people never need to see their private keys - the wallet handles them automatically. If a service asks for your private key, be very cautious and make sure you understand why they need it. Legitimate services almost never ask for it.',
        tip: 'If you\'re not doing something highly technical, you probably don\'t need to export or use private keys.'
      },
      {
        title: 'How to Keep Both Safe',
        content: 'Seed phrase: Write it on paper (or metal), store it offline in a secure location like a safe, never take photos or store digitally, and never share it with anyone. Private keys: You usually don\'t need to back these up separately because the seed phrase generates them, but if you do export one, treat it exactly like a seed phrase - offline, secure, never shared. Both give complete access to your crypto. If someone gets either one, they can steal everything.',
        tip: 'The security rule is simple: Keep both completely offline and secret. No photos, no cloud, no sharing, no exceptions.'
      }
    ]
  }
];

export function getGuideBySlug(slug: string): Guide | undefined {
  return guides.find(guide => guide.slug === slug);
}
