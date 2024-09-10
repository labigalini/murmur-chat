const ALGORITHM = {
  name: "RSA-OAEP",
  hash: "SHA-256",
};
const EXTRACTABLE = true;

export async function generateKeyPair() {
  const keyPair = await crypto.subtle.generateKey(
    {
      ...ALGORITHM,
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
    },
    EXTRACTABLE,
    ["encrypt", "decrypt"],
  );

  return keyPair;
}

export async function exportKey(key: CryptoKey) {
  return JSON.stringify(await crypto.subtle.exportKey("jwk", key));
}

export async function saveKeyPair(privateKey: CryptoKey, publicKey: CryptoKey) {
  localStorage.setItem("privateKey", await exportKey(privateKey));
  localStorage.setItem("publicKey", await exportKey(publicKey));
}

export async function importKey(
  key: string,
  keyUsages: ReadonlyArray<KeyUsage>,
) {
  return await crypto.subtle.importKey(
    "jwk",
    JSON.parse(key) as JsonWebKey,
    ALGORITHM,
    EXTRACTABLE,
    keyUsages,
  );
}

export async function loadKeyPair() {
  const privateKeyData = localStorage.getItem("privateKey");
  const publicKeyData = localStorage.getItem("publicKey");

  if (!privateKeyData || !publicKeyData) return null;

  const privateKey = await importKey(privateKeyData, ["decrypt"]);
  const publicKey = await importKey(publicKeyData, ["encrypt"]);

  return { privateKey, publicKey };
}

export async function encryptText(text: string, recipientPublicKey: CryptoKey) {
  const enc = new TextEncoder();
  const data = enc.encode(text);

  const encryptedData = await crypto.subtle.encrypt(
    {
      name: "RSA-OAEP",
    },
    recipientPublicKey,
    data,
  );

  return bufferToBase64(encryptedData);
}

export async function decryptText(
  encryptedText: string,
  privateKey: CryptoKey,
) {
  const encryptedData = base64ToBuffer(encryptedText);

  const decryptedData = await crypto.subtle.decrypt(
    {
      name: "RSA-OAEP",
    },
    privateKey,
    encryptedData,
  );

  const dec = new TextDecoder();
  return dec.decode(decryptedData);
}

function bufferToBase64(buffer: ArrayBuffer): string {
  const byteArray = new Uint8Array(buffer);
  let binary = "";

  for (let i = 0; i < byteArray.length; i++) {
    binary += String.fromCharCode(byteArray[i]);
  }

  return btoa(binary);
}

function base64ToBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const buffer = new ArrayBuffer(binary.length);
  const byteArray = new Uint8Array(buffer);

  for (let i = 0; i < binary.length; i++) {
    byteArray[i] = binary.charCodeAt(i);
  }

  return buffer;
}
