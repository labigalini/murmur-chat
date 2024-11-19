import { useState } from "react";

import { useMutation } from "convex/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  const [newAvatar, _setNewAvatar] = useState(avatar);
  const patchUser = useMutation(api.users.patch);

  const handleSave = async () => {
    await patchUser({ name: newName });
    onOpenChange(false); // Close dialog after successful update
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={newAvatar} alt={name} />
            <AvatarFallback>{name}</AvatarFallback>
          </Avatar>
          <Button variant="outline" type="button" className="w-full">
            Change avatar
          </Button>
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
