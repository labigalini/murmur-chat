"use client";

import { useTheme } from "next-themes";

import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { FaceIcon } from "../icons";

interface ChatEmojiPickerProps {
  onChange: (value: string) => void;
}

export const ChatEmojiPicker = ({ onChange }: ChatEmojiPickerProps) => {
  const { theme } = useTheme();
  return (
    <Popover>
      <PopoverTrigger>
        <FaceIcon
          size="5"
          className="text-muted-foreground transition hover:text-foreground"
        />
      </PopoverTrigger>
      <PopoverContent className="w-full">
        <Picker
          emojiSize={18}
          theme={theme}
          data={data}
          maxFrequentRows={1}
          onEmojiSelect={(emoji: { native: string }) => onChange(emoji.native)}
        />
      </PopoverContent>
    </Popover>
  );
};
