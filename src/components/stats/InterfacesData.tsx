
export type InterfacesData = {
  interfaces: {
    [key: string]: {
      stats: {
        tx_bps: number;
        rx_bps: number;
      };
    };
  };
};
