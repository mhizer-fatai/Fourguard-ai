import { createConfig, http, injected } from 'wagmi';
import { bsc, bscTestnet } from 'wagmi/chains';

// Using your private Alchemy RPC for stability and speed
const ALCHEMY_URL = "https://bnb-mainnet.g.alchemy.com/v2/XdGRlxK7aRGB3hLhkMQ8o";

export const config = createConfig({
  connectors: [injected()],
  chains: [bsc, bscTestnet],
  transports: {
    [bsc.id]: http(ALCHEMY_URL),
    [bscTestnet.id]: http(),
  },
});

