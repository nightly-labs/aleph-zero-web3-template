import { NightlyConnectAdapter } from "@nightlylabs/wallet-selector-polkadot";

export interface ConnectionOptions {
  disableModal?: boolean;
  disableEagerConnect?: boolean;
  initOnConnect?: boolean;
}

let _adapter: NightlyConnectAdapter | undefined;
export const getAdapter = async (
  persisted = true,
  connectionOptions: ConnectionOptions = {}
) => {
  if (_adapter) return _adapter;
  _adapter = await NightlyConnectAdapter.build(
    {
      appMetadata: {
        name: "Aleph Zero Template",
        description: "Aleph Zero Template",
        icon: "https://docs.nightly.app/img/logo.png",
      },
      network: "AlephZero",
      persistent: persisted,
    },
    connectionOptions
  );
  return _adapter;
};
