import { http, createConfig } from 'wagmi'
import { mantleSepoliaTestnet } from 'wagmi/chains'

export const config = createConfig({
  chains: [mantleSepoliaTestnet],
  transports: {
    [mantleSepoliaTestnet.id]: http(),
  },
});