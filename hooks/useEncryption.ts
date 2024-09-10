import { useEffect, useMemo, useRef } from "react";

import {
  decryptText,
  encryptText,
  generateKeyPair,
  loadKeyPair,
  saveKeyPair,
} from "@/lib/encryption";

type EncryptFunction = (
  text: string,
  recipientPublicKey: CryptoKey,
) => Promise<string>;

type DecryptFunction = (text: string) => Promise<string>;

export function useEncryption():
  | {
      encrypt: EncryptFunction;
      decrypt: DecryptFunction;
      // TODO add some sort of erase keys function here to use on sign out
    }
  | "loading" {
  const isInitialized = useRef(false);

  useEffect(() => {
    const createIfNotExists = async () => {
      const loadedKeyPair = await loadKeyPair();
      if (!loadedKeyPair) {
        const newKeyPair = await generateKeyPair();
        await saveKeyPair(newKeyPair);
      }
      isInitialized.current = true;
    };
    createIfNotExists().catch(console.error);
  }, []);

  const encryption = useMemo(
    () => ({
      encrypt,
      decrypt,
    }),
    [],
  );

  return !isInitialized.current ? "loading" : encryption;
}

async function loadKeyPairX() {
  const keyPair = await loadKeyPair();
  if (!keyPair) throw new Error("Key pair not available");
  return keyPair;
}

async function encrypt(
  text: string,
  recipientPublicKey: CryptoKey,
): Promise<string> {
  return await encryptText(text, recipientPublicKey);
}

async function decrypt(text: string): Promise<string> {
  const { privateKey } = await loadKeyPairX();
  return await decryptText(text, privateKey);
}
