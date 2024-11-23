import { useRef, useState } from "react";

import { useMutation } from "convex/react";

import {
  Avatar,
  AvatarEditor,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { api } from "@/convex/_generated/api";

import { FileInput } from "../ui/file-input";

interface UserSettingsDialogProps {
  name: string;
  avatar?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserSettingsDialog({
  name,
  avatar,
  open,
  onOpenChange,
}: UserSettingsDialogProps) {
  const [newName, setNewName] = useState(
    name.substring(0, name.lastIndexOf("#")).trim() || name.trim(),
  );
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const patchUser = useMutation(api.users.patch);

  const editorRef = useRef<React.ElementRef<typeof AvatarEditor>>(null);

  const handleSave = async () => {
    if (selectedImage) {
      const canvas = editorRef.current?.getImage();
      const blob = await new Promise<Blob>((resolve) =>
        canvas!.toBlob((blob) => resolve(blob!), "image/jpeg", 0.95),
      );
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": blob!.type },
        body: blob,
      });
      const { storageId } = await result.json();
      setSelectedImage(null);
      await patchUser({ name: newName, image: storageId });
    } else {
      await patchUser({ name: newName });
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4">
          {selectedImage ? (
            <AvatarEditor ref={editorRef} image={selectedImage} />
          ) : (
            <Avatar className="m-3 h-24 w-24">
              <AvatarImage src={avatar} alt={name} />
              <AvatarFallback>{name}</AvatarFallback>
            </Avatar>
          )}
          <FileInput
            className="w-48"
            accept="image/*"
            maxSize={5 * 1024 * 1024} // 5MB
            onFileSelected={setSelectedImage}
          >
            Change Avatar
          </FileInput>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
