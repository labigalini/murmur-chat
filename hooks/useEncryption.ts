import { useEffect, useState } from "react";

import { generateKeyPair, loadKeyPair, saveKeyPair } from "@/lib/encryption";

export function useEncryption():
  | {
      publicKey: CryptoKey;
      privateKey: CryptoKey;
      // encrypt: () => void;
      // decrypt: () => void;
    }
  | "loading" {
  const [publicKey, setPublicKey] = useState<CryptoKey>();
  const [privateKey, setPrivateKey] = useState<CryptoKey>();

  useEffect(() => {
    const getOrCreateKeyPair = async () => {
      let keyPair = await loadKeyPair();

      if (!keyPair) {
        keyPair = await generateKeyPair();
        await saveKeyPair(keyPair);
      }

      setPublicKey(keyPair.publicKey);
      setPrivateKey(keyPair.privateKey);
    };

    getOrCreateKeyPair().catch(console.error);
  }, []);

  if (publicKey && privateKey) {
    return { publicKey, privateKey };
  }

  return "loading";
}
