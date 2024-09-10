import { useEffect, useMemo, useRef } from "react";

import { Id } from "@/convex/_generated/dataModel";

import {
  encryptText,
  encryptedDataToString,
  generateKeyPair,
  loadKeyPair,
  saveKeyPair,
} from "@/lib/encryption";

type Recipient = { _id: Id<"users">; publicKey: CryptoKey };

type EncryptResult = { recipient: Recipient; message: string }[];
type EncryptFunction = (
  message: string,
  ...recipients: Recipient[]
) => Promise<EncryptResult>;

export function useEncryption():
  | {
      encrypt: EncryptFunction;
      // decrypt: () => void;
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
        message: string,
        ...recipients: Recipient[]
      ): Promise<EncryptResult> => {
        const keyPair = await loadKeyPair();
        if (!keyPair) throw new Error("Key pair not available");
        const { privateKey } = keyPair;

        const encrypted: EncryptResult = [];

        for (const recipient of recipients) {
          const { encryptedData, iv } = await encryptText(
            privateKey,
            recipient.publicKey,
            message,
          );
          const encryptedMessage = encryptedDataToString(encryptedData, iv);
          encrypted.push({ recipient, message: encryptedMessage });
        }

        return encrypted;
      },
    }),
    [],
  );

  return !isInitialized.current ? "loading" : encryption;
}
