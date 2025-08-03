"use client";

import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config } from "@/config/wagmiConfig";
import { MetaMaskUIProvider } from "@metamask/sdk-react-ui";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <MetaMaskUIProvider
          sdkOptions={{
            dappMetadata: {
              name: "Example React UI Dapp",
            },
          }}
        >
          {children}
        </MetaMaskUIProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
