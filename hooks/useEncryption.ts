import { useEffect, useMemo, useRef } from "react";

import { useMutation } from "convex/react";

import { api } from "@/convex/_generated/api";

import {
  decryptText,
  encryptText,
  exportKey,
  generateKeyPair,
  importKey,
  loadKeyPair,
  saveKeyPair,
} from "@/lib/encryption";

import { useAuth } from "./useAuth";

type EncryptFunction = (
  text: string,
  recipientPublicKey: string,
) => Promise<string>;

type DecryptFunction = (text: string) => Promise<string>;

export function useEncryption():
  | {
      encrypt: EncryptFunction;
      decrypt: DecryptFunction;
      // TODO add some sort of erase keys function here to use on sign out
    }
  | "loading" {
  const auth = useAuth(); // TODO need a better way to update session keys after sign in
  const isInitialized = useRef(false);
  const patchSession = useMutation(api.auth.patchSession);

  useEffect(() => {
    const createIfNotExists = async () => {
      const loadedKeyPair = await loadKeyPair();
      if (!loadedKeyPair) {
        const { privateKey, publicKey } = await generateKeyPair();
        await saveKeyPair(privateKey, publicKey);
        await patchSession({ publicKey: await exportKey(publicKey) });
      }
      isInitialized.current = true;
    };
    createIfNotExists().catch(console.error);
  }, [auth, patchSession]);

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
  recipientPublicKey: string,
): Promise<string> {
  const publicKey = await importKey(recipientPublicKey, ["encrypt"]);
  return await encryptText(text, publicKey);
}

async function decrypt(text: string): Promise<string> {
  const { privateKey } = await loadKeyPairX();
  return await decryptText(text, privateKey);
}
