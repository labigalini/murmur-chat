// Generate a new key pair for encryption (ECC - ECDSA)
export async function generateKeyPair() {
  const keyPair = await crypto.subtle.generateKey(
    {
      name: "ECDH", // You can use RSA, ECDSA, or other algorithms based on your requirements
      namedCurve: "P-256", // This curve is standard for ECC
    },
    true, // keys can be extracted (i.e., exported)
    ["deriveKey", "deriveBits"], // usage of keys (derivation for symmetric keys)
  );

  return keyPair;
}

// Save the keys in localStorage
export async function saveKeyPair({
  publicKey,
  privateKey,
}: {
  privateKey: CryptoKey;
  publicKey: CryptoKey;
}) {
  const privateKeyData = await crypto.subtle.exportKey("jwk", privateKey);
  const publicKeyData = await crypto.subtle.exportKey("jwk", publicKey);

  // Store the keys as JSON strings in localStorage
  localStorage.setItem("privateKey", JSON.stringify(privateKeyData));
  localStorage.setItem("publicKey", JSON.stringify(publicKeyData));
}

// Load the keys from localStorage
export async function loadKeyPair() {
  const privateKeyData = localStorage.getItem("privateKey");
  const publicKeyData = localStorage.getItem("publicKey");

  if (privateKeyData && publicKeyData) {
    const privateKey = await crypto.subtle.importKey(
      "jwk",
      JSON.parse(privateKeyData) as unknown as JsonWebKey,
      {
        name: "ECDH",
        namedCurve: "P-256",
      },
      true,
      ["deriveKey", "deriveBits"],
    );

    const publicKey = await crypto.subtle.importKey(
      "jwk",
      JSON.parse(publicKeyData) as unknown as JsonWebKey,
      {
        name: "ECDH",
        namedCurve: "P-256",
      },
      true,
      [],
    );

    return { privateKey, publicKey };
  } else {
    return null;
  }
}
export async function encryptText(
  privateKey: CryptoKey,
  recipientPublicKey: CryptoKey,
  message: string,
) {
  const enc = new TextEncoder();
  const data = enc.encode(message);

  // Derive a shared secret using ECDH
  const sharedSecret = await crypto.subtle.deriveKey(
    {
      name: "ECDH",
      public: recipientPublicKey, // Use recipient's public key
    },
    privateKey, // Use sender's private key
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt"],
  );

  const iv = crypto.getRandomValues(new Uint8Array(12)); // 12-byte random IV
  const encryptedData = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
    },
    sharedSecret,
    data,
  );

  return { encryptedData, iv };
}

export async function decryptText(
  privateKey: CryptoKey,
  senderPublicKey: CryptoKey,
  encryptedData: ArrayBuffer,
  iv: Uint8Array,
) {
  // Derive a shared secret using ECDH
  const sharedSecret = await crypto.subtle.deriveKey(
    {
      name: "ECDH",
      public: senderPublicKey, // Use sender's public key
    },
    privateKey, // Use recipient's private key
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["decrypt"],
  );

  const decryptedData = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv,
    },
    sharedSecret,
    encryptedData,
  );

  const dec = new TextDecoder();
  return dec.decode(decryptedData);
}

// Convert { encryptedData, iv } to a string for database storage
export function encryptedDataToString(
  encryptedData: ArrayBuffer,
  iv: Uint8Array,
): string {
  // Convert ArrayBuffer to a base64 string
  const encryptedDataString = bufferToBase64(encryptedData);
  const ivString = bufferToBase64(iv.buffer);

  // Combine the two in a format that can be stored (e.g., as JSON string)
  return JSON.stringify({
    encryptedData: encryptedDataString,
    iv: ivString,
  });
}

// Parse the string back to { encryptedData, iv }
export function stringToEncryptedData(encryptedString: string): {
  encryptedData: ArrayBuffer;
  iv: Uint8Array;
} {
  // Parse the JSON string
  const { encryptedData, iv } = JSON.parse(encryptedString) as unknown as {
    encryptedData: string;
    iv: string;
  };

  // Convert base64 strings back to ArrayBuffer and Uint8Array
  const encryptedDataBuffer = base64ToBuffer(encryptedData);
  const ivBuffer = new Uint8Array(base64ToBuffer(iv));

  return {
    encryptedData: encryptedDataBuffer,
    iv: ivBuffer,
  };
}

// Helper function to convert ArrayBuffer to base64 string
function bufferToBase64(buffer: ArrayBuffer): string {
  const byteArray = new Uint8Array(buffer);
  let binary = "";
  byteArray.forEach((byte) => (binary += String.fromCharCode(byte)));
  return btoa(binary); // Convert binary string to base64
}

// Helper function to convert base64 string back to ArrayBuffer
function base64ToBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64); // Decode base64 to binary string
  const buffer = new ArrayBuffer(binary.length);
  const byteArray = new Uint8Array(buffer);

  for (let i = 0; i < binary.length; i++) {
    byteArray[i] = binary.charCodeAt(i);
  }

  return buffer;
}
