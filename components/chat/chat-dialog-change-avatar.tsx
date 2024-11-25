"use client";

import { useCallback, useRef, useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import ChatAvatar from "./chat-avatar";
import { useChatContext } from "./chat-context";

import { AvatarEditor } from "../ui/avatar";
import { FileInput } from "../ui/file-input";

const ChatDialogChangeAvatar = () => {
  const {
    state: { chat },
    onChatAvatarChange,
  } = useChatContext();

  const [isOpen, setIsOpen] = useState(false);

  const [selectedImage, setSelectedImage] = useState<File | undefined>();

  const editorRef = useRef<React.ElementRef<typeof AvatarEditor>>(null);

  const handleSelectImage = useCallback((file: File) => {
    setSelectedImage(file);
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setSelectedImage(undefined);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!chat || chat === "loading") return;
    const image = await editorRef.current?.getImage();
    if (image) {
      onChatAvatarChange(chat, image);
    }
    handleClose();
  }, [handleClose]);

  if (!chat || chat === "loading") return;

  return (
    <>
      <FileInput
        className={buttonVariants({
          variant: "secondary",
          className: "flex w-full",
        })}
        accept="image/*"
        onFileSelected={handleSelectImage}
      >
        Change Chat Avatar
      </FileInput>
      <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Change Chat Avatar</DialogTitle>
          </DialogHeader>
          <div className="my-8 flex flex-col items-center gap-4">
            {selectedImage ? (
              <AvatarEditor ref={editorRef} image={selectedImage} />
            ) : (
              <ChatAvatar
                className="m-3 h-48 w-48"
                name={chat.name}
                avatar={chat.image}
              />
            )}
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={() => void handleSubmit()}>Change Avatar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export { ChatDialogChangeAvatar };
