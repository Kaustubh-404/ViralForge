import { http, createConfig } from 'wagmi'
import { defineChain } from 'viem'

// Define Etherlink testnet
const etherlinkTestnet = defineChain({
  id: 128138,
  name: 'Etherlink Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'XTZ',
    symbol: 'XTZ',
  },
  rpcUrls: {
    default: {
      http: ['https://node.ghostnet.etherlink.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Etherlink Explorer',
      url: 'https://testnet-explorer.etherlink.com',
    },
  },
})

export const config = createConfig({
  chains: [etherlinkTestnet],
  transports: {
    [etherlinkTestnet.id]: http(),
  },
})