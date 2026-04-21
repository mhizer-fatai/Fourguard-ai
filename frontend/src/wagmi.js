import { createConfig, http, injected } from 'wagmi';
import { bsc, bscTestnet } from 'wagmi/chains';

export const config = createConfig({
  connectors: [injected()],
  chains: [bsc, bscTestnet],
  transports: {
    [bsc.id]: http(),
    [bscTestnet.id]: http(),
  },
});

