import { useCallback, useMemo, useRef, useState } from "react";

import { useMutation } from "convex/react";
import { FunctionArgs } from "convex/server";

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

import { useStorage } from "@/hooks/useStorage";

import { FileInput } from "../ui/file-input";

interface UserSettingsDialogProps {
  name: string;
  avatar?: string;
  open: boolean;
  onClose: () => void;
}

export function UserSettingsDialog({
  name,
  avatar,
  open,
  onClose,
}: UserSettingsDialogProps) {
  const initialName = useMemo(
    () => name.substring(0, name.lastIndexOf("#")).trim() || name.trim(),
    [name],
  );
  const [newName, setNewName] = useState<string | undefined>();
  const [selectedImage, setSelectedImage] = useState<File | undefined>();

  const { upload } = useStorage();
  const patchUser = useMutation(api.users.patch);

  const editorRef = useRef<React.ElementRef<typeof AvatarEditor>>(null);

  const handleSave = async () => {
    const patch: FunctionArgs<typeof api.users.patch> = {};

    const image = await editorRef.current?.getImage();
    if (image) patch.image = await upload(image);
    if (newName) patch.name = newName;

    if (!Object.is(patch, {})) {
      await patchUser(patch);
    }
    handleClose();
  };

  const handleClose = useCallback(() => {
    onClose();
    setNewName(undefined);
    setSelectedImage(undefined);
  }, [onClose]);

  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4">
          {selectedImage ? (
            <AvatarEditor ref={editorRef} image={selectedImage} />
          ) : (
            <Avatar className="m-3 h-48 w-48">
              <AvatarImage src={avatar} alt={name} />
              <AvatarFallback>{name}</AvatarFallback>
            </Avatar>
          )}
          <FileInput
            className="w-48"
            accept="image/*"
            onFileSelected={setSelectedImage}
          >
            Change Avatar
          </FileInput>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={newName ?? initialName}
            onChange={(e) => setNewName(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={() => void handleSave()}>Save changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
