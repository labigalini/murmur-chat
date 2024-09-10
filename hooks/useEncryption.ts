import { useEffect, useMemo, useRef } from "react";

import {
  decryptText,
  encryptText,
  encryptedDataToString,
  generateKeyPair,
  loadKeyPair,
  saveKeyPair,
  stringToEncryptedData,
} from "@/lib/encryption";

type EncryptFunction = (
  text: string,
  recipientPublicKey: CryptoKey,
) => Promise<string>;

type DecryptFunction = (
  text: string,
  senderPublicKey: CryptoKey,
) => Promise<string>;

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
      encrypt: async (
        text: string,
        recipientPublicKey: CryptoKey,
      ): Promise<string> => {
        const keyPair = await loadKeyPair();
        if (!keyPair) throw new Error("Key pair not available");
        const { privateKey } = keyPair;

        const { encryptedData, iv } = await encryptText(
          privateKey,
          recipientPublicKey,
          text,
        );

        const encryptedText = encryptedDataToString(encryptedData, iv);

        return encryptedText;
      },
      decrypt: async (
        text: string,
        senderPublicKey: CryptoKey,
      ): Promise<string> => {
        const keyPair = await loadKeyPair();
        if (!keyPair) throw new Error("Key pair not available");
        const { privateKey } = keyPair;

        const { encryptedData, iv } = stringToEncryptedData(text);

        const decryptedText = await decryptText(
          privateKey,
          senderPublicKey,
          encryptedData,
          iv,
        );

        return decryptedText;
      },
    }),
    [],
  );

  return !isInitialized.current ? "loading" : encryption;
}
