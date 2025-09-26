"use client";

import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultConfig,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { base } from "wagmi/chains";

const config = getDefaultConfig({
  appName: "My Cute NFT dApp",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  chains: [base],
  ssr: true,
});

const queryClient = new QueryClient();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ 
        background: 'linear-gradient(to bottom right, #fdf2f8, #ffffff, #faf5ff)', 
        minHeight: '100vh', 
        fontFamily: 'system-ui, -apple-system, sans-serif' 
      }}>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider>
              <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
                {children}
              </div>
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}
