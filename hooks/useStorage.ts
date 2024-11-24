import { useCallback } from "react";

import { useMutation } from "convex/react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export function useStorage() {
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);

  const upload = useCallback(
    async (image: File | Blob): Promise<Id<"_storage">> => {
      try {
        // Get the upload URL
        const postUrl = await generateUploadUrl();

        // Upload the file
        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": image.type },
          body: image,
        });

        if (!result.ok) {
          throw new Error(`Upload failed: ${result.statusText}`);
        }

        const { storageId } = await result.json();
        return storageId;
      } catch (error) {
        console.error("Failed to upload file:", error);
        throw error;
      }
    },
    [],
  );

  return { upload };
}
