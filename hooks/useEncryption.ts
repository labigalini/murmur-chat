import { useEffect, useMemo, useState } from "react";

import { useConvexAuth, useMutation } from "convex/react";

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
  // TOO need a better way to decide when create the keys and patch the session
  const { isAuthenticated } = useConvexAuth();
  const [isInitialized, setIsInitialized] = useState(false);
  const patchSession = useMutation(api.auth.patchSession);

  useEffect(() => {
    const createIfNotExists = async () => {
      let loadedKeyPair = await loadKeyPair();
      if (!loadedKeyPair) {
        loadedKeyPair = await generateKeyPair();
        await saveKeyPair(loadedKeyPair.privateKey, loadedKeyPair.publicKey);
      }
      await patchSession({
        publicKey: await exportKey(loadedKeyPair.publicKey),
      }); // TODO need a better way to update session keys after sign in, this is too frequent
      setIsInitialized(true);
    };
    createIfNotExists().catch(console.error);
  }, [isAuthenticated, patchSession]);

  const encryption = useMemo(
    () => ({
      encrypt,
      decrypt,
    }),
    [],
  );

  return isInitialized ? encryption : "loading";
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
