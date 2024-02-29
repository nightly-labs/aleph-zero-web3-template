/* eslint-disable react-hooks/exhaustive-deps */
import { stringToU8a, u8aToHex } from "@polkadot/util";
import React, { useEffect } from "react";
import { toast } from "sonner";
import { getAdapter } from "../misc/adapter";
import { getAlephZero } from "../misc/alephZero";
import ActionStarryButton from "./ActionStarryButton";
import StarryButton from "./StarryButton";

const StickyHeader: React.FC = () => {
  const [address, setAddress] = React.useState<string | undefined>();
  useEffect(() => {
    const init = async () => {
      const adapter = await getAdapter();
      // Eager connect
      if (await adapter.canEagerConnect()) {
        try {
          await adapter.connect();
          const publicKey = await adapter.accounts.get();
          if (publicKey.length > 0) {
            setAddress(publicKey[0].address);
          }
        } catch (error) {
          await adapter.disconnect().catch(() => {});
          console.log(error);
        }
      }
    };
    init();
    // Try eagerly connect
  }, []);
  return (
    <header className="fixed top-0 left-0 w-full bg-opacity-50  p-6 z-10">
      <div className="flex items-center justify-between">
        <div>
          {/* <Image
            style={{ width: '200px', cursor: 'pointer' }}
            src={NightlyLogo}
            alt='logo'
            onClick={() => {
              // redirect to nightly.app
              window.location.href = 'https://nightly.app'
            }}
          /> */}
        </div>
        <div className="flex flex-col space-y-4">
          <StarryButton
            connected={address !== undefined}
            onConnect={async () => {
              const adapter = await getAdapter();
              try {
                await adapter.connect();
                const publicKey = await adapter.accounts.get();
                if (publicKey.length > 0) {
                  setAddress(publicKey[0].address);
                  console.log(publicKey[0].address);
                }
              } catch (error) {
                await adapter.disconnect().catch(() => {});
                console.log(error);
              }
            }}
            onDisconnect={async () => {
              try {
                const adapter = await getAdapter();
                await adapter.disconnect();
                setAddress(undefined);
              } catch (error) {
                console.log(error);
              }
            }}
            publicKey={address}
          />
          {address && (
            <>
              <ActionStarryButton
                onClick={async () => {
                  const signTransaction = async () => {
                    const RECEIVER =
                      "5EnRWxJwqLuexBZtbJVTmfAzzc6Fwpw2Gv9AYs1gYHsgvzfH";

                    const aleph = await getAlephZero();
                    const adapter = await getAdapter();
                    const tx = aleph.tx.balances.transfer(
                      RECEIVER,
                      5_000_000_000
                    );
                    const signedTx = await tx.signAsync(address, {
                      signer: adapter.signer as any,
                    });
                    const txId = await signedTx.send();
                    console.log(txId.toHex());
                    console.log(txId.toString());
                    toast.success("Transaction send!", {
                      action: {
                        label: "Show Transaction",
                        onClick: () => {
                          // Open url in a new tab
                          window.open(
                            `https://alephzero.subscan.io/extrinsic/${txId.toString()}`,
                            "_blank"
                          );
                        },
                      },
                    });
                  };
                  toast.promise(signTransaction, {
                    loading: "Signing Transaction...",
                    success: (_) => {
                      return `Transaction signed!`;
                    },
                    error: "Operation has been rejected!",
                  });
                }}
                name="Sign Transaction"
              ></ActionStarryButton>
              <ActionStarryButton
                onClick={async () => {
                  const signMessage = async () => {
                    const message = stringToU8a("I love Nightly 🦊");
                    const adapter = await getAdapter();
                    const _signed = await adapter.signer.signRaw!({
                      address: address,
                      data: u8aToHex(message),
                      type: "bytes",
                    });
                  };
                  // TODO add validation
                  toast.promise(signMessage, {
                    loading: "Signing message...",
                    success: (_) => {
                      return `Message signed!`;
                    },
                    error: "Operation has been rejected!",
                  });
                }}
                name="Sign Message"
              ></ActionStarryButton>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default StickyHeader;
