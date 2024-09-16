import React, { useRef, useState } from "react";

import { useChatContext } from "./chat-context";
import { ChatEmojiPicker } from "./chat-emoji-picker";
import { ChatInput } from "./chat-input";

import { PaperPlaneIcon } from "../icons";
import { Button } from "../ui/button";

export default function ChatBottombar() {
  const {
    state: { chat },
    onSendMessage,
  } = useChatContext();

  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };

  const handleSend = () => {
    if (chat === "loading" || !chat || !message.trim()) return;

    onSendMessage(chat, message.trim());
    setMessage("");

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter") return;

    event.preventDefault();

    if (event.shiftKey) {
      setMessage((prev) => prev + "\n");
    } else {
      handleSend();
    }
  };

  return (
    <div className="flex w-full items-center justify-between gap-2 p-4">
      <div key="input" className="relative w-full">
        <ChatInput
          value={message}
          ref={inputRef}
          onKeyDown={handleKeyPress}
          onChange={handleInputChange}
          placeholder="Type a message..."
          className="px-12"
        />
        <div className="absolute bottom-[.6rem] left-4">
          <ChatEmojiPicker
            onChange={(value) => {
              setMessage(message + value);
              if (inputRef.current) {
                inputRef.current.focus();
              }
            }}
          />
        </div>
        <div className="absolute bottom-[.4rem] right-2">
          <Button
            className="h-9 w-9 shrink-0"
            onClick={handleSend}
            variant="ghost"
            size="icon"
            disabled={!message.trim()}
          >
            <PaperPlaneIcon className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>
      </div>
    </div>
  );
}
